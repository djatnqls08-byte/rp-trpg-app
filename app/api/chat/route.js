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

    // 플레이어가 방금 주사위를 굴렸는지 확인 (연속 판정 요구 방지용)
    const lastUserMessage = [...(messages || [])].reverse().find(m => m.role === "user")?.text || "";
    const isJustRolled = lastUserMessage.includes("[🎲");

    // 시트에서 현재 상태값 추출 (인세인, 언성듀엣 턴 갱신용)
    const currentCycle = playerSheet?.cycle || 1;
    const currentScene = playerSheet?.scene || 1;
    const currentErosion = playerSheet?.erosion || 1;

    // ====================================================================
    // 1. 룰별 특화 시스템 프롬프트 구성
    // ====================================================================
    let rulePrompt = "";
    if (ruleMode === "coc") {
      rulePrompt = `[🐙 크툴루의 부름 7판 CoC 진행 수칙]
- 1D100 판정 시스템을 엄격히 적용하십시오. (결과: 1 대성공, 목표치 1/5 극단적 성공, 목표치 1/2 어려운 성공, 목표치 이하 보통 성공, 실패, 96~100 대실패)
- 단서 탐색, 은밀 행동 시 다이스 판정(CHECK)을 1회만 정중히 요구하십시오.
- 🚨 이성(SAN) 차감 완급 조절:
  1. 기괴한 현상이나 냄새 등 경미한 조우는 이성 감소를 [성공 0 / 실패 1점]으로 엄격히 제한하십시오.
  2. 신화생물이나 극심한 충격과 조우할 때만 큰 폭의 이성 판정을 요구하십시오.
  3. 이성 감소 시 반드시 <!-- STATUS: {"san": 차감_후_수치} --> 태그를 출력하십시오.
  4. 조사원이 이미 광기 발작 중이라면 추가 이성 체크를 요구하지 말고 파트너 NPC와의 상황 수습 서사에 집중하십시오.`;
    } else if (ruleMode === "insane") {
      rulePrompt = `[🔥 멀티 호러 TRPG 인세인 (inSANe) 진행 수칙]
- 방탈출식 자유 조사가 아닙니다! 엄격한 '사이클'과 '씬(Scene)' 단위로 진행하십시오.
- 🚨 1씬 1행동 원칙: 플레이어는 하나의 씬에서 [비밀 조사], [감정 판정], [회복 판정] 중 단 하나만 수행할 수 있습니다.
- 🚨 씬 종료 및 갱신: 행동 묘사가 끝나면 턴을 반드시 종료하고, 본문 끝에 <!-- STATUS: {"cycle": ${currentScene >= 2 ? currentCycle + 1 : currentCycle}, "scene": ${currentScene >= 2 ? 1 : currentScene + 1}} --> 태그를 출력하여 씬을 넘기십시오.
- 🚨 비밀(Secret) 폭로: 플레이어가 비밀 조사 판정에 성공하면, 겉보기와 다른 충격적인 뒷면의 진실을 서술하고 반드시 <!-- REVEAL_SECRET: {"name": "대상명", "secret": "숨겨진 진실 내용"} --> 태그를 출력하십시오.
- 광기 카드가 발현 중인 플레이어에게 연쇄적으로 공포 판정을 난사하지 마십시오.`;
    } else if (ruleMode === "unsung") {
      rulePrompt = `[🦋 언성 듀엣 (Unsung Duet) 진행 수칙]
- 초현실적인 이계 '시프터'에 갇힌 바인더와 셰이터의 2D6 탈출 서사입니다.
- 중력 역전, 사물의 의인화 등 시프터 특유의 기괴하고 매혹적인 환경을 묘사하고, 파트너(NPC)와의 유대감만이 유일한 이정표임을 부각하십시오.
- 🚨 침식도(Erosion) 및 변이(Mutation): 판정에 실패하거나 위협에 노출될 때마다 이계 침식도를 올리십시오.
- 침식도 상승 시 <!-- STATUS: {"erosion": ${currentErosion + 1}} --> 태그를 출력하고, 캐릭터의 신체 일부가 기괴하고 아름답게 변이하는 현상(예: 피부가 비늘로 덮임, 눈동자가 보석으로 변함 등)을 반드시 묘사하십시오.`;
    } else {
      rulePrompt = `[🎲 자유 서사 모드]
- 1D20 판정과 유연한 상호작용을 기반으로 샌드박스형 서사를 전개하십시오.`;
    }

    // ====================================================================
    // 2. 통합 시스템 지침 (마스터링 절대 수칙)
    // ====================================================================
    const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다. 게임 시작이 선언되었으므로 완벽한 마스터 및 작가의 인격으로 동작하십시오.

${rulePrompt}

캐릭터 상태: 이름(${playerSheet?.name}), 성별(${playerSheet?.gender || "미상"}), 직업(${playerSheet?.job}), 체력(${playerSheet?.hp}), 이성(${playerSheet?.san}), 광기(${playerSheet?.madnessStatus || "정상"})
시나리오 본문 및 배후 진상/기믹/엔딩 분기:
${scenarioText || "미상의 시나리오"}

[🚨 세계관 및 관계성 절대 수칙 - 위반 금지]
1. 서사 및 관계성 지향 최우선 반영: 플레이어가 선택한 지향 태그([${playPreference || "자유 서사"}])를 가장 최우선으로 참조하십시오. 해당 태그(예: GL, BL, HL, 논로맨스 등)에 따라 인물들의 성별, 커플링, 그리고 서사적 분위기가 결정됩니다.
2. 독립적 NPC: 호감도가 높더라도 NPC는 PC를 숭배하거나 맹목적으로 추종하지 않습니다. 각자의 신념을 지키며, PC의 잘못된 선택에는 따끔하게 충고하거나 냉소적으로 반응할 수 있는 입체적 인격체입니다.
3. 관계성 묘사: 플레이어가 선택한 태그(예: #집착, #피폐 등)의 분위기를 적극 반영하되, 기본적으로 1차원적이고 유치한 소유욕("너는 내 것" 등) 표현보다는 상황과 행동, 눈빛 등 섬세하고 절제된 묘사를 통해 관계의 깊이와 텐션을 서술하십시오.

[🚨 서술 문체 및 턴제 진행 절대 수칙 - 위반 금지]
1. 서술 문체 100% 일관성 (단일 경어체): 모든 배경 묘사, 상황 설명, 지문의 종결 어미는 반드시 정중한 경어체('~합니다', '~했습니다', '~였습니다')로 고정하십시오. (따옴표 안의 대사만 캐릭터 성격에 맞게 허용)
2. 임의 시간 건너뛰기(Time-skip) 금지: "[시간이 얼마나 흘렀을까]" 등의 임의 스킵을 금지합니다.
3. 1턴 1판정 원칙: 한 번의 답변에서 다중 판정을 요구하지 마십시오.
4. 판정 선언 시 즉각 발화 중단 (HALT): 행동에 대해 판정을 요구(CHECK 태그 출력)한 즉시 서술을 멈추고 플레이어의 주사위를 기다리십시오. 결과를 미리 묘사하지 마십시오.
${isJustRolled ? "5. ⚠️ [가장 중요한 규칙] 플레이어가 방금 주사위 판정 결과를 제출했습니다. 이번 턴에는 판정 결과에 따른 서사 묘사만 진행하고, **절대로 새로운 판정을 요구하는 <!-- CHECK: ... --> 태그를 다시 출력하지 마십시오!** 판정 결과를 묘사한 후 플레이어의 행동을 기다리십시오." : ""}

[태그 출력 규격 (본문 맨 끝에 삽입)]
<!-- SPOTS: [{"name": "오브젝트명", "stat": "필요기능"}] -->
<!-- CHECK: {"skill": "판정명", "target": 목표치, "reason": "이유"} -->
<!-- STATUS: {"san": 49, "hp": 10, "cycle": 2, "scene": 1, "erosion": 2} -->
<!-- SUGGESTIONS: ["선택지 1", "선택지 2"] -->
<!-- REVEAL_SECRET: {"name": "인물명", "secret": "비밀내용"} -->`;

    // ====================================================================
    // 3. 메시지 포맷팅 및 AI 요청
    // ====================================================================
    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "네, 명시해주신 룰의 특수성(사이클, 이성 차감, 변이 등)과 플레이어가 선택한 서사/관계성 지향을 최우선으로 반영하여 완벽히 숙지했습니다. 경어체로 서술하며, 판정을 요구한 순간 서술을 멈추고, 주사위 결과 턴에는 중복 판정을 요구하지 않겠습니다." }] }
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

    // Fallback 모델 순차 호출
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
