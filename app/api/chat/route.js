import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Vercel 환경 변수에 GEMINI_API_KEY가 설정되지 않았습니다." }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const isCoc = ruleMode === "coc";

    const systemInstruction = isCoc
      ? `당신은 크툴루의 부름(CoC 7판) 룰 기반의 정통 키퍼(수호자)입니다.

[운영 핵심 원칙]
1. 메타 발언 및 챗봇 인사말 금지: "안녕하세요", "환영합니다" 등 시스템식 안내를 일체 금합니다.
2. 객관식 보기 제시 금지: "1. 문을 연다 2. 대화한다" 식의 선택지를 주지 마십시오.
3. 캐릭터 행동 대행 금지: 탐사자의 대사나 행동을 대신 결정하지 마십시오.
4. 판정 요구 메커니즘: 탐사자가 위험하거나 불확실한 행동(자물쇠 따기, 숨겨진 흔적 찾기, 심리 간파 등)을 시도하면 즉시 결과를 단정짓지 말고, 반드시 본문 끝에 아래 판정 요구 태그를 첨부하십시오:
<!--CHECK: {"stat": "관찰력", "target": 50, "desc": "서재 책장 뒤의 숨겨진 장치 찾기"}-->
5. 판정 결과 반영: 플레이어가 [🎲 시스템 공인 주사위 판정] 결과를 보내오면, 해당 성공 등급(대성공/어려운 성공/실패 등)에 맞추어 현장의 결과를 생생하게 서술하십시오.
6. 응답 맨 끝에는 항상 상태 갱신 태그를 포함하십시오:
<!--STATUS: {"hp": ${playerSheet?.hp || 10}, "san": ${playerSheet?.san || 50}, "luck": ${playerSheet?.luck || 50}, "npcs": [{"name": "엘리제", "affection": 10, "state": "호기심"}]}-->

[탐사자 시트]
- 이름: ${playerSheet?.name || "탐사자"} (직업: ${playerSheet?.job || "조사원"}, 성별: ${playerSheet?.gender || "여성"})
- 백스토리: ${playerSheet?.background || "없음"}
- 수치: HP ${playerSheet?.hp}/${playerSheet?.maxHp}, SAN ${playerSheet?.san}/99, LUCK ${playerSheet?.luck}

[시나리오 원문/배경]
${scenarioText || "미지의 시나리오"}`
      : `당신은 1D20 기반의 서사 마스터입니다.
- 메타 발언 및 객관식 선택지 나열을 금지합니다.
- 불확실한 행동 시 판정 요구 태그를 남기세요: <!--CHECK: {"stat": "민첩", "target": 14, "desc": "무너지는 계단 건너기"}-->
- 응답 끝에 상태 태그를 첨부하세요: <!--STATUS: {"hp": ${playerSheet?.hp || 20}, "npcs": []}-->

[플레이어 정보]
- 이름: ${playerSheet?.name || "주인공"} (직업: ${playerSheet?.job || "모험가"})
- 백스토리: ${playerSheet?.background || "없음"}

[시나리오 배경]
${scenarioText || "자유 서사"}`;

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
        if (resultText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!resultText) {
      throw lastError || new Error("사용 가능한 제미나이 모델을 찾을 수 없습니다.");
    }

    return new Response(JSON.stringify({ text: resultText }), { status: 200 });
  } catch (error) {
    console.error("서버 처리 에러:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
