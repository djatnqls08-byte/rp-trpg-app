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

   // 🌟 [수정 완료] 문서가 '캐릭터 시트'일 경우의 예외 처리 규칙을 완벽하게 추가했습니다.
    const systemPrompt = `
당신은 TRPG 시나리오 분석 및 캐릭터 시트 해석 전문가입니다.
아래에 제공된 텍스트(또는 이미지)를 꼼꼼히 읽고, 주어진 [캐릭터 정보]를 바탕으로 텍스트를 재창조하거나 분석하여 JSON 포맷으로 추출하십시오.

[주인공(PC) 및 파트너(KPC) 정보]
- PC 이름: ${pcName || '탐사자'}
- KPC 이름: ${kpcName || 'KPC'}
- KPC 설정 및 관계: ${kpcDetail || '알 수 없음'}
- 플레이 태그: ${playPreference || '기본'}

[🚨 매우 중요한 추출 규칙]
1. 문서 유형 파악: 제공된 문서가 '스토리 시나리오'인지, 아니면 '캐릭터 설정(시트)만' 있는지 먼저 파악하십시오.
2. 캐릭터 시트 전용 처리: 만약 문서가 '캐릭터 설정만' 포함하고 있다면, 억지로 시놉시스나 서막을 지어내지 마십시오. 해당 필드는 빈 문자열("")로 남겨두고, 오직 파트너(KPC)의 정보(이름, 외모, 성격, 비밀 등)만 최대한 상세하게 추출하여 해당 칸을 채우십시오.
3. 완벽한 관계성 맞춤 개변 (시나리오일 경우): 문서가 스토리 시나리오라면, 원문의 '탐사자', 'KPC' 등의 단어를 제공된 실제 이름(${pcName}, ${kpcName})으로 교체하고 한국어 조사를 완벽하게 교정하여 소설처럼 묘사하십시오.
4. 시스템 룰 완벽 제거: 주사위 판정, 이성 수치(SAN) 등 TRPG 시스템 룰과 메타 텍스트를 완전히 삭제하십시오.

[추출해야 할 JSON 구조]
{
  "scenarioTitle": "시나리오 제목 (캐릭터 시트만 있다면 빈 문자열)",
  "publicSynopsis": "시놉시스 (캐릭터 시트만 있다면 빈 문자열)",
  "openingScene": "서막 지문 (캐릭터 시트만 있다면 빈 문자열)",
  "hiddenTruth": "진상 (캐릭터 시트만 있다면 빈 문자열)",
  "kpcName": "문서에서 추출한 KPC의 이름 (없으면 ${kpcName} 유지)",
  "kpcDetail": "문서에서 추출한 파트너의 외모, 성격, 배경 설정 요약 (매우 상세히)",
  "kpcSecret": "문서에서 추출한 파트너의 숨겨진 진심이나 약점, 비밀",
  "handouts": [
    { 
      "title": "단서명", 
      "overview": "단서 묘사", 
      "secret": "비밀" 
    }
  ] // 단서가 없거나 캐릭터 시트만 있다면 빈 배열 [] 로 반환
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
