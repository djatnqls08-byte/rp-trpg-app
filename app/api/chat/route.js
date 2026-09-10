import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode, playPreference } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Vercel 환경 변수에 GEMINI_API_KEY가 설정되지 않았습니다." }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const isCoc = ruleMode === "coc";

    const preferenceInstruction = playPreference
      ? `[플레이어 서사 톤 & 관계성 지침 - 절대 준수]
- 플레이어 요구 성향: "${playPreference}"
- 위 지침에 명시된 관계성(GL/BL/HL/논로맨스 등)과 감정선(애증, 구원, 집착 등)을 인물 간의 시선 처리와 대사에 깊이 있게 반영하십시오.
- 플레이어가 원치 않거나 지침과 충돌하는 불필요한 이성/동성 로맨스 구도는 철저히 배제하십시오.`
      : `[플레이어 서사 톤]
- 인물들 간의 미묘한 심리 기류, 시선 처리, 유대감을 섬세하게 서술하십시오.`;

    const commonRules = `[핵심 운영 원칙]
1. 메타 발언 및 챗봇 인사말 금지: "안녕하세요", "환영합니다" 등 시스템식 멘트를 일체 배제하십시오.
2. 본문 객관식 보기 제시 금지: 본문 소설 지문 안에는 "1. 문을 연다 2. 대화한다" 식의 선택지를 절대 쓰지 마십시오. 오직 현장 서술만 하십시오.
3. 캐릭터 행동 대행 금지: 플레이어 캐릭터의 대사나 심리를 대신 단정짓지 마십시오.
4. 소지품 관리: 현장에서 중요한 물건을 얻거나 잃으면 상태 태그의 "items" 목록을 갱신하십시오.
5. 주사위 판정 제안: 플레이어가 위험하거나 불확실한 행동을 하면 본문 끝에 반드시 판정 요구 태그를 남기십시오.
6. 응답 맨 끝 태그 필수 첨부 (아래 2개 태그를 반드시 맨 끝에 첨부):
- 상태 태그: <!--STATUS: {...}-->
- 행동 제안 태그: 현재 상황에서 플레이어가 취할 수 있는 매력적이고 구체적인 선택지 3가지를 반드시 아래 형식으로 첨부하십시오. (본문 지문에는 쓰지 말고 오직 이 주석 태그 안에만 넣으십시오):
<!--SUGGESTIONS: ["상황을 타개할 구체적 행동 지문", "동행 인물과의 대화나 질문", "위험을 감수하는 과감한 행동이나 탐색"]-->`;

    const systemInstruction = isCoc
      ? `당신은 크툴루의 부름(CoC 7판) 룰 기반의 정통 키퍼(수호자)입니다.

${preferenceInstruction}
${commonRules}

- 판정 요구 태그 형식: <!--CHECK: {"stat": "관찰력", "target": 50, "desc": "서재 책장 뒤의 숨겨진 장치 찾기"}-->
- 상태 태그 형식: <!--STATUS: {"hp": ${playerSheet?.hp || 10}, "san": ${playerSheet?.san || 50}, "luck": ${playerSheet?.luck || 50}, "npcs": [{"name": "엘리제", "affection": 10, "state": "호기심"}], "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[탐사자 시트]
- 이름: ${playerSheet?.name || "탐사자"} (직업: ${playerSheet?.job || "조사원"}, 성별: ${playerSheet?.gender || "여성"})
- 백스토리: ${playerSheet?.background || "없음"}
- 수치: HP ${playerSheet?.hp}/${playerSheet?.maxHp}, SAN ${playerSheet?.san}/99, LUCK ${playerSheet?.luck}
- 현재 소지품: ${JSON.stringify(playerSheet?.items || [])}

[시나리오 배경]
${scenarioText || "미지의 시나리오"}`
      : `당신은 발더스 게이트 스타일의 깊이 있는 1D20 자유 서사 마스터입니다.

${preferenceInstruction}
${commonRules}

- 판정 요구 태그 형식: <!--CHECK: {"stat": "민첩", "target": 14, "desc": "무너지는 계단 건너기"}-->
- 상태 태그 형식: <!--STATUS: {"hp": ${playerSheet?.hp || 20}, "npcs": [], "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[플레이어 캐릭터 정보]
- 이름: ${playerSheet?.name || "주인공"} (직업: ${playerSheet?.job || "모험가"})
- 백스토리: ${playerSheet?.background || "없음"}
- HP: ${playerSheet?.hp || 20}/${playerSheet?.maxHp || 20}
- 현재 소지품: ${JSON.stringify(playerSheet?.items || [])}

[시나리오/세계관]
${scenarioText || "자유 서사 세계관"}`;

    let historyMessages = messages.slice(0, -1);
    if (historyMessages.length > 0 && historyMessages[0].role === "model") {
      historyMessages = historyMessages.slice(1);
    }

    const history = historyMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1].text;

    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-3-flash-preview",
    ];

    let resultText = null;
    let usageData = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        resultText = result.response.text();
        usageData = result.response.usageMetadata || null;
        if (resultText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!resultText) {
      throw lastError || new Error("사용 가능한 모델을 찾을 수 없습니다.");
    }

    return new Response(JSON.stringify({ text: resultText, usage: usageData }), { status: 200 });
  } catch (error) {
    console.error("서버 에러:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
