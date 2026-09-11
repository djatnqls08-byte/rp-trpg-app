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
        rulePrompt = `[멀티 호러 TRPG 인세인 진행 및 사이클/핸드아웃/광기 수칙]
현재 진행 상태: ${currentCycle}사이클 / ${currentScene}씬 (리미트: ${limitCycle})
- 🚨 [SPOTS 절대 금지]: 인세인은 씬(Scene) 게임입니다. <!-- SPOTS: ... --> 태그를 절대로 출력하지 마십시오!
- 🚨 [조사 판정 태그]: 플레이어가 조사를 선언하면 특기를 지정해 <!-- CHECK: {"skill": "특기명", "target": 5, "reason": "이유"} --> 출력 후 즉시 서술을 멈추십시오(HALT).
- 🚨 [판정 성공 후: 핸드아웃 비밀 해금 & 씬 종료]:
  판정 성공 시 핸드아웃 뒷면을 서술하고, 답변 끝에 반드시:
  <!-- REVEAL_HANDOUT: {"title": "조사한_핸드아웃_제목"} -->
  <!-- ADVANCE_SCENE -->
  태그를 출력하십시오.
- 🚨 **[광기 발현(Trigger) 필수 태그]**:
  플레이어가 "광기 발동", "발현시켜줘", "공포에 질림"을 요청하거나 서사적으로 광기가 발현되는 상황이 되면,
  절대 말로만 서술하지 말고 반드시 본문 맨 끝에 아래 시스템 태그를 출력하십시오:
  <!-- TRIGGER_MADNESS: {"name": "의혹", "desc": "동행자의 사명과 말을 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다."} -->
  (광기 6종 중 택1: 의혹, 망상, 강박증, 패닉, 폭력 충동, 쇼크)
- 행동 추천 제안은 <!-- SUGGESTIONS: ["${partnerName}와 대화 나누기", "주변 단서 살펴보기", "장면표 굴림"] --> 형식으로 출력하십시오.`;
      } else {
        rulePrompt = `[자유 서사 모드]
- 주사위 판정 없이 대사와 감정선에 집중하십시오.
- 장소 변경 시 지문 최상단에 **[N일 차 / 요일 / 시간 / 장소]** 헤더를 출력하십시오.`;
      }

      const relationshipPrompt = `[🚨 캐릭터 호칭 및 관계성 절대 수칙 - 위반 금지]
1. 🚨 서술과 대사에서 'PC', 'KPC'라는 단어를 절대 쓰지 마십시오! 탐사자는 '${pName}', 동행 파트너는 '${partnerName}'(으)로만 지칭하십시오.
2. 맹목적 추종, 얀데레, 강압(납치, 감금), 유치한 소유욕 묘사를 엄격히 금지합니다.
3. 호감도가 높더라도 절제되고 성숙한 미학과 거리감을 유지하십시오.
${(playPreference || "").includes("#달달") || (playPreference || "").includes("#일상") ? "5. 태그에 #달달 혹은 #일상이 포함되어 있습니다. 고어, 유혈 묘사를 일절 배제하고 서사를 따뜻하고 애틋하게 재해석하십시오." : ""}`;

      const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.

${rulePrompt}
${relationshipPrompt}

시나리오 본문 및 배후 진상:
${scenarioText || "미상의 시나리오"}

탐사자: ${pName} (${playerSheet?.job}), 파트너: ${partnerName}

[🚨 서술 문체 및 규칙]
1. 모든 지문 서술은 정중한 키퍼의 경어체(~합니다/했습니다)로 100% 일관되게 고정하십시오.
2. 판정 요구 시 태그를 출력하고 즉시 서술을 멈추십시오. 태그 끝은 반드시 "-->" 로 닫으십시오.

[🚨 서사 속도 및 진행 호흡 절대 수칙 (스킵 방지 / Pacing Control)]
1. 시간 스킵(타임스킵) 절대 금지:
   - 플레이어가 "시간을 보낸다"고 직접 선언하지 않는 한, "몇 시간이 지나", "그렇게 다음 날이 되고", "잠시 후", "밤이 깊어지며" 처럼 마스터가 임의로 시간을 건너뛰지 마십시오.
   - 항상 '지금 이 순간(실시간)' 1~2분 안에서 일어나는 일만 서술하십시오.
2. 1턴 1행동·1호흡 원칙 (슬로우번):
   - 한 번의 답변에서 사건을 완결짓거나 여러 사건을 연쇄적으로 전개하지 마십시오.
   - 플레이어의 행동에 대한 반응(NPC의 눈빛, 작은 몸짓, 짧은 대사) 1회 + 주변 환경의 미세한 묘사 1개만 제시하고 턴을 즉시 넘기십시오.
3. 플레이어 캐릭터(PC) 조종 금지 (자율권 보장):
   - ${pName}의 속마음, 감정, 대사, 발걸음을 마스터가 대신 서술(대필)하지 마십시오. 마스터는 오직 세상과 NPC(${partnerName})만을 움직여야 합니다.
4. 단서와 진상의 단계적 누출:
   - 조사 한 번에 서랍 속 편지의 전문을 다 털어놓지 마십시오. "서랍 안쪽에 낡은 편지 한 통이 보입니다"처럼 단서의 겉모습만 보여주고, 플레이어가 열어보겠다고 할 때 내용을 보여주십시오.
5. 턴 종료 시 행동 촉구:
   - 지문 끝은 항상 플레이어가 당장 다음에 무엇을 할지 반응할 수 있는 '열린 상태'로 끝마치십시오.`;

      formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
      formattedContents.push({ role: "model", parts: [{ text: "경어체(~합니다/였습니다)로 일관되게 서술하며, 시간을 임의로 스킵하지 않고 한 턴에 한 호흡씩 천천히 진행하겠습니다. 탐사자의 행동을 대신 결정하지 않겠습니다." }] });

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
