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

   // 🌟 [수정 완료] 기존 KPC와의 충돌을 막기 위해 추출 규칙을 다듬었습니다.
    const systemPrompt = `
당신은 TRPG 시나리오 분석 및 캐릭터 시트 데이터 추출 전문가입니다.
제공된 텍스트(또는 이미지)를 완벽한 JSON 포맷으로 분석 및 추출하십시오.

[현재 로비에 임시 설정된 기본값]
- PC 기본 이름: ${pcName || '없음'}
- KPC 기본 이름: ${kpcName || '없음'}

[다수 캐릭터 인식 특수 규칙]
1. PC 추출: 문서의 'PC이름' 항목을 찾아 정확히 "pcName" 필드에 넣으십시오.
2. NPC/기타 인물 추출: 문서에 등장하는 조연, 흑막, KPC의 환영 등 모든 주요 인물을 "npcs" 배열 안에 객체로 분리하여 추출하십시오.
   - 단, 문서에 '[${kpcName}]'와 동일한 이름의 인물이 등장한다면, 해당 인물의 설정은 추출하지 말고 "npcs" 배열에서 제외하십시오. (로비의 기존 데이터를 유지하기 위함입니다.)
3. 문서 유형 파악: 캐릭터 설정(시트)만 존재하고 시나리오 서막/시놉시스가 없는 문서일 경우, 시나리오 관련 필드는 강제로 빈 문자열("")로 처리하십시오.

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
