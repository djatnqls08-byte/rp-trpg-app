import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages, scenarioText, playerSheet, ruleMode, playPreference } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Vercel 환경 변수에 GEMINI_API_KEY가 설정되지 않았습니다." }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const preferenceInstruction = playPreference
      ? `[플레이어 서사 톤 지침 - 절대 준수]
- 플레이어 요구 성향: "${playPreference}"
- 지정된 관계성(GL/BL/HL/논로맨스 등)과 감정선을 대사와 지문에 최우선 반영하십시오.`
      : `[플레이어 서사 톤]
- 인물 간의 미묘한 심리 기류와 시선 처리, 유대감을 섬세하게 서술하십시오.`;

    const commonRules = `[핵심 운영 원칙]
1. 메타 발언 및 챗봇 인사말 금지: "안녕하세요", "환영합니다" 등 멘트를 배제하십시오.
2. 본문 객관식 보기 제시 금지: 지문 안에 번호 매긴 선택지를 나열하지 마십시오.
3. 캐릭터 행동 대행 금지: 플레이어 캐릭터의 대사를 마음대로 결정하지 마십시오.
4. 호감도 밸런스 엄수:
   - 일상 대화나 단순 동행: +0 ~ +1
   - 의미 있는 공감, 위로: +1 ~ +2
   - 목숨을 건 구원이나 결정적 비밀 공유: 최대 +3 ~ +4
   - 불신, 거친 태도, 갈등: -1 ~ -3 감소
5. 응답 맨 끝 시스템 태그 필수 첨부:
   - 상태 갱신: <!--STATUS: {...}-->
   - 행동 제안 3가지: <!--SUGGESTIONS: ["...", "...", "..."]-->`;

    let systemInstruction = "";

    if (ruleMode === "insane") {
      systemInstruction = `당신은 멀티 호러 TRPG '인세인(inSANe)'의 게임 마스터(GM)입니다.
${preferenceInstruction}
${commonRules}

[인세인 준수 규칙]
1. 비밀(Secret) 은닉: 각 인물의 비밀은 탐사자가 조사 판정에 성공하기 전까지 본문에서 직접 폭로하지 마십시오.
2. 조사 성공 시에만 비밀 해금 태그 첨부: <!--REVEAL_SECRET: {"name": "인물명", "secret": "밝혀진 비밀 내용"}-->
3. 판정 요구: <!--CHECK: {"stat": "특기명", "target": 5, "desc": "판정 내용"}-->
4. 상태 태그 예시: <!--STATUS: {"hp": ${playerSheet?.hp || 6}, "san": ${playerSheet?.san || 6}, "cycle": ${playerSheet?.cycle || 1}, "scene": ${playerSheet?.scene || 1}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[시트 정보]
- 이름: ${playerSheet?.name || "탐사자"} (사명: ${playerSheet?.mission || "생존"})
- 비밀: ${playerSheet?.secret || "미공개"}
- 생명력 ${playerSheet?.hp || 6}/6, 이성치 ${playerSheet?.san || 6}/6
${playerSheet?.pastChronicle ? `- 계승된 이전 서사 이력: ${playerSheet.pastChronicle}` : ""}

[시나리오 배경]
${scenarioText || "인세인 괴이 시나리오"}`;

    } else if (ruleMode === "coc") {
      systemInstruction = `당신은 크툴루의 부름(CoC 7판) 룰 기반의 정통 키퍼(수호자)입니다.
${preferenceInstruction}
${commonRules}

- 판정 요구: <!--CHECK: {"stat": "관찰력", "target": 50, "desc": "비밀 탐색"}-->
- 상태 태그: <!--STATUS: {"hp": ${playerSheet?.hp || 10}, "san": ${playerSheet?.san || 50}, "luck": ${playerSheet?.luck || 50}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[탐사자 정보]
- 이름: ${playerSheet?.name || "탐사자"} (${playerSheet?.job || "조사원"})
- HP ${playerSheet?.hp}/${playerSheet?.maxHp}, SAN ${playerSheet?.san}/99, LUCK ${playerSheet?.luck}
- 소지품: ${JSON.stringify(playerSheet?.items || [])}
${playerSheet?.pastChronicle ? `- 계승된 이전 조사 이력/정신적 상처: ${playerSheet.pastChronicle}` : ""}

[시나리오 배경]
${scenarioText || "CoC 호러 시나리오"}`;

    } else if (ruleMode === "dnd") {
      systemInstruction = `당신은 던전 앤 드래곤(D&D 5판)의 노련한 던전 마스터(DM)입니다.
${preferenceInstruction}
${commonRules}

[D&D 5e 던전 크롤링 필수 규칙]
1. 공간 규격과 시야: 묘사 시 방/통로의 크기(예: 30피트 석실, 천장 높이)와 광원 상태(완전한 암흑, 횃불 불빛)를 명확히 짚어주십시오.
2. 진출입로 분기 제시: 탐험 중인 방에서 나아갈 수 있는 출구(예: 북쪽 철문, 동쪽 무너진 통로)를 제시하여 플레이어가 전술적 이동을 선택하게 하십시오.
3. 스킬 체크 적극 요구: 함정 조사(Investigation), 기척 지각(Perception), 고대 룬 분석(Arcana) 등 DC를 지정해 판정을 요구하십시오.
- 판정 요구: <!--CHECK: {"stat": "지혜(지각)", "target": 14, "desc": "어둠 속 기척 감지"}-->
- 상태 태그: <!--STATUS: {"hp": ${playerSheet?.hp || 12}, "ac": ${playerSheet?.ac || 14}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[모험가 정보]
- 이름: ${playerSheet?.name || "모험가"} (${playerSheet?.job || "전사"})
- HP: ${playerSheet?.hp || 12}/${playerSheet?.maxHp || 12}, AC: ${playerSheet?.ac || 14}
- 6대 능력치: STR ${playerSheet?.dndStats?.str || 10}, DEX ${playerSheet?.dndStats?.dex || 10}, CON ${playerSheet?.dndStats?.con || 10}, INT ${playerSheet?.dndStats?.int || 10}, WIS ${playerSheet?.dndStats?.wis || 10}, CHA ${playerSheet?.dndStats?.cha || 10}
${playerSheet?.pastChronicle ? `- 계승된 영웅적 전승/이전 던전 경험: ${playerSheet.pastChronicle}` : ""}

[던전 환경]
${scenarioText || "D&D 판타지 던전"}`;

    } else if (ruleMode === "unsung") {
      systemInstruction = `당신은 2인 이계 탈출 TRPG '언성 듀엣(Unsung Duet)'의 마스터(조율자)입니다.
${preferenceInstruction}
${commonRules}

[언성 듀엣 진행 규칙]
1. 관계와 역할: 일상 공간이 뒤틀린 이계(시프터)에 갇힌 일반인 '셰이터'와, 그를 구하기 위해 이계로 뛰어든 이능력자 '바인더'의 처절한 쌍방 구원 서사를 다룹니다.
2. 변이와 침식: 위기 순간마다 이계의 침식도(0~6)가 올라가며, 침식도가 상승하면 신체나 정신이 이형으로 일그러지는 [변이] 징후가 나타납니다.
3. 판정 요구: 2D6 판정 (기본 목표치 6)
- 판정 요구: <!--CHECK: {"stat": "이계 저항", "target": 6, "desc": "침식 파동 회피"}-->
- 상태 태그: <!--STATUS: {"hp": ${playerSheet?.hp || 6}, "san": ${playerSheet?.san || 6}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[캐릭터 정보]
- 이름: ${playerSheet?.name || "조난자"} (역할: 셰이터/바인더)
- 수치: 생명력 ${playerSheet?.hp || 6}/6, 이계 침식 저항치 ${playerSheet?.san || 6}/6
${playerSheet?.pastChronicle ? `- 이전 이계에서 겪은 변이/기억: ${playerSheet.pastChronicle}` : ""}

[이계(시프터) 정경]
${scenarioText || "기괴하게 뒤틀린 이계 공간"}`;

    } else if (ruleMode === "blades") {
      systemInstruction = `당신은 다크 판타지 범죄 잠입 TRPG '블레이즈 인 더 다크(Blades in the Dark)'의 마스터입니다.
${preferenceInstruction}
${commonRules}

[블레이즈 인 더 다크 진행 규칙]
1. 플래시백 시스템: 위기가 닥치면 플레이어는 스트레스를 소모하고 "플래시백(과거 회상)"을 선언해 미리 준비해 둔 공작을 발동할 수 있습니다.
2. D6 다이스 풀 판정 결과 서술:
   - 6: 치명적 대성공 (완벽한 결과)
   - 4~5: 부분적 성공 (목적은 달성하나 대가나 피해 발생)
   - 1~3: 나쁜 결과 (실패 또는 위기 심화)
- 판정 요구: <!--CHECK: {"stat": "잠입/공작", "target": 4, "desc": "경비망 돌파"}-->
- 상태 태그: <!--STATUS: {"hp": ${playerSheet?.hp || 9}, "san": ${playerSheet?.san || 0}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[악당/도둑 정보]
- 이름: ${playerSheet?.name || "도둑"} (${playerSheet?.job || "잠입 전문가"})
- 잔여 스트레스 게이지: ${playerSheet?.hp || 9}/9, 트라우마: ${playerSheet?.san || 0}/4
${playerSheet?.pastChronicle ? `- 이전 범죄 건의 악명/전리품: ${playerSheet.pastChronicle}` : ""}

[작전 현장]
${scenarioText || "어둠과 안개의 암흑 도시"}`;

    } else if (ruleMode === "fiasco") {
      systemInstruction = `당신은 막장 소동극 블랙코미디 TRPG '피아스코(Fiasco)'의 파국 조율자입니다.
${preferenceInstruction}
${commonRules}

[피아스코 진행 규칙]
1. 파국과 욕망의 소동극: 거대한 야망을 품었으나 통제력을 잃고 꼬여가는 인물들의 블랙코미디 막장극을 유쾌하고 긴장감 넘치게 전개하십시오.
2. 욕망과 비밀: 동행 인물들과의 치명적인 비밀, 얽히고설킨 빚, 어설픈 범죄 계획이 걷잡을 수 없이 폭주하도록 상황을 몰아가십시오.
- 판정 요구: <!--CHECK: {"stat": "파국 판정", "target": 4, "desc": "상황의 전개"}-->
- 상태 태그: <!--STATUS: {"hp": 10, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[등장인물]
- 이름: ${playerSheet?.name || "문제 인물"} (${playerSheet?.job || "사기꾼"})
${playerSheet?.pastChronicle ? `- 이전 소동극의 업보: ${playerSheet.pastChronicle}` : ""}

[사건 현장]
${scenarioText || "어설픈 범죄가 일어난 소도시"}`;

    } else {
      systemInstruction = `당신은 플레이어의 선택을 유연하게 이끄는 자유 서사 마스터입니다.
${preferenceInstruction}
${commonRules}

- 판정 요구: <!--CHECK: {"stat": "판정명", "target": 12, "desc": "상황 돌파"}-->
- 상태 태그: <!--STATUS: {"hp": ${playerSheet?.hp || 20}, "npcs": ${JSON.stringify(playerSheet?.npcs || [])}, "items": ${JSON.stringify(playerSheet?.items || [])}}-->

[주인공 정보]
- 이름: ${playerSheet?.name || "주인공"} (직업: ${playerSheet?.job || "모험가"})
- HP: ${playerSheet?.hp || 20}/${playerSheet?.maxHp || 20}
- 소지품: ${JSON.stringify(playerSheet?.items || [])}
${playerSheet?.pastChronicle ? `- 계승된 이전 서사: ${playerSheet.pastChronicle}` : ""}

[세계관 배경]
${scenarioText || "자유 샌드박스 세계관"}`;
    }

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    let historyMessages = messages.slice(0, -1);
    if (historyMessages.length > 0 && historyMessages[0].role === "model") {
      historyMessages = historyMessages.slice(1);
    }

    const history = historyMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1].text;

    // RPD 20회 제한 모델을 제외하고, 한도가 넉넉한 3.1 Flash Lite 및 2.0 계열을 1순위로 배치
    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-2.5-flash",
    ];

    let resultText = null;
    let usageData = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
          safetySettings: safetySettings,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        
        if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          resultText = result.response.candidates[0].content.parts[0].text;
        } else {
          resultText = result.response.text();
        }
        
        usageData = result.response.usageMetadata || null;
        if (resultText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!resultText) {
      throw lastError || new Error("사용 가능한 모델을 찾을 수 없습니다.");
    }

    return new Response(JSON.stringify({ text: resultText, usage: usageData }), { status: 200 });
  } catch (error) {
    console.error("서버 에러:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
