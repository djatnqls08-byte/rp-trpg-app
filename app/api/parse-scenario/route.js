import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";

// 유저님의 설정: 빠르고 가벼운 모델부터 순차적으로 시도
const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

export async function POST(req) {
  try {
    // 🌟 프론트엔드에서 보낸 캐릭터 정보를 받아옵니다.
    const { rawText, imageData, pcName, kpcName, kpcDetail, playPreference } = await req.json();

    const rawKeys = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) {
      throw new Error("서버에 등록된 API 키(Gemini_API_Key)를 찾을 수 없습니다.");
    }

    // 🌟 맞춤형 서사 개변 및 메타 텍스트 필터링을 지시하는 강력한 프롬프트
    const systemPrompt = `
당신은 TRPG 시나리오 분석 및 서사 개변(Adaptation) 전문가입니다.
아래에 제공된 시나리오 원문(또는 이미지)을 꼼꼼히 읽고, 주어진 [캐릭터 정보]를 바탕으로 텍스트를 두 사람의 관계성에 맞게 완전히 재창조하여 JSON 포맷으로 추출하십시오.

[주인공(PC) 및 파트너(KPC) 정보]
- PC 이름: ${pcName || '탐사자'}
- KPC 이름: ${kpcName || 'KPC'}
- KPC 설정 및 관계: ${kpcDetail || '알 수 없음'}
- 플레이 태그: ${playPreference || '기본'}

[🚨 서사 개변 및 추출 규칙]
1. 완벽한 관계성 맞춤 개변: '시놉시스(publicSynopsis)'와 '도입부(openingScene)'를 작성할 때, 원문의 '탐사자', 'KPC', '당신'이라는 단어를 제거하고 제공된 실제 이름(${pcName}, ${kpcName})과 관계성 설정을 녹여내어 자연스러운 한 편의 소설처럼 묘사하십시오.
2. 한국어 문법 및 조사 완벽 교정: 이름을 대입했을 때 조사가 어색해지지 않도록 문맥을 완전히 다듬으십시오. 
3. 시스템 룰 완벽 제거: 주사위 판정(예: 관찰력 판정), 이성 수치(SAN 1/1D3) 감소 등 TRPG 시스템 룰과 메타 텍스트를 완전히 삭제하고 오직 몰입감 있는 이야기 지문만 남기십시오. 절대 짧게 요약하지 말고 원문의 분위기를 살려 길게 서술하십시오.
4. 누락 금지: '조사 구역(handouts)'은 시나리오에 등장하는 모든 단서를 샅샅이 찾아내어 단 하나도 빠짐없이 배열(Array)에 추가하십시오.

[추출해야 할 JSON 구조]
{
  "scenarioTitle": "시나리오의 제목",
  "publicSynopsis": "두 사람의 서사에 맞게 개변된 시놉시스 (시스템 룰 제외, 상세히)",
  "openingScene": "두 사람의 관계성이 반영된 완벽한 소설적 도입부 지문 (시스템 룰 완벽 제거, 길고 상세히)",
  "hiddenTruth": "마스터만 알아야 하는 사건의 진상 및 흑막",
  "kpcName": "${kpcName}",
  "kpcDetail": "파트너의 외모, 성격, 플레이어와의 관계성 요약",
  "kpcSecret": "파트너가 숨기고 있는 은밀한 진심이나 비밀",
  "handouts": [
    { 
      "title": "단서명 또는 조사 구역명", 
      "overview": "겉으로 보이는 단서 묘사 (상세히)", 
      "secret": "조사 시 밝혀지는 비밀 (상세히)" 
    }
  ]
}`;

    const promptParts = [{ text: systemPrompt }];
    
    if (rawText) {
      promptParts.push({ text: `[시나리오 원문]\n${rawText}` });
    }
    if (imageData) {
      promptParts.push({
        inlineData: {
          data: imageData.base64,
          mimeType: imageData.mimeType
        }
      });
    }

    let responseText = null;
    let lastError = null;
    const shuffledKeys = [...apiKeys].sort(() => Math.random() - 0.5);

    for (const currentKey of shuffledKeys) {
      const genAI = new GoogleGenerativeAI(currentKey);

      for (const modelName of FALLBACK_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [{ role: "user", parts: promptParts }],
            generationConfig: { temperature: 0.3 } 
          });

          responseText = result.response.text();
          if (responseText) break; 

        } catch (err) {
          console.warn(`[Parse Fallback] 키(${currentKey.slice(0, 6)}...) - ${modelName} 모델 실패: ${err.message}`);
          lastError = err;
          continue; 
        }
      }
      if (responseText) break;
    }

    if (!responseText) {
      throw lastError || new Error("모든 API 키 및 예비 모델의 한도가 초과되었습니다.");
    }

    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    return new Response(responseText, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Scenario Parse Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
