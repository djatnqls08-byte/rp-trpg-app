import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // 🌟 프론트엔드에서 텍스트(rawText) 또는 이미지(imageData)를 받습니다.
    const { rawText, imageData } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API 키가 설정되지 않았습니다.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

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

    // 🌟 AI에게 전달할 데이터 꾸러미를 준비합니다.
    const promptParts = [{ text: systemPrompt }];
    
    // 텍스트가 있으면 텍스트 추가
    if (rawText) {
      promptParts.push({ text: `[시나리오 원문]\n${rawText}` });
    }
    // 🌟 이미지가 있으면 이미지 데이터 추가 (Gemini가 눈으로 직접 읽습니다!)
    if (imageData) {
      promptParts.push({
        inlineData: {
          data: imageData.base64,
          mimeType: imageData.mimeType
        }
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
      generationConfig: { temperature: 0.2 } 
    });

    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    return new Response(responseText, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Scenario Parse Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
