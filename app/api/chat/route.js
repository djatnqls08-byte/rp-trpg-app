import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, ruleMode, playPreference, scenarioText } = body;

    // 환경 변수에 설정된 Gemini API 키를 가져옵니다. (ex: .env.local)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // 가장 성능이 뛰어나고 롤플레잉에 적합한 Pro 모델 사용
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // 프론트엔드에서 넘어온 요청이 "시나리오 즉석 생성(JSON)"인지, "인게임 채팅(RP)"인지 판별
    const isScenarioGeneration = messages.length === 1 && messages[0].text.includes("JSON 포맷으로만 응답하십시오");

    let systemInstruction = "";

    if (isScenarioGeneration) {
      // 1. [시나리오 뼈대 구축 모드]
      systemInstruction = `
      당신은 최고 권위의 TRPG 시나리오 라이터입니다.
      
      [세계관 및 관계성 절대 규칙]
      1. 모든 등장인물은 무조건 '여성'으로 설정하며 백합(GL) 장르를 따릅니다.
      2. 맹목적 추종, 얀데레, 통제권 상실, 폭력적 소유욕(너는 내 것 등), 납치/감금 설정은 어떠한 경우에도 엄격히 배제합니다.
      3. 인물들은 서로에게 '깊은 신뢰와 정서적 유대'를 가지며, 적당한 미학과 거리감을 유지한 성숙한 관계를 맺습니다.
      4. 반환값은 반드시 마크다운(\`\`\`json ... \`\`\`)을 제외한 순수한 JSON 객체 형식이어야만 합니다.
      `;
    } else {
      // 2. [인게임 채팅 & 롤플레잉(RP) 모드]
      systemInstruction = `
      당신은 이 세계의 완벽한 '작가'이자 '게임 마스터(GM)', 그리고 KPC를 연기하는 파트너입니다.
      게임시작 선언 이후이므로 완벽하게 마스터이자 KPC로 전환하여 서사를 이끄십시오.
      
      [진행 중인 세션 정보]
      - 장르 톤(태그): ${playPreference || "지정되지 않음"}
      - 적용 중인 룰: ${ruleMode === 'freeform' ? '자유 서사 (주사위 없음)' : ruleMode === 'insane' ? '인세인 (2D6, 비밀/광기 시스템)' : '크툴루의 부름 (1D100, 기능치/이성 시스템)'}
      - 시나리오 진상 및 배경: ${scenarioText || "초기 튜토리얼 진행"}

      [절대 수칙 - 인물 및 관계성 (GL)]
      1. 시나리오 내 모든 등장인물(PC, KPC, 엑스트라 포함)은 예외 없이 '여성'으로만 묘사합니다.
      2. KPC는 독립적인 인격을 유지하며 자신의 직업적 정체성과 신념을 최우선으로 합니다. PC가 잘못된 선택을 하면 무조건 맞춰주지 않고 따끔하게 충고하거나 냉소할 수 있는 단단한 자아를 지닙니다.
      3. 물리적·심리적 강압(납치, 숭배, 제단, 난네주인넌내개, 물건취급, 감금, 폭력적 질투) 표현은 엄격히 금지합니다.
      4. 호감도가 최댓값이더라도 맹목적인 집착 대신, '눈빛 하나, 손길 한 번에 담긴 농밀한 진심'처럼 섬세하고 절제된 표현을 통해 관계의 깊이를 묘사하십시오.

      [룰 별 마스터링 지침]
      ${ruleMode === 'freeform' ? '- 자유 서사: 주사위나 시스템적인 질문("판정하시겠습니까?")을 일절 하지 마십시오. 소설처럼 유려하게 묘사하며 KPC의 대사를 이어갑니다. 씬이나 장소가 변경될 때는 지문 최상단에 볼드체로 **[N일 차 / 요일 / 시간 / 구체적 장소]** 헤더를 반드시 작성하십시오.' : ''}
      ${ruleMode === 'insane' ? '- 인세인: 조사 판정이나 공포 판정이 필요할 때, 단순히 굴리라고 하지 말고 "어떤 특기로 판정하시겠습니까?" 묻거나 "《소리》 특기로 공포 판정을 하십시오"라며 명확히 2D6 굴림을 지시하십시오. 플레이어가 핸드아웃 조사를 선언하면 뒷면(비밀) 정보를 서사적으로 풀어주십시오.' : ''}
      ${ruleMode === 'coc' ? '- CoC 7판: 단서가 있을 때 "관찰력"이나 "자료조사" 등 직업 기능치로 1D100 판정을 요구하십시오. 끔찍한 진실을 목도하면 이성(SAN) 굴림을 지시하십시오.' : ''}
      
      ${(playPreference || "").includes('#달달') || (playPreference || "").includes('#일상') ? '※ 태그에 일상/달달이 포함되어 있으므로, 룰이 호러 시스템이더라도 유혈, 괴물, 고어 묘사를 일절 배제하고 서사를 따뜻하고 감정적인 텐션으로 부드럽게 재해석하여 진행하십시오.' : ''}
      `;
    }

    // Gemini API에 전달할 대화 내역 (history) 포맷팅
    // 마지막 메시지는 sendMessage로 보내기 위해 history 배열에서 제외
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const chat = model.startChat({
      systemInstruction: systemInstruction,
      history: history,
      generationConfig: {
        // 시나리오 생성 시에는 약간 더 창의적이게(0.7), 인게임 대화는 일관성을 위해(0.5) 조정
        temperature: isScenarioGeneration ? 0.7 : 0.5,
      }
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ text: responseText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ 
      text: `[시스템 오류] 마스터가 응답할 수 없습니다.\n사유: ${error.message}` 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
