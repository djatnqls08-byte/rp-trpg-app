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
    // 🌟 프론트엔드에서 보낸 ruleMode를 받아옵니다.
    const { rawText, imageData, pcName, kpcName, kpcDetail, playPreference, ruleMode } = await req.json();

    const rawKeys = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) {
      throw new Error("서버에 등록된 API 키가 없습니다.");
    }

// 🌟 현재 선택된 룰에 따라 AI에게 내리는 특수 명령을 다르게 설정합니다.
    const isDatingSim = ruleMode === "dating" || ruleMode === "dating_msg";
    
    const modeSpecificRules = isDatingSim 
      ? `1. 미연시 원본 스크립트 보존 (개변 금지): 이 문서는 대사와 지문이 정해져 있는 미연시 스크립트입니다. '도입부(openingScene)'를 추출할 때, 소설처럼 과도하게 윤색하거나 문장을 새로 지어내지 마십시오. 오직 'KPC', 'PC' 등의 단어만 제공된 실제 이름(${pcName}, ${kpcName})으로 치환하고, 원래 정해진 대사와 지문의 형태를 100% 그대로 추출하십시오.`
      : `1. TRPG 맞춤 개변 및 호흡 조절 (급전개 방지): 제공된 캐릭터 관계성을 반영하되, 여러 사건을 하나의 문단에 성급하게 압축하지 마십시오. 평온한 순간과 위기가 닥치는 순간 사이의 간극을 살려 섬세하고 절제된 문장으로 묘사하십시오. 장면이 전환되거나 새로운 인물이 등장할 때는 반드시 줄바꿈(\\n\\n)을 적극적으로 사용하여 플레이어가 읽는 호흡을 늦춰주십시오.
2. 시스템 룰 완벽 필터링: 'SAN 1/1D3', '주사위 판정' 등 플레이어의 몰입을 깨는 TRPG 시스템 용어 및 수치는 서막과 시놉시스에서 완벽하게 삭제하십시오.`;

    const systemPrompt = `
당신은 TRPG 및 비주얼 노벨 데이터 파싱의 최고 전문가입니다.
제공된 문서(텍스트/이미지)를 완벽하게 분석하여 아래의 JSON 포맷으로 추출하십시오.

[현재 로비에 설정된 캐릭터 및 룰 데이터]
- 주인공(PC) 이름: ${pcName || '주인공'}
- 파트너(KPC) 이름: ${kpcName || '파트너'}
- 파트너 설정 및 관계: ${kpcDetail || '알 수 없음'}
- 룰 모드: ${ruleMode || '미지정'}

[🚨 서사 개변 및 데이터 추출 절대 규칙]
${modeSpecificRules}
3. 요약 금지: 원문에 있는 감각적인 묘사나 대사 등은 절대 요약하거나 생략하지 말고 풍성하게 살려 길게 추출하십시오.
4. 강제 빈칸 규칙: 문서가 캐릭터 시트라서 시나리오 서막이나 진상 내용이 없다면 억지로 지어내지 말고 해당 필드는 강제로 "" (빈 문자열)로 둡니다.

[필수 반환 JSON 구조]
{
  "scenarioTitle": "",
  "publicSynopsis": "",
  "openingScene": "줄바꿈(\\n\\n)을 2~3회 이상 활용하여 섬세하고 절제된 호흡으로 개변된 도입부 지문 (급전개 절대 방지)",
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
      "name": "문서에서 추출한 인물 이름",
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
              // 🌟 미연시면 원문 보존을 위해 온도를 낮추고, TRPG면 개변을 위해 온도를 살짝 높입니다.
              temperature: isDatingSim ? 0.1 : 0.35, 
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
