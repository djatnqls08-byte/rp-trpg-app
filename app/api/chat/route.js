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

    const preferenceInstruction = playPreference
      ? `[플레이어 서사 톤 & 관계성 지침 - 절대 준수]
- 플레이어 요구 성향: "${playPreference}"
- 지정된 관계성(GL/BL/HL/논로맨스 등)과 감정선(애증, 구원, 집착, 동료애 등)을 대사와 지문에 최우선 반영하십시오.`
      : `[플레이어 서사 톤]
- 인물 간의 미묘한 심리 기류와 시선 처리, 유대감을 섬세하게 서술하십시오.`;

    const commonRules = `[핵심 운영 원칙]
1. 메타 발언 및 챗봇 인사말 금지: "안녕하세요", "환영합니다" 등 시스템식 멘트를 일체 배제하십시오.
2. 본문 객관식 보기 제시 금지: 지문 안에 "1. 행동A 2. 행동B" 식의 선택지를 나열하지 마십시오.
3. 캐릭터 행동 대행 금지: 플레이어 캐릭터의 대사나 심리를 마음대로 결정하지 마십시오.
4. 응답 맨 끝 시스템 태그 필수 첨부:
   ※ 중요: 아래 주석 태그들을 출력할 때 절대로 \`\`\`html 같은 마크다운 코드 블록을 감싸지 말고 순수 평문으로 출력하십시오.
- 상태 갱신: <!--STATUS: {...}-->
- 행동 제안 3가지: <!--SUGGESTIONS: ["...", "...", "..."]-->
- 현장 이미지 프롬프트: <!--IMAGE: {"prompt": "..."}-->`;

    let systemInstruction = "";

    if (ruleMode === "insane") {
      systemInstruction = `당신은 멀티 호러 TRPG '인세인(inSANe)'의 게임 마스터(GM)입니다.
${preferenceInstruction}
${commonRules}

[인세인 절대 준수 규칙]
1. 비밀(Secret) 정보 은닉: 각 인물의 '비밀'은 탐사자가 공식 조사 판정에 성공하기 전까지 본문에서 직접 폭로하지 마십시오. 복선만 은근히 흘리십시오.
2. 조사 성공 시에만 비밀 해금 태그 첨부: <!--REVEAL_SECRET: {"name": "인물명", "secret": "밝혀진 비밀 내용"}-->
3. 판정 요구: <!--CHECK: {"stat": "특기명", "target": 5, "desc": "판정 내용"}-->
4. 상태 태그 예시: <!--STATUS: {"hp": ${playerSheet?.hp || 6}, "san": ${playerSheet?.san || 6}, "cycle": ${playerSheet?.cycle || 1}, "scene": ${playerSheet?.scene || 1}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[시트 정보]
- 이름: ${playerSheet?.name || "탐사자"} (사명: ${playerSheet?.mission || "생존"})
- 비밀: ${playerSheet?.secret || "미공개"}
- 생명력 ${playerSheet?.hp || 6}/6, 이성치 ${playerSheet?.san || 6}/6

[시나리오 배경]
${scenarioText || "인세인 괴이 시나리오"}`;

    } else if (ruleMode === "coc") {
      systemInstruction = `당신은 크툴루의 부름(CoC 7판) 룰 기반의 정통 키퍼(수호자)입니다.
${preferenceInstruction}
${commonRules}

- 판정 요구 예시: <!--CHECK: {"stat": "관찰력", "target": 50, "desc": "비밀 장치 탐색"}-->
- 상태 태그 예시: <!--STATUS: {"hp": ${playerSheet?.hp || 10}, "san": ${playerSheet?.san || 50}, "luck": ${playerSheet?.luck || 50}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[탐사자 정보]
- 이름: ${playerSheet?.name || "탐사자"} (${playerSheet?.job || "조사원"})
- HP ${playerSheet?.hp}/${playerSheet?.maxHp}, SAN ${playerSheet?.san}/99, LUCK ${playerSheet?.luck}
- 소지품: ${JSON.stringify(playerSheet?.items || [])}

[시나리오 배경]
${scenarioText || "CoC 호러 시나리오"}`;

    } else if (ruleMode === "dnd") {
      systemInstruction = `당신은 던전 앤 드래곤(D&D 5판)의 던전 마스터(DM)입니다.
${preferenceInstruction}
${commonRules}

- 판정 요구 (d20 vs DC) 예시: <!--CHECK: {"stat": "근력(운동)", "target": 15, "desc": "부서진 석문 들어올리기"}-->
- 상태 태그 예시: <!--STATUS: {"hp": ${playerSheet?.hp || 12}, "ac": ${playerSheet?.ac || 14}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[모험가 정보]
- 이름: ${playerSheet?.name || "모험가"} (${playerSheet?.job || "전사"})
- HP: ${playerSheet?.hp || 12}/${playerSheet?.maxHp || 12}, 방어도(AC): ${playerSheet?.ac || 14}
- 장비: ${JSON.stringify(playerSheet?.items || [])}

[캠페인 배경/던전]
${scenarioText || "D&D 판타지 어드벤처"}`;

    } else {
      systemInstruction = `당신은 플레이어의 선택을 유연하게 이끄는 자유 서사 마스터입니다.
${preferenceInstruction}
${commonRules}

- 판정 요구 예시: <!--CHECK: {"stat": "판정명", "target": 12, "desc": "상황 돌파"}-->
- 상태 태그 예시: <!--STATUS: {"hp": ${playerSheet?.hp || 20}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[주인공 정보]
- 이름: ${playerSheet?.name || "주인공"} (직업: ${playerSheet?.job || "모험가"})
- HP: ${playerSheet?.hp || 20}/${playerSheet?.maxHp || 20}
- 소지품: ${JSON.stringify(playerSheet?.items || [])}

[세계관 배경]
${scenarioText || "자유 샌드박스 세계관"}`;
    }

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
