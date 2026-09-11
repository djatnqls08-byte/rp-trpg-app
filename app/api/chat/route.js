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
- 단서 탐색, 은밀 행동 시 다이스 판정(CHECK)을 1회만 정중히 요구하십시오.
- 🚨 **이성(SAN) 차감 완급 조절**:
  1. 기괴한 냄새, 안개, 분위기 등 경미한 조우: 산치 감소는 **성공 0 / 실패 1점(최대 2점)**으로 엄격히 제한하십시오.
  2. 한 번에 5점 이상 깎는 것은 신격체/거대 괴물과 직접 조우했을 때만 극히 예외적으로 적용하십시오.
  3. 조사원이 광기 발작 중이라면 추가 이성 체크를 일절 요구하지 말고, 파트너 NPC의 반응과 상황 수습에 집중하십시오.`;
    } else if (ruleMode === "insane") {
      rulePrompt = `[멀티 호러 TRPG 인세인]
- 씬(Scene)을 진행하며 공포 판정과 비밀(Secret) 탐색을 유도하십시오.
- 광기 카드가 발현 중인 플레이어에게 연쇄적으로 공포 판정을 난사하지 마십시오.
- 비밀이 밝혀질 때만 <!-- REVEAL_SECRET: {"name": "인물명", "secret": "비밀"} --> 형식으로 출력하십시오.`;
    } else if (ruleMode === "unsung") {
      rulePrompt = `[언성 듀엣]
- 이계 '시프터' 탈출을 위한 2인 서사입니다. 판정 실패 시 이계 침식도 상승과 신체 변이 징후를 부각하십시오.`;
    } else {
      rulePrompt = `[자유 서사 모드]
- 1D20 판정과 유연한 상호작용을 기반으로 서사를 전개하십시오.`;
    }

    const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.
${rulePrompt}
플레이어 성향: [${playPreference || "자유 서사"}]
시나리오 본문 및 배후 진상/기믹/엔딩 분기:
${scenarioText || "미상의 시나리오"}

캐릭터 상태: 이름(${playerSheet?.name}), 성별(${playerSheet?.gender || "미상"}), 직업(${playerSheet?.job}), 체력(${playerSheet?.hp}), 이성(${playerSheet?.san}), 광기(${playerSheet?.madnessStatus || "정상"})

[🚨 서술 문체, 턴제 중단, 진행 절대 수칙 - 위반 절대 금지]
1. **서술 문체 일관성 (단일 경어체 100% 고정)**:
   - 마스터의 모든 지문 서술, 배경 묘사, 상황 설명의 종결 어미는 **반드시 정중하고 격조 높은 TRPG 키퍼의 경어체('~합니다', '~했습니다', '~였습니다', '~입니까?')로 100% 일관되게 고정하십시오.**
   - 문장마다 '~했다', '~였다' 평어체와 섞어 쓰는 행위를 엄격히 금지합니다. (단, NPC의 대사 따옴표 안에서만 인물의 성격에 맞는 반말/존댓말 허용)
2. **판정 결과 묘사 턴에는 새로운 CHECK 태그 출력 금지 (중복 판정 차단)**:
   - 방금 플레이어가 주사위 판정 결과(예: 보통 성공, 실패, 대성공 등)를 보내왔다면, 키퍼는 **그 성공/실패에 따른 결과를 상세히 묘사하는 턴**입니다.
   - 따라서 플레이어의 판정 결과를 서술하는 턴에는 **새로운 <!-- CHECK: ... --> 태그를 절대로 다시 출력하지 마십시오!** 판정 결과 서술 후 플레이어에게 어떻게 행동할지 턴을 넘기십시오.
3. **판정 선언 시 즉각 발화 중단 (HALT)**:
   - 새로운 행동에 대해 판정을 요구할 경우, 판정 요구 문장과 <!-- CHECK: ... --> 태그를 출력한 뒤 **그 즉시 서술을 중단(STOP)하십시오.** 결과를 미리 상상해서 적지 마십시오.
4. **1턴 1판정 원칙**:
   - 한 번의 답변에서 관찰력 판정과 산 체크를 동시에 요구하는 다중 판정 행위를 엄격히 금지합니다.
5. **임의 시간 건너뛰기(Time-skip) 및 조기 완결 금지**:
   - "[시간이 얼마나 흘렀을까]", "다음 날 아침" 같은 임의 시간 스킵 금지.
6. **태그 출력 규격**:
   <!-- SPOTS: [{"name": "오브젝트명", "stat": "필요기능"}] -->
   <!-- CHECK: {"skill": "판정명", "target": 목표치, "reason": "이유"} -->
   <!-- STATUS: {"san": 49, "hp": 10} -->
   <!-- SUGGESTIONS: ["선택지 1", "선택지 2"] -->`;

    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "경어체(~합니다/였습니다)로 일관되게 서술하며, 판정을 요구한 순간 서술을 멈추고 결과를 기다리겠습니다. 판정 결과 서술 턴에는 새로운 판정을 연달아 요구하지 않겠습니다." }] }
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
        console.warn(`[API Fallback] ${modelName} 호출 실패 (${err.message}). 다음 예비 모델 전환.`);
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
