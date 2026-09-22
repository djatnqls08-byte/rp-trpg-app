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

    // 🌟 [수정 완료] '서막 요약 절대 금지' 규칙을 다시 강력하게 부활시켰습니다!
    const systemPrompt = `
당신은 TRPG 시나리오 분석 및 캐릭터 시트 파싱 전문가입니다.
제공된 문서(텍스트/이미지)가 '시나리오 원문'이든 '캐릭터 설정(시트) 전용'이든 상관없이, 포함된 정보를 아래의 JSON 포맷에 맞추어 완벽하게 추출하십시오.

[현재 로비에 임시 설정된 기본값]
- PC 기본 이름: ${pcName || '없음'}
- KPC 기본 이름: ${kpcName || '없음'}

[🚨 데이터 추출 절대 규칙 - 엄격 준수]
1. 요약 절대 금지 (도입부/시놉시스): '도입부(openingScene)'와 '시놉시스(publicSynopsis)'는 절대로 짧게 요약하거나 개요식으로 쓰지 마십시오. 원문에 적혀 있는 상세하고 감각적인 소설적 지문(대사, 묘사)을 단 한 줄도 누락하지 말고 최대한 길게 원문 그대로 추출하십시오. (단, 시스템 룰이나 주사위 판정 텍스트만 지우십시오.)
2. 캐릭터 시트 최우선 추출: 문서에 주인공(PC)의 이름이나 설정이 있다면 pcName, pcJob 등에 상세히 추출하십시오.
3. 다수 NPC/KPC 필수 추출: 문서에 'KPC', 'NPC', 파트너 등 등장인물 정보가 있다면 단 1명이라도 반드시 "npcs" 배열 안에 객체로 분리하여 추출하십시오. (단, 로비 기본 KPC 이름과 일치하는 인물은 제외하여 중복을 막으십시오.)
4. 강제 빈칸 규칙: 문서가 캐릭터 시트 전용이라 시나리오 서막이나 진상 내용이 없다면 억지로 지어내지 말고 해당 필드는 강제로 "" (빈 문자열)로 둡니다.

[필수 반환 JSON 구조]
{
  "scenarioTitle": "",
  "publicSynopsis": "시스템 룰 제외, 원문의 상세한 배경 묘사를 요약 없이 길게 추출",
  "openingScene": "시스템 룰 제외, 원문의 소설적 지문과 묘사를 절대 요약하지 말고 최대한 상세히 추출",
  "hiddenTruth": "",
  "pcName": "문서에서 추출한 PC 이름",
  "pcJob": "",
  "pcAge": "",
  "pcGender": "",
  "pcBackground": "",
  "pcMission": "",
  "pcSecret": "",
  "npcs": [
    {
      "name": "문서에서 추출한 NPC 이름",
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
              temperature: 0.1, 
              responseMimeType: "application/json" 
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
