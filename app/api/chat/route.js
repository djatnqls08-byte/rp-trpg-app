import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
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
      rulePrompt = `[크툴루의 부름 7판 CoC 진행 수칙]
- 단서 탐색, 은밀 행동 시 다이스 판정을 유도하십시오.
- 🚨 **이성(SAN) 차감 완급 조절 (절대 규칙)**:
  1. 기괴한 냄새, 안개, 기이한 소리, 흉가 분위기 등 일상적 공포: 산치 감소는 **성공 0 / 실패 1점(최대 2점)**만 차감하십시오!
  2. 한 번에 5점 이상 깎는 것은 신화 생물(신격체)과 직접 대면했을 때만 극히 예외적으로 적용하십시오. 함부로 5점씩 깎지 마십시오.
  3. 플레이어가 산 체크를 굴린 직후에는 결과를 묘사하고 산치를 1~2점 깎은 뒤 다음 사건을 전개하십시오. 곧바로 또 산 체크를 요구하지 마십시오.
  4. 조사원이 이미 광기 상태라면 추가 이성 체크를 일절 요구하지 말고, 파트너의 반응과 상황 수습에 집중하십시오.`;
    } else if (ruleMode === "insane") {
      rulePrompt = `[멀티 호러 TRPG 인세인]
- 씬을 진행하며 공포 판정과 비밀(Secret) 탐색을 유도하십시오.
- 광기 카드가 발현 중인 플레이어에게 연쇄적으로 공포 판정을 난사하지 마십시오.`;
    } else if (ruleMode === "unsung") {
      rulePrompt = `[언성 듀엣]
- 이계 '시프터' 탈출을 위한 2인 서사입니다. 위기 상황 시 이계 침식도 상승과 신체 변이를 묘사하십시오.`;
    } else {
      rulePrompt = `[자유 서사 모드]
- 1D20 판정과 유연한 상호작용을 기반으로 서사를 전개하십시오.`;
    }

    const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.
${rulePrompt}
플레이어 성향: [${playPreference || "자유 서사"}]
시나리오 배경: [${scenarioText || "미상"}]
캐릭터 상태: 이름(${playerSheet?.name}), 직업(${playerSheet?.job}), 체력(${playerSheet?.hp}), 이성(${playerSheet?.san}), 광기(${playerSheet?.madnessStatus || "정상"})

[🚨 키퍼 진행 절대 엄벌 수칙]
1. **임의 완결 및 시간 건너뛰기 절대 금지**:
   - "[시간이 얼마나 흘렀을까]", "다음 날 아침" 같은 임의 시간 스킵 금지. 현재 순간의 1분 뒤를 긴장감 있게 묘사하십시오.
   - 시나리오의 진실이 다 밝혀지기 전까지 멋대로 이야기를 끝내지 마십시오.
2. **조사 구역 태그 (SPOTS)**:
   <!-- SPOTS: [{"name": "오브젝트명", "stat": "관찰력"}] -->
3. **수치 증감 태그 (STATUS)**:
   <!-- STATUS: {"san": 49, "hp": 10} -->
4. **행동 제안 태그 (SUGGESTIONS)**:
   <!-- SUGGESTIONS: ["선택지 1", "선택지 2"] -->`;

    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "룰북의 완급 조절 수칙을 철저히 준수하여 무분별한 산치 폭탄과 중복 체크를 방지하겠습니다." }] }
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
        console.warn(`[API Fallback] ${modelName} 호출 실패 (${err.message}). 예비 모델 전환.`);
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
