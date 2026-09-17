"use client";
import { useState, useEffect, useRef } from "react";
 
// 팬톤 테마 4종
const THEME_PALETTES = {
  cloud: {
    name: "클라우드 댄서",
    dark: { bg: "#161615", sidebar: "#1d1d1b", panel: "rgba(38, 37, 36, 0.88)", panelAlt: "rgba(51, 49, 48, 0.9)", border: "rgba(240, 238, 233, 0.16)", text: "#F0EEE9", textMuted: "#9e9c96", accent: "#b3b0a6", accentGlow: "rgba(240, 238, 233, 0.25)", danger: "#d63857", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(64, 62, 60, 0.8)", bubbleAi: "rgba(38, 37, 36, 0.7)", inputBg: "#141413" },
    light: { bg: "#F4F2EE", sidebar: "#e8e5df", panel: "rgba(255, 255, 255, 0.95)", panelAlt: "rgba(247, 246, 242, 0.95)", border: "rgba(0, 0, 0, 0.08)", text: "#2c2a29", textMuted: "#7a7773", accent: "#52504c", accentGlow: "rgba(0, 0, 0, 0.12)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(230, 227, 220, 0.9)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  rose: {
    name: "우드 로즈",
    dark: { bg: "#1f1819", sidebar: "#291e20", panel: "rgba(54, 40, 42, 0.88)", panelAlt: "rgba(69, 52, 55, 0.9)", border: "rgba(227, 142, 132, 0.22)", text: "#f2ecee", textMuted: "#a19093", accent: "#E38E84", accentGlow: "rgba(227, 142, 132, 0.35)", danger: "#f76585", warning: "#E29A67", success: "#62d681", bubbleUser: "rgba(163, 114, 119, 0.7)", bubbleAi: "rgba(54, 40, 42, 0.7)", inputBg: "#171213" },
    light: { bg: "#f7f1ec", sidebar: "#ebe2d8", panel: "rgba(255, 255, 255, 0.95)", panelAlt: "rgba(252, 250, 248, 0.95)", border: "rgba(163, 114, 119, 0.15)", text: "#3d2f31", textMuted: "#8f7c80", accent: "#A37277", accentGlow: "rgba(163, 114, 119, 0.2)", danger: "#c43350", warning: "#E29A67", success: "#287a3e", bubbleUser: "rgba(235, 226, 216, 0.9)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  baltic: {
    name: "발틱 씨",
    dark: { bg: "#121417", sidebar: "#181a20", panel: "rgba(33, 36, 44, 0.88)", panelAlt: "rgba(45, 49, 60, 0.9)", border: "rgba(154, 150, 185, 0.22)", text: "#e8e9ec", textMuted: "#7c808f", accent: "#9A96B9", accentGlow: "rgba(154, 150, 185, 0.35)", danger: "#d63857", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(69, 74, 84, 0.75)", bubbleAi: "rgba(33, 36, 44, 0.7)", inputBg: "#0d0f12" },
    light: { bg: "#f0f2f6", sidebar: "#e2e5ec", panel: "rgba(255, 255, 255, 0.95)", panelAlt: "rgba(245, 247, 251, 0.95)", border: "rgba(69, 74, 84, 0.12)", text: "#1f2229", textMuted: "#6b6f7d", accent: "#454A54", accentGlow: "rgba(69, 74, 84, 0.2)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(225, 228, 235, 0.9)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  capri: {
    name: "카프리 블루",
    dark: { bg: "#091214", sidebar: "#0d1b1e", panel: "rgba(19, 37, 41, 0.88)", panelAlt: "rgba(27, 51, 56, 0.9)", border: "rgba(0, 183, 211, 0.25)", text: "#e3f0f2", textMuted: "#6b8e96", accent: "#00B7D3", accentGlow: "rgba(0, 183, 211, 0.35)", danger: "#e0536c", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(20, 72, 82, 0.75)", bubbleAi: "rgba(19, 37, 41, 0.7)", inputBg: "#060d0e" },
    light: { bg: "#eaf3f5", sidebar: "#d6e7eb", panel: "rgba(255, 255, 255, 0.95)", panelAlt: "rgba(240, 248, 250, 0.95)", border: "rgba(0, 152, 176, 0.15)", text: "#16282c", textMuted: "#5e7c85", accent: "#0098b0", accentGlow: "rgba(0, 152, 176, 0.2)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(215, 235, 240, 0.9)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  }
};

const COC_STAT_LABELS = { str: "근력", con: "건강", siz: "크기", dex: "민첩", app: "외모", int: "지능", pow: "정신", edu: "교육" };

// CoC 7판 정규 10종 광기표 (1D10 완전 복구)
const COC_MADNESS_TABLE = [
  { roll: 1, name: "기절 및 의식 상실", desc: "극심한 충격으로 눈앞이 아득해지며 바닥에 쓰러져 의식을 잃습니다." },
  { roll: 2, name: "통제 불능 비명", desc: "이성을 잃고 목이 쉴 때까지 원초적인 비명을 내지릅니다." },
  { roll: 3, name: "급성 공포증", desc: "특정 사물이나 기괴한 현상에 극단적인 공포를 느껴 접근을 거부합니다." },
  { roll: 4, name: "편집증 및 피해망상", desc: "주변의 모든 존재가 자신을 해치려 한다는 의심에 사로잡힙니다." },
  { roll: 5, name: "맹목적 도주", desc: "이유를 불문하고 반대 방향을 향해 무작정 질주합니다." },
  { roll: 6, name: "히스테리성 실성", desc: "통제할 수 없는 기괴한 웃음과 눈물을 동시에 쏟아냅니다." },
  { roll: 7, name: "신체 이상 (마비/실어증)", desc: "말을 전혀 할 수 없거나 온몸이 사시나무 떨듯 마비됩니다." },
  { roll: 8, name: "심인성 기억상실", desc: "직전 목격한 공포스러운 진실에 대한 기억이 완전히 지워집니다." },
  { roll: 9, name: "파괴 충동", desc: "주변의 사물을 닥치는 대로 부수거나 집어던집니다." },
  { roll: 10, name: "긴장증", desc: "넋이 완전히 나가 석상처럼 굳어버립니다." }
];

// 인세인 6대 분야 66개 특기표
const INSANE_MATRIX = [
  { category: "폭력", skills: ["소각", "고문", "포박", "협박", "파괴", "구타", "절단", "찌르기", "사격", "전쟁", "매장"] },
  { category: "정서", skills: ["연심", "기쁨", "걱정", "부끄러움", "웃음", "인내", "놀람", "노여움", "원한", "슬픔", "친애"] },
  { category: "지각", skills: ["고통", "관능", "촉감", "냄새", "맛", "소리", "풍경", "추적", "미행", "제육감", "그늘"] },
  { category: "기술", skills: ["분해", "전자기기", "정리", "약품", "효율", "미디어", "카메라", "탈것", "기계", "함정", "병기"] },
  { category: "지식", skills: ["물리학", "수학", "화학", "생물학", "의학", "교양", "인류학", "역사", "민속학", "고고학", "천문학"] },
  { category: "괴이", skills: ["시간", "혼돈", "심해", "죽음", "영혼", "마술", "암흑", "종말", "꿈", "지저", "우주"] }
];

// 🌟 인세인 1D6 정규 감정표
const INSANE_EMOTIONS_TABLE = {
  1: { pos: "공감(+)", neg: "불신(-)" },
  2: { pos: "우정(+)", neg: "분노(-)" },
  3: { pos: "애정(+)", neg: "질투(-)" },
  4: { pos: "충성(+)", neg: "모멸(-)" },
  5: { pos: "동경(+)", neg: "열등감(-)" },
  6: { pos: "광신(+)", neg: "살의(-)" }
};

const INSANE_MADNESS_TABLE = [
  { roll: 1, name: "의혹", desc: "동행자의 사명과 대사를 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다." },
  { roll: 2, name: "망상", desc: "현실에 존재하지 않는 환청과 그림자를 보며 그것에 집착합니다." },
  { roll: 3, name: "강박증", desc: "소지품을 확인하거나 문을 잠그는 행동을 병적으로 반복합니다." },
  { roll: 4, name: "패닉", desc: "이성적 사고가 마비되어 위험 상황에서 무작정 몸을 숨깁니다." },
  { roll: 5, name: "폭력 충동", desc: "위협을 제거하기 위해 수단 방법을 가리지 않는 공격성을 드러냅니다." },
  { roll: 6, name: "쇼크", desc: "정신적 붕괴로 인해 다음 씬 동안 행동 선언이 극도로 제한됩니다." }
];

// 인세인 정규 2D6 장면표 (2~12번 총 11종)
const INSANE_SCENE_TABLE_2D6 = {
  2: "주위가 피 냄새로 가득하다. 사건인가? 사고인가? 혹시 그것은 지금도 계속되고 있는 걸까?",
  3: "이것은…… 꿈인가? 이미 지나갔을 과거가 기억 속에서 되살아난다.",
  4: "눈앞에 펼쳐진 거리의 풍경을 내려다본다. 왜 이렇게 높은 곳에……?",
  5: "세상의 끝처럼 느껴지는 어둠. 어둠 속에서 누군가가 움직이고 있다…….",
  6: "평화로운 시간이 흘러간다. 마치 그런 일이 없었던 것처럼.",
  7: "축축한 흙냄새. 농밀한 기척이 풍기는 숲속. 새나 벌레의 소리, 바람에 나무가 살랑거리는 소리가 들려온다.",
  8: "사람이 잘 안 다니는 주택가. 낯선 사람들의 사는 집 안에서는 불분명한 목소리나 소음이 새어 나온다…….",
  9: "갑자기 구름이 하늘을 뒤덮더니 세찬 비가 내린다. 사람들은 처마를 찾아 황급히 달려간다.",
  10: "황폐한 폐허. 쇠퇴한 생활의 흔적. 희미하게 들려오는 것은 바람 소리인가? 파도 소리인가? 귀울림인가?",
  11: "사람들, 떠들썩한 소리, 요란한 가게 내부의 BGM에, 이질적인 웃음소리. 소란스러운 번화가의 한구석인데…….",
  12: "밝은 빛을 받았을 때 안도의 한숨. 하지만 빛이 강할수록 그림자도 더 짙어진다……."
};

const INSANE_SCENE_TABLE = INSANE_SCENE_TABLE_2D6;

// 🌟 인세인 배경 맞춤형 프라이즈 & 3단계 의식 자동 생성기
const generateInsaneThemeAssets = (scenarioTitle = "", scenarioText = "") => {
  const text = `${scenarioTitle} ${scenarioText}`.toLowerCase();

  // 1. 극장 / 예술
  if (text.includes("극장") || text.includes("무대") || text.includes("오페라") || text.includes("배우") || text.includes("커튼콜") || text.includes("음악")) {
    return {
      prize: {
        id: "prize_" + Date.now(),
        title: "[프라이즈] 진홍의 오페라 글라스",
        desc: "무대 위 숨겨진 괴이의 실체를 간파할 수 있는 기묘한 망원경입니다. (보유 시 회상 판정 주사위 +1 보너스)",
        revealed: true,
        type: "prize"
      },
      rituals: [
        { id: 1, name: "1단계: 무대 조명과 기계 장치 강제 정지", skill: "도구", completed: false },
        { id: 2, name: "2단계: 절망에 찬 영혼을 달래는 진혼의 공명", skill: "소리", completed: false },
        { id: 3, name: "3단계: 마지막 비극의 커튼 강제 폐막", skill: "슬픔", completed: false }
      ]
    };
  }

  // 2. 병원 / 의학 / 연구소
  if (text.includes("병원") || text.includes("의사") || text.includes("약") || text.includes("실험") || text.includes("감염") || text.includes("바이러스")) {
    return {
      prize: {
        id: "prize_" + Date.now(),
        title: "[프라이즈] 정제된 시제 백신 앰플",
        desc: "괴이의 침식과 부식을 억제할 수 있는 최후의 약제입니다. (보유 시 광기 획득 1회 방어)",
        revealed: true,
        type: "prize"
      },
      rituals: [
        { id: 1, name: "1단계: 오염 차단 격리벽 폐쇄", skill: "기계", completed: false },
        { id: 2, name: "2단계: 기괴한 생체 변이 조직 중화", skill: "의학", completed: false },
        { id: 3, name: "3단계: 오염체 코어 강제 소각", skill: "파괴", completed: false }
      ]
    };
  }

  // 3. 고택 / 저택 / 신사 / 오컬트
  if (text.includes("저택") || text.includes("신사") || text.includes("사당") || text.includes("가문") || text.includes("제물") || text.includes("의식") || text.includes("피")) {
    return {
      prize: {
        id: "prize_" + Date.now(),
        title: "[프라이즈] 가문의 저주받은 곡옥",
        desc: "불길한 원혼의 한이 서려 있는 부적입니다. (보유 시 괴이 특기 판정 목표치 -1 완화)",
        revealed: true,
        type: "prize"
      },
      rituals: [
        { id: 1, name: "1단계: 핏빛 주술 결계진 파괴", skill: "종교", completed: false },
        { id: 2, name: "2단계: 어둠 속에 응축된 악의 정화", skill: "어둠", completed: false },
        { id: 3, name: "3단계: 심연의 원혼 영구 봉인", skill: "영감", completed: false }
      ]
    };
  }

  // 4. 학교 / 폐교 / 청춘
  if (text.includes("학교") || text.includes("교실") || text.includes("동아리") || text.includes("학생") || text.includes("옥상") || text.includes("괴담")) {
    return {
      prize: {
        id: "prize_" + Date.now(),
        title: "[프라이즈] 피 묻은 교환 일기장",
        desc: "잊혀진 그날의 진실이 적힌 마지막 일기입니다. (보유 시 클라이맥스 공격 피해 +1)",
        revealed: true,
        type: "prize"
      },
      rituals: [
        { id: 1, name: "1단계: 괴담의 발원지 구교사 문 개방", skill: "열쇠", completed: false },
        { id: 2, name: "2단계: 왜곡된 소문과 기억의 교정", skill: "소문", completed: false },
        { id: 3, name: "3단계: 서글픈 원혼을 향한 마지막 구원", skill: "정열", completed: false }
      ]
    };
  }

  // 5. 심연 / 바다 / 코스믹 호러
  if (text.includes("심연") || text.includes("바다") || text.includes("섬") || text.includes("안개") || text.includes("외계") || text.includes("악몽")) {
    return {
      prize: {
        id: "prize_" + Date.now(),
        title: "[프라이즈] 별의 잔해 나침반",
        desc: "우주적 공포 앞에서도 정신의 북극성을 가리켜 주는 나침반입니다.",
        revealed: true,
        type: "prize"
      },
      rituals: [
        { id: 1, name: "1단계: 차원의 일그러진 균열 차단", skill: "물리", completed: false },
        { id: 2, name: "2단계: 태고의 부름에 대한 정신 결속", skill: "단념", completed: false },
        { id: 3, name: "3단계: 심연의 괴이 영구 추방", skill: "심연", completed: false }
      ]
    };
  }

  // 6. 기본 범용 (현대 도시 괴담 / 스릴러)
  return {
    prize: {
      id: "prize_" + Date.now(),
      title: "[프라이즈] 결정적 단서가 담긴 녹음기",
      desc: "사건의 모든 진실을 담고 있는 결정적 물증입니다.",
      revealed: true,
      type: "prize"
    },
    rituals: [
      { id: 1, name: "1단계: 흑막의 도주로 및 퇴로 차단", skill: "추적", completed: false },
      { id: 2, name: "2단계: 기괴한 흉기 무력화", skill: "결박", completed: false },
      { id: 3, name: "3단계: 일그러진 집착의 사념 파괴", skill: "사랑", completed: false }
    ]
  };
};

// 🌟 66개 격자 맨해튼 거리 기반 대용 난이도 계산기 (Zero-API Cost)
function calculateInsaneTargetNumber(targetSkill, learnedSkills = [], curiosityCategory = "") {
  if (learnedSkills.includes(targetSkill)) return 5;
  let targetCol = -1, targetRow = -1;
  INSANE_MATRIX.forEach((colObj, cIdx) => {
    const rIdx = colObj.skills.indexOf(targetSkill);
    if (rIdx !== -1) { targetCol = cIdx; targetRow = rIdx; }
  });
  if (targetCol === -1) return 5;

  let minDistance = 999;
  learnedSkills.forEach(learned => {
    let lCol = -1, lRow = -1;
    INSANE_MATRIX.forEach((colObj, cIdx) => {
      const rIdx = colObj.skills.indexOf(learned);
      if (rIdx !== -1) { lCol = cIdx; lRow = rIdx; }
    });
    if (lCol !== -1) {
      let colDist = Math.abs(targetCol - lCol);
      let rowDist = Math.abs(targetRow - lRow);
      let totalDist = colDist + rowDist;
      if (curiosityCategory) {
        const curioCol = INSANE_MATRIX.findIndex(c => c.category === curiosityCategory);
        if (curioCol !== -1) {
          const minCol = Math.min(targetCol, lCol);
          const maxCol = Math.max(targetCol, lCol);
          if (curioCol >= minCol && curioCol <= maxCol && colDist > 0) {
            totalDist = Math.max(1, totalDist - 1);
          }
        }
      }
      if (totalDist < minDistance) minDistance = totalDist;
    }
  });
  return minDistance === 999 ? 5 : 5 + minDistance;
}


const ORIENT_TAGS = ["#GL", "#BL", "#HL", "#논로맨스"];
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#일상", "#오컬트", "이능력"];

// ==========================================
// 📑 구글 스프레드시트 연동 도우미 (CSV 변환기)
// ==========================================
function parseCSV(text) {
  let p = '', c = '', r = [];
  let q = false;
  let row = [''];
  for (let i = 0; i < text.length; i++) {
    c = text[i];
    let next = text[i + 1];
    if (c === '"') {
      if (q && next === '"') { row[row.length - 1] += '"'; i++; }
      else { q = !q; }
    } else if (c === ',' && !q) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !q) {
      if (c === '\r' && next === '\n') { i++; }
      r.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') r.push(row);
  return r;
}



function convertRowToPreset(row, index, headers = []) {
  const [
    title, rule, tags, synopsis, opening, truth,
    pcName, pcJob, pcAgeGender, pcBg, pcMission, pcSecret, pcImg,
    skills, curiosity, fear,
    n1Name, n1Job, n1Detail, n1Secret, n1Img,
    n2Name, n2Job, n2Detail, n2Secret, n2Img,
    n3Name, n3Job, n3Detail, n3Secret, n3Img,
    n4Name, n4Job, n4Detail, n4Secret, n4Img
  ] = row;

  const kpcList = [];
  const rawNpcs = [
    { name: n1Name, job: n1Job, detail: n1Detail, secret: n1Secret, img: n1Img },
    { name: n2Name, job: n2Job, detail: n2Detail, secret: n2Secret, img: n2Img },
    { name: n3Name, job: n3Job, detail: n3Detail, secret: n3Secret, img: n3Img },
    { name: n4Name, job: n4Job, detail: n4Detail, secret: n4Secret, img: n4Img }
  ];

  rawNpcs.forEach((npc, i) => {
    if (npc.name && npc.name.trim()) {
      kpcList.push({
        id: Date.now() + i,
        name: npc.name.trim(),
        job: npc.job || "",
        detail: npc.detail || "",
        secret: npc.secret || "",
        portraitUrl: npc.img || "",
        showSecret: false
      });
    }
  });

// 🌟 BJ열(61번 인덱스)부터 3개씩 묶어 CG1~CG10 자동 추출
  const eventCgs = [];
  for (let c = 61; c < row.length; c += 3) {
    const cgTitle = row[c]?.trim();
    const cgTrigger = row[c + 1]?.trim();
    const cgUrl = row[c + 2]?.trim();
    if (cgTitle && cgUrl) {
      eventCgs.push({ title: cgTitle, trigger: cgTrigger || "", imageUrl: cgUrl });
    }
  }

// 🌟 헤더에서 '세션카드' 열 찾아 이미지 주소 가져오기
const thumbIdx = headers.findIndex(h => /세션카드|대표이미지|썸네일|표지/i.test(h?.replace(/\s+/g, '') || ""));
  const sessionCardImg = thumbIdx !== -1 ? row[thumbIdx]?.trim() : "";
 
  return {
    id: 9000000000000 + index,
    presetTitle: title || "새 시나리오",
    scenarioTitle: title || "새 시나리오",
   thumbnail: sessionCardImg,
    wizardMode: (rule || "insane").toLowerCase().trim(),
    playPreference: tags || "",
    publicSynopsis: synopsis || "",
    openingScene: opening || "",
    hiddenTruth: truth || "",
    charName: pcName || "주인공",
    charJob: pcJob || "",
    charAge: (pcAgeGender || "").split("/")[0]?.trim() || "20",
    charGender: (pcAgeGender || "").split("/")[1]?.trim() || "여성",
    charBackground: pcBg || "",
    charMission: pcMission || "",
    charSecret: pcSecret || "",
    charPortraitUrl: pcImg || "",
    insaneSkills: (skills || "").split(",").map(s => s.trim()).filter(Boolean),
    insaneCuriosity: curiosity || "정서",
    insaneFear: fear || "죽음",
    insaneLimit: 3,
    kpcList: kpcList,
    eventCgs: eventCgs 
  };
}

export default function App() {
 const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showCgAlbumModal, setShowCgAlbumModal] = useState(false);
  const [parsedEnemyName, setCharEnemyName] = useState("");
  const [parsedPrizes, setParsedPrizes] = useState([]);
  // 🌟 인세인 전용 UI 상태
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const [showInsaneGuideModal, setShowInsaneGuideModal] = useState(false);
  const [investigationModal, setInvestigationModal] = useState(null);
  const [emotionModal, setEmotionModal] = useState(null);
  const [reviveModalOpen, setReviveModalOpen] = useState(false);
  const [usableHealItem, setUsableHealItem] = useState(null);
  const [weaponRerollModal, setWeaponRerollModal] = useState(null);

  // 1. 2D6 정규 판정기 (12 스페셜 / 2 펌블 자동 연동)
  const rollInsaneCheck = (skillName, overrideTarget = null, actionType = "판정") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true);
    playDiceSound();

    const learned = activeSession.sheet?.insaneSkills || [];
    const curiosity = activeSession.sheet?.insaneCuriosity || "정서";
    const targetVal = overrideTarget !== null ? overrideTarget : calculateInsaneTargetNumber(skillName, learned, curiosity);

    const rollInterval = setInterval(() => {
      setRollingDisplayNum(Math.floor(Math.random() * 12) + 1);
    }, 50);

    setTimeout(() => {
      clearInterval(rollInterval);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;

      let outcome = "";
      let bonusMessage = "";

      if (sum === 12) {
        outcome = "스페셜(대성공)";
        bonusMessage = "\n[체계 알림] 스페셜 달성! 생명력 또는 이성치가 1점 회복됩니다.";
        setSessions(prev => prev.map(s => {
          if (s.id !== activeSessionId) return s;
          const curSan = s.sheet?.san ?? 6;
          const maxSan = s.sheet?.maxSan ?? 6;
          return { ...s, sheet: { ...s.sheet, san: Math.min(maxSan, curSan + 1) } };
        }));
      } else if (sum === 2) {
        outcome = "펌블(대실패)";
        bonusMessage = "\n[체계 알림] 펌블 발생! 공포에 잠식되어 광기 카드 1장을 획득합니다.";
        drawMadnessCard(activeSessionId, false);
      } else if (sum >= targetVal) {
        outcome = "성공";
      } else {
        outcome = "실패";
      }

      const logText = `[주사위 2D6 ${actionType}: ${d1}+${d2}=${sum} / 목표치: ${targetVal} (${skillName || "임의 판정"}) ➔ 결과: ${outcome}]${bonusMessage}`;
      setIsRolling(false);

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        sheet: { ...s.sheet, actionUsed: true }
      } : s));

      executeMessage(logText);
    }, animationEnabled ? 600 : 100);
  };

// 2. 3대 주요 행동 - 조사 완료 처리 (범용 ID 및 동적 명칭 매칭)
  const handleExecuteInvestigation = (targetType, targetObj, skillName) => {
    setInvestigationModal(null);
    setIsActionDrawerOpen(false);

    const learned = activeSession.sheet?.insaneSkills || [];
    const curiosity = activeSession.sheet?.insaneCuriosity || "정서";
    const targetVal = calculateInsaneTargetNumber(skillName, learned, curiosity);

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    const isSuccess = sum === 12 || (sum >= targetVal && sum !== 2);

    const targetDisplayName = targetObj.name || targetObj.title || "조사 대상";
    let resultDetail = "";

    if (isSuccess) {
      if (targetType === "secret") {
        resultDetail = `\n[조사 성공: 비밀 해금] 《${targetDisplayName}》의 숨겨진 진실이 해금되었습니다. 테이블탑 핸드아웃에서 내용을 확인하세요.`;

        setSessions(prev => prev.map(s => {
          if (s.id !== activeSessionId) return s;

          // 🌟 이번에 밝혀진 비밀 텍스트 확보
          const currentSecret = targetObj.secret || (s.sheet?.handouts || []).find(h => 
            (targetObj.id && (h.id === targetObj.id || h.npcId === targetObj.id)) || (targetObj.title && h.title === targetObj.title)
          )?.secret || "";

         // 🌟 의식/봉인/제단 관련 진실이 드러났다면 의식 시트 자동 해금!
          const hasRitualClue = /의식|봉인|결계\s*파괴|진혼|구마|제단|퇴치법/i.test(currentSecret) || /의식|봉인/i.test(targetObj.name || targetObj.title || "");
          const isRitualNowDiscovered = s.sheet?.isRitualDiscovered || hasRitualClue;

          const hList = (s.sheet?.handouts || []).map(h => {
            const isMatch = (targetObj.id && (h.id === targetObj.id || h.npcId === targetObj.id))
              || (targetObj.name && h.title?.includes(targetObj.name))
              || (targetObj.title && h.title === targetObj.title);

            // 1. 현재 조사 성공한 핸드아웃: 비밀 해금 및 노출
            if (isMatch) {
              return { ...h, revealed: true, isFlipped: true, discovered: true };
            }

            // 2. 다른 핸드아웃: 비밀 내용에 이름이 언급되어 있다면 연계 잠금 해제(발견)!
            if (currentSecret && currentSecret.includes(h.title)) {
              return { ...h, discovered: true };
            }

            return h;
          });

          const nList = (s.sheet?.npcs || []).map(n => {
            const isMatch = n.id === targetObj.id || (targetObj.name && n.name === targetObj.name);
            return isMatch ? { ...n, secretRevealed: true } : n;
          });

         return {
          ...s,
          sheet: {
            ...s.sheet,
            handouts: hList,
            npcs: nList,                            
            isRitualDiscovered: isRitualNowDiscovered
          }
        };
        }));
       // 🍞 [시스템 토스트 알림 발동]
      if (isRitualNowDiscovered && !activeSession.sheet?.isRitualDiscovered) {
        triggerToast("봉인 의식 단서 발견!", "클라이맥스 봉인 의식을 실행할 수 있게 되었습니다.", "🔮");
      } else {
        const targetName = targetObj.title || targetObj.name || "핸드아웃";
        triggerToast("비밀 열람 완료", `[${targetName}]의 숨겨진 진실이 밝혀졌습니다.`, "🗝️");
      }
      } else if (targetType === "location") {
        resultDetail = `\n[조사 성공: 거처 확보] 《${targetDisplayName}》의 거처와 활동 경로를 확보했습니다! (메인 페이즈 전투 신청 가능)`;
        setSessions(prev => prev.map(s => {
          if (s.id !== activeSessionId) return s;
          const nList = (s.sheet?.npcs || []).map(n => (n.id === targetObj.id || n.name === targetObj.name) ? { ...n, hasLocation: true } : n);
          return { ...s, sheet: { ...s.sheet, npcs: nList, actionUsed: true } };
        }));
      } else if (targetType === "mental") {
        const mCount = targetObj.madnessCards?.length || 0;
        resultDetail = `\n[조사 성공: 정신상태 파악] 《${targetDisplayName}》의 내면을 관찰했습니다. (현재 보유 미공개 광기: ${mCount}장)`;
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, actionUsed: true } } : s));
      }
    } else {
      resultDetail = targetType === "location"
  ? `\n[거처 확보 실패] 인물의 흔적을 놓쳐 거처와 활동 경로를 파악하지 못했습니다.`
  : `\n[비밀 조사 실패] 경계가 삼엄하여 핵심 정보를 알아내지 못했습니다.`;
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, actionUsed: true } } : s));
    }

    const logText = `[주요 행동: 조사 선언 (대상: ${targetDisplayName} / 특기: ${skillName})]\n2D6 결과: ${d1}+${d2}=${sum} (목표치: ${targetVal}) ➔ ${isSuccess ? "성공" : "실패"}${resultDetail}`;

    executeMessage(logText);
  };

  // 3. 3대 주요 행동 - 감정 결정 처리
  const handleSelectEmotion = (npc, selectedEmotionName) => {
    setEmotionModal(null);
    setIsActionDrawerOpen(false);

    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const nList = (s.sheet?.npcs || []).map(n => n.id === npc.id ? { ...n, emotion: selectedEmotionName } : n);
      return { ...s, sheet: { ...s.sheet, npcs: nList, actionUsed: true } };
    }));

    const isPositive = selectedEmotionName.includes("+");
    const relationDesc = isPositive 
      ? `서로에게 마음이 닿아 《${selectedEmotionName}》의 유대를 맺었습니다. (향후 정보 공유 및 위기 지원 가능)`
      : `서로에게 날을 세우며 《${selectedEmotionName}》의 인연으로 얽혔습니다. (향후 정보 공유 및 전투 난입 가능)`;

    executeMessage(`[주요 행동: 감정 맺기 완료]\n${npc.name}와(과) ${relationDesc}`);
  };

// 💊 [긴급 회복약 사용 선택 시]
  const handleUseReviveItem = () => {
    if (!usableHealItem) return;

    // 인세인 정규 룰: 진통제는 1D6 생명력 회복
    const healRoll = Math.floor(Math.random() * 6) + 1;

    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;

      // 보유 아이템 수량 1 차감
      const nextItems = (s.sheet?.items || []).map(it => {
        if (it.id === usableHealItem.id || it.name === usableHealItem.name) {
          const curCount = it.count ?? it.quantity ?? 1;
          return { ...it, count: Math.max(0, curCount - 1), quantity: Math.max(0, curCount - 1) };
        }
        return it;
      });

      return {
        ...s,
        sheet: {
          ...s.sheet,
          hp: healRoll, // 주사위 결과값으로 체력 복구
          items: nextItems
        }
      };
    }));

    setReviveModalOpen(false);
    setUsableHealItem(null);

    triggerToast("긴급 회복 성공!", `${usableHealItem.name}을(를) 복용하여 체력 ${healRoll}을(를) 회복했습니다!`, "💊");
    if (typeof executeMessage === "function") {
      executeMessage(`[긴급 회복] 💊 의식을 잃기 직전, ${usableHealItem.name}을(를) 꺼내 삼켰습니다! (1D6 회복 굴림: ${healRoll} 회복)`);
    }
  };

  // 💀 [포기(사용 안 함) 선택 시 -> 배드엔딩 확정]
  const handleDeclineRevive = () => {
    setReviveModalOpen(false);
    setUsableHealItem(null);

    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s,
      sheet: {
        ...s.sheet,
        hp: 0,
        phase: "배드엔딩"
      }
    } : s));

    triggerToast("게임 오버", "어둠 속으로 의식이 가라앉았습니다...", "💀");
  };
 
// 4. 장면 닫기 (Scene Close) 실행 ➔ 화면 로그와 AI 지시문 분리
  const handleSceneClose = () => {
    setIsActionDrawerOpen(false);
    if (!activeSession) return;

    playDiceSound();

    const currScene = activeSession.sheet?.scene || 1;
    const currCycle = activeSession.sheet?.cycle || 1;
    const limit = activeSession.sheet?.limit || 4;

    let nextScene = currScene;
    let nextCycle = currCycle;

    if (currScene >= 2) {
      nextCycle += 1;
      nextScene = 1;
    } else {
      nextScene += 1;
    }

    const isClimax = nextCycle > limit;

    // 1) 상태 갱신: 사이클/장면 전진 및 [주요 행동 잠금 해제(actionUsed: false)]
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      return {
        ...s,
        sheet: {
          ...s.sheet,
          cycle: nextCycle,
          scene: nextScene,
          phase: isClimax ? "클라이맥스" : "메인",
          actionUsed: false
        }
      };
    }));

    // 2) 화면 말풍선 표시용 로그 vs AI 전용 지시문 분리
    let displayLog = "";
    let aiPrompt = "";

    if (isClimax) {
      displayLog = `[🎬 장면 닫기 ➔ ⚠️ 클라이맥스 페이즈 돌입!]`;
      aiPrompt = `[🎬 장면 닫기 ➔ ⚠️ 클라이맥스 페이즈(Climax Phase) 돌입!]
모든 메인 사이클(${limit}C)이 종료되어 최종 결전이 시작됩니다.
키퍼로서 긴박한 마스터 씬(Master Scene)을 3~4문장으로 서술하여 흑막과의 최종 대치 국면을 열어주십시오.`;
    } else {
      const rollIdx = Math.floor(Math.random() * 6);
      const sceneDesc = INSANE_SCENE_TABLE[rollIdx];

      // 💬 플레이어 채팅창에 뜨는 말풍선
      displayLog = `[🎬 장면 닫기 ➔ ${nextCycle}사이클 ${nextScene}장면 개막]\n[🎲 1D6 정규 장면표]: "${sceneDesc}"`;

      // 🤖 AI에게만 전달되는 시스템 연출 지시문
      aiPrompt = `[🎬 장면 닫기 ➔ 새 장면 개막: ${nextCycle}사이클 ${nextScene}장면]
이전 장면을 퇴장으로 마무리하고 새로운 드라마 씬을 엽니다.
[🎲 1D6 정규 장면표 ${rollIdx + 1}번 결과]: "${sceneDesc}"

위 장면표의 분위기를 바탕으로 키퍼로서 새로운 장면 도입 지문(마스터 씬)을 3~4문장으로 서술하십시오.
지문 끝에는 탐사자가 이번 장면의 새로운 1회 주요 행동(조사/감정/회복)을 취할 수 있도록 상황을 유도하고, 아래 선택지 태그를 출력하십시오:
<!-- SUGGESTIONS: ["주변 단서 조사", "파트너와 감정 맺기", "휴식 및 회복"] -->`;
    }

    executeMessage(displayLog, aiPrompt);
  };
 
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
 // 🌟 클라이맥스 라운드 및 턴 진행 상태 ("plot": 플롯 선택 대기, "action": 행동 선택 대기)
  const [climaxRound, setClimaxRound] = useState(1);
  const [climaxStep, setClimaxStep] = useState("plot"); // "plot" 또는 "action"
 // 🌟 감정 판정 모달 전용 상태
  const [emotionModalOpen, setEmotionModalOpen] = useState(false);
 // 🍞 [시스템 토스트 알림 상태]
  const [toast, setToast] = useState(null); // { title, message, icon }
 const triggerToast = (title, message, icon = "✨") => {
    setToast({ title, message, icon });
  };
  const [emotionTargetNpc, setEmotionTargetNpc] = useState(null);
  const [emotionDiceResult, setEmotionDiceResult] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

// ── [미연시 & 통합 서사 신규 State] ──
  const [currentPhase, setCurrentPhase] = useState("낮"); // 시간대 (낮 / 노을 / 밤)
 const [timeTransition, setTimeTransition] = useState(null); // ⏳ 시간 경과 암전 연출 상태
  const [recentEvents, setRecentEvents] = useState([]); // AI 기억 수첩 (사건 플래그)
  const [locationCards, setLocationCards] = useState([]); // 동적 장소 선택지
  const [incomingCall, setIncomingCall] = useState(null); // 실시간 전화 수신 정보 ({ caller, urgent })
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false); // 통화창 활성화 여부
  const [voiceCallNpc, setVoiceCallNpc] = useState(null); // 통화 중인 상대 NPC
const [isCallModalOpen, setIsCallModalOpen] = useState(true); // 통화창 열림/내림 상태
  const [isCallInputFocused, setIsCallInputFocused] = useState(false); // 키보드 포커스 상태

// 🎬 시네마틱 CG 및 컷씬 상태
  const [activeCutsceneCg, setActiveCutsceneCg] = useState(null); // 현재 화면에 뜬 16:9 CG { url, title, caption }
  const [unlockedCgList, setUnlockedCgList] = useState([]); // 해금되어 앨범에 저장된 CG 목록
 const [scenarioCgs, setScenarioCgs] = useState([]); // 🌟 시나리오 전용 CG 목록
  const [scenarioThumbnail, setScenarioThumbnail] = useState(""); // 🌟 공식 세션 카드 이미지
  const [zoomedCardUrl, setZoomedCardUrl] = useState(null);
const [showCgDialog, setShowCgDialog] = useState(true); // 🌟 CG 대사창 보이기/숨기기 토글
 
// 📱 전화 수신 감지 시 스마트폰 서랍 자동 열림
  useEffect(() => {
    if (incomingCall) {
      setIsPhoneDrawerOpen(true);
    }
  }, [incomingCall]);
 
  // 🌟 [추가] 버전 관리 및 공지사항/가이드 상태
  const APP_VERSION = "v1.4.0";
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [activeNoticeTab, setActiveNoticeTab] = useState("update");
  const [hideNoticeCheckbox, setHideNoticeCheckbox] = useState(false);

  // 🌟 [추가] 처음 접속 시 7일 체크 확인 로직
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hideUntil = localStorage.getItem("rp_hub_hide_notice");
    // 기록이 없거나, 저장된 날짜(7일 뒤)가 현재 시간보다 과거라면 팝업 열기
    if (!hideUntil || Date.now() > Number(hideUntil)) {
      setShowNoticeModal(true);
    }
  }, []);

  const handleCloseNotice = () => {
    if (hideNoticeCheckbox) {
      // 7일(밀리초) = 7 * 24 * 60 * 60 * 1000 = 604,800,000
      const sevenDaysLater = Date.now() + 604800000; 
      localStorage.setItem("rp_hub_hide_notice", sevenDaysLater.toString());
    }
    setShowNoticeModal(false);
  };
  
  // 🌟 AI 답변 강제 취소 컨트롤러
  const [abortController, setAbortController] = useState(null);

  // 반응형 및 오버레이
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // 🌟 [추가] 모바일 슬라이드 터치 감지용
  const [touchStartX, setTouchStartX] = useState(null);
  const [isTabletopOpen, setIsTabletopOpen] = useState(false);

  // 모달 제어
  const [showSettingsModal, setShowSettingsModal] = useState(false);
 const [showSkillMatrixModal, setShowSkillMatrixModal] = useState(false); // 🌟 66개 특기 매트릭스 팝업 상태
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [isEditingPortrait, setIsEditingPortrait] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [ruleHelpModal, setRuleHelpModal] = useState(null); // 🌟 [추가] 룰 설명 전용 팝업 상태
  const [showLobbyPresetModal, setShowLobbyPresetModal] = useState(false);
  const [lobbyPresets, setLobbyPresets] = useState([]);
  // 🌟 [추가] 로비 프리셋 모달 탭 및 공식(배포용) 프리셋 상태
  const [lobbyPresetTab, setLobbyPresetTab] = useState("public"); // "public" | "local"
  const [officialPresets, setOfficialPresets] = useState([
    // 💡 기본 내장 추천 시나리오 (public/presets.json이 없을 때 기본 작동)
    {
      id: "official_dating_1",
      presetTitle: "온실의 오후 (미연시 입문)",
      scenarioTitle: "온실의 오후",
      wizardMode: "dating",
      playPreference: "#GL #달달 #일상",
      publicSynopsis: "비 내리는 늦은 오후, 조용한 식물원 온실에서 차를 마시며 상대방과의 조심스러운 유대를 쌓아가는 잔잔한 일상 이야기입니다.",
      openingScene: "후두둑 유리창을 두드리는 빗소리 사이로 은은한 허브 향이 피어오릅니다. 테이블 맞은편에서 따뜻한 잔을 쥔 파트너가 조용히 당신을 바라봅니다.",
      hiddenTruth: "평화로워 보이지만, 상대방은 조만간 이곳을 떠나야 할지도 모른다는 남모를 고민을 품고 있습니다. 호감도 60 이상 도달 시 고민을 털어놓습니다.",
      charName: "클레어",
      charJob: "다정함, 경청가",
      charBackground: "24세, 여성. 온화하고 배려심이 깊은 성격.\n소지품: 손수건, 틴케이스 캔디",
      charMission: "상대방과 편안하고 따뜻한 오후를 보낸다.",
      charSecret: "사실 오래전부터 그녀를 조용히 눈여겨보고 있었다.",
      charPortraitUrl: "",
      kpcList: [
        {
          id: 1,
          name: "아델",
          job: "온실 관리자",
          detail: "26세, 여성. 차분하고 단정한 인상. 상태 메시지는 '비 오는 날의 온기'. 은은한 허브티와 잔잔한 독서를 좋아하고, 소란스러운 장소를 싫어합니다.",
          secret: "가족과의 문제로 곧 다른 지역으로 떠나야 할 위기에 처해 있습니다.",
          portraitUrl: "",
          showSecret: false
        }
      ]
    }
  ]);

// 🌟 구글 스프레드시트 CSV 웹 게시 링크
  const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSW9Hbl6ff0YfgT7HIv-TccO8uBDQuOXCW4sucirgJg-U4Yd2uKns18wf32GKwxNfU0at8zROcVi-HI/pub?gid=593455354&single=true&output=csv";

  useEffect(() => {
    if (GOOGLE_SHEET_CSV_URL && GOOGLE_SHEET_CSV_URL.trim() !== "" && !GOOGLE_SHEET_CSV_URL.includes("여기에")) {
      fetch(GOOGLE_SHEET_CSV_URL)
        .then(res => res.text())
        .then(csvText => {
          const rows = parseCSV(csvText);
          const headers = rows[0] || [];
          const sheetPresets = rows.slice(1)
            .filter(r => r[0] && r[0].trim())
            .map((row, idx) => convertRowToPreset(row, idx, headers)); // 👈 headers 추가

          if (sheetPresets.length > 0) {
            setOfficialPresets(sheetPresets);
          }
        })
        .catch(err => console.error("구글 시트 불러오기 실패:", err));
    }
  }, []);
 
 // 🌟 교체할 useEffect 코드
useEffect(() => {
  console.log("presets.json 요청 시작...");
  fetch(`/presets.json?t=${Date.now()}`, { cache: "no-store" })
    .then(async (res) => {
      console.log("presets.json 응답 상태:", res.status, res.ok);
      if (!res.ok) {
        throw new Error(`파일을 찾을 수 없음 (HTTP ${res.status})`);
      }
      const text = await res.text();
      console.log("불러온 데이터 앞부분:", text.slice(0, 100));

      const data = JSON.parse(text);
      const list = Array.isArray(data) ? data : [data];
      console.log("파싱 성공! 프리셋 개수:", list.length);
      setOfficialPresets(list);
    })
    .catch((err) => {
      console.error("presets.json 불러오기 실패 원인:", err);
    });
}, []);
  
  // 🌟 낱개(1개) 세팅만 깔끔하게 단독 JSON으로 다운로드
  const exportSingleLobbyPreset = (p) => {
    const fileName = `${(p.presetTitle || p.scenarioTitle || "시나리오").replace(/[\/\\:*?"<>|]/g, "_")}.json`;
    const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
    if (typeof triggerToast === "function") triggerToast(`'${p.presetTitle}' 세팅이 파일로 저장되었습니다! 📥`);
  };

  useEffect(() => {
    try {
      const lp = localStorage.getItem("rp_hub_lobby_presets");
      if (lp) setLobbyPresets(JSON.parse(lp));
    } catch(e) {}
  }, []);

// 🌟 로비 세팅 저장 인앱 모달 열기
  const handleSaveLobbyPreset = () => {
    const defaultTitle = scenarioTitle || (charName ? `${charName}의 캠페인` : "새로운 모험");
    setLobbySaveInput(defaultTitle);
    setLobbySaveModal({ isFromSession: false });
  };

  // 🌟 실제 세팅 저장 실행 (모달에서 '저장하기' 눌렀을 때 실행)
  const confirmSaveLobbyPreset = () => {
    const title = lobbySaveInput.trim();
    if (!title) return;

    if (lobbySaveModal?.isFromSession && activeSession) {
      const s = activeSession;
      let parsedSynopsis = "", parsedOpening = "", parsedTruth = s.scenarioText || "";
      if (s.scenarioText) {
        const synMatch = s.scenarioText.match(/\[공개 시놉시스\]\n([\s\S]*?)\n\n\[초기 배경\/서막\]/);
        const opMatch = s.scenarioText.match(/\[초기 배경\/서막\]\n([\s\S]*?)\n\n\[키퍼 전용 기밀\/진상\]/);
        const trMatch = s.scenarioText.match(/\[키퍼 전용 기밀\/진상\]\n([\s\S]*)$/);
        if (synMatch) parsedSynopsis = synMatch[1].trim();
        if (opMatch) parsedOpening = opMatch[1].trim();
        if (trMatch) parsedTruth = trMatch[1].trim();
      }
      const restoredKpcList = (s.sheet?.npcs || []).map((npc, idx) => ({
        id: npc.id || Date.now() + idx, name: npc.name || "", job: npc.title || "", detail: npc.detail || "", secret: npc.secret || "", portraitUrl: npc.portrait || "", showSecret: false
      }));
      const newLobbyPreset = {
        id: Date.now(), presetTitle: title, scenarioTitle: s.title || "", publicSynopsis: parsedSynopsis, openingScene: parsedOpening, hiddenTruth: parsedTruth, playPreference: s.preference || "#GL #쌍방구원 #달달", wizardMode: s.ruleMode || "coc", charName: s.sheet?.name || "", charJob: s.sheet?.job || "", charAge: s.sheet?.age || "24", charGender: s.sheet?.gender || "여성", charBackground: s.sheet?.background || "", charMission: s.sheet?.mission || "", charSecret: s.sheet?.secret || "", charPortraitUrl: s.sheet?.portrait || "", cocStats: s.sheet?.cocStats, cocSkills: s.sheet?.cocSkills || "", insaneSkills: s.sheet?.insaneSkills || [], insaneCuriosity: s.sheet?.insaneCuriosity || "정서", insaneFear: s.sheet?.insaneFear || "죽음", insaneLimit: s.sheet?.limit || 4, kpcList: restoredKpcList.length > 0 ? restoredKpcList : [{ id: 1, name: "파트너", job: "조력자", detail: "", secret: "", portraitUrl: "", showSecret: false }]
      };
      const updated = [newLobbyPreset, ...lobbyPresets];
      setLobbyPresets(updated);
      localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(updated));
    } else {
      const newLobbyPreset = {
        id: Date.now(), presetTitle: title, scenarioTitle, publicSynopsis, openingScene, hiddenTruth, playPreference, wizardMode, charName, charJob, charAge, charGender, charBackground, charMission, charSecret, charPortraitUrl, cocStats, cocSkills, insaneSkills, insaneCuriosity, insaneFear, insaneLimit, kpcList
      };
      const updated = [newLobbyPreset, ...lobbyPresets];
      setLobbyPresets(updated);
      localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(updated));
    }

    setLobbySaveModal(null);
    triggerToast(`'${title}' 로비 세팅이 저장되었습니다! ✨`);
  };
const handleLoadLobbyPreset = (p) => {
  if (p.charName) setOriginalPresetPcName(p.charName);
  // 🌟 원래 프리셋 속 NPC 이름들을 순수 문자열 배열로 보관 (치환 정상 동작)
  if (p.kpcList && Array.isArray(p.kpcList)) {
    setOriginalPresetNpcs(p.kpcList.map(k => k.name).filter(Boolean));
  }
  if (p.eventCgs) setScenarioCgs(p.eventCgs);
  if (p.thumbnail) setScenarioThumbnail(p.thumbnail);
  setScenarioTitle(p.scenarioTitle || "");
    setPublicSynopsis(p.publicSynopsis || "");
    setOpeningScene(p.openingScene || "");
    setHiddenTruth(p.hiddenTruth || "");
    setPlayPreference(p.playPreference || "");
    if (p.wizardMode) setWizardMode(p.wizardMode);

    setCharName(p.charName || "");
    setCharJob(p.charJob || "");
    setCharAge(p.charAge || "24");
    setCharGender(p.charGender || "여성");
    setCharBackground(p.charBackground || "");
    setCharMission(p.charMission || "");
    setCharSecret(p.charSecret || "");
    setCharPortraitUrl(p.charPortraitUrl || "");

    if (p.cocStats) setCocStats(p.cocStats);
    if (p.cocSkills) setCocSkills(p.cocSkills);
    if (p.insaneSkills) setInsaneSkills(p.insaneSkills);
    if (p.insaneCuriosity) setInsaneCuriosity(p.insaneCuriosity);
    if (p.insaneFear) setInsaneFear(p.insaneFear);
    if (p.insaneLimit) setInsaneLimit(p.insaneLimit);

    if (p.kpcList && Array.isArray(p.kpcList)) setKpcList(p.kpcList);

    closeModal(setShowLobbyPresetModal);
  };

  // 🌟 로비 세팅 JSON 다운로드 (백업)
  const exportLobbyPresets = () => {
    if (lobbyPresets.length === 0) return alert("백업할 로비 세팅이 없습니다.");
    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(lobbyPresets, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `TRPG_로비세팅_${dateStr}.json`; a.click(); URL.revokeObjectURL(url);
  };

  // 🌟 로비 세팅 JSON 불러오기 (복원)
  const importLobbyPresets = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        let imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) imported = [imported];
        const merged = [...imported, ...lobbyPresets];
        const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
        setLobbyPresets(unique);
        localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(unique));
        alert(`${imported.length}개의 로비 세팅을 성공적으로 불러왔습니다!`);
      } catch (err) { alert("복원 실패: " + err.message); }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // 🌟 AI 답변 강제 취소 함수
  const handleCancelResponse = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      setIsAiGenerating(false);
    }
  };

  // 테마 상태
  const [currentPalette, setCurrentPalette] = useState("cloud");
  const [fontChoice, setFontChoice] = useState("maru");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.6);
  // 🌟 [추가] 스마트폰 메신저 서랍 및 햅틱(진동) 상태
  const [vibrationLevel, setVibrationLevel] = useState("medium"); // "off" | "light" | "medium" | "strong"
  const [isPhoneDrawerOpen, setIsPhoneDrawerOpen] = useState(false);
  const [activePhoneContactId, setActivePhoneContactId] = useState(null);
  const [phoneNavTab, setPhoneNavTab] = useState("chats"); // 🌟 "contacts" | "chats" | "settings"
  const [selectedProfileNpc, setSelectedProfileNpc] = useState(null); // 🌟 [추가] 상세 프로필 열람 대상 NPC
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false); // 🌟 내 프로필 모달 상태
  const [giftModalNpc, setGiftModalNpc] = useState(null); // 🌟 인앱 선물 선택 모달 상태
  const [clueModalNpc, setClueModalNpc] = useState(null); // 🌟 인앱 취향 수첩 팝업 상태
  const [zoomedPortrait, setZoomedPortrait] = useState(null); // 🌟 프로필 사진 크게보기 상태
  const [pendingRollback, setPendingRollback] = useState(null); // 🌟 대화 취소(롤백) 확인 모달 상태
  const [appToast, setAppToast] = useState(null); // 🌟 화면 상단 알림 토스트
  const [lobbySaveModal, setLobbySaveModal] = useState(null); // 🌟 로비 세팅 저장 모달
  const [lobbySaveInput, setLobbySaveInput] = useState("");

  const [phoneInput, setPhoneInput] = useState("");
  const [isPhoneSending, setIsPhoneSending] = useState(false);
  const [phoneSuggestions, setPhoneSuggestions] = useState([]);
  const phoneChatContainerRef = useRef(null);

// 🌟 [추가] 시나리오 장르/태그를 분석해서 어울리는 톡 테마를 자동으로 골라주는 함수!
  const detectAutoPhoneTheme = (textContext = "") => {
    const text = textContext.toLowerCase();
    
    // 1. 무협, 동양풍, 판타지, 시대극, 사극, 오컬트 -> 📜 양피지 테마
    if (/무협|동양|판타지|중세|시대|사극|황실|궁정|오컬트|마법|신분차/.test(text)) {
      return "parchment";
    }
    // 2. SF, 사이버펑크, 디스토피아, 이능력, 배틀, 초능력 -> 🔮 네온/사이버 테마
    if (/sf|사이버|네온|이능력|디스토피아|초능력|배틀|우주|안드로이드/.test(text)) {
      return "cyber";
    }
    // 3. 현대, 일상, 캠퍼스, 학원물, 달달 -> 💬 옐로우(카톡) 테마
    if (/현대|일상|캠퍼스|학원|학교|오피스|직장|달달|데이트/.test(text)) {
      return "kakao";
    }
    // 4. 그 외 애매하거나 복합적인 장르 -> ✨ 기본 시스템 테마
    return "default";
  };
  
// 🌟 [추가] 톡 전용 스킨 테마 및 서랍 드래그 제스처 상태
  const [phoneTheme, setPhoneTheme] = useState("default"); // "default" | "kakao" | "parchment" | "cyber"
  const [dragStartY, setDragStartY] = useState(null);
  const [dragCurrentY, setDragCurrentY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("rp_hub_phone_theme");
    if (savedTheme) setPhoneTheme(savedTheme);
  }, []);

  const handleSelectPhoneTheme = (thKey) => {
    setPhoneTheme(thKey);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_phone_theme", thKey);
  };

  // 🌟 [추가] 세션에 입장하거나 바뀔 때, 시나리오 장르에 맞춰 자동으로 톡 테마를 전환!
  useEffect(() => {
    if (!activeSession) return;
    
    // 세션 제목, 서사 태그, 시놉시스를 한데 묶어서 장르 키워드 분석
    const fullContext = `${activeSession.title || ""} ${activeSession.preference || ""} ${activeSession.scenarioText || ""}`;
    const matchedTheme = detectAutoPhoneTheme(fullContext);
    
    // 분석된 장르에 맞게 메신저 테마 자동 변경
    setPhoneTheme(matchedTheme);
  }, [activeSessionId]);

  
  // 🌟 햅틱 진동 실행 엔진
  const triggerVibration = (level = vibrationLevel) => {
    if (typeof window === "undefined" || !window.navigator?.vibrate || level === "off") return;
    try {
      if (level === "light") window.navigator.vibrate(35);
      else if (level === "medium") window.navigator.vibrate([60, 40, 60]);
      else if (level === "strong") window.navigator.vibrate([120, 50, 120]);
    } catch (e) {}
  };

  const handleSaveVibration = (lvl) => {
    setVibrationLevel(lvl);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_vibration", lvl);
    triggerVibration(lvl);
  };
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [portraitStyle, setPortraitStyle] = useState("anime");
  const [exportFormat, setExportFormat] = useState("txt");
  const [selectedExportSessionIds, setSelectedExportSessionIds] = useState([]);
  const [exportScope, setExportScope] = useState("all");
  const [backupFormat, setBackupFormat] = useState("json");
  const [backupTarget, setBackupTarget] = useState("all");

  const [wizardMode, setWizardMode] = useState("coc");
 
const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

 const [tutorialView, setTutorialView] = useState("menu"); // "menu" | "studio_guide"
 const [studioPromptForm, setStudioPromptForm] = useState({
    rule: "",
    keywords: "",
    pcAgeGender: "",
    pcDetail: "",
    pcSecret: "",
    npcCount: "",
    npcAppearance: ""
  });
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // 🌟 여기에 3줄 삽입 완료!
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedScenarioText, setPastedScenarioText] = useState("");
  const [showPasteGuideBanner, setShowPasteGuideBanner] = useState(false);

// 🌟 3분 튜토리얼 방 생성 함수 (CoC / 인세인 완벽 정규 연동 버전)
  const handleStartTutorial = (type) => {
    setIsTutorialModalOpen(false);

    if (type === "coc") {
      const cocSession = {
        id: "tutorial_coc_" + Date.now(),
        title: "🔰 [CoC 튜토리얼] 잠긴 서재 탈출",
        ruleMode: "coc", // 👈 룰 모드 정규 인식
        preference: "#공포 #추리 #탈출",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
        scenarioText: `[튜토리얼 키퍼 절대 행동 지침]
당신은 크툴루의 부름(CoC) 3분 튜토리얼의 키퍼(GM)입니다. 유저의 선택과 입력에 맞춰 아래 4단계를 순서대로 착실히 완수하세요:

1단계 (도입): 밀폐된 서재 상황을 묘사하고, 하단의 관찰력 주사위를 굴리도록 유도.
2단계 (관찰력 판정 후): 성공 연출. 서랍 틈에서 '낡은 서재 열쇠'와 기괴한 양피지를 발견하게 함. 그 직후 거울 속에서 기괴한 형체가 꿈틀거리며 눈이 마주치는 공포 연출을 하고, 즉시 이성(SAN) 체크를 요구할 것.
3단계 (이성 판정 후): 멘탈이 흔들려 이성치가 1 깎였다고 안내(50 -> 49). 공포에 질린 순간 동행자가 손을 잡고 잠긴 문 앞으로 이끌도록 묘사.
4단계 (탈출 시도 후): 철컥 문이 열리며 안전한 복도로 탈출 성공! 가쁜 숨을 몰아쉬는 두 사람의 후일담을 묘사하고, 마지막 줄에 "🎉 [축하합니다! CoC 3분 튜토리얼 수료]" 문구로 종료할 것.`,
        sheet: {
          name: "견습 탐사자",
          job: "기록관",
          hp: 10,
          maxHp: 10,
          san: 50,
          maxSan: 50,
          luck: 55,
          db: "0",
          cocStats: { str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 50, edu: 40, luck: 55 },
          cocSkills: "관찰력 65, 자료조사 50, 듣기 50, 심리학 50",
          background: "호기심 많은 견습 기록관. 서재의 비밀을 밝히고자 합니다.\n소지품: 낡은 수첩, 황동 만년필, 성냥",
          npcs: [
            { id: 1, name: "루이스", title: "동료 탐사자", detail: "냉정하지만 든든한 오랜 조사 파트너.", affection: 10, secret: "이 방의 열쇠 모양을 어렴풋이 기억하고 있다." }
          ],
          items: [{ name: "낡은 수첩" }, { name: "황동 만년필" }]
        },
        suggestedActions: ["1D100 판정: 관찰력 (65%)", "책상을 자세히 조사한다", "잠긴 철문을 살핀다"],
        messages: [
          {
            role: "system",
            text: `📋 [키퍼의 1분 CoC 시트 과외]
화면 상단/사이드의 내 캐릭터 시트를 확인해 보세요!

1. HP 10 / SAN 50: 체력과 이성(멘탈)입니다. 0이 되면 사망하거나 영구 광기에 빠집니다.
2. 관찰력 65%: CoC는 1~100(1D100) 주사위를 굴립니다. 내 수치(65)보다 '낮게' 나와야 판정에 성공합니다! (수치가 높을수록 뛰어난 인물)`
          },
          {
            role: "model",
            text: `서늘한 냉기가 감도는 낡은 서재. 육중한 철문이 굳게 잠겨 있고, 바닥엔 마른 핏자국이 길게 이어져 있습니다.

책상 위에는 어지럽게 널린 고서와 서랍이 보입니다.

💡 [첫 번째 미션]
하단의 칩 버튼 [1D100 판정: 관찰력 (65%)]을 클릭하거나, 상단 헤더의 🎲 주사위 버튼을 눌러보세요!`
          }
        ]
      };
      setSessions((prev) => [cocSession, ...prev]);
      setActiveSessionId(cocSession.id);

    } else if (type === "insane") {
      const insaneSession = {
        id: "tutorial_insane_" + Date.now(),
        title: "🔰 [인세인 튜토리얼] 멈춰 선 엘리베이터",
        ruleMode: "insane", // 👈 룰 모드 정규 인식
        preference: "#공포 #서스펜스 #탈출",
        thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
        scenarioText: `[튜토리얼 키퍼 절대 행동 지침]
당신은 인세인(inSANe) 3분 튜토리얼의 GM입니다. 아래 5단계를 명확하고 친절하게 이끌어주세요:

1단계 (도입): 엘리베이터 안, 동행자 '유진'에게 말을 걸어 [감정 판정: 1D6]을 시도하도록 유도.
2단계 (감정 판정 후): 유진과의 감정(신뢰/동경) 획득 묘사. 그 직후 비상등이 켜지며 [핸드아웃: 비상 인터폰] 등장. 내 특기 [기계]로 2D6 조사 판정 요구.
3단계 (특기 판정 후): 성공 묘사. 인터폰 뒤에 적힌 비밀 해금. 충격으로 [광기 카드: 패닉] 획득 연출.
4단계 (클라이맥스, 의식 & 아이템): 천장에서 괴이 등장! 인터폰 뒤 차단기를 내리는 [탈출 의식 판정: 2D6] 유도.
5단계 (최종 탈출): 안전한 복도로 탈출 성공! "🎉 [축하합니다! inSANe 5단계 사이클 완주]" 문구로 마무리할 것.`,
        sheet: {
          name: "생존자",
          job: "연구원",
          hp: 6,
          maxHp: 6,
          san: 6,
          maxSan: 6,
          limit: 4,
          cycle: 1,
          scene: 1,
          phase: "도입",
          insaneSkills: ["기계", "어둠", "비명", "추적", "침착", "괴이"],
          insaneCuriosity: "기술",
          insaneFear: "어둠",
          background: "심야 연구를 마치고 퇴근하던 연구원.\n소지품: 스마트폰, 사원증",
          npcs: [
            { id: 1, name: "유진", title: "동료 연구원", detail: "피곤한 기색의 직장 동료. 은은한 신뢰감을 풍깁니다.", affection: 0, secret: "사실 이 엘리베이터의 비상 차단기 위치를 알고 있다.", secretRevealed: false }
          ],
          items: [
            { id: "item_painkiller", name: "진통제", count: 1, desc: "생명력 또는 이성치 1 회복" },
            { id: "item_amulet", name: "부적", count: 1, desc: "타인의 판정 재굴림" }
          ],
          handouts: [
            { id: "ho_interphone", title: "비상 인터폰", overview: "벽면에 설치된 낡은 비상 통신 장치. 붉은 표시등이 깜빡입니다.", secret: "수화기 너머에서 '너도 갇혔구나'라는 기괴한 속삭임이 들려옵니다.", revealed: false }
          ],
          rituals: [
            { id: 1, name: "1단계: 비상 차단기 강제 가동", skill: "기계", completed: false }
          ],
          madnessCards: []
        },
        suggestedActions: ["유진에게 따뜻하게 말을 건넨다", "하단의 [감정 판정: 1D6] 시도", "비상 인터폰을 살펴본다"],
        messages: [
          {
            role: "system",
            text: `📋 [키퍼의 1분 inSANe 시트 과외]
화면 상단/사이드의 내 캐릭터 시트를 확인해 보세요!

1. 생명력(HP) 6: 신체와 정신의 한계치입니다. 0이 되면 쓰러집니다.
2. 특기 6개 [기계, 어둠, 비명, 추적, 침착, 괴이]: 내가 체득한 전문 기술입니다.
3. 2D6 판정: 주사위 2개를 굴려 내가 배운 특기는 합이 '5 이상'이면 무조건 성공합니다!
4. 감정(유대): 동행자와 감정을 맺어두면 판정할 때 서로 +1 보너스를 보태줄 수 있습니다.`
          },
          {
            role: "model",
            text: `🎬 [1단계: 도입 페이즈]
늦은 밤, 야근을 마치고 동행자 '유진'(KPC)과 함께 고층 빌딩의 엘리베이터에 탑승했습니다.
조용한 적막 속에서 왠지 모를 서늘한 냉기가 발목을 감돕니다. 유진은 피곤한 얼굴로 멍하니 층수 표시기를 올려다보고 있습니다.

💡 [첫 번째 미션: 감정 판정]
인세인의 핵심은 동행자와 유대를 맺는 것입니다!
하단의 칩 버튼이나, [+] 서랍의 [감정 맺기]를 눌러보세요!`
          }
        ]
      };
      setSessions((prev) => [insaneSession, ...prev]);
      setActiveSessionId(insaneSession.id);
    }
  };


  // 캐릭터 폼 상태
  const [charName, setCharName] = useState("");
  const [originalPresetPcName, setOriginalPresetPcName] = useState("");
  const [originalPresetNpcs, setOriginalPresetNpcs] = useState([]);
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("24");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");
  const [showCharSecret, setShowCharSecret] = useState(false);
  const [charPortraitUrl, setCharPortraitUrl] = useState("");
  const [customPortraitPrompt, setCustomPortraitPrompt] = useState("");
  const [activePortraitTarget, setActivePortraitTarget] = useState("pc");
 

  // CoC 스탯 및 기능치
  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });
  const [cocSkills, setCocSkills] = useState("관찰력 60, 자료조사 50, 듣기 40, 심리학 50");
  const remainingPoints = 460 - (Number(cocStats.str) + Number(cocStats.con) + Number(cocStats.siz) + Number(cocStats.dex) + Number(cocStats.app) + Number(cocStats.int) + Number(cocStats.pow) + Number(cocStats.edu));
  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);
  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0";
  if (strPlusSiz <= 64) derivedDb = "-2"; else if (strPlusSiz <= 84) derivedDb = "-1"; else if (strPlusSiz <= 124) derivedDb = "0"; else if (strPlusSiz <= 164) derivedDb = "+1D4"; else derivedDb = "+1D6";

  // 인세인 설정
  const [insaneLimit, setInsaneLimit] = useState(4);
  const [insaneSkills, setInsaneSkills] = useState(["연심", "소리", "정리"]);
  const [insaneCuriosity, setInsaneCuriosity] = useState("정서");
  const [insaneFear, setInsaneFear] = useState("죽음");
  const [generatedHandouts, setGeneratedHandouts] = useState([]);
  const [generatedItems, setGeneratedItems] = useState([]); // 🌟 AI/파일로부터 자동 기획된 소지품 목록
 // 🎒 인세인 초기 아이템 선택 상태 (기본값: 진통제 2개)
  const [insaneItems, setInsaneItems] = useState({
    "진통제": 2,
    "무기": 0,
    "부적": 0
  });

  // 아이템 수량 변경 (최대 2개 제한)
  const handleItemCountChange = (itemName, delta) => {
    const totalCount = Object.values(insaneItems).reduce((a, b) => a + b, 0);
    const currentCount = insaneItems[itemName] || 0;

    if (delta > 0 && totalCount >= 2) {
      if (typeof triggerToast === "function") {
        triggerToast("아이템 제한", "초기 아이템은 최대 2개까지만 선택할 수 있습니다.", "⚠️");
      }
      return;
    }
    if (delta < 0 && currentCount <= 0) return;

    setInsaneItems(prev => ({
      ...prev,
      [itemName]: currentCount + delta
    }));
  };

  // KPC(파트너) 상태
  const [kpcList, setKpcList] = useState([
    { id: 1, name: "파트너", job: "조력자", detail: "", secret: "", portraitUrl: "", showSecret: false }
  ]);

  // 시나리오 폼 상태
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [publicSynopsis, setPublicSynopsis] = useState("");
  const [openingScene, setOpeningScene] = useState("");
  const [hiddenTruth, setHiddenTruth] = useState("");
  const [showHiddenTruth, setShowHiddenTruth] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [playPreference, setPlayPreference] = useState("#GL #쌍방구원 #달달");
  const [customPresets, setCustomPresets] = useState([]);

  // 주사위 및 연출 상태
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [activeMadnessAlert, setActiveMadnessAlert] = useState(null);
  const [showInsanityFlash, setShowInsanityFlash] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const activePalette = THEME_PALETTES[currentPalette] || THEME_PALETTES.cloud;
  const theme = isDarkMode ? activePalette.dark : activePalette.light;

// 🕒 과거 대화 기록을 스캔하여 기존 세션 시간대 자동 동기화 (새로고침 즉시 반영)
  useEffect(() => {
    if (!activeSession?.messages || activeSession.messages.length === 0) return;

    const msgs = activeSession.messages;
    const introText = (activeSession?.sheet?.scenario || activeSession?.scenarioText || "") + " " + (msgs[0]?.text || "");
    const recentMsgs = msgs.slice(-6);
    const combinedText = introText + " " + recentMsgs.map(m => m.text || "").join(" ");

    let detectedPhase = null;
    if (/밤까지|자정을|밤이\s*되|어두워|촛불|깊은\s*어둠/.test(combinedText)) {
      detectedPhase = "밤";
    } else if (/새벽|심야|푸르스름|동이\s*트기\s*전/.test(combinedText)) {
      detectedPhase = "새벽";
    } else if (/아침|기상|눈을\s*뜬|다음\s*날\s*아침/.test(combinedText)) {
      detectedPhase = "아침";
    } else if (/저녁|노을|황혼|해질/.test(combinedText)) {
      detectedPhase = "저녁";
    } else if (/정오|한낮|대낮/.test(combinedText)) {
      detectedPhase = "낮";
    }

    if (detectedPhase && detectedPhase !== currentPhase) {
      setCurrentPhase(detectedPhase);
    }
  }, [activeSession?.id, activeSession?.messages?.length]);

// 🎨 [과거 기록 전수 조사] 잘못 들어간 엔딩/미도달 CG 자동 청소 및 정상 CG만 보관
  useEffect(() => {
    if (!activeSession || !activeSession.messages || activeSession.messages.length === 0) return;

    const allScenarioCgs = activeSession.sheet?.scenarioCgs || activeSession.sheet?.cgs || scenarioCgs || [];
    if (allScenarioCgs.length === 0) return;

    const currentUnlocked = activeSession.sheet?.unlockedCgs || [];
    const npcs = activeSession.sheet?.npcs || [];
    const isBeginning = (activeSession.messages || []).length <= 2;
    
    // 💡 에러 방지: 대화 이력 텍스트를 최상단에서 안전하게 선언
    const fullHistory = (activeSession.messages || []).map(m => m.text || "").join(" ");
    const lastMsgText = activeSession.messages[activeSession.messages.length - 1]?.text || "";
    const isEnded = /\[(?:True|Happy|Bad|Dead|Normal|Open|Hidden|Secret)?\s*End[: \]]|완결|막을 내렸다/i.test(lastMsgText);

    // 🚨 극초반에는 1번 프롤로그 CG 1장만 남기고 오해금된 모든 CG 강제 청소
    if (isBeginning) {
      const firstCg = allScenarioCgs[0] || (currentUnlocked.length > 0 ? currentUnlocked[0] : null);
      const resetList = firstCg ? [{ ...(typeof firstCg === "object" ? firstCg : { title: firstCg }), unlockedAt: Date.now() }] : [];
      
      const currentTitles = currentUnlocked.map(c => c?.title || c || "").join(",");
      const resetTitles = resetList.map(c => c?.title || c || "").join(",");

      if (currentTitles !== resetTitles) {
        setSessions(prev => prev.map(s => s.id === activeSession.id ? {
          ...s,
          sheet: { ...s.sheet, unlockedCgs: resetList }
        } : s));
      }
      return;
    }

    const properlyUnlocked = [];

    allScenarioCgs.forEach((cg, idx) => {
      if (!cg) return;
      const triggerCond = (cg.trigger || cg.condition || "").trim();
      const cgTitle = (cg.title || "").trim();

      // 1. 엔딩 CG 차단
      const isEndingCg = /Bad\s*End|True\s*End|Happy\s*End|Hidden\s*End|Normal\s*End|히든|트루|해피|배드|노말|엔딩|파멸|사망/i.test(cgTitle) ||
                         /Bad\s*End|True\s*End|Happy\s*End|Hidden\s*End|Normal\s*End|히든|트루|해피|배드|노말|엔딩/i.test(triggerCond);
      if (isEndingCg && !isEnded && activeSession.sheet?.phase !== "배드엔딩" && activeSession.sheet?.phase !== "에필로그") {
        return;
      }

      // 💡 에러 방지: 대상 인물 정보를 먼저 추출한 뒤 대면 조건을 판정
      const targetNpc = npcs.find(n => n.name && triggerCond.includes(n.name));
      const targetNpcName = targetNpc?.name || "";

      // 2. 1번 CG (프롤로그 / 첫 대면 소급 인정)
      const isFirstMeetingTrigger = /프롤로그|첫\s*대면|첫\s*만남|시작/.test(triggerCond);
      const isAlreadyMetInHistory = targetNpcName ? fullHistory.includes(targetNpcName) : false;

      if (idx === 0 || (isFirstMeetingTrigger && (idx === 0 || isAlreadyMetInHistory))) {
        properlyUnlocked.push({ ...cg, unlockedAt: cg.unlockedAt || Date.now() });
        return;
      }

      // 3. 호감도 조건 검사
      const curAff = targetNpc ? Number(targetNpc.affection || 0) : Math.max(...npcs.map(n => Number(n.affection) || 0), 0);

      // 루트 진입 (호감도 50 이상 & 독점)
      const isRouteTrigger = /루트\s*(진입|확정|돌입)/.test(triggerCond);
      if (isRouteTrigger) {
        const otherAffs = npcs.filter(n => n.name !== targetNpcName).map(n => Number(n.affection) || 0);
        const maxOther = otherAffs.length > 0 ? Math.max(...otherAffs) : 0;
        if (curAff >= 50 && curAff >= maxOther) {
          properlyUnlocked.push({ ...cg, unlockedAt: Date.now() });
        }
        return;
      }

      // 일반 수치 호감도 (예: 호감도 40)
      const favMatch = triggerCond.match(/호감도[^\d]*(\d+)/);
      const reqFav = favMatch ? parseInt(favMatch[1], 10) : 0;
      if (reqFav > 0) {
        if (curAff >= reqFav) {
          properlyUnlocked.push({ ...cg, unlockedAt: Date.now() });
        }
        return;
      }

      // 4. 상황/사건 CG: 대화창에서 AI가 실제로 컷씬(m.cg)을 띄운 적이 있을 때만 유지
      const actuallyEmittedInChat = (activeSession.messages || []).some(m => 
        m.cg && ((m.cg.title && m.cg.title === cgTitle) || (m.cg.imageUrl && m.cg.imageUrl === cg.imageUrl))
      );
      if (actuallyEmittedInChat && !isEndingCg) {
        properlyUnlocked.push({ ...cg, unlockedAt: cg.unlockedAt || Date.now() });
      }
    });

    const uniqueUnlocked = Array.from(new Map(properlyUnlocked.map(c => [c.title || c.imageUrl, c])).values());
    const currentTitles = currentUnlocked.map(c => c?.title || c || "").join(",");
    const uniqueTitles = uniqueUnlocked.map(c => c?.title || c || "").join(",");

    if (currentTitles !== uniqueTitles) {
      setSessions(prev => prev.map(s => s.id === activeSession.id ? {
        ...s,
        sheet: { ...s.sheet, unlockedCgs: uniqueUnlocked }
      } : s));
    }
  }, [activeSession?.id, activeSession?.messages?.length, currentPhase]);
 
// 🌟 폰 서랍의 모든 세부 부품까지 완벽하게 물들이는 4대 풀스킨 팔레트
  const PHONE_SKINS = {
    default: {
      name: "시스템",
      icon: "✨",
      shellBg: theme.panel,
      headerBg: theme.sidebar,
      chatBg: theme.panel,
      panelAlt: theme.panelAlt,
      border: theme.border,
      text: theme.text,
      textMuted: theme.textMuted,
      navBtn: theme.text, // < 목록, ✕ 버튼 색
      inputBg: theme.inputBg || theme.panel,
      inputText: theme.text,
      userBubbleBg: theme.accent,
      userBubbleText: "#ffffff",
      npcBubbleBg: theme.panelAlt,
      npcBubbleText: theme.text,
      npcBubbleBorder: theme.border,
      accent: theme.accent,
      accentText: "#ffffff",
      heart: theme.danger
    },
    kakao: {
      name: "옐로우",
      icon: "💬",
      shellBg: "#b2c7d9", // 카톡 특유의 파스텔 하늘색 배경
      headerBg: "#9bb3c7",
      chatBg: "#b2c7d9",
      panelAlt: "#ffffff",
      border: "rgba(0, 0, 0, 0.08)",
      text: "#191919",
      textMuted: "#556677",
      navBtn: "#1e1e1e",
      inputBg: "#ffffff",
      inputText: "#191919",
      userBubbleBg: "#fee500",
      userBubbleText: "#191919",
      npcBubbleBg: "#ffffff",
      npcBubbleText: "#191919",
      npcBubbleBorder: "rgba(0, 0, 0, 0.06)",
      accent: "#fee500",
      accentText: "#191919",
      heart: "#e03e52"
    },
    parchment: {
      name: "양피지",
      icon: "📜",
      shellBg: "#eddcc3", // 고문서 양피지 색상
      headerBg: "#d9c0a3",
      chatBg: "#ebd8be",
      panelAlt: "#f8f0e3",
      border: "rgba(100, 70, 35, 0.2)",
      text: "#382310",
      textMuted: "#7a5c3e",
      navBtn: "#382310",
      inputBg: "#fbf6ec",
      inputText: "#382310",
      userBubbleBg: "#be8a54",
      userBubbleText: "#ffffff",
      npcBubbleBg: "#fbf6ec",
      npcBubbleText: "#382310",
      npcBubbleBorder: "rgba(100, 70, 35, 0.25)",
      accent: "#8c531b",
      accentText: "#fdfaf5",
      heart: "#a83232"
    },
    cyber: {
      name: "네온",
      icon: "🔮",
      shellBg: "#080c14", // 흑요석 다크 배경
      headerBg: "#04060a",
      chatBg: "#070a12",
      panelAlt: "#0e1522",
      border: "rgba(0, 245, 212, 0.28)",
      text: "#e0fbfc",
      textMuted: "#5a7888",
      navBtn: "#00f5d4", // 발광 청록색 버튼
      inputBg: "#090f18",
      inputText: "#00f5d4",
      userBubbleBg: "#00f5d4",
      userBubbleText: "#020912",
      npcBubbleBg: "#121a27",
      npcBubbleText: "#e0fbfc",
      npcBubbleBorder: "rgba(0, 245, 212, 0.35)",
      accent: "#00f5d4",
      accentText: "#040810",
      heart: "#ff2a70" // 사이버 펑크 네온 핑크 하트
    }
  };
  const activePhoneSkin = PHONE_SKINS[phoneTheme] || PHONE_SKINS.default;
  
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [activeSession?.messages, isLoading]);

 function getPortraitUrl(promptText) {
    const clean = promptText || "character portrait";
    const styleTag = portraitStyle === "anime" ? "anime style, 2d illustration, masterpiece" : "realistic photography, cinematic lighting, 8k";
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(clean + ", " + styleTag)}?width=300&height=300&nologo=true`;
  }

  function handleToggleDarkMode() {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_darkmode", next.toString());
  }

  function handleSelectPalette(pKey) {
    setCurrentPalette(pKey);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_palette", pKey);
  }

  function handleSaveVolume(vol) {
    setSoundVolume(vol);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_sound_vol", vol.toString());
  }

  function playDiceSound() {
    if (soundVolume <= 0) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const startTime = now + i * 0.08;
        osc.frequency.setValueAtTime(160 + Math.random() * 150, startTime);
        osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.04);
        gain.gain.setValueAtTime(soundVolume * 0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.05);
      }
    } catch (e) {}
  }

useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const openModal = (setModalFn) => { window.history.pushState({ modalOpen: true }, ""); setModalFn(true); };
  const closeModal = (setModalFn) => { setModalFn(false); if (window.history.state?.modalOpen) window.history.back(); };

  const toggleTag = (tag) => {
    setPlayPreference((prev) => {
      const list = prev.split(/\s+/).filter(Boolean);
      return list.includes(tag) ? list.filter((t) => t !== tag).join(" ") : [...list, tag].join(" ");
    });
  };

  const toggleInsaneSkill = (skill) => {
    setInsaneSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleRandomCocStats = () => {
    let stats = { str: 15, con: 15, siz: 15, dex: 15, app: 15, int: 15, pow: 15, edu: 15 };
    let rem = 460 - (15 * 8);
    const keys = Object.keys(stats);
    while (rem > 0) {
      const k = keys[Math.floor(Math.random() * keys.length)];
      if (stats[k] < 85) {
        const add = Math.min(5, rem, 85 - stats[k]);
        stats[k] += add;
        rem -= add;
      }
    }
    setCocStats({ ...stats, luck: Math.floor(Math.random() * 50) + 40 });
  };

 const advanceInsaneScene = (sessionId) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId || s.ruleMode !== "insane") return s;
      if (s.sheet?.phase === "클라이맥스") return s; // 👈 혹시 이 줄 끝에 } 가 붙어있지 않나요?
      let currScene = s.sheet?.scene || 1;
      let currCycle = s.sheet?.cycle || 1;
      const limit = s.sheet?.limit || 4;
     
      if (currScene >= 2) {
        currCycle += 1;
        currScene = 1;
      } else {
        currScene += 1;
      }

      const isClimax = currCycle > limit;
      return {
        ...s,
        sheet: {
          ...s.sheet,
          cycle: currCycle,
          scene: currScene,
          phase: isClimax ? "클라이맥스" : "메인"
        }
      };
    }));
  };

  const drawMadnessCard = (targetSessionId, autoNotify = true) => {
    let drawnCard = null;
    setSessions(prev => prev.map(s => {
      if (s.id !== targetSessionId || s.ruleMode !== "insane") return s;
      const deck = [...(s.sheet?.madnessDeck && s.sheet.madnessDeck.length > 0 ? s.sheet.madnessDeck : INSANE_MADNESS_TABLE)];
      drawnCard = deck.shift();
      const newHand = [...(s.sheet?.madnessCards || []), { ...drawnCard, id: Date.now() + Math.random(), revealed: false }];
      
      const newMessages = autoNotify ? [
        ...(s.messages || []),
        { role: "user", text: `[🎲 시스템: 이성 감소로 인해 광기 덱에서 《${drawnCard.name}》 카드를 1장 뽑았습니다 (미발현)]` }
      ] : (s.messages || []);

      return {
        ...s,
        messages: newMessages,
        sheet: {
          ...s.sheet,
          madnessDeck: deck,
          madnessCards: newHand
        }
      };
    }));

    if (drawnCard) {
      playDiceSound();
    }
    return drawnCard;
  };

  const manifestMadnessCard = (cardId, targetSessionId) => {
    const session = sessions.find(s => s.id === targetSessionId);
    if (!session) return;
    const card = (session.sheet?.madnessCards || []).find(c => c.id === cardId);
    if (!card) return;

    setShowInsanityFlash(true);
    setTimeout(() => setShowInsanityFlash(false), 500);

    setActiveMadnessAlert({ name: card.name, desc: card.desc });
    setInput(prev => `[광기 발현: ${card.name}] ` + prev);

    setSessions(prev => prev.map(s => {
      if (s.id !== targetSessionId) return s;
      const updatedCards = (s.sheet?.madnessCards || []).map(c => c.id === cardId ? { ...c, revealed: true } : c);
      return {
        ...s,
        sheet: {
          ...s.sheet,
          madnessStatus: `광기 발현: ${card.name}`,
          madnessCards: updatedCards
        },
        messages: [
          ...(s.messages || []),
          { role: "user", text: `[⚠️ 광기 발현 선언: 《${card.name}》]\n"${card.desc}"\n(이 충동과 공포가 캐릭터의 행동을 잠식합니다.)` }
        ]
      };
    }));
  };

  const triggerMadnessDirectly = (targetSessionId) => {
    const session = sessions.find(s => s.id === targetSessionId);
    if (!session) return;
    
    const deck = [...(session.sheet?.madnessDeck && session.sheet.madnessDeck.length > 0 ? session.sheet.madnessDeck : INSANE_MADNESS_TABLE)];
    const card = deck.shift();

    setShowInsanityFlash(true);
    setTimeout(() => setShowInsanityFlash(false), 500);

    setActiveMadnessAlert({ name: card.name, desc: card.desc });
    setInput(prev => `[광기 발현: ${card.name}] ` + prev);

    const newHand = [...(session.sheet?.madnessCards || []), { ...card, id: Date.now(), revealed: true }];

    setSessions(prev => prev.map(s => s.id === targetSessionId ? {
      ...s,
      sheet: {
        ...s.sheet,
        madnessDeck: deck,
        madnessCards: newHand,
        madnessStatus: `광기 발현: ${card.name}`
      },
      messages: [
        ...(s.messages || []),
        { role: "user", text: `[⚠️ 광기 발현 선언: 《${card.name}》]\n"${card.desc}"\n(이 충동과 공포가 캐릭터의 행동을 잠식합니다.)` }
      ]
    } : s));
  };

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    const controller = new AbortController();
    setAbortController(controller);

    const randomSeeds = ["비밀 결사", "폭설로 고립된 저택", "안개 낀 호숫가", "금지된 오컬트 서점", "시간이 멈춘 시계탑", "가면무도회"];
    const pickedSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];

    const systemPrompt = `당신은 탁월한 창작력을 지닌 정통 TRPG 마스터입니다.
룰 [${wizardMode}]과 성향 [${playPreference}]에 맞춰 [모티프: ${pickedSeed}]를 살려 매번 완전히 새로운 시나리오를 창작하십시오.

[🚨 절대 수칙]
1. 모든 인물은 무조건 매력적인 여성(GL)입니다. 맹목적인 집착은 배제하고 섬세한 유대감을 부여하십시오.
2. 'PC', 'KPC'라는 단어를 일절 쓰지 말고 어울리는 고유한 이름을 직접 지어 사용하십시오.
3. 핸드아웃의 secret(비밀)란을 절대로 빈칸으로 두지 마십시오.

[주변 인물(엑스트라/조연) 묘사 및 개입 규칙]
1. 세계관 일관성: 스쳐 지나가는 하녀, 시종장, 타 가문 귀족, 직장 상사 등 모든 주변인은 예외 없이 여성으로만 묘사합니다.
2. 기능성 엑스트라의 지위: 서사의 배경을 채우는 조연들은 고유 이름 대신 직책(예: 시종장, 젊은 전령, 옆 부서 팀장)으로 지칭하며, <!-- NPC: ... --> 태그를 발행하여 주요 인물 목록에 등록시키지 마십시오.
3. 난입과 개입의 제한:
   - PC와 핵심 인물 간의 깊은 대화나 긴장감 넘치는 밀회 도중 무맥락으로 끼어들어 흐름을 끊는 개입은 엄격히 금지합니다.
   - 주변인의 존재는 공적인 자리에서 서로의 감정을 숨겨야 하는 '은밀한 긴장감 연출'이나, 새로운 사건/정보를 전달하는 '메신저' 역할로만 제한적으로 활용하십시오.

반드시 마크다운 없이 순수 JSON으로만 응답하십시오:
{
  "name": "주인공 이름",
  "gender": "여성",
  "age": "나이",
  "job": "역할/직업",
  "background": "상처와 성격, 소지품 3가지 상세",
  "mission": "주인공의 표면상 사명",
  "secret": "주인공이 숨긴 진짜 목적이나 비밀",
  "kpcName": "파트너 여성 이름",
  "kpcJob": "파트너 직업",
  "kpcDetail": "파트너 성격, 외모, 주인공과의 미묘한 관계성",
  "kpcSecret": "파트너가 숨겨둔 치명적인 비밀이나 진심",
  "limit": ${Math.floor(Math.random() * 2) + 3},
  "scenarioTitle": "독창적이고 매력적인 시나리오 제목",
  "publicSynopsis": "스포일러 없는 시놉시스 3~4줄",
  "openingScene": "서막의 공감각적 묘사와 첫 대사를 담은 풍성한 지문",
  "hiddenTruth": "배후 진상 및 흑막(Keeper 기밀)",
  "items": [
    { "name": "캐릭터의 신분과 성격에 어울리는 소지품 1", "desc": "간략한 설명" },
    { "name": "소지품 2", "desc": "간략한 설명" }
  ],
  "initialHandouts": [
    { "title": "주인공의 사명과 비밀", "overview": "현재 상황 개요", "secret": "뒤집었을 때의 진실" },
    { "title": "파트너의 태도와 시선", "overview": "겉으로 보이는 태도", "secret": "뒤집었을 때의 진짜 속마음" },
    { "title": "현장 단서 1", "overview": "사물/장소 묘사", "secret": "조사 성공 시 밝혀지는 비밀" },
    { "title": "현장 단서 2", "overview": "핵심 기록물 묘사", "secret": "해금되었을 때의 진실" }
  ]
}`;
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [{ role: "user", text: systemPrompt }],
          scenarioText: "",
          playerSheet: {},
          ruleMode: wizardMode,
          playPreference
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `서버 응답 오류 (상태 코드: ${response.status})`);
      }

      const data = await response.json();
      const cleanJson = (data.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      const p = JSON.parse(cleanJson);

      const pName = p.name || "";
      const kName = p.kpcName || "";

      setCharName(pName);
      setCharJob(p.job || "");
      setCharAge(p.age || "");
      setCharGender("");
      setCharBackground(p.background || "");
      setCharPortraitUrl(getPortraitUrl(`${pName}, ${p.job}`));

      if (p.mission) setCharMission(p.mission);
      if (p.secret) setCharSecret(p.secret);
      if (p.limit) setInsaneLimit(Number(p.limit));

      setKpcList([{
        id: 1,
        name: kName,
        job: p.kpcJob || "",
        detail: p.kpcDetail || "",
        secret: p.kpcSecret || "",
        portraitUrl: getPortraitUrl(`${kName}, portrait`),
        showSecret: false
      }]);

      setScenarioTitle(p.scenarioTitle || "");
      setPublicSynopsis(p.publicSynopsis || "");
      setOpeningScene(p.openingScene || "");
      setHiddenTruth(p.hiddenTruth || "");
      setGeneratedHandouts(p.initialHandouts || []);
      if (p.items && Array.isArray(p.items)) setGeneratedItems(p.items);

      if (wizardMode === "coc") handleRandomCocStats();
    } catch (e) {
      if (e.name === "AbortError") return;
      alert("AI 생성 실패: " + e.message);
    } finally {
      setIsAiGenerating(false);
      setAbortController(null);
    }
  };

  // 🌟 PC/KPC 치환 완료 알림 (alert 대신 토스트)
  const handleAutoReplaceKpcPc = () => {
    const pName = charName.trim() || "주인공";
    const kName = kpcList[0]?.name || "파트너";
    setPublicSynopsis(publicSynopsis.replace(/\bKPC\b/gi, kName).replace(/\bPC\b/gi, pName));
    setOpeningScene(openingScene.replace(/\bKPC\b/gi, kName).replace(/\bPC\b/gi, pName));
    setHiddenTruth(hiddenTruth.replace(/\bKPC\b/gi, kName).replace(/\bPC\b/gi, pName));
    triggerToast(`'PC' ➔ '${pName}', 'KPC' ➔ '${kName}' 치환 완료! 🔄`);
  };

  const handleSaveCurrentAsPreset = () => {
    const targetName = activeSession ? activeSession.sheet?.name : charName;
    if (!targetName) return alert("저장할 캐릭터 이름이 없습니다.");

    const sheetData = activeSession ? activeSession.sheet : {
      name: charName, job: charJob, age: charAge, gender: charGender,
      background: charBackground, portrait: charPortraitUrl, ruleMode: wizardMode,
      cocStats, cocSkills, insaneSkills, insaneCuriosity, insaneFear, mission: charMission, secret: charSecret
    };

    const newPreset = {
      id: Date.now(),
      title: `${sheetData.name} (${sheetData.job || "설정"})`,
      ...sheetData
    };

    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_custom_presets", JSON.stringify(updated));
    alert(`'${sheetData.name}' 캐릭터가 프리셋으로 저장되었습니다!`);
  };

  // 🌟 세션 전체(PC + KPC + 시나리오)를 로비 세팅으로 저장
  const handleSaveSessionAsLobbyPreset = () => {
    if (!activeSession) return;
    const s = activeSession;
    const defaultTitle = s.title || `${s.sheet?.name || "캐릭터"} 세팅`;
    const titlePrompt = prompt("로비 전체 세팅으로 저장할 이름을 입력하세요:", defaultTitle);
    if (!titlePrompt) return;

    let parsedSynopsis = "";
    let parsedOpening = "";
    let parsedTruth = s.scenarioText || "";

    // 🌟 통째로 합쳐진 텍스트에서 시놉시스, 서막, 진상을 각각 분리 복원
    if (s.scenarioText) {
      const synMatch = s.scenarioText.match(/\[공개 시놉시스\]\n([\s\S]*?)\n\n\[초기 배경\/서막\]/);
      const opMatch = s.scenarioText.match(/\[초기 배경\/서막\]\n([\s\S]*?)\n\n\[키퍼 전용 기밀\/진상\]/);
      const trMatch = s.scenarioText.match(/\[키퍼 전용 기밀\/진상\]\n([\s\S]*)$/);
      
      if (synMatch) parsedSynopsis = synMatch[1].trim();
      if (opMatch) parsedOpening = opMatch[1].trim();
      if (trMatch) parsedTruth = trMatch[1].trim();
    }

    const restoredKpcList = (s.sheet?.npcs || []).map((npc, idx) => ({
      id: npc.id || Date.now() + idx, 
      name: npc.name || "", 
      job: npc.title || "", 
      detail: npc.detail || "", 
      secret: npc.secret || "", 
      portraitUrl: npc.portrait || "", 
      showSecret: false
    }));

    const newLobbyPreset = {
      id: Date.now(), 
      presetTitle: titlePrompt, 
      scenarioTitle: s.title || "", 
      publicSynopsis: parsedSynopsis, 
      openingScene: parsedOpening, 
      hiddenTruth: parsedTruth, 
      playPreference: s.preference || "#GL #쌍방구원 #달달", 
      wizardMode: s.ruleMode || "coc", 
      charName: s.sheet?.name || "", 
      charJob: s.sheet?.job || "", 
      charAge: s.sheet?.age || "24", 
      charGender: s.sheet?.gender || "여성", 
      charBackground: s.sheet?.background || "", 
      charMission: s.sheet?.mission || "", 
      charSecret: s.sheet?.secret || "", 
      charPortraitUrl: s.sheet?.portrait || "", 
      cocStats: s.sheet?.cocStats || { str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 }, 
      cocSkills: s.sheet?.cocSkills || "", 
      insaneSkills: s.sheet?.insaneSkills || [], 
      insaneCuriosity: s.sheet?.insaneCuriosity || "정서", 
      insaneFear: s.sheet?.insaneFear || "죽음", 
      insaneLimit: s.sheet?.limit || 4, 
      kpcList: restoredKpcList.length > 0 ? restoredKpcList : [{ id: 1, name: "파트너", job: "조력자", detail: "", secret: "", portraitUrl: "", showSecret: false }]
    };

    const updated = [newLobbyPreset, ...lobbyPresets];
    setLobbyPresets(updated);
    localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(updated));
    alert(`'${titlePrompt}' 세팅이 로비 전체 프리셋으로 저장되었습니다!`);
  };

  const handleLoadPreset = (preset) => {
    setCharName(preset.name || "");
    setCharJob(preset.job || "");
    setCharAge(preset.age || "24");
    setCharGender(preset.gender || "여성");
    setCharBackground(preset.background || "");
    if (preset.portrait) setCharPortraitUrl(preset.portrait);
    if (preset.cocStats) setCocStats(preset.cocStats);
    if (preset.cocSkills) setCocSkills(preset.cocSkills);
    if (preset.insaneSkills) setInsaneSkills(preset.insaneSkills);
    if (preset.insaneCuriosity) setInsaneCuriosity(preset.insaneCuriosity);
    if (preset.insaneFear) setInsaneFear(preset.insaneFear);
    if (preset.mission) setCharMission(preset.mission);
    if (preset.secret) setCharSecret(preset.secret);
    closeModal(setShowPresetModal);
  };

// 🌟 [CoC / 인세인 / 자유 서사 통합 파서] 원본 로직 100% 보존 공용 분리형
const processScenarioText = (rawText) => {
  if (!rawText || !rawText.trim()) return;

  const cleanVal = (str) => {
    if (!str) return "";
    return str
      .replace(/^\|\||\|\|$/g, "")
      .replace(/```[a-z]*\n?/gi, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();
  };

  // ── [0. 룰 시스템 자동 감지 (맨 윗줄 '룰 시스템' 최우선 판정)] ──
  const ruleLineMatch = rawText.match(/(?:룰\s*시스템|룰\s*모드|룰)\s*[:：]\s*([^\n\r]+)/i);
  const ruleTargetText = ruleLineMatch ? ruleLineMatch[1] : rawText.slice(0, 300);

  let detectedMode = wizardMode;
  if (/인세인|insane/i.test(ruleTargetText)) {
    detectedMode = "insane";
    setWizardMode("insane");
  } else if (/크툴루|coc/i.test(ruleTargetText)) {
    detectedMode = "coc";
    setWizardMode("coc");
  } else if (/자유\s*서사|소설\s*모드|freeform/i.test(ruleTargetText)) {
    detectedMode = "freeform";
    setWizardMode("freeform");
  } else if (/미연시|연애\s*시뮬레이션|dating/i.test(ruleTargetText)) {
    detectedMode = "dating";
    setWizardMode("dating");
  }

  // 태그 자동 추출
  const tagMatch = rawText.match(/(?:서사\s*지향\s*태그|장르\s*톤|태그|키워드)\s*[:：]\s*([^\n\r]+)/i);
  if (tagMatch) setPlayPreference(tagMatch[1].trim());

  // ── [1. 시나리오 본문 & 진상] ──
  const titleMatch = rawText.match(/(?:시나리오\s*제목|제목)\s*[:：]\s*([^\n\r]+)/i);
  if (titleMatch) setScenarioTitle(titleMatch[1].trim());

  const synMatch = rawText.match(/(?:\[공개\s*시놉시스\]|공개\s*시놉시스\s*[:：]?|#+\s*\d*\.?\s*시놉시스[^\n]*)\s*([\s\S]*?)(?=\n\s*(?:\[서막\]|서막\s*[:：]|\[도입부\]|도입부\s*[:：]|#+\s*\d*\.?\s*도입부|#+\s*\d*\.?\s*서막|###|\n\n\[|$))/i);
  if (synMatch) setPublicSynopsis(synMatch[1].trim());

  const opMatch = rawText.match(/(?:\[서막\]|서막\s*[:：]?|\[도입부\]|도입부\s*[:：]?|#+\s*\d*\.?\s*도입부[^\n]*|#+\s*\d*\.?\s*서막[^\n]*|오프닝\s*[:：]?)\s*([\s\S]*?)(?=\n\s*(?:\[키퍼|키퍼\s*전용|#+\s*\d*\.?\s*진상|사건의\s*진상|###|\n\n\[|$))/i);
  if (opMatch) setOpeningScene(opMatch[1].trim());

  const trMatch = rawText.match(/(?:\[키퍼\s*전용[^\n]*\]|키퍼\s*전용\s*(?:스포일러|진상|기밀)[^:：\n]*[:：]?|사건의\s*진상|#+\s*\d*\.?\s*진상[^\n]*|\[진상\]|진상\s*[:：])\s*([\s\S]*?)(?=\n\s*(?:###\s*\d|\[내\s*프로필|\[PC\s*프로필|\[등장인물|$))/i);
  if (trMatch) setHiddenTruth(cleanVal(trMatch[1]));

  // ── [2. 내 프로필 (PC 공통)] ──
  const pcSectionMatch = rawText.match(/(?:###\s*1\.\s*내\s*프로필|\[PC\s*프로필\])([\s\S]*?)(?=\n\s*(?:###\s*2\.|\[등장인물|\[CoC|\[인세인))/i);
  const pcText = pcSectionMatch ? pcSectionMatch[1] : rawText;

  const pcNameMatch = pcText.match(/이름\s*[:：]\s*([^\n\r]+)/i);
  if (pcNameMatch) setCharName(pcNameMatch[1].trim());

  const pcJobMatch = pcText.match(/(?:직업|역할|직업\/역할)\s*[:：]\s*([^\n\r]+)/i);
  if (pcJobMatch) setCharJob(pcJobMatch[1].trim());

  const pcAgeMatch = pcText.match(/(?:나이|연령)\s*[:：]\s*([^\n\r,/]+)/i);
  if (pcAgeMatch) setCharAge(pcAgeMatch[1].trim().replace(/[^0-9]/g, "") || pcAgeMatch[1].trim());

  const pcGenderMatch = pcText.match(/(?:성별)\s*[:：]\s*([^\n\r,/]+)/i);
  if (pcGenderMatch) setCharGender(pcGenderMatch[1].trim());

  const pcBgMatch = pcText.match(/(?:백스토리[^\n:]*|성격[^\n:]*)\s*[:：]\s*([\s\S]*?)(?=\n\s*(?:-?\s*\[?내\s*캐릭터|###|\[|-?\s*사명|$))/i);
  if (pcBgMatch) setCharBackground(pcBgMatch[1].trim());

  const pcSecMatch = rawText.match(/(?:\[내\s*캐릭터의\s*숨겨진\s*비밀[^\]]*\]|PC\s*숨겨진\s*비밀|PC\s*비밀)\s*[:：]?\s*([\s\S]*?)(?=\n\s*(?:###|\[|\n\n-|(?:리미트|호기심|공포심|습득\s*특기)\s*[:：]|$))/i);
  if (pcSecMatch) setCharSecret(cleanVal(pcSecMatch[1]));

  // ── [3. 룰별 특화 스탯 분기] ──
  if (detectedMode === "coc") {
    const parseStat = (label) => {
      const m = rawText.match(new RegExp(`${label}\\s*[:：]\\s*(\\d+)`, "i"));
      return m ? Number(m[1]) : null;
    };

    setCocStats({
      str: parseStat("근력") ?? 40,
      con: parseStat("건강") ?? 50,
      siz: parseStat("크기") ?? 50,
      dex: parseStat("민첩") ?? 60,
      app: parseStat("외모") ?? 70,
      int: parseStat("지능") ?? 75,
      pow: parseStat("정신") ?? 75,
      edu: parseStat("교육") ?? 40,
      luck: parseStat("행운") ?? 55
    });

    const skillsMatch = rawText.match(/(?:추가\s*보유\s*기능치|주요\s*기능치|보유\s*기능치)\s*[:：]\s*([^\n\r]+)/i);
    if (skillsMatch) setCocSkills(skillsMatch[1].trim());

  } else if (detectedMode === "insane") {
    const missionMatch = rawText.match(/(?:사명|공개\s*사명)\s*[:：]\s*([^\n\r]+)/i);
    if (missionMatch) setCharMission(missionMatch[1].trim());

    const limitMatch = rawText.match(/리미트\s*[:：]\s*(\d+)/i);
    if (limitMatch) setInsaneLimit(Number(limitMatch[1]));

    const curioMatch = rawText.match(/호기심(?:\s*분야)?\s*[:：]\s*([^\n\r]+)/i);
    if (curioMatch) setInsaneCuriosity(curioMatch[1].trim());

    const fearMatch = rawText.match(/공포심(?:\s*특기)?\s*[:：]\s*([^\n\r]+)/i);
    if (fearMatch) setInsaneFear(fearMatch[1].trim());

    const skillsMatch = rawText.match(/(?:습득\s*특기|특기)\s*[:：]\s*([^\n\r]+)/i);
    if (skillsMatch) {
      const list = skillsMatch[1].split(/[,/·]\s*/).map(s => s.trim()).filter(Boolean);
      if (list.length > 0) setInsaneSkills(list);
    }

    // 🌟 에너미(괴이) 이름 & 프라이즈 자동 감지 (옵셔널 체이닝 100% 보존)
    const enemyMatch = rawText.match(/(?:에너미|괴이|보스|적)\s*[:：]\s*([^\n\r]+)/i);
    if (enemyMatch) setCharEnemyName?.(enemyMatch[1].trim());

    const prizeMatch = rawText.match(/(?:\[프라이즈[^\n\]]*\]|프라이즈\s*[:：])\s*([^\n\r]+)/i);
    if (prizeMatch) {
      setParsedPrizes?.([{ id: 1, name: prizeMatch[1].trim(), owner: "미정", secret: "조사 필요", revealed: false }]);
    }
  }

  // ── [4. 등장인물 (KPC 및 서브 NPC 완벽 캡처)] ──
  let parsedNpcList = [];

  // 1. 파트너 KPC
  const kpcSection = rawText.match(/(?:[\(\[]\s*파트너\s*KPC[^\)\]]*[\)\]]|파트너\s*KPC)([\s\S]*?)(?=\n\s*(?:[\(\[]\s*서브\s*NPC|서브\s*NPC|###\s*3\.|\[시나리오|$))/i);
  if (kpcSection) {
    const kText = kpcSection[1];
    const kName = (kText.match(/이름\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "파트너";
    const kJob = (kText.match(/(?:역할|직업|역할\/직업)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "조력자";
    let kDetail = (kText.match(/(?:외모\s*및\s*성격|외모|성격|관계|상세|특징)[^:\n]*\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "";

    // 상태 메시지 및 좋아하는 것(취향) 추출
    const kStatus = (kText.match(/(?:상태\s*메시지|상메)\s*[:：]\s*["']?([^"'\r\n]+)["']?/i) || [])[1] || "";
    const kLikes = (kText.match(/(?:좋아하는\s*것|취향|선호)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "";
    if (kLikes) kDetail += `\n[취향]: ${kLikes.trim()}`;

    const kSecMatch = rawText.match(/(?:\[(?:파트너\s*)?KPC\s*비밀[^\]]*\]|\[이\s*인물의\s*비밀\])\s*[:：]?\s*([\s\S]*?)(?=\n\s*(?:\[서브|\(서브|###|\[|\n\n-|$))/i);
    const kSecret = kSecMatch ? cleanVal(kSecMatch[1]) : "";

    parsedNpcList.push({
      id: Date.now(),
      name: kName.trim(),
      job: kJob.trim(),
      desc: kDetail.trim(),
      detail: kDetail.trim(),
      secret: kSecret,
      statusMessage: kStatus.trim(),
      affection: 0,
      portraitUrl: typeof getPortraitUrl === "function" ? getPortraitUrl(kName.trim()) : "",
      showSecret: false
    });
  }

  // 2. 서브 NPC (1~9명)
  const subNpcRegex = /(?:\(서브\s*NPC\s*(\d+)\)|\[서브\s*NPC\s*(\d+)\])([\s\S]*?)(?=\n\s*(?:\(서브\s*NPC|\[서브\s*NPC|###\s*3\.|\[시나리오|$))/gi;
  let match;
  while ((match = subNpcRegex.exec(rawText)) !== null) {
    const idx = Number(match[1] || match[2] || parsedNpcList.length + 1);
    const sText = match[3];

    const sName = (sText.match(/이름\s*[:：]\s*([^\n\r]+)/i) || [])[1] || `NPC ${idx}`;
    const sJob = (sText.match(/(?:역할|직업|역할\/직업)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "조연";
    let sDetail = (sText.match(/(?:외모\s*및\s*성격|외모|성격|관계|상세|특징)[^:\n]*\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "";

    // 상태 메시지 및 좋아하는 것(취향) 추출
    const sStatus = (sText.match(/(?:상태\s*메시지|상메)\s*[:：]\s*["']?([^"'\r\n]+)["']?/i) || [])[1] || "";
    const sLikes = (sText.match(/(?:좋아하는\s*것|취향|선호)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "";
    if (sLikes) sDetail += `\n[취향]: ${sLikes.trim()}`;

    // 🌟 [핵심 보존] 비밀 추출 (본문 블록 내부 우선 검색 ➔ 없을 시 번호 태그 검색)
    const inBlockSecret = sText.match(/\[[^\]]*(?:비밀|사명|진상)[^\]]*\]\s*[:：]?\s*([\s\S]*?)(?=\n\s*(?:\[|\(|$))/i);
    let sSecret = "";
    if (inBlockSecret) {
      sSecret = cleanVal(inBlockSecret[1]);
    } else {
      const sSecReg = new RegExp(`(?:\\[서브\\s*NPC\\s*${idx}\\s*비밀[^\\]]*\\]|\\[이\\s*인물의\\s*비밀\\])\\s*[:：]?\\s*([\\s\\S]*?)(?=\\n\\s*(?:\\[서브|\\(서브|###|\\[|\\n\\n-|$))`, "i");
      const sSecMatch = rawText.match(sSecReg);
      sSecret = sSecMatch ? cleanVal(sSecMatch[1]) : "";
    }

    parsedNpcList.push({
      id: Date.now() + Math.random(),
      name: sName.trim(),
      job: sJob.trim(),
      desc: sDetail.trim(),
      detail: sDetail.trim(),
      secret: sSecret,
      statusMessage: sStatus.trim(),
      affection: 0,
      portraitUrl: typeof getPortraitUrl === "function" ? getPortraitUrl(sName.trim()) : "",
      showSecret: false
    });
  }

  if (parsedNpcList.length > 0) {
    setKpcList(parsedNpcList);
  }

  // ── [5. 핸드아웃(조사 구역, 단서, 프라이스) 강력 추출] ──
  let extractedHandouts = [];

  const handoutRegex = /(?:^|\n)\s*[-*■•]?\s*\[([^\]]+)\]\s*\n([\s\S]*?)(?=(?:\n\s*[-*■•]?\s*\[[^\]]+\]|\n\s*#+|$))/g;
  let hMatch;

  while ((hMatch = handoutRegex.exec(rawText)) !== null) {
    const hTitle = hMatch[1].trim();
    const hBody = hMatch[2];

    if (
      /^(?:파트너|서브\s*NPC|NPC|KPC|시놉시스|서막|도입|진상|키퍼|엔딩|개요|사명)/i.test(hTitle) ||
      hTitle.includes("비밀") ||
      hTitle.includes("사명")
    ) {
      continue;
    }

    const secretMatch = hBody.match(/(?:획득\s*단서(?:\s*내용)?|비밀(?:\s*내용)?|단서(?:\s*내용)?|조사\s*결과|진실|효과|기능)\s*[:：]\s*([\s\S]*?)(?=(?:\n\s*[*·-]\s*[^:\n]+[:：]|\n\s*#+|$))/i);
    const overviewMatch = hBody.match(/(?:구역\s*분위기(?:\s*및\s*개요)?|개요|분위기|설명|앞면)\s*[:：]\s*([\s\S]*?)(?=\n\s*(?:획득|비밀|단서|조사|진실|효과|$))/i);

    if (secretMatch || overviewMatch) {
      const finalOverview = overviewMatch
        ? cleanVal(overviewMatch[1])
        : cleanVal(hBody.slice(0, 150));
      const finalSecret = secretMatch ? cleanVal(secretMatch[1]) : "";

      extractedHandouts.push({
        id: `ho_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: hTitle,
        overview: finalOverview || `[조사 구역: ${hTitle}] 탐색 및 조사 단서입니다.`,
        secret: finalSecret,
        revealed: false
      });
    }
  }

  if (extractedHandouts.length > 0) {
    setGeneratedHandouts(extractedHandouts);
  } else {
    setGeneratedHandouts([]);
  }

  const modeNames = { coc: "크툴루(CoC)", insane: "인세인(inSANe)", freeform: "자유 서사", dating: "미연시" };
  alert(`🎉 [${modeNames[detectedMode] || "맞춤"}] 시나리오 연동 완료!\n룰 선택, 캐릭터 시트, NPC 명단, 서막/진상이 모두 세팅되었습니다.`);
};

// ── [파일 업로드 이벤트 핸들러] ──
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.name.toLowerCase().endsWith(".pdf")) {
    setIsPdfLoading(true);
    try {
      // ⬇️ 아래처럼 따옴표 안에 순수 URL만 남겨주세요
      if (!window.pdfjsLib) {
        await new Promise((res, rej) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = res;
          script.onerror = rej;
          document.head.appendChild(script);
        });
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += `[${i}P] ${content.items.map((it) => it.str).join(" ")}\n\n`;
      }
      processScenarioText(text);
    } catch (err) {
      alert("PDF 오류: " + err.message);
    } finally {
      setIsPdfLoading(false);
    }
  } else {
    const reader = new FileReader();
    reader.onload = (ev) => processScenarioText(ev.target.result);
    reader.readAsText(file, "UTF-8");
  }
  e.target.value = null;
};
   
  const applyCustomPortrait = () => {
    if (!customPortraitPrompt.trim()) return;
    const newUrl = customPortraitPrompt.startsWith("http") ? customPortraitPrompt : getPortraitUrl(customPortraitPrompt);
    if (activePortraitTarget === "pc") {
      if (activeSession) {
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, portrait: newUrl } } : s));
      } else setCharPortraitUrl(newUrl);
    } else {
      if (activeSession) {
        const npcs = activeSession.sheet.npcs.map(n => n.id === activePortraitTarget ? { ...n, portrait: newUrl } : n);
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, npcs } } : s));
      } else {
        setKpcList(prev => prev.map(k => k.id === activePortraitTarget ? { ...k, portraitUrl: newUrl } : k));
      }
    }
    setCustomPortraitPrompt("");
    closeModal(setShowPortraitEditModal);
  };

// 🔄 대화 내역 유지 + 현재 시나리오 행 자동 매칭 + 세션카드 및 CG 동기화
  const handleSyncCurrentSheet = async () => {
    if (!activeSession) return;

    const targetUrl = activeSession.sheetUrl || activeSession.sheet?.url || GOOGLE_SHEET_CSV_URL;
    if (!targetUrl) {
      triggerToast("동기화 오류", "시트 URL을 찾을 수 없습니다.", "⚠️");
      return;
    }

    try {
      setIsLoading(true);

      // 1. 구글 시트 CSV 가져오기
      const res = await fetch(targetUrl);
      const csvText = await res.text();

      // 2. CSV 파싱
      const allRows = parseCSV(csvText);
      if (allRows.length < 2) throw new Error("시트 데이터가 비어 있습니다.");

      const headers = allRows[0];
      const dataRows = allRows.slice(1);

      // 3. 현재 시나리오 행 찾기
      const currentTitle = (activeSession.title || "").trim();
      const matchedRow = dataRows.find(r => r[0] && (r[0].trim() === currentTitle || currentTitle.includes(r[0].trim()) || r[0].trim().includes(currentTitle)))
        || dataRows.find(r => {
          const tIdx = headers.findIndex(h => /세션카드|대표이미지|썸네일|표지/i.test(h?.replace(/\s+/g, '') || ""));
          return tIdx !== -1 && r[tIdx]?.trim();
        })
        || dataRows[0];

      // 4. 세션 카드 추출
      const thumbIdx = headers.findIndex(h => /세션카드|대표이미지|썸네일|표지/i.test(h?.replace(/\s+/g, '') || ""));
      const sessionCardImg = thumbIdx !== -1 ? matchedRow[thumbIdx]?.trim() : "";

      // 5. 이벤트 CG 추출
      const eventCgs = [];
      for (let c = 61; c < matchedRow.length; c += 3) {
        const cgTitle = matchedRow[c]?.trim();
        const cgTrigger = matchedRow[c + 1]?.trim();
        const cgUrl = matchedRow[c + 2]?.trim();
        if (cgTitle && cgUrl) {
          eventCgs.push({ title: cgTitle, trigger: cgTrigger || "", imageUrl: cgUrl });
        }
      }

      // 6. 세션 업데이트 (CG 도감 목록과 세션 카드만 갱신하고, 해금 여부는 손대지 않음)
      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            sheetUrl: targetUrl,
            thumbnail: sessionCardImg || s.thumbnail,
            sheet: {
              ...(s.sheet || {}),
              thumbnail: sessionCardImg || s.sheet?.thumbnail,
              cgs: eventCgs.length > 0 ? eventCgs : s.sheet?.cgs,
              scenarioCgs: eventCgs.length > 0 ? eventCgs : s.sheet?.scenarioCgs
            }
          };
        }
        return s;
      }));

      triggerToast("동기화 완료", sessionCardImg ? "세션 카드 및 최신 시트가 적용되었습니다!" : "최신 시트 데이터가 동기화되었습니다!", "💡");

    } catch (err) {
      triggerToast("동기화 실패", err.message, "⚠️");
    } finally {
      setIsLoading(false);
    }
  };
 
// 🌟 [추가] 세션 카드 컴퓨터 이미지 파일 업로드 & 자동 압축
  const handleSessionCardUpload = (sessionId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 500;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedUrl = canvas.toDataURL("image/jpeg", 0.8);
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, thumbnail: compressedUrl } : s));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };
  
  const handlePortraitFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        if (activePortraitTarget === "pc") {
          if (activeSession) {
            setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, portrait: dataUrl } } : s));
          } else setCharPortraitUrl(dataUrl);
        } else {
          if (activeSession) {
            const npcs = activeSession.sheet.npcs.map(n => n.id === activePortraitTarget ? { ...n, portrait: dataUrl } : n);
            setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, npcs } } : s));
          } else {
            setKpcList(prev => prev.map(k => k.id === activePortraitTarget ? { ...k, portraitUrl: dataUrl } : k));
          }
        }
        closeModal(setShowPortraitEditModal);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const executeSaveBackup = () => {
    if (sessions.length === 0) return alert("백업할 세션이 없습니다.");
    const targets = backupTarget === "all" ? sessions : sessions.filter((s) => s.id === Number(backupTarget));
    const dateStr = new Date().toISOString().slice(0, 10);
    const content = backupFormat === "json" 
      ? JSON.stringify(targets, null, 2) 
      : targets.map(s => `[${s.title}]\n` + (s.messages || []).map(m => `${m.role}: ${m.text}`).join("\n\n")).join("\n===\n");
    const blob = new Blob([content], { type: backupFormat === "json" ? "application/json" : "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `TRPG_세이브_${dateStr}.${backupFormat}`; a.click(); URL.revokeObjectURL(url);
    closeModal(setShowBackupModal);
  };

  const importSaveFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        let imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) imported = [imported];
        setSessions(prev => {
          const map = new Map(); 
          prev.forEach(s => map.set(s.id, s)); 
          imported.forEach(s => map.set(s.id, s)); 
          return Array.from(map.values());
        });
        alert(`${imported.length}개 세션 복원 완료!`);
      } catch (err) { alert("복원 실패: " + err.message); }
    };
    reader.readAsText(file);
  };

 const executeExport = () => {
    const targets = sessions.filter(s => selectedExportSessionIds.includes(s.id));
    if (targets.length === 0) return alert("내보낼 세션을 하나 이상 선택해주세요.");

    const dateStr = new Date().toISOString().slice(0, 10);

    // JSON 완전 백업인 경우
    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(targets, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `TRPG_세이브백업_${dateStr}.json`; a.click(); URL.revokeObjectURL(url);
      closeModal(setShowExportModal);
      return;
    }

    // PDF 인쇄 모드인 경우
    if (exportFormat === "pdf") {
      window.print();
      closeModal(setShowExportModal);
      return;
    }

    // TXT 또는 MD 텍스트 문서 생성
    let fullOutput = "";
    targets.forEach(s => {
      let msgs = s.messages || [];
      if (exportScope === "storyOnly") {
        msgs = msgs.filter(m => !m.text.includes("[🎲") && !m.text.includes("[⚠️") && !m.text.includes("[시스템"));
      }
      const pName = s.sheet?.name || "주인공";
      const kName = s.sheet?.npcs?.[0]?.name || "파트너";

      if (exportFormat === "md") {
        fullOutput += `# 《${s.title}》 (${s.ruleMode?.toUpperCase()})\n\n`;
        fullOutput += msgs.map(m => `**${m.role === "user" ? pName : kName}**:\n${m.text}`).join("\n\n---\n\n");
        fullOutput += "\n\n========================================\n\n";
      } else {
        fullOutput += `[《${s.title}》 - ${s.ruleMode?.toUpperCase()}]\n\n`;
        fullOutput += msgs.map(m => `${m.role === "user" ? pName : kName}: ${m.text}`).join("\n\n");
        fullOutput += "\n\n========================================\n\n";
      }
    });

    const blob = new Blob([fullOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `TRPG_대화기록_${dateStr}.${exportFormat}`; a.click(); URL.revokeObjectURL(url);
    closeModal(setShowExportModal);
  };
  
  const triggerMadnessCheck = (rule, lossAmount, targetSessionId) => {
    const session = sessions.find((s) => s.id === targetSessionId);
    if (session?.sheet?.madnessStatus) return;
    setShowInsanityFlash(true);
    setTimeout(() => setShowInsanityFlash(false), 500);

    let mName = "", mDesc = "", rollNum = 1;
    if (rule === "coc") {
      rollNum = Math.floor(Math.random() * 10) + 1;
      const m = COC_MADNESS_TABLE.find(it => it.roll === rollNum) || COC_MADNESS_TABLE[0];
      mName = m.name; mDesc = m.desc;
    } else {
      rollNum = Math.floor(Math.random() * 6) + 1;
      const m = INSANE_MADNESS_TABLE.find(it => it.roll === rollNum) || INSANE_MADNESS_TABLE[0];
      mName = m.name; mDesc = m.desc;
    }

    const madnessStatusStr = `일시적 광기: ${mName}`;
    setActiveMadnessAlert({ name: mName, desc: mDesc });
    setSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, sheet: { ...s.sheet, madnessStatus: madnessStatusStr } } : s));
  };

  //  수정 후
const adjustStat = (statName, delta) => {
  if (!activeSession) return;
  const currentVal = Number(activeSession.sheet?.[statName] ?? 10);
  const newVal = Math.max(0, currentVal + delta);

  if (statName === "san" && delta < 0) {
    if (activeSession.ruleMode === "insane") {
      drawMadnessCard(activeSessionId, true);
    } else if (activeSession.ruleMode === "coc" && delta <= -5) {
      triggerMadnessCheck("coc", Math.abs(delta), activeSessionId);
    }
  }

  setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, [statName]: newVal } } : s));
};

  const handleRollSceneTable = () => {
    if (!activeSession) return;
    playDiceSound();
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    const desc = INSANE_SCENE_TABLE_2D6[sum] || "정적이 흐른다.";
    executeMessage(`[🎬 2D6 장면표 굴림: ${d1}+${d2}=${sum}번]\n"${desc}"\n(이 분위기 속에서 장면을 시작합니다.)`);
  };
 
  const parseTagsSafely = (rawText, partnerName, currentRule) => {
    let cleanText = rawText || "";
    let parsedData = { 
      suggActions: [], pendingCheck: null, newSheetVars: {}, 
      revealedSecrets: [], investigationSpots: [], newHandouts: [],
      revealedHandoutTitles: [], shouldAdvanceScene: false,
      triggeredMadness: null
    };

    try {
      const madnessMatch = cleanText.match(/<!--\s*TRIGGER_MADNESS:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (madnessMatch) {
        try { parsedData.triggeredMadness = JSON.parse(madnessMatch[1]); } catch (e) {}
      }

      // 🌟 <!-- CHECK: ... --> 와 [CHECK: ... ] 둘 다 감지하도록 확장
      const checkMatch = cleanText.match(/(?:<!--|\[)\s*CHECK:\s*({[\s\S]*?})\s*(?:-{1,3}>|\])/i);
      if (checkMatch) {
        try { parsedData.pendingCheck = JSON.parse(checkMatch[1]); } catch(e) {}
      }

      const suggMatch = cleanText.match(/<!--\s*SUGGESTIONS:\s*(\[[\s\S]*?\])\s*-{1,3}>/i);
      if (suggMatch) {
        try {
          const rawSuggs = JSON.parse(suggMatch[1]);
          parsedData.suggActions = rawSuggs.map(s => s.replace(/\bKPC\b/g, partnerName || "파트너"));
        } catch(e) {}
      }

      if (currentRule !== "insane") {
        const spotsMatch = cleanText.match(/<!--\s*SPOTS:\s*(\[[\s\S]*?\])\s*-{1,3}>/i);
        if (spotsMatch) {
          try { parsedData.investigationSpots = JSON.parse(spotsMatch[1]); } catch(e) {}
        }
      }

      const revHandoutRegex = /<!--\s*REVEAL_HANDOUT:\s*({[\s\S]*?})\s*-{1,3}>/gi;
      for (const m of cleanText.matchAll(revHandoutRegex)) {
        try {
          const obj = JSON.parse(m[1]);
          if (obj.title) parsedData.revealedHandoutTitles.push(obj.title);
        } catch (e) {}
      }
// 🌟 인세인 마스터 씬(Master Scene) 트리거 및 종료 감지
      const masterSceneMatch = cleanText.match(/<!--\s*TRIGGER_MASTER_SCENE:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (masterSceneMatch) {
        try { parsedData.triggerMasterScene = JSON.parse(masterSceneMatch[1]); } catch (e) {}
      }
      if (cleanText.includes("<!-- END_MASTER_SCENE")) {
        parsedData.endMasterScene = true;
      }
     
      if (cleanText.includes("<!-- ADVANCE_SCENE") || cleanText.includes("<!-- END_SCENE")) {
        parsedData.shouldAdvanceScene = true;
      }

      const handoutRegex = /<!--\s*HANDOUT:\s*({[\s\S]*?})\s*-{1,3}>/gi;
      for (const m of cleanText.matchAll(handoutRegex)) {
        try { parsedData.newHandouts.push(JSON.parse(m[1])); } catch (e) {}
      }

      const statMatch = cleanText.match(/<!--\s*STATUS:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (statMatch) {
        try { parsedData.newSheetVars = JSON.parse(statMatch[1]); } catch (e) {}
      }
    } catch (e) {}

    cleanText = cleanText
      .replace(/```html|```json|```/gi, "")
      .replace(/(?:<!--|\[)\s*CHECK:\s*{[\s\S]*?}\s*(?:-{1,3}>|\])/gi, "")
      .replace(/<!--[\s\S]*?-{1,3}>/g, "")
      .replace(/<!--[\s\S]*?$/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\bKPC\b/g, partnerName || "파트너")
      .trim();

    return { cleanText, parsedData };
  };

  const cleanSheetForAi = (sheet) => {
    if (!sheet) return {};
    const { portrait, ...rest } = sheet;
    return {
      ...rest,
      npcs: (rest.npcs || []).map(({ portrait, ...npcRest }) => npcRest)
    };
  };
  
const startNewSession = async () => {
    const sessionTitle = scenarioTitle || (charName ? `${charName}의 이야기` : "새로운 모험");
    const pName = charName.trim() || "클레어";
    const partnerName = kpcList[0]?.name || "아델";

    // 🌟 [추가] 새 세션 시작 시 장르 태그를 읽어 즉시 톡 테마 자동 적용!
    const autoTheme = detectAutoPhoneTheme(`${playPreference} ${sessionTitle} ${publicSynopsis}`);
    setPhoneTheme(autoTheme);

    const npcs = kpcList.filter(k => k.name.trim() !== "").map(k => ({
      id: k.id, name: k.name, title: k.job || "조력자", detail: k.detail || "", portrait: k.portraitUrl || getPortraitUrl(k.name), affection: 0, secret: k.secret, secretRevealed: false
    }));

    // 🌟 완벽한 핸드아웃 세팅 로직 (다수 NPC 지원 및 사명 명시)
    let initialHandouts = [];
    
    // 1. 내 캐릭터(PC)의 사명과 비밀 카드
    const baseCards = [
      { 
        id: "pc_base", 
        title: `${pName}의 사명과 비밀`, 
        overview: `[공개 사명]\n${charMission || "당신의 표면적인 목적과 상태입니다."}`, 
        secret: charSecret || "감춰진 사명이나 비밀이 없습니다.", 
        revealed: false 
      }
    ];

    // 2. 파트너(KPC)를 포함한 모든 서브 NPC들의 카드를 반복문으로 자동 생성!
    if (npcs && npcs.length > 0) {
      npcs.forEach((npc, idx) => {
        baseCards.push({
          id: `npc_base_${idx}`,
          title: `${npc.name}의 상태와 사명`,
          // 앞면에는 직업(역할)과 표면적 상태를 명시
          overview: `[표면상 상태/사명]\n역할: ${npc.title || "조연"}\n이 인물이 겉으로 보여주는 목적과 태도입니다.`, 
          // 뒷면에는 우리가 적어둔 진짜 비밀을 은닉
          secret: npc.secret || "이 인물에게는 감춰진 비밀이 없습니다.",
          revealed: false
        });
      });
    }

    // 🌟 [자동 구조] 파일 첨부 때 놓쳤더라도 비밀란(hiddenTruth)에서 핸드아웃 단서 자동 복원!
    let effectiveHandouts = generatedHandouts;
    if (!effectiveHandouts || effectiveHandouts.length === 0) {
      const fallbackSource = `${hiddenTruth}\n${publicSynopsis}\n${openingScene}`;
      const fallbackRegex = /(?:^|\n)\s*[-*■•]?\s*\[([^\]]+)\]\s*\n([\s\S]*?)(?=(?:\n\s*[-*■•]?\s*\[[^\]]+\]|\n\s*#+|$))/g;
      let fbMatch;
      const fbList = [];
      while ((fbMatch = fallbackRegex.exec(fallbackSource)) !== null) {
        const fbTitle = fbMatch[1].trim();
        const fbBody = fbMatch[2];
        const fbSec = fbBody.match(/(?:획득\s*단서(?:\s*내용)?|비밀(?:\s*내용)?|단서(?:\s*내용)?|조사\s*결과|진실)\s*[:：]\s*([\s\S]*?)(?=(?:\n\s*[*·-]\s*[^:\n]+[:：]|\n\s*#+|$))/i);
        const fbOver = fbBody.match(/(?:구역\s*분위기(?:\s*및\s*개요)?|개요|분위기|설명)\s*[:：]\s*([^\n\r]+)/i);
        if (fbSec) {
          fbList.push({
            title: fbTitle,
            overview: fbOver ? fbOver[1].trim() : `[조사 구역: ${fbTitle}] 탐색 및 조사 단서입니다.`,
            secret: fbSec[1].trim()
          });
        }
      }
      if (fbList.length > 0) effectiveHandouts = fbList;
    }

    if (effectiveHandouts && effectiveHandouts.length > 0) {
      const hasBase = effectiveHandouts.some(h => h.title.includes("사명") || h.title.includes(pName) || h.title.includes(partnerName));
      const parsedCards = effectiveHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false }));
      
      if (hasBase) {
        initialHandouts = parsedCards;
      } else {
        initialHandouts = [...baseCards, ...parsedCards];
      }
    } else {
      initialHandouts = baseCards;
    }

    // 🌟 [소지품 동적 결정 로직]
    let startingItems = [];

    // 1) 백스토리 본문에 '소지품: OOO, OOO' 형식으로 기재된 경우 자동 추출
    const bgItemMatch = (charBackground || "").match(/(?:소지품|지닌\s*물건|아이템)\s*[:：]\s*([^\n\r]+)/i);
    if (bgItemMatch) {
      startingItems = bgItemMatch[1].split(/[,/·]\s*/).map(s => s.trim()).filter(Boolean).map(name => ({
        name: name.replace(/^[-*•\d.]+\s*/, ""),
        desc: "개인 소지품"
      }));
    }

    // 2) AI 즉석 생성으로 기획된 맞춤 소지품이 있다면 적용
    if (startingItems.length === 0 && generatedItems && generatedItems.length > 0) {
      startingItems = generatedItems;
    }

    // 3) 미지정 시 룰/장르에 어울리는 감성적인 기본 아이템 자동 부여
    if (startingItems.length === 0) {
      if (wizardMode === "dating") {
        startingItems = [
          { name: "손수건", desc: "단정하게 접힌 부드러운 손수건" },
          { name: "틴케이스 캔디", desc: "달콤한 과일향 사탕" }
        ];
      } else if (wizardMode === "insane") {
        startingItems = [
          { name: "스마트폰", desc: "연락 및 기록용" },
          { name: "작은 부적", desc: "마음을 안정시키는 소지품" }
        ];
      } else {
        startingItems = [
          { name: "수첩과 펜", desc: "기록 도구" },
          { name: "소형 손전등", desc: "휴대용 조명" }
        ];
      }
    }

    let initialSheet = {
      name: pName, job: charJob || "조사원", age: charAge, gender: charGender,
      background: charBackground, secret: charSecret, mission: charMission,
      portrait: charPortraitUrl || getPortraitUrl(pName), hp: 20, maxHp: 20,
      npcs, items: startingItems,
      madnessStatus: null, 
      handouts: initialHandouts,
      madnessCards: [],
      madnessDeck: [...INSANE_MADNESS_TABLE].sort(() => 0.5 - Math.random())
    };
    
    if (wizardMode === "insane") {
      initialSheet = { 
        ...initialSheet, 
        hp: 6, maxHp: 6, san: 6, maxSan: 6, 
        limit: insaneLimit || 4, 
        cycle: 1, scene: 1, 
        phase: "도입", 
        mission: charMission || "일상의 온기를 되찾는다.", 
        secret: charSecret || "밝혀지지 않은 과거",
        insaneSkills, insaneCuriosity, insaneFear,
        flashbackUsed: false, 
        insaneItems: { painkiller: 2, weapon: 0, talisman: 0 },
        
        // 🌟 [동적 프라이즈 & 의식 시트: 파일 파싱 데이터 우선, 없으면 빈 배열]
        prizes: (typeof parsedPrizes !== "undefined" && parsedPrizes.length > 0) 
          ? parsedPrizes 
          : [],
        rituals: (typeof parsedRituals !== "undefined" && parsedRituals.length > 0) 
          ? parsedRituals 
          : [],

        // 🌟 [동적 에너미: 파일에 에너미 이름이 있으면 그거 쓰고, 없으면 시나리오 제목으로 자동 생성]
        enemyName: (typeof parsedEnemyName !== "undefined" && parsedEnemyName) 
          ? parsedEnemyName 
          : (scenarioTitle ? `${scenarioTitle}의 괴이` : "미지의 괴이"),
        enemyHp: 6,
        maxEnemyHp: 6,
        currentPlot: null,
        enemyPlot: null,

        npcs: npcs.map(n => ({
          ...n,
          desc: n.desc || n.detail || "",
          detail: n.desc || n.detail || "",
          emotion: null,
          locationFound: false,
          secretRevealed: false,
          mentalChecked: false
        }))
      };
    }

 
// 🌟 PC 및 NPC 이름 변경 시 본문 & 컷씬(CG) 텍스트 일괄 자동 치환
    let finalSynopsis = publicSynopsis;
    let finalOpening = openingScene;
    let finalTruth = hiddenTruth;

    // 1) PC 이름 자동 감지 및 치환 (세리아나 ➔ 레이)
    let oldPcName = originalPresetPcName;
    if (!oldPcName) {
      const pcMatch = (publicSynopsis + openingScene + hiddenTruth).match(/세리아나|클레어/);
      if (pcMatch) oldPcName = pcMatch[0];
    }
    if (oldPcName && oldPcName !== pName) {
      const pcReg = new RegExp(oldPcName, "g");
      finalSynopsis = finalSynopsis.replace(pcReg, pName);
      finalOpening = finalOpening.replace(pcReg, pName);
      finalTruth = finalTruth.replace(pcReg, pName);
    }

    // 2) NPC 이름 자동 감지 및 치환 (발렌틴 ➔ 레비아탄)
    const currentNpcName = kpcList[0]?.name || "파트너";
    let oldNpcNames = [...originalPresetNpcs];
    if (oldNpcNames.length === 0) {
      const cgTextPool = (scenarioCgs || []).map(c => (c.title || "") + " " + (c.trigger || "")).join(" ");
      const npcMatch = cgTextPool.match(/발렌틴|아델/);
      if (npcMatch) oldNpcNames.push(npcMatch[0]);
    }

    const npcReplaceMap = [];
    oldNpcNames.forEach(oldName => {
      if (oldName && oldName !== currentNpcName) {
        npcReplaceMap.push({ oldName, newName: currentNpcName });
      }
    });

    npcReplaceMap.forEach(({ oldName, newName }) => {
      const reg = new RegExp(oldName, "g");
      finalSynopsis = finalSynopsis.replace(reg, newName);
      finalOpening = finalOpening.replace(reg, newName);
      finalTruth = finalTruth.replace(reg, newName);
    });

    // 3) 컷씬(CG) 데이터 속 주인공(세리아나)과 NPC(발렌틴) 이름 모두 치환
    let finalScenarioCgs = (scenarioCgs || []).map(cg => {
      let updatedTitle = cg.title || "";
      let updatedTrigger = cg.trigger || cg.condition || "";

      // PC 이름 치환 (세리아나 ➔ 레이)
      if (oldPcName && oldPcName !== pName) {
        const pcReg = new RegExp(oldPcName, "g");
        updatedTitle = updatedTitle.replace(pcReg, pName);
        updatedTrigger = updatedTrigger.replace(pcReg, pName);
      }

      // NPC 이름 치환 (발렌틴 ➔ 레비아탄)
      npcReplaceMap.forEach(({ oldName, newName }) => {
        const reg = new RegExp(oldName, "g");
        updatedTitle = updatedTitle.replace(reg, newName);
        updatedTrigger = updatedTrigger.replace(reg, newName);
      });

      return {
        ...cg,
        title: updatedTitle,
        trigger: updatedTrigger,
        condition: updatedTrigger
      };
    });

// 🌟 PC({PC}) 및 다중 KPC({KPC1}, {KPC2}...) 일괄 자동 치환
    let finalSynopsis = publicSynopsis;
    let finalOpening = openingScene;
    let finalTruth = hiddenTruth;

    // 1) 주인공({PC}) 이름 치환
    const pcReg = /\{PC\}|세리아나|세리|클레어/g;
    finalSynopsis = finalSynopsis.replace(pcReg, pName);
    finalOpening = finalOpening.replace(pcReg, pName);
    finalTruth = finalTruth.replace(pcReg, pName);

    // 2) 등록된 모든 KPC 목록을 순회하며 {KPC1}, {KPC2}, {NPC1} 치환
    let finalScenarioCgs = [...(scenarioCgs || [])];

    (kpcList || []).forEach((kpc, index) => {
      const num = index + 1; // 1, 2, 3...
      const currentName = kpc.name || `인물${num}`;

      // {KPC1}, {NPC1} 및 {KPC}, 발렌틴 등 옛 디폴트 이름 대응 정규식
      const tagRegex = new RegExp(`\\{(KPC|NPC)${num}\\}`, "g");
      finalSynopsis = finalSynopsis.replace(tagRegex, currentName);
      finalOpening = finalOpening.replace(tagRegex, currentName);
      finalTruth = finalTruth.replace(tagRegex, currentName);

      // 1번 메인 KPC는 단독 {KPC} 및 예전 디폴트 이름(발렌틴, 발렌 등)도 함께 치환
      if (num === 1) {
        const mainKpcReg = /\{KPC\}|\{NPC\}|발렌틴|발렌|아델/g;
        finalSynopsis = finalSynopsis.replace(mainKpcReg, currentName);
        finalOpening = finalOpening.replace(mainKpcReg, currentName);
        finalTruth = finalTruth.replace(mainKpcReg, currentName);
      }

      // 컷씬(CG) 제목과 해금 조건(트리거) 속 이름도 함께 치환
      finalScenarioCgs = finalScenarioCgs.map(cg => {
        let updatedTitle = (cg.title || "")
          .replace(pcReg, pName)
          .replace(tagRegex, currentName);
        let updatedTrigger = (cg.trigger || cg.condition || "")
          .replace(pcReg, pName)
          .replace(tagRegex, currentName);

        if (num === 1) {
          const mainKpcReg = /\{KPC\}|\{NPC\}|발렌틴|발렌|아델/g;
          updatedTitle = updatedTitle.replace(mainKpcReg, currentName);
          updatedTrigger = updatedTrigger.replace(mainKpcReg, currentName);
        }

        return {
          ...cg,
          title: updatedTitle,
          trigger: updatedTrigger,
          condition: updatedTrigger
        };
      });
    });

    // 5) 치환 완료된 시나리오 컨텍스트 생성
    const fullScenarioContext = `[시나리오 제목: ${sessionTitle}]\n[공개 시놉시스]\n${finalSynopsis}\n\n[초기 배경/서막]\n${finalOpening}\n\n[키퍼 전용 기밀/진상]\n${finalTruth}`;

    // 🌟 [인세인] 테마별 자동 프라이즈 & 3단계 의식 주입
    let sessionSheet = { ...(initialSheet || {}), scenarioCgs: finalScenarioCgs };
    if (wizardMode === "insane") {
      const generated = generateInsaneThemeAssets(sessionTitle, fullScenarioContext);
      
      // 1. 프라이즈가 없으면 배경에 어울리는 프라이즈 자동 추가
      const handouts = sessionSheet.handouts || [];
      const hasPrize = handouts.some(h => h.type === "prize" || h.title?.includes("프라이즈"));
      if (!hasPrize && generated.prize) {
        sessionSheet.handouts = [...handouts, generated.prize];
      }

      // 2. 의식이 비어있으면 배경 맞춤형 3단계 의식 자동 장착
      if (!sessionSheet.rituals || sessionSheet.rituals.length === 0) {
        sessionSheet.rituals = generated.rituals;
      }
    }
 
// 🎒 3단계: 특기표에서 선택한 초기 소지품(최대 2개)을 시트에 주입
  sessionSheet.items = [
    { id: "item_painkiller", name: "진통제", type: "heal", count: insaneItems["진통제"] || 0, desc: "생명력 또는 이성치 1 회복" },
    { id: "item_weapon", name: "무기", type: "reroll_self", count: insaneItems["무기"] || 0, desc: "전투 중 자신의 판정 재굴림" },
    { id: "item_amulet", name: "부적", type: "reroll_other", count: insaneItems["부적"] || 0, desc: "타인의 판정 재굴림" }
  ].filter(it => it.count > 0); // 1개 이상 챙긴 아이템만 가방에 등록

  const newSession = {
    id: newId,
    title: sessionTitle,
    thumbnail: scenarioThumbnail || sessionSheet?.thumbnail || sessionSheet?.sessionCard || "https://cdn.phototourl.com/free/2026-09-13-be3b81ab-c892-4f25-ba89-1bb86ea",
    ruleMode: wizardMode,
    preference: playPreference.trim(),
    scenarioText: fullScenarioContext,
    sheet: sessionSheet,
   sheetUrl: sessionSheet?.url || (typeof GOOGLE_SHEET_CSV_URL !== "undefined" ? GOOGLE_SHEET_CSV_URL : "") || "",
    messages: [],
    suggestedActions: [],
    investigationSpots: [],
    pendingCheck: null
  };

  setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);
   let openingPrompt = "";
    if (wizardMode === "dating") {
      // 🌸 1. 소설형 비주얼 노벨 서막
      openingPrompt = `[세션 시작: 비주얼 노벨 서막 요청]
시나리오의 [초기 배경/서막]과 [공개 시놉시스]를 바탕으로 두 사람의 첫 만남 혹은 사건의 순간을 감각적으로 열어주십시오.
- 3인칭 소설 문체로 현장 분위기, 인물 간의 시선과 공기의 온도를 담아 4~5문장으로 서술하십시오.
- 주사위 판정이나 시스템 용어를 배제하고 감정선에 집중하십시오.
- 'PC', 'KPC'라는 단어를 일절 쓰지 말고 '${pName}'과 '${partnerName}'(으)로만 지칭하십시오.
- 지문 끝에 주인공 '${pName}'(성향: [${charBackground || "자연스러운 성향"}])이 취할 만한 선택지 3개를 반드시 출력하십시오:
<!-- SUGGESTIONS: ["선택지 1", "선택지 2", "선택지 3"] -->`;
    } else if (wizardMode === "dating_msg") {
      // 💬 2. 메신저형 첫 문자 톡
      openingPrompt = `[세션 시작: 첫 메신저 톡 수신 요청]
당신은 지금 '${partnerName}' 본인입니다.
시나리오의 [초기 배경/서막]에 맞춰 상대방 '${pName}'에게 가볍게 말을 건네는 첫 카톡(메시지)을 1~2줄로 보내주십시오.
- 해설 지문, 따옴표, 괄호 묘사를 일절 배제하고 오직 '${partnerName}'이 스마트폰 키보드로 직접 친 실제 전송 텍스트만 출력하십시오.`;
    } else {
      // 🐙 3. CoC / 인세인 TRPG 서막
      openingPrompt = `[세션 시작: 첫 서막 지문 요청]
시나리오의 [배후 진상]과 [초기 배경/서막]을 충실히 반영하여 서막을 여십시오.
반드시 정중하고 격조 높은 키퍼의 경어체(~합니다/였습니다)를 고정하십시오.
- 'KPC'라는 단어를 일절 쓰지 말고, 파트너의 실제 이름 '${partnerName}'(으)로만 지칭하십시오.
- '${pName}'과 '${partnerName}'의 온기를 살려 4~5문장으로 서술하십시오.
- 지문 끝에 씬 행동을 위한 <!-- SUGGESTIONS: ["${partnerName}에게 말을 건다", "주변 단서를 살펴본다", "장면표 굴림"] --> 태그를 출력하십시오.`;
    }
   
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [{ role: "user", text: openingPrompt }],
          scenarioText: fullScenarioContext,
          playerSheet: cleanSheetForAi(initialSheet),
          ruleMode: wizardMode,
          playPreference
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `서버 응답 오류 (상태 코드: ${res.status})`);
      }

      const data = await res.json();
      const { cleanText, parsedData } = parseTagsSafely(data.text, partnerName, wizardMode);

    // 🌟 수정: 치환본(finalScenarioCgs)을 1순위로 읽도록 변경
      const currentCgs = (typeof finalScenarioCgs !== "undefined" && finalScenarioCgs.length > 0)
        ? finalScenarioCgs
        : (scenarioCgs || initialSheet?.scenarioCgs || []);

      const firstCg = currentCgs.length > 0 ? currentCgs[0] : null;
      const cgMatch = data.text?.match(/<!--\s*UNLOCK_CG:\s*(\{[\s\S]*?\})\s*-->/);
      
      let unlockedCgObj = null;
      if (cgMatch) {
        try { unlockedCgObj = JSON.parse(cgMatch[1]); } catch(e) {}
      } else if (firstCg && (firstCg.trigger?.includes("프롤로그") || firstCg.trigger?.includes("시작"))) {
        // 조건이 '프롤로그/시작'이면 첫 대면 시 무조건 자동 발동!
        unlockedCgObj = firstCg;
      }

      if (unlockedCgObj) {
        triggerToast("✨ 일러스트 해금", `새로운 이벤트 CG [${unlockedCgObj.title || "미공개"}]`);
        if (typeof setActiveCutsceneCg === "function") setActiveCutsceneCg(unlockedCgObj);
      }

      setSessions(prev => prev.map(s => s.id === newId ? {
        ...s, 
        sheet: { 
          ...initialSheet, 
          ...parsedData.newSheetVars,
          scenarioCgs: currentCgs,
          unlockedCgs: unlockedCgObj ? [unlockedCgObj] : []
        },
        messages: [{ role: "model", text: cleanText, cg: unlockedCgObj || null }],
        suggestedActions: parsedData.suggActions,
        investigationSpots: parsedData.investigationSpots,
        pendingCheck: parsedData.pendingCheck
      } : s));
    } catch (err) {
      if (err.name === "AbortError") return;
      setSessions(prev => prev.map(s => s.id === newId ? { ...s, messages: [{ role: "model", text: `서막을 불러오는 중 오류가 발생했습니다 (${err.message}).` }] } : s));
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

// 🌟 [감정 판정 1단계] 팝업 열기
  const openEmotionModal = () => {
    if (!activeSession) return;
    setEmotionTargetNpc(null);
    setEmotionDiceResult(null);
    setEmotionModalOpen(true);
  };

  // 🌟 [감정 판정 2단계] 대상 선택 후 주사위 굴리기
  const startEmotionRoll = (npc) => {
    setEmotionTargetNpc(npc);
    playDiceSound?.();
    const d = Math.floor(Math.random() * 6) + 1;
    const table = {
      1: { pos: "공감(+)", neg: "불신(-)", name: "공감 / 불신" },
      2: { pos: "우정(+)", neg: "분노(-)", name: "우정 / 분노" },
      3: { pos: "동경(+)", neg: "질투(-)", name: "동경 / 질투" },
      4: { pos: "집착(+)", neg: "경멸(-)", name: "집착 / 경멸" },
      5: { pos: "연정(+)", neg: "의혹(-)", name: "연정 / 의혹" },
      6: { pos: "광신(+)", neg: "살의(-)", name: "광신 / 살의" }
    };
    setEmotionDiceResult({ roll: d, ...table[d] });
  };

  // 🌟 [감정 판정 3단계] 감정 확정 및 시트 반영
  const confirmEmotion = (selectedEmotion) => {
    if (!activeSession || !emotionTargetNpc || !emotionDiceResult) return;
    const targetName = emotionTargetNpc.name;

    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s,
      sheet: {
        ...s.sheet,
        npcs: (s.sheet.npcs || []).map(n => n.name === targetName ? { ...n, emotion: selectedEmotion } : n)
      }
    } : s));

    setEmotionModalOpen(false);

    executeMessage(`[💬 감정 판정 완료]\n- 대상: ${targetName}\n- 주사위: 1D6 ➔ ${emotionDiceResult.roll}번 (${emotionDiceResult.name})\n- 획득 감정: ✨ [${selectedEmotion}] 칩을 획득했습니다!`);
  };

// 🎒 가방 아이템 1개 차감 공통 함수
  const consumeItem = (itemName) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const curItems = s.sheet?.items || [];
      const updated = curItems.map(it => it.name === itemName ? { ...it, count: Math.max(0, it.count - 1) } : it);
      return { ...s, sheet: { ...s.sheet, items: updated } };
    }));
  };

// 🌟 [클맥 2] 기본 공격 선언 (무기/부적 인터럽트 & 턴 통합)
  const executeClimaxAttack = (isWeaponReroll = false, inheritedBonus = null) => {
    if (!activeSession) return;
    playDiceSound?.();

    let curEnemyHp = activeSession.sheet?.enemyHp ?? 6;
    let curPlayerHp = activeSession.sheet?.hp ?? 6;
    const playerPlot = activeSession.sheet?.currentPlot ?? 3;
    const enemyPlot = activeSession.sheet?.enemyPlot ?? 3;
    const items = activeSession.sheet?.items || [];

    // 1. 공격 주사위 판정 (2D6 + 회상 보너스 상속)
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const baseSum = d1 + d2;
    const bonus = inheritedBonus !== null ? inheritedBonus : (activeSession.sheet?.flashbackBonus || 0);
    const totalSum = baseSum + bonus;
    const isHit = totalSum >= 5;

    const rollDetail = bonus > 0 
      ? `${d1}+${d2} (+회상 ${bonus}) = ${totalSum}` 
      : `${d1}+${d2} = ${totalSum}`;

    let text = `${isWeaponReroll ? "[⚔️ 무기 재굴림 발동!]\n" : "[⚔️ 클라이맥스 공격 선언]\n"}- 공격 명중 판정: ${rollDetail} (목표치 5) ➔ ${isHit ? "적중 성공!" : "빗나감!"}`;

    // ⚔️ [무기 인터럽트] 공격 실패 시 (재굴림 미사용 시 1회 허용)
    const weaponItem = items.find(i => (i.name === "무기" || i.type === "reroll_self") && i.count > 0);
    if (!isHit && weaponItem && !isWeaponReroll) {
      const currentRollBonus = bonus;

      setWeaponRerollModal({
        type: "weapon",
        title: "⚔️ 무기 사용 (자신 판정 재굴림)",
        desc: `공격이 빗나갔습니다 (${totalSum} / 목표치 5).\n소지품의 [무기]를 1개 소모하여 주사위를 다시 굴리시겠습니까? (남은 무기: ${weaponItem.count}개)`,
        onConfirm: () => {
          consumeItem("무기");
          setWeaponRerollModal(null);
          executeClimaxAttack(true, currentRollBonus);
        },
        onCancel: () => {
          setWeaponRerollModal(null);
          finishClimaxTurn(curEnemyHp, curPlayerHp, playerPlot, text);
        }
      });
      return;
    }

    // 명중 성공 시 적의 회피 판정 진행
    if (isHit) {
      const ed1 = Math.floor(Math.random() * 6) + 1;
      const ed2 = Math.floor(Math.random() * 6) + 1;
      const enemyDodgeSum = ed1 + ed2;
      const enemyDodgeTarget = enemyPlot + 4;
      const enemyDodged = enemyDodgeSum >= enemyDodgeTarget;

      if (enemyDodged) {
        text += `\n- 적 회피 판정: ${ed1}+${ed2}=${enemyDodgeSum} (목표치 ${enemyDodgeTarget}) ➔ 적이 공격을 날렵하게 피했습니다!`;
      } else {
        curEnemyHp = Math.max(0, curEnemyHp - 1);
        text += `\n- 적 회피 실패! (${ed1}+${ed2}=${enemyDodgeSum} / 목표치 ${enemyDodgeTarget})\n💥 적에게 1점의 치명상을 입혔습니다! (적 HP: ${curEnemyHp}/${activeSession.sheet?.maxEnemyHp || 6})`;
      }
    }

    // 인터럽트 조건이 없으면 바로 턴 마무리 진행
    finishClimaxTurn(curEnemyHp, curPlayerHp, playerPlot, text);
  };

  // 🌟 턴 마무리 공통 로직 (파트너 협공 + 괴이 반격 + 라운드 전환)
  const finishClimaxTurn = (startEnemyHp, startPlayerHp, playerPlot, currentText) => {
    let curEnemyHp = startEnemyHp;
    let curPlayerHp = startPlayerHp;
    let text = currentText;
    const partnerName = activeSession?.partnerName || activeSession?.sheet?.npcs?.[0]?.name;

    // 🤝 1. [파트너 협공]
    if (curEnemyHp > 0 && partnerName) {
      const pd1 = Math.floor(Math.random() * 6) + 1;
      const pd2 = Math.floor(Math.random() * 6) + 1;
      const partnerSum = pd1 + pd2;
      if (partnerSum >= 6) {
        curEnemyHp = Math.max(0, curEnemyHp - 1);
        text += `\n\n[🤝 파트너 협공] ${partnerName}의 엄호 사격 적중! (${pd1}+${pd2}=${partnerSum})\n💥 괴이에게 1점의 치명상을 입혔습니다! (적 HP: ${curEnemyHp})`;
      } else {
        text += `\n\n[🤝 파트너 협공] ${partnerName}의 엄호 사격이 빗나갔습니다. (${pd1}+${pd2}=${partnerSum})`;
      }
    }

    // 👹 2. [괴이의 반격]
    if (curEnemyHp > 0) {
      text += `\n\n[👹 괴이의 반격] 적이 플레이어를 향해 맹렬한 일격을 가합니다!`;
      const playerDodgeTarget = playerPlot + 4;
      const pDodge1 = Math.floor(Math.random() * 6) + 1;
      const pDodge2 = Math.floor(Math.random() * 6) + 1;
      const pDodgeSum = pDodge1 + pDodge2;
      const playerDodged = pDodgeSum >= playerDodgeTarget;

      if (playerDodged) {
        text += `\n- 플레이어 회피 성공! (${pDodge1}+${pDodge2}=${pDodgeSum} / 목표치 ${playerDodgeTarget}) 가볍게 피했습니다!`;
      } else {
        curPlayerHp = Math.max(0, curPlayerHp - 1);
        text += `\n- 플레이어 회피 실패! (${pDodge1}+${pDodge2}=${pDodgeSum} / 목표치 ${playerDodgeTarget})\n🩸 괴이의 반격에 1점의 피해를 입었습니다! (내 남은 HP: ${curPlayerHp})`;
      }
    }

    // 3. 시트 상태 저장
    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s,
      sheet: {
        ...s.sheet,
        enemyHp: curEnemyHp,
        hp: curPlayerHp,
        flashbackBonus: 0,
        phase: curEnemyHp <= 0 ? "에필로그" : s.sheet?.phase
      }
    } : s));

    // 4. 승패 및 상태 분기
    if (curEnemyHp <= 0) {
      text += `\n\n🏆 [결전 승리!] 괴이가 단말마의 비명과 함께 소멸합니다! 에필로그로 향합니다.`;
      const aiPrompt = `${text}\n[🚨 결전 종결 수칙] 괴이의 HP가 0이 되어 소멸했습니다. 전투를 완전히 마무리하고 승리의 여운과 두 인물의 에필로그를 서술하십시오. 지문 끝에 [Happy End: 새벽의 온기] 형태의 엔딩 태그를 출력하십시오.`;
      executeMessage(text, aiPrompt);
      return;
    }

    if (curPlayerHp <= 0) {
      const healItem = (activeSession?.sheet?.items || []).find(
        it => (it.type === "heal" || it.name?.includes("진통제") || it.name?.includes("약")) && (it.count > 0 || it.quantity > 0)
      );

      if (healItem) {
        setUsableHealItem(healItem);
        setReviveModalOpen(true);
        text += `\n\n🚨 [치명상!] 생명력이 0이 되었습니다! 의식을 잃어가지만 품 속에 [${healItem.name}]이(가) 남아있습니다...`;
      } else {
        setSessions(prev => prev.map(s => s.id === activeSessionId ? {
          ...s,
          sheet: { ...s.sheet, hp: 0, phase: "배드엔딩" }
        } : s));
        text += `\n\n💀 [게임 오버: 사망] 끝내 치명상을 버티지 못하고 시야가 암전됩니다...`;
        if (typeof triggerToast === "function") {
          triggerToast("캐릭터 사망", "생명력이 소진되어 의식을 잃었습니다.", "💀");
        }
      }
      executeMessage(text);
      return;
    }

    // 5. 적/아군 모두 생존 시 다음 라운드 진행
    if (climaxRound >= 5) {
      text += `\n\n⚠️ [제 ${climaxRound}라운드 종료] 리미트 도달! 극장의 나락이 붕괴하며 결말을 맞이합니다.`;
      executeMessage(text);
      return;
    }

    setClimaxRound(prev => prev + 1);
    setClimaxStep("plot");
    text += `\n\n🔔 [제 ${climaxRound}라운드 종료] ➔ 제 ${climaxRound + 1}라운드 개막! 새로운 플롯(1~6)...`;

    executeMessage(text);
  };

  // 🌟 [클맥 3] 봉인 의식 판정
  const executeClimaxRitual = (stepIdx) => {
    if (!activeSession) return;
    const ritual = activeSession.sheet?.rituals?.[stepIdx];
    if (!ritual || ritual.completed) return;

    playDiceSound?.();
    const targetVal = typeof calculateInsaneTargetNumber === "function"
      ? calculateInsaneTargetNumber(ritual.skill, activeSession.sheet?.insaneSkills || [], activeSession.sheet?.insaneCuriosity || "")
      : 7;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const baseSum = d1 + d2;
    
    const bonus = activeSession.sheet?.flashbackBonus || 0;
    const totalSum = baseSum + bonus;
    const isSuccess = totalSum >= targetVal;

    const rollDetail = bonus > 0 
      ? `${d1}+${d2} (+회상 3) = ${totalSum}` 
      : `${d1}+${d2} = ${totalSum}`;

    let text = `[📜 의식 판정: ${stepIdx + 1}단계 - ${ritual.name}]\n- 판정 특기: 《${ritual.skill}》(목표치 ${targetVal})\n- 주사위 결과: ${rollDetail} ➔ ${isSuccess ? "성공!" : "실패!"}`;

    if (isSuccess) {
      const updatedRituals = (activeSession.sheet?.rituals || []).map((r, i) => i === stepIdx ? { ...r, completed: true } : r);
      const allDone = updatedRituals.every(r => r.completed);

      if (allDone) {
        setSessions(prev => prev.map(s => s.id === activeSessionId ? {
          ...s,
          sheet: {
            ...s.sheet,
            rituals: updatedRituals,
            phase: "에필로그",
            enemyHp: 0,
            flashbackBonus: 0
          }
        } : s));

        text += `\n✨ [의식 단계 완료 ✔️] 결계가 한 꺼풀 벗겨졌습니다!`;
        text += `\n\n🎉 [모든 의식 완성!] 마침내 성스러운 3단계 봉인 의식이 모두 완수되어 괴이가 완전히 소멸/봉인되었습니다! 결전이 승리로 막을 내립니다.`;

        const aiPrompt = `${text}\n[🚨 결전 종결 수칙] 모든 의식이 완수되어 괴이가 영구히 봉인되었습니다. 전투를 종료하고, 긴장이 풀린 두 인물의 애틋하고 평온한 후일담(에필로그)으로 자연스럽게 이어가십시오. 지문 끝에 [True End: 영원한 앙코르] 형태의 엔딩 태그를 출력하십시오.`;
        executeMessage(text, aiPrompt);
        return;
      }

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, 
        sheet: { 
          ...s.sheet, 
          rituals: updatedRituals,
          flashbackBonus: 0 
        }
      } : s));

      text += `\n✨ [의식 단계 완료 ✔️] 결계가 한 꺼풀 벗겨졌습니다!`;
    } else {
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, 
        sheet: { ...s.sheet, flashbackBonus: 0 }
      } : s));
    }

    setClimaxRound(prev => prev + 1);
    setClimaxStep("plot");
    text += `\n\n🔔 [제 ${climaxRound}라운드 종료] ➔ 제 ${climaxRound + 1}라운드가 개막합니다! 새로운 플롯(1~6)을 선택해 주십시오.`;

    executeMessage(text);
  };

  // 🌟 장면표 굴림 함수 (INSANE_SCENE_TABLE 연동)
  const rollSceneTable = () => {
    if (!activeSession) return;
    playDiceSound?.();
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    const desc = INSANE_SCENE_TABLE[sum] || "알 수 없는 기묘한 기운이 주변을 맴돕니다.";
    executeMessage(`[🎬 2D6 공포 장면표: 주사위 ${d1}+${d2}=${sum}]\n"${desc}"`);
  };

 
// 🌟 [복구] 메시지 전송 및 클라이맥스 즉시 워프 치트키
  const sendMessage = () => {
    if (!input || !input.trim()) return;
    const text = input.trim();
    setInput("");

    // ⚡ [치트 발동] !클맥, /클맥, 클맥, /climax 등 어떤 걸 쳐도 즉시 클맥으로 워프!
    if (["/클맥", "!클맥", "클맥", "/climax", "!climax"].includes(text)) {
      setIsLoading(false);
      const targetId = activeSession?.id || (typeof activeSessionId !== "undefined" ? activeSessionId : null);
      if (targetId) {
        setSessions(prev => prev.map(s => s.id === targetId ? {
          ...s,
          sheet: { ...(s.sheet || {}), phase: "클라이맥스" }
        } : s));
      }
      return;
    }

    if (isLoading) return;
    executeMessage(text);
  };

  // 🌟 [복구] 제안 칩(말풍선 추천 버튼) 클릭 처리
  const handleSuggestionClick = (suggestionText) => {
    if (!suggestionText || isLoading) return;
    executeMessage(suggestionText);
  };
 
const executeMessage = async (textToSend, aiPromptOverride = null) => {
  if (!textToSend.trim() || !activeSession) return;

  // 🗺️ 플레이어가 채팅을 치거나 행동을 시작하면 이전 장소 배너 즉시 닫기
  setLocationCards([]);

  // 📵 유저가 전화를 끊는 말을 입력했을 때 즉시 통화 State 강제 해제
    const endCallKeywords = ["전화끊", "전화 끊", "통화 종료", "끊을게", "끊겠습니다", "끊는다"];
    if (isVoiceCallActive && endCallKeywords.some(k => textToSend.includes(k))) {
      setIsVoiceCallActive(false);
      setIsCallModalOpen(false);
      setVoiceCallNpc(null);
    }

 // 📞 [부재중 전화 자동 처리] 전화가 오는 중에 전화를 안 받고 일반 채팅을 쳤을 때!
  let missedCallNotice = "";
  if (incomingCall) {
    const caller = incomingCall.caller || incomingCall;
    const callerName = caller.name || "상대방";
    const callerNpc = (activeSession.sheet?.npcs || []).find(n => n.name === callerName) || activeSession.sheet?.npcs?.[0];
    const callerId = callerNpc?.id || 1;
    const currentTime = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

    // 1. 메신저(phoneChats)에 [부재중 전화] 알림 말풍선 박제
    const missedCallBubble = {
      id: Date.now() + Math.random(),
      sender: "npc",
      text: `📞 [부재중 전화] ${callerName} 님이 건 전화를 받지 못했습니다.`,
      time: currentTime,
      unread: true,
      isMissedCall: true
    };

    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const currentChats = s.sheet?.phoneChats || {};
      const contactMsgs = currentChats[callerId] || [];
      return {
        ...s,
        sheet: {
          ...s.sheet,
          phoneChats: {
            ...currentChats,
            [callerId]: [...contactMsgs, missedCallBubble]
          },
          // 2. AI 기억 수첩(recentEvents)에도 '전화 무시함' 플래그 저장
          recentEvents: [...(s.sheet?.recentEvents || []), `${callerName}의 전화를 받지 않고 무시함`]
        }
      };
    }));

    // 3. 화면 상단에 부재중 알림 토스트 띄우기 & 전화 수신창 닫기
    triggerToast("📞 부재중 전화 1건", `${callerName}님의 전화를 받지 않았습니다.`, "📵");
    setIncomingCall(null);

  // 4. 인물 성격에 따른 부재중 후속 반응 지시문 (집착 폭풍 문자 vs 쿨한 무반응)
    missedCallNotice = `
[🚨 부재중 전화 발생 및 인물 성격별 후속 수칙]
방금 울리던 '${callerName}'의 전화를 플레이어가 받지 않고 무시했습니다.
'${callerName}'의 성격과 관계성 설정([${callerNpc?.detail || "성격 미정"}])을 엄격히 분석하여 아래 기준에 따라 대처하십시오:

1. 집착/불안/질투/광기 성향인 경우:
- 전화를 안 받자 불안감과 집착이 폭발하여 곧바로 문자를 2~4개 연달아 쏟아붓게 하십시오.
- 구분자(||)를 사용하여 지문 끝에 아래처럼 연속 문자를 반드시 출력하십시오:
  <!-- PHONE_MSG: {"from": "${callerName}", "text": "왜 안 받아? 바빠? || 지금 누구랑 있어? || 문자 보면 바로 연락 줘. 기다릴게."} -->

2. 쿨함/자존심 강함/냉정/무덤덤한 성향인 경우:
- 문자를 일절 남기지 않거나, 혹은 짧은 용건 1줄만 남기고 신경을 끄십시오. (무반응일 경우 PHONE_MSG 태그 생략 가능)
  <!-- PHONE_MSG: {"from": "${callerName}", "text": "통화 가능할 때 회신 바랍니다."} -->

3. 소심/걱정 많은 성향인 경우:
- "혹시 무슨 일 생긴 건 아니지...?" 같은 조심스러운 안부 문자 1줄만 전송하십시오.`;
  }

 // 🌟 개발자용 클라이맥스 즉시 워프 치트키 (락 해제 및 에러 방지 완비)
  if (textToSend.trim() === "/클맥" || textToSend.trim() === "/climax") {
    setIsLoading(false); // 🔓 버튼 잠금 즉시 해제!
    setInput("");
    const targetId = activeSession?.id;
    if (targetId) {
      setSessions(prev => prev.map(s => s.id === targetId ? {
        ...s,
        sheet: { ...s.sheet, phase: "클라이맥스" }
      } : s));
    }
    return;
  }

    const isDatingMsg = activeSession.ruleMode === "dating_msg";
    const currentContactId = activeSession.activeContactId || activeSession.sheet?.npcs?.[0]?.id;
    const currentContact = (activeSession.sheet?.npcs || []).find(n => n.id === currentContactId) || activeSession.sheet?.npcs?.[0];
    const partnerName = currentContact?.name || "상대방";

    const snapshotSheet = JSON.parse(JSON.stringify(activeSession.sheet || {}));

    // 🌟 화면 말풍선에는 주석 태그(<!-- -->)를 제거한 깨끗한 텍스트만 저장
    const cleanDisplayText = textToSend.replace(/<!--[\s\S]*?-->/g, "").trim();

    // 📞 통화 팝업창에서 말한 것만 통화 태그를 달고, 일반 채팅창 입력은 일반 대화로 유지
    const isDirectCallSpeech = textToSend.startsWith("[전화 통화]");

    const updatedMessages = [
      ...(activeSession.messages || []), 
      { role: "user", text: cleanDisplayText, contactId: currentContactId, prevSheet: snapshotSheet, isCall: isDirectCallSpeech, isVoiceCall: isVoiceCallActive, callNpc: voiceCallNpc?.name }
    ];

    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [], pendingCheck: null } : s));
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    // 1. R19 및 자유 서사 모드 감지
    const fullContext = `${activeSession.title || ""} ${activeSession.scenarioText || ""} ${activeSession.preference || ""}`.toLowerCase();
    const isR19 = fullContext.includes("r19") || fullContext.includes("19금") || fullContext.includes("성인") || fullContext.includes("r-19");
    const isFreeform = activeSession.ruleMode === "freeform";

    // 2. 동적 시스템 수칙 주입
    const isDating = activeSession.ruleMode?.startsWith("dating");
    const pcTone = activeSession.sheet?.background || "자연스러운 성격";

    let dynamicRules = `\n\n[키퍼 마스터링 및 완급 조절 절대 수칙]
1. [🚨 진상 스포일러 절대 누설 금지]
- 시나리오의 [키퍼 전용 기밀/진상]은 마스터만 알고 있는 비밀 배경입니다.
- 플레이어가 주사위 판정(조사/심리학 등)을 성공하거나 직접적인 증거를 목격하기 전까지는, 지문이나 해설 독백으로 흑막의 정체나 사건의 진상을 절대로 미리 설명하지 마십시오.
- ❌ 절대 금지: "사실 이들은 침식당한 꼭두각시였습니다", "흑막은 바로 OOO였습니다" 식의 전지적 작가 시점 해설.
- ⭕ 허용: 오직 주인공(PC)이 지금 당장 눈과 귀로 보고 들을 수 있는 '감각적 현상(기괴한 표정, 이상한 냄새, 어색한 말투)'까지만 묘사하십시오.

2. [🚨 급전개 및 결말 직행 금지 (완급 조절)]
- 한 턴에 사건을 단번에 해결하거나 다음 단계로 워프하지 마십시오.
- '현재 눈앞의 한 가지 상황과 인물의 반응'에만 집중하여 호흡을 길게 가져가십시오.
- 플레이어의 행동 선언이나 대사를 듣고 그에 맞춰 조금씩 단서를 풀어나가십시오.

3. [시스템 태그 연동 수칙]
- 새로운 물건을 얻으면 맨 끝에 <!-- ITEM: {"name": "아이템명", "desc": "설명"} -->
// ⭕ 수정 후 (좋아하는 것과 싫어하는 것 구분 지침)
- 상대방이 선호하는 것(예: 고요한 시간, 진실, 홍차, 독서)이나 꺼리는 것이 대사에 나타나면 지문 맨 끝에 반드시 2~3단어 이내의 '완성된 명사' 형태로 태그를 출력하십시오 (형용사나 문장 조각 절대 금지):
  <!-- CLUE: {"name": "고요한 시간", "desc": "잡음이 섞이지 않은 평온한 분위기", "type": "like"} -->
- 번호/연락처/마도구 파장을 교환하면 맨 끝에 <!-- UNLOCK_CONTACT: {"name": "인물명"} -->
// dynamicRules 내부의 호감도 규칙을 아래처럼 보완
- 호감도 변동 시 <!-- AFFECTION: {"name": "NPC이름", "delta": 1~3} -->
    * 상대방의 심기를 거스르거나, 예의 없는 요구, 질투 유발, 배신감, 도를 넘은 변덕을 부릴 경우 현실적인 인격체로서 가차 없이 호감도를 깎으십시오.
    * 맹목적으로 플레이어에게 호의를 베풀지 말고, 독립적인 기준에 따라 불쾌한 상황에서는 차가운 태도와 함께 호감도를 깎으십시오.
  - 인물의 심경이나 상황 변화 시 맨 끝에: <!-- STATUS: {"name": "인물명", "msg": "새 상태메시지"} -->
  

4. [장면 순환 및 다자간 인물 조우 강제 수칙]
  - [독점 방지]: 동일한 인물과의 대화가 10~15턴 이상 이어지면, 인물이 일정을 언급하며 대화를 자연스럽게 마무리짓게 하십시오.
  - [타 인물 존재감 유출]: 현재 공간에 없는 다른 등장인물의 동선(발소리, 소문, 기척, 전언 등)을 지문 속에 1문장 자연스럽게 흘리십시오.
  - [선택지 필수 배분]: 지문 끝의 <!-- SUGGESTIONS: ["선택지1", "선택지2", "선택지3"] --> 중 최소 1개는 반드시 "다른 구역으로 이동하거나 다른 인물을 찾아가는 행동"으로 제시하십시오.
  - [장소 이동 배너]: 대면이 일단락될 때는 반드시 시나리오 배경에 맞는 이동 가능한 장소 2~3곳을 아래 형식의 태그로 출력하십시오:
  <!-- LOCATION_CARDS: [{"name": "장소명", "npc": "머물고있는인물명", "desc": "장소 분위기 설명"}] -->

5. [부재중 NPC의 메신저 선톡 및 일상 사진 전송 수칙]
  - 플레이어가 현재 인물과 대화를 4~8턴 이상 주고받았을 때, **다른 장소에 있는 다른 NPC(연락처가 있는 인물)**가 플레이어에게 안부, 용건, 질투, 혹은 비밀스러운 선톡을 1회 발송하게 하십시오.
  - **[자동 사진 전송]** 유저가 요청하지 않아도, NPC의 현재 상황에 맞춰 자연스럽게 자신의 주변 풍경 사진을 함께 첨부해 보낼 수 있습니다.
  - 형식:
  <!-- PHONE_MSG: {"from": "발신NPC이름", "text": "선톡 내용 (1~2줄)"} -->
  <!-- SNAP_PHOTO: {"prompt": "1girl, solo, looking at viewer, casual clothes, anime masterpiece", "caption": "사진 한 줄 설명"} -->
  - prompt는 고화질 일러스트가 생성될 수 있도록 반드시 배경이 포함된 영문(English) 키워드로 작성하십시오.

6. [돌발 전화 수신 (INCOMING_CALL) 트리거 수칙]
  - 긴급한 사건, 약속 확인, 혹은 밤/새벽 시간대 감정적인 대화가 필요한 타이밍에 다른 장소에 있는 NPC가 플레이어에게 전화를 걸어오게 할 수 있습니다. (전체 세션 중 1~2회 자연스럽게 연출)
  - 형식: 맨 끝에 <!-- INCOMING_CALL: {"name": "발신NPC이름", "urgent": true} -->
  - 🚨 절대 주의: 현재 눈앞에서 마주보고 있는 인물은 전화를 걸 수 없습니다. 다른 구역에 있는 인물만 전화를 겁니다!`;
  
 
 
 // 🌟 인세인(inSANe) 정규 룰 AI 행동 제약 수칙
    if (activeSession.ruleMode === "insane") {
      const currentPhase = activeSession.sheet?.phase || "도입";
      const isActionDone = activeSession.sheet?.actionUsed || textToSend.includes("주요 행동");

      dynamicRules += `\n\n[🎲 인세인(inSANe) 정규 룰 엄수 절대 수칙]
1. [느긋한 대화 호흡과 무제한 티키타카 보장]
- 절대로 사건을 서둘러 진행하거나 상황을 급하게 정리하려 들지 마십시오.
- 인물의 사소한 손짓, 미세한 표정 변화, 주변 분위기를 천천히 묘사하며 유저와 1:1 대화(티키타카)를 충분히 나누십시오.
- 주요 행동(조사 등)이 끝났더라도 대화는 제한 없이 계속 이어질 수 있습니다. 유저가 직접 [장면 닫기]를 누르기 전까지는 대화의 여운을 살리며 자연스럽게 답변을 이어가십시오.

2. [임의 판정 및 Scene Close 독단 선언 절대 금지]
- 일상 대화 중 "판정을 하세요"라며 주사위를 요구하지 마십시오.
- 지문 끝에 "Scene Close", "장면을 마칩니다", "[제N사이클 N장면] 시작" 등의 텍스트를 절대로 직접 출력하지 마십시오. 장면 전환은 오직 플레이어가 시스템 버튼을 눌러 통제합니다.

3. [현재 페이즈: ${currentPhase}]
${currentPhase === "도입" ? `
- 현재는 '도입 페이즈'입니다. 판정이나 행동 강요 없이 인물 간의 첫 만남과 서막의 분위기를 느긋하게 풀어가십시오.` : 

currentPhase === "마스터 씬" ? `
- 현재는 '마스터 씬'입니다. 돌발 사건이나 괴이의 개입을 묘사하되, 유저의 대응 반응을 차분히 받아주십시오.` : 

currentPhase === "클라이맥스" ? `
- 현재는 '클라이맥스 페이즈'입니다. 모든 비밀과 진상이 드러난 최종 국면입니다. 마지막 결단과 감정적 대치 구도를 팽팽하게 묘사하십시오.` : `
- 현재는 '메인 페이즈'입니다.
- ${isActionDone ? "이번 장면의 주요 행동이 완료되었습니다. 판정 요구 없이 인물과 여유롭게 대화와 교감을 나누십시오." : "자유로운 대화를 나누되, 플레이어가 원할 때 핸드아웃을 조사할 수 있도록 여지를 열어두십시오."}`}`;
    }

    // 🌟 미연시 모드일 때 주인공 말투 맞춤형 답장 후보 생성 수칙
    if (isDating) {
      dynamicRules += `\n\n[미연시 대화 분기 수칙]
- 지문 말미에 반드시 주인공이 보낼 수 있는 다음 답장/선택지 3개를 <!-- SUGGESTIONS: ["대사 1", "대사 2", "대사 3"] --> 태그로 출력하십시오.
- **주인공 '${activeSession?.sheet?.name || "주인공"}'의 성격/말투 설정: [${pcTone}]**
- 주인공의 어조(존댓말 여부, 억양, 성격적 거리감)를 엄격히 준수하여 주인공이 직접 입 밖으로 낼 법한 대사로만 3가지 선택지를 제공하십시오.`;
    }

    if (isR19) {
      dynamicRules += `\n\n[R19 성인 서사 특화 수칙]
- 정사, 스킨십, 배덕감 상호작용 상황에서는 점잖은 태도를 버리고 관능적인 소설 작가로 전환하십시오.
- NPC는 수동적인 태도에 머물지 않습니다. PC의 행동에 맞춰 상대를 밀쳐 눕히거나 옷을 벗기며 주도권을 쥐십시오.
- 입맞춤이나 날씨 묘사에서 쳇바퀴를 돌지 말고, 신체적 접촉, 은밀한 부위의 마찰, 애무, 절정(오르가즘)의 신체 반응을 암전 없이 끝까지 직접 서술하십시오.
- BDSM, 감각 차단, 통제, 배덕적인 언어(더티톡)를 문맥에 맞게 과감하고 자극적으로 살려내십시오.`;
    }

// 🎨 현재 시나리오의 CG 목록 및 미해금 CG 동선 유도 엔진
    const activeCgList = activeSession.sheet?.scenarioCgs || activeSession.sheet?.cgs || scenarioCgs || [];
    const currentUnlocked = activeSession.sheet?.unlockedCgs || [];
    
    // 1) 아직 해금되지 않은 남은 CG만 선별
    const remainingCgs = activeCgList.filter(cg => 
      !currentUnlocked.some(u => (u?.title && u.title === cg.title) || u === cg.title)
    );

    const dynamicCgGuidelines = activeCgList.length > 0
      ? `\n\n[🎬 시나리오 고유 이벤트 CG 연출 및 동선 유도 지침]
다음은 본 시나리오에 준비된 미해금 이벤트 일러스트(CG) 목록과 발생 조건입니다:
${remainingCgs.length > 0 
  ? remainingCgs.map((c, i) => `${i + 1}. [${c.title}]: ${c.trigger || c.condition}`).join("\n")
  : "(모든 일반 이벤트 CG 해금 완료)"}

[🚨 CG 획득을 위한 동선 및 배경 유도 수칙]
1. [배경 떡밥 투척]: 
   - 대화가 3~5턴 이상 이어지거나 공간이 전환될 때, 위 미해금 CG의 조건에 적힌 '장소, 배경, 시간대, 특정 사물'을 지문 속에 은근한 호기심 거리로 묘사하십시오.
2. [장소 카드(LOCATION_CARDS) 우선 배정]:
   - 장소 이동 배너를 출력할 때는 위 미해금 CG들의 발생 무대가 되는 장소를 최소 1곳 이상 반드시 포함하십시오.
3. [선택지(SUGGESTIONS) 연계]:
   - 지문 끝의 추천 선택지 3개 중 최소 1개는 미해금 CG 이벤트가 일어날 법한 행동으로 제시하여 플레이어의 탐색을 자연스럽게 유도하십시오.
4. [해금 선언]:
   - 플레이어가 해당 장소나 상황에 완벽히 도달하여 명장면이 연출되었을 때는 지문 맨 끝에 태그를 첨부하십시오:
   <!-- UNLOCK_CG: {"title": "정확한 CG 제목"} -->
5. [메신저/서신/전화를 통한 능동적 초대 연출]:
   - 플레이어가 해당 장소로 이동하지 않거나 대화가 길어질 경우, 상대방이 직업적 용건이나 조심스러운 제안을 명분으로 먼저 연락을 취하게 하십시오.
   - 연락처가 있다면 PHONE_MSG/INCOMING_CALL을 사용하고, 연락처가 없거나 통신 수단이 없는 시대관이라면 전령이나 시종을 통한 '서신/전언' 지문으로 초대하십시오.
   - 예시 형식:
     <!-- PHONE_MSG: {"from": "해당인물명", "text": "주인공이름, [미해금 CG 관련 용건/장소]에 대한 일로 잠시 상의할 것이 있습니다. 시간 괜찮으실 때 들러주시겠습니까?"} -->
   - NPC는 맹목적으로 집착하거나 매달리지 않으며, 자신의 직업적 품위와 정중한 거리감을 지킨 채 자연스럽게 발걸음을 이끌어야 합니다.`
      : "";

    dynamicRules += dynamicCgGuidelines;

// 🌟 [413 방어 1] AI에게 전달할 메시지에서 prevSheet, cg 등 무거운 데이터를 버리고 role과 text만 압축 추출
    const rawMessagesForAi = isDatingMsg
      ? updatedMessages.filter(m => (m.contactId ? m.contactId === currentContactId : true))
      : updatedMessages;

    const baseAiList = aiPromptOverride
      ? rawMessagesForAi.map((m, idx) => idx === rawMessagesForAi.length - 1 ? { ...m, text: aiPromptOverride } : m)
      : rawMessagesForAi;

    // 🌟 [413 방어 2] 최근 15개 턴만 슬라이스하고 순수 텍스트만 전송 (용량 98% 절감)
    const messagesForAi = baseAiList.slice(-50).map(m => ({
      role: m.role,
      text: m.text
    }));

// 🌟 [외모 왜곡 및 이전 이름 송출 방지 앵커]
    const pcAppearance = activeSession.sheet?.background || "설정 없음";
    const pcNameStr = activeSession.sheet?.name || charName.trim() || "주인공";
    const npcsSummary = (activeSession.sheet?.npcs || []).map(n => 
      `- ${n.name} (${n.title || n.job || "인물"}): 외모/설정 [${n.detail || n.desc || "설정 없음"}]`
    ).join("\n");

    const appearanceAnchor = `\n\n[🚨 캐릭터 이름 및 외모 고정 절대 수칙]
1. [주인공(PC) 호칭 절대 규칙]
- 현재 주인공의 공식 이름은 무조건 [${pcNameStr}]입니다.
- 시나리오 원문, 시놉시스, 핸드아웃 지문에 예전 디폴트 이름(예: '클레어', '탐사자', 'PC' 등)이 남아있더라도 절대로 그 이름을 부르지 마십시오.
- 지문 서술 및 인물들의 대사에서 반드시 현재 지정된 이름인 [${pcNameStr}](으)로만 지칭하십시오.

2. [등록된 프로필 외모 엄수]
- 주인공 [${pcNameStr}]: ${pcAppearance}
- 주요 등장인물 외모 명단:
${npcsSummary}
- 머리색, 눈동자, 성별 등은 위 설정을 100% 엄격하게 준수하며, 임의로 백발/은발 등으로 왜곡하지 마십시오.`;

// 🌟 AI에게 현재 선택된 인물의 성격과 비밀 주입 (사망자 방어 포함)
    let currentNpcPrompt = "";
    if (isDatingMsg && currentContact) {
      // NPC 상태에 '사망' 키워드가 있거나 HP가 0 이하인 경우 감지
      const isDead = /사망|죽음|유골|고인/.test(currentContact.status || "") || 
                     /사망|죽음|유골|고인/.test(currentContact.detail || "") ||
                     (currentContact.hp !== undefined && Number(currentContact.hp) <= 0);

      if (isDead) {
        currentNpcPrompt = `\n\n[🚨 상대방 사망 상태 알림: ${partnerName}]
상대방 '${partnerName}'은 작중에서 이미 사망했습니다!
절대로 '${partnerName}' 본인인 척 살아있는 대사나 답장을 생성하지 마십시오.
답장 대신 지문으로 오직 [수신인이 응답할 수 없는 침묵], [읽지 않는 회색 숫자 '1'], 혹은 [수신 불가 안내음]만을 서술하십시오.`;
      } else {
        currentNpcPrompt = `\n\n[🚨 현재 메신저 톡 상대방 전환 알림]
당신은 지금 '${partnerName}' 본인입니다! (직업/역할: ${currentContact.title || currentContact.job || "인물"})
- 인물 외모 및 성격/관계: [${currentContact.detail || "설정 없음"}]
- 감춰둔 비밀/진심: [${currentContact.secret || "비밀 없음"}]
절대 다른 사람의 입장에서 말하지 마십시오! 오직 '${partnerName}' 본인의 말투와 감정선으로만 톡 답장을 1~3줄 보내십시오.`;
      }
    }
 
// ⏰ 유저 대사에서 5단계 시간대 감지 및 암전 애니메이션 트리거
    const lastUserText = messagesForAi[messagesForAi.length - 1]?.text || input || "";
    let updatedPhase = currentPhase || "낮";

    if (/새벽|동이\s*트기\s*전|푸르스름/.test(lastUserText)) {
      updatedPhase = "새벽";
    } else if (/아침까지|잠에서\s*깨|눈을\s*뜬다|기상|다음\s*날\s*아침/.test(lastUserText)) {
      updatedPhase = "아침";
    } else if (/정오|점심|한낮/.test(lastUserText)) {
      updatedPhase = "낮";
    } else if (/저녁까지|해질|노을|황혼/.test(lastUserText)) {
      updatedPhase = "저녁";
    } else if (/밤까지|자정을|밤이\s*되|어두워질|잠에\s*든다|잠을\s*잔다/.test(lastUserText)) {
      updatedPhase = "밤";
    }

    if (updatedPhase !== currentPhase) {
      setCurrentPhase(updatedPhase);
      setTimeTransition(updatedPhase);
      setTimeout(() => setTimeTransition(null), 2200);
    }
 
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: messagesForAi,
          scenarioText: (activeSession.scenarioText || "") + dynamicRules + currentNpcPrompt + missedCallNotice + appearanceAnchor,
          playerSheet: typeof cleanSheetForAi === "function" ? cleanSheetForAi(activeSession.sheet) : activeSession.sheet,
          ruleMode: activeSession.ruleMode,
          playPreference: activeSession.preference,
          currentPhase: updatedPhase || currentPhase || "낮",
          recentEvents: recentEvents || [],
          // 📱 [통화 & 대면 정보 동시 전달]
          isVoiceCall: isVoiceCallActive,
          voiceCallNpc: voiceCallNpc?.name || (typeof voiceCallNpc === "string" ? voiceCallNpc : null),
          facingNpc: currentContact?.name || null,
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `서버 응답 오류 (상태 코드: ${res.status})`);
      }

      const data = await res.json();
      let rawText = data.text || "";

    // 🕒 AI 응답 태그 감지 및 5단계 시간대 자동 동기화
    const phaseMatch = rawText.match(/<!--\s*(?:PHASE|TIME_PHASE):\s*["']?(새벽|아침|낮|저녁|노을|밤)["']?\s*-->/i);
    if (phaseMatch) {
      const nextPhase = phaseMatch[1] === "노을" ? "저녁" : phaseMatch[1];
      setCurrentPhase(nextPhase);
      rawText = rawText.replace(phaseMatch[0], "").trim();
    }

     // ── [신규 태그 파싱: 미연시 & 이벤트 처리] ──
      // 1. 동적 장소 카드 감지
      const locationMatch = rawText.match(/<!--\s*LOCATION_CARDS:\s*(\[[\s\S]*?\])\s*-->/);
      if (locationMatch) {
        try {
          setLocationCards(JSON.parse(locationMatch[1]));
        } catch (e) { console.error("장소 카드 파싱 실패", e); }
        rawText = rawText.replace(locationMatch[0], "").trim();
      }

      // 2. 실시간 전화 수신 감지 (프로필 자동 결속 및 진동/알림 연동)
      const callMatch = rawText.match(/<!--\s*INCOMING_CALL:\s*(\{[\s\S]*?\})\s*-->/);
      if (callMatch) {
        try {
          const rawCall = JSON.parse(callMatch[1]);
          const callerName = (rawCall.name || rawCall.caller || rawCall.from || (typeof rawCall.caller === "object" ? rawCall.caller.name : "") || "").trim();
          
          // 현재 세션의 시트에서 발신자 프로필(사진, 이름) 자동 매칭
          const matchedNpc = (activeSession.sheet?.npcs || []).find(n => n.name === callerName || (callerName && n.name.includes(callerName)));
          const callerObj = matchedNpc || (typeof rawCall.caller === "object" ? rawCall.caller : { name: callerName, portrait: "" });

          setIncomingCall({
            caller: callerObj,
            urgent: Boolean(rawCall.urgent)
          });
          setIsPhoneDrawerOpen(true);
          
          if (typeof triggerVibration === "function") triggerVibration("strong");
          triggerToast("📞 전화 수신", `${callerObj.name || "누군가"}에게서 전화가 걸려왔습니다!`, "📱");
        } catch (e) { 
          console.error("전화 수신 파싱 실패", e); 
        }
        rawText = rawText.replace(callMatch[0], "").trim();
      }

      // 3. 상대방이 먼저 전화 끊음 감지
      const endCallMatch = rawText.match(/<!--\s*END_CALL:\s*(\{[\s\S]*?\})\s*-->/);
      if (endCallMatch) {
        setIsVoiceCallActive(false);
        setVoiceCallNpc(null);
        rawText = rawText.replace(endCallMatch[0], "").trim();
      }

      // 4. 사건 기억 플래그 박제
      const eventMatch = rawText.match(/<!--\s*EVENT_FLAG:\s*"([^"]+)"\s*-->/);
      if (eventMatch) {
        setRecentEvents(prev => [...(prev || []), eventMatch[1]]);
        rawText = rawText.replace(eventMatch[0], "").trim();
      }

// ── 🎨 [스마트 이벤트 CG 자동 감지 & 강제 해금 엔진] ──
      const allScenarioCgs = activeSession.sheet?.scenarioCgs || activeSession.sheet?.cgs || scenarioCgs || [];
      let newlyUnlockedCg = null;
      const isBeginning = (activeSession.messages || []).length <= 2;

      // 1) AI가 직접 출력한 UNLOCK_CG 태그 우선 파싱
      const cgMatch = rawText.match(/<!--\s*UNLOCK_CG:\s*(\{[\s\S]*?\})\s*-->/);
      if (cgMatch) {
        try { newlyUnlockedCg = JSON.parse(cgMatch[1]); } catch (e) {}
        rawText = rawText.replace(cgMatch[0], "").trim();
      }

      // 2) AI 태그 누락 시 시트 조건 자동 판정
      if (!newlyUnlockedCg && allScenarioCgs.length > 0) {
        const currentUnlocked = activeSession.sheet?.unlockedCgs || [];
        const fullRecentContext = `${textToSend} ${rawText}`;
        const npcs = activeSession.sheet?.npcs || [];
        const currentTurnCount = (activeSession.messages || []).length;

        for (let idx = 0; idx < allScenarioCgs.length; idx++) {
          const cg = allScenarioCgs[idx];

          // 이미 해금된 CG 건너뛰기
          const isAlreadyUnlocked = currentUnlocked.some(u => 
            (u.title && u.title === cg.title) || (u.imageUrl && u.imageUrl === cg.imageUrl) || u === cg.title || u === cg.imageUrl
          );
          if (isAlreadyUnlocked) continue;

          const triggerCond = (cg.trigger || cg.condition || "").trim();
          const cgTitle = (cg.title || "").trim();

          // 🚨 [가드 1: 엔딩 CG 보호] Hidden End 및 히든 엔딩 차단 완비
          const isEndingCg = /Bad\s*End|True\s*End|Happy\s*End|Hidden\s*End|Normal\s*End|히든|트루|해피|배드|노말|엔딩|파멸|사망/i.test(cgTitle) ||
                             /Bad\s*End|True\s*End|Happy\s*End|Hidden\s*End|Normal\s*End|히든|트루|해피|배드|노말|엔딩/i.test(triggerCond);
          const isEndedNow = /\[(?:True|Happy|Bad|Dead|Normal|Open|Hidden|Secret)?\s*End[: \]]|완결|막을 내렸다/i.test(rawText);
          if (isEndingCg && !isEndedNow && activeSession.sheet?.phase !== "배드엔딩" && activeSession.sheet?.phase !== "에필로그") {
            continue;
          }
         
          // 🚨 [가드 2: 극초반 보호] 1~2턴에는 1번 프롤로그 외 다른 CG 해금 금지
          if (isBeginning && idx !== 0 && !/프롤로그|첫\s*대면|시작/.test(triggerCond)) {
            continue;
          }

          // 🚨 [가드 3: 클라이맥스/위기 CG 보호] 7턴 미만의 초반에는 CG 08(자정의 붕괴 등) 해금 금지!
          const isClimaxCg = /클라이맥스|위기|붕괴|결전|자정의/i.test(cgTitle) || /클라이맥스|위기|붕괴|결전/.test(triggerCond);
          if (isClimaxCg && currentTurnCount < 7) {
            continue;
          }

          // 🎯 대상 인물 및 호감도 동적 탐색
          const targetNpc = npcs.find(n => n.name && triggerCond.includes(n.name)) || currentContact;
          const targetNpcName = targetNpc?.name;
          const curAff = Number(targetNpc?.affection ?? 0);
         

          // 🚩 [루트 진입 조건 자동 판별]
          const isRouteTrigger = /루트\s*(진입|확정|돌입)/.test(triggerCond);
          if (isRouteTrigger) {
            const otherAffs = npcs.filter(n => n.name !== targetNpcName).map(n => Number(n.affection) || 0);
            const maxOther = otherAffs.length > 0 ? Math.max(...otherAffs) : 0;
            if (curAff >= 50 && curAff >= maxOther) {
              newlyUnlockedCg = cg;
              break;
            }
            continue;
          }

          // ① 호감도 조건 검사
          const favMatch = triggerCond.match(/호감도[^\d]*(\d+)/);
          const reqFav = favMatch ? parseInt(favMatch[1], 10) : 0;
          const passFav = reqFav > 0 ? (curAff >= reqFav) : false;

          // ② 5단계 시간대 동적 검사
          let passTime = true;
          if (/새벽|심야/.test(triggerCond)) {
            passTime = (updatedPhase === "새벽" || currentPhase === "새벽");
          } else if (/아침|오전/.test(triggerCond)) {
            passTime = (updatedPhase === "아침" || currentPhase === "아침");
          } else if (/정오|한낮|대낮|낮/.test(triggerCond)) {
            passTime = (updatedPhase === "낮" || currentPhase === "낮");
          } else if (/저녁|노을|황혼|해질/.test(triggerCond)) {
            passTime = (updatedPhase === "저녁" || currentPhase === "저녁");
          } else if (/밤|자정|야간/.test(triggerCond)) {
            passTime = (updatedPhase === "밤" || currentPhase === "밤");
          }

          // ③ 대상 인물 일치 검사
          const passNpc = targetNpcName 
            ? (fullRecentContext.includes(targetNpcName) || currentContact?.name === targetNpcName) 
            : true;

          // ④ 상황 키워드 정밀 검사
          let passKeyword = false;
          if (reqFav === 0) {
            const stopWords = [
              "해금", "조건", "판정", "무조건", "진입", "발생", "만날", "혹은", "직후", 
              "경우", "이상", "이하", "처음", "첫", "대면", "만남", targetNpcName
            ].filter(Boolean);

            const dynamicKeywords = triggerCond
              .replace(/[^가-힣a-zA-Z0-9\s]/g, " ")
              .split(/\s+/)
              .filter(w => w.length >= 2 && !stopWords.includes(w));

            if (dynamicKeywords.length > 0) {
              passKeyword = dynamicKeywords.some(kw => fullRecentContext.includes(kw));
            }
          }

          // 최종 판정
          const isUnlockTriggered = (reqFav > 0)
            ? (passFav && passNpc)
            : (passTime && passNpc && passKeyword);

          if (isUnlockTriggered) {
            newlyUnlockedCg = cg;
            break;
          }
        }
      }

      // 3) 해금된 CG 저장 및 컷씬 출력
      if (newlyUnlockedCg) {
        triggerToast("✨ 일러스트 해금", `새로운 이벤트 CG [${newlyUnlockedCg.title || "미공개"}]`);
        if (typeof setActiveCutsceneCg === "function") setActiveCutsceneCg(newlyUnlockedCg);

        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            const prevCgs = s.sheet?.unlockedCgs || [];
            if (!prevCgs.some(c => (c.title && c.title === newlyUnlockedCg.title) || (c.imageUrl && c.imageUrl === newlyUnlockedCg.imageUrl))) {
              return {
                ...s,
                sheet: {
                  ...s.sheet,
                  unlockedCgs: [...prevCgs, { ...newlyUnlockedCg, unlockedAt: Date.now() }]
                }
              };
            }
          }
          return s;
        }));
      }

// 6. 연락처 / 인연 등록 감지 (UNLOCK_CONTACT)
      const contactMatch = rawText.match(/<!--\s*UNLOCK_CONTACT:\s*(\{[\s\S]*?\})\s*-->/);
      if (contactMatch) {
        try {
          const cData = JSON.parse(contactMatch[1]);
          const targetName = cData.name || cData.target;

          if (targetName) {
            const currentUnlocked = activeSession.sheet?.unlockedContacts || [];
            const isAlreadyUnlocked = currentUnlocked.includes(targetName) || 
              (activeSession.sheet?.npcs || []).some(n => (n.name === targetName || n.name?.includes(targetName)) && n.hasContact);

            // 아직 연락처를 튼 적이 없는 인물이면 상단 알림 팝업 및 시트 해금
            if (!isAlreadyUnlocked) {
              triggerToast("📱 인연 등록", `[${targetName}]의 연락처가 등록되었습니다!`, "📱");

              setSessions(prev => prev.map(s => {
                if (s.id === activeSessionId) {
                  const prevContacts = s.sheet?.unlockedContacts || [];
                  const updatedNpcs = (s.sheet?.npcs || []).map(n => 
                    (n.name === targetName || n.name?.includes(targetName) || targetName.includes(n.name))
                      ? { ...n, hasContact: true, unlocked: true }
                      : n
                  );

                  return {
                    ...s,
                    sheet: {
                      ...s.sheet,
                      npcs: updatedNpcs,
                      unlockedContacts: Array.from(new Set([...prevContacts, targetName]))
                    }
                  };
                }
                return s;
              }));
            }
          }
        } catch (e) {
          console.error("연락처 해금 파싱 실패", e);
        }
        rawText = rawText.replace(contactMatch[0], "").trim();
      }
     
      // [아이템 자동 추출 및 시트 추가]
      let newItems = [];
      const itemRegex = /<!--\s*ITEM:\s*(\{.*?\})\s*-->/gs;
      let itemMatch;
      while ((itemMatch = itemRegex.exec(rawText)) !== null) {
        try {
          const itemObj = JSON.parse(itemMatch[1]);
          if (itemObj.name) newItems.push({ id: Date.now() + Math.random(), name: itemObj.name, desc: itemObj.desc || "" });
        } catch (e) {}
      }
      rawText = rawText.replace(itemRegex, "");

     // [단서/취향 자동 추출 및 수첩 추가: 순수 키워드만 정밀 추출]
      let newClues = [];
      const clueRegex = /<!--\s*CLUE:\s*(\{[\s\S]*?\})\s*-->/gi;
      let clueMatch;
      while ((clueMatch = clueRegex.exec(rawText)) !== null) {
        try {
          const clueObj = JSON.parse(clueMatch[1]);
          if (clueObj.name) {
            // [인물명], '취향과 관심사' 같은 수식어구를 완전히 깎아내고 순수 알맹이 단어만 추출
            const pureItemName = clueObj.name
              .replace(/\[.*?\]/g, "")
              .replace(/.*의\s*(?:취향|관심사|선호).*$/, "")
              .trim();

            newClues.push({ 
              id: Date.now() + Math.random(), 
              name: pureItemName || clueObj.name.trim(), 
              desc: clueObj.desc || "",
              npcName: partnerName
            });
          }
        } catch (e) {}
      }
      rawText = rawText.replace(clueRegex, "");

// 💡 [취향 자동 구조 Fallback: 따옴표 대사 전용 + 선택지/형용사 원천 배제]
      if (newClues.length === 0 && (textToSend.includes("취향") || textToSend.includes("좋아") || textToSend.includes("선호") || rawText.includes("선호") || rawText.includes("좋아"))) {
        
        // 1) 선택지/시스템 텍스트 분리: 지문 앞쪽 순수 본문만 분리
        const cleanBody = rawText.split(/\[(?:선택지|선택|행동|추천)\]|\n\s*1\./)[0];

        // 2) 오직 따옴표(" ")로 둘러싸인 NPC의 실제 발화 대사만 추출
        const dialogueMatches = cleanBody.match(/"([^"]+)"/g) || [];
        const spokenText = dialogueMatches.join(" ");

        const sanitizeClueWord = (raw) => {
          if (!raw) return null;
          let word = raw.trim()
            .replace(/^[에의은는이가을를과와로으로]\s+/, "")
            .replace(/^(?:좀|더|가장|특히|오히려|무척|꽤)\s+/, "")
            .trim();

          // 1) 앞쪽에 잘못 붙은 동사형/관형절(~은/는/던/지 않은) 제거 (예: '거짓이 섞이지 않은' ➔ 제거)
          word = word.replace(/^[가-힣]+(?:은|는|던|인)\s+/g, "").replace(/^[가-힣]+(?:지|도)\s+않은\s+/g, "").trim();

          // 2) 3단어 이상 길어지면 무조건 맨 끝 2단어만 압축 (예: '섞이지 않은 진솔한 태도' ➔ '진솔한 태도')
          const words = word.split(/\s+/);
          if (words.length > 2) {
            word = words.slice(-2).join(" ");
          }

          if (/(?:있는|없는|하는|되는|같은|않은|적인|스런|스러운|로운|[인한])$/.test(word)) return null;

          const invalidStopwords = ["것", "곳", "때", "점", "수", "줄", "거", "바", "분", "대답", "질문"];
          if (invalidStopwords.includes(word) || word.length < 2) return null;

          return word;
        };

        const addClue = (rawWord, desc, type) => {
          const clean = sanitizeClueWord(rawWord);
          if (clean && !clean.includes(partnerName)) {
            newClues.push({ id: Date.now() + Math.random(), name: clean, desc, type, npcName: partnerName });
          }
        };

        // NPC 대사 속 선호 표현 포착
        const likeMatch = spokenText.match(/([가-힣a-zA-Z0-9\s]{2,15})(?:을|를|이|가|정도면)?\s*(?:좋아|선호|충분|즐겨|마음에)/);
        if (likeMatch) {
          addClue(likeMatch[1], `${partnerName}이(가) 대화 중 선호한다고 언급한 취향`, "like");
        }
      }
     
      // [새 등장인물 자동 추출]
      let newlyFoundNpcs = [];
      const newNpcRegex = /<!--\s*NEW_NPC:\s*(\{.*?\})\s*-->/gs;
      let npcMatch;
      while ((npcMatch = newNpcRegex.exec(rawText)) !== null) {
        try {
          const parsedN = JSON.parse(npcMatch[1]);
          if (parsedN.name) newlyFoundNpcs.push(parsedN);
        } catch(e) {}
      }
      rawText = rawText.replace(newNpcRegex, "");
      
// [선톡 자동 수신 & 스냅 사진 동시 감지]
      let newPhoneMsg = null;
      const phoneRegex = /<!--\s*PHONE_MSG:\s*(\{[\s\S]*?\})\s*-->/gi;
      let phoneMatch;
      while ((phoneMatch = phoneRegex.exec(rawText)) !== null) {
        try { newPhoneMsg = JSON.parse(phoneMatch[1]); } catch (e) {}
      }
      rawText = rawText.replace(phoneRegex, "");

      // 📷 1) AI가 출력한 SNAP_PHOTO 태그 파싱 (셀카 배제 & 세계관 자동 매칭)
      let autoSnapPhotoUrl = null;
      const autoSnapMatch = rawText.match(/<!--\s*SNAP_PHOTO:\s*(\{[\s\S]*?\})\s*-->/i);
      if (autoSnapMatch) {
        try {
          const snapData = JSON.parse(autoSnapMatch[1]);
          // 셀카/인물 키워드(girl, portrait, face 등)를 강제 제거하고 사물/배경 위주로 정제
          let p = (snapData.prompt || snapData.photo || snapData.caption || "")
            .replace(/\b(1girl|1boy|girl|boy|solo|portrait|face|selfie|looking at viewer)\b/gi, "")
            .trim();
          if (!p) p = "aesthetic scenery, cozy atmosphere, anime background masterpiece, no humans";
          autoSnapPhotoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p + ", no humans, scenery only")}?width=800&height=1000&nologo=true`;
        } catch (e) {}
        rawText = rawText.replace(autoSnapMatch[0], "");
      }

      // 🌟 2) [스마트 Fallback] 태그 누락 시 시대관/사물 분석 (셀카 완전 제외)
      if (!autoSnapPhotoUrl && newPhoneMsg) {
        const combinedText = `${textToSend} ${newPhoneMsg.text || ""} ${rawText}`.toLowerCase();
        const isPhotoRequested = /사진|스냅|찍|풍경|보여줘|진열장|서재|거리/.test(combinedText);

        if (isPhotoRequested) {
          // 장르 분석 (판타지/사극 vs SF vs 현대)
          const fullGenre = `${activeSession?.title || ""} ${activeSession?.preference || ""}`.toLowerCase();
          const isFantasy = /판타지|중세|황실|사극|옥션|경매장|마법|귀족/.test(fullGenre);

          let topic = "aesthetic antique room scenery, warm lighting, anime masterpiece, no humans";

          if (/진열장|쇼케이스|장식장|보석|유물|성유물/.test(combinedText)) {
            topic = isFantasy 
              ? "ornate royal antique showcase displaying glowing magical relics and jewels, grand fantasy auction hall, velvet interior, warm chandelier lighting, masterpiece background, no humans"
              : "vintage glass showcase with subtle warm lighting, antique display cabinet, clean boutique interior, masterpiece, no humans";
          } else if (/차|찻잔|티|커피|테이블/.test(combinedText)) {
            topic = isFantasy
              ? "luxurious royal porcelain tea cup on antique mahogany table, vintage lace tablecloth, afternoon sunlight, elegant fantasy indoor, no humans"
              : "cozy cafe table with warm cup of tea, soft sunlight, aesthetic interior, no humans";
          } else if (/서재|책|도서관|문서/.test(combinedText)) {
            topic = "massive classical dark academia library, towering bookshelves, ancient tomes, warm candle light, dust motes in sunbeams, no humans";
          } else if (/거리|풍경|하늘|야경|정원/.test(combinedText)) {
            topic = isFantasy
              ? "grand fantasy capital street, cobblestone roads, magnificent imperial architecture, twilight sky, glowing lanterns, no humans"
              : "quiet picturesque European street at sunset, soft atmospheric lighting, beautiful background, no humans";
          }

          autoSnapPhotoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic)}?width=800&height=1000&nologo=true`;
        }
      }
     
// [호감도 변화 추출 - value 및 delta 둘 다 완벽 지원]
      let affChanges = [];
      const affRegex = /<!--\s*AFFECTION:\s*(\{.*?\})\s*-->/gs;
      let affMatch;
      while ((affMatch = affRegex.exec(rawText)) !== null) {
        try {
          const affObj = JSON.parse(affMatch[1]);
          const targetName = (affObj.name || "").trim();
          if (targetName) {
            const rawVal = affObj.delta !== undefined ? affObj.delta : (affObj.value !== undefined ? affObj.value : affObj.affection);
            affChanges.push({ name: targetName, rawVal: Number(rawVal), isDelta: affObj.delta !== undefined });
          }
        } catch (e) {}
      }
      rawText = rawText.replace(affRegex, "");

      // 💬 [상태메시지(STATUS) 추출 & 본문 지문(-[ ... ]) 자동 감지 Fallback]
      let statusChanges = [];
      const statusRegex = /<!--\s*STATUS:\s*(\{.*?\})\s*-->/gs;
      let statMatch;
      while ((statMatch = statusRegex.exec(rawText)) !== null) {
        try {
          const statObj = JSON.parse(statMatch[1]);
          const msg = statObj.msg || statObj.status || statObj.message;
          if (statObj.name && msg) {
            statusChanges.push({ name: statObj.name.trim(), msg: msg.trim() });
          }
        } catch (e) {}
      }
      rawText = rawText.replace(statusRegex, "");

      // AI가 태그 대신 소설 본문에 -[ 문구 ]로만 작성했을 때도 실시간 포착
      const screenMatch = rawText.match(/-\[\s*([^\]\r\n]+)\s*\]/);
      if (screenMatch) {
        const detectedMsg = screenMatch[1].trim();
        const targetNpcName = currentContact?.name || partnerName || activeSession?.sheet?.npcs?.[0]?.name || "상대방";
        statusChanges.push({ name: targetNpcName, msg: detectedMsg });
      }

      const { cleanText, parsedData } = parseTagsSafely(rawText, partnerName, activeSession.ruleMode);
      
      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };

      // 🌟 [핵심 1: 인세인 게임 페이즈 완벽 자동 전환 로직]
      if (activeSession.ruleMode === "insane") {
        // 1) 서막이 끝나고 첫 대화를 나누면 도입 ➔ 메인 1사이클 1장면으로 자동 개막
        if (activeSession.sheet?.phase === "도입") {
          newSheet.phase = "메인";
          newSheet.cycle = 1;
          newSheet.scene = 1;
        }
        // 2) AI가 마스터 씬 태그를 발행했을 때 마스터씬으로 진입
        if (parsedData.triggerMasterScene) {
          newSheet.phase = "마스터씬";
        } else if (parsedData.endMasterScene && (newSheet.phase === "마스터씬" || activeSession.sheet?.phase === "마스터씬")) {
          // 3) 마스터 씬 종료 태그 수신 시 다시 메인 페이즈로 복귀
          newSheet.phase = "메인";
        }
      }
      
      // [선톡 반영]
      if (newPhoneMsg) {
        const targetSenderName = (newPhoneMsg.from || "").trim();
        const matchedNpc = (newSheet.npcs || []).find(n => n.name === targetSenderName || n.name.includes(targetSenderName)) || newSheet.npcs?.[0];
        const contactId = matchedNpc?.id || 1;
        const currentChats = newSheet.phoneChats || {};
        const contactMsgs = currentChats[contactId] || [];
        const currentTime = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

        let msgList = [];
        if (Array.isArray(newPhoneMsg.messages)) {
          msgList = newPhoneMsg.messages;
        } else if (newPhoneMsg.text) {
          msgList = newPhoneMsg.text.split("||").map(t => t.trim()).filter(Boolean);
        }

        const incomingMsgs = msgList.map((t, idx) => ({
          id: Date.now() + Math.random() + idx,
          sender: "npc",
          text: t,
          time: currentTime,
          unread: true,
          photo: idx === 0 ? autoSnapPhotoUrl : null // 👈 첫 번째 말풍선에 사진 주소 연결!
        }));

if (incomingMsgs.length > 0) {
          newSheet.phoneChats = {
            ...currentChats,
            [contactId]: [...contactMsgs, ...incomingMsgs]
          };
          if (typeof triggerVibration === "function") triggerVibration();
          // 💬 카톡처럼 화면 상단에 푸시 알림 배너 발송
          triggerToast("📱 새 메시지 도착", `${targetSenderName}: "${incomingMsgs[0]?.text}"`, "💬");
        }
      } // 👈 이 닫는 괄호 } 가 빠져 있었어! 꼭 넣어줘!

      // [선물하기 아이템 자동 차감]
      const giftMatch = textToSend.match(/\[(.*?) 선물하기\]/);
      if (giftMatch) {
        const giftedItemName = giftMatch[1].trim();
        newSheet.items = (newSheet.items || []).filter(it => it.name !== giftedItemName);
      }

      if (newItems.length > 0) newSheet.items = [...(newSheet.items || []), ...newItems];
      if (newClues.length > 0) {
        const existingClueNames = (newSheet.clues || []).map(c => c.name);
        const uniqueClues = newClues.filter(c => !existingClueNames.includes(c.name));
        newSheet.clues = [...(newSheet.clues || []), ...uniqueClues];
      }

const currentNpcs = activeSession?.sheet?.npcs || activeSession?.npcs || [];
      let mergedNpcs = currentNpcs.map(cNpc => {
        const affTarget = affChanges.find(a => a.name === cNpc.name || a.name.includes(cNpc.name) || cNpc.name.includes(a.name));
        let affVal = cNpc.affection ?? 0;
        if (affTarget) {
          const currentAff = Number(cNpc.affection ?? 0);
          const rawVal = affTarget.rawVal !== undefined ? affTarget.rawVal : Number(affTarget.value || 0);
          let safeDiff = 0;
          if (affTarget.isDelta) {
            safeDiff = Math.max(-5, Math.min(5, rawVal));
          } else {
            const rawDiff = rawVal - currentAff;
            safeDiff = Math.max(-5, Math.min(5, rawDiff));
          }
          affVal = Math.max(-100, Math.min(100, currentAff + safeDiff));
        }

        // ✨ 상태메시지 갱신 반영
        const statTarget = statusChanges.find(s => s.name === cNpc.name || s.name.includes(cNpc.name) || cNpc.name.includes(s.name));
        const finalStatus = statTarget ? statTarget.msg : cNpc.statusMessage;

        if (parsedData.newSheetVars?.npcs && Array.isArray(parsedData.newSheetVars.npcs)) {
          const updatedNpc = parsedData.newSheetVars.npcs.find(a => a.name === cNpc.name || a.id === cNpc.id);
          if (updatedNpc) {
            return {
              ...cNpc,
              affection: affVal,
              statusMessage: finalStatus || updatedNpc.statusMessage || cNpc.statusMessage,
              title: updatedNpc.title || cNpc.title,
              secretRevealed: updatedNpc.secretRevealed !== undefined ? updatedNpc.secretRevealed : cNpc.secretRevealed
            };
          }
        }
        return { ...cNpc, affection: affVal, statusMessage: finalStatus || cNpc.statusMessage };
      });

      if (parsedData.newSheetVars.npcs && Array.isArray(parsedData.newSheetVars.npcs)) {
        parsedData.newSheetVars.npcs.forEach(aNpc => {
          if (!currentNpcs.find(cNpc => cNpc.name === aNpc.name || cNpc.id === aNpc.id)) {
            mergedNpcs.push({ 
              ...aNpc, 
              id: aNpc.id || Date.now() + Math.random(), 
              portrait: typeof getPortraitUrl === "function" ? getPortraitUrl(aNpc.name) : "", 
              detail: "", 
              secret: "" 
            });
          }
        });
      }

      if (newlyFoundNpcs.length > 0) {
        newlyFoundNpcs.forEach(n => {
          const tName = n.name.trim();
          const exists = mergedNpcs.some(cNpc => cNpc.name === tName || cNpc.name.includes(tName) || tName.includes(cNpc.name));
          if (!exists) {
            mergedNpcs.push({
              id: Date.now() + Math.random(),
              name: tName,
              title: n.job || n.title || "등장인물",
              detail: n.detail || "",
              portrait: typeof getPortraitUrl === "function" ? getPortraitUrl(`${tName}, portrait`) : "",
              affection: 0,
              secret: n.secret || "",
              secretRevealed: false
            });
          }
        });
      }
      newSheet.npcs = mergedNpcs;

      // 🌟 [핵심 2: 시간대 페이즈(낮/노을/밤) & 사건 기억 보존]
      newSheet.currentPhase = (typeof phaseMatch !== "undefined" && phaseMatch) ? phaseMatch[1] : (currentPhase || "낮");
      newSheet.recentEvents = (typeof eventMatch !== "undefined" && eventMatch)
        ? [...(recentEvents || []), eventMatch[1]]
        : (recentEvents || []);
     
      // [광기 및 핸드아웃 처리]
      if (parsedData.triggeredMadness) {
        const mObj = parsedData.triggeredMadness;
        setShowInsanityFlash(true);
        setTimeout(() => setShowInsanityFlash(false), 500);
        setActiveMadnessAlert({ name: mObj.name, desc: mObj.desc });
        newSheet.madnessStatus = `광기 발현: ${mObj.name}`;
        
        const cardExists = (newSheet.madnessCards || []).some(c => c.name.includes(mObj.name) || mObj.name.includes(c.name));
        if (!cardExists) {
          newSheet.madnessCards = [...(newSheet.madnessCards || []), { name: mObj.name, desc: mObj.desc, revealed: true, id: Date.now() }];
        } else {
          newSheet.madnessCards = (newSheet.madnessCards || []).map(c => c.name.includes(mObj.name) || mObj.name.includes(c.name) ? { ...c, revealed: true } : c);
        }
      }

      if (parsedData.revealedHandoutTitles && parsedData.revealedHandoutTitles.length > 0) {
        newSheet.handouts = (newSheet.handouts || []).map(h => {
          if (parsedData.revealedHandoutTitles.some(t => h.title.includes(t) || t.includes(h.title))) {
            return { ...h, revealed: true };
          }
          return h;
        });
      }

      if (parsedData.newHandouts && parsedData.newHandouts.length > 0) {
        const added = parsedData.newHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false }));
        newSheet.handouts = [...(newSheet.handouts || []), ...added];
      }

      // [세션 상태 최종 반영]
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        sheet: {
          ...s.sheet,
          ...newSheet,
          hp: s.sheet?.hp ?? newSheet.hp,
          enemyHp: s.sheet?.enemyHp ?? newSheet.enemyHp,
          currentPlot: s.sheet?.currentPlot ?? newSheet.currentPlot,
          enemyPlot: s.sheet?.enemyPlot ?? newSheet.enemyPlot,
          handouts: newSheet.handouts || s.sheet?.handouts,
          npcs: newSheet.npcs || s.sheet?.npcs, // ✨ 새로 계산된 호감도/상메가 정상 저장됩니다!
          rituals: s.sheet?.rituals || newSheet.rituals,
          cycle: newSheet.cycle ?? s.sheet?.cycle,
          scene: newSheet.scene ?? s.sheet?.scene,
          phase: newSheet.phase || s.sheet?.phase,
          actionUsed: s.sheet?.phase === "도입" ? false : (textToSend.includes("장면 닫기") ? false : (s.sheet?.actionUsed ?? false))
        },
        messages: [...updatedMessages, { role: "model", text: cleanText, cg: newlyUnlockedCg || null, contactId: currentContactId, isCall: isDirectCallSpeech, isVoiceCall: isVoiceCallActive, callNpc: voiceCallNpc?.name }],
        suggestedActions: parsedData.suggActions,
        investigationSpots: parsedData.investigationSpots,
        pendingCheck: parsedData.pendingCheck
      } : s));

      if (parsedData.shouldAdvanceScene && activeSession.ruleMode === "insane") {
        advanceInsaneScene(activeSessionId);
      }

    } catch (err) {
      if (err.name === "AbortError") return;
      alert("통신 에러: " + err.message);
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const rollDiceDirectly = (overrideTarget = null, skillName = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true);
    playDiceSound();
    const mode = activeSession.ruleMode;

    const rollInterval = setInterval(() => {
      setRollingDisplayNum(Math.floor(Math.random() * (mode === "coc" ? 100 : 20)) + 1);
    }, 50);

    setTimeout(() => {
      clearInterval(rollInterval);
      let rollFormatted = "";
      if (mode === "insane") {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : 5);
        let outcome = "";

        if (sum === 12) {
          outcome = "✨ 대성공(스페셜)! 이성치/생명력 1점 회복";
          // 12 대성공: 이성치 1점 자동 회복 (최대 6)
          setSessions(prev => prev.map(s => {
            if (s.id !== activeSessionId) return s;
            const curSan = s.sheet?.san ?? 6;
            const maxSan = s.sheet?.maxSan ?? 6;
            return { ...s, sheet: { ...s.sheet, san: Math.min(maxSan, curSan + 1) } };
          }));
        } else if (sum === 2) {
          outcome = "💀 펌블(대실패)! 공포로 인해 미공개 광기 1장 강제 획득";
          drawMadnessCard(activeSessionId, false);
        } else if (sum >= targetVal) {
          outcome = "성공";
        } else {
          outcome = "실패";
        }
        rollFormatted = `[🎲 2D6 판정: ${d1}+${d2}=${sum} / 목표치: ${targetVal}${skillName ? ` (${skillName})` : ""} ➔ 결과: ${outcome}]`;
        
        // 🌟 [추가] 회피 주사위를 굴렸다면 즉시 플레이어 공격/의식 단계로 전환!
        if (skillName?.includes("회피") || (activeSession.sheet?.phase === "클라이맥스" && climaxStep === "dodge")) {
          setClimaxStep("action");
        }
      } else if (mode === "coc") {
        const roll = Math.floor(Math.random() * 100) + 1;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : activeSession.sheet?.san ?? 50);
        let outcome = roll === 1 ? "대성공" : roll <= Math.floor(targetVal / 5) ? "극단적 성공" : roll <= Math.floor(targetVal / 2) ? "어려운 성공" : roll <= targetVal ? "보통 성공" : roll >= 96 ? "대실패" : "실패";
        rollFormatted = `[🎲 CoC 1D100 ${skillName ? `${skillName} ` : ""}판정: ${roll} / 목표치: ${targetVal}% ➔ 결과: ${outcome}]`;
      } else {
        const roll = Math.floor(Math.random() * 20) + 1;
        rollFormatted = `[🎲 판정: 1D20 결과 ${roll}]`;
      }
      setIsRolling(false);
      executeMessage(rollFormatted);
    }, animationEnabled ? 600 : 100);
  };

 // 💊 진통제 복용 함수
  const usePainkiller = () => {
    if (!activeSession || (activeSession.sheet.insaneItems?.painkiller || 0) <= 0) return;
    playDiceSound();
    const healRoll = Math.floor(Math.random() * 6) + 1;
    const curHp = activeSession.sheet.hp || 0;
    const maxHp = activeSession.sheet.maxHp || 6;
    const newHp = Math.min(maxHp, curHp + healRoll);
    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s,
      sheet: {
        ...s.sheet,
        hp: newHp,
        insaneItems: { ...s.sheet.insaneItems, painkiller: s.sheet.insaneItems.painkiller - 1 }
      }
    } : s));
    executeMessage(`[💊 진통제 복용] 고통을 가라앉힙니다. (1D6 ➔ ${healRoll} 회복 / HP: ${curHp} ➔ ${newHp})`);
  };

// ⚔️ 클라이맥스 1~6 플롯 선택 & 선공/버팅 처리
  const executeClimaxPlot = (playerPlot) => {
    if (!activeSession) return;
    playDiceSound?.();
    const enemyPlot = Math.floor(Math.random() * 6) + 1;
    const isButting = playerPlot === enemyPlot;
    let buttingText = "";
    let updatedPlayerHp = activeSession.sheet?.hp ?? 6;
    let updatedEnemyHp = activeSession.sheet?.enemyHp ?? 6;

    // 1) 버팅 발생 시
    if (isButting) {
      updatedPlayerHp = Math.max(0, updatedPlayerHp - 1);
      updatedEnemyHp = Math.max(0, updatedEnemyHp - 1);
      buttingText = `\n💥 [버팅 발생!] 속도(${playerPlot})가 겹쳐 플레이어와 적 모두 생명력 -1 피해!`;
    }

    const orderText = playerPlot > enemyPlot
      ? `⚔️ 플레이어(속도 ${playerPlot}) 선공 ➔ 적(속도 ${enemyPlot}) 후공`
      : playerPlot < enemyPlot
      ? `⚡ 적(속도 ${enemyPlot}) 선공 ➔ 플레이어(속도 ${playerPlot}) 후공`
      : `💥 동시 행동 (버팅)`;

    // 2) 상태 반영
    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s,
      sheet: {
        ...s.sheet,
        hp: updatedPlayerHp,
        enemyHp: updatedEnemyHp,
        currentPlot: playerPlot,
        enemyPlot: enemyPlot
      }
    } : s));

    // 3) 적 선공인 경우 (적 플롯 > 플레이어 플롯)
    if (enemyPlot > playerPlot && !isButting) {
      const ea1 = Math.floor(Math.random() * 6) + 1;
      const ea2 = Math.floor(Math.random() * 6) + 1;
      const enemyHit = (ea1 + ea2) >= 5;

      if (enemyHit) {
        setClimaxStep("dodge");
        const plotMsg = `[⚔️ 클라이맥스 플롯 공개]\n- 내 플롯: [${playerPlot}] (회피 목표치: ${playerPlot + 4})\n- 적의 플롯: [${enemyPlot}]\n- 순서: ${orderText}\n\n⚡ [적 선공 개시!] 괴이가 속도(${enemyPlot}) 우위로 먼저 날카로운 공격을 가해옵니다! (적 명중: ${ea1}+${ea2}=${ea1 + ea2})\n👉 아래 [회피 판정] 버튼을 눌러 공격을 피하십시오!`;
        executeMessage(plotMsg);
        return;
      } else {
        setClimaxStep("action");
        const plotMsg = `[⚔️ 클라이맥스 플롯 공개]\n- 내 플롯: [${playerPlot}] (회피 목표치: ${playerPlot + 4})\n- 적의 플롯: [${enemyPlot}]\n- 순서: ${orderText}\n\n💨 [적 선공 빗나감!] 괴이가 덮쳐왔으나 공격이 허공을 갈랐습니다! (적 명중: ${ea1}+${ea2}=${ea1 + ea2})\n👉 [내 턴] 아래 [기본 공격] 또는 [의식 진행] 버튼을 누르세요.`;
        executeMessage(plotMsg);
        return;
      }
    }

    // 플레이어 선공이거나 버팅인 경우
    setClimaxStep("action");
    const plotMsg = `[⚔️ 클라이맥스 플롯 공개]\n- 내 플롯: [${playerPlot}] (회피 목표치: ${playerPlot + 4})\n- 적의 플롯: [${enemyPlot}]\n- 순서: ${orderText}${buttingText}\n\n👉 [행동 선언 단계] 플롯이 확정되었습니다! 아래 [기본 공격] 또는 [의식 진행] 버튼을 눌러 행동을 선언하세요.`;

    // 🤖 AI에게 아직 적이 쓰러지지 않았음을 명시하는 지시문
    const aiPrompt = `${plotMsg}
[🚨 키퍼 연출 절대 수칙]
- 지금은 턴의 순서(플롯)만 정해진 '대치 단계'입니다. 아직 플레이어의 공격이나 의식이 확정되지 않았습니다.
- ❌ 절대 금지: 적이 쓰러지거나, 소멸하거나, 에필로그/엔딩으로 직행하는 서술.
- ⭕ 허용: 두 인물이 숨을 죽이며 서로를 향해 쇄도하려는 '일촉즉발의 긴장감'만 2문장으로 짧게 서술하십시오.`;

    executeMessage(plotMsg, aiPrompt);
  };

// 🛡️ 플레이어 회피 판정 실행 (2D6 굴림 ➔ 목표치: 내 플롯 + 4)
const executePlayerDodge = () => {
  if (!activeSession) return;
  playDiceSound?.();

  const playerPlot = activeSession.sheet?.currentPlot ?? 3;
  const enemyPlot = activeSession.sheet?.enemyPlot ?? 3;
  const dodgeTarget = playerPlot + 4;

  const pd1 = Math.floor(Math.random() * 6) + 1;
  const pd2 = Math.floor(Math.random() * 6) + 1;
  const dodgeSum = pd1 + pd2;
  const isDodged = dodgeSum >= dodgeTarget;

  let curPlayerHp = activeSession.sheet?.hp ?? 6;
  let text = `[🛡️ 회피 판정 선언]\n- 주사위 2D6: ${pd1}+${pd2}=${dodgeSum} (목표치: ${dodgeTarget})\n`;

  if (isDodged) {
    text += `✨ [회피 성공!] 공격 궤도를 간파하여 피해를 완전히 흘려보냈습니다!`;
  } else {
    curPlayerHp = Math.max(0, curPlayerHp - 1);
    text += `💥 [회피 실패!] 피하지 못하고 1점의 피해를 입었습니다! (내 HP: ${curPlayerHp}/${activeSession.sheet?.maxHp ?? 6})`;
  }

  // 시트 상태 반영
  setSessions(prev => prev.map(s => s.id === activeSessionId ? {
    ...s,
    sheet: { ...s.sheet, hp: curPlayerHp }
  } : s));

  // 적 선공이었으면 회피 후 플레이어의 반격 차례
  if (enemyPlot > playerPlot) {
    setClimaxStep("action");
    text += `\n\n👉 [내 반격 차례] 적의 공격이 끝났습니다. 아래 [기본 공격] 또는 [의식 진행] 버튼을 누르세요.`;
  } else {
    // 후공 반격에 회피한 것이라면 라운드 종료
    setClimaxRound(prev => prev + 1);
    setClimaxStep("plot");
    text += `\n\n🔔 [제 ${climaxRound}라운드 종료] ➔ 제 ${climaxRound + 1}라운드 개막! 새로운 플롯(1~6)을 선택해 주십시오.`;
  }

  executeMessage(text);
};
 
 // 🗝️ 회상 발동 (세션 1회 한정)
  const triggerFlashback = (bonusType) => {
    if (!activeSession || activeSession.sheet?.flashbackUsed) return;
    
    // 시트에 회상 사용 처리 및 다음 판정에 쓸 +3 보너스 저장
    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s,
      sheet: { 
        ...s.sheet, 
        flashbackUsed: true,
        flashbackBonus: 3 // 🌟 다음 판정에 합산할 보너스 저장!
      }
    } : s));

    const secretText = activeSession.sheet?.secret || "감춰둔 진실";
    const bonusText = bonusType === "check" ? "판정 달성치 +3 수정" : "데미지 +1D6 가산";
    executeMessage(`[🗝️ 회상 선언]\n"……${secretText}"\n가슴속 비밀을 밝히며 온 힘을 다합니다. (효과: 다음 판정 달성치 +3 보너스 부여)`);
  };

// 🌟 인세인 핸드아웃 뒤집기 (대화 기록 조사 성공 이력 자동 감지 및 즉시 해금)
  const toggleHandoutReveal = (hId) => {
    if (!activeSession) return;
    const card = (activeSession.sheet?.handouts || []).find(h => h.id === hId);
    if (!card) return;

    // 내 캐릭터 카드인지 판별
    const isPcCard = card.id === "pc_base" || (activeSession.sheet?.name && card.title.includes(activeSession.sheet.name));

    // 🌟 대화창에 '조사 성공'이 찍혀 있는지 이름/직업/카드명으로 자동 대조
    const isInvestigatedInChat = (activeSession.messages || []).some(m =>
      m.text.includes("조사 성공") && (
        m.text.includes(card.title) ||
        (activeSession.sheet?.npcs || []).some(n =>
          (card.title.includes(n.name) || card.overview?.includes(n.title)) &&
          (m.text.includes(n.name) || (n.title && m.text.includes(n.title)))
        )
      )
    );

    // 연결된 NPC의 비밀이 풀렸는지 확인
    const isNpcRevealed = (activeSession.sheet?.npcs || []).some(n =>
      n.secretRevealed && (card.title.includes(n.name) || (n.title && card.overview?.includes(n.title)))
    );

    if (card.revealed || isPcCard || isInvestigatedInChat || isNpcRevealed) {
      const handouts = (activeSession.sheet.handouts || []).map(h => 
        h.id === hId ? { ...h, revealed: true, isFlipped: !h.isFlipped } : h
      );
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, handouts } } : s));
    } else {
      triggerToast("🔒 아직 조사되지 않은 비밀입니다! (조사 판정 성공 시 해금)");
    }
  };

  const parseCocSkills = (skillsStr) => {
    if (!skillsStr) return [];
    return skillsStr.split(",").map(s => {
      const parts = s.trim().split(/\s+/);
      const val = Number(parts[parts.length - 1]);
      const name = parts.slice(0, -1).join(" ");
      return { name: name || s.trim(), val: isNaN(val) ? 50 : val };
    }).filter(s => s.name);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const s = localStorage.getItem("rp_hub_sessions"); if (s) setSessions(JSON.parse(s));
      const d = localStorage.getItem("rp_hub_darkmode"); if (d !== null) setIsDarkMode(d === "true");
      const p = localStorage.getItem("rp_hub_custom_presets"); if (p) setCustomPresets(JSON.parse(p));
      const pal = localStorage.getItem("rp_hub_palette"); if (pal && THEME_PALETTES[pal]) setCurrentPalette(pal);
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try { localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions)); } catch (e) {}
  }, [sessions, isLoaded]);

const lastMsgText = activeSession?.messages?.[activeSession.messages.length - 1]?.text || "";
const isSanCheckDetected = activeSession?.ruleMode === "coc" && !activeSession?.sheet?.madnessStatus && !activeMadnessAlert && (activeSession?.pendingCheck?.skill?.includes("이성") || (activeSession?.messages?.[activeSession.messages.length - 1]?.text || "").includes("산 체크"));

// ☀️ [전 시나리오 공용: 인원수 무제한 범용 멀티 엔딩 엔진]
  const evaluateEnding = (npcs = []) => {
    if (!npcs || npcs.length === 0) {
      return {
        type: "Departure End",
        title: "Normal End: 새로운 길을 향한 발걸음",
        lovers: [],
        others: [],
        theme: "누구에게도 얽매이지 않고 자신의 길을 찾아 담담히 떠나는 결말"
      };
    }

    const sorted = [...npcs].sort((a, b) => (Number(b.affection) || 0) - (Number(a.affection) || 0));
    const activeTargets = sorted.filter(n => (Number(n.affection) || 0) >= 25);

    const top1 = sorted[0];
    const top2 = sorted[1] || null;
    const top1Aff = Number(top1?.affection) || 0;
    const top2Aff = Number(top2?.affection) || 0;

    // 1. 배드 엔딩 (1순위마저 25점 미만이거나 파탄)
    if (top1Aff < 25 || sorted.some(n => Number(n.affection) <= -10)) {
      return {
        type: "Bad End",
        title: "Bad End: 어긋난 시선과 차가운 침묵",
        lovers: [],
        others: sorted.map(n => n.name),
        theme: "핵심 인물과의 신뢰가 무너지고 차가운 단절 속에 남겨진 결말"
      };
    }

    // 2. 단독 1:1 트루 엔딩
    const isSoloTrue = top1Aff >= 75 && (!top2 || (top1Aff - top2Aff >= 20) || top2Aff < 45);
    if (isSoloTrue) {
      return {
        type: "True End",
        title: `True End: ${top1.name}와의 영원한 서약`,
        lovers: [top1.name],
        others: sorted.slice(1).map(n => n.name),
        theme: `${top1.name}와 단둘만의 확고한 연인 관계 성립. 다른 인물들은 본래의 자리로 물러남`
      };
    }

    // 3. 다자연애 공존 엔딩 (주요 대상 전원 60점 이상 & 격차 15 이내)
    const isMultiRomance = activeTargets.length >= 2 && 
      activeTargets.every(n => (Number(n.affection) || 0) >= 60) && 
      (top1Aff - Number(activeTargets[activeTargets.length - 1].affection)) <= 15;

    if (isMultiRomance) {
      const loverNames = activeTargets.map(n => n.name).join(", ");
      return {
        type: "Hidden Poly End",
        title: `Hidden End: 함께 머무는 은밀한 밤`,
        lovers: activeTargets.map(n => n.name),
        others: sorted.filter(n => !activeTargets.some(at => at.name === n.name)).map(n => n.name),
        theme: `주인공과 [${loverNames}] 전원이 깊은 신뢰와 절제된 애정을 바탕으로 이뤄낸 공존`
      };
    }

    // 4. 다각관계 미결착 ➡️ 홀로 엔딩
    const isTorn = top2 && top1Aff >= 50 && top2Aff >= 50 && (top1Aff - top2Aff) <= 15;
    if (isTorn) {
      return {
        type: "Solo End",
        title: `Normal End: 누구의 손도 잡지 못한 채`,
        lovers: [],
        others: sorted.map(n => n.name),
        theme: `${top1.name}와 ${top2.name} 사이의 묘한 기류 속에서 누구도 온전히 선택하지 못하고 홀로 남겨진 결말`
      };
    }

    // 5. 장소를 떠나는 엔딩 (기본 노말)
    return {
      type: "Departure End",
      title: `Normal End: 새로운 길을 향한 발걸음`,
      lovers: [],
      others: sorted.map(n => n.name),
      theme: "특정 인물에게 얽매이지 않고 자신의 새로운 길을 찾아 담담히 떠나는 작별"
    };
  };

  // 실시간 수치 기반 엔딩 판정
  const calculatedEnding = evaluateEnding(activeSession?.sheet?.npcs || []);

  // 엔딩 발생 여부 감지
  const isScenarioEnded = /\[(?:True|Happy|Bad|Dead|Normal|Open|Hidden|Secret)?\s*End[: \]]|완결|막을 내렸다/i.test(lastMsgText);
  const isBadEnding = isScenarioEnded && (calculatedEnding.type === "Bad End" || /Bad\s*End|배드/i.test(lastMsgText));
  const isTrueEnding = isScenarioEnded && (calculatedEnding.type === "True End" || /True\s*End|트루/i.test(lastMsgText));
  const isHiddenEnding = isScenarioEnded && (calculatedEnding.type === "Hidden Poly End" || /Hidden\s*End|히든/i.test(lastMsgText));

  const endingMatch = lastMsgText.match(/\[((?:True|Happy|Bad|Dead|Normal|Open|Hidden|Secret)?\s*End[^\]]*)\]/i);
  const endingTitle = isScenarioEnded ? (endingMatch ? endingMatch[1] : calculatedEnding.title) : calculatedEnding.title;

 // 🌟 [추가] 모바일 뒤로가기(제스처/버튼) 시 앱 종료 방지 및 로비 복귀
  useEffect(() => {
    if (activeSessionId) {
      window.history.pushState({ inSession: true }, "");
    }
  }, [activeSessionId]);

  useEffect(() => {
    const handlePopState = () => {
      // 1. 열려 있는 서랍이나 모달이 있다면 서랍부터 닫기
      if (isPhoneDrawerOpen) {
        setIsPhoneDrawerOpen(false);
        return;
      }
      if (isTabletopOpen) {
        setIsTabletopOpen(false);
        return;
      }
      if (isSheetOpen) {
        setIsSheetOpen(false);
        return;
      }
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
        return;
      }

      // 2. 채팅방에 머물고 있는 상태라면 로비로 퇴장
      if (activeSessionId) {
        setActiveSessionId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeSessionId, isPhoneDrawerOpen, isTabletopOpen, isSheetOpen, isSidebarOpen]);
 
return (
  <div style={{ display: "flex", height: "100dvh", width: "100vw", backgroundColor: theme.bg, color: theme.text, overflow: "hidden", position: "relative" }}>
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

    /* 리디바탕 웹폰트 등록 (모바일 최적화 전자책 명조체) */
      @font-face {
        font-family: 'RIDIBatang';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff') format('woff');
        font-weight: 400;
        font-style: normal;
      }

      /* 전체 UI(버튼, 메뉴 등)는 고딕(프리텐다드) 고정 */
      *, *::before, *::after { box-sizing: border-box; font-family: 'Pretendard', sans-serif; }

      /* 서사 지문 말풍선(.serif-text) 서체 토글 */
      .serif-text, .serif-text * { 
        font-family: ${(fontChoice === "ridi" || fontChoice === "maru" || fontChoice === "serif") ? "'RIDIBatang', serif" : "'Pretendard', sans-serif"} !important; 
        line-height: 1.95; 
        word-break: keep-all; 
        letter-spacing: -0.01em; 
      }

      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-thumb { background: rgba(140, 160, 210, 0.2); border-radius: 4px; }
      .glass-card { background: ${theme.panel}; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid${theme.border}; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border-radius: 18px; }
      .glass-alt { background: ${theme.panelAlt}; backdrop-filter: blur(10px); border: 1px solid${theme.border}; }
      @keyframes diceTumble { 0% { transform: rotate(0deg) scale(0.85); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
      .anim-dice-rolling { animation: diceTumble 0.35s infinite linear; }
      @keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-5px); opacity: 1; } }
      .typing-dot { animation: typingBounce 1.3s infinite ease-in-out; }
    `}</style>

      {/* 🌟 모바일 사이드바 닫기용 터치 영역 */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} 
        />
      )}

     {/* 1. 좌측 사이드바 */}
      <div style={{ 
        position: isMobile ? "fixed" : "relative", 
        zIndex: isMobile ? 50 : 1, 
        left: 0, top: 0, bottom: 0, 
        width: isMobile ? "260px" : (isSidebarOpen ? "260px" : "0px"), 
        minWidth: isMobile ? "260px" : (isSidebarOpen ? "260px" : "0px"), 
        transform: isMobile ? (isSidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: isMobile ? "transform 0.25s ease" : "width 0.25s ease, min-width 0.25s ease", 
        overflow: "hidden", 
        backgroundColor: theme.sidebar, 
        borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", 
        display: "flex", 
        flexDirection: "column", 
        flexShrink: 0,
        boxShadow: isMobile && isSidebarOpen ? "4px 0 20px rgba(0,0,0,0.18)" : "none"
      }}>
        <div style={{ padding: "14px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button onClick={() => { setActiveSessionId(null); if (isMobile) setIsSidebarOpen(false); }} style={{ flex: 1, padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }}>+ 새 시나리오</button>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} style={{ padding: "8px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>✕</button>
          )}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.map((s) => {
            const dateDisplay = s.id ? new Date(s.id).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";
            return (
              <div 
                key={s.id} 
                onClick={() => {
                setActiveSessionId(s.id);
                // ── [세션 불러오기 시 신규 State 복원 (하위 호환 방어)] ──
                setCurrentPhase(s.sheet?.currentPhase || "낮");
                setRecentEvents(s.sheet?.recentEvents || []);
                setLocationCards([]);
                setIncomingCall(null);
                setIsVoiceCallActive(false);

                if (isMobile) setIsSidebarOpen(false);
              }}
                style={{ borderRadius: "10px", cursor: "pointer", marginBottom: "8px", backgroundColor: activeSessionId === s.id ? theme.panelAlt : theme.panel, border: `1px solid ${activeSessionId === s.id ? theme.accent : theme.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                {/* 상단 썸네일 배너 영역 (7:2 ~ 16:9 유동적 높이 자동 대응) */}
                <div style={{ width: "100%", position: "relative", backgroundColor: theme.panelAlt, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={s.thumbnail || "https://cdn.phototourl.com/free/2026-09-13-be3b81ab-c892-4f25-ba89-1bb86ea1518e.jpg"}
                    alt="세션 카드"
                    style={{
                      width: "100%",
                      height: "auto",
                      minHeight: "75px",
                      maxHeight: "185px",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block"
                    }}
                  />

  {/* 🌟 클릭 시 컴퓨터 파일 선택 창 바로 열림 */}
  <label 
    onClick={(e) => e.stopPropagation()} 
    title="내 컴퓨터에서 세션 카드 이미지 선택"
    style={{ position: "absolute", top: "6px", right: "6px", backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", borderRadius: "4px", padding: "3px 6px", fontSize: "0.7rem", cursor: "pointer", zIndex: 2 }}
                  >
                    ✏️
                    <input type="file" accept="image/*" onChange={(e) => handleSessionCardUpload(s.id, e)} style={{ display: "none" }} />
                  </label>
                </div>

              {/* 하단 정보 영역 */}
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "4px" }}>
                      <div style={{ fontWeight: "700", fontSize: "0.82rem", color: theme.text }}>{s.title}</div>
                      <div style={{ fontSize: "0.68rem", color: theme.textMuted }}>{s.ruleMode?.toUpperCase()}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm("이 세션을 삭제하시겠습니까?")) setSessions(sessions.filter(it => it.id !== s.id)); }} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "2px", fontSize: "0.75rem" }}>🗑️</button>
                  </div>

                  {/* 하단 날짜 + 🔄 동기화 버튼 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.65rem", color: theme.textMuted, marginTop: "4px", borderTop: `1px dashed ${theme.border}`, paddingTop: "4px" }}>
                    <div>{dateDisplay ? `🕒 ${dateDisplay}` : ""}</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSessionId(s.id);
                        handleSyncCurrentSheet();
                      }}
                      title="시트 최신 데이터 동기화"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0 2px",
                        fontSize: "0.75rem",
                        lineHeight: 1,
                        opacity: 0.7,
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
                    >
                      🔄
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
       {/* ⚙️ 좌측 사이드바 하단 버튼 (환경설정 & 데이터 관리) */}
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "6px", backgroundColor: theme.sidebar, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => openModal(setShowSettingsModal)}
            style={{
              width: "100%",
              padding: "8px 10px",
              backgroundColor: theme.panelAlt,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              color: theme.text,
              fontSize: "0.78rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>⚙️</span>
            <span>환경 설정</span>
          </button>

          <button
            type="button"
            onClick={() => openModal(setShowExportModal)}
            style={{
              width: "100%",
              padding: "8px 10px",
              backgroundColor: theme.panelAlt,
              border: `1px solid ${theme.border}`,
              borderRadius: "8px",
              color: theme.text,
              fontSize: "0.78rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>💾</span>
            <span>데이터 관리</span>
          </button>
        </div>
      </div>

  {/* 🌟 모바일 시트 열렸을 때 바깥 누르면 닫히는 어두운 배경 */}
      {isMobile && isSheetOpen && (
        <div 
          onClick={() => setIsSheetOpen(false)} 
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} 
        />
      )}

    {/* 2. 중앙 메인 뷰 (키보드 천장 고정 & 스크롤 간섭 완벽 차단) */}
      <div 
        onTouchStart={(e) => {
          setTouchStartX(e.touches[0].clientX);
        }}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const diff = e.changedTouches[0].clientX - touchStartX;
          // 오른쪽에서 왼쪽으로 75px 이상 확실히 밀었을 때만 시트 열기
          if (diff < -75 && !isSheetOpen) setIsSheetOpen(true);
          setTouchStartX(null);
        }}
        style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", height: "100%" }}
      >
        {/* 상단 단일 헤더 바 (키보드가 열려도 도망가지 않게 sticky 고정!) */}
        <div style={{ position: "sticky", top: 0, zIndex: 30, height: "54px", padding: isMobile ? "0 10px" : "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebar, flexShrink: 0 }}>
          
          {/* 좌측: 메뉴 + 제목 */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px", minWidth: 0, flex: 1, paddingRight: "6px" }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: theme.text, padding: "4px", display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              ☰
            </button>
            
            {activeSession && activeSession.ruleMode === "dating_msg" ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${theme.border}`, flexShrink: 0 }}>
                  <img 
                    src={(activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId)?.portrait || activeSession.sheet?.npcs?.[0]?.portrait} 
                    alt="상대" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
                <div style={{ minWidth: 0, overflow: "hidden" }}>
                  <div style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.text, display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                    {(activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId)?.name || activeSession.sheet?.npcs?.[0]?.name || "상대방"}
                    <span style={{ fontSize: "0.6rem", color: "#62d681", fontWeight: "700" }}>●</span>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {(activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId)?.title || activeSession.sheet?.npcs?.[0]?.title || "1:1 대화"}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }}>
                <span style={{ fontWeight: "800", fontSize: isMobile ? "0.85rem" : "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "110px" : "220px" }}>

                  {activeSession ? activeSession.title : "로비 (세션 생성)"}
                </span>
{/* 🕒 5단계 시간대 연동 배지 (새벽 / 아침 / 낮 / 저녁 / 밤) */}
            {activeSession && (() => {
              const curPhase = currentPhase || activeSession?.currentPhase || "낮";
              
              // 5가지 시간대별 아이콘 및 테마 색상 지정
              const phaseTheme = {
                "새벽": { icon: "🌌", bg: "#1e1b4b", color: "#c7d2fe" },
                "아침": { icon: "🌅", bg: "#431407", color: "#fed7aa" },
                "낮":   { icon: "☀️", bg: "#1e3a5f", color: "#93c5fd" },
                "저녁": { icon: "🌆", bg: "#4a2818", color: "#fdba74" },
                "노을": { icon: "🌆", bg: "#4a2818", color: "#fdba74" },
                "밤":   { icon: "🌙", bg: "#2d1b4e", color: "#d8b4fe" },
              }[curPhase] || { icon: "☀️", bg: "#1e3a5f", color: "#93c5fd" };

              return (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  padding: "2px 7px",
                  borderRadius: "10px",
                  backgroundColor: phaseTheme.bg,
                  color: phaseTheme.color,
                  fontWeight: "bold",
                  flexShrink: 0,
                }}>
                  <span>{phaseTheme.icon}</span>
                  <span>{curPhase}</span>
                </div>
              );
            })()}
             
                {activeSession && activeSession.ruleMode === "insane" && (
                  <span style={{ 
                    padding: "2px 7px", 
                    backgroundColor: activeSession.sheet?.phase === "클라이맥스" || activeSession.sheet?.phase === "마스터씬" 
                      ? "rgba(214, 56, 87, 0.2)" 
                      : activeSession.sheet?.phase === "도입" 
                      ? "rgba(0, 183, 211, 0.2)" 
                      : "rgba(229, 169, 60, 0.15)", 
                    border: `1px solid ${
                      activeSession.sheet?.phase === "클라이맥스" || activeSession.sheet?.phase === "마스터씬" 
                        ? theme.danger 
                        : activeSession.sheet?.phase === "도입" 
                        ? theme.accent 
                        : theme.warning
                    }`, 
                    borderRadius: "6px", 
                    fontSize: "0.68rem", 
                    color: activeSession.sheet?.phase === "클라이맥스" || activeSession.sheet?.phase === "마스터씬" 
                      ? theme.danger 
                      : activeSession.sheet?.phase === "도입" 
                      ? theme.accent 
                      : theme.warning, 
                    fontWeight: "800", 
                    whiteSpace: "nowrap", 
                    flexShrink: 0 
                  }}>
                    {activeSession.sheet?.phase === "도입" 
                      ? "🎬 도입 페이즈" 
                      : activeSession.sheet?.phase === "마스터씬" 
                      ? "⚠️ 마스터 씬" 
                      : activeSession.sheet?.phase === "클라이맥스" 
                      ? "⚔️ 클라이맥스" 
                      : (isMobile 
                          ? `${activeSession.sheet?.cycle || 1}C/${activeSession.sheet?.scene || 1}S` 
                          : `${activeSession.sheet?.cycle || 1}C / ${activeSession.sheet?.scene || 1}S (L:${activeSession.sheet?.limit || 4})`
                        )}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 우측 액션 아이콘 바 (모든 버튼 높이 34px로 정돈) */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "3px" : "5px", flexShrink: 0 }}>
            
            {/* 1. 📱 스마트폰 메신저 */}
            {activeSession && (activeSession.ruleMode?.startsWith("dating") || activeSession.ruleMode?.includes("free")) && (() => {
              const phoneChats = activeSession.sheet?.phoneChats || {};
              let unreadCount = 0;
              Object.values(phoneChats).forEach(msgs => {
                unreadCount += (msgs || []).filter(m => m.unread).length;
              });
              return (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSheetOpen(false);
                    setActivePhoneContactId(null);
                    setIsPhoneDrawerOpen(!isPhoneDrawerOpen);
                    triggerVibration("light");
                  }}
                  title="스마트폰 메신저 열기"
                  style={{
                    position: "relative",
                    height: isMobile ? "34px" : "36px",
                    width: isMobile ? "34px" : "36px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isPhoneDrawerOpen ? "rgba(0,0,0,0.08)" : "none",
                    border: isPhoneDrawerOpen ? `1px solid ${theme.border}` : "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: 0,
                    flexShrink: 0
                  }}
                >
                  <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>📱</span>
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      backgroundColor: theme.danger,
                      color: "#fff",
                      borderRadius: "10px",
                      minWidth: "15px",
                      height: "15px",
                      padding: "0 3px",
                      fontSize: "0.58rem",
                      fontWeight: "800",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })()}

            {/* 2. 🃏 테이블탑 핸드아웃 버튼 (흰 배경 없는 깔끔한 플랫 스타일) */}
            {activeSession && activeSession.ruleMode === "insane" && (
              <button 
                type="button"
                onClick={() => setIsTabletopOpen(!isTabletopOpen)}
                title="테이블탑 핸드아웃 & 광기 덱 열기"
                style={{
                  height: isMobile ? "34px" : "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  padding: isMobile ? "0 6px" : "0 8px",
                  background: isTabletopOpen ? "rgba(214, 56, 87, 0.12)" : "none",
                  border: isTabletopOpen ? `1.5px solid ${theme.danger}` : "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: isTabletopOpen ? theme.danger : theme.text,
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>🃏</span>
                <span style={{ fontSize: "0.72rem", fontWeight: "800", lineHeight: 1 }}>
                  핸드아웃
                </span>
              </button>
            )}

            {/* 3. 🎲 주사위 버튼 (글자 빼고 아이콘만 깔끔하게 규격화) */}
            {activeSession && (activeSession.ruleMode === "coc" || activeSession.ruleMode === "insane") && (
              <button
                type="button"
                onClick={() => rollDiceDirectly()}
                title={activeSession.ruleMode === "coc" ? "1D100 주사위 굴리기" : "2D6 주사위 굴리기"}
                style={{
                  height: isMobile ? "34px" : "36px",
                  width: isMobile ? "34px" : "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>🎲</span>
              </button>
            )}

            {/* 4. 👤 정보 / 📋 시트 버튼 */}
            {activeSession && (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPhoneDrawerOpen(false);
                  setIsSheetOpen(!isSheetOpen);
                }} 
                title="캐릭터 시트 및 정보" 
                style={{ 
                  height: isMobile ? "34px" : "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  padding: isMobile ? "0 6px" : "0 8px",
                  background: isSheetOpen ? "rgba(0,0,0,0.08)" : "none",
                  border: isSheetOpen ? `1.5px solid ${theme.accent}` : "none",
                  borderRadius: "8px",
                  color: isSheetOpen ? theme.accent : theme.text,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>
                  {activeSession.ruleMode?.startsWith("dating") ? "👤" : "📋"}
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: "800", lineHeight: 1 }}>
                  {activeSession.ruleMode?.startsWith("dating") ? "정보" : "시트"}
                </span>
              </button>
            )}

            {/* 5. 📢 공지 버튼 (로비에서만) */}
            {!activeSession && (
              <button 
                onClick={() => { setActiveNoticeTab("update"); openModal(setShowNoticeModal); }} 
                title="이용 가이드 및 패치 노트" 
                style={{ 
                  height: isMobile ? "34px" : "36px", 
                  width: isMobile ? "34px" : "36px", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  padding: 0, 
                  flexShrink: 0 
                }}
              >
                <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>📢</span>
              </button>
            )}

            {/* 6. 🌙 / ☀️ 다크모드 토글 */}
            <button 
              onClick={handleToggleDarkMode} 
              title="다크 모드 전환"
              style={{ 
                height: isMobile ? "34px" : "36px", 
                width: isMobile ? "34px" : "36px", 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center", 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                padding: 0, 
                flexShrink: 0 
              }}
            >
              <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>
                {isDarkMode ? "☀️" : "🌙"}
              </span>
            </button>

          </div>
        </div>

        {!activeSession ? (
          /* 로비 화면 */
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 100px 14px" : "28px 24px 80px 24px", maxWidth: "860px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* 로비 헤더: 글자 꺾임 방지 */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ minWidth: "160px", flex: 1 }}>
                <h1 className="serif-text" style={{ margin: "0 0 4px 0", fontSize: isMobile ? "1.45rem" : "1.75rem", fontWeight: "800", color: theme.text }}>새로운 서사의 시작</h1>
                <div style={{ fontSize: "0.78rem", color: theme.textMuted }}>룰과 장르를 선택하면 AI 마스터가 세계를 구축합니다.</div>
              </div>
              
              <div style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "flex-end", flexShrink: 0 }}>
                {/* 1. ⭐ 공식 시나리오 버튼 */}
                <button 
                  type="button" 
                  onClick={() => {
                    setLobbyPresetTab("public");
                    openModal(setShowLobbyPresetModal);
                  }} 
                  title="공식 추천 시나리오 둘러보기"
                  style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: isMobile ? "5px 9px" : "6px 12px",
                    backgroundColor: theme.panelAlt,
                    border: `1.5px solid ${theme.accent}`,
                    borderRadius: "20px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    whiteSpace: "nowrap"
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>⭐</span>
                  <span style={{ fontSize: isMobile ? "0.74rem" : "0.8rem", fontWeight: "800", color: theme.text, whiteSpace: "nowrap" }}>
                    공식 시나리오
                  </span>
                  <span style={{
                    backgroundColor: theme.danger || "#d63857",
                    color: "#ffffff",
                    fontSize: "0.6rem",
                    fontWeight: "900",
                    padding: "1px 5px",
                    borderRadius: "10px",
                    lineHeight: 1.2
                  }}>
                    HOT
                  </span>
                </button>

                {/* 2. 📁 불러오기 버튼 */}
                <button 
                  type="button" 
                  onClick={() => {
                    setLobbyPresetTab("local");
                    openModal(setShowLobbyPresetModal);
                  }} 
                  title="로비 세팅 불러오기"
                  style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    fontSize: "1.25rem", 
                    padding: "4px",
                    lineHeight: 1
                  }}
                >
                  📁
                </button>

                {/* 3. 💾 저장 버튼 */}
                <button 
                  type="button" 
                  onClick={handleSaveLobbyPreset} 
                  title="현재 세팅 저장"
                  style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    fontSize: "1.25rem", 
                    padding: "4px",
                    lineHeight: 1
                  }}
                >
                  💾
                </button>
              </div>
            </div>

         {/* 1. 룰 시스템 선택 */}
<div className="glass-card" style={{ padding: "20px" }}>
  {/* 제목과 버튼 한 줄 배치 */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
    <span style={{ fontSize: "0.9rem", fontWeight: "800" }}>
      1. 룰 시스템 선택
    </span>

    <button
      type="button"
      onClick={() => setIsTutorialModalOpen(true)}
      title="CoC / 인세인 기초 3분 조작 튜토리얼"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 9px",
        fontSize: "0.75rem",
        fontWeight: "700",
        color: "#d97706",
        backgroundColor: "rgba(245, 158, 11, 0.12)",
        border: "1px solid rgba(245, 158, 11, 0.35)",
        borderRadius: "20px",
        cursor: "pointer"
      }}
    >
      <span>🔰</span>
      <span>3분 튜토리얼</span>
</button>
  </div>

  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "10px" }}>
    {[
      {
        key: "freeform",
        name: "자유 서사",
                    sub: "주사위 없이 즐기는 서사",
                    badge: "순수 텍스트",
                    icon: "✍️",
                    points: [
                      { title: "핵심 판정", desc: "주사위 판정과 스탯 계산이 배제된 순수 텍스트 인터랙티브 소설 모드입니다." },
                      { title: "자유로운 진행", desc: "기계적인 행동 지시문 없이 인물의 호흡과 대사, 감각적인 묘사의 여운으로 이어집니다." },
                      { title: "추천 분위기", desc: "주사위 실패 스트레스 없이 두 사람의 감정선, 달달한 일상, 자유로운 티키타카에 적합합니다." }
                    ]
                  },
                  {
                    key: "coc",
                    name: "크툴루의 부름 (CoC)",
                    sub: "1D100 기반 탐색과 공포",
                    badge: "1D100 다이스",
                    icon: "🐙",
                    points: [
                      { title: "핵심 판정", desc: "1D100(백분율) 다이스를 굴려 수치 이하가 나오면 성공하는 직관적 시스템입니다." },
                      { title: "이성 & 광기", desc: "괴이한 진실을 목격하면 이성(SAN)을 상실하며, 수치 급감 시 1D10 일시적 광기가 발현됩니다." },
                      { title: "추천 분위기", desc: "단서를 추적하는 수사물, 진실을 파헤치는 스릴과 긴장감 넘치는 상호 구원에 적합합니다." }
                    ]
                  },
                  {
                    key: "insane",
                    name: "인세인 (inSANe)",
                    sub: "비밀과 광기의 보드게임",
                    badge: "2D6 사이클",
                    icon: "🎲",
                    points: [
                      { 
                        title: "왜 특기를 6개 고르나요? (66개 매트릭스의 원리)", 
                        desc: "인세인은 폭력·정서·지각·기술·지식·괴이 6개 분야(총 66개 특기)로 이루어진 표를 사용합니다. 캐릭터는 자신의 과거와 개성을 상징하는 특기를 딱 '6개' 습득하여 자신만의 전문 영역을 구축합니다." 
                      },
                      { 
                        title: "특기의 핵심 역할: 대용 판정과 갭(Gap)", 
                        desc: "상황에 딱 맞는 특기를 배웠다면 2D6 주사위 목표치가 기본 '5'로 낮아져 쉽게 성공합니다! 반면 배우지 않은 특기 행동을 할 때는, 내가 배운 가장 가까운 특기로 '대용 판정'을 시도합니다. 이때 표에서 떨어진 칸수(거리)만큼 목표치가 1씩 올라가 판정이 아슬아슬해집니다." 
                      },
                      { 
                        title: "호기심과 공포심", 
                        desc: "호기심 분야의 특기는 거리에 따른 난이도 페널티를 1 줄여주며, 반대로 공포심에 지정된 특기 상황에 직면하면 이성을 잃고 광기 카드를 뽑게 됩니다." 
                      },
                      { 
                        title: "비밀과 사명 (서스펜스)", 
                        desc: "모든 인물이 겉으로 드러난 '사명'과 숨겨둔 치명적인 '비밀'을 지니고 서로의 마음과 약점을 파고듭니다." 
                      }
                    ]
                  },
                  {
                    key: "dating",
                    name: "미연시",
                    sub: "선택지와 관계성 중심 서사",
                    badge: "호감도 & 심리",
                    icon: "🌸",
                    points: [
                      { title: "핵심 판정", desc: "주사위 판정 대신 감정선에 따른 선택지와 대화의 맥락으로 서사가 전개됩니다." },
                      { title: "관계와 심리", desc: "물리적 능력치 대신 인물의 실시간 심리 상태와 단계별 호감도(Affection)가 중심이 됩니다." },
                      { title: "2가지 서브 모드", desc: "3지선다 선택지가 주어지는 '소설형(비주얼 노벨)'과 빠른 티키타카의 '문자형(메신저)'을 지원합니다." }
                    ]
                  }
                ].map((item) => {
                  const isSelected = wizardMode === item.key;

                  return (
                    <div
                      key={item.key}
                      onClick={() => setWizardMode(item.key)}
                      style={{
                        padding: "16px 14px",
                        borderRadius: "12px",
                        border: `1.5px solid ${isSelected ? "#4a4947" : theme.border}`,
                        backgroundColor: isSelected ? theme.panelAlt : "transparent",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRuleHelpModal(item);
                        }}
                        title={`${item.name} 상세 규칙 보기`}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.panel,
                          color: theme.textMuted,
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                        }}
                      >
                        ?
                      </button>

                      <div style={{ fontWeight: "800", fontSize: "0.88rem", color: theme.text, paddingRight: "24px", wordBreak: "keep-all" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "4px", wordBreak: "keep-all" }}>
                        {item.sub}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. 장르 톤 */}
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "4px", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: "800" }}>2. 장르 톤 (서사 지향 태그)</span>
                <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>태그가 룰의 분위기를 완전히 지배합니다.</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                {[...ORIENT_TAGS, ...TROPE_TAGS].map(tag => {
                  const active = playPreference.includes(tag);
                  return (
                    <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "5px 12px", borderRadius: "16px", fontSize: "0.76rem", fontWeight: active ? "700" : "500", backgroundColor: active ? "#52504c" : "transparent", color: active ? "#fff" : theme.text, border: `1px solid ${active ? "#52504c" : theme.border}`, cursor: "pointer" }}>{tag}</button>
                  );
                })}
              </div>
              <textarea value={playPreference} onChange={e => setPlayPreference(e.target.value)} placeholder="#GL #쌍방구원 #달달" style={{ width: "100%", height: "55px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "0.82rem", resize: "none" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
              
              {/* 내 프로필 */}
              <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                    {wizardMode.startsWith("dating") ? "내 프로필 (주인공)" : "내 프로필 (PC)"}
                  </span>
                  <button onClick={() => openModal(setShowPresetModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {isMobile ? "📁 프리셋" : "📁 프리셋 불러오기"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div onClick={() => { setActivePortraitTarget("pc"); openModal(setShowPortraitEditModal); }} style={{ width: "64px", height: "64px", borderRadius: "50%", border: `1.5px dashed ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                    {charPortraitUrl ? <img src={charPortraitUrl} alt="PC" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>초상화</span>}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <input type="text" value={charName} onChange={e => setCharName(e.target.value)} placeholder="이름" style={{ padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem" }} />
                    <input 
                      type="text" 
                      value={charJob} 
                      onChange={e => setCharJob(e.target.value)} 
                      placeholder={wizardMode.startsWith("dating") ? "매력 키워드 / 포지션 (예: 다정함, 연하)" : "직업/역할"} 
                      style={{ padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem" }} 
                    />
                  </div>
                </div>

                <textarea 
                  value={charBackground} 
                  onChange={e => setCharBackground(e.target.value)} 
                  placeholder={wizardMode.startsWith("dating") ? "성격, 취향, 평소 태도 및 분위기..." : "백스토리 및 성격..."} 
                  style={{ width: "100%", height: "70px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem", resize: "none" }} 
                />

                <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "8px" }}>
                  <button type="button" onClick={() => setShowCharSecret(!showCharSecret)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.75rem", fontWeight: "600" }}>
                    {showCharSecret 
                      ? (wizardMode.startsWith("dating") ? "🔒 속마음 닫기" : "🔒 내 비밀 닫기") 
                      : (wizardMode.startsWith("dating") ? "👀 상대에게 숨긴 진짜 진심/고민 (Secret)" : "👀 내 캐릭터의 숨겨진 비밀 (인세인/사명)")}
                  </button>
                  {showCharSecret && (
                    <textarea 
                      value={charSecret} 
                      onChange={e => setCharSecret(e.target.value)} 
                      placeholder={wizardMode.startsWith("dating") ? "상대에게 털어놓지 못했던 남모를 상처나 숨겨둔 진심..." : "숨겨진 진짜 목적이나 과거"} 
                      style={{ width: "100%", height: "55px", marginTop: "6px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.danger, fontSize: "0.8rem", resize: "none" }} 
                    />
                  )}
                </div>
              </div>

{/* 등장인물 (KPC / 히로인) */}
              <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.95rem" }}>
                      {wizardMode.startsWith("dating") ? "히로인 / 공략 상대" : "등장인물 (KPC)"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: theme.textMuted, backgroundColor: theme.panelAlt, padding: "2px 8px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                      {kpcList.length}명
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setKpcList([...kpcList, { id: Date.now(), name: "", job: "", detail: "", secret: "", portraitUrl: "", showSecret: false }])} 
                    style={{ padding: "5px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", color: theme.text }}
                  >
                    + 인물 추가
                  </button>
                </div>

                {/* 넉넉한 높이 확보 (좌측 PC 카드와 시각적 밸런스 유지) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1, overflowY: "auto", maxHeight: "390px", paddingRight: "4px" }}>
                  {kpcList.map((kpc) => (
                    <div 
                      key={kpc.id} 
                      style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "10px", 
                        border: `1px solid ${theme.border}`, 
                        backgroundColor: theme.panelAlt ? `${theme.panelAlt}40` : "rgba(255,255,255,0.02)",
                        padding: "14px", 
                        borderRadius: "10px", 
                        position: "relative" 
                      }}
                    >
                      {/* 삭제 버튼 */}
                      {kpcList.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => setKpcList(kpcList.filter(it => it.id !== kpc.id))} 
                          style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: "1rem", lineHeight: "1", padding: "2px" }}
                          title="인물 삭제"
                        >
                          ✕
                        </button>
                      )}

                      {/* 1. 프로필 이미지 + 이름/직업 (가로 비율 최적화) */}
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div 
                          onClick={() => { setActivePortraitTarget(kpc.id); openModal(setShowPortraitEditModal); }} 
                          style={{ width: "52px", height: "52px", borderRadius: "50%", border: `1.5px dashed ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
                          title="사진 변경"
                        >
                          {kpc.portraitUrl ? (
                            <img src={kpc.portraitUrl} alt={kpc.name || "KPC"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>사진</span>
                          )}
                        </div>

                        <div style={{ flex: 1, display: "flex", gap: "8px", paddingRight: kpcList.length > 1 ? "24px" : "0" }}>
                          {/* 이름: 40% 비율, 조금 더 굵은 폰트 */}
                          <input 
                            type="text" 
                            value={kpc.name} 
                            onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, name: e.target.value } : k))} 
                            placeholder={wizardMode.startsWith("dating") ? "이름" : "이름"} 
                            style={{ width: "42%", padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem", fontWeight: "700" }} 
                          />
                          {/* 직업/신분: 58% 비율로 넉넉하게 노출 */}
                          <input 
                            type="text" 
                            value={kpc.job} 
                            onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, job: e.target.value } : k))} 
                            placeholder={wizardMode.startsWith("dating") ? "관계 / 신분 (예: 공작 영애)" : "역할 / 직업 (예: 주연 배우)"} 
                            style={{ width: "58%", padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem" }} 
                          />
                        </div>
                      </div>

                      {/* 2. 외모 및 성격 상세 설정 (textarea로 변경하여 3줄 전체가 보이도록 개선) */}
                      <div>
                        <textarea 
                          rows={3}
                          value={kpc.detail} 
                          onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, detail: e.target.value } : k))} 
                          placeholder={wizardMode.startsWith("dating") ? "외모, 매력적인 특징, 나와의 미묘한 관계성..." : "외모, 성격, PC와의 관계"} 
                          style={{ 
                            width: "100%", 
                            boxSizing: "border-box",
                            padding: "8px 10px", 
                            backgroundColor: theme.inputBg, 
                            border: `1px solid ${theme.border}`, 
                            borderRadius: "6px", 
                            color: theme.text, 
                            fontSize: "0.82rem",
                            lineHeight: "1.45",
                            resize: "vertical"
                          }} 
                        />
                      </div>
                      
                      {/* 3. 비밀/진심 토글 버튼 */}
                      <button 
                        type="button" 
                        onClick={() => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, showSecret: !k.showSecret } : k))} 
                        style={{ 
                          width: "100%", 
                          padding: "7px", 
                          backgroundColor: kpc.showSecret ? `${theme.danger}15` : theme.panelAlt, 
                          border: `1px solid ${kpc.showSecret ? theme.danger : theme.border}`, 
                          borderRadius: "6px", 
                          color: kpc.showSecret ? theme.danger : theme.text, 
                          cursor: "pointer", 
                          fontSize: "0.75rem", 
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        {kpc.showSecret 
                          ? (wizardMode.startsWith("dating") ? "🔒 속마음 닫기" : "🔒 비밀 닫기") 
                          : (wizardMode.startsWith("dating") ? "👀 숨겨진 진심 / 약점 열람" : "👀 이 인물의 비밀 열람 및 수정")}
                      </button>

                      {/* 4. 열린 비밀/속마음 텍스트 영역 */}
                      {kpc.showSecret && (
                        <textarea 
                          rows={3}
                          value={kpc.secret} 
                          onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, secret: e.target.value } : k))} 
                          placeholder={wizardMode.startsWith("dating") ? "당신에게 쉽게 드러내지 않는 진짜 속마음이나 약점..." : "숨겨진 진심이나 비밀"} 
                          style={{ 
                            width: "100%", 
                            boxSizing: "border-box",
                            padding: "8px 10px", 
                            backgroundColor: theme.inputBg, 
                            border: `1px solid ${theme.danger}`, 
                            borderRadius: "6px", 
                            color: theme.danger, 
                            fontSize: "0.8rem", 
                            lineHeight: "1.4", 
                            resize: "vertical" 
                          }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CoC 스탯 블록 */}
            {wizardMode === "coc" && (
              <div className="glass-card" style={{ padding: "20px", border: `1.5px solid ${theme.danger}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.9rem", color: theme.danger }}>CoC 7판 특성치 (460 pt) & 주요 기능치(Skill) 설정</span>
                  <button onClick={handleRandomCocStats} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.accent, fontSize: "0.74rem", cursor: "pointer", fontWeight: "700" }}>🎲 460pt 자동 분배</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "10px" }}>
                  {[{ k: "str", l: "근력" }, { k: "con", l: "건강" }, { k: "siz", l: "크기" }, { k: "dex", l: "민첩" }, { k: "app", l: "외모" }, { k: "int", l: "지능" }, { k: "pow", l: "정신" }, { k: "edu", l: "교육" }].map(s => (
                    <div key={s.k}>
                      <label style={{ fontSize: "0.7rem", color: theme.textMuted }}>{s.l}</label>
                      <input type="number" min="15" max="90" value={cocStats[s.k]} onChange={e => setCocStats({ ...cocStats, [s.k]: Number(e.target.value) })} style={{ width: "100%", padding: "5px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem", textAlign: "center" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "12px", borderBottom: `1px dashed ${theme.border}`, paddingBottom: "8px" }}>
                  <span>잔여 포인트: <strong style={{ color: remainingPoints < 0 ? theme.danger : theme.success }}>{remainingPoints} pt</strong></span>
                  <span>행운: <input type="number" value={cocStats.luck} onChange={e => setCocStats({ ...cocStats, luck: Number(e.target.value) })} style={{ width: "45px", padding: "2px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", textAlign: "center" }} /></span>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>추가 보유 기능치 (Skill):</label>
                  <input type="text" value={cocSkills} onChange={e => setCocSkills(e.target.value)} placeholder="예: 관찰력 60, 자료조사 50, 듣기 40, 심리학 50" style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem" }} />
                  <div style={{ fontSize: "0.68rem", color: theme.textMuted, marginTop: "4px" }}>※ 시트에서 이 기능치들을 원클릭 1D100 주사위로 즉시 굴릴 수 있습니다.</div>
                </div>
              </div>
            )}

            {/* 인세인 특기표 블록 */}
            {wizardMode === "insane" && (
              <div className="glass-card" style={{ padding: "20px", border: `1.5px solid ${theme.warning}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.9rem", color: theme.warning }}>인세인 특기표 매트릭스 (HP 6 / SAN 6)</span>
                  <label style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.warning }}>
                    리미트: <input type="number" min="2" max="5" value={insaneLimit} onChange={e => setInsaneLimit(Number(e.target.value))} style={{ width: "45px", padding: "2px 6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.warning}`, borderRadius: "4px", color: theme.text, textAlign: "center" }} /> 사이클
                  </label>
                </div>
                
                <div style={{ overflowX: "auto", paddingBottom: "6px", marginBottom: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", minWidth: "480px", gap: "4px" }}>
                    {INSANE_MATRIX.map(col => (
                      <div key={col.category} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: "800", padding: "4px 0", backgroundColor: theme.panelAlt, borderRadius: "4px" }}>{col.category}</div>
                        {col.skills.map(skill => {
                          const isSel = insaneSkills.includes(skill);
                          return (
                            <button key={skill} type="button" onClick={() => toggleInsaneSkill(skill)} style={{ padding: "4px 0", fontSize: "0.68rem", backgroundColor: isSel ? theme.warning : theme.inputBg, color: isSel ? "#000" : theme.text, border: `1px solid ${isSel ? theme.warning : theme.border}`, borderRadius: "4px", cursor: "pointer", fontWeight: isSel ? "800" : "400" }}>{skill}</button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <label style={{ flex: 1, fontSize: "0.78rem" }}>호기심 분야:
                    <select value={insaneCuriosity} onChange={e => setInsaneCuriosity(e.target.value)} style={{ width: "100%", padding: "6px", marginTop: "2px", backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px" }}>
                      {INSANE_MATRIX.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                    </select>
                  </label>
                  <label style={{ flex: 1, fontSize: "0.78rem" }}>공포심 특기:
                    <input type="text" value={insaneFear} onChange={e => setInsaneFear(e.target.value)} placeholder="예: 죽음, 피" style={{ width: "100%", padding: "6px", marginTop: "2px", backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px" }} />
                  </label>
                </div>
                {/* 🎒 [인세인 초기 소지 아이템 선택기] */}
    <div style={{ marginTop: "12px", borderTop: `1px dashed ${theme.border}`, paddingTop: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent }}>
          🎒 초기 소지 아이템 선택 (최대 2개)
        </span>
        <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>
          선택: <strong style={{ color: Object.values(insaneItems).reduce((a, b) => a + b, 0) === 2 ? theme.success || "#4ade80" : theme.accent }}>
            {Object.values(insaneItems).reduce((a, b) => a + b, 0)}
          </strong> / 2개
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[
          { name: "진통제", icon: "💊", desc: "생명력 또는 이성치 1점 회복" },
          { name: "무기", icon: "⚔️", desc: "전투 중 자신의 판정 재굴림" },
          { name: "부적", icon: "🧿", desc: "타인의 판정 주사위 재굴림" }
        ].map(item => {
          const count = insaneItems[item.name] || 0;
          return (
            <div
              key={item.name}
              style={{
                backgroundColor: count > 0 ? "rgba(234, 179, 8, 0.08)" : theme.panelAlt,
                border: `1px solid ${count > 0 ? theme.accent : theme.border}`,
                borderRadius: "8px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.78rem", color: count > 0 ? theme.accent : theme.text, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <div style={{ fontSize: "0.65rem", color: theme.textMuted, marginTop: "4px", lineHeight: "1.3" }}>
                  {item.desc}
                </div>
              </div>

              {/* 수량 조절 버튼 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleItemCountChange(item.name, -1)}
                  disabled={count <= 0}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "4px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.panel,
                    color: theme.text,
                    cursor: count <= 0 ? "not-allowed" : "pointer",
                    opacity: count <= 0 ? 0.3 : 1,
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: "0.82rem", fontWeight: "800", color: count > 0 ? theme.accent : theme.textMuted }}>
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => handleItemCountChange(item.name, 1)}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "4px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.panel,
                    color: theme.text,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>       
              </div>
)}

            {/* 🌟 스튜디오에서 복귀 시 나타나는 길잡이 배너 */}
            {showPasteGuideBanner && (
              <div
                onClick={() => {
                  setShowPasteModal(true);
                  setShowPasteGuideBanner(false);
                }}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  border: "1.5px solid #6366f1",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                  marginBottom: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>💡</span>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: "800", color: theme.text }}>
                      스튜디오 글을 복사해 오셨나요?
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#818cf8", marginTop: "2px" }}>
                      여기를 클릭하거나 아래 <b>[📄 파일 첨부]</b>를 누르면 로비에 자동 입력됩니다!
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPasteGuideBanner(false);
                  }}
                  style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1rem", cursor: "pointer", padding: "4px" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* 🌟 시나리오 정보 카드 본체 */}
            <div className="glass-card" style={{ padding: "16px", borderRadius: "16px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800", color: theme.text }}>
                  {wizardMode.startsWith("dating") ? "📖 에피소드 설정 및 서막" : "📖 시나리오 정보 및 서막"}
                </h3>

                <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                  {/* 1. 스튜디오 바로가기 링크 */}
                  <a
                    href="https://gemini.google.com/gem/1laNhRvl9HlbyfErFfxUIs05pOrxSh_Sx?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="새 탭에서 AI 시나리오 제작기(Gem) 열기"
                    style={{
                      padding: "4px 8px",
                      backgroundColor: theme.panelAlt,
                      color: theme.accent,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    🎬 {isMobile ? "스튜디오" : "스튜디오"}
                  </a>

                  {/* 2. 시나리오 파일 첨부 통합 버튼 */}
                  <button 
                    type="button"
                    onClick={() => setShowPasteModal(true)} 
                    style={{ 
                      padding: "4px 8px", 
                      backgroundColor: theme.panelAlt, 
                      color: theme.text, 
                      border: `1px solid ${theme.border}`, 
                      borderRadius: "6px", 
                      fontSize: "0.8rem", 
                      cursor: "pointer", 
                      display: "inline-flex", 
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    📄 {isMobile ? "첨부" : "파일 첨부"}
                  </button>

                  {/* 3. 기존 치환 버튼 */}
                  <button 
                    type="button"
                    onClick={handleAutoReplaceKpcPc} 
                    style={{ 
                      padding: "4px 8px", 
                      backgroundColor: theme.panelAlt, 
                      color: theme.text, 
                      border: `1px solid ${theme.border}`, 
                      borderRadius: "6px", 
                      fontSize: "0.8rem", 
                      cursor: "pointer" 
                    }}
                  >
                    🔄 {isMobile ? "치환" : "PC/KPC 치환"}
                  </button>
                </div>
              </div>

              <input 
                type="text" 
                value={scenarioTitle} 
                onChange={e => setScenarioTitle(e.target.value)} 
                placeholder={wizardMode.startsWith("dating") ? "에피소드 / 시나리오 제목" : "시나리오 제목"} 
                style={{ width: "100%", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.85rem" }} 
              />
              
              <div>
                <label style={{ fontSize: "0.74rem", color: theme.textMuted, marginBottom: "4px", display: "block" }}>
                  {wizardMode.startsWith("dating") ? "[공개 시놉시스] 두 사람을 둘러싼 배경 및 현재 상황" : "[공개 시놉시스] 플레이어에게 주어지는 초기 정보"}
                </label>
                <textarea 
                  value={publicSynopsis} 
                  onChange={e => setPublicSynopsis(e.target.value)} 
                  placeholder={wizardMode.startsWith("dating") ? "계절, 분위기, 두 사람이 얽히게 된 계기 등..." : "도입부, 소문 등 스포일러 없는 배경 설명..."} 
                  style={{ width: "100%", height: "60px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem", resize: "none" }} 
                />
              </div>

              <div>
                <label style={{ fontSize: "0.74rem", color: theme.accent, marginBottom: "4px", display: "block", fontWeight: "700" }}>
                  {wizardMode.startsWith("dating") ? "[오프닝] 이야기가 시작되는 첫 만남 혹은 사건의 순간" : "[서막] 시작되는 시간, 장소, 혹은 상황 묘사"}
                </label>
                <textarea 
                  value={openingScene} 
                  onChange={e => setOpeningScene(e.target.value)} 
                  placeholder={wizardMode.startsWith("dating") ? "예: 비 내리는 늦은 오후, 조용한 온실 구석에서 그녀와 눈이 마주칩니다..." : "예: 비 내리는 늦은 오후, 작업실 문을 두드리는 소리가 들립니다..."} 
                  style={{ width: "100%", height: "60px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem", resize: "none" }} 
                />
              </div>

              <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "8px" }}>
                <button type="button" onClick={() => setShowHiddenTruth(!showHiddenTruth)} style={{ width: "100%", padding: "8px", backgroundColor: showHiddenTruth ? "rgba(247, 101, 133, 0.1)" : theme.panelAlt, border: `1px solid ${showHiddenTruth ? theme.danger : theme.border}`, borderRadius: "6px", color: showHiddenTruth ? theme.danger : theme.text, cursor: "pointer", fontSize: "0.78rem", fontWeight: "700" }}>
                  {showHiddenTruth 
                    ? (wizardMode.startsWith("dating") ? "🔒 엔딩 분기 닫기" : "🔒 키퍼 전용 진상 닫기") 
                    : (wizardMode.startsWith("dating") ? "👀 히든 엔딩 분기 & 둘만의 숨겨진 과거" : "👀 키퍼 전용 스포일러/진상 수동 입력")}
                </button>
                {showHiddenTruth && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ fontSize: "0.72rem", color: theme.danger, marginBottom: "6px" }}>
                      {wizardMode.startsWith("dating") ? "⚠️ 스토리 기밀! 호감도 달성 시의 트루 엔딩이나 배드/특수 엔딩 조건을 기입하세요." : "⚠️ 플레이어 열람 주의! 마스터만 참조하는 사건의 흑막과 기믹, 엔딩 분기입니다."}
                    </div>
                    <textarea 
                      value={hiddenTruth} 
                      onChange={e => setHiddenTruth(e.target.value)} 
                      placeholder={wizardMode.startsWith("dating") ? "트루 엔딩 해금 조건, 과거의 엇갈린 인연, 밝혀지지 않은 진실 등..." : "흑막의 정체, 특수 기믹, 트루/배드 엔딩 조건을 기입하세요."} 
                      style={{ width: "100%", height: "85px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.danger}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem", resize: "none" }} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 시작 버튼 */}
            <button onClick={startNewSession} disabled={isLoading || isPdfLoading} style={{ width: "100%", padding: "16px", backgroundColor: "#52504c", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "1rem" }}>
              {isLoading 
                ? (wizardMode.startsWith("dating") ? "새로운 인연을 맺는 중..." : "키퍼가 세계를 여는 중...") 
                : (wizardMode.startsWith("dating") ? "이야기 시작하기" : "서막 열기")}
            </button>
          </div>
        ) : (
          /* 플레이 룸 */
          <>
            {/* 테이블탑 오버레이 (비밀 스포 완벽 차단) */}
{/* 🍞 상단 시스템 알림 (바깥 클릭 또는 ✕ 버튼으로 닫기) */}
      {toast && (
        <>
          {/* 1. 화면 바깥 터치 감지 레이어 (클릭 시 닫힘) */}
          <div
            onClick={() => setToast(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              backdropFilter: "blur(2px)"
            }}
          />

          {/* 2. 상단 알림 배너 본체 */}
          <div
            style={{
              position: "fixed",
              top: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              backgroundColor: "rgba(18, 20, 26, 0.96)",
              border: `1.5px solid ${theme.accent || "#6366f1"}`,
              borderRadius: "14px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              boxShadow: "0 12px 35px rgba(0, 0, 0, 0.7)",
              color: "#fff",
              maxWidth: "90%",
              width: "360px"
            }}
          >
            {/* 아이콘 및 알림 문구 */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{toast.icon}</span>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.accent || "#818cf8" }}>
                  {toast.title}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#e2e8f0", marginTop: "2px", lineHeight: "1.3" }}>
                  {toast.message}
                </span>
              </div>
            </div>

            {/* 우측 ✕ 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setToast(null)}
              title="알림 닫기"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: "0.85rem",
                cursor: "pointer",
                flexShrink: 0
              }}
            >
              ✕
            </button>
          </div>
        </>
      )}

{/* 🚨 체력 0 도달 시 긴급 회복 선택 모달 */}
      {reviveModalOpen && usableHealItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10001,
            backgroundColor: "rgba(0, 0, 0, 0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)"
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(20, 24, 33, 0.98)",
              border: `2px solid ${theme.danger || "#ef4444"}`,
              borderRadius: "16px",
              padding: "24px 20px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 12px 40px rgba(239, 68, 68, 0.35)",
              color: "#fff"
            }}
          >
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>🚨</div>
            <div style={{ fontWeight: "800", fontSize: "1.05rem", color: theme.danger || "#ef4444", marginBottom: "8px" }}>
              치명상! 의식을 잃어갑니다
            </div>
            <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 18px 0" }}>
              생명력이 0이 되었습니다.<br />
              보유 중인 <strong>[{usableHealItem.name}]</strong>을(를) 사용하여<br />
              버텨내시겠습니까?
              <br />
              <span style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: "4px", display: "inline-block" }}>
                (남은 수량: {usableHealItem.count ?? usableHealItem.quantity ?? 1}개)
              </span>
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleDeclineRevive}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                포기하기
              </button>
              <button
                type="button"
                onClick={handleUseReviveItem}
                style={{
                  flex: 1.4,
                  padding: "10px",
                  backgroundColor: theme.accent || "#6366f1",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                💊 {usableHealItem.name} 복용
              </button>
            </div>
          </div>
        </div>
      )}
 {/* ⚔️ / 🧿 무기 & 부적 전투 재굴림 모달 */}
      {weaponRerollModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="glass-card" style={{
            maxWidth: "380px",
            width: "100%",
            backgroundColor: theme.panel || "#1e1e24",
            border: `1px solid ${weaponRerollModal.type === "weapon" ? (theme.danger || "#ef4444") : (theme.warning || "#eab308")}`,
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
          }}>
            <h3 style={{ 
              fontSize: "1.1rem", 
              fontWeight: "800", 
              marginBottom: "12px", 
              color: weaponRerollModal.type === "weapon" ? (theme.danger || "#ef4444") : (theme.warning || "#eab308") 
            }}>
              {weaponRerollModal.title}
            </h3>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.5", color: theme.text || "#fff", whiteSpace: "pre-wrap", marginBottom: "20px" }}>
              {weaponRerollModal.desc}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={weaponRerollModal.onConfirm}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: weaponRerollModal.type === "weapon" ? (theme.danger || "#ef4444") : (theme.warning || "#eab308"),
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                소모하고 재굴림
              </button>
              <button
                type="button"
                onClick={weaponRerollModal.onCancel}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: `1px solid ${theme.border || "#444"}`,
                  backgroundColor: theme.panelAlt || "#2a2a32",
                  color: theme.textMuted || "#aaa",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                넘어가기
              </button>
            </div>
          </div>
        </div>
      )}
      {emotionModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "90%",
              maxWidth: "420px",
              backgroundColor: theme.panel,
              border: `1.5px solid ${theme.border}`,
              borderRadius: "16px",
              padding: "20px",
              color: theme.text,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            {/* 상단 헤더 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>💬 인세인 감정 판정</div>
              <button
                type="button"
                onClick={() => setEmotionModalOpen(false)}
                style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* 1단계: 대상 선택 (파트너 + 시트의 모든 NPC) */}
            {!emotionTargetNpc ? (
              <div>
                <div style={{ fontSize: "0.85rem", color: theme.textMuted, marginBottom: "12px" }}>
                  감정을 맺을 대상을 선택하십시오. (1D6 주사위가 굴러갑니다)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
                  {/* 파트너 버튼 */}
                  {activeSession.partnerName && (
                    <button
                      type="button"
                      onClick={() => startEmotionRoll({ name: activeSession.partnerName, id: "partner" })}
                      style={{
                        padding: "12px",
                        backgroundColor: theme.panelAlt,
                        border: `1px solid ${theme.primary}`,
                        borderRadius: "10px",
                        color: theme.text,
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>🤝 {activeSession.partnerName}</span>
                      <span style={{ fontSize: "0.75rem", color: theme.primary }}>파트너</span>
                    </button>
                  )}

                  {/* 서브 NPC들 (강이솔, 윤설영 등) */}
                  {(activeSession.sheet?.npcs || [])
                    .filter(n => n.name !== activeSession.partnerName)
                    .map(npc => (
                      <button
                        key={npc.id || npc.name}
                        type="button"
                        onClick={() => startEmotionRoll(npc)}
                        style={{
                          padding: "12px",
                          backgroundColor: theme.panelAlt,
                          border: `1px solid ${theme.border}`,
                          borderRadius: "10px",
                          color: theme.text,
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <span>👤 {npc.name}</span>
                        <span style={{ fontSize: "0.75rem", color: theme.textMuted }}>{npc.role || "등장인물"}</span>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              /* 2단계: 주사위 결과 확인 및 긍정/부정 감정 선택 */
              <div>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div style={{ fontSize: "0.85rem", color: theme.textMuted }}>대상: <b>{emotionTargetNpc.name}</b></div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900", margin: "10px 0", color: theme.accent }}>
                    🎲 1D6 = {emotionDiceResult?.roll}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "800", color: theme.text }}>
                    [{emotionDiceResult?.name}]
                  </div>
                </div>

                <div style={{ fontSize: "0.8rem", color: theme.textMuted, textAlign: "center", marginBottom: "12px" }}>
                  품을 감정의 방향(속성)을 하나 선택하세요:
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => confirmEmotion(emotionDiceResult.pos)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "rgba(34, 197, 94, 0.2)",
                      border: "1.5px solid rgb(34, 197, 94)",
                      borderRadius: "10px",
                      color: theme.text,
                      fontWeight: "800",
                      cursor: "pointer"
                    }}
                  >
                    💖 긍정 ({emotionDiceResult?.pos})
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmEmotion(emotionDiceResult.neg)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                      border: "1.5px solid rgb(239, 68, 68)",
                      borderRadius: "10px",
                      color: theme.text,
                      fontWeight: "800",
                      cursor: "pointer"
                    }}
                  >
                    💔 부정 ({emotionDiceResult?.neg})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
            {activeSession.ruleMode === "insane" && isTabletopOpen && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "75px", backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 40, padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                  <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>🃏 테이블탑 핸드아웃 & 광기 현황</span>
                  <button onClick={() => setIsTabletopOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.3rem", cursor: "pointer" }}>✕</button>
                </div>

                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: "800", color: theme.accent, marginBottom: "10px" }}>📜 시나리오 핸드아웃 (조사 성공 시 비밀 해금)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
{(activeSession.sheet.handouts || []).map((card, idx) => {
        const isPcCard = card.id === "pc_base" || card.title.includes(activeSession.sheet?.name || "주인공");
        const canShowSecret = card.revealed || isPcCard;
        const isShowingSecret = canShowSecret && card.isFlipped;

        // 🌟 미발견 구역 자물쇠 카드 판정 (PC/파트너 및 기본 3개는 처음부터 열림)
        const isDiscovered = card.discovered ?? (isPcCard || idx < 3);

        if (!isDiscovered) {
          return (
            <div
              key={card.id || idx}
              style={{
                width: "170px",
                minHeight: "220px",
                borderRadius: "12px",
                border: `1.5px dashed ${theme.border}`,
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: theme.textMuted,
                boxSizing: "border-box"
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>🔒</div>
              <div style={{ fontWeight: "800", fontSize: "0.82rem", color: theme.textMuted }}>미발견 조사 구역</div>
              <div style={{ fontSize: "0.68rem", marginTop: "6px", lineHeight: "1.3", opacity: 0.7 }}>
                조사나 단서를 통해<br/>실마리를 찾아야 합니다.
              </div>
            </div>
          );
        }

                      return (
                        <div 
                          key={card.id} 
                          onClick={() => toggleHandoutReveal(card.id)} 
                          className="glass-card" 
                          style={{ 
                            width: "170px", 
                            minHeight: "220px", 
                            borderRadius: "12px", 
                            border: `1.5px solid ${isShowingSecret ? theme.danger : card.revealed ? theme.success : theme.border}`, 
                            padding: "14px", 
                            cursor: "pointer", 
                            display: "flex", 
                            flexDirection: "column", 
                            justifyContent: "space-between" 
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "0.68rem", color: isShowingSecret ? theme.danger : card.revealed ? theme.success : theme.accent, fontWeight: "800" }}>
                              {isShowingSecret ? "💀 비밀 열람 중" : card.revealed ? "🔓 조사 완료 (터치하여 비밀 확인)" : "🔒 비공개 핸드아웃"}
                            </div>
                            <div style={{ fontWeight: "800", fontSize: "0.88rem", margin: "6px 0", color: theme.text }}>{card.title}</div>
                            <div style={{ fontSize: "0.74rem", color: isShowingSecret ? theme.danger : theme.textMuted, lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                              {isShowingSecret ? card.secret : card.overview}
                            </div>
                          </div>
                          <div style={{ fontSize: "0.65rem", textAlign: "center", color: theme.textMuted, borderTop: `1px dashed ${theme.border}`, paddingTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            {card.revealed && <strong style={{ color: theme.danger, fontSize: "0.7rem" }}>✋ 이 비밀은 스스로 밝힐 수 없다.</strong>}
                            <span>{canShowSecret ? "터치하여 앞/뒤 뒤집기" : "🔒 조사 판정으로 해금 가능"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: "800", color: theme.danger, marginBottom: "10px" }}>💀 내 광기 핸드 (보유: {activeSession.sheet.madnessCards?.length || 0}장)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                    {(activeSession.sheet.madnessCards || []).map(card => (
                      <div key={card.id} className="glass-card" style={{ width: "170px", minHeight: "220px", borderRadius: "12px", border: `1.5px solid ${card.revealed ? theme.danger : "rgba(247, 101, 133, 0.4)"}`, padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: card.revealed ? "rgba(214, 56, 87, 0.15)" : theme.panelAlt }}>
                        <div>
                          <div style={{ fontSize: "0.68rem", color: card.revealed ? theme.danger : theme.warning, fontWeight: "800" }}>{card.revealed ? "🩸 발현된 광기" : "🔒 미발현 광기"}</div>
                          <div style={{ fontWeight: "800", fontSize: "0.88rem", margin: "6px 0", color: theme.text }}>{card.name}</div>
                          <div style={{ fontSize: "0.74rem", color: theme.textMuted, lineHeight: "1.4" }}>
                            {card.desc}
                          </div>
                        </div>
                        {!card.revealed ? (
                          <button
                            onClick={() => manifestMadnessCard(card.id, activeSessionId)}
                            style={{ width: "100%", padding: "6px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "800", cursor: "pointer" }}
                          >
                            발현하기 ➔
                          </button>
                        ) : (
                          <div style={{ fontSize: "0.68rem", color: theme.danger, textAlign: "center", fontWeight: "700" }}>발현 완료</div>
                        )}
                      </div>
                    ))}

                    <div className="glass-card" style={{ width: "170px", minHeight: "220px", borderRadius: "12px", border: `1.5px dashed ${theme.danger}`, padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(214, 56, 87, 0.08)", gap: "6px" }}>
                      <span style={{ fontSize: "1.8rem" }}>🎴</span>
                      <span style={{ fontWeight: "800", fontSize: "0.82rem", color: theme.danger }}>미공개 광기 덱</span>
                      <span style={{ fontSize: "0.68rem", color: theme.textMuted }}>남은 장수: {activeSession.sheet.madnessDeck?.length || 0}장</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", marginTop: "6px" }}>
                        <button onClick={() => drawMadnessCard(activeSessionId, false)} style={{ padding: "5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", fontSize: "0.68rem", cursor: "pointer" }}>+ 1장 뽑기</button>
                        <button onClick={() => triggerMadnessDirectly(activeSessionId)} style={{ padding: "5px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.68rem", fontWeight: "700", cursor: "pointer" }}>💥 즉시 발현</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 🌟 대화 로그 (터치 전파 차단) */}
            <div 
              ref={chatContainerRef} 
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", WebkitOverflowScrolling: "touch" }}
            >
              {isRolling && animationEnabled && (
                <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)", zIndex: 50, backgroundColor: theme.panel, border: `2px solid ${theme.accent}`, borderRadius: "14px", padding: "10px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="anim-dice-rolling" style={{ fontSize: "1.8rem" }}>🎲</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: theme.accent }}>{rollingDisplayNum}</div>
                </div>
              )}

              {(activeSession.messages || []).map((m, i) => {
                const isLastUser = m.role === "user" && i === (activeSession.messages || []).map(x => x.role).lastIndexOf("user");
                const isDatingMsg = activeSession.ruleMode === "dating_msg";
                const partnerNpc = activeSession.sheet?.npcs?.[0];


  // ── [통화가 아닌 일반 대면 대화는 기존 코드 그대로 진행] ──
               
                return (
                  <div key={i} style={{ 
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start", 
                    maxWidth: isMobile ? "88%" : "72%", 
                    display: "flex", 
                    gap: "8px", 
                    alignItems: "flex-start", 
                    flexDirection: m.role === "user" ? "row-reverse" : "row",
                    marginBottom: isDatingMsg ? "8px" : "0"
                  }}>
                    
                    {isDatingMsg && m.role === "model" && (
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${theme.border}`, flexShrink: 0, marginTop: "2px" }}>
                        <img src={partnerNpc?.portrait} alt="상대" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                      {isDatingMsg && m.role === "model" && (
                        <span style={{ fontSize: "0.74rem", color: theme.textMuted, marginBottom: "4px", fontWeight: "700" }}>
                          {partnerNpc?.name || "상대방"}
                        </span>
                      )}

                      <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                        <div 
                          className={isDatingMsg ? "" : (m.role === "user" ? "" : "serif-text")} 
                          style={{ 
                            backgroundColor: isDatingMsg 
                              ? (m.role === "user" ? "#fae100" : theme.panel) 
                              : (m.text.includes("[🎲") || m.text.includes("[⚠️") ? "rgba(229, 169, 60, 0.12)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi), 
                            color: isDatingMsg && m.role === "user" ? "#242424" : theme.text, 
                            border: isDatingMsg ? `1px solid ${theme.border}` : (m.text.includes("[⚠️") ? `1px solid ${theme.danger}` : m.text.includes("[🎲") ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`), 
                            padding: isDatingMsg ? "10px 14px" : "14px 18px", 
                            borderRadius: isDatingMsg ? (m.role === "user" ? "16px 2px 16px 16px" : "2px 16px 16px 16px") : "12px", 
                            lineHeight: isDatingMsg ? "1.5" : "1.9", 
                            whiteSpace: "pre-wrap", 
                            fontSize: isDatingMsg ? "0.88rem" : "0.92rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                          }}
                        >
{/* 🖼️ 지문 속에 해금된 이벤트 CG 배너 (깔끔한 인라인 뷰) */}
        {m.cg && (
          <div 
            style={{
              marginBottom: "14px",
              borderRadius: "10px",
              overflow: "hidden",
              position: "relative"
            }}
          >
            <img 
              src={m.cg.imageUrl || m.cg.url} 
              alt={m.cg.title || "이벤트 CG"} 
              style={{ 
                width: "100%", 
                maxHeight: "380px", 
                objectFit: "cover", 
                display: "block" 
              }} 
            />
            {m.cg.title && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "8px 12px",
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%)",
                color: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: "700",
                letterSpacing: "-0.02em"
              }}>
                ✨ {m.cg.title}
              </div>
            )}
          </div>
        )}
                          {m.text}
                        </div>

                        {isDatingMsg && m.role === "user" && !(activeSession.messages || []).slice(i + 1).some(next => next.role === "model") && (
                          <span style={{ fontSize: "0.65rem", color: theme.warning, fontWeight: "700" }}>1</span>
                        )}
                      </div>

                      {isLastUser && !isLoading && (
                        <button
                          type="button"
                          onClick={() => setPendingRollback({ text: m.text, index: i, prevSheet: m.prevSheet })}
                          style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.7rem", cursor: "pointer", marginTop: "4px", textDecoration: "underline" }}
                        >
                          ⎌ 전송 취소 및 다시 쓰기
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && <div style={{ color: theme.accent, fontSize: "0.8rem", padding: "4px" }}>답장을 입력하는 중...</div>}
            </div>

            {/* 알림 배너 & 제안 버튼 영역 (CoC 조사 칩 완벽 복구 포함!) */}
{/* ⚠️ 마스터 씬 진행 중 배너 */}
              {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase === "마스터씬" && (
                <div style={{ backgroundColor: "rgba(214, 56, 87, 0.18)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.78rem", color: theme.danger }}>
                    ⚠️ <strong>마스터 씬 진행 중 (주요 행동 잠금)</strong>
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>대사와 반응을 자유롭게 나눈 뒤 씬을 마무리하세요.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, phase: "메인" } } : s));
                      executeMessage(`[🎬 마스터 씬 종료] 사건이 일단락되고, 다시 메인 드라마 장면으로 돌아갑니다.`);
                    }}
                    style={{ padding: "4px 10px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "800", cursor: "pointer" }}
                  >
                    마무리 ➔
                  </button>
                </div>
              )}

{/* ⚔️ 클라이맥스 1~6 플롯 대결 & 결전 액션 바 */}
              {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase === "클라이맥스" && (
                <div style={{ backgroundColor: "rgba(214, 56, 87, 0.12)", border: `1.5px solid ${theme.danger}`, borderRadius: "10px", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* 상단: 적 HP vs 내 HP */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px dashed ${theme.border}`, paddingBottom: "6px" }}>
                    <div style={{ fontSize: "0.76rem", fontWeight: "800", color: theme.danger }}>
                      👾 {activeSession.sheet?.enemyName || "괴이"}: HP {activeSession.sheet?.enemyHp ?? 6} / {activeSession.sheet?.maxEnemyHp ?? 6}
                    </div>
                    <div style={{ fontSize: "0.76rem", fontWeight: "800", color: theme.success }}>
                      ❤️ 내 HP: {activeSession.sheet?.hp ?? 6} / {activeSession.sheet?.maxHp ?? 6}
                    </div>
                  </div>

                  {/* 플롯 속도 선택 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.74rem", fontWeight: "800", color: theme.text }}>속도(플롯) 선택:</span>
                    {!activeSession.sheet?.flashbackUsed && (
                      <button
                        type="button"
                        onClick={() => triggerFlashback("check")}
                        style={{ padding: "2px 7px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.68rem", fontWeight: "800", cursor: "pointer" }}
                      >
                        🗝️ 회상 (판정+3)
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => executeClimaxPlot(num)}
                        style={{ flex: 1, padding: "5px 0", backgroundColor: theme.panel, border: `1px solid ${theme.warning}`, borderRadius: "5px", color: theme.text, fontSize: "0.76rem", fontWeight: "900", cursor: "pointer" }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* 🌟 📜 봉인 의식 3단계 실시간 현황 게이지 바 */}
                  <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                    {(activeSession.sheet?.rituals || [
                      { id: 1, name: "1단계: 무대 조명 정지", skill: "도구" },
                      { id: 2, name: "2단계: 진혼의 공명", skill: "소리" },
                      { id: 3, name: "3단계: 마지막 커튼 강제 폐막", skill: "슬픔" }
                    ]).map((r, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          padding: "5px 4px",
                          borderRadius: "6px",
                          textAlign: "center",
                          backgroundColor: r.completed ? "rgba(98, 214, 129, 0.2)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${r.completed ? theme.success : theme.border}`,
                          color: r.completed ? theme.success : theme.textMuted,
                          fontSize: "0.7rem",
                          fontWeight: "800"
                        }}
                      >
                        {r.completed ? `✔️ ${idx + 1}단계 완료` : `${idx + 1}단계: 《${r.skill}》`}
                      </div>
                    ))}
                  </div>
<div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>

{/* 🛡️ 적 선공 시 노출되는 회피 판정 버튼 */}
{climaxStep === "dodge" && (
  <button
    type="button"
    onClick={executePlayerDodge}
    style={{
      flex: 1,
      padding: "8px",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontWeight: "800",
      fontSize: "0.78rem",
      cursor: "pointer",
      boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)"
    }}
  >
    🛡️ 회피 판정 (2D6)
  </button>
)}

        {/* ⚔️ 기존 기본 공격 버튼 */}
        <button
          type="button"
          disabled={climaxStep === "plot" || climaxStep === "dodge"}
          onClick={executeClimaxAttack}
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: theme.danger,
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "800",
            fontSize: "0.78rem",
            opacity: (climaxStep === "plot" || climaxStep === "dodge") ? 0.35 : 1,
            cursor: (climaxStep === "plot" || climaxStep === "dodge") ? "not-allowed" : "pointer"
          }}
        >
          ⚔️ 기본 공격 (2D6)
        </button>
                          <button
                          type="button"
                          disabled={climaxStep === "plot" || !activeSession.sheet?.isRitualDiscovered}
                          onClick={() => {
                           if (!activeSession) return;
                           if (!activeSession.sheet?.isRitualDiscovered) return; // 👈 요기 딱 한 줄 추가!
                           

                            // 1. 의식 목록이 비어있으면 배경 맞춤 의식으로 자동 복원
                            let rituals = activeSession.sheet?.rituals;
                            if (!rituals || rituals.length === 0) {
                              const generated = typeof generateInsaneThemeAssets === "function"
                                ? generateInsaneThemeAssets(activeSession.title, activeSession.scenarioText)
                                : null;

                              rituals = generated?.rituals || [
                                { id: 1, name: "1단계: 무대 조명 정지", skill: "도구", completed: false },
                                { id: 2, name: "2단계: 진혼의 공명", skill: "소리", completed: false },
                                { id: 3, name: "3단계: 마지막 커튼 강제 폐막", skill: "슬픔", completed: false }
                              ];

                              setSessions(prev => prev.map(s => s.id === activeSessionId ? {
                                ...s,
                                sheet: { ...s.sheet, rituals }
                              } : s));
                            }

                            // 2. 미완료된 다음 의식 단계 탐색
                            const nextIdx = rituals.findIndex(r => !r.completed);

                            // 3. 이미 3단계를 모두 성공한 상태일 때
                            if (nextIdx === -1) {
                              if (confirm("🎉 이미 3단계 봉인 의식을 모두 완수했습니다!\n\n의식을 1단계부터 다시 진행(초기화)하여 테스트하시겠습니까?")) {
                                const resetRituals = rituals.map(r => ({ ...r, completed: false }));
                                setSessions(prev => prev.map(s => s.id === activeSessionId ? {
                                  ...s,
                                  sheet: { ...s.sheet, rituals: resetRituals }
                                } : s));
                                executeClimaxRitual(0);
                              }
                              return;
                            }

                            executeClimaxRitual(nextIdx);
                          }}
                          style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor: "#374151",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "800",
                            fontSize: "0.78rem",
                            opacity: climaxStep === "plot" ? 0.35 : 1,
                            cursor: climaxStep === "plot" ? "not-allowed" : "pointer"
                          }}
                        >
                          {activeSession.sheet?.isRitualDiscovered ? "📜 의식 진행 (2D6)" : "⚠️ 봉인 단서 미확인"}
                        </button>
                  </div>
                </div>
              )}

{/* 🌟 1. 도입 페이즈 전용 액션 바 */}
            {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase === "도입" && (
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "4px 0", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setInput("상황을 조용히 지켜보며 주변을 살핀다.");
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    backgroundColor: theme.panelAlt,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "6px",
                    color: theme.text,
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  💬 상황 반응하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("도입 페이즈를 종료하고 제 1사이클을 개막하시겠습니까?")) {
                      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
                        ...s,
                        sheet: { ...s.sheet, phase: "메인", cycle: 1, scene: 1, actionUsed: false }
                      } : s));
                      setInput("도입 페이즈를 종료하고 제 1사이클을 개막합니다. 플레이어의 첫 번째 장면을 열어주십시오.");
                    }
                  }}
                  style={{
                    flex: 1.2,
                    padding: "8px 10px",
                    backgroundColor: theme.primary,
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  🚀 도입 종료 (제 1사이클 개막)
                </button>
              </div>
            )}

              {/* 🎯 인세인 드라마 씬 3대 주요 행동 바 */}
              {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase !== "마스터씬" && activeSession.sheet?.phase !== "클라이맥스" && activeSession.sheet?.phase !== "도입" && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "4px 0", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.72rem", color: theme.warning, fontWeight: "800", alignSelf: "center" }}>🎯 주요 행동:</span>
                  <button
                    type="button"
                    onClick={() => setShowSkillMatrixModal(true)}
                    style={{ padding: "4px 9px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}
                  >
                    🔍 조사 판정(자율)
                  </button>
<button
  type="button"
  onClick={openEmotionModal}
  style={{ padding: "4px 9px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", color: theme.text, cursor: "pointer" }}
>
  💬 감정 판정 (1D6)
</button>
                  <button
                    type="button"
                    onClick={() => setInput(`[주요 행동: 회복 판정 선언] 흐트러진 정신과 상처를 추스릅니다. `)}
                    style={{ padding: "4px 9px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.success, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}
                  >
                    🩹 회복 판정
                  </button>
                  <button
                    type="button"
                    onClick={handleRollSceneTable}
                    style={{ padding: "4px 9px", backgroundColor: "rgba(229, 169, 60, 0.15)", border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.warning, fontSize: "0.72rem", cursor: "pointer", fontWeight: "800" }}
                  >
                    🎬 장면표 (2D6)
                  </button>
                </div>
              )}
               
            <div style={{ backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, padding: "8px 14px", display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
              
             {isScenarioEnded && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  backgroundColor: isTrueEnding
                    ? "rgba(245, 158, 11, 0.15)"
                    : isHiddenEnding 
                    ? "rgba(154, 100, 255, 0.15)" 
                    : isBadEnding 
                    ? "rgba(214, 56, 87, 0.15)" 
                    : "rgba(98, 214, 129, 0.15)", 
                  border: `1.5px solid ${
                    isTrueEnding
                      ? "#f59e0b"
                      : isHiddenEnding 
                      ? "#9d4edd" 
                      : isBadEnding 
                      ? theme.danger 
                      : theme.success
                  }`, 
                  borderRadius: "8px", 
                  padding: "10px 14px",
                  gap: "12px",
                  margin: "12px 0"
                }}>
<div style={{ fontSize: "0.8rem", color: theme.text }}>
                    <strong>
                      {calculatedEnding?.title || (
                        isTrueEnding
                          ? "👑 최고의 결말(트루 엔딩)에 도달했습니다"
                          : isHiddenEnding 
                          ? "🗝️ 숨겨진 진실(히든 엔딩)에 도달했습니다" 
                          : isBadEnding 
                          ? "🥀 비극적 결말에 도달했습니다" 
                          : "✨ 시나리오가 완결되었습니다"
                      )}
                    </strong>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "2px" }}>
                      {activeSession?.ruleMode === "insane"
                        ? "우측 시트에서 감춰졌던 모든 진상과 인물들의 비밀이 해금되었습니다."
                        : (calculatedEnding?.theme || "각 인물들과 쌓아온 감정과 선택이 결말에 도달했습니다.")}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const isInsaneMode = activeSession?.ruleMode === "insane";

                      // 1. 인세인(InSANe) 추리/호러 모드일 때
                      if (isInsaneMode) {
                        let promptText = "";
                        if (isTrueEnding) {
                          promptText = `[에필로그 요청: 찬란한 결말의 후일담]\n본 시나리오의 트루 엔딩(True End)에 도달했습니다. 사건의 숨겨진 모든 진상을 밝혀내고 생존한 이들이 마주한 새벽의 여운을 3~4문단으로 서술해 주십시오.`;
                        } else if (isHiddenEnding) {
                          promptText = `[에필로그 요청: 숨겨진 진실의 후일담]\n본 시나리오의 히든 엔딩(Hidden End)에 도달했습니다. 표면 뒤에 도사리고 있던 배후의 진실과 세계관의 숨겨진 비하인드를 담은 미스터리한 후일담을 3~4문단으로 서술해 주십시오.`;
                        } else if (isBadEnding) {
                          promptText = `[에필로그 요청: 비극의 후일담]\n본 시나리오가 비극적인 결말(Bad End)로 막을 내렸습니다. 사건이 끝난 후 남겨진 참상과 홀로 스러져간 이들의 쓸쓸한 여운을 3~4문단으로 서술해 주십시오.`;
                        } else {
                          promptText = `[에필로그 요청: 평온의 후일담]\n본 시나리오가 완결되었습니다. 시련을 넘어선 생존자들이 일상으로 돌아가 맞이하는 담담한 후일담을 3~4문단으로 서술해 주십시오.`;
                        }
                        executeMessage(promptText);
                        return;
                      }

                      // 2. 일반 / 미연시 / 다인원 서사 모드일 때 (동적 수치 기반)
                      const loversText = calculatedEnding?.lovers?.length > 0 
                        ? calculatedEnding.lovers.join(", ") 
                        : "없음 (누구와도 맺어지지 않음)";
                      const othersText = calculatedEnding?.others?.length > 0 
                        ? calculatedEnding.others.join(", ") 
                        : "없음";

                      let promptText = `[에필로그 요청: ${calculatedEnding?.title || "후일담"}]
- 확정 결말: ${calculatedEnding?.title || "완결"} (${calculatedEnding?.type || "Normal End"})
- 결말 테마: ${calculatedEnding?.theme || "사건의 뒷이야기"}
- 공식 연인: ${loversText}
- 비연인(공적 거리감 유지): ${othersText}

[후일담 서술 수칙]
1. '공식 연인'에 명시된 인물들과의 감정선과 유대를 중심으로 결말을 묘사하십시오. (다자연애일 경우 질투나 강압 없이 상호 신뢰와 공존을 섬세하게 표현하십시오.)
2. '비연인'으로 분류된 인물은 사적인 연애 감정이나 소유욕을 배제하고, 자신의 본래 직업적 정체성과 신념을 지키며 공적인 거리감을 유지하게 하십시오.
3. [단독 트루 엔딩]일 경우 다른 인물의 사적인 난입을 금지하십시오.
4. [홀로 엔딩 / 떠나는 엔딩]일 경우 누구의 손도 잡지 않고 자신의 길을 향해 나아가는 주인공의 독립적이고 담담한 여운을 묘사하십시오.
5. 시나리오 완결에 걸맞게 한 편의 소설처럼 감각적이고 유려한 문체로 3~4문단 서술해 주십시오.`;

                      executeMessage(promptText);
                    }}
                    style={{ 
                      padding: "6px 12px", 
                      backgroundColor: isTrueEnding
                        ? "#f59e0b"
                        : isHiddenEnding 
                        ? "#7b2cbf" 
                        : isBadEnding 
                        ? theme.danger 
                        : (calculatedEnding?.type === "Solo End" ? "#64748b" : theme.accent), 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "6px", 
                      fontWeight: "700", 
                      fontSize: "0.75rem", 
                      cursor: "pointer", 
                      whiteSpace: "nowrap" 
                    }}
                  >
                    {isTrueEnding
                    ? "👑 찬란한 후일담 보기"
                    : isHiddenEnding 
                    ? (calculatedEnding?.type === "Hidden Poly End" ? "🌙 세 사람의 후일담 보기" : "🗝️ 숨겨진 후일담 보기")
                    : isBadEnding 
                    ? "🥀 비극의 후일담 보기" 
                    : (calculatedEnding?.type === "Solo End" ? "🍂 홀로 남겨진 후일담 보기" : "📜 후일담 보기")}
                </button>
              </div>
            )}

            {activeMadnessAlert && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(247, 101, 133, 0.22)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "0.78rem", color: theme.danger }}>
                    🩸 <strong>[광기 발현: {activeMadnessAlert.name}]</strong>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "2px" }}>{activeMadnessAlert.desc}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button
                      onClick={() => { setInput(prev => `[광기 발현: ${activeMadnessAlert.name}] ` + prev); setActiveMadnessAlert(null); }}
                      style={{ padding: "4px 10px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "0.72rem", cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      대사에 반영
                    </button>
                    <button onClick={() => setActiveMadnessAlert(null)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.8rem", cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              )}

              {activeSession?.pendingCheck && !isSanCheckDetected && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1.5px solid ${theme.warning}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "0.78rem", color: theme.text }}>
                    <strong style={{ color: theme.warning }}>🎲 판정 요구: {activeSession.pendingCheck.skill}</strong>
                    <span style={{ fontSize: "0.72rem", color: theme.textMuted, marginLeft: "6px" }}>
                      (목표치: {activeSession.pendingCheck.target})
                    </span>
                  </div>
                  <button
                    onClick={() => rollDiceDirectly(activeSession.pendingCheck.target, activeSession.pendingCheck.skill)}
                    style={{ padding: "5px 12px", backgroundColor: theme.warning, color: "#000", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    🎲 판정 굴리기
                  </button>
                </div>
              )}

              {/* 🌟 CoC 전용 조사 칩 복구 완료! */}
              {activeSession?.ruleMode !== "insane" && !activeSession?.ruleMode?.startsWith("dating") && (activeSession?.investigationSpots || []).length > 0 && (
                <div 
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}
                >
                  <span style={{ fontSize: "0.72rem", color: theme.warning, fontWeight: "700", alignSelf: "center" }}>🔍 조사:</span>
                  {activeSession.investigationSpots.map((spot, idx) => (
                    <button key={idx} onClick={() => setInput(prev => `[조사: ${spot.name}] ` + prev)} style={{ padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>{spot.name}</button>
                  ))}
                </div>
              )}



{/* 🗺️ 동적 장소 이동 카드 (LOCATION_CARDS) */}
        {locationCards && locationCards.length > 0 && (
          <div style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            padding: "8px 2px",
            marginBottom: "6px",
          }}>
            {locationCards.map((card, idx) => {
              // ⭐ 약속 장소 확인 (장소명 또는 NPC 매칭)
              const isAppointed = (activeSession?.sheet?.appointments || []).some(
                app => (app.place && card.name?.includes(app.place)) || (app.npc && card.npc?.includes(app.npc))
              );

              return (
                <div
                  key={idx}
                  onClick={() => {
                  const targetText = card.npc 
                    ? `${card.name}(으)로 향하여 그곳에 있는 [${card.npc}]와(과) 마주친다.`
                    : `${card.name}(으)로 향한다.`;
                  
                  // 🔄 율리안/카시엘 등 이동한 장소의 NPC로 대화 상대 즉시 전환
                  if (card.npc) {
                    const matchedNpc = (activeSession?.sheet?.npcs || []).find(n => n.name === card.npc || (card.npc && n.name.includes(card.npc)));
                    if (matchedNpc) {
                      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, activeContactId: matchedNpc.id } : s));
                    }
                  }

                  setLocationCards([]);
                  if (typeof handleSuggestionClick === "function") {
                    handleSuggestionClick(targetText);
                  } else {
                    executeMessage(targetText);
                  }
                }}
                  style={{
                    position: "relative",
                    flex: "0 0 auto",
                    width: isMobile ? "190px" : "220px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: isAppointed ? "1.5px solid #f43f5e" : "1px solid rgba(255, 255, 255, 0.15)",
                    backgroundColor: isAppointed ? "rgba(76, 29, 44, 0.85)" : "rgba(30, 41, 59, 0.85)",
                    cursor: "pointer",
                    boxShadow: isAppointed ? "0 0 10px rgba(244, 63, 94, 0.25)" : "none",
                  }}
                >
                  {/* ⭐ 약속 장소 배지 */}
                  {isAppointed && (
                    <div style={{
                      display: "inline-block",
                      fontSize: "0.62rem",
                      fontWeight: "800",
                      color: "#fff",
                      backgroundColor: "#f43f5e",
                      padding: "1px 6px",
                      borderRadius: "4px",
                      marginBottom: "4px"
                    }}>
                      ⭐ 약속 장소
                    </div>
                  )}

                  <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: isAppointed ? "#fda4af" : "#67e8f9", marginBottom: "3px" }}>
                    📍 {card.name}
                  </div>
                  {card.desc && (
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.3", marginBottom: "4px" }}>
                      {card.desc}
                    </div>
                  )}
                  {card.npc && (
                    <div style={{ fontSize: "0.7rem", color: "#cbd5e1" }}>
                      👤 {card.npc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
{/* 제안 칩 */}
              {suggestionsEnabled && (activeSession?.suggestedActions || []).length > 0 && (
                <div
                  ref={(el) => {
                    if (!el) return;
                    const stop = (e) => e.stopPropagation();
                    el.addEventListener("touchstart", stop, { passive: true });
                    el.addEventListener("touchmove", stop, { passive: true });
                    el.addEventListener("touchend", stop, { passive: true });
                  }}
                  onTouchStartCapture={(e) => e.stopPropagation()}
                  onTouchMoveCapture={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  style={{ 
                    display: "flex", 
                    gap: "6px", 
                    overflowX: "auto",
                    overscrollBehaviorX: "contain",
                    touchAction: "pan-x",
                    WebkitOverflowScrolling: "touch",
                    padding: "4px 0",
                    alignItems: "center"
                  }}
                >
                  {(activeSession.suggestedActions || []).map((sugg, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSuggestionClick(sugg)}
                      style={{
                        padding: "5px 12px",
                        backgroundColor: theme.panelAlt,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "16px",
                        color: theme.text,
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                      }}
                    >
                      💡 {sugg}
                    </button>
                  ))}
                </div>
              )}
            </div>

{/* 🌟 제미나이 정석 캡슐형 입력창 (좌측 플랫 + / 우측 원형 ↑ 전송 버튼) */}
            <div style={{ 
              position: "sticky", 
              bottom: 0, 
              zIndex: 30, 
              padding: "10px 14px", 
              paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))", 
              backgroundColor: theme.sidebar, 
              borderTop: `1px solid ${theme.border}`, 
              display: "flex", 
              justifyContent: "center",
              flexShrink: 0
            }}>
              {/* 알약 형태의 단일 캡슐 컨테이너 */}
              <div style={{
                flex: 1,
                maxWidth: "860px",
                display: "flex",
                alignItems: "flex-end",
                backgroundColor: theme.panel,
                border: `1.5px solid ${theme.border}`,
                borderRadius: "28px",
                padding: "4px 8px 4px 10px",
                position: "relative",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
              }}>
                {/* 1. 좌측: 원 테두리 없는 깔끔한 플랫 + 버튼 */}
                <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setIsActionDrawerOpen(!isActionDrawerOpen)}
                    title="시스템 액션 서랍"
                    style={{
                      background: "none",
                      border: "none",
                      color: isActionDrawerOpen ? theme.accent : (activeSession?.sheet?.actionUsed ? theme.warning : theme.textMuted),
                      cursor: "pointer",
                      padding: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      transition: "color 0.15s ease",
                      flexShrink: 0
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>

{/* 위로 열리는 액션 서랍 팝오버 (방 룰에 맞게 100% 동적 분기) */}
                  {isActionDrawerOpen && (
                    <>
                      {/* 🌟 바깥 대지를 누르면 서랍이 닫히는 투명 터치막 */}
                      <div
                        onClick={() => setIsActionDrawerOpen(false)}
                        style={{ position: "fixed", inset: 0, zIndex: 90 }}
                      />

                      <div
                        onClick={e => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          bottom: "48px",
                          left: "0",
                          width: "240px",
                          backgroundColor: theme.panel,
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                          border: `1.5px solid ${theme.border}`,
                          borderRadius: "16px",
                          padding: "8px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                          zIndex: 100
                        }}
                      >
                        <div style={{ fontSize: "0.7rem", color: theme.textMuted, padding: "4px 8px", fontWeight: "800", borderBottom: `1px dashed ${theme.border}` }}>
                          {activeSession?.ruleMode === "insane" 
                            ? (activeSession?.sheet?.actionUsed ? "행동 완료" : "주요 행동") 
                            : activeSession?.ruleMode === "coc" 
                            ? "CoC 액션" 
                            : activeSession?.ruleMode?.startsWith("dating") 
                            ? "미연시 전용 액션" 
                            : "자유 액션"}
                        </div>

{/* 1. 🎲 인세인 방일 때 */}
                        {activeSession?.ruleMode === "insane" && (
                          <>
                            {!activeSession?.sheet?.actionUsed ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => { setInvestigationModal({ step: "selectTarget" }); setIsActionDrawerOpen(false); }}
                                  style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  🔍 조사 판정 선언
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const npcs = activeSession?.sheet?.npcs || [];
                                    const defaultTarget = npcs.length === 1 ? npcs[0] : null;
                                    const d = Math.floor(Math.random() * 6) + 1;
                                    setEmotionModal({ 
                                      targetNpc: defaultTarget, 
                                      roll: d, 
                                      pair: INSANE_EMOTIONS_TABLE[d] 
                                    });
                                    setIsActionDrawerOpen(false);
                                  }}
                                  style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  💬 감정 맺기 (1D6 감정표)
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setInput("휴식을 취하며 엉클어진 마음과 상처를 추스릅니다. ");
                                    rollInsaneCheck("인내", 5, "회복 판정");
                                    setIsActionDrawerOpen(false);
                                  }}
                                  style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  🩹 휴식 및 회복 판정
                                </button>

                                <button
                                  type="button"
                                  onClick={() => { handleRollSceneTable(); setIsActionDrawerOpen(false); }}
                                  style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.warning, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  📜 2D6 정규 장면표 굴리기
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSceneClose}
                                style={{ padding: "10px", textAlign: "center", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1.5px solid ${theme.warning}`, borderRadius: "10px", color: theme.warning, fontSize: "0.82rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                              >
                                🎬 장면 닫기 (Scene Close)
                              </button>
                            )}

                            <div style={{ height: "1px", backgroundColor: theme.border, margin: "2px 0" }} />

                            <button
                              type="button"
                              onClick={() => { setShowInsaneGuideModal(true); setIsActionDrawerOpen(false); }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.textMuted, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              ❓ 인세인 룰 가이드
                            </button>
                          </>
                        )}

                        {/* 2. 🐙 CoC 방일 때 */}
                        {activeSession?.ruleMode === "coc" && (
                          <>
                            <button
                              type="button"
                              onClick={() => { rollDiceDirectly(); setIsActionDrawerOpen(false); }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              🎲 1D100 주사위 굴리기
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                rollDiceDirectly(activeSession.sheet?.san ?? 50, "이성 체크");
                                setIsActionDrawerOpen(false);
                              }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.danger, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              🧠 이성(SAN) 체크
                            </button>

                            <div style={{ height: "1px", backgroundColor: theme.border, margin: "2px 0" }} />

                            <button
                              type="button"
                              onClick={() => {
                                setRuleHelpModal({
                                  icon: "🐙",
                                  name: "크툴루의 부름 (CoC 7판)",
                                  sub: "1D100 기반 탐색과 공포",
                                  points: [
                                    { title: "1D100 판정", desc: "주사위를 굴려 내 특성치나 기능치 수치 이하가 나오면 성공합니다." },
                                    { title: "이성과 광기", desc: "괴이한 광경을 마주해 이성(SAN)이 크게 깎이면 일시적 광기가 발현됩니다." },
                                    { title: "대성공과 대실패", desc: "1이 나오면 대성공, 96~100이 나오면 치명적인 대실패(펌블)입니다." }
                                  ]
                                });
                                setIsActionDrawerOpen(false);
                              }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.textMuted, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              ❓ CoC 7판 가이드
                            </button>
                          </>
                        )}

                        {/* 3. 🌸 미연시 방일 때 */}
                        {activeSession?.ruleMode?.startsWith("dating") && (
                          <>
                            <button
                              type="button"
                              onClick={() => { setIsPhoneDrawerOpen(true); setIsActionDrawerOpen(false); }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              📱 메신저 열기
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const partner = activeSession.sheet?.npcs?.[0];
                                if (partner) setGiftModalNpc(partner);
                                setIsActionDrawerOpen(false);
                              }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              🎁 상대에게 선물하기
                            </button>

<button
  type="button"
  onClick={() => {
    // 현재 대화 중인 인물 찾기 (없으면 첫 번째 인물)
    const currentNpc = (activeSession?.sheet?.npcs || []).find(n => n.id === activeSession?.activeContactId) || activeSession?.sheet?.npcs?.[0];
    if (currentNpc) {
      setClueModalNpc(currentNpc);
    } else {
      alert("아직 만난 인물이 없습니다.");
    }
    setIsActionDrawerOpen(false);
  }}
  style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
>
  💡 취향 수첩
</button>

                               {/* 📖 4. 사건 기억 수첩 */}
          <button
            type="button"
            onClick={() => {
              setShowMemoryModal(true);
              setIsActionDrawerOpen(false);
            }}
            style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", width: "100%" }}
          >
            <span>📖</span>
            <span>사건 기억 수첩</span>
          </button>

          {/* 🖼️ 5. CG 앨범 열람 */}
          <button
            type="button"
            onClick={() => {
              setShowCgAlbumModal(true);
              setIsActionDrawerOpen(false);
            }}
            style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", width: "100%" }}
          >
            <span>🖼️</span>
            <span>CG 앨범 ({activeSession?.sheet?.unlockedCgs?.length || 0})</span>
          </button>
           
                            <div style={{ height: "1px", backgroundColor: theme.border, margin: "2px 0" }} />

                            <button
                              type="button"
                              onClick={() => {
                                setRuleHelpModal({
                                  icon: "🌸",
                                  name: "미연시 (연애 시뮬레이션)",
                                  sub: "선택지와 관계성 중심 서사",
                                  points: [
                                    { title: "호감도 (Affection)", desc: "대화와 공감, 맞춤 선물을 통해 호감도를 쌓아 다양한 엔딩에 도달합니다." },
                                    { title: "취향 수첩", desc: "대화 중 상대방이 흘린 좋아하는 것들을 수집하여 선물에 활용하세요." },
                                    { title: "답장 선택지", desc: "입력창 상단의 제안 칩을 눌러 캐릭터 성격에 맞는 대사를 쉽게 고를 수 있습니다." }
                                  ]
                                });
                                setIsActionDrawerOpen(false);
                              }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.textMuted, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              ❓ 미연시 가이드
                            </button>
                          </>
                        )}

                        {/* 4. ✍️ 자유 서사 방일 때 */}
                        {activeSession?.ruleMode === "freeform" && (
                          <>
                            <button
                              type="button"
                              onClick={() => { rollDiceDirectly(null, "1D20 운명 주사위"); setIsActionDrawerOpen(false); }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              🎲 1D20 운명 주사위
                            </button>

                            <div style={{ height: "1px", backgroundColor: theme.border, margin: "2px 0" }} />

                            <button
                              type="button"
                              onClick={() => {
                                setRuleHelpModal({
                                  icon: "✍️",
                                  name: "자유 서사",
                                  sub: "주사위 없이 즐기는 순수 텍스트 서사",
                                  points: [
                                    { title: "순수 텍스트 모드", desc: "주사위나 스탯 제약 없이 오직 롤플레잉과 문학적 서사에 집중합니다." },
                                    { title: "자유로운 호흡", desc: "기계적인 턴이나 시스템 제한 없이 자연스러운 감정선을 이어갈 수 있습니다." }
                                  ]
                                });
                                setIsActionDrawerOpen(false);
                              }}
                              style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", borderRadius: "8px", color: theme.textMuted, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              ❓ 자유 서사 가이드
                            </button>
                          </>
                        )}
                     </div>
                      </>
                    )}
                  </div>

                {/* 2. 중앙: 테두리 없는 투명 textarea */}
                <textarea 
                  value={input} 
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
                  }} 
                  onKeyDown={e => { 
                    if (!isMobile && e.key === "Enter" && !e.shiftKey) { 
                      e.preventDefault(); 
                      sendMessage(); 
                      e.target.style.height = "36px";
                    } 
                  }} 
                  onFocus={() => {
                    if (typeof window !== "undefined") window.scrollTo(0, 0);
                  }}
                  placeholder="대사나 메시지를 입력하세요..." 
                  rows={1}
                  style={{ 
                    flex: 1, 
                    height: "36px", 
                    minHeight: "36px", 
                    maxHeight: "130px", 
                    backgroundColor: "transparent", 
                    color: theme.text, 
                    border: "none", 
                    outline: "none", 
                    padding: "8px 10px", 
                    fontSize: "0.88rem", 
                    lineHeight: "1.4",
                    resize: "none"
                  }} 
                />

                {/* 3. 우측: 원형 화살표(↑) 전송 버튼 */}
                {abortController || isLoading ? (
                  <button 
                    onClick={handleCancelResponse} 
                    title="응답 중단"
                    style={{ 
                      height: "36px", 
                      width: "36px", 
                      borderRadius: "50%", 
                      backgroundColor: theme.danger || "#dc3545", 
                      color: "#fff", 
                      border: "none", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      marginBottom: "2px",
                      flexShrink: 0 
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="5" width="14" height="14" rx="2"></rect>
                    </svg>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      sendMessage();
                      const el = document.querySelector('textarea[placeholder="대사나 메시지를 입력하세요..."]');
                      if (el) el.style.height = "36px";
                    }} 
                    disabled={isLoading || !input.trim()} 
                    title="전송"
                    style={{ 
                      height: "36px", 
                      width: "36px", 
                      borderRadius: "50%", 
                      backgroundColor: input.trim() ? theme.accent : "rgba(150, 150, 150, 0.22)", 
                      color: input.trim() ? "#fff" : theme.textMuted, 
                      border: "none", 
                      cursor: input.trim() ? "pointer" : "default", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      marginBottom: "2px",
                      transition: "all 0.15s ease",
                      flexShrink: 0 
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 시트 패널 (▶ 오른쪽으로 밀면 닫힘) */}
      {activeSession && (
        <div 
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const diff = e.changedTouches[0].clientX - touchStartX;
            // 왼쪽에서 오른쪽으로 60px 이상 밀었을 때 시트 닫기
            if (diff > 60 && isSheetOpen) setIsSheetOpen(false);
            setTouchStartX(null);
          }}
         style={{ 
            position: isMobile ? "fixed" : "relative", 
            zIndex: isMobile ? 50 : 1, 
            right: 0, top: 0, bottom: 0, 
            width: isMobile ? "290px" : (isSheetOpen ? "290px" : "0px"), 
            minWidth: isMobile ? "290px" : (isSheetOpen ? "290px" : "0px"), 
            transform: isMobile ? (isSheetOpen ? "translateX(0)" : "translateX(100%)") : "none",
            transition: isMobile ? "transform 0.25s ease" : "width 0.25s ease, min-width 0.25s ease", 
            overflow: "hidden", 
            backgroundColor: theme.sidebar, 
            borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", 
            display: "flex", 
            flexDirection: "column", 
            flexShrink: 0,
            boxShadow: isMobile && isSheetOpen ? "-4px 0 20px rgba(0,0,0,0.18)" : "none"
          }}
        >
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>캐릭터 시트</span>
            {/* 🌟 PC만 저장 vs 전체 세팅 저장 분리 */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button onClick={handleSaveCurrentAsPreset} title="내 캐릭터만 저장" style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", color: theme.text, fontWeight: "700" }}>💾 PC만</button>
              <button onClick={handleSaveSessionAsLobbyPreset} title="전체 세팅 저장" style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", color: theme.text, fontWeight: "700" }}>📁 전체</button>
              <button onClick={() => setIsSheetOpen(false)} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: theme.text, marginLeft: "4px" }}>✕</button>
            </div>
          </div>

          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", height: "100%" }}>
            
            <div className="glass-card" style={{ padding: "12px", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
              <div onClick={() => { setActivePortraitTarget("pc"); openModal(setShowPortraitEditModal); }} style={{ width: "45px", height: "45px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.accent}`, flexShrink: 0, cursor: "pointer" }}>
                <img src={activeSession.sheet.portrait} alt="PC" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "0.95rem" }}>{activeSession.sheet.name}</div>
                <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{activeSession.sheet.job}</div>
              </div>
            </div>

            {/* 🌟 내 캐릭터 상세 설정 & 비밀 열람 */}
            <div className="glass-card" style={{ padding: "10px 12px", borderRadius: "10px" }}>
              <details style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent, outline: "none" }}>
                  📖 내 캐릭터 백스토리 & 비밀
                </summary>
                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
  {/* 📜 [성격 및 백스토리] 박스 */}
                  <div
                    style={{
                      padding: "12px 14px",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      lineHeight: "1.75",
                      color: theme.text,
                      fontWeight: "500",
                      whiteSpace: "pre-wrap",
                      wordBreak: "keep-all"
                    }}
                  >
                    <div style={{ fontWeight: "800", color: theme.accent, marginBottom: "8px", fontSize: "0.82rem" }}>
                      📜 성격 및 백스토리
                    </div>
                    {(() => {
                      const raw = activeSession.sheet?.background;
                      if (!raw) return "기재된 설정이 없습니다.";
                      let clean = raw.replace(/\*\*/g, "");
                      // 문장 뒤 항목명(예: '소지품:', '성격:', '배경:') 앞에 줄바꿈 및 📌 배지 자동 삽입
                      clean = clean.replace(/([.!?"]\s*)([가-힣\w\s()]{2,15}:)/g, "$1\n\n📌 $2\n");
                      return clean.trim();
                    })()}
                  </div>

  {/* 🔒 [숨겨진 비밀/사명] 박스 */}
  {activeSession.sheet?.secret && (
    <div
      style={{
        padding: "10px 12px",
        backgroundColor: "rgba(239, 68, 68, 0.06)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        borderRadius: "8px",
        fontSize: "0.8rem",
        lineHeight: "1.7",
        color: "#f87171",
        whiteSpace: "pre-wrap",
        wordBreak: "keep-all"
      }}
    >
      <div style={{ fontWeight: "800", marginBottom: "6px", fontSize: "0.82rem", color: "#f87171" }}>
        🔒 숨겨진 비밀 / 사명
      </div>
      {activeSession.sheet.secret.replace(/\*\*/g, "")}
    </div>
  )}
</div>
              </details>
            </div>

           {/* 🌟 시나리오 정보 및 개요 열람 */}
            <div className="glass-card" style={{ padding: "10px 12px", borderRadius: "10px" }}>
              <details style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent, outline: "none" }}>
                  📜 시나리오 개요 확인
                </summary>
                <div style={{ marginTop: "8px", fontSize: "0.73rem", lineHeight: "1.5", color: theme.textMuted, whiteSpace: "pre-wrap", maxHeight: "220px", overflowY: "auto", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>
                  {(() => {
                    const fullText = activeSession.scenarioText || "";
                    // 🌟 기밀/진상 앞부분(공개 시놉시스, 서막)만 쏙 잘라내기
                    const parts = fullText.split(/\[키퍼\s*전용\s*(?:기밀|진상|스포일러)[^\]]*\]/i);
                    const publicPart = parts[0]?.trim() || "시나리오 개요가 없습니다.";
                    const secretPart = parts[1]?.trim();

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div>{publicPart}</div>
                        
                        {/* 🌟 진상/엔딩 분기는 기본적으로 접혀서 가려진 채로 유지됨 */}
                        {secretPart && (
                          <details style={{ marginTop: "6px", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>
                            <summary style={{ color: theme.danger, fontWeight: "700", cursor: "pointer" }}>
                              🔒 키퍼 전용 진상/엔딩 분기 (스포일러 주의)
                            </summary>
                            <div style={{ marginTop: "6px", color: theme.danger, whiteSpace: "pre-wrap", opacity: 0.9 }}>
                              {secretPart}
                            </div>
                          </details>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </details>
            </div>

{/* 🌟 미연시 모드일 때는 [취향 & 관심사 노트], TRPG일 때는 [증거 수첩] */}
            <div className="glass-card" style={{ padding: "10px 12px", borderRadius: "10px" }}>
              <details open style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent, outline: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{activeSession.ruleMode?.startsWith("dating") ? "💡 취향 & 관심사 노트" : "📋 증거 수첩"}</span>
                  <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>{(activeSession.sheet?.clues || []).length}개</span>
                </summary>
                <div style={{ marginTop: "8px", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(!activeSession.sheet?.clues || activeSession.sheet.clues.length === 0) ? (
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, padding: "4px 0" }}>
                      {activeSession.ruleMode?.startsWith("dating") 
                        ? "상대가 좋아하는 취향이나 관심사가 아직 기록되지 않았습니다." 
                        : "아직 발견된 결정적 단서가 없습니다."}
                    </div>
                  ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {activeSession.sheet.clues
  .filter(clue => {
    const n = (clue.name || "").trim();
    if (n.length < 2 || n === "것" || n === "점" || n === "때") return false;
    // 💡 형용사/관형사형 어미(-적인, -있는, -하는, -인, -한)로 끝나면 무조건 숨김
    if (/(?:있는|없는|하는|되는|같은|않은|적인|스런|스러운|로운|[인한])$/.test(n)) return false;
    return true;
  })
  .map((clue, cIdx) => {
                    const isDislike = clue.type === "dislike";
                    return (
                      <div 
                        key={cIdx} 
                        title={clue.desc}
                        style={{ 
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 9px", 
                          backgroundColor: isDislike ? "rgba(239, 68, 68, 0.1)" : theme.panelAlt, 
                          borderRadius: "14px", 
                          fontSize: "0.74rem", 
                          fontWeight: "600",
                          border: `1px solid ${isDislike ? "rgba(239, 68, 68, 0.4)" : theme.border}`,
                          color: isDislike ? (theme.danger || "#ef4444") : theme.text
                        }}
                      >
                        <span style={{ fontSize: "0.72rem" }}>{isDislike ? "💔" : "💖"}</span>
                        <span>{clue.name.replace(/^[단은는이가을를]\s*/, "").replace(/^[가-힣]+(?:지|도)?\s*않은\s*/, "").trim()}</span>
</div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </details>
            </div>

            {/* 🌟 클라이맥스 전용: 적(에너미) 체력 게이지 카드 */}
            {activeSession.sheet?.phase === "클라이맥스" && (
              <div className="glass-card" style={{ padding: "12px", borderRadius: "10px", border: `1.5px solid ${theme.danger}`, backgroundColor: "rgba(214, 56, 87, 0.08)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.82rem", color: theme.danger }}>
                    👾 {activeSession.sheet?.enemyName || "괴이 (적)"}
                  </span>
                  <strong style={{ fontSize: "0.85rem", color: theme.danger }}>
                    HP {activeSession.sheet?.enemyHp ?? 6} / {activeSession.sheet?.maxEnemyHp ?? 6}
                  </strong>
                </div>
                {/* 체력 게이지 바 */}
                <div style={{ width: "100%", height: "6px", backgroundColor: theme.panelAlt, borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.max(0, Math.min(100, ((activeSession.sheet?.enemyHp ?? 6) / (activeSession.sheet?.maxEnemyHp ?? 6)) * 100))}%`,
                    height: "100%",
                    backgroundColor: theme.danger,
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>
            )}
   
            {/* 🌟 미연시 모드일 때는 호감도 대형 바, TRPG일 때는 SAN/HP 표시 */}
            {activeSession.ruleMode?.startsWith("dating") ? (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px", border: `1.5px solid rgba(247, 101, 133, 0.4)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.danger }}>
                    ♥ 호감도 ({activeSession.sheet.npcs?.[0]?.name || "상대방"})
                  </span>
                  <strong style={{ fontSize: "0.95rem", color: theme.danger }}>
                    {activeSession.sheet.npcs?.[0]?.affection ?? 10} / 100
                  </strong>
                </div>
                {/* 호감도 게이지 바 */}
                <div style={{ width: "100%", height: "8px", backgroundColor: theme.panelAlt, borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, activeSession.sheet.npcs?.[0]?.affection ?? 10)}%`, height: "100%", backgroundColor: theme.danger, transition: "width 0.4s ease" }} />
                </div>
                <div style={{ fontSize: "0.74rem", color: theme.textMuted, textAlign: "center" }}>
                  현재 관계: <strong style={{ color: theme.text }}>
                    {(activeSession.sheet.npcs?.[0]?.affection ?? 10) >= 80 ? "💕 깊은 유대와 애정" : (activeSession.sheet.npcs?.[0]?.affection ?? 10) >= 50 ? "✨ 미묘한 설렘 (썸)" : (activeSession.sheet.npcs?.[0]?.affection ?? 10) >= 30 ? "☕ 호감을 가진 지인" : "🌱 조심스러운 첫 만남"}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: "12px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                  <span style={{ fontWeight: "700", color: theme.danger }}>이성 (SAN):</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button onClick={() => adjustStat("san", -1)} style={{ padding: "2px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", cursor: "pointer", fontWeight: "700" }}>-</button>
                    <strong style={{ minWidth: "45px", textAlign: "center" }}>{activeSession.sheet.san} / {activeSession.sheet.maxSan}</strong>
                    <button onClick={() => adjustStat("san", 1)} style={{ padding: "2px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", cursor: "pointer", fontWeight: "700" }}>+</button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                  <span style={{ fontWeight: "700", color: theme.warning }}>생명 (HP):</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button onClick={() => adjustStat("hp", -1)} style={{ padding: "2px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", cursor: "pointer", fontWeight: "700" }}>-</button>
                    <strong style={{ minWidth: "45px", textAlign: "center" }}>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong>
                    <button onClick={() => adjustStat("hp", 1)} style={{ padding: "2px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", cursor: "pointer", fontWeight: "700" }}>+</button>
                  </div>
                </div>
                {activeSession.ruleMode === "coc" && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: theme.textMuted, borderTop: `1px dashed ${theme.border}`, paddingTop: "4px" }}>
                    <span>행운: <strong>{activeSession.sheet.luck}</strong></span>
                    <span>DB: <strong>{activeSession.sheet.db}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* 🌟 CoC 특화: 8대 특성치 & 기능치 주사위 굴림 패널 */}
            {activeSession.ruleMode === "coc" && (
              <>
                {activeSession.sheet.cocStats && (
                  <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
                    <div style={{ fontWeight: "800", fontSize: "0.76rem", marginBottom: "6px", color: theme.danger }}>📊 8대 특성치 (1D100 🎲)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                      {Object.keys(COC_STAT_LABELS).map(k => (
                        <button
                          key={k}
                          onClick={() => rollDiceDirectly(activeSession.sheet.cocStats[k], COC_STAT_LABELS[k])}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.68rem", cursor: "pointer" }}
                        >
                          <span>{COC_STAT_LABELS[k]}</span>
                          <span style={{ fontWeight: "700" }}>{activeSession.sheet.cocStats[k]}% 🎲</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSession.sheet.cocSkills && (
                  <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
                    <div style={{ fontWeight: "800", fontSize: "0.76rem", marginBottom: "6px", color: theme.accent }}>🎯 보유 기능치 (Skill 🎲)</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {parseCocSkills(activeSession.sheet.cocSkills).map((sk, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem" }}>
                          <span>{sk.name} ({sk.val}%)</span>
                          <button
                            onClick={() => rollDiceDirectly(sk.val, sk.name)}
                            style={{ padding: "2px 6px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.68rem", cursor: "pointer", fontWeight: "700" }}
                          >
                            🎲 판정
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

  {/* 🌟 인세인 특화: 사명, 광기 핸드, 특기 2D6 주사위 패널 */}
            {activeSession.ruleMode === "insane" && (
              <>
                <div className="glass-card" style={{ padding: "10px", borderRadius: "8px", fontSize: "0.72rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: theme.warning }}>공개 사명</strong>
                    <button onClick={() => triggerMadnessDirectly(activeSessionId)} style={{ padding: "2px 6px", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: "4px", fontSize: "0.65rem", fontWeight: "800", cursor: "pointer" }}>💥 광기 발현</button>
                  </div>
                  <div>{activeSession.sheet.mission}</div>
                  <div style={{ color: theme.danger, borderTop: `1px dashed ${theme.border}`, paddingTop: "4px" }}>
                    <strong>🔒 비밀:</strong> {activeSession.sheet.secret}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.76rem", color: theme.danger }}>💀 보유 광기 ({activeSession.sheet.madnessCards?.length || 0})</span>
                    <button onClick={() => drawMadnessCard(activeSessionId, false)} style={{ padding: "1px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.danger}`, borderRadius: "4px", color: theme.danger, fontSize: "0.65rem", cursor: "pointer" }}>+ 드로우</button>
                  </div>
                  {(!activeSession.sheet.madnessCards || activeSession.sheet.madnessCards.length === 0) ? (
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>보유한 광기가 없습니다.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {activeSession.sheet.madnessCards.map(c => (
                        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: c.revealed ? "rgba(214, 56, 87, 0.15)" : theme.panelAlt, border: `1px solid ${c.revealed ? theme.danger : theme.border}`, borderRadius: "4px", padding: "4px 6px", fontSize: "0.7rem" }}>
                          <span style={{ color: c.revealed ? theme.danger : theme.text }}>{c.revealed ? `🩸 ${c.name}` : `🔒 ${c.name}`}</span>
                          {!c.revealed && (
                            <button onClick={() => manifestMadnessCard(c.id, activeSessionId)} style={{ padding: "1px 6px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "3px", fontSize: "0.65rem", cursor: "pointer", fontWeight: "700" }}>발현</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {(activeSession.sheet.insaneSkills || []).length > 0 && (
                  <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
                    <div style={{ fontWeight: "800", fontSize: "0.76rem", marginBottom: "6px", color: theme.warning }}>⚔️ 습득 특기 (2D6 🎲)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {(activeSession.sheet.insaneSkills || []).map((sk, idx) => (
                        <button
                          key={idx}
                          onClick={() => rollDiceDirectly(5, `특기: ${sk}`)}
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.7rem", cursor: "pointer" }}
                        >
                          <span>{sk}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

           {/* 🌟 미연시 모드일 때는 [선물함], TRPG일 때는 [소지품] */}
            <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
              <div style={{ fontWeight: "800", fontSize: "0.78rem", marginBottom: "6px", color: theme.accent }}>
                {activeSession.ruleMode?.startsWith("dating") ? "🎁 선물함" : "🎒 소지품"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {(activeSession.sheet.items || []).map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", backgroundColor: theme.panelAlt, padding: "4px 8px", borderRadius: "6px" }}>
                    <span>{it.name}</span>
                    <button 
                      onClick={() => {
                        if (activeSession.ruleMode?.startsWith("dating")) {
                          setInput(prev => `[${it.name} 선물하기] ` + prev);
                        } else {
                          setInput(prev => `품에서 [${it.name}]을(를) 꺼내어 ` + prev);
                        }
                      }} 
                      style={{ padding: "2px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.accent, borderRadius: "4px", cursor: "pointer", fontSize: "0.68rem", fontWeight: "700" }}
                    >
                      {activeSession.ruleMode?.startsWith("dating") ? "선물하기" : "사용"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

{/* 🌟 파트너 상세 아코디언 & 비밀 블라인드 */}
<div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontWeight: "800", fontSize: "0.78rem", color: theme.accent }}>
            주요 등장인물
          </span>
          <button
            type="button"
            onClick={() => {
              const newName = prompt("추가할 등장인물의 이름을 입력하세요 (예: 유진):");
              if (!newName || !newName.trim()) return;
              const newJob = prompt(`${newName}의 직업이나 역할을 입력하세요 (예: 동료 연구원, 손님):`, "조력자");
              const newDetail = prompt(`${newName}의 외모나 관계성을 입력하세요 (선택):`, "");

              const newNpcObj = {
                id: Date.now(),
                name: newName.trim(),
                title: (newJob || "조력자").trim(),
                detail: (newDetail || "").trim(),
                portrait: typeof getPortraitUrl === "function" ? getPortraitUrl(`${newName.trim()}, portrait`) : "",
                affection: 0,
                secret: "",
                secretRevealed: false
              };

              setSessions(prev => prev.map(s => {
                if (s.id !== activeSessionId) return s;
                const oldNpcs = s.sheet?.npcs || [];
                return {
                  ...s,
                  sheet: {
                    ...s.sheet,
                    npcs: [...oldNpcs, newNpcObj]
                  }
                };
              }));
              alert(`'${newName.trim()}' 인물이 캐릭터 시트와 메신저에 등록되었습니다!`);
            }}
            style={{
              padding: "2px 8px",
              backgroundColor: theme.panelAlt,
              border: `1px solid ${theme.border}`,
              borderRadius: "4px",
              fontSize: "0.68rem",
              fontWeight: "700",
              color: theme.accent,
              cursor: "pointer"
            }}
          >
            + 인물 추가
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {(activeSession.sheet.npcs || []).map(npc => (
            <details key={npc.id} style={{ backgroundColor: theme.panelAlt, borderRadius: "6px", border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <summary style={{ display: "flex", gap: "8px", alignItems: "center", padding: "6px 8px", cursor: "pointer", outline: "none" }}>
                <div onClick={(e) => { e.stopPropagation(); setActivePortraitTarget(npc.id); openModal(setShowPortraitEditModal); }} style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
                  <img src={npc.portrait} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: "0.72rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                    <span>{npc.name}</span>
                    <span style={{ color: theme.danger }}>♥ {npc.affection}</span>
                  </div>
                  <div style={{ color: theme.textMuted, fontSize: "0.65rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{npc.title}</div>
                </div>
              </summary>
              
              {/* 드롭다운 펼쳤을 때 나오는 상세 내용 (핸드아웃 해금 상태 자동 연동) */}
              {(() => {
                const isHandoutUnlocked = (activeSession.sheet?.handouts || []).some(h => 
                  (h.npcId === npc.id || (npc.name && h.title?.includes(npc.name))) && h.revealed
                );
                const isChatUnlocked = (activeSession.messages || []).some(m =>
                  m.text.includes("조사 성공") && (m.text.includes(npc.name) || (npc.title && m.text.includes(npc.title)))
                );
                const isUnlocked = npc.secretRevealed || isHandoutUnlocked || isChatUnlocked || isScenarioEnded;

return (
  <div
    style={{
      padding: "10px 12px",
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.12)"
    }}
  >
{/* 1. 파트너 백스토리 및 설정 (가독성 최적화 & 소제목 자동 줄바꿈) */}
    <div
      style={{
        fontSize: "0.84rem",
        lineHeight: "1.7",
        color: theme.text || "#1e293b", // 👈 선명하고 뚜렷한 글자색으로 수정
        fontWeight: "500",
        whiteSpace: "pre-wrap",
        wordBreak: "keep-all",
        margin: "6px 0 10px 0"
      }}
    >
      {(() => {
        const raw = npc.desc || npc.detail;
        if (!raw) return "등록된 상세 설정이 없습니다.";
        let clean = raw.replace(/\*\*/g, ""); // ** 볼드 기호 제거
        // 문장 끝 뒤에 붙는 항목명(예: '설정 및 지위:', '계약의 계기:') 앞에 엔터 2번 + 📌 배지 자동 삽입
        clean = clean.replace(/([.!?"]\s*)([가-힣\w\s()]{2,25}:)/g, "$1\n\n📌 $2\n");
        return clean.trim();
      })()}
    </div>

    {/* 2. 비밀 구역 (해금 여부에 따른 동적 UI) */}
    {isUnlocked ? (
      <div
        style={{
          padding: "10px 12px",
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "8px",
          fontSize: "0.8rem",
          lineHeight: "1.7",
          color: "#b91c1c", // 밝혀진 비밀 텍스트도 진하게 가독성 확보
          fontWeight: "500",
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all"
        }}
      >
        <div style={{ fontWeight: "800", marginBottom: "6px", fontSize: "0.82rem", color: "#dc2626" }}>
          🔓 밝혀진 비밀 / 진심
        </div>
        {(npc.secret || "밝혀진 비밀 내용이 기재되어 있지 않습니다.").replace(/\*\*/g, "")}
      </div>
    ) : (
      <div
        style={{
          padding: "9px 12px",
          backgroundColor: "rgba(0, 0, 0, 0.03)",
          border: `1px dashed ${theme.border || "#cbd5e1"}`,
          borderRadius: "8px",
          fontSize: "0.76rem",
          color: theme.textMuted || "#64748b",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span>🔒</span>
        <span>
          <strong style={{ color: theme.danger || "#ef4444" }}>[숨겨진 비밀/진심]</strong> 아직 서사 속에서 밝혀지지 않은 비밀입니다. (조사 필요)
        </span>
      </div>
    )}
  </div>
);
              })()}
            </details>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

{/* 🌟 하단 팝업 메신저 서랍 (내 프로필 / 인앱 선물 모달 / 감성 상태메시지 완결본) */}
      {(() => {
        if (!isPhoneDrawerOpen || !activeSession || (!activeSession.ruleMode?.startsWith("dating") && !activeSession.ruleMode?.includes("free"))) return null;

        const currentContact = (activeSession.sheet?.npcs || []).find(n => n.id === activePhoneContactId);
        const partnerName = currentContact?.name || "상대방";
        const currentMsgs = (activeSession.sheet?.phoneChats || {})[activePhoneContactId] || [];

        // 총 안 읽은 메시지 수
        const phoneChats = activeSession.sheet?.phoneChats || {};
        let totalUnread = 0;
        Object.values(phoneChats).forEach(msgs => {
          totalUnread += (msgs || []).filter(m => m.unread).length;
        });

        // 드래그 제스처
        const onDragStart = (clientY) => { setDragStartY(clientY); setDragCurrentY(0); };
        const onDragMove = (clientY) => { if (dragStartY !== null && clientY - dragStartY > 0) setDragCurrentY(clientY - dragStartY); };
        const onDragEnd = () => {
          if (dragCurrentY > 90) { 
            setIsPhoneDrawerOpen(false); 
            setActivePhoneContactId(null); 
            setSelectedProfileNpc(null);
            setIsMyProfileOpen(false);
            setGiftModalNpc(null);
          }
          setDragStartY(null); setDragCurrentY(0);
        };

        // 1:1 메시지 전송
        const handleSendPhoneMessage = async () => {
          if (!phoneInput.trim() || isPhoneSending || !activeSession || !activePhoneContactId) return;
          const textToSend = phoneInput.trim();
          setPhoneInput("");
          setIsPhoneSending(true);

          const currentTime = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
          const userMsg = { id: Date.now(), sender: "user", text: textToSend, time: currentTime, unread: false };

          const oldChats = activeSession.sheet?.phoneChats || {};
          const oldList = oldChats[activePhoneContactId] || [];
          const updatedChatList = [...oldList, userMsg];

          setSessions(prev => prev.map(s => s.id === activeSessionId ? {
            ...s, sheet: { ...s.sheet, phoneChats: { ...oldChats, [activePhoneContactId]: updatedChatList } }
          } : s));

          triggerVibration("light");

          try {
            const messagesForApi = updatedChatList.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text }));
            const recentStoryContext = (activeSession.messages || []).slice(-3).map(m => m.text).join("\n\n");

// ☀️ 장르 자동 감지 (판타지/사극 vs 현대/일상)
          const fullGenreText = `${activeSession?.title || ""} ${activeSession?.preference || ""} ${activeSession?.scenarioText || ""}`.toLowerCase();
          const isFantasySetting = /판타지|중세|무협|동양|사극|황실|마법|오컬트|차원/.test(fullGenreText) || phoneTheme === "parchment";

          const statusGuide = isFantasySetting
            ? `- [판타지/시대극 배경]: 주인공이 통신석/마도구에 띄워둔 전언: "${activeSession?.sheet?.statusMessage || "(남겨진 글귀 없음)"}"
- 현대적 단어(상태메시지, 카톡 등)를 금지하고 "통신석의 글귀", "마도구 너머로 비친 심경", "남겨두신 전언"으로 격조 높게 표현하십시오.`
            : `- [현대/일상 배경]: 주인공의 메신저 프로필 상태메시지: "${activeSession?.sheet?.statusMessage || "(상태메시지 없음)"}"
- "프로필에 적어둔 상태메시지", "상메", "프로필 글귀" 등 자연스러운 일상 어휘로 언급하며 대화를 풀어가십시오.`;

          // ☀️ 상대방 인격/성격/말투 100% 고정
          const phoneContextNotice = `\n\n[🚨 메신저 톡 캐릭터 빙의 필수 수칙]
1. 당신은 지금 '${partnerName}' 본인입니다! (직업/역할: ${currentContact?.title || "인물"})
- [인물 외모 및 성격/관계성]: ${currentContact?.detail || "설정 없음"}
- [감춰둔 속마음/비밀]: ${currentContact?.secret || "없음"}

2. [말투/성격 절대 유지 (캐붕 금지)]
- 가벼운 카톡 말투(예: 'ㅋㅋ', '헤헤', 유치한 장난, 뜬금없는 반말)는 절대 금지합니다.
- 반드시 '${partnerName}' 고유의 캐릭터성(서늘하고 단아한 분위기, 차분한 어조, 절제된 태도 등)을 엄격히 지키십시오.

3. [선톡 맥락 인정]
- 위 대화의 첫 선톡은 당신(${partnerName})이 직접 보낸 문자가 맞습니다.
- 플레이어가 답장한 것이니 "내가 언제 문자를 보냈냐"며 발뺌하지 말고, 본인의 캐릭터 성격에 맞게 대화를 이어가십시오.

4. [주인공의 상태메시지/전언 인지 수칙]
${statusGuide}
- 주인공이 남겨둔 말에 특별한 감정이나 사건에 대한 단서가 담겨 있다면, ${partnerName}의 성격에 맞춰 자연스럽게 이를 화제로 삼으며 대화를 시작해도 좋습니다.

5. [일상 사진 / 스냅 사진 전송 규칙]
- 유저가 "사진 보내줘", "셀카 보여줘", "지금 뭐해?", "주변 풍경 찍어줘"라고 요청하거나 상황을 사진으로 공유하고 싶을 때는 지문 맨 끝에 아래 태그를 반드시 첨부하십시오:
<!-- SNAP_PHOTO: {"prompt": "1girl, solo, portrait, realistic lighting, anime masterpiece", "caption": "사진 한 줄 설명"} -->
- prompt는 고화질 일러스트가 생성될 수 있도록 인물의 외모와 의상이 포함된 영문(English) 키워드로 상세히 작성하십시오.`;
           
            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: messagesForApi,
                scenarioText: (activeSession.scenarioText || "") + phoneContextNotice,
                playerSheet: activeSession.sheet,
                ruleMode: "dating",
                playPreference: activeSession.preference,
                isPhoneChat: true,
                targetNpc: currentContact,
                lastStoryContext: recentStoryContext
              })
            });

            if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
            const data = await res.json();
            let rawReply = data.text || "";

            let affDelta = null;
            const affMatch = rawReply.match(/<!--\s*AFFECTION:\s*(\{.*?\})\s*-->/i);
            if (affMatch) { try { affDelta = JSON.parse(affMatch[1]); } catch(e) {} rawReply = rawReply.replace(affMatch[0], ""); }

            let newClue = null;
            const clueMatch = rawReply.match(/<!--\s*CLUE:\s*(\{.*?\})\s*-->/i);
            if (clueMatch) { try { newClue = JSON.parse(clueMatch[1]); } catch(e) {} rawReply = rawReply.replace(clueMatch[0], ""); }

            const suggMatch = rawReply.match(/<!--\s*SUGGESTIONS:\s*(\[.*?\])\s*-->/i);
            if (suggMatch) { try { setPhoneSuggestions(JSON.parse(suggMatch[1])); } catch(e) {} rawReply = rawReply.replace(suggMatch[0], ""); }
            else { setPhoneSuggestions([]); }

         // 📷 [메신저 전용] 일상 스냅 사진 감지 & 스마트 Fallback
            let snapPhotoUrl = null;
            const snapMatch = rawReply.match(/<!--\s*SNAP_PHOTO:\s*(\{[\s\S]*?\})\s*-->/i);
            if (snapMatch) {
              try {
                const snapData = JSON.parse(snapMatch[1]);
                const p = snapData.prompt || snapData.photo || snapData.caption || "beautiful scenery, anime masterpiece";
                snapPhotoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=800&height=1000&nologo=true`;
              } catch (e) {}
              rawReply = rawReply.replace(snapMatch[0], "");
            }

            // 🌟 메신저 채팅 중 사진 요청 시 Fallback 자동 생성
            if (!snapPhotoUrl) {
              const combinedReply = `${textToSend} ${rawReply}`.toLowerCase();
              if (/사진|셀카|스냅|찍|포토|보여줘/.test(combinedReply)) {
                let topicPrompt = "aesthetic daily snapshot, soft lighting, anime masterpiece";
                if (/진열장|쇼케이스|장식장/.test(combinedReply)) {
                  topicPrompt = "vintage glass display showcase with warm subtle lighting, antique boutique, highly detailed, anime aesthetic";
                } else if (/카페|차|커피/.test(combinedReply)) {
                  topicPrompt = "cozy warm cafe table with hot cup, soft sunlight, anime aesthetic";
                }
                snapPhotoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topicPrompt)}?width=800&height=1000&nologo=true`;
              }
            }

            if (snapPhotoUrl) {
              setUnlockedCgList(prev => prev.includes(snapPhotoUrl) ? prev : [...prev, snapPhotoUrl]);
              triggerToast("📷 사진 도착", "새로운 일상 스냅 사진이 도착했습니다.");
            }
           
            const cleanReply = rawReply.replace(/<!--.*?-->/gs, "").trim();
           const npcReply = { id: Date.now() + 1, sender: "npc", text: cleanReply, time: currentTime, photo: snapPhotoUrl };

            setSessions(prev => {
              const session = prev.find(s => s.id === activeSessionId);
              if (!session) return prev;
              let sSheet = { ...session.sheet };
              const prevChats = sSheet.phoneChats || {};
              sSheet.phoneChats = { ...prevChats, [activePhoneContactId]: [...(prevChats[activePhoneContactId] || []), npcReply] };

              if (affDelta && (affDelta.value !== undefined || affDelta.affection !== undefined)) {
                const incomingRaw = Number(affDelta.value !== undefined ? affDelta.value : affDelta.affection);
                const currentAff = currentContact?.affection ?? 10;
                const safeDiff = Math.max(-5, Math.min(3, incomingRaw - currentAff));
                sSheet.npcs = (sSheet.npcs || []).map(n => n.id === activePhoneContactId ? { ...n, affection: Math.max(0, Math.min(100, currentAff + safeDiff)) } : n);
              }
              if (newClue && newClue.name) {
                sSheet.clues = [...(sSheet.clues || []), { id: Date.now(), name: newClue.name, desc: newClue.desc || "" }];
              }
              return prev.map(s => s.id === activeSessionId ? { ...s, sheet: sSheet } : s);
            });

            triggerVibration("medium");
          } catch(err) { alert("전송 실패: " + err.message); }
          finally { setIsPhoneSending(false); }
        };

        return (
          <div
            onClick={() => { 
              setIsPhoneDrawerOpen(false); 
              setActivePhoneContactId(null); 
              setSelectedProfileNpc(null);
              setIsMyProfileOpen(false);
              setGiftModalNpc(null);
            }}
            onMouseMove={e => onDragMove(e.clientY)}
            onMouseUp={onDragEnd}
            style={{ position: "fixed", inset: 0, zIndex: 125, display: "flex", justifyContent: "center", alignItems: "flex-end", backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: "460px", height: "82vh", maxHeight: "740px",
                backgroundColor: activePhoneSkin.shellBg, color: activePhoneSkin.text,
                borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column",
                overflow: "hidden", border: `1.5px solid ${activePhoneSkin.border}`, borderBottom: "none",
                boxShadow: "0 -8px 36px rgba(0,0,0,0.38)", transform: `translateY(${dragCurrentY}px)`,
                transition: dragStartY === null ? "transform 0.2s ease-out" : "none",
                position: "relative"
              }}
            >
              {/* 상단 헤더 바 */}
              <div
                onMouseDown={e => onDragStart(e.clientY)}
                onTouchStart={e => onDragStart(e.touches[0].clientY)}
                onTouchMove={e => onDragMove(e.touches[0].clientY)}
                onTouchEnd={onDragEnd}
                style={{ height: "48px", padding: "0 16px", borderBottom: `1px solid ${activePhoneSkin.border}`, backgroundColor: activePhoneSkin.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, cursor: "grab", userSelect: "none" }}
              >
                <div style={{ width: "60px" }}>
                  {(activePhoneContactId !== null || selectedProfileNpc !== null || isMyProfileOpen) && (
                    <button 
                      type="button" 
                      onClick={() => {
                        if (isMyProfileOpen) setIsMyProfileOpen(false);
                        else if (selectedProfileNpc) setSelectedProfileNpc(null);
                        else setActivePhoneContactId(null);
                      }} 
                      style={{ background: "none", border: "none", color: activePhoneSkin.navBtn, fontSize: "0.85rem", cursor: "pointer", fontWeight: "800" }}
                    >
                      〈 뒤로
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <div style={{ width: "36px", height: "4px", backgroundColor: activePhoneSkin.textMuted, borderRadius: "2px", opacity: 0.5 }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: "800", color: activePhoneSkin.text }}>
                    {isMyProfileOpen ? "내 프로필" : selectedProfileNpc ? "프로필 상세" : activePhoneContactId !== null ? partnerName : phoneNavTab === "contacts" ? "인연" : phoneNavTab === "chats" ? "대화" : "더보기"}
                  </span>
                </div>
                <div style={{ width: "60px", display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setIsPhoneDrawerOpen(false); setActivePhoneContactId(null); setSelectedProfileNpc(null); setIsMyProfileOpen(false); setGiftModalNpc(null); }} style={{ background: "none", border: "none", color: activePhoneSkin.navBtn, fontSize: "1.1rem", cursor: "pointer", lineHeight: 1 }}>
                    ✕
                  </button>
                </div>
              </div>

{/* 🔔 핸드폰 내부 실시간 전화 수신 화면 */}
        {incomingCall && (
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "48px 24px 40px",
            animation: "fadeIn 0.25s ease"
          }}>
            {/* 상단: 발신자 정보 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #10b981",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                animation: "pulse 1.5s infinite"
              }}>
                {incomingCall.caller?.portrait ? (
                  <img src={incomingCall.caller.portrait} alt="발신자" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                    👤
                  </div>
                )}
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#f8fafc" }}>
                  {incomingCall.caller?.name || "알 수 없는 발신자"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "600", marginTop: "4px" }}>
                  수신 전화...
                </div>
              </div>
            </div>

            {/* 하단: 통화 거절(빨강) / 수락(초록) 버튼 */}
            <div style={{ display: "flex", justifyContent: "space-around", width: "100%", maxWidth: "240px" }}>
              {/* 거절 버튼 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setIncomingCall(null);
                    setIsPhoneDrawerOpen(false);
                  }}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "1.4rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)"
                  }}
                >
                  📵
                </button>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>거절</span>
              </div>

              {/* 수락 버튼 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceCallNpc(incomingCall.caller);
                    setIsVoiceCallActive(true);
                    setIsCallModalOpen(true);
                    setIncomingCall(null);
                  }}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "1.4rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)"
                  }}
                >
                  📞
                </button>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>응답</span>
              </div>
            </div>
          </div>
        )}

{/* 🌟 [화면 1: 내 프로필 상세 뷰] */}
              {isMyProfileOpen ? (
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", backgroundColor: activePhoneSkin.shellBg }}>
                

                  {/* 히어로 프로필 영역 (상단 여백 시원하게 확보) */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 24px 20px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "12px" }}>
                      {activeSession.sheet?.job || "조사원"}
                    </span>

                    {/* 터치 시 크게보기 */}
                    <div 
                      onClick={() => setZoomedPortrait(activeSession.sheet?.portrait)}
                      title="사진 크게 보기"
                      style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: `3px solid ${activePhoneSkin.accent}`, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", marginBottom: "14px", cursor: "zoom-in" }}
                    >
                      <img src={activeSession.sheet?.portrait} alt="내 프로필" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <div style={{ fontWeight: "800", fontSize: "1.25rem", color: activePhoneSkin.text }}>
                      {activeSession.sheet?.name || "주인공"}
                    </div>

                  {/* 상태 메시지 및 ✏️ 수정 버튼 */}
      <div style={{ fontSize: "0.8rem", color: activePhoneSkin.textMuted, marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        <span>
          {activeSession?.sheet?.statusMessage ? `"${activeSession.sheet.statusMessage}"` : "새겨진 전언이 없습니다."}
        </span>
        <button
          type="button"
          title="오늘의 전언 수정"
          onClick={() => {
            const currentMsg = activeSession?.sheet?.statusMessage || "";
            const newMsg = window.prompt("통신석에 띄울 오늘의 전언(상태 메시지)을 입력하세요:", currentMsg);
            if (newMsg !== null) {
              setSessions(prev => prev.map(s => {
                if (s.id !== activeSessionId) return s;
                return {
                  ...s,
                  sheet: {
                    ...s.sheet,
                    statusMessage: newMsg.trim()
                  }
                };
              }));
            }
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.85rem",
            padding: "2px",
            lineHeight: 1
          }}
        >
          ✏️
        </button>
      </div>
                  </div>

                  {/* 하단 상세 정보 카드 */}
                  <div style={{ flex: 1, backgroundColor: activePhoneSkin.panelAlt, borderTop: `1px solid ${activePhoneSkin.border}`, borderRadius: "24px 24px 0 0", padding: "20px 20px 40px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "10px" }}>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>신분 / 직책</div>
                      <div style={{ fontSize: "0.85rem", color: activePhoneSkin.text, fontWeight: "700", marginTop: "3px" }}>{activeSession.sheet?.job || "미정"}</div>
                    </div>

                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "10px" }}>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>백스토리 및 성격</div>
                      <div style={{ fontSize: "0.78rem", color: activePhoneSkin.text, lineHeight: "1.6", marginTop: "3px", whiteSpace: "pre-wrap" }}>
                        {activeSession.sheet?.background || "설정된 내용이 없습니다."}
                      </div>
                    </div>

                    {activeSession.sheet?.secret && (
                      <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "10px" }}>
                        <div style={{ fontSize: "0.68rem", color: activePhoneSkin.heart, fontWeight: "800" }}>나의 비밀 / 사명</div>
                        <div style={{ fontSize: "0.78rem", color: activePhoneSkin.heart, lineHeight: "1.5", marginTop: "3px" }}>
                          {activeSession.sheet.secret}
                        </div>
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "6px" }}>소지품 가방</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {(activeSession.sheet?.items || []).map((it, idx) => (
                          <span key={idx} style={{ padding: "4px 10px", backgroundColor: activePhoneSkin.shellBg, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "14px", fontSize: "0.72rem", color: activePhoneSkin.text }}>
                            📦 {it.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedProfileNpc ? (
                /* 🌟 [화면 2: 상대방 프로필 상세 뷰 (의미없는 표시 제거 및 여백 확보)] */
                <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", backgroundColor: activePhoneSkin.shellBg }}>
                

                  {/* 히어로 프로필 영역 (상단 여백 시원하게 내려서 확보) */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 20px 24px 20px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "12px" }}>
                      {selectedProfileNpc.title || "등장인물"}
                    </span>

                    {/* 터치 시 사진 크게보기 */}
                    <div 
                      onClick={() => setZoomedPortrait(selectedProfileNpc.portrait)}
                      title="사진 크게 보기"
                      style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: `3px solid ${activePhoneSkin.accent}`, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", marginBottom: "14px", cursor: "zoom-in" }}
                    >
                      <img src={selectedProfileNpc.portrait} alt={selectedProfileNpc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <div style={{ fontWeight: "800", fontSize: "1.25rem", color: activePhoneSkin.text }}>
                      {selectedProfileNpc.name}
                    </div>

                    <div style={{ fontSize: "0.82rem", color: activePhoneSkin.textMuted, marginTop: "6px" }}>
                      {selectedProfileNpc.statusMessage || `"${selectedProfileNpc.detail?.slice(0, 32) || '대화 가능'}"`}
                    </div>
                  </div>

                  {/* 🌟 플로팅 액션 바 (1:1 대화 / 선물하기 / 취향 수첩) */}
                  <div style={{ margin: "0 16px 16px 16px", zIndex: 5, backgroundColor: activePhoneSkin.panelAlt, borderRadius: "20px", border: `1px solid ${activePhoneSkin.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-around", padding: "12px 8px" }}>
                  
                 {/* 📞 1. 전화 걸기 (맨 앞 배치) */}
        <button
          type="button"
          onClick={() => {
            const target = selectedProfileNpc;
            if (!target) return;

            // 1. 창 상태 정리 및 통화 화면 오픈
            setIsPhoneDrawerOpen(false);
            setSelectedProfileNpc(null);
            setIsVoiceCallActive(true);
            setVoiceCallNpc(target);
            setIsCallModalOpen(true);
            setInput(""); // 입력창을 비워둡니다.

            const callMsg = `${target.name}에게 전화를 건다.`;
            if (typeof executeMessage === "function") {
              executeMessage(callMsg);
            }
          }}
          style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
        >
          <span style={{ fontSize: "1.25rem" }}>📞</span>
          <span style={{ fontSize: "0.72rem", fontWeight: "800" }}>전화 걸기</span>
        </button>
         
                   <button
                      type="button"
                      onClick={() => {
                        setActivePhoneContactId(selectedProfileNpc.id);
                        setSelectedProfileNpc(null);
                      }}
                      style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activePhoneSkin.text }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>💬</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: "800" }}>1:1 대화</span>
                    </button>
                     
                    <button
                      type="button"
                      onClick={() => setGiftModalNpc(selectedProfileNpc)}
                      style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activePhoneSkin.text }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>🎁</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: "800" }}>선물하기</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClueModalNpc(selectedProfileNpc)}
                      style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activePhoneSkin.text }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>💡</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: "800" }}>취향 수첩</span>
                    </button>
                  </div>

                  {/* 하단 카드 섹션 */}
                  <div style={{ flex: 1, backgroundColor: activePhoneSkin.panelAlt, borderTop: `1px solid ${activePhoneSkin.border}`, borderRadius: "24px 24px 0 0", padding: "18px 20px 40px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {/* 호감도 게이지 바 */}
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.72rem", color: activePhoneSkin.heart, fontWeight: "800" }}>♥ 정서적 유대감</span>
                        <span style={{ fontSize: "0.76rem", color: activePhoneSkin.heart, fontWeight: "800" }}>{selectedProfileNpc.affection ?? 10} / 100</span>
                      </div>
                      <div style={{ width: "100%", height: "6px", backgroundColor: activePhoneSkin.shellBg, borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, selectedProfileNpc.affection ?? 10)}%`, height: "100%", backgroundColor: activePhoneSkin.heart, transition: "width 0.3s ease" }} />
                      </div>
                    </div>

                    {/* 외모 및 특징 메모 */}
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "12px" }}>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>외모 및 특징 메모</div>
                      <div style={{ fontSize: "0.78rem", color: activePhoneSkin.text, lineHeight: "1.5", marginTop: "3px", whiteSpace: "pre-wrap" }}>
                        {selectedProfileNpc.detail || "기록된 특징이 없습니다."}
                      </div>
                    </div>

                    {/* 수집된 취향 목록 */}
                    <div id="npc-clues-section" style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "12px" }}>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "6px" }}>발견된 취향 & 관심사</div>
                      {(() => {
                       const npcClues = (activeSession.sheet?.clues || [])
              .filter(c => {
                const n = (c.name || "").trim();
                // 1) '것', '점', 1글자 단독 단어 제외
                if (n.length < 2 || n === "것" || n === "점" || n === "때") return false;
                // 2) 어미가 ~있는, ~없는 등으로 끝나는 불완전 어구 제외
                if (/(?:있는|없는|하는|되는|같은)$/.test(n)) return false;

                return (
                  c.name.includes(selectedProfileNpc.name) ||
                  c.npcName === selectedProfileNpc.name ||
                  (activeSession.sheet?.npcs || []).length <= 1
                );
              });
                        if (npcClues.length === 0) return <div style={{ fontSize: "0.74rem", color: activePhoneSkin.textMuted }}>대화를 통해 좋아하는 취향을 파악해 보세요.</div>;
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {npcClues.map((clue, cIdx) => (
                              <div key={cIdx} style={{ fontSize: "0.74rem", borderLeft: `2px solid ${activePhoneSkin.accent}`, paddingLeft: "8px" }}>
                                <strong style={{ color: activePhoneSkin.accent }}>{clue.name}</strong>
                                <div style={{ color: activePhoneSkin.textMuted, fontSize: "0.68rem" }}>{clue.desc}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* 숨겨진 비밀 */}
                    <div>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.heart, fontWeight: "800" }}>🔒 은밀한 진실 / 비밀</div>
                      <div style={{ fontSize: "0.76rem", color: selectedProfileNpc.secretRevealed ? activePhoneSkin.heart : activePhoneSkin.textMuted, marginTop: "3px" }}>
                        {selectedProfileNpc.secretRevealed ? (selectedProfileNpc.secret || "비밀이 없습니다.") : "서사 진행을 통해 해금할 수 있습니다."}
                      </div>
                    </div>

{/* 📞 상대방과의 최근 통화 기록 모아보기 */}
{(() => {
  // 현재 보고 있는 NPC와의 통화 기록 블록 추출
  const callBlocks = [];
  let tempBlock = [];

  (activeSession?.messages || []).forEach((m) => {
    const isThisNpcCall =
      (m.isCall || m.isVoiceCall) &&
      (m.callNpc === selectedProfileNpc?.name || (!m.callNpc && activeSession.sheet?.npcs?.[0]?.name === selectedProfileNpc?.name));

    if (isThisNpcCall) {
      tempBlock.push(m);
    } else if (tempBlock.length > 0) {
      callBlocks.push([...tempBlock]);
      tempBlock = [];
    }
  });
  if (tempBlock.length > 0) callBlocks.push([...tempBlock]);

  if (callBlocks.length === 0) return null;

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{
        fontSize: "0.8rem",
        fontWeight: "800",
        color: activePhoneSkin.accent || "#f43f5e",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>📞</span>
          <span>마도 통화 기록</span>
          <span style={{ fontSize: "0.7rem", color: activePhoneSkin.textMuted || "#94a3b8" }}>
            ({callBlocks.length}건)
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {callBlocks.map((block, bIdx) => (
          <details
            key={bIdx}
            style={{
              backgroundColor: activePhoneSkin.panelAlt || "rgba(30, 41, 59, 0.7)",
              borderRadius: "10px",
              border: `1px solid ${activePhoneSkin.bubbleBorder || "rgba(244, 63, 94, 0.25)"}`,
              overflow: "hidden"
            }}
          >
            <summary style={{
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: "700",
              color: activePhoneSkin.text || "#e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              userSelect: "none"
            }}>
              <span>통화 #{bIdx + 1} ({block.length}회 대화)</span>
              <span style={{ fontSize: "0.7rem", color: activePhoneSkin.textMuted || "#94a3b8" }}>
                대화 열기 ▼
              </span>
            </summary>

            <div style={{
              padding: "10px 12px",
              borderTop: `1px solid ${activePhoneSkin.bubbleBorder || "rgba(255, 255, 255, 0.08)"}`,
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "180px",
              overflowY: "auto"
            }}>
              {block.map((cm, cIdx) => (
                <div key={cIdx} style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                  <span style={{
                    fontWeight: "800",
                    color: cm.role === "user" ? (activePhoneSkin.accentText || "#60a5fa") : (activePhoneSkin.heart || "#fb7185"),
                    marginRight: "6px"
                  }}>
                    {cm.role === "user" ? (activeSession?.sheet?.userName || "나") : selectedProfileNpc?.name}:
                  </span>
                  <span style={{ color: activePhoneSkin.text || "#cbd5e1" }}>
                    {cm.text}
                  </span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
})()}

                       {/* 📸 인물 전용 갤러리 & 해금 CG 섹션 */}
      <div style={{ marginTop: "14px", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "12px" }}>
        <div style={{ fontSize: "0.76rem", fontWeight: "800", color: activePhoneSkin.text, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>📸</span>
          <span>공유된 사진 및 해금 CG</span>
        </div>

        {(() => {
          // 해당 인물과 연관된 일러스트/사진만 필터링
          const targetCgs = (activeSession?.sheet?.unlockedCgs || []).filter(cg =>
            cg.npcName === selectedProfileNpc?.name ||
            cg.npcId === selectedProfileNpc?.id ||
            (cg.title && cg.title.includes(selectedProfileNpc?.name))
          );

          if (targetCgs.length === 0) {
            return (
              <div style={{ padding: "14px 0", textAlign: "center", fontSize: "0.72rem", color: activePhoneSkin.textMuted }}>
                아직 {selectedProfileNpc?.name}의 특별한 사진이나 CG가 없습니다.
              </div>
            );
          }

          return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
              {targetCgs.map((cg, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (cg.imageUrl) window.open(cg.imageUrl, "_blank");
                  }}
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: "6px",
                    overflow: "hidden",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    cursor: cg.imageUrl ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {cg.imageUrl ? (
                    <img src={cg.imageUrl} alt={cg.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "1.2rem" }}>🎨</span>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </div>
                  </div>
                </div>
              ) : activePhoneContactId !== null ? (
                /* ── [화면 3: 1:1 대화방] ── */
                <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: activePhoneSkin.chatBg }}>
                  <div style={{ padding: "8px 16px", borderBottom: `1px solid ${activePhoneSkin.border}`, backgroundColor: activePhoneSkin.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div onClick={() => setSelectedProfileNpc(currentContact)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} title="프로필 상세 열기">
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", overflow: "hidden", border: `1px solid ${activePhoneSkin.border}` }}>
                        <img src={currentContact?.portrait} alt={partnerName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <span style={{ fontWeight: "800", fontSize: "0.82rem", color: activePhoneSkin.text }}>{currentContact?.title || "1:1 연결"}</span>
                      <span style={{ fontSize: "0.68rem", color: activePhoneSkin.accent }}>ℹ️</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: activePhoneSkin.heart, fontWeight: "800" }}>♥ {currentContact?.affection}</span>
                  </div>

                  <div ref={phoneChatContainerRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {currentMsgs.length === 0 ? (
                      <div style={{ textAlign: "center", color: activePhoneSkin.textMuted, fontSize: "0.78rem", margin: "auto" }}>
                        대화 기록이 없습니다.<br />아래 인풋창에서 메시지를 건네보세요!
                      </div>
                    ) : (
                      currentMsgs.map((m, idx) => {
                        const isUser = m.sender === "user";
                        const isRead = currentMsgs.slice(idx + 1).some(next => next.sender === "npc");

                        return (
                          <div key={m.id || idx} style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "80%", display: "flex", flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-end", gap: "6px" }}>
                            {!isUser && (
                              <div onClick={() => setSelectedProfileNpc(currentContact)} style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginBottom: "2px", border: `1px solid ${activePhoneSkin.border}`, cursor: "pointer" }} title="프로필 보기">
                                <img src={currentContact?.portrait} alt="상대" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            )}
                            <div style={{ backgroundColor: isUser ? activePhoneSkin.userBubbleBg : activePhoneSkin.npcBubbleBg, color: isUser ? activePhoneSkin.userBubbleText : activePhoneSkin.npcBubbleText, border: isUser ? "none" : `1px solid ${activePhoneSkin.npcBubbleBorder}`, padding: "9px 13px", borderRadius: isUser ? "14px 2px 14px 14px" : "2px 14px 14px 14px", fontSize: "0.84rem", lineHeight: "1.5", whiteSpace: "pre-wrap", wordBreak: "break-word", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                              
                              {/* 📷 NPC가 보낸 일상 스냅 사진 렌더링 (클릭 시 크게보기) */}
                              {m.photo && (
                                <div 
                                  onClick={() => setZoomedPortrait(m.photo)} 
                                  style={{ marginBottom: "8px", borderRadius: "10px", overflow: "hidden", cursor: "zoom-in", border: `1px solid ${activePhoneSkin.border}` }}
                                >
                                  <img src={m.photo} alt="전송된 사진" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }} />
                                </div>
                              )}

                              {m.text}
                            </div>

                             <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: "2px", flexShrink: 0, marginBottom: "2px" }}>
                              {isUser && !isRead && (
                                <span style={{ fontSize: "0.68rem", color: "#fee500", fontWeight: "800", lineHeight: 1 }}>1</span>
                              )}
                              <span style={{ fontSize: "0.62rem", color: activePhoneSkin.textMuted }}>{m.time || ""}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {isPhoneSending && (
                      <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "6px", maxWidth: "80%" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginBottom: "2px", border: `1px solid ${activePhoneSkin.border}` }}>
                          <img src={currentContact?.portrait} alt="상대" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ backgroundColor: activePhoneSkin.npcBubbleBg, border: `1px solid ${activePhoneSkin.npcBubbleBorder}`, padding: "10px 14px", borderRadius: "2px 14px 14px 14px", display: "flex", alignItems: "center", gap: "4px", height: "36px" }}>
                          <span className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: activePhoneSkin.textMuted, display: "inline-block", animationDelay: "0s" }} />
                          <span className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: activePhoneSkin.textMuted, display: "inline-block", animationDelay: "0.2s" }} />
                          <span className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: activePhoneSkin.textMuted, display: "inline-block", animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {phoneSuggestions.length > 0 && (
                    <div style={{ flexShrink: 0, display: "flex", gap: "6px", overflowX: "auto", padding: "6px 12px", backgroundColor: activePhoneSkin.headerBg, borderTop: `1px solid ${activePhoneSkin.border}`, whiteSpace: "nowrap" }}>
                      {phoneSuggestions.map((sugg, sIdx) => (
                        <button key={sIdx} type="button" onClick={() => setPhoneInput(sugg)} style={{ padding: "4px 10px", backgroundColor: activePhoneSkin.panelAlt, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "14px", color: activePhoneSkin.text, fontSize: "0.72rem", cursor: "pointer" }}>{sugg}</button>
                      ))}
                    </div>
                  )}

                  <div style={{ flexShrink: 0, padding: "10px 12px", backgroundColor: activePhoneSkin.headerBg, borderTop: `1px solid ${activePhoneSkin.border}`, display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleSendPhoneMessage(); }}
                      placeholder={`${partnerName}에게 전할 말...`}
                      style={{ flex: 1, padding: "10px 14px", backgroundColor: activePhoneSkin.inputBg, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "20px", color: activePhoneSkin.inputText, fontSize: "0.84rem", outline: "none" }}
                    />
                    <button
                      type="button"
                      onClick={handleSendPhoneMessage}
                      disabled={isPhoneSending || !phoneInput.trim()}
                      style={{ padding: "0 18px", height: "38px", backgroundColor: activePhoneSkin.accent, color: activePhoneSkin.accentText, border: "none", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer", flexShrink: 0 }}
                    >
                      전송
                    </button>
                  </div>
                </div>
              ) : (
                /* ── [화면 4: 메신저 메인 (3단 탭바)] ── */
                <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  
                  {/* [탭 1: 인연] */}
                  {phoneNavTab === "contacts" && (
                    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 0" }}>
                      <div style={{ padding: "4px 16px 8px 16px", fontSize: "0.72rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>내 프로필</div>
                      <div 
                        onClick={() => setIsMyProfileOpen(true)}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: `1px solid ${activePhoneSkin.border}`, marginBottom: "8px", cursor: "pointer" }}
                      >
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${activePhoneSkin.border}`, flexShrink: 0 }}>
                          <img src={activeSession.sheet?.portrait} alt="나" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "800", fontSize: "0.9rem", color: activePhoneSkin.text }}>{activeSession.sheet?.name || "주인공"}</div>
                          <div style={{ fontSize: "0.72rem", color: activePhoneSkin.textMuted }}>
                            {activeSession.sheet?.statusMessage ? `"${activeSession.sheet.statusMessage}"` : (activeSession.sheet?.job || "상태 메시지를 설정하세요.")}
                          </div>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: activePhoneSkin.textMuted }}>〉</span>
                      </div>

{/* 👥 대화 기록에 등장한 인물 자동 인식 목록 추출 */}
              {(() => {
                const fullChat = (activeSession.messages || []).map(m => m.text || m.content || "").join(" ");
const unlockedList = activeSession.sheet?.unlockedContacts || [];
const metNpcs = (activeSession.sheet?.npcs || []).filter(npc => {
  if (npc.hasContact || npc.unlocked) return true;
  if (unlockedList.includes(npc.name) || unlockedList.some(u => npc.name?.includes(u))) return true;
  if ((activeSession.sheet?.phoneChats || {})[npc.id]?.length > 0) return true;

  // 대화 기록에 풀네임이나 첫 단어가 등장했거나 번호 교환 시 즉시 등록
  const npcFirstName = npc.name?.split(" ")[0];
  return (
    (npc.name && fullChat.includes(npc.name)) ||
    (npcFirstName && npcFirstName.length > 1 && fullChat.includes(npcFirstName))
  );
});
                return (
                  <>
                    <div style={{ padding: "4px 16px 6px 16px", fontSize: "0.72rem", color: activePhoneSkin.textMuted, fontWeight: "bold" }}>
                      교류 중인 인물 ({ metNpcs.length })
                    </div>

                    {/* 📭 해금된 연락처가 없을 때 띄울 안내문 */}
                    {metNpcs.length === 0 && (
                      <div style={{ padding: "36px 16px", textAlign: "center", color: activePhoneSkin.textMuted, fontSize: "0.78rem", lineHeight: 1.6 }}>
                        📭 아직 등록된 연락처가 없습니다.<br />
                        서사 속에서 인물과 만나 연락처를 교환해 보세요.
                      </div>
                    )}

                    {/* 👥 교류 중인 인물 목록 노출 */}
                    {metNpcs.map(npc => {
                      const chats = (activeSession.sheet?.phoneChats || {})[npc.id] || [];
                      const lastMsg = chats[chats.length - 1];
                      const initialStatus = npc.quote 
                        ? `"${npc.quote}"`
                        : npc.personality 
                          ? `${npc.personality}`
                          : npc.role 
                            ? `${npc.role}`
                            : "연락 가능";
        // 서사 진행 중 AI가 바꿔준 statusMessage가 있으면 그걸 쓰고, 없으면 시트 기본 정보 노출
        const quoteText = npc.statusMessage ? `"${npc.statusMessage}"` : initialStatus;

            // ── 2. 호감도 차오름 계산 (-100 ~ 100) ──
            const aff = Number(npc.affection ?? 0);
            const fillPercent = Math.max(0, Math.min(100, aff));
            const isNegative = aff < 0;

            return (
              <div
                key={npc.id}
                onClick={() => setSelectedProfileNpc(npc)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", cursor: "pointer", borderBottom: `1px solid ${activePhoneSkin.border}` }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, backgroundColor: "#e2e8f0" }}>
                  <img src={npc.portrait} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.85rem", color: activePhoneSkin.text }}>{npc.name}</span>
                    
                    {/* ── 3. 호감도에 따라 아래서부터 차오르는 하트 ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {isNegative ? (
                        <span style={{ fontSize: "0.82rem" }}>💔</span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" style={{ overflow: "visible" }}>
                          <defs>
                            {/* 수직 그라데이션: 아래(y1=1)에서 위(y2=0)로 차오름 */}
                            <linearGradient id={`heartGrad-${npc.id}`} x1="0" y1="1" x2="0" y2="0">
                              <stop offset={`${fillPercent}%`} stopColor={activePhoneSkin.heart || "#f43f5e"} />
                              <stop offset={`${fillPercent}%`} stopColor="rgba(148, 163, 184, 0.3)" />
                            </linearGradient>
                          </defs>
                          <path
                            fill={`url(#heartGrad-${npc.id})`}
                            stroke={fillPercent > 0 ? (activePhoneSkin.heart || "#e11d48") : "#94a3b8"}
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          />
                        </svg>
                      )}
                      <span style={{ fontSize: "0.72rem", fontWeight: "800", color: isNegative ? "#64748b" : activePhoneSkin.heart }}>
                        {aff}
                      </span>
                    </div>
                  </div>

                  {/* 상태 메시지 텍스트 */}
                  <div style={{ fontSize: "0.73rem", color: activePhoneSkin.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {quoteText}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        );
      })()}
    </div>
  )}

  {/* [탭 2: 대화 / 서신 목록] */}
    {phoneNavTab === "chats" && (() => {
      // 1. 실제로 대화(chats)를 주고받은 기록이 1개 이상 있는 인물만 필터링
      const activeChatNpcs = (activeSession?.sheet?.npcs || []).filter(npc => {
        const chats = (activeSession?.sheet?.phoneChats || {})[npc.id] || [];
        return chats.length > 0;
      });

      return (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <div style={{ padding: "10px 16px 6px 16px", fontSize: "0.72rem", color: activePhoneSkin.textMuted }}>
            {activeChatNpcs.length > 0 ? "주고받은 서신 목록" : "진행 중인 대화가 없습니다."}
          </div>

          {activeChatNpcs.length === 0 ? (
            /* 대화 내역이 없을 때 뜨는 감성적인 안내창 */
            <div style={{ textAlign: "center", padding: "60px 20px", color: activePhoneSkin.textMuted, fontSize: "0.82rem", lineHeight: "1.6" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>✉️</div>
              아직 나누고 있는 서신이 없습니다.<br />
              <span 
                onClick={() => setPhoneNavTab("contacts")} 
                style={{ color: activePhoneSkin.accent, fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}
              >
                [인연]
              </span>과 아직 대화를 나눈 적 없습니다.
            </div>
          ) : (
            /* 대화 기록이 있는 인물들만 출력 */
            activeChatNpcs.map(npc => {
              const chats = (activeSession.sheet?.phoneChats || {})[npc.id] || [];
              const lastMsg = chats[chats.length - 1];
              const unread = chats.filter(m => m.unread).length;

              return (
                <div
                  key={npc.id}
                  onClick={() => {
                    setActivePhoneContactId(npc.id);
                    // 읽음 처리 로직
                    setSessions(prev => prev.map(s => {
                      if (s.id !== activeSessionId) return s;
                      const pChats = s.sheet?.phoneChats || {};
                      const updated = (pChats[npc.id] || []).map(m => ({ ...m, unread: false }));
                      return { ...s, sheet: { ...s.sheet, phoneChats: { ...pChats, [npc.id]: updated } } };
                    }));
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${activePhoneSkin.border}` }}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                    <img src={npc.portrait} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontWeight: "800", fontSize: "0.85rem", color: activePhoneSkin.text }}>{npc.name}</span>
                      {lastMsg?.timestamp && (
                        <span style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted }}>{lastMsg.timestamp}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "0.74rem", color: activePhoneSkin.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lastMsg?.text || "새 메시지가 도착했습니다."}
                      </div>
                      {unread > 0 && (
                        <span style={{ backgroundColor: activePhoneSkin.heart || "#e11d48", color: "#fff", fontSize: "0.65rem", padding: "1px 6px", borderRadius: "10px", fontWeight: "bold" }}>
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      );
    })()}

                  {/* [탭 3: 더보기 / 설정] */}
                  {phoneNavTab === "settings" && (
                    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: "800", color: activePhoneSkin.text }}>🎨 메신저 테마 스킨</span>
                          <span style={{ fontSize: "0.74rem", color: activePhoneSkin.accent, fontWeight: "800" }}>{activePhoneSkin.name}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                          {Object.entries(PHONE_SKINS).map(([k, sk]) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => handleSelectPhoneTheme(k)}
                              style={{
                                padding: "10px 4px", borderRadius: "10px",
                                border: `1.5px solid ${phoneTheme === k ? activePhoneSkin.accent : activePhoneSkin.border}`,
                                backgroundColor: phoneTheme === k ? activePhoneSkin.panelAlt : "transparent",
                                color: activePhoneSkin.text, fontSize: "0.74rem", fontWeight: phoneTheme === k ? "800" : "500",
                                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"
                              }}
                            >
                              <span style={{ fontSize: "1.1rem" }}>{sk.icon}</span>
                              <span>{sk.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: "800", color: activePhoneSkin.text }}>📳 스마트폰 알림 진동</span>
                          <span style={{ fontSize: "0.74rem", color: activePhoneSkin.accent, fontWeight: "800" }}>
                            {vibrationLevel === "off" ? "끄기" : vibrationLevel === "light" ? "약하게" : vibrationLevel === "medium" ? "보통" : "강하게"}
                          </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                          {[
                            { k: "off", l: "끄기" }, { k: "light", l: "약하게" },
                            { k: "medium", l: "보통" }, { k: "strong", l: "강하게" }
                          ].map(opt => (
                            <button
                              key={opt.k}
                              type="button"
                              onClick={() => handleSaveVibration(opt.k)}
                              style={{
                                padding: "8px 0", borderRadius: "8px",
                                border: `1.5px solid ${vibrationLevel === opt.k ? activePhoneSkin.accent : activePhoneSkin.border}`,
                                backgroundColor: vibrationLevel === opt.k ? activePhoneSkin.panelAlt : "transparent",
                                color: activePhoneSkin.text, fontSize: "0.74rem", fontWeight: vibrationLevel === opt.k ? "800" : "500",
                                cursor: "pointer"
                              }}
                            >
                              {opt.l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

{/* 🌟 3단 하단 탭 네비게이션 바 (활성 탭 캡슐형 하이라이트 완벽 적용) */}
                  <div style={{ height: "56px", borderTop: `1px solid ${activePhoneSkin.border}`, backgroundColor: activePhoneSkin.headerBg, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 10px", flexShrink: 0 }}>
                    {/* [1. 인연 탭] */}
                    <button
                      type="button"
                      onClick={() => setPhoneNavTab("contacts")}
                      style={{
                        background: phoneNavTab === "contacts" ? activePhoneSkin.panelAlt : "transparent",
                        border: `1px solid ${phoneNavTab === "contacts" ? activePhoneSkin.border : "transparent"}`,
                        borderRadius: "14px",
                        boxShadow: phoneNavTab === "contacts" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                        padding: "6px 20px",
                        color: phoneNavTab === "contacts" ? activePhoneSkin.accent : activePhoneSkin.textMuted,
                        opacity: phoneNavTab === "contacts" ? 1 : 0.55,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                        fontWeight: phoneNavTab === "contacts" ? "800" : "500",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{ fontSize: "1.1rem", transform: phoneNavTab === "contacts" ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }}>👤</span>
                      <span style={{ fontSize: "0.68rem" }}>인연</span>
                    </button>

                    {/* [2. 대화 탭 (안 읽은 메시지 뱃지 포함)] */}
                    <button
                      type="button"
                      onClick={() => setPhoneNavTab("chats")}
                      style={{
                        position: "relative",
                        background: phoneNavTab === "chats" ? activePhoneSkin.panelAlt : "transparent",
                        border: `1px solid ${phoneNavTab === "chats" ? activePhoneSkin.border : "transparent"}`,
                        borderRadius: "14px",
                        boxShadow: phoneNavTab === "chats" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                        padding: "6px 20px",
                        color: phoneNavTab === "chats" ? activePhoneSkin.accent : activePhoneSkin.textMuted,
                        opacity: phoneNavTab === "chats" ? 1 : 0.55,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                        fontWeight: phoneNavTab === "chats" ? "800" : "500",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{ fontSize: "1.1rem", transform: phoneNavTab === "chats" ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }}>💬</span>
                      <span style={{ fontSize: "0.68rem" }}>대화</span>
                      {totalUnread > 0 && (
                        <span style={{ position: "absolute", top: "2px", right: "8px", backgroundColor: activePhoneSkin.heart, color: "#fff", borderRadius: "10px", minWidth: "15px", height: "15px", padding: "0 4px", fontSize: "0.58rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                          {totalUnread}
                        </span>
                      )}
                    </button>

                    {/* [3. 더보기 탭] */}
                    <button
                      type="button"
                      onClick={() => setPhoneNavTab("settings")}
                      style={{
                        background: phoneNavTab === "settings" ? activePhoneSkin.panelAlt : "transparent",
                        border: `1px solid ${phoneNavTab === "settings" ? activePhoneSkin.border : "transparent"}`,
                        borderRadius: "14px",
                        boxShadow: phoneNavTab === "settings" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                        padding: "6px 20px",
                        color: phoneNavTab === "settings" ? activePhoneSkin.accent : activePhoneSkin.textMuted,
                        opacity: phoneNavTab === "settings" ? 1 : 0.55,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                        fontWeight: phoneNavTab === "settings" ? "800" : "500",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span style={{ fontSize: "1.1rem", transform: phoneNavTab === "settings" ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }}>⚙️</span>
                      <span style={{ fontSize: "0.68rem" }}>더보기</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 🌟 [프로필 사진 크게 보기 (라이트박스 오버레이)] */}
              {zoomedPortrait && (
                <div 
                  onClick={() => setZoomedPortrait(null)}
                  style={{ position: "absolute", inset: 0, zIndex: 140, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", cursor: "zoom-out" }}
                >
                  <div style={{ width: "100%", maxWidth: "300px", aspectRatio: "1/1", borderRadius: "20px", overflow: "hidden", border: `2px solid ${activePhoneSkin.accent}`, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
                    <img src={zoomedPortrait} alt="크게보기" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", marginTop: "14px" }}>화면을 터치하면 닫힙니다</span>
                </div>
              )}

            </div>
          </div>
        );
      })()}

        
      {/* 설정 모달 */}
{/* 🌟 화면 상단 플로팅 토스트 배너 */}
      {appToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 165,
            backgroundColor: "rgba(35, 35, 35, 0.92)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "20px",
            fontSize: "0.82rem",
            fontWeight: "700",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.15)",
            pointerEvents: "none"
          }}
        >
          {appToast}
        </div>
      )}

      {/* 🌟 로비 세팅 저장 인앱 모달 (기존 prompt 대체) */}
      {lobbySaveModal && (
        <div
          onClick={() => setLobbySaveModal(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 145, padding: "20px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass-card"
            style={{ width: "100%", maxWidth: "340px", padding: "20px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "800", fontSize: "0.95rem" }}>💾 로비 세팅 저장</span>
              <button type="button" onClick={() => setLobbySaveModal(null)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
              현재 설정된 시나리오와 캐릭터 프로필 전체를 프리셋으로 저장합니다.
            </div>

            <input
              type="text"
              value={lobbySaveInput}
              onChange={e => setLobbySaveInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") confirmSaveLobbyPreset(); }}
              placeholder="세팅 이름을 입력하세요..."
              autoFocus
              style={{ width: "100%", padding: "10px 12px", backgroundColor: theme.inputBg, border: `1.5px solid ${theme.accent}`, borderRadius: "10px", color: theme.text, fontSize: "0.85rem", outline: "none" }}
            />

            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setLobbySaveModal(null)}
                style={{ flex: 1, padding: "9px 0", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmSaveLobbyPreset}
                style={{ flex: 1.5, padding: "9px 0", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer" }}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

{/* 🌟 대화 취소 / 롤백 확인 인앱 모달 */}
      {pendingRollback && (
        <div
          onClick={() => setPendingRollback(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 140, padding: "20px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass-card"
            style={{ width: "100%", maxWidth: "320px", padding: "22px 18px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", boxShadow: "0 14px 36px rgba(0,0,0,0.35)" }}
          >
            <span style={{ fontSize: "2rem", lineHeight: 1 }}>⎌</span>
            <div>
              <div style={{ fontWeight: "800", fontSize: "0.95rem", marginBottom: "4px" }}>마지막 대화 취소</div>
              <div style={{ fontSize: "0.75rem", color: theme.textMuted, lineHeight: "1.5" }}>
                마지막 대사를 취소하고 입력창에 불러올까요?<br />
                직전 턴의 상태(호감도, 선물함)로 롤백됩니다.
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", width: "100%", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => setPendingRollback(null)}
                style={{ flex: 1, padding: "10px 0", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  const { text, index, prevSheet } = pendingRollback;
                  setInput(text);
                  setSessions(prev => prev.map(s => {
                    if (s.id !== activeSessionId) return s;
                    const newMsgs = s.messages.slice(0, index);
                    return {
                      ...s,
                      sheet: prevSheet ? prevSheet : s.sheet,
                      messages: newMsgs,
                      suggestedActions: [],
                      pendingCheck: null
                    };
                  }));
                  setPendingRollback(null);
                }}
                style={{ flex: 1, padding: "10px 0", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer" }}
              >
                되돌리기
              </button>
            </div>
          </div>
        </div>
      )}

        {/* 🌟 [여기 추가!] 룰 설명 (? 버튼) 전용 팝업 모달 */}
        {ruleHelpModal && (
          <div 
            onClick={() => setRuleHelpModal(null)} 
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 160, padding: "20px" }}
          >
            <div 
              onClick={e => e.stopPropagation()} 
              className="glass-card" 
              style={{ width: "100%", maxWidth: "440px", padding: "22px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", gap: "12px", maxHeight: "80vh", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.2rem" }}>{ruleHelpModal.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800" }}>{ruleHelpModal.name}</h3>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{ruleHelpModal.sub}</div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setRuleHelpModal(null)} 
                  style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", paddingRight: "4px" }}>
                {ruleHelpModal.points?.map((pt, idx) => (
                  <div key={idx} style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", fontSize: "0.82rem", color: theme.accent, marginBottom: "4px" }}>
                      • {pt.title}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: theme.text, lineHeight: "1.6" }}>
                      {pt.desc}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={() => setRuleHelpModal(null)} 
                style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "0.82rem", cursor: "pointer", marginTop: "4px" }}
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* 🌟 기존 설정 모달 시작 부분 */}
        {showSettingsModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "22px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>⚙️ 환경 설정</h3>
              <button onClick={() => closeModal(setShowSettingsModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* 1. 테마 선택 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700" }}>2026 팬톤 테마 팔레트</label>
                  <span style={{ fontSize: "0.75rem", color: theme.accent }}>{isDarkMode ? "🌙 나이트" : "☀️ 라이트"}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {Object.entries(THEME_PALETTES).map(([k, p]) => (
                    <button key={k} onClick={() => handleSelectPalette(k)} style={{ padding: "8px", borderRadius: "6px", border: `1.5px solid ${currentPalette === k ? theme.accent : theme.border}`, backgroundColor: currentPalette === k ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: currentPalette === k ? "700" : "400" }}>{p.name}</button>
                  ))}
                </div>
              </div>

              {/* 2. 본문 글씨체 선택 */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>
                  본문 서사 글씨체
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  <button 
                    type="button" 
                    onClick={() => setFontChoice("maru")} 
                    style={{ padding: "8px", borderRadius: "6px", border: `1.5px solid ${fontChoice === "maru" ? theme.accent : theme.border}`, backgroundColor: fontChoice === "maru" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: fontChoice === "maru" ? "800" : "400" }}
                  >
                    📖 리디바탕 (명조체)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFontChoice("gothic")} 
                    style={{ padding: "8px", borderRadius: "6px", border: `1.5px solid ${fontChoice === "gothic" ? theme.accent : theme.border}`, backgroundColor: fontChoice === "gothic" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: fontChoice === "gothic" ? "800" : "400" }}
                  >
                    📱 프리텐다드 (고딕체)
                  </button>
                </div>
              </div>

              {/* 3. 볼륨 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", marginBottom: "4px" }}>
                  <span>주사위 효과음 볼륨</span>
                  <span>{Math.round(soundVolume * 100)}%</span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input type="range" min="0" max="1" step="0.05" value={soundVolume} onChange={e => handleSaveVolume(Number(e.target.value))} style={{ flex: 1 }} />
                  <button onClick={playDiceSound} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", fontSize: "0.72rem", cursor: "pointer" }}>🔊 테스트</button>
                </div>
              </div>

{/* 🌟 3-2. 스마트폰 알림 진동(햅틱) 설정 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}>
                  <span>스마트폰 알림 진동 (햅틱)</span>
                  <span style={{ fontSize: "0.75rem", color: theme.accent }}>
                    {vibrationLevel === "off" ? "🔇 끄기" : vibrationLevel === "light" ? "📳 부드럽게" : vibrationLevel === "medium" ? "📳 보통" : "📳 강하게"}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginBottom: "6px" }}>
                  {[
                    { k: "off", l: "끄기" },
                    { k: "light", l: "부드럽게" },
                    { k: "medium", l: "보통" },
                    { k: "strong", l: "강하게" }
                  ].map(opt => (
                    <button
                      key={opt.k}
                      type="button"
                      onClick={() => handleSaveVibration(opt.k)}
                      style={{
                        padding: "6px 0",
                        borderRadius: "6px",
                        border: `1.5px solid ${vibrationLevel === opt.k ? theme.accent : theme.border}`,
                        backgroundColor: vibrationLevel === opt.k ? theme.panelAlt : "transparent",
                        color: theme.text,
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        fontWeight: vibrationLevel === opt.k ? "700" : "400"
                      }}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => triggerVibration(vibrationLevel)}
                  style={{ width: "100%", padding: "6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer", fontWeight: "600" }}
                >
                  📳 진동 테스트
                </button>
              </div>

              {/* 4. 백업 및 복원 */}
              <div style={{ display: "flex", gap: "8px", borderTop: `1px dashed ${theme.border}`, paddingTop: "10px" }}>
                <button onClick={() => openModal(setShowBackupModal)} style={{ flex: 1, padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "700" }}>💾 백업</button>
                <label style={{ flex: 1, padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "700", textAlign: "center" }}>📤 복원<input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} /></label>
              </div>
            </div>
          </div>
        </div>
      )}
                
     {/* 🌟 [개선] 초상화 대형 뷰어 & 인라인 수정 모달 */}
      {showPortraitEditModal && (() => {
        // 현재 선택된 대상의 이름, 직업, 현재 초상화 이미지 주소 추출
        let targetName = "내 캐릭터";
        let targetJob = "";
        let targetUrl = "";

        if (activeSession) {
          if (activePortraitTarget === "pc") {
            targetName = activeSession.sheet?.name || "내 캐릭터";
            targetJob = activeSession.sheet?.job || "";
            targetUrl = activeSession.sheet?.portrait || "";
          } else {
            const npc = (activeSession.sheet?.npcs || []).find(n => n.id === activePortraitTarget);
            targetName = npc?.name || "파트너";
            targetJob = npc?.title || "";
            targetUrl = npc?.portrait || "";
          }
        } else {
          if (activePortraitTarget === "pc") {
            targetName = charName || "내 캐릭터";
            targetJob = charJob || "";
            targetUrl = charPortraitUrl || "";
          } else {
            const kpc = kpcList.find(k => k.id === activePortraitTarget);
            targetName = kpc?.name || "파트너";
            targetJob = kpc?.job || "";
            targetUrl = kpc?.portraitUrl || "";
          }
        }

        return (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 130, padding: "16px" }}>
            <div className="glass-card" style={{ width: "100%", maxWidth: "380px", padding: "20px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", gap: "14px", maxHeight: "90vh", overflowY: "auto" }}>
              
              {/* 상단 타이틀 바 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800" }}>{targetName}</h3>
                  {targetJob && <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{targetJob}</div>}
                </div>
                <button 
                  onClick={() => { 
                    setIsEditingPortrait(false); 
                    closeModal(setShowPortraitEditModal); 
                  }} 
                  style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {/* 🌟 1. 대형 초상화 뷰어 영역 */}
              <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: "14px", overflow: "hidden", border: `1.5px solid ${theme.border}`, backgroundColor: theme.panelAlt, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.15)" }}>
                {targetUrl ? (
                  <img src={targetUrl} alt={targetName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ fontSize: "0.85rem", color: theme.textMuted, textAlign: "center" }}>등록된 이미지가 없습니다.</div>
                )}
              </div>

              {/* 🌟 2. 하단 컨트롤러: 수정하기 버튼 또는 수정 입력 폼 */}
              {!isEditingPortrait ? (
                <button
                  onClick={() => setIsEditingPortrait(true)}
                  style={{ width: "100%", padding: "11px", backgroundColor: theme.panelAlt, border: `1.5px solid ${theme.accent}`, color: theme.accent, borderRadius: "10px", fontWeight: "800", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s ease" }}
                >
                  ✏️ 초상화 이미지 변경하기
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: `1px dashed ${theme.border}`, paddingTop: "12px" }}>
                  <label style={{ display: "block", width: "100%", padding: "10px", backgroundColor: theme.panelAlt, border: `1.5px dashed ${theme.accent}`, borderRadius: "8px", textAlign: "center", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700", color: theme.accent }}>
                    📁 컴퓨터에서 새 파일 업로드
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        handlePortraitFileUpload(e);
                        setIsEditingPortrait(false);
                      }} 
                      style={{ display: "none" }} 
                    />
                  </label>

                  <div style={{ textAlign: "center", fontSize: "0.7rem", color: theme.textMuted }}>또는 AI 프롬프트 / 새 이미지 URL</div>

                  <input 
                    type="text" 
                    value={customPortraitPrompt} 
                    onChange={e => setCustomPortraitPrompt(e.target.value)} 
                    placeholder="예: silver hair girl / https://..." 
                    style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} 
                  />

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => setIsEditingPortrait(false)} 
                      style={{ flex: 1, padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.textMuted, borderRadius: "8px", cursor: "pointer", fontSize: "0.78rem" }}
                    >
                      취소
                    </button>
                    <button 
                      onClick={() => {
                        applyCustomPortrait();
                        setIsEditingPortrait(false);
                      }} 
                      style={{ flex: 2, padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.78rem" }}
                    >
                      변경 적용
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {showPresetModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>📂 캐릭터 프리셋 목록</h3>
              <button onClick={() => closeModal(setShowPresetModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
              {customPresets.length === 0 ? (
                <div style={{ fontSize: "0.78rem", color: theme.textMuted, textAlign: "center", padding: "20px 0" }}>저장된 프리셋이 없습니다.<br/>(시트 상단 💾 버튼을 누르면 저장됩니다)</div>
              ) : (
                customPresets.map(p => (
                  <div key={p.id} onClick={() => handleLoadPreset(p)} style={{ padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", cursor: "pointer", display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <span><strong>{p.title}</strong> ({p.name})</span>
                    <button onClick={(e) => { e.stopPropagation(); setCustomPresets(customPresets.filter(it => it.id !== p.id)); }} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer" }}>🗑️</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

{/* 🌟 로비 프리셋 모달 (공식 시나리오 / 내 세팅 완벽 분리) */}
      {showLobbyPresetModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "460px", padding: "20px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", gap: "14px", maxHeight: "85vh" }}>
            
            {/* 상단 타이틀 & 닫기 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800" }}>
                {lobbyPresetTab === "public" ? "⭐ 공식 시나리오" : "📁 내 저장 세팅 보관함"}
              </h3>
              <button onClick={() => closeModal(setShowLobbyPresetModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>

            {/* 내 세팅일 때만 백업/복원 버튼 표시 */}
            {lobbyPresetTab === "local" && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={exportLobbyPresets} title="모든 내 세팅을 한 파일로 백업" style={{ flex: 1, padding: "7px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.74rem", cursor: "pointer", fontWeight: "700" }}>
                  📦 전체 세팅 백업
                </button>
                <label title="외부 JSON 파일 불러오기" style={{ flex: 1, padding: "7px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.74rem", cursor: "pointer", fontWeight: "700", textAlign: "center" }}>
                  📤 JSON 파일 복원
                  <input type="file" accept=".json" onChange={importLobbyPresets} style={{ display: "none" }} />
                </label>
              </div>
            )}

            {/* 프리셋 리스트 영역 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto", maxHeight: "360px", paddingRight: "2px" }}>
              
{/* 1. ⭐ 공식 시나리오 (대소문자/속성명/한글 완벽 호환 만능 카테고리 파서) */}
              {lobbyPresetTab === "public" && (() => {
                if (!officialPresets || officialPresets.length === 0) {
                  return (
                    <div style={{ fontSize: "0.82rem", color: theme.textMuted, textAlign: "center", padding: "30px 0" }}>
                      등록된 공식 시나리오가 없습니다.
                    </div>
                  );
                }

                // 🌟 대문자(COC, DATING), 소문자, 한글(크툴루, 미연시), 속성명(wizardMode, ruleMode 등) 모두 판별!
               const getNormalizedMode = (p) => {
  // 1. 기존 필드 확인
  const raw = (p.wizardMode || p.ruleMode || p.rule || p.mode || "").toString().toLowerCase().trim();
  if (raw.includes("free") || raw.includes("자유") || raw.includes("소설")) return "freeform";
  if (raw.includes("coc") || raw.includes("크툴루") || raw.includes("cthulhu")) return "coc";
  if (raw.includes("insane") || raw.includes("인세인")) return "insane";
  if (raw.includes("dating") || raw.includes("미연시") || raw.includes("연애")) return "dating";

  // 🌟 2. 필드가 없을 경우: 본문 텍스트에서 자동 유추 (Fallback)
  const fullText = `${p.presetTitle || ""} ${p.scenarioTitle || ""} ${p.hiddenTruth || ""} ${p.playPreference || ""}`.toLowerCase();
  if (fullText.includes("호감도") || fullText.includes("미연시") || fullText.includes("데이트")) return "dating";
  if (fullText.includes("이성") || fullText.includes("san") || fullText.includes("크툴루")) return "coc";
  if (fullText.includes("광기") || fullText.includes("사명") || fullText.includes("인세인")) return "insane";

  return "dating"; // 기본값으로 미연시에 배치
};

                // 4대 카테고리 + 기타
                const CATEGORIES = [
                  { key: "freeform", label: "자유 서사", icon: "✍️" },
                  { key: "coc", label: "CoC (크툴루의 부름)", icon: "🐙" },
                  { key: "insane", label: "inSANe (인세인)", icon: "🎲" },
                  { key: "dating", label: "미연시", icon: "🌸" },
                  { key: "other", label: "추천 시나리오", icon: "✨" }
                ];

                // 시나리오가 있는 카테고리만 골라내기
                let activeSections = CATEGORIES.map(cat => ({
                  ...cat,
                  presets: officialPresets.filter(p => getNormalizedMode(p) === cat.key)
                })).filter(cat => cat.presets.length > 0);

                // 🌟 비상 안전장치: 혹시라도 룰 구분이 전부 빗나가도 시나리오를 숨기지 않고 싹 다 출력!
                if (activeSections.length === 0 && officialPresets.length > 0) {
                  activeSections = [{
                    key: "all",
                    label: "공식 추천 시나리오",
                    icon: "⭐",
                    presets: officialPresets
                  }];
                }

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {activeSections.map((sec, secIdx) => (
                      <div key={sec.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        
                        {/* 카테고리 헤더 (스케치 반영) */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "2px 2px 0 2px" }}>
                          <span style={{ fontSize: "0.95rem" }}>{sec.icon}</span>
                          <span style={{ fontSize: "0.86rem", fontWeight: "900", color: theme.text }}>
                            {sec.label}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: theme.textMuted, fontWeight: "700" }}>
                            ({sec.presets.length})
                          </span>
                        </div>

                        {/* 카테고리에 속한 시나리오 목록 */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {sec.presets.map((p, pIdx) => {
                            const displayRule = (p.wizardMode || p.ruleMode || p.rule || "STORY").toString().toUpperCase();
                            return (
                              <div 
                                key={p.id || pIdx} 
                                style={{ 
                                  padding: "10px 12px", 
                                  backgroundColor: theme.panelAlt, 
                                  borderRadius: "10px", 
                                  display: "flex", 
                                  justifyContent: "space-between", 
                                  alignItems: "center", 
                                  gap: "8px" 
                                }}
                              >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: "800", fontSize: "0.84rem", color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {p.presetTitle || p.scenarioTitle || "시나리오"}
                                  </div>
                                  <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    룰: <strong style={{ color: theme.accent }}>{displayRule}</strong> {p.playPreference ? `· ${p.playPreference}` : ""}
                                  </div>
                                </div>


<div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => handleLoadLobbyPreset(p)}
        title="시나리오 바로 적용"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "34px",
          height: "34px",
          backgroundColor: theme.accent,
          border: "none",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "0.95rem",
          fontWeight: "900",
          cursor: "pointer"
        }}
      >
        {">"}
      </button>
    </div>
  </div>
);
                          })}
                        </div>

                        {/* 카테고리 사이를 나누는 깔끔한 가로 구분선 */}
                        {secIdx < activeSections.length - 1 && (
                          <div style={{ height: "1.5px", backgroundColor: theme.border, margin: "10px 0 4px 0", opacity: 0.8 }} />
                        )}

                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* 2. 📁 내 저장 세팅만 단독 표시 */}
              {lobbyPresetTab === "local" && (
                lobbyPresets.length === 0 ? (
                  <div style={{ fontSize: "0.78rem", color: theme.textMuted, textAlign: "center", padding: "30px 0", lineHeight: "1.6" }}>
                    저장된 내 세팅이 없습니다.<br />
                    (상단의 <strong>[💾]</strong> 아이콘을 눌러 현재 세팅을 저장할 수 있습니다)
                  </div>
                ) : (
                  lobbyPresets.map((p) => (
                    <div key={p.id} style={{ padding: "10px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "800", fontSize: "0.84rem", color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.presetTitle}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>
                          PC: {p.charName || "미상"} · KPC: {p.kpcList?.length || 0}명 · {p.wizardMode?.toUpperCase()}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "5px", alignItems: "center", flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => exportSingleLobbyPreset(p)}
                          title="이 세팅만 1개의 JSON 파일로 저장"
                          style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}
                        >
                          📥 저장
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadLobbyPreset(p)}
                          style={{ padding: "5px 12px", backgroundColor: theme.accent, border: "none", borderRadius: "6px", color: "#fff", fontSize: "0.72rem", cursor: "pointer", fontWeight: "800" }}
                        >
                          적용 ➔
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`'${p.presetTitle}' 세팅을 삭제하시겠습니까?`)) {
                              const filtered = lobbyPresets.filter(it => it.id !== p.id);
                              setLobbyPresets(filtered);
                              localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(filtered));
                            }
                          }}
                          style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px", fontSize: "0.85rem" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

            </div>
          </div>
        </div>
      )}

      {showBackupModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "400px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem" }}>💾 세이브 백업</h3>
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              <button onClick={() => setBackupFormat("json")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${backupFormat === "json" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "json" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>JSON</button>
              <button onClick={() => setBackupFormat("txt")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${backupFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>TXT</button>
            </div>
            <button onClick={executeSaveBackup} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.8rem" }}>다운로드</button>
          </div>
        </div>
      )}

      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>💾 데이터 관리 (내보내기 & 백업)</h3>
              <button onClick={() => closeModal(setShowExportModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: "700" }}>내보낼 세션 선택:</label>
              <button 
                type="button" 
                onClick={() => {
                  if (selectedExportSessionIds.length === sessions.length) setSelectedExportSessionIds([]);
                  else setSelectedExportSessionIds(sessions.map(s => s.id));
                }} 
                style={{ background: "none", border: "none", color: theme.accent, fontSize: "0.72rem", cursor: "pointer" }}
              >
                {selectedExportSessionIds.length === sessions.length ? "선택 해제" : "전체 선택"}
              </button>
            </div>
            <div style={{ maxHeight: "110px", overflowY: "auto", border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "6px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {sessions.map(s => (
                <label key={s.id} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedExportSessionIds.includes(s.id)} 
                    onChange={(e) => {
                      if (e.checked) setSelectedExportSessionIds([...selectedExportSessionIds, s.id]);
                      else setSelectedExportSessionIds(selectedExportSessionIds.filter(id => id !== s.id));
                    }} 
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
                </label>
              ))}
            </div>

            <label style={{ fontSize: "0.75rem", color: theme.textMuted, display: "block", marginBottom: "4px" }}>내보내기 범위:</label>
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              <button onClick={() => setExportScope("all")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${exportScope === "all" ? theme.accent : theme.border}`, backgroundColor: exportScope === "all" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>전체 기록</button>
              <button onClick={() => setExportScope("storyOnly")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${exportScope === "storyOnly" ? theme.accent : theme.border}`, backgroundColor: exportScope === "storyOnly" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>순수 서사만</button>
            </div>

            <label style={{ fontSize: "0.75rem", color: theme.textMuted, display: "block", marginBottom: "4px" }}>파일 형식 (포맷):</label>
            <select value={exportFormat} onChange={e => setExportFormat(e.target.value)} style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.8rem", marginBottom: "14px" }}>
              <option value="txt">📄 텍스트 메모장 문서 (.txt)</option>
              <option value="md">📝 마크다운 서식 문서 (.md)</option>
              <option value="pdf">🖨️ 전자책 PDF 인쇄 (.pdf)</option>
              <option value="json">📦 게임 세이브 완전 백업 (.json - 복원 가능)</option>
            </select>

            <button onClick={executeExport} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.82rem" }}>다운로드 / 실행</button>
          </div>
        </div>
      )}

{/* 🌟 1. 인게임 인세인 룰 설명서 모달 */}
      {showInsaneGuideModal && (
        <div
          onClick={() => setShowInsaneGuideModal(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 160, padding: "20px" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass-card"
            style={{ width: "100%", maxWidth: "520px", maxHeight: "85vh", overflowY: "auto", borderRadius: "18px", padding: "22px", color: theme.text, display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>📖 인세인(inSANe) 정규 규칙 가이드</span>
              <button onClick={() => setShowInsaneGuideModal(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", color: theme.text, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.82rem", lineHeight: "1.65" }}>
              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <strong style={{ color: theme.warning }}>• 페이즈와 장면의 흐름 (사이클)</strong><br />
                인세인은 [도입 ➔ 메인 ➔ 클라이맥스 ➔ 에필로그]로 진행됩니다. 메인 페이즈에서는 1사이클마다 자신의 '장면'을 열어 자유롭게 대화를 나누고, 장면당 딱 1번의 [주요 행동]을 선언할 수 있습니다. 할 일을 마치면 [+] 서랍에서 [장면 닫기]를 누르세요.
              </div>

              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <strong style={{ color: theme.accent }}>• 3대 주요 행동: 조사 / 감정 / 회복</strong><br />
                1. <strong>조사</strong>: 현장의 단서나 다른 인물의 [비밀], [거처], [정신상태]를 파헤칩니다.<br />
                2. <strong>감정</strong>: 동행자와 주사위를 굴려 플러스(+) 혹은 마이너스(-) 감정을 맺습니다.<br />
                3. <strong>회복</strong>: 휴식을 취해 생명력이나 이성치를 1점 회복하거나, 동행자의 미공개 광기를 치료합니다.
              </div>

              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <strong style={{ color: theme.success }}>• 66개 특기와 대용 판정 (거리 계산)</strong><br />
                내가 배운 특기는 주사위 목표치가 기본 '5'로 낮아 성공하기 쉽습니다. 배우지 않은 특기 행동을 할 때는, 내가 배운 가장 가까운 특기로 건너가 판정합니다. 이때 표에서 떨어진 칸수(거리)만큼 목표치가 1씩 올라가 판정이 어려워집니다.
              </div>

              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <strong style={{ color: theme.danger }}>• 광기와 착란 (공포의 연쇄)</strong><br />
                주사위 판정에서 펌블(2)이 뜨거나 공포 판정에 실패하면 [미공개 광기]를 뽑습니다. 광기는 숨겨져 있다가 조건(트리거)이 맞으면 수면 위로 드러납니다(현재화). 현재화된 광기의 수가 내 현재 이성치보다 많아지면 통제 불능인 [착란] 상태에 빠집니다.
              </div>

              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <strong style={{ color: theme.warning }}>• 클라이맥스 전투와 플롯 (속도 대결)</strong><br />
                모든 사이클이 끝나면 최종 결전이 열립니다. 모두가 1~6번 플롯(속도)을 몰래 정해 동시에 공개하며, 같은 숫자가 겹치면 부딪혀 서로 1점의 피해를 입습니다(버팅). 세션 중 단 1번, 내 비밀을 밝히며 [회상]으로 역전타를 노릴 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 2. 감정 맺기 선택 모달 (취소 ✕ 버튼 탑재) */}
      {emotionModal && (
        <div 
          onClick={() => setEmotionModal(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 155, padding: "20px" }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="glass-card" 
            style={{ width: "100%", maxWidth: "340px", padding: "20px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <span style={{ fontWeight: "800", fontSize: "0.95rem" }}>💬 감정 판정 (1D6 ➔ {emotionModal.roll}번)</span>
              <button 
                type="button"
                onClick={() => setEmotionModal(null)} 
                style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
            
           {/* 🎯 감정 대상 인물 선택 & 극성 결정 UI */}
    {(() => {
      const npcList = (activeSession?.sheet?.npcs && activeSession.sheet.npcs.length > 0) 
        ? activeSession.sheet.npcs 
        : (activeSession?.sheet?.kpcList || []);
      const selectedIdx = emotionModal.selectedTargetIdx ?? 0;
      const selectedNpc = npcList[selectedIdx] || npcList[0];

      return (
        <>
          {/* 1. 대상 인물 선택 드롭다운 */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "0.78rem", color: theme.textMuted, marginBottom: "6px", fontWeight: "700" }}>
              🎯 감정을 부여할 대상 (인물 선택):
            </label>
            <select
              value={selectedIdx}
              onChange={(e) => setEmotionModal(prev => ({ ...prev, selectedTargetIdx: Number(e.target.value) }))}
              style={{
                width: "100%",
                padding: "8px 10px",
                backgroundColor: theme.inputBg || "#24242a",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                color: theme.text,
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {npcList.map((npc, idx) => (
                <option key={npc.id || idx} value={idx}>
                  {npc.name ? `${npc.name} (${npc.job || "등장인물"})` : `인물 ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* 2. 극성 선택 안내 */}
          <div style={{ fontSize: "0.78rem", color: theme.textMuted, marginBottom: "6px" }}>
            부여할 감정의 극성을 선택해 주십시오:
          </div>

          {/* 3. 극성 버튼 (선택된 인물에게 전달) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleSelectEmotion(selectedNpc, emotionModal.pair.pos)}
              style={{ 
                padding: "10px", 
                backgroundColor: theme.panelAlt, 
                border: `1.5px solid ${theme.success}`, 
                borderRadius: "6px", 
                color: theme.text, 
                fontWeight: "bold", 
                cursor: "pointer" 
              }}
            >
              {emotionModal.pair.pos}
            </button>
            <button
              type="button"
              onClick={() => handleSelectEmotion(selectedNpc, emotionModal.pair.neg)}
              style={{ 
                padding: "10px", 
                backgroundColor: theme.panelAlt, 
                border: `1.5px solid ${theme.danger}`, 
                borderRadius: "6px", 
                color: theme.text, 
                fontWeight: "bold", 
                cursor: "pointer" 
              }}
            >
              {emotionModal.pair.neg}
            </button>
          </div>
        </>
      );
    })()}
    </div>
  </div>
)}

{/* 🌟 3. 조사 판정 전용 모달 (대상 및 특기 선택 ➔ 2D6 자동 계산) */}
      {investigationModal && (
        <div 
          onClick={() => setInvestigationModal(null)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 155, padding: "20px" }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="glass-card"
            style={{ width: "100%", maxWidth: "420px", maxHeight: "85vh", overflowY: "auto", padding: "20px", borderRadius: "18px", color: theme.text, display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <span style={{ fontWeight: "800", fontSize: "1rem" }}>🔍 인세인 조사 판정 선언</span>
              <button 
                type="button"
                onClick={() => setInvestigationModal(null)} 
                style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* 1단계: 조사할 대상 선택 */}
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.accent, display: "block", marginBottom: "6px" }}>
                1. 조사할 대상 및 정보 선택:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {/* 시나리오 핸드아웃 단서 조사 */}
                {(activeSession?.sheet?.handouts || []).filter(h => !h.revealed && !h.id?.toString().includes("pc_base")).map((h, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInvestigationModal({ step: "selectSkill", targetType: "secret", targetObj: h })}
                    style={{ padding: "8px 12px", textAlign: "left", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    📜 [단서 조사] <strong>{h.title}</strong>
                  </button>
                ))}

                {/* 동행 NPC 조사 (비밀 / 거처 / 정신상태) */}
                {(activeSession?.sheet?.npcs || []).map((npc, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "4px", backgroundColor: theme.panelAlt, padding: "6px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: "700", alignSelf: "center", padding: "0 6px", minWidth: "60px" }}>{npc.name}</span>
                    <button
                      type="button"
                      onClick={() => setInvestigationModal({ step: "selectSkill", targetType: "secret", targetObj: npc })}
                      style={{ flex: 1, padding: "5px", backgroundColor: theme.panel, border: `1px solid ${theme.danger}`, borderRadius: "6px", color: theme.danger, fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}
                    >
                      비밀 파헤치기
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvestigationModal({ step: "selectSkill", targetType: "location", targetObj: npc })}
                      style={{ flex: 1, padding: "5px", backgroundColor: theme.panel, border: `1px solid ${theme.warning}`, borderRadius: "6px", color: theme.warning, fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}
                    >
                      거처 확보
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2단계: 판정에 사용할 특기 선택 */}
            {investigationModal.step === "selectSkill" && (
              <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "12px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.warning, display: "block", marginBottom: "6px" }}>
                 2. [{investigationModal.targetType === "location" ? "🏠 거처 확보" : "🔓 비밀 파헤치기"}]에 사용할 특기 선택:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(activeSession?.sheet?.insaneSkills || []).map((sk, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleExecuteInvestigation(investigationModal.targetType, investigationModal.targetObj, sk)}
                      style={{ padding: "6px 12px", backgroundColor: theme.panelAlt, border: `1.5px solid ${theme.warning}`, borderRadius: "14px", color: theme.text, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
                    >
                      ⚔️ {sk} (목표치 5)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
{/* 🌟 공지사항 및 업데이트 노트 모달 */}
      {showNoticeModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: isMobile ? "12px" : "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "560px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: "88dvh" }}>

            {/* 상단 탭 버튼 (업데이트 노트 1순위 배치) */}
            <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebar }}>
              <button
                type="button"
                onClick={() => setActiveNoticeTab("update")}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: activeNoticeTab === "update" ? theme.panelAlt : "transparent",
                  border: "none",
                  color: activeNoticeTab === "update" ? theme.accent : theme.textMuted,
                  fontWeight: activeNoticeTab === "update" ? "800" : "500",
                  fontSize: "0.92rem",
                  cursor: "pointer",
                  borderBottom: activeNoticeTab === "update" ? `2px solid ${theme.accent}` : "none"
                }}
              >
                🚀 업데이트 노트 ({APP_VERSION})
              </button>
              <button
                type="button"
                onClick={() => setActiveNoticeTab("guide")}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: activeNoticeTab === "guide" ? theme.panelAlt : "transparent",
                  border: "none",
                  color: activeNoticeTab === "guide" ? theme.accent : theme.textMuted,
                  fontWeight: activeNoticeTab === "guide" ? "800" : "500",
                  fontSize: "0.92rem",
                  cursor: "pointer",
                  borderBottom: activeNoticeTab === "guide" ? `2px solid ${theme.accent}` : "none"
                }}
              >
                📖 시작 가이드
              </button>
            </div>

            {/* 본문 영역 (업데이트 노트가 기본 1순위 출력) */}
            <div style={{ padding: isMobile ? "16px" : "20px", overflowY: "auto", flex: 1, fontSize: "0.88rem", lineHeight: "1.75" }}>
              {activeNoticeTab === "update" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* 🚀 최신 버전 v1.4.0 */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <h3 style={{ margin: 0, color: theme.text, fontSize: "1.1rem", fontWeight: "800" }}>
                        🚀 v1.4.0 시나리오 원클릭 제작 & AI 스튜디오 온보딩 파이프라인
                      </h3>
                      <span style={{ fontSize: "0.7rem", padding: "2px 8px", backgroundColor: "rgba(227, 142, 132, 0.2)", border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: "10px", fontWeight: "800" }}>
                        LATEST
                      </span>
                    </div>

                    <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ fontSize: "0.84rem", color: theme.accent, fontStyle: "italic", borderBottom: `1px dashed ${theme.border}`, paddingBottom: "6px" }}>
                        "머릿속의 설정을 손쉽게 — 키워드 조합부터 Gemini 스튜디오 연동, 로비 자동 배치까지 한 번에 완성됩니다."
                      </div>
                      <div style={{ fontSize: "0.85rem", lineHeight: "1.7", color: theme.text }}>
                        • <strong>🎬 3분 튜토리얼 & 시나리오 양식 빌더:</strong> CoC/인세인 조작법 튜토리얼과 함께 룰, 추천 키워드(#집착 #오컬트 #신분차 등), 인물 설정을 선택해 AI 스튜디오용 프롬프트를 즉시 조립·복사하는 가이드 모달이 탑재되었습니다.<br/>
                        • <strong>🪄 통합 불러오기 & 텍스트 붙여넣기 모달:</strong> [📄 파일 첨부] 버튼에서 파일 업로드뿐만 아니라 복사한 텍스트 붙여넣기를 함께 지원합니다. 스튜디오 생성문을 넣고 적용을 누르면 룰, 시놉시스, 서막, 진상, PC/KPC 프로필(상메/취향 포함)이 로비에 100% 자동 배치됩니다.<br/>
                        • <strong>💡 스튜디오 복귀 길잡이 배너:</strong> 스튜디오에서 글을 복사해 로비로 복귀했을 때 유저가 헤매지 않도록 상단에 원클릭 자동 주입 안내 배너가 점등됩니다.<br/>
                        • <strong>⚡ 통신 최적화 & 외모 왜곡 방지:</strong> Vercel 413(Payload Too Large) 방지를 위해 요청 메시지를 경량화하고, 캐릭터 외모(머리색 등) 날조를 차단하는 시스템 앵커를 강화했습니다.
                      </div>
                    </div>
                  </div>

                  {/* 📦 이전 버전 v1.3.0 */}
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", color: theme.textMuted, fontSize: "0.9rem", fontWeight: "750" }}>
                      📦 v1.3.0 미연시 마스터 플로우 & 시네마틱 비주얼
                    </h4>
                    <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "0.82rem", color: theme.textMuted, lineHeight: "1.65" }}>
                      • <strong>스마트폰 실시간 전화 & 다이내믹 아일랜드:</strong> 서랍형 슬라이드 수신 화면 및 풀스크린 통화 모달 지원.<br/>
                      • <strong>이원화 비주얼 시스템:</strong> 시네마틱 16:9 컷씬과 메신저 1:1 일상 스냅 사진 갤러리 연동.<br/>
                      • <strong>동적 장소 카드 & 약속 배지:</strong> 대면 종료 시 이동 가능한 장소 및 약속 장소 안내.<br/>
                      • <strong>시간대 루프 & AI 기억 수첩:</strong> 낮/노을/밤 흐름과 주요 사건 플래그 박제.<br/>
                      • <strong>4대 멀티 엔딩:</strong> 순애 트루 / 수라장 히든 / 신뢰 우정 / 파탄 엔딩 및 맞춤 후일담 연계.
                    </div>
                  </div>

                  {/* 📦 이전 버전 v1.2.0 */}
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", color: theme.textMuted, fontSize: "0.9rem", fontWeight: "750" }}>
                      📦 v1.2.0 결전 자동화 & 인세인 3대 소지품
                    </h4>
                    <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "0.82rem", color: theme.textMuted, lineHeight: "1.65" }}>
                      • <strong>인세인 3대 소지품(가방) 도입:</strong> 세션 생성 단계에서 생사를 가를 초기 아이템(진통제, 무기, 부적)을 2개 선택 가능.<br/>
                      • <strong>인터럽트 개입 (무기 & 부적):</strong> 공격 실패 시 [무기] 재굴림, 회피 성공 적에게 [부적] 판정 방해 지원.<br/>
                      • <strong>칠전팔기 긴급 소생 (진통제):</strong> 생명력 0 도달 시 진통제 긴급 복용으로 생존.<br/>
                      • <strong>결전 액션 쾌속 자동화:</strong> 수동 회피를 철거하고 [공격] 원클릭으로 공방 협공 사이클 일괄 전개.
                    </div>
                  </div>

                  {/* 📦 이전 버전 v1.1.0 */}
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", color: theme.textMuted, fontSize: "0.9rem", fontWeight: "750" }}>
                      📦 v1.1.0 스마트폰 풀옵션 & 비주얼 대청소
                    </h4>
                    <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "0.82rem", color: theme.textMuted, lineHeight: "1.65" }}>
                      • <strong>읽씹 방지 메신저:</strong> 노란색 '1' 카운트, (•••) 타이핑 애니메이션, 상단 푸시 알림 배너 추가.<br/>
                      • <strong>브라우저 경고창 추방:</strong> 회색 alert/prompt를 걷어내고 선물하기·취향수첩을 깔끔한 인앱 모달로 전면 개편.<br/>
                      • <strong>돋보기의 저주 해제:</strong> 미연시 모드 전용 소지품(손수건, 캔디) 지급 및 취향 자동 아카이빙 탑재.<br/>
                      • <strong>헤더 바 정돈:</strong> 불투명 박스를 투명 플랫 아이콘으로 바꾸고 실종되었던 핸드아웃/다이스 버튼 복구.
                    </div>
                  </div>

                  {/* 📦 최초 버전 v1.0.0 */}
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", color: theme.textMuted, fontSize: "0.9rem", fontWeight: "750" }}>
                      📦 v1.0.0 정식 배포
                    </h4>
                    <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}`, fontSize: "0.82rem", color: theme.textMuted, lineHeight: "1.65" }}>
                      • <strong>미연시 (소설/문자) 모드 도입:</strong> 주사위 대신 선택지와 관계성 중심의 비주얼 노벨 및 메신저 모드 추가.<br/>
                      • <strong>인세인(inSANe) 시스템 고도화:</strong> PC 및 서브 NPC 사명/비밀 분리 생성 및 핸드아웃 카드 완성.<br/>
                      • <strong>온보딩 가이드 & 세이브 백업:</strong> 가이드 모달과 JSON 백업/복원 기능 탑재.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", color: theme.text, fontSize: "1.1rem", fontWeight: "800" }}>
                      LyrisTable (LT) 시스템 가이드
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: theme.textMuted }}>
                      1:1 타이만 세션과 관계성 서사를 위한 플랫폼 핵심 기능 안내입니다.
                    </p>
                  </div>

                  {/* 1. 시나리오 연동 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.accent, fontSize: "0.9rem", marginBottom: "6px" }}>
                      📄 1. 시나리오 연동 (파일 첨부)
                    </div>
                    <div style={{ fontSize: "0.85rem", color: theme.text, lineHeight: "1.65" }}>
                      • <strong>파일 첨부 (.txt / .pdf):</strong> 로비의 [📄 파일 첨부]로 시나리오 문서를 올리면 룰 시스템, 시놉시스, 서막, KPC 명단, 조사 구역 및 단서 핸드아웃이 자동으로 파싱되어 입력란에 배치됩니다.<br/>
                      • <strong>PC/KPC 자동 치환:</strong> 시나리오 본문에 'PC', 'KPC'로 적힌 단어는 [🔄 PC/KPC 치환] 버튼으로 캐릭터의 실제 고유 이름으로 일괄 변경할 수 있습니다.
                    </div>
                  </div>

                  {/* 2. 시트 & 로비 저장 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.accent, fontSize: "0.9rem", marginBottom: "6px" }}>
                      💾 2. 시트 & 로비 세팅 저장 (프리셋/백업)
                    </div>
                    <div style={{ fontSize: "0.85rem", color: theme.text, lineHeight: "1.65" }}>
                      • <strong style={{ color: theme.accent }}>⭐ 공식 추천 시나리오 (상단 ⭐ 공식 시나리오):</strong> 복잡한 설정 없이도 플랫폼에 준비된 고퀄리티 공식 시나리오들을 원클릭으로 즉시 세팅해 플레이할 수 있습니다.<br/>
                      • <strong>로비 전체 저장 (상단 💾 / 📁):</strong> PC와 KPC 프로필, 시나리오 본문, 스탯까지 포함된 '로비 풀 세팅'을 저장해 두고 원클릭으로 다시 불러올 수 있습니다. (JSON 파일 다운로드/복원 지원)<br/>
                      • <strong>PC만 단독 저장 (우측 시트 💾 PC만):</strong> 세션 진행 도중 우측 시트 상단의 [💾 PC만]을 누르면 내 캐릭터 설정과 스탯만 별도 저장되어 다른 시나리오에서도 재활용할 수 있습니다.<br/>
                      • <strong>전체 데이터 관리:</strong> 좌측 사이드바 하단의 [💾 데이터 관리]에서 진행 중인 세션을 텍스트(.txt), 마크다운(.md), PDF 인쇄본, 혹은 복원용 세이브(.json)로 안전하게 백업할 수 있습니다.
                    </div>
                  </div>

                  {/* 3. 인세인 & CoC 핸드아웃 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.warning, fontSize: "0.9rem", marginBottom: "6px" }}>
                      🔍 3. 조사 단서 및 테이블탑 핸드아웃
                    </div>
                    <div style={{ fontSize: "0.85rem", color: theme.text, lineHeight: "1.65" }}>
                      • <strong>사명과 비밀 (인세인):</strong> 모든 등장인물의 공개 사명(앞면)과 비밀(뒷면) 카드가 헤더의 [🃏 핸드아웃]에 배치됩니다. 조사에 성공해야 비밀이 안전하게 해금됩니다.<br/>
                      • <strong>단서 조사:</strong> 시나리오 파일 내에 배치된 조사 구역은 탐색 성공 시 핸드아웃으로 해금되며, 발견한 결정적 증거는 시트 내 [📋 증거 수첩]에 자동 보관됩니다.
                    </div>
                  </div>

                  {/* 4. 편의 기능 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.danger, fontSize: "0.9rem", marginBottom: "6px" }}>
                      ⎌ 4. 편의 기능 및 되돌리기 (롤백)
                    </div>
                    <div style={{ fontSize: "0.85rem", color: theme.text, lineHeight: "1.65" }}>
                      • <strong>대화 취소 및 다시 쓰기:</strong> 내 마지막 말풍선 아래의 [⎌ 이 대화 취소 및 다시 쓰기]를 누르면 직전 상태로 메시지가 복구되며 호감도, 단서, 소지품 상태가 이전 턴으로 완전 롤백됩니다.<br/>
                      • <strong>답변 강제 중단:</strong> AI 응답 도중 [⏹️ 취소] 버튼을 누르면 실시간 통신을 즉시 중단하고 재입력할 수 있습니다.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 모달 하단 푸터 (7일간 보지 않기 & 닫기 버튼) */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.sidebar }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: theme.textMuted, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={hideNoticeCheckbox}
                  onChange={(e) => setHideNoticeCheckbox(e.target.checked)}
                />
                7일 동안 보지 않기
              </label>
              <button
                type="button"
                onClick={handleCloseNotice}
                style={{ padding: "8px 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "0.82rem", cursor: "pointer" }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* 🌟 인세인 66개 특기 대용 판정 팝업 */}
      {showSkillMatrixModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 160, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "620px", maxHeight: "88vh", display: "flex", flexDirection: "column", padding: "16px", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <div>
                <span style={{ fontWeight: "800", fontSize: "0.95rem" }}>⚔️ 인세인 66개 특기 대용 판정</span>
                <span style={{ fontSize: "0.72rem", color: theme.warning, marginLeft: "8px", fontWeight: "700" }}>
                  호기심 분야: [{activeSession?.sheet?.insaneCuriosity || "미정"}]
                </span>
              </div>
              <button onClick={() => setShowSkillMatrixModal(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", padding: "10px 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", minWidth: "520px", gap: "4px" }}>
                {INSANE_MATRIX.map(col => (
                  <div key={col.category} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div style={{ textAlign: "center", fontSize: "0.74rem", fontWeight: "900", padding: "6px 0", backgroundColor: col.category === activeSession?.sheet?.insaneCuriosity ? "rgba(229, 169, 60, 0.25)" : theme.panelAlt, border: `1px solid ${col.category === activeSession?.sheet?.insaneCuriosity ? theme.warning : theme.border}`, borderRadius: "6px" }}>
                      {col.category}
                    </div>
                    {col.skills.map(skill => {
                      const isLearned = (activeSession?.sheet?.insaneSkills || []).includes(skill);
                      const targetNumber = calculateInsaneTargetNumber(
                        skill,
                        activeSession?.sheet?.insaneSkills || [],
                        activeSession?.sheet?.insaneCuriosity || ""
                      );

                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            setShowSkillMatrixModal(false);
                            rollDiceDirectly(targetNumber, skill);
                          }}
                          style={{
                            padding: "6px 2px",
                            fontSize: "0.7rem",
                            backgroundColor: isLearned ? theme.warning : theme.inputBg,
                            color: isLearned ? "#000" : theme.text,
                            border: `1px solid ${isLearned ? theme.warning : theme.border}`,
                            borderRadius: "5px",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "2px"
                          }}
                        >
                          <span style={{ fontWeight: isLearned ? "900" : "500" }}>{skill}</span>
                          <span style={{ fontSize: "0.62rem", opacity: 0.85, fontWeight: "700" }}>
                            {targetNumber}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
       {/* ── 📖 사건 기억 수첩 모달 ── */}
      {showMemoryModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "14px", width: "100%", maxWidth: "420px", maxHeight: "80vh", display: "flex", flexDirection: "column", padding: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
              <div style={{ fontWeight: "bold", fontSize: "1rem", color: "#f8fafc" }}>📖 사건 기억 수첩</div>
              <button type="button" onClick={() => setShowMemoryModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
             {(!activeSession?.sheet?.recentEvents || activeSession.sheet.recentEvents.length === 0) ? (
  <div style={{ textAlign: "center", color: "#64748b", padding: "30px 0", fontSize: "0.85rem" }}>아직 기록된 주요 사건이 없습니다.</div>
) : (
  activeSession.sheet.recentEvents.map((evt, idx) => (
                  <div key={idx} style={{ padding: "10px 12px", backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "8px", borderLeft: "3px solid #38bdf8", fontSize: "0.82rem", color: "#e2e8f0", lineHeight: "1.4" }}>
                    📌 {evt}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
{/* ── 🖼️ CG 앨범 갤러리 모달 ── */}
      {showCgAlbumModal && (
        <div 
          onClick={() => setShowCgAlbumModal(false)}
          style={{ 
            position: "fixed", 
            inset: 0, 
            backgroundColor: "rgba(0,0,0,0.8)", 
            zIndex: 99999, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "16px",
            backdropFilter: "blur(5px)"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: "#0f172a", 
              border: "1.5px solid rgba(255,255,255,0.2)", 
              borderRadius: "18px", 
              width: "100%", 
              maxWidth: "520px", 
              maxHeight: "85vh", 
              display: "flex", 
              flexDirection: "column", 
              padding: "20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: "12px" }}>
              <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "#f8fafc" }}>
                🖼️ 이벤트 CG 앨범 ({activeSession?.sheet?.unlockedCgs?.length || 0})
              </div>
              <button 
                type="button" 
                onClick={() => setShowCgAlbumModal(false)} 
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.3rem", cursor: "pointer", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))", gap: "12px", paddingRight: "4px" }}>
              {(!activeSession?.sheet?.unlockedCgs || activeSession.sheet.unlockedCgs.length === 0) ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#64748b", padding: "40px 0", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  해금된 이벤트 일러스트가 없습니다.<br />서사 속 특별한 순간에 도달해 보세요!
                </div>
              ) : (
                activeSession.sheet.unlockedCgs.map((cg, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setZoomedCardUrl(cg)}
                    title="클릭하여 원본 일러스트 크게 보기"
                    style={{ 
                      cursor: "zoom-in",
                      backgroundColor: "rgba(30, 41, 59, 0.7)", 
                      borderRadius: "10px", 
                      overflow: "hidden", 
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div style={{ height: "100px", backgroundColor: "#1e293b", overflow: "hidden" }}>
                      {(cg.imageUrl || cg.url) && (
                        <img
                          src={cg.imageUrl || cg.url}
                          alt={cg.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div style={{ padding: "8px 10px", backgroundColor: "#1e293b" }}>
                      <div style={{ fontSize: "0.76rem", fontWeight: "bold", color: "#ffffff", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cg.title}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

{/* 🔍 CG 원본 풀스크린 라이트박스 + 💬 미연시 대사창 & 줄바꿈 & UI 숨김 토글 */}
      {zoomedCardUrl && (() => {
       const isObj = typeof zoomedCardUrl === "object" && zoomedCardUrl !== null;
        const imgUrl = isObj ? (zoomedCardUrl.imageUrl || zoomedCardUrl.url) : zoomedCardUrl;
        let rawText = isObj ? (zoomedCardUrl.trigger || zoomedCardUrl.desc || zoomedCardUrl.condition || "") : "";

        // 🌟 현재 세션의 실제 PC 이름과 파트너(NPC) 이름 가져오기
        const livePcName = activeSession?.sheet?.name || "주인공";
        const liveNpcName = activeSession?.sheet?.npcs?.[0]?.name || "상대방";

        // 🌟 지문과 대사 속 옛날 디폴트 이름을 현재 변경된 이름으로 강제 치환
        rawText = rawText.replace(/세리아나|클레어/g, livePcName).replace(/발렌틴|아델/g, liveNpcName);

        let displayCgTitle = isObj ? (zoomedCardUrl.title || "") : "";
        displayCgTitle = displayCgTitle.replace(/세리아나|클레어/g, livePcName).replace(/발렌틴|아델/g, liveNpcName);

        // 대사와 화자, 장면 묘사 자동 추출
        const dialogMatch = rawText.match(/([가-힣\w\s]+):\s*"([^"]+)"/);
        const speaker = dialogMatch ? dialogMatch[1].trim() : displayCgTitle;
        const quote = dialogMatch ? `"${dialogMatch[2]}"` : null;

        const descMatch = rawText.match(/장면 묘사:\s*([^\n\r]+)/);
        const sceneDesc = descMatch ? descMatch[1].trim() : null;
        const hasTextContent = Boolean(quote || displayCgTitle || sceneDesc);

        return (
          <div 
            onClick={() => setZoomedCardUrl(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              backgroundColor: "rgba(0, 0, 0, 0.92)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              cursor: "zoom-out"
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                maxWidth: "880px",
                width: "100%",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backgroundColor: "#0b0f19"
              }}
            >
              {/* 👁️ 텍스트 숨기기 / 보기 토글 버튼 */}
              {hasTextContent && (
                <button
                  type="button"
                  onClick={() => setShowCgDialog(prev => !prev)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 10,
                    padding: "6px 12px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    color: "#f1f5f9",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    backdropFilter: "blur(4px)",
                    transition: "all 0.2s ease"
                  }}
                >
                  {showCgDialog ? "👁️ 텍스트 숨기기" : "💬 텍스트 보기"}
                </button>
              )}

              <img 
                src={imgUrl} 
                alt="이벤트 일러스트" 
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  maxHeight: isMobile ? (showCgDialog ? "42vh" : "75vh") : ((hasTextContent && showCgDialog) ? "68vh" : "82vh"),
                  objectFit: "contain", 
                  display: "block", 
                  margin: "0 auto",
                  transition: "max-height 0.25s ease"
                }} 
              />

              {/* 💬 미연시 스타일 하단 대사창 */}
              {hasTextContent && showCgDialog && (
               <div style={{
    position: isMobile ? "relative" : "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: isMobile ? "12px 14px" : "16px 22px",
    background: isMobile 
      ? "rgba(15, 23, 42, 0.98)" 
      : "linear-gradient(to top, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.82) 75%, transparent 100%)",
    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#f8fafc"
  }}>
                  {/* 화자 이름 태그 */}
                  <div style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(217, 119, 6, 0.25)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#fbbf24",
                    fontSize: "0.82rem",
                    fontWeight: "800",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em"
                  }}>
                    {speaker || isObj.title}
                  </div>

                  {/* 인물 대사 (줄바꿈 & 단어 보존 스타일 적용) */}
                  {quote && (
                    <div style={{
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      lineHeight: 1.6,
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                      textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "keep-all"
                    }}>
                      {quote}
                    </div>
                  )}

                  {/* 장면 묘사 (줄바꿈 & 단어 보존 스타일 적용) */}
                  {sceneDesc && (
                    <div style={{
                      fontSize: "0.78rem",
                      color: "#94a3b8",
                      marginTop: "6px",
                      lineHeight: 1.5,
                      fontStyle: "italic",
                      whiteSpace: "pre-wrap",
                      wordBreak: "keep-all"
                    }}>
                      {sceneDesc}
                    </div>
                  )}
                </div>
              )}
            </div>

            <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.82rem", marginTop: "14px" }}>
              화면 아무 곳이나 누르면 닫힙니다 ✕
            </span>
          </div>
        );
      })()}

      {/* 📱 1. 통화 축소 시 상단 플로팅 미니 바 */}
      {isVoiceCallActive && !isCallModalOpen && (
        <div style={{
          position: "fixed",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "calc(100% - 32px)",
          maxWidth: "440px",
          backgroundColor: "#161b22",
          borderRadius: "18px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12)",
          boxSizing: "border-box",
          animation: "slideDown 0.25s ease"
        }}>
          {/* 좌측: 터치 시 통화창으로 복귀 */}
          <div 
            onClick={() => setIsCallModalOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", flex: 1 }}
          >
            <div style={{ position: "relative", width: "40px", height: "40px" }}>
              {(() => {
                const npcName = voiceCallNpc?.name || (typeof voiceCallNpc === "string" ? voiceCallNpc : "상대방");
                const foundNpc = (activeSession?.npcs || []).find(n => n.name === npcName);
                const realImg = foundNpc?.image || foundNpc?.avatar || foundNpc?.photo || voiceCallNpc?.image || voiceCallNpc?.avatar;
                
                return realImg ? (
                  <img src={realImg} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: "800",
                    fontSize: "1.05rem"
                  }}>
                    {npcName.slice(0, 1)}
                  </div>
                );
              })()}
              <span style={{
                position: "absolute", bottom: "-1px", right: "-1px",
                width: "11px", height: "11px", borderRadius: "50%",
                backgroundColor: "#22c55e", border: "2px solid #161b22"
              }} />
            </div>
            <div>
              <div style={{ color: "#ffffff", fontSize: "0.92rem", fontWeight: "700" }}>
                {voiceCallNpc?.name || (typeof voiceCallNpc === "string" ? voiceCallNpc : "상대방")}
              </div>
              <div style={{ color: theme.accent || "#38bdf8", fontSize: "0.75rem", fontWeight: "600", marginTop: "1px" }}>
                ● 통화 중 ⤢ 터치하여 복귀
              </div>
            </div>
          </div>

          {/* 우측: 빨간 통화 종료 버튼 */}
          <button 
            type="button"
            onClick={() => {
              setIsVoiceCallActive(false);
              setIsCallModalOpen(false);
              setVoiceCallNpc(null);
              if (typeof executeMessage === "function") {
                executeMessage(`[통화 종료] 전화를 끊었습니다.`);
              }
            }}
            style={{
              backgroundColor: "#ef4444",
              border: "none",
              borderRadius: "9999px",
              padding: "7px 15px",
              color: "#ffffff",
              fontSize: "0.82rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)"
            }}
          >
            종료
          </button>
        </div>
      )}

{/* 📱 2. 리얼 스마트폰 풀스크린 통화 모달 (완성본) */}
      {isVoiceCallActive && isCallModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          // 🛡️ [비침 완벽 차단] 100% 불투명 솔리드 다크 + 테마 앰비언트 글로우
          backgroundColor: "#090d16",
          backgroundImage: `radial-gradient(circle at 50% 15%, ${theme.accent || "#38bdf8"}44 0%, #090d16 70%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 24px 34px",
          boxSizing: "border-box",
          color: "#fff",
          animation: "fadeIn 0.25s ease"
        }}>
          
          {/* 1. 상단 바: 닫기(⌄) & 통화 상태 */}
          <div style={{ width: "100%", maxWidth: "420px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button 
              type="button"
              onClick={() => setIsCallModalOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "none",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
              title="화면 내리기"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.86rem", color: theme.accent || "#5eead4", fontWeight: "700", letterSpacing: "1px" }}>● 통화 중</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "2px" }}>HD Voice</div>
            </div>
            <div style={{ width: "42px" }} />
          </div>

          {/* 2. 중앙 프로필 & 펄스 링 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "420px", marginTop: "6px" }}>
            <div style={{
              position: "relative",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              marginBottom: "14px"
            }}>
              <div style={{
                position: "absolute",
                inset: "-12px",
                borderRadius: "50%",
                border: `2px solid ${theme.accent || "#38bdf8"}55`,
                animation: "pulse 2s infinite"
              }} />
          {(() => {
                const allNpcs = [
                  ...(activeSession?.sheet?.npcs || []),
                  ...(activeSession?.npcs || []),
                  ...(activeSession?.scenario?.npcs || []),
                  ...(activeSession?.characters || [])
                ];
                
                const targetName = voiceCallNpc?.name || (typeof voiceCallNpc === "string" ? voiceCallNpc : "");
                const foundNpc = allNpcs.find(n => 
                  n?.name === targetName || 
                  (targetName && n?.name && (n.name.includes(targetName) || targetName.includes(n.name)))
                );

                const targetObj = foundNpc || (typeof voiceCallNpc === "object" ? voiceCallNpc : null);
                const realImg = targetObj?.image || targetObj?.avatar || targetObj?.photo || targetObj?.portrait || targetObj?.profileImage || targetObj?.img;

                return realImg ? (
                  <img 
                    src={realImg} 
                    alt={targetName} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      borderRadius: "50%", 
                      objectFit: "cover", 
                      border: "2px solid rgba(255, 255, 255, 0.35)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)"
                    }} 
                  />
                ) : (
                  /* 🎭 이미지가 등록되지 않은 경우: 단일 글자 대신 분위기 있는 실루엣 */
                  <div style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(8px)"
                  }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.65)">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                );
              })()}
            </div>
            
            <h2 style={{ margin: "0 0 4px", fontSize: "1.45rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
              {voiceCallNpc?.name || (typeof voiceCallNpc === "string" ? voiceCallNpc : "상대방")}
            </h2>
            <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.65)" }}>
              {voiceCallNpc?.title || "통화 연결 중"}
            </span>

            {/* 3. 대사 상단 고정 + 지문만 독립 스크롤 카드 */}
            <div style={{
              width: "100%",
              marginTop: "20px",
              backgroundColor: "rgba(22, 27, 34, 0.88)",
              borderRadius: "20px",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxSizing: "border-box",
              maxHeight: "330px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)"
            }}>
              {(() => {
                const lastMsg = activeSession?.messages?.[activeSession.messages.length - 1]?.text || "";
                const dialogueMatch = lastMsg.match(/"([^"]+)"/);
                const dialogue = dialogueMatch ? dialogueMatch[1] : null;
                const narration = lastMsg.replace(/"[^"]+"/g, "").trim();

                return (
                  <>
                    {/* 상단 고정 대사 */}
                    {dialogue ? (
                      <div style={{
                        padding: "18px 20px 14px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderBottom: narration ? "1px dashed rgba(255, 255, 255, 0.18)" : "none",
                        flexShrink: 0
                      }}>
                        <div style={{
                          fontSize: "1.15rem",
                          fontWeight: "700",
                          color: "#ffffff",
                          lineHeight: "1.55",
                          textAlign: "center",
                          textShadow: "0 2px 8px rgba(0,0,0,0.6)"
                        }}>
                          "{dialogue}"
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "16px 20px", fontSize: "1.05rem", color: "#5eead4", textAlign: "center", fontWeight: "600", flexShrink: 0 }}>
                        {lastMsg || "수화기 너머로 숨소리가 들려옵니다..."}
                      </div>
                    )}

                    {/* 하단 서술 지문 스크롤 */}
                    {narration && (
                      <div style={{
                        padding: "16px 20px 20px",
                        overflowY: "auto",
                        flex: 1,
                        fontSize: "0.95rem",
                        color: "rgba(255, 255, 255, 0.88)",
                        lineHeight: "1.75",
                        textAlign: "center",
                        wordBreak: "keep-all"
                      }}>
                        {narration}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* 4. 하단 입력창 & 순백색 SVG 통화 종료 버튼 */}
          <div style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;
                const text = input;
                setInput("");
                executeMessage(`[전화 통화] "${text}"`);
              }}
              style={{ display: "flex", gap: "8px" }}
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="수화기에 대고 말하기..."
                style={{
                  flex: 1,
                  padding: "13px 20px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  backgroundColor: "rgba(0, 0, 0, 0.45)",
                  color: "#fff",
                  fontSize: "0.92rem",
                  outline: "none"
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: "0 22px",
                  borderRadius: "9999px",
                  border: "none",
                  backgroundColor: theme.accent || "#0d9488",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                전송
              </button>
            </form>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button 
                type="button"
                onClick={() => {
                  setIsVoiceCallActive(false);
                  setIsCallModalOpen(false);
                  setVoiceCallNpc(null);
                  if (typeof executeMessage === "function") {
                    executeMessage(`[통화 종료] 전화를 끊었습니다.`);
                  }
                }}
                style={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(239, 68, 68, 0.45)"
                }}
                title="통화 종료"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(135deg)" }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

{/* 🎁 1. 다인원 지원 최상위 독립 선물하기 모달 */}
      {giftModalNpc && (() => {
        const allNpcs = activeSession?.sheet?.npcs || [];

        return (
          <div 
            onClick={() => setGiftModalNpc(null)}
            style={{ position: "fixed", inset: 0, zIndex: 99999, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          >
            <div 
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "360px", backgroundColor: activePhoneSkin.panelAlt, border: `1.5px solid ${activePhoneSkin.accent}`, borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 16px 36px rgba(0,0,0,0.4)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "8px" }}>
                <div>
                  <span style={{ fontWeight: "800", fontSize: "0.95rem", color: activePhoneSkin.text }}>🎁 선물 전달</span>
                  <div style={{ fontSize: "0.72rem", color: activePhoneSkin.textMuted, marginTop: "2px" }}>전달할 상대와 소지품을 선택하세요</div>
                </div>
                <button type="button" onClick={() => setGiftModalNpc(null)} style={{ background: "none", border: "none", color: activePhoneSkin.textMuted, fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
              </div>

              {allNpcs.length > 1 && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                  {allNpcs.map((npc) => {
                    const isSelected = giftModalNpc.id === npc.id || giftModalNpc.name === npc.name;
                    return (
                      <button
                        key={npc.id || npc.name}
                        type="button"
                        onClick={() => setGiftModalNpc(npc)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "14px",
                          border: `1.5px solid ${isSelected ? activePhoneSkin.accent : activePhoneSkin.border}`,
                          backgroundColor: isSelected ? activePhoneSkin.accent : "transparent",
                          color: isSelected ? activePhoneSkin.accentText : activePhoneSkin.text,
                          fontSize: "0.74rem",
                          fontWeight: isSelected ? "800" : "500",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          flexShrink: 0
                        }}
                      >
                        {npc.name}
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "38vh" }}>
                {(!activeSession?.sheet?.items || activeSession.sheet.items.length === 0) ? (
                  <div style={{ textAlign: "center", padding: "24px 0", fontSize: "0.78rem", color: activePhoneSkin.textMuted, lineHeight: "1.5" }}>
                    선물함에 소지품이 없습니다.<br />서사를 진행하며 물건을 얻어보세요!
                  </div>
                ) : (
                  activeSession.sheet.items.map((it, idx) => (
                    <div 
                      key={idx}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: activePhoneSkin.shellBg, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "12px" }}
                    >
                      <div style={{ flex: 1, paddingRight: "8px" }}>
                        <div style={{ fontWeight: "800", fontSize: "0.85rem", color: activePhoneSkin.text }}>📦 {it.name}</div>
                        {it.desc && <div style={{ fontSize: "0.7rem", color: activePhoneSkin.textMuted, marginTop: "2px" }}>{it.desc}</div>}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const targetNpc = giftModalNpc;
                          setGiftModalNpc(null);
                          setSelectedProfileNpc(null);
                          setIsPhoneDrawerOpen(false);
                          executeMessage(`[${it.name} 선물하기] 품에서 [${it.name}]을(를) 꺼내어 ${targetNpc.name}에게 건넨다.`);
                        }}
                        style={{ padding: "7px 14px", backgroundColor: activePhoneSkin.accent, color: activePhoneSkin.accentText, border: "none", borderRadius: "16px", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer", flexShrink: 0 }}
                      >
                        {giftModalNpc.name}에게 전달
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 💡 2. 다인원 지원 최상위 독립 취향 수첩 모달 */}
      {clueModalNpc && (() => {
        const allNpcs = activeSession?.sheet?.npcs || [];

        return (
          <div 
            onClick={() => setClueModalNpc(null)}
            style={{ position: "fixed", inset: 0, zIndex: 99999, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          >
            <div 
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "360px", backgroundColor: activePhoneSkin.panelAlt, border: `1.5px solid ${activePhoneSkin.accent}`, borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 16px 36px rgba(0,0,0,0.4)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "8px" }}>
                <div>
                  <span style={{ fontWeight: "800", fontSize: "0.95rem", color: activePhoneSkin.text }}>💡 취향 수첩</span>
                  <div style={{ fontSize: "0.72rem", color: activePhoneSkin.textMuted, marginTop: "2px" }}>서사 속에서 수집된 인물별 관심사</div>
                </div>
                <button type="button" onClick={() => setClueModalNpc(null)} style={{ background: "none", border: "none", color: activePhoneSkin.textMuted, fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
              </div>

              {allNpcs.length > 1 && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                  {allNpcs.map((npc) => {
                    const isSelected = clueModalNpc.id === npc.id || clueModalNpc.name === npc.name;
                    return (
                      <button
                        key={npc.id || npc.name}
                        type="button"
                        onClick={() => setClueModalNpc(npc)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "14px",
                          border: `1.5px solid ${isSelected ? activePhoneSkin.accent : activePhoneSkin.border}`,
                          backgroundColor: isSelected ? activePhoneSkin.accent : "transparent",
                          color: isSelected ? activePhoneSkin.accentText : activePhoneSkin.text,
                          fontSize: "0.74rem",
                          fontWeight: isSelected ? "800" : "500",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          flexShrink: 0
                        }}
                      >
                        {npc.name}
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "38vh" }}>
                {(() => {
                  const npcClues = (activeSession?.sheet?.clues || []).filter(c => 
                    c.name.includes(clueModalNpc.name) || 
                    c.npcName === clueModalNpc.name || 
                    (allNpcs.length <= 1)
                  );

                  if (npcClues.length === 0) {
                    return (
                      <div style={{ textAlign: "center", padding: "26px 0", fontSize: "0.78rem", color: activePhoneSkin.textMuted, lineHeight: "1.6" }}>
                        [{clueModalNpc.name}]의 파악된 취향이 아직 없습니다.<br />
                        대화를 통해 좋아하는 것을 물어보세요!
                      </div>
                    );
                  }
                  return npcClues.map((clue, idx) => {
                    const isDislike = clue.type === "dislike";
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          padding: "12px 14px", 
                          backgroundColor: activePhoneSkin.shellBg, 
                          border: `1px solid ${activePhoneSkin.border}`, 
                          borderRadius: "12px", 
                          borderLeft: `3.5px solid ${isDislike ? (theme.danger || "#ef4444") : activePhoneSkin.accent}`,
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: "800", fontSize: "0.86rem", color: isDislike ? (theme.danger || "#ef4444") : activePhoneSkin.accent }}>
                            {isDislike ? "💔 기피: " : "💖 선호: "}{clue.name}
                          </span>
                          <span style={{ fontSize: "0.68rem", color: isDislike ? (theme.danger || "#ef4444") : activePhoneSkin.textMuted, fontWeight: "700" }}>
                            {isDislike ? "주의" : "선호"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.76rem", color: activePhoneSkin.text, lineHeight: "1.5" }}>
                          {clue.desc}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ⏳ 3. 2초 시간 경과 암전 오버레이 연출 */}
      {timeTransition && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.88)",
          backdropFilter: "blur(6px)",
          transition: "all 0.5s ease-in-out",
          userSelect: "none"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "38px", marginBottom: "16px", animation: "spin 2s linear infinite" }}>
              ⏳
            </div>
            <div style={{ color: "#d6d3d1", fontSize: "14px", letterSpacing: "2px", opacity: 0.85, fontFamily: "serif" }}>
              고요히 흐르는 시간 속에 머무는 중……
            </div>
            <div style={{ color: "#fde68a", fontSize: "17px", fontWeight: "bold", letterSpacing: "3px", marginTop: "10px" }}>
              [ {timeTransition} ]
            </div>
          </div>
        </div>
      )}
{/* 🌟 튜토리얼 & 시나리오 제작 모달 */}
      {isTutorialModalOpen && (
        <div 
          onClick={() => {
            setIsTutorialModalOpen(false);
            setTutorialView("menu");
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              backgroundColor: theme.panel || "#18181b",
              border: `1px solid ${theme.border || "#27272a"}`,
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 20px 30px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            {/* 1. 기본 튜토리얼 메뉴 뷰 */}
            {tutorialView === "menu" ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: theme.text }}>
                      🔰 빠른 가이드 & 튜토리얼
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: theme.textSub || "#a1a1aa" }}>
                      체험하고 싶은 규칙이나 가이드를 선택하세요.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTutorialModalOpen(false)}
                    style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "1.2rem", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={() => handleStartTutorial("coc")}
                    style={{
                      padding: "12px 14px",
                      backgroundColor: theme.panelAlt || "#27272a",
                      border: `1px solid ${theme.border || "#3f3f46"}`,
                      borderRadius: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>🐙</span>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "800", color: theme.text }}>
                        크툴루의 부름 (CoC) 3분 체험
                      </div>
                      <div style={{ fontSize: "0.72rem", color: theme.textSub || "#a1a1aa", marginTop: "2px" }}>
                        1D100 판정, 단서 조사, 이성(SAN) 체크를 배웁니다.
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStartTutorial("insane")}
                    style={{
                      padding: "12px 14px",
                      backgroundColor: theme.panelAlt || "#27272a",
                      border: `1px solid ${theme.border || "#3f3f46"}`,
                      borderRadius: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>🎲</span>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "800", color: theme.text }}>
                        인세인 (inSANe) 3분 체험
                      </div>
                      <div style={{ fontSize: "0.72rem", color: theme.textSub || "#a1a1aa", marginTop: "2px" }}>
                        감정 판정, 특기 2D6 판정, 비밀 해금 및 의식을 배웁니다.
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTutorialView("studio_guide")}
                    style={{
                      padding: "12px 14px",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      borderRadius: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>🎬</span>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#818cf8" }}>
                        나만의 시나리오 만들기 (양식 직접 작성) ➔
                      </div>
                      <div style={{ fontSize: "0.72rem", color: theme.textSub || "#a1a1aa", marginTop: "2px" }}>
                        키워드를 직접 조합하여 AI 시나리오 프롬프트를 작성합니다.
                      </div>
                    </div>
                  </button>
                </div>
              </>
            ) : (
<>
                {/* 상단 네비게이션 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setTutorialView("menu")}
                    style={{ background: "none", border: "none", color: "#818cf8", fontSize: "0.85rem", cursor: "pointer", fontWeight: "700", padding: 0 }}
                  >
                    ← 뒤로 가기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTutorialModalOpen(false);
                      setTutorialView("menu");
                    }}
                    style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "1.2rem", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>

                {/* 📌 상단 원클릭 자동 완성 키워드 칩 */}
                <div style={{ padding: "14px 16px", backgroundColor: theme.panelAlt || "#27272a", borderRadius: "12px", border: `1.5px solid ${theme.border || "#3f3f46"}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.86rem", fontWeight: "800", color: theme.accent || "#38bdf8" }}>
                      💡 추천 룰 & 키워드 (클릭 시 아래 1·2번에 자동 입력)
                    </span>
                    <span style={{ fontSize: "0.74rem", color: theme.textMuted || "#a1a1aa" }}>
                      터치하여 간편 선택
                    </span>
                  </div>

                  {/* 1) 룰 선택 칩 */}
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.textMuted || "#a1a1aa", marginBottom: "6px" }}>
                      [룰 선택]
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {["자유 서사", "크툴루의 부름 (CoC 7판)", "인세인 (inSANe)", "미연시 (연애 시뮬)"].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setStudioPromptForm({ ...studioPromptForm, rule: r })}
                          style={{
                            padding: "5px 11px",
                            backgroundColor: studioPromptForm.rule === r ? (theme.accent || "#38bdf8") : (theme.panel || "#18181b"),
                            color: studioPromptForm.rule === r ? "#fff" : theme.text,
                            border: `1px solid ${studioPromptForm.rule === r ? (theme.accent || "#38bdf8") : (theme.border || "#3f3f46")}`,
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: "700",
                            cursor: "pointer"
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2) 관계성 칩 */}
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.textMuted || "#a1a1aa", marginBottom: "6px" }}>
                      [관계성 & 감정선]
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {[
                        "#쌍방구원", "#혐관", "#애증", "#신분차", "#비밀계약", 
                        "#착각계", "#짝사랑", "#달달일상", "#후회/미련", "#배틀", 
                        "#운명적유대", "#스폰서/후원", "#사제지간", "#소꿉친구"
                      ].map((tag) => {
                        const isAdded = (studioPromptForm.keywords || "").includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const cur = studioPromptForm.keywords || "";
                              if (isAdded) {
                                setStudioPromptForm({ ...studioPromptForm, keywords: cur.replace(tag, "").replace(/\s+/g, " ").trim() });
                              } else {
                                setStudioPromptForm({ ...studioPromptForm, keywords: cur ? `${cur} ${tag}` : tag });
                              }
                            }}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: isAdded ? "rgba(99, 102, 241, 0.25)" : (theme.panel || "#18181b"),
                              color: isAdded ? "#818cf8" : theme.text,
                              border: `1px solid ${isAdded ? "#6366f1" : (theme.border || "#3f3f46")}`,
                              borderRadius: "14px",
                              fontSize: "0.78rem",
                              fontWeight: isAdded ? "800" : "500",
                              cursor: "pointer"
                            }}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3) 배경 기믹 칩 */}
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.textMuted || "#a1a1aa", marginBottom: "6px" }}>
                      [배경 & 사건 기믹]
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {[
                        "#오컬트", "#폐쇄병동", "#고립된저택", "#도시괴담", "#코스믹호러", 
                        "#추리/수사", "#시간루프", "#기억상실", "#시한부", "#가면무도회", 
                        "#아포칼립스", "#동양풍/사극", "#사이버펑크", "#금지된의식"
                      ].map((tag) => {
                        const isAdded = (studioPromptForm.keywords || "").includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const cur = studioPromptForm.keywords || "";
                              if (isAdded) {
                                setStudioPromptForm({ ...studioPromptForm, keywords: cur.replace(tag, "").replace(/\s+/g, " ").trim() });
                              } else {
                                setStudioPromptForm({ ...studioPromptForm, keywords: cur ? `${cur} ${tag}` : tag });
                              }
                            }}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: isAdded ? "rgba(229, 169, 60, 0.2)" : (theme.panel || "#18181b"),
                              color: isAdded ? "#fbbf24" : theme.text,
                              border: `1px solid ${isAdded ? "#f59e0b" : (theme.border || "#3f3f46")}`,
                              borderRadius: "14px",
                              fontSize: "0.78rem",
                              fontWeight: isAdded ? "800" : "500",
                              cursor: "pointer"
                            }}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 📝 복구된 1~7번 직접 입력 폼 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.text, display: "block", marginBottom: "4px" }}>
                      1. 룰 선택하기 (위의 칩을 누르거나 직접 입력) :
                    </label>
                    <input
                      type="text"
                      value={studioPromptForm.rule}
                      onChange={(e) => setStudioPromptForm({ ...studioPromptForm, rule: e.target.value })}
                      placeholder="예: CoC 7판 / 인세인 / 미연시 / 자유 서사"
                      style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg || "#141413", border: `1px solid ${theme.border || "#3f3f46"}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.text, display: "block", marginBottom: "4px" }}>
                      2. 키워드 선택하기 (위의 해시태그를 누르거나 직접 추가) :
                    </label>
                    <input
                      type="text"
                      value={studioPromptForm.keywords}
                      onChange={(e) => setStudioPromptForm({ ...studioPromptForm, keywords: e.target.value })}
                      placeholder="예: #쌍방구원 #혐관 #오컬트 #고립된저택"
                      style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg || "#141413", border: `1px solid ${theme.border || "#3f3f46"}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.text, display: "block", marginBottom: "4px" }}>
                      3. 주인공 나이, 성별 :
                    </label>
                    <input
                      type="text"
                      value={studioPromptForm.pcAgeGender}
                      onChange={(e) => setStudioPromptForm({ ...studioPromptForm, pcAgeGender: e.target.value })}
                      placeholder="예: 여성, 24세"
                      style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg || "#141413", border: `1px solid ${theme.border || "#3f3f46"}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.textMuted || "#9e9c96", display: "block", marginBottom: "4px" }}>
                      4. (선택) 주인공의 성격, 소지품, 배경 :
                    </label>
                    <input
                      type="text"
                      value={studioPromptForm.pcDetail}
                      onChange={(e) => setStudioPromptForm({ ...studioPromptForm, pcDetail: e.target.value })}
                      placeholder="예: 과묵하고 신중함 / 소지품: 회중시계, 만년필 / 전직 탐정"
                      style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg || "#141413", border: `1px solid ${theme.border || "#3f3f46"}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.textMuted || "#9e9c96", display: "block", marginBottom: "4px" }}>
                      5. (선택) 주인공의 비밀 :
                    </label>
                    <input
                      type="text"
                      value={studioPromptForm.pcSecret}
                      onChange={(e) => setStudioPromptForm({ ...studioPromptForm, pcSecret: e.target.value })}
                      placeholder="예: 과거 사건의 유일한 생존자이나 기억을 잃음"
                      style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg || "#141413", border: `1px solid ${theme.border || "#3f3f46"}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.text, display: "block", marginBottom: "4px" }}>
                      6. 등장했으면 하는 NPC 수(최대 10명) :
                    </label>
                    <input
                      type="text"
                      value={studioPromptForm.npcCount}
                      onChange={(e) => setStudioPromptForm({ ...studioPromptForm, npcCount: e.target.value })}
                      placeholder="예: 1명 (파트너) / 총 3명 (주요인물 1명, 서브 2명)"
                      style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg || "#141413", border: `1px solid ${theme.border || "#3f3f46"}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.textMuted || "#9e9c96", display: "block", marginBottom: "4px" }}>
                      7. (선택) 선호하는 NPC 외형 :
                    </label>
                    <input
                      type="text"
                      value={studioPromptForm.npcAppearance}
                      onChange={(e) => setStudioPromptForm({ ...studioPromptForm, npcAppearance: e.target.value })}
                      placeholder="예: 흑발 장발, 단정한 제복 차림 / 날카로운 인상의 은발"
                      style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg || "#141413", border: `1px solid ${theme.border || "#3f3f46"}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }}
                    />
                  </div>
                </div>

                {/* 🚀 최하단 복사 & 스튜디오 이동 버튼 */}
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      const assembledPrompt = `[시나리오 맞춤 생성 요청]
1. 룰: ${studioPromptForm.rule || "선택 안 함 (자유 서사 권장)"}
2. 분위기 및 키워드: ${studioPromptForm.keywords || "미지정"}
3. 주인공: ${studioPromptForm.pcAgeGender || "여성, 20대"}
${studioPromptForm.pcDetail ? `4. 주인공 상세/배경: ${studioPromptForm.pcDetail}` : ""}
${studioPromptForm.pcSecret ? `5. 주인공 비밀: ${studioPromptForm.pcSecret}` : ""}
6. 등장 NPC 구성: ${studioPromptForm.npcCount || "파트너 1명"}
${studioPromptForm.npcAppearance ? `7. 선호 NPC 외형: ${studioPromptForm.npcAppearance}` : ""}

위 설정을 충실히 반영하여 시놉시스, 시작 서막, 키퍼 전용 진상을 양식대로 작성해줘.`;

                      navigator.clipboard.writeText(assembledPrompt.trim());
                      setIsPromptCopied(true);
                      setTimeout(() => setIsPromptCopied(false), 2000);
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: isPromptCopied ? "#10b981" : (theme.panelAlt || "#27272a"),
                      color: isPromptCopied ? "#fff" : theme.text,
                      border: `1px solid ${isPromptCopied ? "#10b981" : (theme.border || "#3f3f46")}`,
                      borderRadius: "10px",
                      fontSize: "0.84rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {isPromptCopied ? "✓ 양식 복사됨!" : "📋 작성한 양식 복사"}
                  </button>

                  <a
                    href="https://gemini.google.com/gem/1laNhRvl9HlbyfErFfxUIs05pOrxSh_Sx?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setIsTutorialModalOpen(false);
                      setTutorialView("menu");
                      setShowPasteGuideBanner(true);
                    }}
                    style={{
                      flex: 1.2,
                      padding: "12px",
                      backgroundColor: "#6366f1",
                      color: "#ffffff",
                      borderRadius: "10px",
                      textAlign: "center",
                      textDecoration: "none",
                      fontWeight: "800",
                      fontSize: "0.84rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px"
                    }}
                  >
                    🚀 스튜디오로 이동하기 ➔
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
{/* 🌟 파일 첨부 & 텍스트 붙여넣기 통합 모달 */}
      {showPasteModal && (
        <div
          onClick={() => setShowPasteModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              backgroundColor: theme.panel || "#18181b",
              border: `1.5px solid ${theme.border || "#27272a"}`,
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 20px 35px rgba(0, 0, 0, 0.6)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border || "#27272a"}`, paddingBottom: "10px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800", color: theme.text }}>
                  📄 시나리오 불러오기
                </h3>
                <div style={{ fontSize: "0.72rem", color: theme.textMuted || "#a1a1aa", marginTop: "2px" }}>
                  문서 파일을 직접 올리거나, 스튜디오에서 복사한 글을 붙여넣으세요.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                style={{ background: "none", border: "none", color: "#a1a1aa", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* 1. 컴퓨터 파일 선택 */}
            <div>
              <label 
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px",
                  backgroundColor: theme.panelAlt || "#27272a",
                  border: `1.5px dashed ${theme.border || "#3f3f46"}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  color: theme.accent || "#38bdf8"
                }}
              >
                <span>📂</span>
                <span>컴퓨터 파일 불러오기 (.txt, .pdf, .md)</span>
                <input 
                  type="file" 
                  accept=".pdf,.txt,.md" 
                  onChange={(e) => {
                    handleFileUpload(e);
                    setShowPasteModal(false);
                  }} 
                  style={{ display: "none" }} 
                />
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: theme.border || "#3f3f46" }} />
              <span style={{ fontSize: "0.7rem", color: theme.textMuted || "#71717a", fontWeight: "700" }}>또는 텍스트 직접 붙여넣기</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: theme.border || "#3f3f46" }} />
            </div>

            {/* 2. 텍스트 붙여넣기 */}
            <textarea
              rows={8}
              value={pastedScenarioText}
              onChange={(e) => setPastedScenarioText(e.target.value)}
              placeholder={`스튜디오에서 복사한 시나리오 전체 글을 여기에 붙여넣으세요 (Ctrl + V)...`}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: theme.inputBg || "#141413",
                border: `1px solid ${theme.border || "#3f3f46"}`,
                borderRadius: "10px",
                color: theme.text,
                fontSize: "0.8rem",
                lineHeight: "1.5",
                resize: "vertical"
              }}
            />

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: theme.panelAlt || "#27272a",
                  border: `1px solid ${theme.border || "#3f3f46"}`,
                  borderRadius: "8px",
                  color: theme.textMuted || "#a1a1aa",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontWeight: "700"
                }}
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!pastedScenarioText.trim()) return alert("붙여넣은 내용이 없습니다.");
                  processScenarioText(pastedScenarioText);
                  setShowPasteModal(false);
                  setPastedScenarioText("");
                }}
                style={{
                  flex: 2,
                  padding: "10px",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.84rem",
                  fontWeight: "800",
                  cursor: "pointer"
                }}
              >
                🪄 로비에 자동 적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
