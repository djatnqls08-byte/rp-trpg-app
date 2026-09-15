import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      messages = [],
      scenarioText = "",
      playerSheet = {},
      ruleMode = "coc",
      playPreference = "",
      isVoiceCall = false,
      voiceCallNpc = null,
      facingNpc = null,
      targetNpc = null,
      lastStoryContext = "",
      recentEvents = [],
      currentPhase = "낮",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 등록되지 않았습니다." }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const msgList = Array.isArray(messages) ? messages : [];
    const lastMessageText = msgList.length > 0 ? (msgList[msgList.length - 1]?.text || "") : "";
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
      
      // 🎯 대화 상대 확정 (1번 NPC 고정 문제 해결)
      const activePartner = targetNpc || playerSheet?.npcs?.[0] || { name: "상대", job: "조력자" };
      const partnerName = activePartner.name || "상대";
      const currentAffinity = activePartner.affinity ?? activePartner.affection ?? 0;
      const allNpcNames = (playerSheet?.npcs || []).map(n => n.name).filter(Boolean).join(", ") || partnerName;

      // 🧠 최근 기억 및 사건 수첩
      const eventsSummary = (recentEvents && recentEvents.length > 0)
        ? recentEvents.map(e => `  * ${e}`).join("\n")
        : "  * 특별히 기록된 사건 없음";

      // 🌸 장르 태그 및 관계성 원칙
      const prefText = `${playPreference || ""} ${scenarioText || ""}`;
      const isGL = prefText.includes("#GL") || prefText.includes("#백합");
      const isBL = prefText.includes("#BL");
      const isHL = prefText.includes("#HL") || prefText.includes("#헤테로") || prefText.includes("#NL");

      let romanceGenrePrompt = "시나리오 및 캐릭터 시트에 정의된 인물들의 성별, 외모, 관계성 설정을 왜곡 없이 그대로 준수하십시오.";
      if (isGL) {
        romanceGenrePrompt = "현재 태그 [#GL / #백합] 적용 중: 모든 주요 인물은 여성으로 묘사하며, 섬세한 감정선과 유대를 다룹니다.";
      } else if (isBL) {
        romanceGenrePrompt = "현재 태그 [#BL] 적용 중: 중심 인물들은 남성 간의 서사와 감정선을 바탕으로 묘사합니다.";
      } else if (isHL) {
        romanceGenrePrompt = "현재 태그 [#HL / #헤테로] 적용 중: 남녀 간의 서사와 설레는 관계성을 바탕으로 묘사합니다.";
      }

      const coreIdentityPrompt = `
[🚨 절대 서사 원칙 - 관계성 미학 및 캐릭터성 존중]
1. [장르 및 성별 지침]: ${romanceGenrePrompt}
2. 물리적·심리적 강압(납치, 감금, 숭배, 물건 취급, 유치한 소유욕 표현, 폭력적 질투) 및 맹목적인 '얀데레' 묘사를 엄격히 배제합니다.
3. 호감도가 최댓값에 도달하더라도 인물은 독립적인 인격과 직업적 신념을 지키며, PC의 잘못된 행동에는 충고하거나 냉정해질 수 있습니다.
4. 과도한 집착 대신 '눈빛 하나, 스치는 손길에 담긴 농밀한 진심'과 같은 절제되고 깊이 있는 감정선으로 서사를 전개하십시오.

[🚨 절대 규칙 - 임의 시간 스킵 금지]
1. AI는 "몇 시간 뒤", "어느덧 밤이 찾아왔다", "다음 날 아침" 등 임의로 시간을 건너뛰지 마십시오!
2. 시간대와 날짜는 오직 플레이어가 직접 "잠을 잔다", "자리를 뜬다"고 선언했을 때만 전진합니다.

[🚨 절대 규칙 - 갓모딩(God-moding) 금지]
주인공 '${pName}'의 대사, 속마음, 신체적 행동을 AI가 대신 결정하여 서술하지 마십시오.
오직 주변 환경의 변화와 상대방의 대사, 시선, 미세한 기척만을 출력하십시오.
`;

      let systemInstruction = "";

      // ── [1. 미연시 모드: "dating"] ──
      if (ruleMode === "dating") {
        if (isVoiceCall) {
// 📱 [통화 & 대면 관계 판별]
      const curVoiceNpc = (typeof voiceCallNpc !== "undefined" && voiceCallNpc) ? voiceCallNpc : partnerName;
      const curFacingNpc = (typeof facingNpc !== "undefined" && facingNpc) ? facingNpc : null;
      const isFacingSame = curFacingNpc && (curFacingNpc === curVoiceNpc);
      const isLoveTriangle = curFacingNpc && (curFacingNpc !== curVoiceNpc);

      systemInstruction = `${coreIdentityPrompt}
[1:1 실시간 음성 통화 모드]
- 통화 상대(수화기 너머): '${curVoiceNpc}'
- 현장 대면 인물(눈앞의 상대): ${curFacingNpc ? `'${curFacingNpc}'` : "없음 (단독)"}
[상대 정보] 역할: ${activePartner?.job || "인물"}, 현재 호감도: ${currentAffinity}점

[🚨 직전 현장 상황]
"""
${lastStoryContext || "현재 조용한 공간에서 통화 중입니다."}
"""

[상황별 핵심 연출 수칙]
${isFacingSame ? `
★ [대면 중 통화 상황 - 맞은편 상대에게 전화를 건 상태]
플레이어가 눈앞의 '${curVoiceNpc}'에게 전화를 걸었습니다.
- 멀리 떨어진 엉뚱한 장소에서 전화를 받는 묘사를 '절대 금지'합니다.
- 테이블 위나 품속에서 요란하게 울리는 통신구를 내려다보며 어이없어하거나, 흥미롭다는 듯 PC를 빤히 응시하며 전화를 받는 [현장 반응]을 묘사하십시오.
- 예: "(테이블 위에서 울리는 진동을 내려다보며 피식 웃더니, 시선을 들어 당신을 빤히 마주한다.) '……눈앞에 두고 지금 장난하시는 겁니까?'"
` : isLoveTriangle ? `
★ [수라장 / 비밀 통화 상황 - 맞은편 인물 몰래 받는 상태]
플레이어는 눈앞의 '${curFacingNpc}'와 마주 앉아있는 상태에서 수화기 너머의 '${curVoiceNpc}'와 통화하고 있습니다.
- 한 지문 안에 [눈앞 '${curFacingNpc}'의 반응]과 [수화기 너머 '${curVoiceNpc}'의 대사]를 반드시 '동시 서술'하십시오.
- 눈앞의 ${curFacingNpc}: 찻잔을 내려놓고 서늘하게 관찰하거나, 테이블 밑으로 발을 건드리는 등 무언의 압박과 방해를 시도합니다.
- 수화기 너머 ${curVoiceNpc}: 평소처럼 말하다가 현장의 소음이나 PC의 억눌린 숨소리를 눈치채고 의구심을 품습니다.
` : `
★ [단독 원격 통화 상황]
- 시각 묘사를 배제하고 수화기 너머의 소리(숨소리, 침묵, 잡음, 떨림, 한숨, 옷깃 스치는 소리) 등 청각적 묘사에 집중하십시오.
`}

[전화 통화 기본 서술 수칙]
1. 통화 상대의 직접 대사는 큰따옴표("...")로 출력하십시오.
2. 플레이어가 전화를 끊겠다고 하거나 대화가 마무리되면 지문 끝에 통화 종료 태그를 달고, 즉시 통화 묘사를 중단한 채 현장 상황으로 카메라를 복귀시키십시오.

[태그 규칙]
- 호감도 변동 시: <!-- AFFECTION: {"name": "${curVoiceNpc}", "value": 변경후수치} -->
- 통화 종료 시: <!-- END_CALL: {"reason": "종료사유"} -->
- 특이 사건 박제: <!-- EVENT_FLAG: "사건 요약" -->`;

        } else if (isPhoneChat) {
          // 📱 [B. 1:1 메신저 모드]
          systemInstruction = `${coreIdentityPrompt}
[1:1 스마트폰 메신저 모드]
당신은 '${pName}'과 1:1 톡을 주고받고 있는 '${partnerName}' 본인입니다!
[상대 정보] 역할: ${activePartner.job || "인물"}, 현재 호감도: ${currentAffinity}점

[🚨 직전 현장 상황]
"""
${lastStoryContext || "현재 서로 떨어져 각자의 공간에 있습니다."}
"""

[🚨 괄호 ( ), 지문 절대 금지]
1. 괄호 ( ), [ ], 행동 지문, 상황 묘사를 단 한 글자도 출력하지 마십시오.
2. 오직 스마트폰 화면에 전송되는 '순수한 문자 텍스트'만 출력하십시오.

[태그 및 호감도 관리]
- 호감도 범위: -50 ~ 100점 (현재: ${currentAffinity}점)
- 진심 어린 유대 형성 시에만 +1~2점, 무례함에는 -2~-5점 감점.
- 호감도 변동 시: <!-- AFFECTION: {"name": "${partnerName}", "value": 변경후수치} -->
- 상태메시지 변경 시: <!-- STATUS_MSG: {"name": "${partnerName}", "text": "한 줄 문구"} -->
- 폰카 스냅 전송 시: <!-- SNAP_PHOTO: {"caption": "설명", "subject": "영문 사물/풍경 키워드"} -->
- 취향 발견 시: <!-- CLUE: {"name": "${partnerName}의 취향: OOO", "desc": "설명"} -->
- 추천 답장 3개: <!-- SUGGESTIONS: ["답장 1", "답장 2", "답장 3"] -->`;

          formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
          formattedContents.push({ role: "model", parts: [{ text: "괄호 지문 없이 순수 메신저 텍스트와 사진 태그만 전송하겠습니다." }] });

        } else {
          // 📖 [C. 대면 비주얼 노벨 소설 서사]
          let recentPhoneSummary = "";
          if (playerSheet?.phoneChats) {
            const phoneLogs = [];
            const npcs = playerSheet.npcs || [];
            Object.entries(playerSheet.phoneChats).forEach(([contactId, msgs]) => {
              const target = npcs.find(n => String(n.id) === String(contactId));
              const cName = target?.name || "상대방";
              (msgs || []).slice(-6).forEach(m => {
                phoneLogs.push(`- ${m.sender === "user" ? pName : cName}: "${m.text}"`);
              });
            });
            if (phoneLogs.length > 0) {
              recentPhoneSummary = `\n[📱 최근 메신저 내역]\n${phoneLogs.join("\n")}`;
            }
          }

          systemInstruction = `${coreIdentityPrompt}
[비주얼 노벨 / 인터랙티브 로맨스 모드]
당신은 두 사람의 관계를 이끄는 비주얼 노벨 마스터입니다.
- 주인공: '${pName}' (${pcTone})
- 현재 대면 상대: '${partnerName}' (${activePartner.job || "인물"}, 현재 호감도: ${currentAffinity}점)
- 전체 등장인물 명단: [${allNpcNames}]
- 현재 시간대: [${currentPhase}]
- 최근 기억 및 사건 수첩:
${eventsSummary}
${recentPhoneSummary}

[🚨 대면 서사 진행 및 발화 지침]
1. 상대방 '${partnerName}'은 방관하지 않고 주인공의 말과 행동에 섬세하게 반응하십시오.
2. [발화 설정 분기]:
   - 말을 할 수 있는 인물: 반드시 직접 대사("...")로 반응하십시오.
   - 말을 못 하거나 필담/수어를 쓰는 인물: 억지로 말을 시키지 말고, 메모장 필담('...'), 수어, 미세한 눈빛, 스치는 손길 등 농밀한 비언어적 교감으로 서술하십시오.
3. 호감도 범위는 -50 ~ 100점입니다.
4. 지문 구성: [현장 공기감과 인물의 미세 반응 2~3문단] + [${partnerName}의 직접 대사 혹은 필담]

[🚨 필수 시스템 태그 규칙 (지문 맨 끝에 단독 출력)]
1. 호감도 변동 시: <!-- AFFECTION: {"name": "${partnerName}", "value": 변경후수치} -->
2. 인물이 헤어지거나 자리를 뜰 때 (장소 선택지 3개):
   <!-- LOCATION_CARDS: [{"name": "장소명", "desc": "분위기 묘사", "npc": "등장인물"}] -->
3. 다음 날 약속 성립 시: <!-- APPOINTMENT: {"npc": "${partnerName}", "place": "약속 장소", "time": "내일 낮"} -->
4. 번호/명함 교환 시: <!-- UNLOCK_CONTACT: {"name": "${partnerName}"} -->
5. 비대면 선톡 도착 시: <!-- PHONE_MSG: {"from": "${partnerName}", "text": "짧은 메시지"} -->
6. 실시간 전화 수신 발동 시: <!-- INCOMING_CALL: {"caller": "발신인물명", "urgent": false} -->
7. 특이 사건/실수 박제 시: <!-- EVENT_FLAG: "사건 요약문" -->
8. 신규 인물 첫 등장 시: <!-- NEW_NPC: {"name": "인물명", "job": "역할", "detail": "외모/성격"} -->
9. 공식 16:9 CG 해금 시: <!-- UNLOCK_CG: {"id": "CG아이디", "title": "제목"} -->
10. 최종 결말 도달 시: <!-- ENDING: {"type": "TRUE", "title": "엔딩 제목"} -->
11. 주인공의 3지선다 선택지: <!-- SUGGESTIONS: ["선택지 1", "선택지 2", "선택지 3"] -->`;

          formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
          formattedContents.push({ role: "model", parts: [{ text: `네, 1번 NPC 고정 없이 [${partnerName}]과의 대면 서사에 몰입하며 시간 스킵 없이 정갈하게 진행하겠습니다.` }] });
        }

      // ── [2. 정통 TRPG 모드 (CoC, inSANe, 자유 서사)] ──
      } else {
        const currentCycle = playerSheet?.cycle || 1;
        const currentScene = playerSheet?.scene || 1;
        const limitCycle = playerSheet?.limit || 4;
        const currentPhaseVal = playerSheet?.phase || "MAIN";

        let rulePrompt = "";
        if (ruleMode === "coc") {
          rulePrompt = `[크툴루의 부름 7판 CoC 진행 수칙]
- 단서 탐색 시 판정 태그 출력 후 서술 중단: <!-- CHECK: {"skill": "기능명", "target": 수치, "reason": "이유"} -->
- 물리적 탐색 구역: <!-- SPOTS: [{"name": "오브젝트", "stat": "기능명"}] -->
- 이성(SAN) 체크: <!-- SAN_CHECK: {"lossSuccess": "0", "lossFail": "1d4", "reason": "원인"} -->
- 아이템 획득: <!-- ACQUIRE_ITEM: {"name": "아이템명", "desc": "설명"} -->`;
        } else if (ruleMode === "insane") {
          rulePrompt = `[멀티 호러 TRPG 인세인(inSANe) 정규 수칙]
진행 상태: ${currentPhaseVal} 페이즈 | ${currentCycle}사이클 / ${currentScene}씬 (리미트: ${limitCycle})
- 영어 병기 금지, 한국어 정규 용어(성공, 실패, 펌블, 쇼크, 공포 판정, 착란 등)만 사용하십시오.
- 도입 페이즈 판정 요구 금지, 66대 정규 특기만 사용.
- 조사 판정 요구: <!-- CHECK: {"skill": "지정특기명", "target": 5, "type": "INVESTIGATION", "targetName": "대상명"} -->
- 비밀 해금: <!-- REVEAL_HANDOUT: {"title": "제목"} --> / <!-- SHOCK: {"target": "${pName}", "skill": "특기명"} -->
- 감정 판정: <!-- EMOTION: {"target": "${partnerName}"} -->
- 마스터 장면: <!-- MASTER_SCENE: {"title": "사건명"} -->
- 광기 발현: <!-- TRIGGER_MADNESS: {"name": "광기명", "desc": "설명"} -->
- 장면 전환: <!-- ADVANCE_SCENE -->`;
        } else {
          rulePrompt = `[자유 서사 모드]
- 주사위 판정 없이 문학적인 대사와 감정선에 집중하십시오.
- 위기 시 선택적 판정 요구: <!-- CHECK: {"action": "행동", "target": 10} -->`;
        }

        const relationshipPrompt = `[🚨 캐릭터 호칭 및 관계성 절대 수칙]
1. 'PC', 'KPC' 금지. 주인공은 '${pName}', 동행 파트너는 '${partnerName}'(으)로만 지칭하십시오.
${(playPreference || "").includes("#달달") || (playPreference || "").includes("#일상") ? "2. 고어/유혈 묘사를 배제하고 따뜻하게 재해석하십시오." : ""}`;

        systemInstruction = `당신은 탁월한 텍스트 TRPG의 마스터(Keeper)입니다.

${coreIdentityPrompt}
${rulePrompt}
${relationshipPrompt}

시나리오 본문 및 배후 진상:
${scenarioText || "미상의 시나리오"}

주인공: ${pName} (${playerSheet?.job || "탐사자"}), 파트너: ${partnerName}
현재 시간대: [${currentPhase}]
최근 기억:
${eventsSummary}

[🚨 서술 문체 및 규칙]
1. 모든 지문 서술은 정중한 경어체(~합니다/했습니다)로 100% 일관되게 서술하십시오.
2. 판정 요구 시 태그 출력 후 서술을 즉시 멈추십시오.
3. 임의 시간 스킵 금지 및 1턴 1행동 원칙 준수.`;

        formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
        formattedContents.push({ role: "model", parts: [{ text: "경어체로 일관되게 서술하며 정규 룰을 준수하여 진행하겠습니다." }] });
      }

      // 🌟 대화 히스토리 슬라이싱 최적화 (최근 20턴)
      const recentHistory = msgList.slice(-20);

      for (const m of recentHistory) {
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

    // 메신저 모드 괄호 묘사 강제 제거
    if (isPhoneChat && responseText) {
      responseText = responseText
        .replace(/^\s*\([\s\S]*?\)\s*/g, "")
        .replace(/^\s*\[[\s\S]*?\]\s*/g, "")
        .trim();
    }

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
