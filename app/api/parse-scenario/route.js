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

// 🌟 [수정 완료] PC와 KPC의 정보를 완벽하게 분리해서 추출하도록 JSON 구조를 확장했습니다.
    const systemPrompt = `
당신은 TRPG 시나리오 분석 및 캐릭터 시트 해석 전문가입니다.
아래에 제공된 텍스트(또는 이미지)를 꼼꼼히 읽고 완벽한 JSON 포맷으로 추출하십시오.

[🚨 매우 중요한 추출 규칙]
1. 문서 유형 파악: 문서에 'PC'와 'KPC'의 설정(이름, 직업, 나이, 성별, 백스토리, 비밀 등)이 적혀 있다면, 아래 JSON 구조의 pcName, pcJob 등 PC 관련 필드와 kpcName, kpcDetail 등 KPC 관련 필드에 각각 정확히 분리하여 채워 넣으십시오.
2. 기호 출력 절대 금지: 필드에 '\${pcName}' 같은 변수명이나 코드를 그대로 출력하지 마십시오. 반드시 문서에서 읽어낸 실제 이름(예: 고죠 사토루)만 출력해야 합니다.
3. 시나리오 문서일 경우: 시나리오 원문이라면 서막을 상세히 추출하되, 캐릭터 시트만 주어졌다면 시나리오 관련 필드(Title, Synopsis, Opening, Truth)는 빈 문자열("")로 두십시오.

[추출해야 할 JSON 구조]
{
  "scenarioTitle": "시나리오 제목 (없으면 빈 문자열)",
  "publicSynopsis": "시놉시스 (없으면 빈 문자열)",
  "openingScene": "서막 지문 (없으면 빈 문자열)",
  "hiddenTruth": "진상 (없으면 빈 문자열)",
  "pcName": "문서에 명시된 PC 이름 (없으면 빈 문자열)",
  "pcJob": "문서에 명시된 PC 직업",
  "pcAge": "문서에 명시된 PC 나이 (숫자만 추출)",
  "pcGender": "문서에 명시된 PC 성별",
  "pcBackground": "문서에 명시된 PC 백스토리 및 소지품",
  "pcMission": "문서에 명시된 PC 사명",
  "pcSecret": "문서에 명시된 PC 비밀",
  "kpcName": "문서에 명시된 KPC 이름 (없으면 빈 문자열)",
  "kpcJob": "문서에 명시된 KPC 직업",
  "kpcDetail": "KPC의 나이, 성별, 외모, 성격, 관계성 요약 (매우 상세히)",
  "kpcSecret": "KPC의 숨겨진 비밀",
  "handouts": []
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
