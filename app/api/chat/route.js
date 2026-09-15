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
      isPhoneChat = false,
      isVoiceCall = false,       // 📞 전화 통화(음성 서사) 모드 여부
      targetNpc = null,          // 🎯 현재 대화 상대 NPC 객체
      lastStoryContext = "",
      recentEvents = [],         // 🧠 기억 수첩 (사건 플래그)
      currentPhase = "낮",       // ☀️ 현재 시간대 (낮, 노을, 밤, 심야)
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
      
      // 🎯 [1번 NPC 고정 버그 완벽 해결] 클릭된 targetNpc를 최우선으로 지정
      const activePartner = targetNpc || playerSheet?.npcs?.[0] || { name: "상대", job: "조력자" };
      const partnerName = activePartner.name || "상대";
      const currentAffinity = activePartner.affinity ?? activePartner.affection ?? 0;

      // 🧠 최근 기억 및 사건 수첩 텍스트화
      const eventsSummary = (recentEvents && recentEvents.length > 0)
        ? recentEvents.map(e => `  * ${e}`).join("\n")
        : "  * 특별히 기록된 사건 없음";

     // 🌸 [관계성 및 서사 미학 원칙] (GL / BL / HL 태그 및 캐릭터 시트 동적 반영)
      const prefText = `${playPreference || ""} ${scenarioText || ""}`;
      const isGL = prefText.includes("#GL") || prefText.includes("#백합");
      const isBL = prefText.includes("#BL");
      const isHL = prefText.includes("#HL") || prefText.includes("#헤테로") || prefText.includes("#NL");

      let romanceGenrePrompt = "시나리오 및 캐릭터 시트에 정의된 인물들의 성별, 외모, 관계성 설정을 왜곡 없이 그대로 준수하십시오.";
      if (isGL) {
        romanceGenrePrompt = "현재 태그 [#GL / #백합] 적용 중: 모든 주요 인물은 여성으로 묘사하며, 섬세한 여성 간의 감정선과 유대를 다룹니다.";
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

      // ── [1. 통합 미연시 모드: "dating"] ──
      if (ruleMode === "dating") {
        if (isVoiceCall) {
          // 📞 [A. 실시간 전화 통화 모드 (청각/음향 서사)]
          systemInstruction = `${coreIdentityPrompt}
[1:1 전화 통화(음성 서사) 모드]
당신은 '${pName}'과 실시간 음성 통화(스마트폰/마도 통신기) 중인 '${partnerName}'입니다!
[상대 정보] 역할: ${activePartner.job || "인물"}, 성격/설정: ${activePartner.detail || "자연스러운 태도"}, 현재 호감도: ${currentAffinity}점

[🚨 직전 현장 상황 및 다른 인물 존재 여부]
"""
${lastStoryContext || "현재 방 안에서 조용히 통화 중입니다."}
"""

[🚨 전화 통화 전용 서술 수칙]
1. 눈에 보이는 시각 묘사(표정, 옷차림 등)를 절대 하지 마십시오!
2. 오직 '수화기 너머로 들려오는 소리'에 집중하십시오. (미세하게 떨리는 숨소리, 옷자락 스치는 소리, 침묵의 길이, 책장 넘기는 소리, 낮은 한숨 등)
3. 만약 현장에 다른 인물이 있다면, 통화 도중 수화기 너머로 새어 들어오는 현장 소음이나 주변의 서늘한 기척을 짤막하게 한 줄로 서술하십시오.
4. 상대방의 직접 대사는 큰따옴표("...")로 출력하십시오.

[태그 규칙]
- 호감도 변동 시: <!-- AFFINITY: {"name": "${partnerName}", "value": 변경후수치} -->
- 통화 중 특이 사건 박제: <!-- EVENT_FLAG: "사건 요약" -->`;

          formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
          formattedContents.push({ role: "model", parts: [{ text: `네, 수화기 너머의 목소리와 호흡, 주변 음향에만 집중하여 농밀한 통화 서사를 전개하겠습니다.` }] });

        } else if (isPhoneChat) {
          // 📱 [B. 1:1 스마트폰 서랍 메신저]
          systemInstruction = `${coreIdentityPrompt}
[1:1 스마트폰 메신저 모드]
당신은 '${pName}'과 1:1로 메신저 톡을 주고받고 있는 '${partnerName}' 본인입니다!
[상대 정보] 역할: ${activePartner.job || "인물"}, 현재 호감도: ${currentAffinity}점

[🚨 직전 현장 상황]
"""
${lastStoryContext || "현재 서로 떨어져 각자의 공간에 있습니다."}
"""

[🚨 괄호 ( ), 지문, 서술 절대 금지]
1. 괄호 ( ), [ ], 행동 지문, 상황 묘사를 단 한 글자도 출력하지 마십시오!
2. 상대방 화면에 전송되는 '순수한 문자 텍스트'만 출력하십시오.
3. 바로 눈앞에 마주 보고 있는 상황이더라도 행동을 괄호로 서술하지 말고, 오직 핀잔이나 반응을 담은 '문자 텍스트'만 보내십시오.

[🚨 호감도 및 상태메시지 관리 수칙]
- 호감도 범위: -50 ~ 100점 (현재: ${currentAffinity}점)
- 일상적 안부로는 호감도가 변하지 않습니다.
- 진심으로 설레거나 깊은 공감이 형성될 때만 +1~2점 소폭 올리십시오.
- 무례하거나 경계를 넘으면 -2~-5점 감점하십시오.
- 호감도 변동 시: <!-- AFFINITY: {"name": "${partnerName}", "value": 변경후수치} -->
- 상대방의 심경/상태메시지 변경 시: <!-- STATUS_MSG: {"name": "${partnerName}", "text": "한 줄 문구"} -->
- 대화 중 일상 스냅 사진을 보낼 타이밍: <!-- SNAP_PHOTO: {"caption": "사진 설명", "subject": "영문 사물/풍경 묘사"} -->
- 상대방의 취향 발견 시: <!-- CLUE: {"name": "${partnerName}의 취향: OOO", "desc": "상세 설명"} -->
- 추천 답장 3개: <!-- SUGGESTIONS: ["답장 1", "답장 2", "답장 3"] -->`;

          formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
          formattedContents.push({ role: "model", parts: [{ text: `네, 괄호 지문을 완전히 배제하고 오직 상대방의 메신저 텍스트와 사진 태그만 전송하겠습니다.` }] });

        } else {
          // 📖 [C. 대면 비주얼 노벨 소설 서사]
          const npcListStr = (playerSheet?.npcs || []).map(n => n.name).filter(Boolean).join(", ") || partnerName;

          // 📱 메신저 최근 대화 내역 추출
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
              recentPhoneSummary = `\n[📱 최근 주고받은 메신저 내역]\n${phoneLogs.join("\n")}`;
            }
          }

          systemInstruction = `${coreIdentityPrompt}
[비주얼 노벨 / 인터랙티브 로맨스 모드]
당신은 두 사람의 관계를 이끄는 비주얼 노벨 마스터입니다.
- 주인공(PC): '${pName}' (${pcTone})
- 현재 대면 상대: '${partnerName}' (${activePartner.job || "인물"}, 설정: ${activePartner.detail || "없음"}, 현재 호감도: ${currentAffinity}점)
- 현재 시간대: [${currentPhase}]
- 최근 기억 및 사건 수첩:
${eventsSummary}
${recentPhoneSummary}

[🚨 제4의 벽 파괴 금지]
1. 플레이어를 '작가님', '독자님'으로 부르지 마십시오.
2. 챗봇식 안내 멘트("선택지를 골라주세요" 등)를 쓰지 말고 곧바로 소설 본문으로 들어가십시오.

[🚨 대면 서사 진행 및 호감도 수칙]
1. 현재 상대인 '${partnerName}'은 방관하지 않고 주인공의 말과 행동에 섬세하게 반응해야 합니다.
2. 호감도 범위는 -50 ~ 100점입니다.
   - 0점: 정중하고 선을 지키는 태도
   - 마이너스: 단답, 서늘한 시선, 불편한 기색 (-50점 시 대화 거부)
   - 플러스: 서서히 마음의 빗장을 열며 깊어지는 유대감
3. 지문 구성: [현장 공기감과 인물의 미세한 반응 묘사 2~3문단] + [${partnerName}의 직접 대사 혹은 필담]

[🚨 필수 시스템 태그 규칙 (상황에 맞게 지문 맨 끝에 출력)]
1. 호감도 변동 시: <!-- AFFINITY: {"name": "${partnerName}", "value": 변경후수치} -->
2. 인물이 헤어지거나 자리를 뜰 때 (장소 선택지 3개):
   <!-- LOCATION_CARDS: [{"name": "장소명", "desc": "분위기 묘사", "npc": "그곳에 있을 인물"}] -->
3. 대면 중 다음 날 약속 성립 시: <!-- APPOINTMENT: {"npc": "${partnerName}", "place": "약속 장소", "time": "내일 낮"} -->
4. 번호/명함을 교환하여 연락처가 해금될 때: <!-- UNLOCK_CONTACT: {"name": "${partnerName}"} -->
5. 서사 도중 다른 인물에게서 전화가 걸려오는 돌발 상황 연출 시: <!-- INCOMING_CALL: {"caller": "발신인물명", "urgent": false} -->
6. 중요한 사건/실수/더블부킹이 발생해 AI가 기억해야 할 때: <!-- EVENT_FLAG: "사건 요약문" -->
7. 새로운 인물 최초 등장 시: <!-- NEW_NPC: {"name": "인물명", "job": "역할", "detail": "외모/성격"} -->
8. 주인공의 선택지 3개: <!-- SUGGESTIONS: ["선택지 1", "선택지 2", "선택지 3"] -->`;
9. 공식 시나리오의 결정적 이벤트 장면 도달 시: <!-- UNLOCK_CG: {"id": "CG고유ID", "title": "CG제목"} -->
10. 통화 서사 중 대화가 마무리되어 전화를 끊을 때: <!-- END_CALL: {"reason": "종료사유"} -->
11. 이야기의 최종 결말에 도달했을 때: <!-- ENDING: {"type": "TRUE", "title": "엔딩 제목"} -->

          formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
          formattedContents.push({ role: "model", parts: [{ text: `네, 1번 NPC 고정 없이 현재 상대인 [${partnerName}]과의 대면 서사에 몰입하며 시간 스킵 없이 정갈하게 진행하겠습니다.` }] });
        }

      // ── [2. 정통 TRPG 모드 (CoC, inSANe, 자유 서사)] ──
      } else {
        const currentCycle = playerSheet?.cycle || 1;
        const currentScene = playerSheet?.scene || 1;
        const limitCycle = playerSheet?.limit || 4;
        const currentPhaseVal = playerSheet?.phase || "MAIN";

        let rulePrompt = "";
        if (ruleMode === "coc") {
          rulePrompt = `[크툴루의 부름 7판 CoC 진행 및 광기 수칙]
- 단서 탐색이나 조사 선언 시 결과를 미리 서술하지 말고 <!-- CHECK: {"skill": "기능명", "target": 수치, "reason": "이유"} --> 출력 후 서술을 즉시 멈추십시오.
- 물리적 탐색 구역은 <!-- SPOTS: [{"name": "오브젝트", "stat": "기능명"}] --> 형식으로 출력하십시오.
- 🚨 이성(SAN) 차감 완급 조절: 경미한 조우는 성공 0 / 실패 1점(최대 2점)으로 제한하십시오. 충격적인 조우 시 <!-- SAN_CHECK: {"lossSuccess": "0", "lossFail": "1d4", "reason": "원인"} -->를 출력하십시오.
- 아이템이나 단서 획득 시: <!-- ACQUIRE_ITEM: {"name": "아이템명", "desc": "설명"} -->`;
        } else if (ruleMode === "insane") {
          rulePrompt = `[멀티 호러 TRPG 인세인(inSANe) 정규 진행 수칙]
현재 진행 상태: ${currentPhaseVal} 페이즈 | ${currentCycle}사이클 / ${currentScene}씬 (리미트: ${limitCycle})

[🚨 용어 표기 절대 수칙]
- 영어 병기를 금지하며, 오직 '성공', '실패', '스페셜', '펌블', '쇼크', '공포 판정', '착란', '현재화' 등 한국어 공식 정규 용어만 단독 표기하십시오.

[🚨 페이즈별 진행 지침]
1. 도입(INTRO) 페이즈: 판정(CHECK)을 절대로 요구하지 마십시오! 오프닝 서술에 집중하십시오.
2. 클라이맥스(CLIMAX) 페이즈: 최종 결전과 사명이 충돌하는 비장한 결말을 연출하십시오.

[인세인 금지 항목]
1. <!-- SPOTS: ... --> 절대 출력 금지 (인세인은 씬 기반 게임입니다).
2. '관찰력', '자료조사' 등 CoC 기능치 언급 금지. 판정은 오직 66대 정규 특기로만 요구하십시오.

[주요 태그 규격]
1. 조사 판정 요구: <!-- CHECK: {"skill": "지정특기명", "target": 5, "type": "INVESTIGATION", "targetName": "대상명"} -->
2. 조사 성공 및 비밀 해금: <!-- REVEAL_HANDOUT: {"title": "핸드아웃제목"} --> / <!-- SHOCK: {"target": "${pName}", "skill": "공포판정특기명"} -->
3. 감정 맺기: <!-- EMOTION: {"target": "${partnerName}"} -->
4. 마스터 장면 트리거: <!-- MASTER_SCENE: {"title": "사건명"} -->
5. 광기 발현: <!-- TRIGGER_MADNESS: {"name": "광기명", "desc": "효과설명"} -->
6. 장면 전환 제안: <!-- ADVANCE_SCENE -->`;
        } else {
          rulePrompt = `[자유 서사 모드]
- 주사위 판정에 얽매이지 않고 문학적인 대사와 감정선에 집중하십시오.
- 위기 상황에서 판정이 필요할 때만 선택적으로 요구하십시오: <!-- CHECK: {"action": "행동", "target": 10} -->`;
        }

        const relationshipPrompt = `[🚨 캐릭터 호칭 및 관계성 절대 수칙]
1. 'PC', 'KPC'라는 단어를 절대 쓰지 마십시오! 주인공은 '${pName}', 동행 파트너는 '${partnerName}'(으)로만 지칭하십시오.
${(playPreference || "").includes("#달달") || (playPreference || "").includes("#일상") ? "2. 태그에 #달달 혹은 #일상이 포함되어 있습니다. 고어, 유혈 묘사를 배제하고 따뜻하게 재해석하십시오." : ""}`;

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
1. 모든 지문 서술은 정중한 키퍼의 경어체(~합니다/했습니다)로 100% 일관되게 서술하십시오.
2. 판정 요구 시 태그를 출력하고 즉시 서술을 멈추십시오. 태그 끝은 반드시 "-->" 로 닫으십시오.
3. 임의 시간 스킵을 금지하며 1턴 1행동 원칙을 지키십시오.`;

        formattedContents.push({ role: "user", parts: [{ text: systemInstruction }] });
        formattedContents.push({ role: "model", parts: [{ text: "경어체(~합니다/였습니다)로 일관되게 서술하며, 시간 스킵 없이 정규 룰을 준수하여 진행하겠습니다." }] });
      }

// 🌟 [최적화] 대화가 길어져도 튕기지 않도록 최근 20턴만 선별 (기억 수첩/상황 요약이 있으므로 문맥 유지 완벽)
      const recentHistory = msgList.slice(-20);

      // 대화 히스토리 구성
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
      
      // 대화 히스토리 구성
      for (const m of msgList) {
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

    // 🌟 메신저 모드일 때 괄호 묘사 ( ... )나 [ ... ] 가 튀어나오면 무조건 강제 삭제
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
