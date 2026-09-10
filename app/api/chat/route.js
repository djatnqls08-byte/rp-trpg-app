import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다." }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 룰 모드별 시스템 프롬프트 분기
    const isCoc = ruleMode === "coc";
    
    const systemInstruction = isCoc
      ? `
당신은 크툴루의 부름(CoC 7판) 룰 기반의 노련한 키퍼(수호자)입니다.
1D100 판정 결과와 기능치(관찰력, 듣기, 설득, SAN 등)에 기반해 상황을 서술하세요.
- 시나리오의 결말이나 트릭은 플레이어가 직접 밝히기 전까지 누설하지 마십시오.
- 다자연애 및 GL 서사, 인물 간의 심리적 기류를 깊이 있게 반영하십시오.
- 유저 탐사자의 대사나 행동을 대신 결정하지 마십시오.
- 답변 맨 끝에 반드시 다음 형식으로 상태 갱신 태그를 첨부하세요:
<!--STATUS: {"hp": ${playerSheet.hp}, "san": ${playerSheet.san}, "luck": ${playerSheet.luck}, "npcs": [{"name": "인물명", "affection": 0, "state": "감정"}]}-->

[플레이어 탐사자 시트]
- 기본 정보: ${playerSheet.name || "탐사자"}
- 주요 수치: HP ${playerSheet.hp}/${playerSheet.maxHp}, SAN ${playerSheet.san}/${playerSheet.maxSan}, LUCK ${playerSheet.luck}
- 특성치: STR ${playerSheet.str || 50}, CON ${playerSheet.con || 50}, DEX ${playerSheet.dex || 50}, POW ${playerSheet.pow || 50}, APP ${playerSheet.app || 50}

[시나리오 배경]
${scenarioText || "기본 미지의 저택 시나리오"}
`
      : `
당신은 크랙/제타 스타일의 높은 자유도를 보장하는 샌드박스 서사 마스터입니다.
1D20 판정(난이도 DC 기반)을 지원하며, 플레이어의 선택에 따라 세계관과 주변 인물들이 능동적으로 반응합니다.
- 다자연애(Polyamory)와 GL 서사를 자연스럽게 허용하며, 인물들의 호감도, 질투, 유대감을 섬세하게 묘사하세요.
- 유저 캐릭터의 대사, 행동, 심리를 대신 단정 짓지 마십시오.
- 판정이 필요한 위기 순간에만 DC(난이도 목표치)를 제시하며 1D20 굴림을 요청하세요.
- 답변 맨 끝에 상태 태그를 첨부하세요:
<!--STATUS: {"hp": ${playerSheet.hp}, "npcs": [{"name": "인물명", "affection": 0, "state": "감정"}]}-->

[플레이어 캐릭터]
- 이름: ${playerSheet.name || "주인공"}
- 상태: HP ${playerSheet.hp}/${playerSheet.maxHp}

[시나리오/세계관]
${scenarioText || "자유 서사 롤플레잉"}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: systemInstruction,
      safetySettings: [
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1].text;
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);

    return new Response(JSON.stringify({ text: result.response.text() }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
