import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";

// 🌟 유저님이 설계하신 완벽한 우선순위! (Lite 모델 최우선)
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

    const systemPrompt = `
당신은 TRPG 시나리오 분석 전문가입니다.
아래에 제공된 시나리오 원문(또는 이미지)을 읽고, 완벽한 JSON 포맷으로 구조화하여 추출하십시오.
이미지가 제공된 경우, 이미지 속의 텍스트를 읽고 분석하십시오.
마크다운(\`\`\`json 등)이나 부연 설명 없이 오직 순수한 JSON 객체({...})만 반환해야 합니다.

[추출해야 할 JSON 구조]
{
  "scenarioTitle": "시나리오의 제목",
  "publicSynopsis": "플레이어에게 공개되는 배경 및 시놉시스 요약",
  "openingScene": "게임이 시작될 때 마스터가 읽어주는 도입부 지문",
  "hiddenTruth": "마스터만 알아야 하는 사건의 진상 및 흑막",
  "kpcName": "파트너(KPC)의 이름 (미상이면 '파트너')",
  "kpcDetail": "파트너의 외모, 성격, 플레이어와의 관계성 요약",
  "kpcSecret": "파트너가 숨기고 있는 은밀한 진심이나 비밀",
  "handouts": [
    { "title": "단서명", "overview": "겉으로 보이는 단서 묘사", "secret": "조사 시 밝혀지는 비밀" }
  ]
}`;

    // AI에게 전달할 데이터 꾸러미 준비
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

    // 🌟 1. API 키 섞기 (로드 밸런싱)
    const shuffledKeys = [...apiKeys].sort(() => Math.random() - 0.5);

    for (const currentKey of shuffledKeys) {
      const genAI = new GoogleGenerativeAI(currentKey);

      // 🌟 2. 유저님의 1순위(Lite) 모델부터 차례대로 시도합니다!
      for (const modelName of FALLBACK_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [{ role: "user", parts: promptParts }],
            generationConfig: { temperature: 0.2 } 
          });

          responseText = result.response.text();
          
          // 성공적으로 답변을 받았으면 반복문 즉시 탈출!
          if (responseText) break; 

        } catch (err) {
          console.warn(`[Parse Fallback] 키(${currentKey.slice(0, 6)}...) - ${modelName} 모델 실패: ${err.message}`);
          lastError = err;
          // 한도 초과(429 에러) 등이 발생하면 멈추지 않고 다음 모델(Lite -> Flash)로 넘어갑니다.
          continue; 
        }
      }
      
      // 첫 번째 API 키에서 성공했다면 다음 키는 시도하지 않습니다.
      if (responseText) break;
    }

    // 모든 키와 모델을 다 돌았는데도 실패한 경우
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
