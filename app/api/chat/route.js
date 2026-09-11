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
        { role: "user", parts: [{ text: "당신은 전문 TRPG 시나리오 라이터입니다. 요청에 따라 마크다운 없이 순수한 JSON 객체({...})만 반환하십시오." }] },
        { role: "model", parts: [{ text: "{}" }] },
        { role: "user", parts: [{ text: lastMessageText }] }
      ];
    } else {
      const partnerName = playerSheet?.npcs?.[0]?.name || "아델";
      const pName = playerSheet?.name || "클레어";
      const currentCycle = playerSheet?.cycle || 1;
      const currentScene = playerSheet?.scene || 1;
      const limitCycle = playerSheet?.limit || 4;

      let rulePrompt = "";
      if (ruleMode === "coc") {
        rulePrompt = `[크툴루의 부름 7판 CoC 진행 및 광기 수칙]
- 단서 탐색, 조사 선언 시 결과를 미리 서술하지 말고 <!-- CHECK: {"skill": "기능명", "target": 수치, "reason": "이유"} --> 출력 후 발화를 즉시 멈추십시오.
- 물리적 구역은 <!-- SPOTS: [{"name": "오브젝트", "stat": "기능명"}] --> 형식으로 출력하십시오.
- 🚨 이성(SAN) 차감 완급 조절: 경미한 조우는 성공 0 / 실패 1점(최대 2점)으로 제한하십시오.`;
      } else if (ruleMode === "insane") {
        rulePrompt = `[멀티 호러 TRPG 인세인 진행 및 사이클/핸드아웃 수칙]
현재 진행 상태: ${currentCycle}사이클 / ${currentScene}씬 (리미트: ${limitCycle})
- 🚨 [SPOTS 절대 금지]: 인세인은 씬(Scene) 게임입니다. <!-- SPOTS: ... --> 태그를 절대로 출력하지 마십시오!
- 🚨 [핸드아웃 조사 판정 및 발화 중단]:
  플레이어가 핸드아웃/사물의 조사를 선언하면, 결과를 먼저 적지 말고 어울리는 특기를 지정해:
  <!-- CHECK: {"skill": "특기명", "target": 5, "reason": "조사 이유"} -->
  태그를 출력하고 즉시 서술을 멈추십시오(HALT).
- 🚨 [판정 성공 후: 핸드아웃 비밀 해금 & 씬 종료 선언]:
  플레이어가 주사위 판정에 성공했다는 메시지가 오면:
  1) 핸드아웃의 뒷면(비밀) 정보를 서사적으로 생생하게 풀어내십시오.
  2) 답변 맨 끝에 반드시 <!-- REVEAL_HANDOUT: {"title": "조사한_핸드아웃_제목"} --> 태그를 출력하십시오.
  3) 주요 행동이 끝났으므로 씬을 마무리하고 <!-- ADVANCE_SCENE --> 태그를 출력하여 다음 씬으로 넘기십시오.
- 행동 추천 제안은 <!-- SUGGESTIONS: ["${partnerName}와 대화 나누기", "주변 단서 살펴보기", "장면표 굴림"] --> 형식으로 출력하십시오.`;
      } else {
        rulePrompt = `[자유 서사 모드]
- 주사위 판정 없이 대사와 감정선에 집중하십시오.
- 장소 변경 시 지문 최상단에 **[N일 차 / 요일 / 시간 / 장소]** 헤더를 출력하십시오.`;
      }

      const relationshipPrompt = `[🚨 캐릭터 호칭 및 관계성 절대 수칙 - 위반 금지]
1. 모든 등장인물은 무조건 '여성'입니다 (GL 고정).
2. 🚨 서술과 대사에서 'PC', 'KPC'라는 단어를 절대 쓰지 마십시오! 탐사자는 '${pName}', 동행 파트너는 '${partnerName}'(으)로만 지칭하십시오.
3. 맹목적 추종, 얀데레, 강압(납치, 감금), 유치한 소유욕 묘사를 엄격히 금지합니다.
4. 호감도가 높더라도 절제되고 성숙한 미학과 거리감을 유지하십시오.
${(playPreference || "").includes("#달달") || (playPreference || "").includes("#일상") ? "5. 태그에 #달달 혹은 #일상이 포함되어 있습니다. 고어, 유혈 묘사를 일절 배제하고 서사를 따뜻하고 애틋하게 재해석하십시오." : ""}`;

      const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.

${rulePrompt}
${relationshipPrompt}

시나리오 본문 및 배후 진상:
${scenarioText || "미상의 시나리오"}

탐사자: ${pName} (${playerSheet?.job}), 파트너: ${partnerName}

[🚨 서술 문체 및 규칙]
1. 모든 지문 서술은 정중한 키퍼의 경어체(~합니다/했습니다)로 100% 일관되게 고정하십시오.
2. 판정 요구 시 태그를 출력하고 즉시 서술을 멈추십시오. 태그 끝은 반드시 "-->" 로 닫으십시오.`;

      formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
      formattedContents.push({ role: "model", parts: [{ text: "경어체(~합니다/였습니다)로 일관되게 서술하며, 판정 요구 시 즉시 발화를 멈추겠습니다. 인세인 판정 성공 시 핸드아웃 해금 및 씬 종료 태그를 정확히 출력하겠습니다." }] });

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
