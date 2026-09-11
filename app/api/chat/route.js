import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite", // 1순위
  "gemini-3.1-flash-lite", // 2순위
  "gemini-3.5-flash",      // 3순위
  "gemini-2.5-flash",      // 4순위
];

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode, playPreference } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 등록되지 않았습니다." }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    let rulePrompt = "";
    if (ruleMode === "coc") {
      rulePrompt = `[크툴루의 부름 7판]
- 단서 탐색, 은밀 행동 시 다이스 판정(CHECK)을 요구하세요.
- 끔찍한 진실, 시체, 초자연적 현상 조우 시 이성(SAN) 체크를 지시하세요.
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
시나리오 배경 및 원문: [${scenarioText || "미상"}]
캐릭터 상태: 이름(${playerSheet?.name}), 직업(${playerSheet?.job}), 체력(${playerSheet?.hp}), 이성(${playerSheet?.san}), 광기(${playerSheet?.madnessStatus || "정상"})

[🚨 키퍼 진행 절대 엄벌 수칙 - 위반 절대 금지]
1. **임의 완결 및 급발진 결말 절대 금지**:
   - 시나리오의 모든 사건, 단서, 비밀이 해결되기 전에는 **절대로 이야기를 끝내지 마십시오.**
   - "완벽한 결말을 맞이했습니다", "행복하게 살았습니다", "이야기는 막을 내립니다" 같은 결말형 문장을 작성하는 순간 룰 위반입니다.
2. **임의 시간 스킵(Time-skip) 금지**:
   - 플레이어의 명시적인 지시 없이 "[시간이 얼마나 흘렀을까]", "다음 날 아침이 밝았습니다"라며 장면을 건너뛰지 마십시오.
   - 항상 현재 씬의 '바로 다음 1분'에 일어나는 일과 위기를 호흡감 있게 묘사하십시오.
3. **조사 구역 및 판정 연계**:
   - 현재 공간에 남아있는 미지의 단서나 위험 구역 2~3곳을 본문 끝에 반드시 태그로 추출하십시오.
   <!-- SPOTS: [{"name": "오브젝트명", "stat": "관찰력"}] -->
4. **수치 증감 (STATUS)**:
   <!-- STATUS: {"san": 45, "hp": 8} -->
5. **행동 제안 (SUGGESTIONS)**:
   <!-- SUGGESTIONS: ["선택지 1", "선택지 2"] -->`;

    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "시나리오를 절대 임의로 완결짓거나 시간을 건너뛰지 않고, 현장감을 살려 철저히 턴제 롤플레잉으로 진행하겠습니다." }] }
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

    let responseText = null;
    let lastError = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({ contents: formattedContents });
        responseText = result.response.text();

        if (responseText) {
          break;
        }
      } catch (err) {
        console.warn(`[API Fallback] ${modelName} 호출 실패 (${err.message}). 다음 예비 모델로 전환합니다.`);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("모든 예비 모델의 한도가 초과되었습니다.");
    }

    return new Response(JSON.stringify({ text: responseText }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Route Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
