import { GoogleGenerativeAI } from "@google/generative-ai";

// [수정됨] 실제 작동하는 구글 Gemini 1.5 라인업으로 폴백 모델 교체 (에러 방지)
const FALLBACK_MODELS = [
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

export async function POST(req) {
  try {
    // 프론트엔드에서 넘어오는 데이터 수신
    const { messages, scenarioText, playerSheet, ruleMode, playPreference } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 등록되지 않았습니다." }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // ==========================================
    // 1. 룰별 맞춤 키퍼 수칙 & 인세인 분리 (핵심)
    // ==========================================
    let rulePrompt = "";
    if (ruleMode === "coc") {
      rulePrompt = `[크툴루의 부름 7판 CoC 진행 및 광기 수칙]
- 단서 탐색, 은밀 행동 시 다이스 판정(CHECK)을 1회만 정중히 요구하십시오.
- 물리적 탐사가 가능한 맵 구역이나 사물은 <!-- SPOTS: [{"name": "책상", "stat": "관찰력"}] --> 형식으로 출력하십시오.
- 🚨 **이성(SAN) 차감 완급 조절**:
  1. 경미한 조우: 산치 감소는 성공 0 / 실패 1점(최대 2점)으로 엄격히 제한하십시오.
  2. 한 번에 5점 이상 깎는 것은 신격체/거대 괴물과 직접 조우했을 때만 적용하십시오.
- 🩸 **광기 서사 필수 반영**: 플레이어 시트의 광기 상태가 [정상]이 아니라면, 통제력을 잃은 모습과 동행자(파트너)가 당황하여 붙잡는 상황을 반드시 서술하십시오.`;
    } else if (ruleMode === "insane") {
      rulePrompt = `[멀티 호러 TRPG 인세인 진행 및 광기 수칙]
- 🚨 **[절대 주의]**: 인세인은 씬(Scene) 단위의 보드게임형 룰입니다. CoC처럼 단순한 물리적 장소를 뒤지는 SPOTS 태그를 **절대** 생성하지 마십시오.
- 대신, 장면 주도권에 따른 씬 진행과 함께 <!-- SUGGESTIONS: ["KPC의 비밀 조사 판정", "KPC와 감정 판정 맺기", "진통제 사용하기", "장면표 굴림"] --> 등 인세인 전용 액션을 추천하십시오.
- 비밀이 밝혀질 때만 <!-- REVEAL_SECRET: {"name": "인물명", "secret": "비밀"} --> 형식으로 출력하십시오.
- 🩸 **광기 카드 서사 반영**: 의혹, 망상, 폭력 충동 등 광기 카드가 발현되어 있다면 파트너를 향한 의심이나 환각을 자극하여 심리적 압박감을 묘사하십시오. (연쇄 판정 난사 금지)`;
    } else {
      rulePrompt = `[자유 서사 모드]
- 주사위 판정이나 시스템 기믹을 일절 배제하고 서사와 대화에만 집중하십시오.
- 씬이나 장소가 변경될 때 지문 최상단에 **[N일 차 / 요일 / 시간 / 장소]** 형태의 헤더를 출력하십시오.
- 자연스러운 대화나 행동 선택지를 <!-- SUGGESTIONS: ["선택지 1", "선택지 2"] --> 로 제공하십시오.`;
    }

    // ==========================================
    // 2. 세계관 및 관계성 (GL / 얀데레 금지 / 톤 조정)
    // ==========================================
    const relationshipPrompt = `[🚨 서사 및 캐릭터 관계성 절대 수칙 - 위반 금지]
1. 맹목적 추종, 얀데레, 강압(납치, 감금), 유치한 소유욕 묘사를 엄격히 금지합니다.
2. KPC는 독립적인 인격을 유지하며, 맹목적으로 순종하지 않고 따끔하게 충고할 수 있습니다.
3. 호감도가 높더라도 '눈빛 하나, 손길 한 번에 담긴 농밀한 진심'처럼 절제되고 성숙한 미학과 거리감을 유지하십시오.
${(playPreference || "").includes("#달달") || (playPreference || "").includes("#일상") ? "5. 태그에 #달달 혹은 #일상이 포함되어 있습니다. 룰이 호러라도 유혈, 고어 묘사를 일절 배제하고 서사를 따뜻하고 애틋하게 재해석하십시오." : ""}`;

    // ==========================================
    // 3. 마스터 헌법 (시스템 인스트럭션 조립)
    // ==========================================
    const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.

${rulePrompt}

${relationshipPrompt}

플레이어 성향: [${playPreference || "자유 서사"}]
시나리오 본문 및 배후 진상/기믹/엔딩 분기:
${scenarioText || "미상의 시나리오"}

캐릭터 상태: 이름(${playerSheet?.name}), 직업(${playerSheet?.job}), 체력(${playerSheet?.hp}), 이성(${playerSheet?.san}), 광기(${playerSheet?.madnessStatus || "정상"})

[🚨 서술 문체, 턴제 중단, 진행 절대 수칙 - 위반 절대 금지]
1. **서술 문체 일관성 (단일 경어체 100% 고정)**: 마스터의 모든 지문 서술, 배경 묘사, 상황 설명의 종결 어미는 반드시 정중한 경어체('~합니다', '~했습니다', '~입니까?')로 100% 일관되게 고정하십시오. 평어체 혼용 엄금.
2. **판정 선언 시 즉각 발화 중단 (HALT)**: 다이스 판정을 요구할 경우, 태그를 출력한 뒤 그 즉시 서술을 중단(STOP)하십시오. 주사위 결과가 나오기 전까지 뒤의 상황을 미리 묘사하지 마십시오.
3. **1턴 1판정 원칙**: 관찰력 판정과 산 체크를 동시에 요구하는 등의 다중 판정을 엄격히 금지합니다.
4. **임의 시간 건너뛰기 조기 완결 금지**: 플레이어 동의 없는 임의 스킵이나 엔딩 도출을 금지합니다.
5. **태그 출력 규격 (오직 이 양식만 따를 것)**:
   <!-- SPOTS: [{"name": "오브젝트명", "stat": "필요기능"}] -->
   <!-- CHECK: {"skill": "판정명", "target": 목표치, "reason": "이유"} -->
   <!-- STATUS: {"san": 49, "hp": 10} -->
   <!-- SUGGESTIONS: ["선택지 1", "선택지 2"] -->`;

    // ==========================================
    // 4. 대화 기록(History) 포맷팅
    // ==========================================
    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "경어체(~합니다/였습니다)로 일관되게 서술하며, 판정 요구 시 즉시 발화를 멈추겠습니다. 플레이어 시트의 광기 상태와 룰별 수칙(GL, 얀데레 금지 등)을 완벽히 준수하여 서사를 이끌겠습니다." }] }
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

    // ==========================================
    // 5. 폴백(Fallback) 모델 트라이캐치 링
    // ==========================================
    let responseText = null;
    let lastError = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // 생성 옵션 설정 (창의성과 일관성의 밸런스)
        const result = await model.generateContent({ 
          contents: formattedContents,
          generationConfig: { temperature: 0.6 }
        });
        responseText = result.response.text();

        if (responseText) {
          break; // 성공 시 루프 탈출
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
