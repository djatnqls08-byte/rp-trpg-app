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
    const { rawText, imageData, pcName, kpcName, kpcDetail, playPreference } = await req.json();

    const rawKeys = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
    
    if (apiKeys.length === 0) {
      throw new Error("서버에 등록된 API 키가 없습니다.");
    }

    // 🌟 [수정 완료] 관계성 데이터 주입 및 '완벽한 맞춤 개변'과 '시스템 룰 필터링' 명령 강화
    const systemPrompt = `
당신은 TRPG 데이터 파싱 및 서사 개변(Adaptation)의 최고 전문가입니다.
제공된 문서(텍스트/이미지)가 '시나리오 원문'이든 '캐릭터 설정(시트)'이든 완벽하게 분석하여 아래의 JSON 포맷으로 추출하십시오.

[현재 로비에 설정된 캐릭터 데이터 (서사 개변의 핵심 단서)]
- 주인공(PC) 이름: ${pcName || '탐사자'}
- 파트너(KPC) 이름: ${kpcName || '파트너'}
- 파트너 설정 및 관계: ${kpcDetail || '알 수 없음'}
- 서사 지향 태그: ${playPreference || '기본'}

[🚨 서사 개변 및 데이터 추출 절대 규칙]
1. 완벽한 맞춤 개변 (서막/시놉시스): 시나리오 원문을 처리할 때, 단순히 'KPC', 'PC'라는 글자를 이름으로 치환하는 1차원적인 작업을 하지 마십시오. 위에서 제공된 [캐릭터 데이터]와 두 사람의 관계성을 깊이 반영하여, 어색한 조사나 '당신' 같은 대명사를 완전히 없애고 아주 자연스러운 한 편의 소설처럼 문맥을 완전히 재창조(개변) 하십시오.
2. 시스템 룰 완벽 필터링: 'SAN 1/1D3', '이성 판정', '관찰력 굴림' 등 플레이어의 몰입을 깨는 TRPG 시스템 용어, 수치, 키퍼 지시문은 서막과 시놉시스에서 100% 삭제하십시오.
3. 요약 금지: 메타 텍스트(룰)는 지우되, 원문에 있는 감각적인 묘사나 아름다운 풍경 서술 등은 절대 요약하거나 생략하지 말고 풍성하게 살려 길게 서술하십시오.
4. 강제 빈칸 규칙: 문서가 캐릭터 시트라서 시나리오 서막이나 진상 내용이 없다면 억지로 지어내지 말고 해당 필드는 강제로 "" (빈 문자열)로 둡니다.

[필수 반환 JSON 구조]
{
  "scenarioTitle": "",
  "publicSynopsis": "두 사람의 서사에 맞게 개변된 시놉시스 (시스템 룰 제외, 요약 없이 상세히)",
  "openingScene": "두 사람의 관계성이 완벽히 반영된 소설적 도입부 지문 (시스템 룰 완벽 제거, 어색한 대명사 제거, 풍부한 묘사 유지)",
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
              // 🌟 창의성을 약간 올려서 기계적인 치환 대신 자연스러운 소설 작문을 유도합니다.
              temperature: 0.35, 
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
