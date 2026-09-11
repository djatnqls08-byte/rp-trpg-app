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
    const lastMessageText = messages[messages.length - 1]?.text || "";
    const isScenarioGen = lastMessageText.includes("순수 JSON 포맷으로만 응답하십시오");

    let formattedContents = [];

    if (isScenarioGen) {
      formattedContents = [
        { role: "user", parts: [{ text: "당신은 전문 TRPG 시나리오 라이터입니다. 사용자의 요청에 따라 반드시 마크다운(```json)이나 부연 설명 없이 오직 순수한 JSON 객체({...})만 반환하십시오." }] },
        { role: "model", parts: [{ text: "{}" }] },
        { role: "user", parts: [{ text: lastMessageText }] }
      ];
    } else {
      const partnerName = playerSheet?.npcs?.[0]?.name || "도윤";
      const pName = playerSheet?.name || "하진";

      let rulePrompt = "";
      if (ruleMode === "coc") {
        rulePrompt = `[크툴루의 부름 7판 CoC 진행 및 광기 수칙]
- 🚨 **[조사 및 행동 선언 시 CHECK 태그 필수]**:
  플레이어가 단서 탐색, 조사, 은밀 행동을 시도하면 결과를 미리 서술하지 말고 반드시:
  <!-- CHECK: {"skill": "기능명(예: 관찰력/자료조사)", "target": 수치, "reason": "이유"} -->
  태그를 출력한 뒤 그 즉시 서술을 완전히 중단(HALT)하십시오.
- 물리적 탐사가 가능한 맵 구역은 <!-- SPOTS: [{"name": "오브젝트", "stat": "기능명"}] --> 형식으로 출력하십시오.
- 🚨 이성(SAN) 차감 완급 조절: 경미한 조우는 성공 0 / 실패 1점(최대 2점)으로 제한하십시오.`;
      } else if (ruleMode === "insane") {
        rulePrompt = `[멀티 호러 TRPG 인세인 진행 및 광기 수칙]
- 🚨 **[절대 주의 - SPOTS 금지]**: 인세인은 씬(Scene) 단위의 게임입니다. <!-- SPOTS: ... --> 태그를 절대로 출력하지 마십시오!
- 🚨 **[조사 선언 시 필수 판정 수칙 (CHECK 태그 필수)]**:
  플레이어가 사물, 서류, 핸드아웃의 '조사'를 선언하거나 비밀을 밝히려 할 경우, 절대 결과를 임의로 먼저 서술하지 마십시오!
  반드시 6대 분야 특기 중 가장 어울리는 특기 하나를 지정하여:
  <!-- CHECK: {"skill": "특기명(예: 정리/소리/기록)", "target": 5, "reason": "조사 이유"} -->
  태그를 출력하고 그 즉시 지문 서술을 완전히 멈추십시오(HALT). 주사위 결과가 전송되기 전까지 결과를 밝혀서는 안 됩니다.
- 🚨 **[감정 판정 남발 금지]**:
  감정 판정은 씬의 극적인 사건이나 사이클 후반에만 아주 드물게 요구하십시오. 일반 씬에서는 대화 및 핸드아웃 [비밀 조사 판정] 위주로 유도하십시오.
- 새로운 단서나 사물이 등장하면 <!-- HANDOUT: {"title": "이름", "overview": "겉보기 정보", "secret": "이면의 비밀"} --> 형식으로 등록하십시오.
- 행동 제안은 <!-- SUGGESTIONS: ["${partnerName}와 대화 나누기", "주변 단서 살펴보기", "장면표 굴림"] --> 형식으로 출력하십시오.`;
      } else {
        rulePrompt = `[자유 서사 모드]
- 주사위 판정 없이 대사와 깊은 감정선에 집중하십시오.
- 씬이나 장소가 변경될 때 지문 최상단에 **[N일 차 / 요일 / 시간 / 장소]** 헤더를 출력하십시오.`;
      }

      const relationshipPrompt = `[🚨 캐릭터 호칭 및 관계성 절대 수칙 - 위반 금지]
1. 🚨 서술과 대사에서 'PC', 'KPC'라는 단어를 단 한 번도 사용하지 마십시오! 탐사자는 '${pName}', 동행 파트너는 '${partnerName}'(으)로만 지칭하십시오.
2. 맹목적 추종, 얀데레, 강압(납치, 감금), 유치한 소유욕 묘사를 엄격히 금지합니다.
3. 호감도가 높더라도 '눈빛 하나, 손길 한 번에 담긴 농밀한 진심'처럼 절제되고 성숙한 미학과 거리감을 유지하십시오.
${(playPreference || "").includes("#달달") || (playPreference || "").includes("#일상") ? "5. 태그에 #달달 혹은 #일상이 포함되어 있습니다. 고어, 유혈 묘사를 일절 배제하고 서사를 따뜻하고 애틋하게 재해석하십시오." : ""}`;

      const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.

${rulePrompt}
${relationshipPrompt}

플레이어 성향: [${playPreference || "자유 서사"}]
시나리오 본문 및 배후 진상:
${scenarioText || "미상의 시나리오"}

탐사자: ${pName} (${playerSheet?.job}), 파트너: ${partnerName}

[🚨 서술 문체 및 발화 중단 수칙]
1. 모든 지문 서술은 정중한 키퍼의 경어체('~합니다', '~했습니다', '~입니까?')로 100% 일관되게 고정하십시오. 평어체 혼용 금지.
2. 판정을 요구할 경우 (<!-- CHECK: ... -->) 문장을 맺고 그 즉시 서술을 멈추십시오(HALT).
3. 태그 끝은 반드시 "-->" 로 닫으십시오.`;

      formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
      formattedContents.push({ role: "model", parts: [{ text: "경어체(~합니다/였습니다)로 일관되게 서술하며, 판정 요구 시 즉시 발화를 멈추겠습니다. 'PC/KPC' 대신 인물의 실명만을 사용하겠습니다." }] });

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
    }

    let responseText = null;
    let lastError = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: formattedContents,
          generationConfig: { temperature: isScenarioGen ? 0.7 : 0.6 }
        });
        responseText = result.response.text();
        if (responseText) break;
      } catch (err) {
        console.warn(`[API Fallback] ${modelName} 호출 실패 (${err.message}). 다음 모델로 전환.`);
        lastError = err;
      }
    }

    if (!responseText) throw lastError || new Error("모든 예비 모델의 한도가 초과되었습니다.");

    if (isScenarioGen) {
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    return new Response(JSON.stringify({ text: responseText }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Route Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
