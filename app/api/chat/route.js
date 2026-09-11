import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode, playPreference } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 누락되었습니다." }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 룰에 따른 마스터 지침 분기 (복구됨)
    let ruleInstruction = "";
    if (ruleMode === "coc") {
      ruleInstruction = `룰: 크툴루의 부름 7판 (1D100).
- 단서 수색, 은밀 행동 시 다이스 판정을 요구하세요.
- 시체나 기괴한 현상 조우 시 이성(SAN) 체크를 지시하세요.
- SAN이 5점 이상 급감하면 플레이어는 일시적 광기에 빠지며, NPC가 이에 동요하는 묘사를 넣으세요.`;
    } else if (ruleMode === "insane") {
      ruleInstruction = `룰: 멀티 호러 TRPG 인세인 (2D6).
- 씬(Scene) 단위로 진행하며, 플레이어의 광기나 숨겨진 비밀을 서서히 압박하세요.`;
    } else if (ruleMode === "unsung") {
      ruleInstruction = `룰: 언성 듀엣 (2D6).
- 몽환적이고 기괴한 이계 '시프터' 탈출 서사.
- 플레이어가 위기에 처하면 '이계 침식도(Erosion)' 증가와 신체 변이를 묘사하세요.`;
    } else {
      ruleInstruction = `룰: 자유 서사 (1D20). 샌드박스 형식으로 유연하게 판정합니다.`;
    }

    const systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터입니다.
적용 룰: [${ruleInstruction}]
플레이어 서사 성향: [${playPreference || "자유로운 전개"}]
시나리오 배경: [${scenarioText || "미상"}]
캐릭터 상태: 이름(${playerSheet?.name}), 직업(${playerSheet?.job})

[키퍼 진행 절대 원칙]
1. **장면 묘사와 조사 구역 제시 (필수)**:
   - 새로운 방이나 장소에 들어설 때 시각/청각적 분위기를 묘사하고, 조사 가능한 구역 2~3곳을 본문 끝에 반드시 태그로 명시하세요.
   <!-- SPOTS: [{"name": "오브젝트명", "stat": "필요기능"}] -->
   예시: <!-- SPOTS: [{"name": "피 묻은 양피지 책", "stat": "관찰력"}] -->

2. **적극적인 다이스 판정 요구 (CHECK)**:
   - 플레이어가 위험을 무릅쓰거나 단서를 찾을 때 임의로 결과를 정하지 말고 판정을 요구하세요.
   <!-- CHECK: {"skill": "관찰력", "target": 60, "reason": "숨겨진 일기장 수색"} -->

3. **수치 증감 (STATUS)**:
   - 체력(HP)이나 이성(SAN)에 변동이 생기면 반영된 최종 수치를 출력하세요.
   <!-- STATUS: {"san": 45, "hp": 8} -->

4. **행동 제안 (SUGGESTIONS)**:
   - 턴을 넘길 때 플레이어가 선택할 만한 흥미로운 행동 2가지를 제안하세요.
   <!-- SUGGESTIONS: ["선택지 1", "선택지 2"] -->`;

    const chatHistory = (messages || []).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "TRPG 마스터로서 규칙과 서사를 완벽하게 이끌겠습니다." }] },
        ...chatHistory.slice(0, -1),
      ],
    });

    const lastMessage = chatHistory[chatHistory.length - 1].parts[0].text;
    const result = await chat.sendMessage(lastMessage);
    
    return new Response(JSON.stringify({ text: result.response.text() }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
