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

// 🌟 [수정 완료] KPC1 인식 문제 해결 및 문서 데이터 최우선 규칙 적용
    const systemPrompt = `
당신은 TRPG 시나리오 분석 및 캐릭터 시트 데이터 추출 전문가입니다.
제공된 텍스트(또는 이미지)를 완벽한 JSON 포맷으로 분석 및 추출하십시오.

[현재 로비에 임시 설정된 기본값]
- PC 기본 이름: ${pcName || '없음'}
- KPC 기본 이름: ${kpcName || '없음'}
🚨 중요 규칙: 업로드된 문서 안에 'PC이름', 'KPC이름' 등 캐릭터 정보가 명시되어 있다면, 위의 임시 기본값을 완전히 무시하고 **반드시 문서 안에 적힌 이름과 설정을 최우선으로 추출**해야 합니다.

[캐릭터 시트 인식 특수 규칙]
1. PC 추출: 문서의 'PC이름' 항목을 찾아 정확히 "pcName" 필드에 넣으십시오.
2. KPC 추출 (숫자 무시): 문서에 'KPC1', 'KPC1이름', 'KPC1상세'처럼 숫자가 붙어 있더라도, 이를 메인 KPC 데이터로 인식하여 "kpcName", "kpcJob", "kpcDetail", "kpcSecret" 필드에 통합하여 추출하십시오. 누락은 절대 금지됩니다.
3. 문서 유형 파악: 이 문서처럼 캐릭터 설정(시트)만 존재하고 시나리오 서막/시놉시스가 없는 경우, 억지로 지어내지 말고 시나리오 관련 필드는 강제로 빈 문자열("")로 처리하십시오.

[추출해야 할 JSON 구조]
{
  "scenarioTitle": "",
  "publicSynopsis": "",
  "openingScene": "",
  "hiddenTruth": "",
  "pcName": "문서에서 추출한 PC 이름 (예: 고죠 사토루)",
  "pcJob": "문서에서 추출한 PC 직업",
  "pcAge": "문서에서 추출한 PC 나이 (숫자만 추출)",
  "pcGender": "문서에서 추출한 PC 성별",
  "pcBackground": "문서에서 추출한 PC 백스토리 및 소지품 전체",
  "pcMission": "문서에서 추출한 PC 사명",
  "pcSecret": "문서에서 추출한 PC 비밀",
  "kpcName": "문서에서 추출한 KPC 이름 (예: 게토 스구루)",
  "kpcJob": "문서에서 추출한 KPC 직업",
  "kpcDetail": "문서의 KPC 상세 내용 전체 (외모, 성격, 상태메시지, 호불호 등 빠짐없이 상세히 통합)",
  "kpcSecret": "문서에서 추출한 KPC 비밀",
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
