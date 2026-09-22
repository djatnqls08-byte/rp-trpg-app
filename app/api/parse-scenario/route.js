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
    const { rawText, imageData } = await req.json();

    const rawKeys = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) {
      throw new Error("서버에 등록된 API 키(Gemini_API_Key)를 찾을 수 없습니다.");
    }

    // 🌟 [수정 완료] AI가 내용을 함부로 자르지 못하도록 강력한 지침(중요 규칙)을 추가했습니다.
    const systemPrompt = `
당신은 TRPG 시나리오 분석 전문가입니다.
아래에 제공된 시나리오 원문(또는 이미지)을 끝까지 꼼꼼히 읽고, 완벽한 JSON 포맷으로 구조화하여 추출하십시오.

[🚨 매우 중요한 추출 규칙]
1. 요약 금지: '도입부(openingScene)'는 마스터가 플레이어에게 그대로 읽어줄 수 있도록 절대 짧게 요약하지 말고 원문의 지문을 최대한 길고 상세하게 그대로 추출하십시오.
2. 누락 금지: '조사 구역 및 단서(handouts)'는 시나리오에 등장하는 **모든** 조사 장소, 물건, 핸드아웃을 샅샅이 찾아내어 단 하나도 빠짐없이 배열(Array)에 추가하십시오.

[추출해야 할 JSON 구조]
{
  "scenarioTitle": "시나리오의 제목",
  "publicSynopsis": "플레이어에게 공개되는 배경 및 시놉시스 (상세히)",
  "openingScene": "게임이 시작될 때 마스터가 읽어주는 도입부 지문 (원문에 가깝게 생략 없이 상세히)",
  "hiddenTruth": "마스터만 알아야 하는 사건의 진상 및 흑막",
  "kpcName": "파트너(KPC)의 이름 (미상이면 '파트너')",
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
            // 🌟 꼼꼼한 추출을 위해 모델이 길게 대답할 수 있도록 설정
            generationConfig: { temperature: 0.2 } 
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
