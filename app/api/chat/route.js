import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Vercel 환경 변수에 GEMINI_API_KEY가 설정되지 않았습니다." }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const isCoc = ruleMode === "coc";

    const systemInstruction = isCoc
      ? `당신은 크툴루의 부름(CoC 7판) 룰 기반의 노련한 키퍼(수호자)입니다.
1D100 판정 결과와 기능치에 기반해 상황을 서술하세요.
- 시나리오 결말이나 진상은 탐사자가 직접 밝히기 전까지 누설하지 마십시오.
- 다자연애 및 GL 서사, 인물 간의 질투와 유대감을 깊이 있게 반영하십시오.
- 탐사자의 대사나 행동을 대신 결정하지 마십시오.
- 답변 맨 끝에 반드시 다음 형식으로 상태 갱신 태그를 첨부하세요:
<!--STATUS: {"hp": ${playerSheet?.hp || 10}, "san": ${playerSheet?.san || 50}, "luck": ${playerSheet?.luck || 50}, "npcs": [{"name": "엘리제", "affection": 10, "state": "호기심"}, {"name": "유스티나", "affection": 5, "state": "경계"}]}-->

[탐사자 시트]
- 이름: ${playerSheet?.name || "탐사자"} (직업: ${playerSheet?.job || "조사원"}, 나이: ${playerSheet?.age || 25}, 성별: ${playerSheet?.gender || "여성"})
- 백스토리: ${playerSheet?.background || "설정 없음"}
- 파생 수치: HP ${playerSheet?.hp}/${playerSheet?.maxHp}, MP ${playerSheet?.mp}/${playerSheet?.maxMp}, SAN ${playerSheet?.san}/99, LUCK ${playerSheet?.luck}
- 전투 스탯: 피해 보너스(DB) ${playerSheet?.db || "0"}, 체구 ${playerSheet?.build || 0}, 이동력 ${playerSheet?.mov || 8}

[시나리오 배경]
${scenarioText || "미지의 저택 시나리오"}`
      : `당신은 높은 자유도를 보장하는 샌드박스 서사 마스터입니다.
1D20 판정(난이도 DC 기반)을 지원하며 플레이어의 선택에 따라 반응합니다.
- 다자연애 및 GL 서사를 자연스럽게 허용하며 호감도, 질투, 유대감을 섬세하게 묘사하세요.
- 유저 캐릭터의 대사나 행동을 대신 결정하지 마십시오.
- 답변 맨 끝에 상태 태그를 첨부하세요:
<!--STATUS: {"hp": ${playerSheet?.hp || 20}, "npcs": [{"name": "인물명", "affection": 0, "state": "감정"}]}-->

[플레이어 캐릭터]
- 이름: ${playerSheet?.name || "주인공"} (직업: ${playerSheet?.job || "모험가"})
- 백스토리: ${playerSheet?.background || "설정 없음"}
- HP: ${playerSheet?.hp || 20}/${playerSheet?.maxHp || 20}

[시나리오/세계관]
${scenarioText || "자유 서사 롤플레잉"}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    let historyMessages = messages.slice(0, -1);
    if (historyMessages.length > 0 && historyMessages[0].role === "model") {
      historyMessages = historyMessages.slice(1);
    }

    const history = historyMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1].text;
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);

    return new Response(JSON.stringify({ text: result.response.text() }), { status: 200 });
  } catch (error) {
    console.error("서버 에러:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
