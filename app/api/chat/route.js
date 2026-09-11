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

    const lastUserMessage = [...(messages || [])].reverse().find(m => m.role === "user")?.text || "";
    const isJustRolled = lastUserMessage.includes("[🎲");

    const currentCycle = playerSheet?.cycle || 1;
    const currentScene = playerSheet?.scene || 1;
    const currentErosion = playerSheet?.erosion || 1;

    let rulePrompt = "";
    if (ruleMode === "coc") {
      rulePrompt = `[🐙 크툴루의 부름 7판 CoC 진행 수칙]
- 1D100 판정 시스템을 엄격히 적용하십시오.
- 🚨 이성(SAN) 차감: 경미한 조우는 이성 감소를 [성공 0 / 실패 1점]으로 제한하십시오.
- 이성 감소 시 반드시 <!-- STATUS: {"san": 차감_후_수치} --> 태그를 출력하십시오.`;
    } else if (ruleMode === "insane") {
      rulePrompt = `[🔥 멀티 호러 TRPG 인세인 (inSANe) 진행 수칙]
- 🚨 1씬 1행동 원칙: 하나의 씬에서 [비밀 조사], [감정 판정], [회복 판정] 중 단 하나만 수행하십시오.
- 🚨 씬 종료: 행동 서사 후 반드시 <!-- STATUS: {"cycle": ${currentScene >= 2 ? currentCycle + 1 : currentCycle}, "scene": ${currentScene >= 2 ? 1 : currentScene + 1}} --> 태그로 씬을 넘기십시오.`;
    } else if (ruleMode === "unsung") {
      rulePrompt = `[🦋 언성 듀엣 (Unsung Duet) 진행 수칙]
- 초현실적인 이계 '시프터' 탈출 서사.
- 🚨 침식도(Erosion) 상승 시 <!-- STATUS: {"erosion": ${currentErosion + 1}} --> 출력 및 기괴하고 아름다운 신체 변이를 묘사하십시오.`;
    } else {
      rulePrompt = `[🎲 자유 서사 모드]
- 1D20 판정 기반 샌드박스형 서사 전개.`;
    }

    const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.

${rulePrompt}

캐릭터 상태: 이름(${playerSheet?.name}), 직업(${playerSheet?.job})
시나리오 본문(공개 개요 및 마스터 진상):
${scenarioText || "미상의 시나리오"}

[🚨 세계관 및 관계성 절대 수칙]
1. 서사 및 관계성 지향 최우선 반영: 플레이어가 선택한 지향 태그([${playPreference || "자유 서사"}])를 가장 최우선으로 참조하여 성별, 커플링, 서사 분위기를 결정하십시오.
2. 독립적 인격: NPC는 맹목적인 추종이나 유치한 소유욕("너는 내 것") 없이 각자의 신념을 지닌 입체적 인물이어야 합니다.

[🚨 다중 KPC/NPC 등장 및 스포일러 방지 수칙 - 위반 절대 금지]
1. 순차적 등장: 시트에 설정된 주요 인물(KPC)이 여러 명일 경우, 첫 씬부터 전원이 한꺼번에 등장하지 마십시오. 서사 전개와 장소 이동에 따라 자연스럽게 한 명씩 조우시키십시오.
2. ⚠️ REVEAL_SECRET 태그 남발 금지 (치명적 스포일러 방지):
   - 플레이어가 특정 인물을 대상으로 '비밀 조사', '심리학 판정', '심문' 등의 행동을 선언하고 성공 판정을 받기 전까지는, **절대로 <!-- REVEAL_SECRET: ... --> 태그를 출력하지 마십시오!**
   - 첫 턴, 도입부, 일상적 대화 턴에 비밀 태그를 출력하는 것은 게임을 망치는 행위입니다. 비밀이 밝혀지기 전까지 NPC는 오직 겉으로 드러난 직업과 성격(detail)으로만 연기하십시오.

[🚨 서술 문체 및 진행 수칙]
1. 모든 지문 서술은 정중한 경어체('~합니다', '~했습니다', '~였습니다')로 100% 일관되게 고정하십시오.
2. 판정(CHECK) 선언 즉시 서술을 멈추고 플레이어의 주사위를 기다리십시오.
${isJustRolled ? "3. ⚠️ [중요] 플레이어가 방금 주사위 결과를 제출했습니다. 이번 턴에는 결과만 서술하고 절대로 새로운 <!-- CHECK: ... --> 태그를 출력하지 마십시오!" : ""}

[태그 출력 규격]
<!-- CHECK: {"skill": "판정명", "target": 목표치} -->
<!-- STATUS: {"san": 49, "cycle": 2, "scene": 1, "erosion": 2} -->
<!-- REVEAL_SECRET: {"name": "인물명", "secret": "비밀내용"} -->`;

    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "네, 플레이어가 정식으로 비밀 조사를 선언하고 성공하기 전까지는 절대로 REVEAL_SECRET 태그를 출력하지 않겠습니다. KPC 순차 등장과 경어체 규칙을 엄수하겠습니다." }] }
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

        if (responseText) break;
      } catch (err) {
        console.warn(`[API Fallback] ${modelName} 호출 실패. 다음 예비 모델로 전환.`);
        lastError = err;
      }
    }

    if (!responseText) throw lastError || new Error("모든 모델 한도 초과");

    return new Response(JSON.stringify({ text: responseText }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
