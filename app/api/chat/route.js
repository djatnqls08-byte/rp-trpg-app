import { GoogleGenerativeAI } from "@google/generative-ai";

// 1순위 소진 시 순서대로 자동 우회할 모델 체인 (총 1,020+ 회/일)
const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite", // 1순위: 일 500회 초고속 경량 모델
  "gemini-3.5-flash-lite", // 2순위: 일 500회 예비 경량 모델
  "gemini-2.5-flash",      // 3순위: 일 20회 표준 모델
];

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode, playPreference } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 등록되지 않았습니다." }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 4대 정규 룰별 키퍼 수칙
    let rulePrompt = "";
    if (ruleMode === "coc") {
      rulePrompt = `[크툴루의 부름 7판]
- 단서 탐색, 은밀 행동 시 다이스 판정(CHECK)을 요구하세요.
- 끔찍한 진실, 시체, 신화생물 조우 시 이성(SAN) 체크를 지시하세요.
- SAN이 5점 이상 급감하거나 플레이어 시트에 광기 상태가 발현되어 있다면 파트너 NPC가 당황해 부축하거나 상황이 극적으로 혼란해지는 모습을 생생하게 묘사하세요.`;
    } else if (ruleMode === "insane") {
      rulePrompt = `[멀티 호러 TRPG 인세인]
- 씬(Scene)을 진행하며 공포 판정과 비밀(Secret) 탐색을 유도하세요.
- 공포 판정 실패나 이성치 손실로 광기 카드가 발현되면 의심과 망상에 사로잡힌 플레이어의 심리를 자극하세요.
- 다른 등장인물의 비밀이 밝혀질 때는 <!-- REVEAL_SECRET: {"name": "인물명", "secret": "비밀내용"} --> 형식으로 출력하세요.`;
    } else if (ruleMode === "unsung") {
      rulePrompt = `[언성 듀엣]
- 이계 '시프터' 탈출을 위한 2인 서사입니다.
- 위기 상황에서 판정 실패 시 이계 침식도(Erosion) 상승과 신체적 변이 징후를 부각하세요.`;
    } else {
      rulePrompt = `[자유 서사 모드]
- 1D20 판정과 유연한 상호작용을 기반으로 서사를 전개하세요.`;
    }

    const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.
${rulePrompt}
플레이어 성향: [${playPreference || "자유 서사"}]
시나리오 배경: [${scenarioText || "미상"}]
캐릭터 상태: 이름(${playerSheet?.name}), 직업(${playerSheet?.job}), 체력(${playerSheet?.hp}), 이성(${playerSheet?.san}), 광기(${playerSheet?.madnessStatus || "정상"})

[키퍼 진행 절대 원칙]
1. **장면 묘사와 탐색 구역 제시 (필수)**:
   - 새로운 방이나 장면이 열릴 때마다 플레이어가 단서를 조사할 수 있는 구역 2~3곳을 본문 끝에 반드시 태그로 추출하십시오.
   <!-- SPOTS: [{"name": "오브젝트명", "stat": "필요기능"}] -->
   예시: <!-- SPOTS: [{"name": "피 묻은 양피지 책", "stat": "관찰력"}] -->

2. **적극적인 판정 유도 (CHECK)**:
   - 플레이어가 문을 열거나 고서를 해독하는 등 위기/수색 행동을 취하면 결과를 임의로 확정하지 말고 판정을 요구하십시오.
   <!-- CHECK: {"skill": "관찰력", "target": 60, "reason": "숨겨진 일기장 수색"} -->

3. **수치 증감 (STATUS)**:
   - 체력(HP)이나 이성(SAN)에 변동이 생기면 반영된 최종 수치를 출력하세요.
   <!-- STATUS: {"san": 45, "hp": 8} -->

4. **행동 제안 (SUGGESTIONS)**:
   - 턴을 넘길 때 플레이어가 선택할 만한 흥미로운 행동 2가지를 제안하세요.
   <!-- SUGGESTIONS: ["선택지 1", "선택지 2"] -->`;

    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "TRPG 마스터로서 정규 룰과 광기 수칙을 완벽하게 이끌겠습니다." }] }
    ];

    for (const m of messages || []) {
      const role = m.role === "user" ? "user" : "model";
      const text = (m.text || "").trim();
      if (!text) continue;

      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
        formattedContents[formattedContents.length - 1].parts[0].text += "\n\n" + text;
      } else {
        formattedContents.push({ role, parts: [{ text }] });
      }
    }

    // 모델 자동 우회(Fallback) 호출 루프
    let responseText = null;
    let lastError = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({ contents: formattedContents });
        responseText = result.response.text();

        if (responseText) {
          break; // 정상 응답 수신 시 루프 탈출
        }
      } catch (err) {
        console.warn(`[API Fallback] ${modelName} 요청 실패 (${err.message}). 다음 예비 모델로 자동 전환합니다.`);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("모든 예비 모델의 한도가 초과되었거나 호출에 실패했습니다.");
    }

    return new Response(JSON.stringify({ text: responseText }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Route Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
