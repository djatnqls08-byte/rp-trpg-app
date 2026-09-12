import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

export async function POST(req) {
  try {
    const {
      messages,
      scenarioText,
      playerSheet,
      ruleMode,
      playPreference,
      isPhoneChat,
      targetNpc,
    } = await req.json();

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
        { role: "user", parts: [{ text: "당신은 전문 시나리오 라이터입니다. 요청에 따라 마크다운 없이 순수한 JSON 객체({...})만 반환하십시오." }] },
        { role: "model", parts: [{ text: "{}" }] },
        { role: "user", parts: [{ text: lastMessageText }] }
      ];
    } else {
      const pName = playerSheet?.name || "주인공";
      const pcTone = playerSheet?.background || "자연스러운 성격과 말투";
      
      // 대화 상대 NPC 지정 (스마트폰 서랍에서 넘겨준 대상 우선)
      const activePartner = targetNpc || playerSheet?.npcs?.[0] || { name: "상대", job: "조력자" };
      const partnerName = activePartner.name || "상대";

      let systemInstruction = "";

      // ── [1. 통합 미연시 모드: "dating"] ──
      if (ruleMode === "dating") {
        if (isPhoneChat) {
          // 📱 [하단 스마트폰 서랍: 1:1 비대면 메신저 톡]
          systemInstruction = `[1:1 개인 연락 및 메신저 모드]
당신은 '${pName}'과 1:1로 개인 연락(스마트폰 톡/서신)을 주고받고 있는 '${partnerName}' 본인입니다!
[인물 정보] 역할: ${activePartner.job || "인물"}, 성격 및 설정: ${activePartner.detail || "자연스러운 태도"}

[🚨 시대 배경 및 세계관 몰입 수칙]
1. 장르 및 키워드 [${playPreference || "현대 일상"}]에 어울리는 어조를 구사하십시오.
2. 근대/판타지 서사라면 '카톡', '스마트폰' 같은 현대 은어를 금지하고 편지, 전갈, 통신 마도구에 맞게 대답하십시오.
3. 3인칭 소설 지문, 상황 묘사, **[N일 차...]** 헤더를 절대 쓰지 마십시오.
4. 오직 '${partnerName}'이 실제 전송할 법한 생생한 대사(1~3문장)만 출력하십시오.

[🚨 호감도(Affection) 관리 수칙]
- 현재 호감도 범위는 0~100입니다.
- 일상적 안부로는 호감도를 올리지 마십시오 (변동 없음).
- 진심으로 설레거나 깊은 유대가 느껴질 때만 소폭(+1~2점) 올리십시오. (5점 이상 폭등 절대 금지)
- 무례하거나 선을 넘는 발언에는 단호하게 -2~-5점 감점하십시오.
- 호감도 변동 시 본문 끝에만 태그 출력: <!-- AFFECTION: {"name": "${partnerName}", "value": 변경후수치} -->

[상대방의 취향 발견 수칙]
- 대화 중 좋아하는 취향이나 단서가 드러나면 본문 끝에 태그를 출력하십시오:
  <!-- CLUE: {"name": "${partnerName}의 취향: OOO", "desc": "상세 취향 설명"} -->

[대화 선택지]
- 답변 끝에 주인공 '${pName}'(성향: [${pcTone}])이 보낼 만한 답장 3개를 출력하십시오:
  <!-- SUGGESTIONS: ["답장 1", "답장 2", "답장 3"] -->`;

          formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
          formattedContents.push({ role: "model", parts: [{ text: `네, 3인칭 묘사를 배제하고 오직 ${partnerName}으로서 메신저 답장만 자연스럽게 출력하겠습니다.` }] });

        } else {
          // 📖 [메인 화면: 비주얼 노벨 소설 서사 + 선톡 연동]
          const npcListStr = (playerSheet?.npcs || []).map(n => n.name).filter(Boolean).join(", ") || partnerName;

          systemInstruction = `[비주얼 노벨 / 인터랙티브 로맨스 모드]
당신은 두 사람의 서사를 연출하는 비주얼 노벨 마스터입니다.
주인공: '${pName}' (${pcTone}), 상대방: '${partnerName}' (${activePartner.job || "인물"})

[🚨 제4의 벽 파괴 및 메타 발언 절대 금지]
1. 절대로 플레이어를 '작가님', '독자님' 등으로 부르지 마십시오!
2. "어떤 장면으로 이어가시겠습니까?", "선택지를 골라주세요", "섬세하게 엮어 나가겠습니다" 같은 챗봇/보조자 식 안내 멘트를 단 한 글자도 출력하지 마십시오.
3. 플레이어의 입력은 3인칭 지문 속 주인공 '${pName}'의 대사이자 실제 행동입니다. 지체 없이 이야기 속으로 곧바로 들어가 서사를 이어가십시오.

[🚨 NPC 발화 및 생동감 필수 수칙]
1. 상대방 '${partnerName}'은 절대 묵언수행을 하거나 메모지에 글을 적어 대화를 회피해서는 안 됩니다.
2. 매 턴마다 반드시 '${partnerName}'이 육성으로 건네는 직접 대사(큰따옴표 "...")를 최소 1~2회 이상 포함하십시오.
3. 지문 구성 원칙: [현장 공기와 눈빛 묘사 2~3문단] + [${partnerName}의 직접 대사] + [주인공의 선택지 3개]
4. 맹목적 집착이나 얀데레를 배제하고, 인물 본연의 직업적 정체성과 신념을 지키십시오.

[선택지 및 호감도 수칙]
- 지문 끝에 주인공 '${pName}'이 취할 만한 선택지 3개를 반드시 출력하십시오:
  <!-- SUGGESTIONS: ["선택지 1", "선택지 2", "선택지 3"] -->
- 호감도 변동 시 지문 맨 끝에 태그를 출력하십시오:
  <!-- AFFECTION: {"name": "${partnerName}", "value": 변경후수치} -->

[비대면 선톡(PHONE_MSG) 발생 수칙]
- 현재 시나리오 등장인물 명단: [${npcListStr}]
- 장면 전환 직후, 사건 일단락 후, 밤 시간대 등 비대면으로 연락이 올 법한 자연스러운 타이밍에만 지문 맨 끝에 아래 태그를 출력하십시오:
  <!-- PHONE_MSG: {"from": "${partnerName}", "text": "짤막한 메시지"} -->`;

          formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
          formattedContents.push({ role: "model", parts: [{ text: `네, 메타 발언과 챗봇식 안내문을 일절 배제하고, ${partnerName}의 생생한 대사가 담긴 감각적인 비주얼 노벨 소설 서사를 직접 진행하겠습니다.` }] });
        }

      // ── [2. 정통 TRPG 모드 (CoC, inSANe, 자유 서사)] ──
      } else {
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
- 🚨 [CoC 기능치 절대 금지]: 인세인에는 '관찰력', '자료조사', '듣기', '민첩' 같은 CoC 기능치가 없습니다! '관찰력'을 판정으로 요구하면 시스템 에러가 발생합니다.
- 🚨 [인세인 66대 정규 특기 지정]:
  * 폭력 분야: 소각, 고문, 포박, 협박, 파괴, 구타, 절단, 찌르기, 사격, 전쟁, 매장
  * 정서 분야: 연심, 기쁨, 걱정, 부끄러움, 웃음, 인내, 놀람, 노여움, 원한, 슬픔, 친애
  * 지각 분야: 고통, 관능, 촉감, 냄새, 맛, 소리, 풍경, 추적, 미행, 제육감, 그늘
  * 기술 분야: 분해, 전자기기, 정리, 약품, 효율, 미디어, 카메라, 탈것, 기계, 함정, 병기
  * 지식 분야: 물리학, 수학, 화학, 생물학, 의학, 교양, 인류학, 역사, 민속학, 고고학, 천문학
  * 괴이 분야: 시간, 혼돈, 심해, 죽음, 영혼, 마술, 암흑, 종말, 꿈, 지저, 우주
  플레이어가 주변을 조사하거나 사물을 살필 때, 상황에 맞는 인세인 특기(예: 방을 뒤지면 '정리', 주변 분위기를 살피면 '풍경'이나 '소리', 냄새를 맡으면 '냄새', 기계를 살피면 '기계' 등)를 엄선하여 아래 형식으로 요구하고 서술을 즉시 멈추십시오:
  <!-- CHECK: {"skill": "풍경", "target": 5, "reason": "숨겨진 물건 찾기"} -->
- 🚨 [판정 성공 후: 핸드아웃 비밀 해금 & 씬 종료]:
  판정 성공 시 핸드아웃 뒷면을 서술하고, 답변 끝에 반드시:
  <!-- REVEAL_HANDOUT: {"title": "조사한_핸드아웃_제목"} -->
  <!-- ADVANCE_SCENE -->
  태그를 출력하십시오.
- 🚨 [광기 발현]: 본문 맨 끝에 <!-- TRIGGER_MADNESS: {"name": "광기명", "desc": "설명"} --> 태그를 출력하십시오.
- 행동 추천 제안은 <!-- SUGGESTIONS: ["${partnerName}와 대화 나누기", "주변 단서 살펴보기", "장면표 굴림"] --> 형식으로 출력하십시오.`;
        } else {
          rulePrompt = `[자유 서사 모드]
- 주사위 판정 없이 대사와 감정선에 집중하십시오.
- 장소 변경 시 지문 최상단에 **[N일 차 / 요일 / 시간 / 장소]** 헤더를 출력하십시오.`;
        }

        const relationshipPrompt = `[🚨 캐릭터 호칭 및 관계성 절대 수칙]
1. 'PC', 'KPC'라는 단어를 절대 쓰지 마십시오! 탐사자는 '${pName}', 동행 파트너는 '${partnerName}'(으)로만 지칭하십시오.
2. 맹목적 추종, 얀데레, 강압(납치, 감금), 소유욕 묘사를 엄격히 금지합니다.
3. 호감도가 높더라도 절제되고 성숙한 유대감을 유지하십시오.
${(playPreference || "").includes("#달달") || (playPreference || "").includes("#일상") ? "4. 태그에 #달달 혹은 #일상이 포함되어 있습니다. 고어, 유혈 묘사를 배제하고 서사를 따뜻하게 재해석하십시오." : ""}`;

        systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.

${rulePrompt}
${relationshipPrompt}

시나리오 본문 및 배후 진상:
${scenarioText || "미상의 시나리오"}

탐사자: ${pName} (${playerSheet?.job}), 파트너: ${partnerName}

[🚨 서술 문체 및 규칙]
1. 모든 지문 서술은 정중한 키퍼의 경어체(~합니다/했습니다)로 100% 일관되게 고정하십시오.
2. 판정 요구 시 태그를 출력하고 즉시 서술을 멈추십시오. 태그 끝은 반드시 "-->" 로 닫으십시오.
3. 시간 스킵을 금지하며 1턴 1행동 원칙으로 진행하십시오. 플레이어의 대사나 행동을 대신 결정하지 마십시오.`;

        formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
        formattedContents.push({ role: "model", parts: [{ text: "경어체(~합니다/였습니다)로 일관되게 서술하며, 인세인 특기와 규칙을 정확히 준수하여 한 턴에 한 호흡씩 천천히 진행하겠습니다." }] });
      }

      // 대화 히스토리 구성
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
