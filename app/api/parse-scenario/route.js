import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

export async function POST(req) {
  try {
    const { rawText, imageData, pcName, kpcName } = await req.json();

    const rawKeys = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) {
      throw new Error("서버에 등록된 API 키가 없습니다.");
    }

    // 🌟 [수정 완료] AI가 헷갈리지 않도록 가장 명확하고 간결한 JSON 스키마로 명령서를 재작성했습니다.
    const systemPrompt = `
당신은 TRPG 데이터 파싱 전문가입니다.
제공된 문서(텍스트/이미지)에서 캐릭터 정보 및 시나리오 정보를 추출하여 반드시 아래의 JSON 포맷에 맞추어 반환하십시오.

[데이터 추출 절대 규칙]
1. 문서에 'PC이름', 'PC직업' 등 PC 정보가 있으면 pcName, pcJob 등의 필드에 추출합니다.
2. 문서에 'KPC1', 'KPC2', 'NPC' 등 등장인물 정보가 있다면 모두 "npcs" 배열 안에 객체로 분리하여 추출합니다.
3. 문서에 시나리오 서막이나 진상 내용이 없다면 해당 필드는 강제로 "" (빈 문자열)로 둡니다.

[필수 반환 JSON 구조]
{
  "scenarioTitle": "",
  "publicSynopsis": "",
  "openingScene": "",
  "hiddenTruth": "",
  "pcName": "",
  "pcJob": "",
  "pcAge": "",
  "pcGender": "",
  "pcBackground": "",
  "pcMission": "",
  "pcSecret": "",
  "npcs": [
    {
      "name": "",
      "job": "",
      "detail": "",
      "secret": ""
    }
  ],
  "handouts": []
}`;

    const promptParts = [{ text: systemPrompt }];
    if (rawText) promptParts.push({ text: `[문서 원문]\n${rawText}` });
    if (imageData) {
      promptParts.push({
        inlineData: { data: imageData.base64, mimeType: imageData.mimeType }
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
            generationConfig: { 
              temperature: 0.1, // 창의성보다는 정확성을 위해 온도를 낮춤
              responseMimeType: "application/json" // 🌟 [핵심] 무조건 JSON 형태로만 답변하도록 강제!
            } 
          });

          responseText = result.response.text();
          if (responseText) break; 
        } catch (err) {
          console.warn(`[Parse Fallback] ${modelName} 실패: ${err.message}`);
          lastError = err;
          continue; 
        }
      }
      if (responseText) break;
    }

    if (!responseText) throw lastError || new Error("API 한도 초과");

    return new Response(responseText, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Scenario Parse Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
