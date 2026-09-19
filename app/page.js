"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// =====================================================================
// 🎨 [1] UI 테마 및 스킨 데이터
// =====================================================================
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

const PHONE_SKINS = {
  default: { name: "시스템", icon: "✨", shellBg: "var(--panel)", headerBg: "var(--sidebar)", chatBg: "var(--panel)", panelAlt: "var(--panelAlt)", border: "var(--border)", text: "var(--text)", textMuted: "var(--textMuted)", navBtn: "var(--text)", inputBg: "var(--inputBg)", inputText: "var(--text)", userBubbleBg: "var(--accent)", userBubbleText: "#ffffff", npcBubbleBg: "var(--panelAlt)", npcBubbleText: "var(--text)", npcBubbleBorder: "var(--border)", accent: "var(--accent)", accentText: "#ffffff", heart: "var(--danger)" },
  kakao: { name: "옐로우", icon: "💬", shellBg: "#b2c7d9", headerBg: "#9bb3c7", chatBg: "#b2c7d9", panelAlt: "#ffffff", border: "rgba(0, 0, 0, 0.08)", text: "#191919", textMuted: "#556677", navBtn: "#1e1e1e", inputBg: "#ffffff", inputText: "#191919", userBubbleBg: "#fee500", userBubbleText: "#191919", npcBubbleBg: "#ffffff", npcBubbleText: "#191919", npcBubbleBorder: "rgba(0, 0, 0, 0.06)", accent: "#fee500", accentText: "#191919", heart: "#e03e52" },
  parchment: { name: "양피지", icon: "📜", shellBg: "#eddcc3", headerBg: "#d9c0a3", chatBg: "#ebd8be", panelAlt: "#f8f0e3", border: "rgba(100, 70, 35, 0.2)", text: "#382310", textMuted: "#7a5c3e", navBtn: "#382310", inputBg: "#fbf6ec", inputText: "#382310", userBubbleBg: "#be8a54", userBubbleText: "#ffffff", npcBubbleBg: "#fbf6ec", npcBubbleText: "#382310", npcBubbleBorder: "rgba(100, 70, 35, 0.25)", accent: "#8c531b", accentText: "#fdfaf5", heart: "#a83232" },
  cyber: { name: "네온", icon: "🔮", shellBg: "#080c14", headerBg: "#04060a", chatBg: "#070a12", panelAlt: "#0e1522", border: "rgba(0, 245, 212, 0.28)", text: "#e0fbfc", textMuted: "#5a7888", navBtn: "#00f5d4", inputBg: "#090f18", inputText: "#00f5d4", userBubbleBg: "#00f5d4", userBubbleText: "#020912", npcBubbleBg: "#121a27", npcBubbleText: "#e0fbfc", npcBubbleBorder: "rgba(0, 245, 212, 0.35)", accent: "#00f5d4", accentText: "#040810", heart: "#ff2a70" }
};

// =====================================================================
// 🎲 [2] TRPG 시스템 상수 (CoC / inSANe)
// =====================================================================
const COC_STAT_LABELS = { str: "근력", con: "건강", siz: "크기", dex: "민첩", app: "외모", int: "지능", pow: "정신", edu: "교육" };

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

const INSANE_MATRIX = [
  { category: "폭력", skills: ["소각", "고문", "포박", "협박", "파괴", "구타", "절단", "찌르기", "사격", "전쟁", "매장"] },
  { category: "정서", skills: ["연심", "기쁨", "걱정", "부끄러움", "웃음", "인내", "놀람", "노여움", "원한", "슬픔", "친애"] },
  { category: "지각", skills: ["고통", "관능", "촉감", "냄새", "맛", "소리", "풍경", "추적", "미행", "제육감", "그늘"] },
  { category: "기술", skills: ["분해", "전자기기", "정리", "약품", "효율", "미디어", "카메라", "탈것", "기계", "함정", "병기"] },
  { category: "지식", skills: ["물리학", "수학", "화학", "생물학", "의학", "교양", "인류학", "역사", "민속학", "고고학", "천문학"] },
  { category: "괴이", skills: ["시간", "혼돈", "심해", "죽음", "영혼", "마술", "암흑", "종말", "꿈", "지저", "우주"] }
];

const INSANE_EMOTIONS_TABLE = {
  1: { pos: "공감(+)", neg: "불신(-)" }, 2: { pos: "우정(+)", neg: "분노(-)" },
  3: { pos: "애정(+)", neg: "질투(-)" }, 4: { pos: "충성(+)", neg: "모멸(-)" },
  5: { pos: "동경(+)", neg: "열등감(-)" }, 6: { pos: "광신(+)", neg: "살의(-)" }
};

const INSANE_MADNESS_TABLE = [
  { roll: 1, name: "의혹", desc: "동행자의 사명과 대사를 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다." },
  { roll: 2, name: "망상", desc: "현실에 존재하지 않는 환청과 그림자를 보며 그것에 집착합니다." },
  { roll: 3, name: "강박증", desc: "소지품을 확인하거나 문을 잠그는 행동을 병적으로 반복합니다." },
  { roll: 4, name: "패닉", desc: "이성적 사고가 마비되어 위험 상황에서 무작정 몸을 숨깁니다." },
  { roll: 5, name: "폭력 충동", desc: "위협을 제거하기 위해 수단 방법을 가리지 않는 공격성을 드러냅니다." },
  { roll: 6, name: "쇼크", desc: "정신적 붕괴로 인해 다음 씬 동안 행동 선언이 극도로 제한됩니다." }
];

const INSANE_SCENE_TABLE = {
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

const ORIENT_TAGS = ["#GL", "#BL", "#HL", "#논로맨스"];
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#일상", "#오컬트", "이능력"];
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSW9Hbl6ff0YfgT7HIv-TccO8uBDQuOXCW4sucirgJg-U4Yd2uKns18wf32GKwxNfU0at8zROcVi-HI/pub?gid=593455354&single=true&output=csv";

// =====================================================================
// 🛠️ [3] 데이터 파싱 및 헬퍼 함수
// =====================================================================
const generateInsaneThemeAssets = (scenarioTitle = "", scenarioText = "") => {
  const text = `${scenarioTitle} ${scenarioText}`.toLowerCase();
  if (text.includes("극장") || text.includes("무대") || text.includes("오페라") || text.includes("배우") || text.includes("음악")) {
    return {
      prize: { id: "prize_" + Date.now(), title: "[프라이즈] 진홍의 오페라 글라스", desc: "무대 위 숨겨진 괴이의 실체를 간파할 수 있는 기묘한 망원경입니다. (회상 판정 +1)", revealed: true, type: "prize" },
      rituals: [{ id: 1, name: "1단계: 무대 조명 강제 정지", skill: "도구", completed: false }, { id: 2, name: "2단계: 진혼의 공명", skill: "소리", completed: false }, { id: 3, name: "3단계: 커튼 강제 폐막", skill: "슬픔", completed: false }]
    };
  }
  if (text.includes("병원") || text.includes("의사") || text.includes("약") || text.includes("감염")) {
    return {
      prize: { id: "prize_" + Date.now(), title: "[프라이즈] 시제 백신 앰플", desc: "괴이의 침식을 억제할 수 있는 최후의 약제입니다. (광기 획득 1회 방어)", revealed: true, type: "prize" },
      rituals: [{ id: 1, name: "1단계: 격리벽 폐쇄", skill: "기계", completed: false }, { id: 2, name: "2단계: 생체 변이 중화", skill: "의학", completed: false }, { id: 3, name: "3단계: 오염체 소각", skill: "파괴", completed: false }]
    };
  }
  if (text.includes("저택") || text.includes("신사") || text.includes("사당") || text.includes("제물")) {
    return {
      prize: { id: "prize_" + Date.now(), title: "[프라이즈] 저주받은 곡옥", desc: "원혼의 한이 서려 있는 부적입니다. (괴이 특기 판정 목표치 -1 완화)", revealed: true, type: "prize" },
      rituals: [{ id: 1, name: "1단계: 핏빛 주술진 파괴", skill: "종교", completed: false }, { id: 2, name: "2단계: 악의 정화", skill: "어둠", completed: false }, { id: 3, name: "3단계: 원혼 영구 봉인", skill: "영감", completed: false }]
    };
  }
  return {
    prize: { id: "prize_" + Date.now(), title: "[프라이즈] 결정적 단서가 담긴 녹음기", desc: "사건의 모든 진실을 담고 있는 결정적 물증입니다.", revealed: true, type: "prize" },
    rituals: [{ id: 1, name: "1단계: 도주로 차단", skill: "추적", completed: false }, { id: 2, name: "2단계: 흉기 무력화", skill: "결박", completed: false }, { id: 3, name: "3단계: 집착의 사념 파괴", skill: "사랑", completed: false }]
  };
};

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

function parseCSV(text) {
  let p = '', c = '', r = [], q = false, row = [''];
  for (let i = 0; i < text.length; i++) {
    c = text[i]; let next = text[i + 1];
    if (c === '"') {
      if (q && next === '"') { row[row.length - 1] += '"'; i++; }
      else { q = !q; }
    } else if (c === ',' && !q) { row.push(''); } 
    else if ((c === '\r' || c === '\n') && !q) {
      if (c === '\r' && next === '\n') { i++; }
      r.push(row); row = [''];
    } else { row[row.length - 1] += c; }
  }
  if (row.length > 1 || row[0] !== '') r.push(row);
  return r;
}

function convertRowToPreset(row, index, headers = []) {
  if (!row || row.length === 0) return null;
  const cleanHeaders = (headers || []).map(h => (h || "").toString().replace(/[\s_]/g, "").toLowerCase());
  const findIdx = (regex) => cleanHeaders.findIndex(h => regex.test(h));

  let titleIdx = findIdx(/^(시나리오제목|제목|시나리오명|title)$/i);
  if (titleIdx === -1) {
    const firstVal = (row[0] || "").toString().trim().toUpperCase();
    if (firstVal === "TRUE" || firstVal === "FALSE") titleIdx = (row[1] || "").toString().trim().startsWith("http") ? 2 : 1;
    else if ((row[0] || "").toString().trim().startsWith("http")) titleIdx = 1;
    else titleIdx = 0;
  }
  const title = (row[titleIdx] || "").toString().trim();

  const pubIdx = findIdx(/^(공개|공개여부|상태|게시|open|public|노출)$/i);
  const firstColVal = (row[0] || "").toString().trim().toUpperCase();
  const isFirstColBoolean = firstColVal === "TRUE" || firstColVal === "FALSE";
  let isHidden = false;
  if (pubIdx !== -1) {
    const pubVal = (row[pubIdx] || "").toString().trim().toUpperCase();
    isHidden = pubVal === "FALSE" || pubVal === "비공개" || pubVal === "X" || pubVal === "N" || pubVal === "준비중" || pubVal === "0";
  } else if (isFirstColBoolean) {
    if (firstColVal === "FALSE") isHidden = true;
  }
  if (title.includes("비공개") || title.startsWith("//") || title.startsWith("[비공개]")) isHidden = true;
  if (isHidden || !title || title === "TRUE" || title === "FALSE" || title.startsWith("http")) return null;

  const getVal = (regex, relativeOffset) => {
    const hIdx = findIdx(regex);
    if (hIdx !== -1 && hIdx < row.length) {
      const v = (row[hIdx] || "").toString().trim();
      if (v) return v;
    }
    const fallbackIdx = titleIdx + relativeOffset;
    return fallbackIdx < row.length ? (row[fallbackIdx] || "").toString().trim() : "";
  };

  const rule = getVal(/^(룰|룰모드|룰시스템|시스템|mode|rule)$/i, 1);
  const tags = getVal(/^(태그|서사태그|장르|키워드|tags?)$/i, 2);
  const synopsis = getVal(/^(공개시놉시스|시놉시스|줄거리|synopsis)$/i, 3);
  const opening = getVal(/^(서막|도입|도입부|오프닝|opening)$/i, 4);
  const truth = getVal(/^(키퍼전용진상|진상|비밀|기밀|truth)$/i, 5);
  const pcName = getVal(/^(pc이름|pc명|주인공이름|주인공|pc)$/i, 6);
  const pcJob = getVal(/^(pc직업|주인공직업|직업)$/i, 7);
  const pcAgeGender = getVal(/^(pc나이|나이성별|연령성별|나이\/성별)$/i, 8);
  const pcBg = getVal(/^(pc배경|백스토리|pc성격|성격)$/i, 9);
  const pcMission = getVal(/^(pc사명|공개사명|사명)$/i, 10);
  const pcSecret = getVal(/^(pc비밀|숨겨진비밀)$/i, 11);
  const pcImg = getVal(/^(pc이미지|pc초상화|pc사진)$/i, 12);
  const skills = getVal(/^(특기|습득특기|보유특기|skills?)$/i, 13);
  const curiosity = getVal(/^(호기심|호기심분야)$/i, 14);
  const fear = getVal(/^(공포심|공포|공포특기)$/i, 15);

  const kpcList = [];
  for (let i = 1; i <= 10; i++) {
    const offset = 16 + (i - 1) * 5;
    const name = getVal(new RegExp(`^(npc${i}이름|kpc${i}이름${i === 1 ? '|kpc이름|파트너이름' : ''})$`, 'i'), offset);
    const job = getVal(new RegExp(`^(npc${i}직업|kpc${i}직업${i === 1 ? '|kpc직업|파트너직업' : ''})$`, 'i'), offset + 1);
    let detail = getVal(new RegExp(`^(npc${i}상세|kpc${i}상세${i === 1 ? '|npc1특징' : ''})$`, 'i'), offset + 2);
    const secret = getVal(new RegExp(`^(npc${i}비밀|kpc${i}비밀${i === 1 ? '|kpc비밀' : ''})$`, 'i'), offset + 3);
    const img = getVal(new RegExp(`^(npc${i}이미지|kpc${i}이미지${i === 1 ? '|kpc이미지' : ''})$`, 'i'), offset + 4);

    if (!name || !name.trim()) continue;
    if (/^(cg\s*\d+|이벤트\s*cg|cg_)/i.test(name.trim()) || name.trim().startsWith("http")) continue;

    const statMatch = (detail || "").match(/(?:상태\s*메시지|상메)\s*[:：]?\s*["'“]?([^"'”\r\n.]+?)["'”]?\s*(?:\.|\n|$)/i);
    const extractedStatus = statMatch ? statMatch[1].trim() : "";
    const genderMatch = (detail || "").match(/성별\s*[:：]\s*([^\n\r,/]+)/i);
    const ageMatch = (detail || "").match(/나이\s*[:：]\s*([^\n\r,/]+)/i);
    detail = (detail || "").replace(/(?:역할|성별|나이)\s*[:：][^\n\r]+(?:\r?\n)?/gi, "").trim();

    kpcList.push({
      id: Date.now() + i, name: name.trim(), gender: genderMatch ? genderMatch[1].trim() : "", age: ageMatch ? ageMatch[1].trim().replace(/[^0-9]/g, "") : "",
      job: job || "", detail: detail || "", secret: secret || "", portraitUrl: img || "", showSecret: false, statusMessage: extractedStatus
    });
  }

  const cgStartIdx = findIdx(/^(cg1|이벤트cg1|cg\s*1|cg1제목)/i);
  const startCol = cgStartIdx !== -1 ? cgStartIdx : (61 + (titleIdx > 0 ? titleIdx : 0));
  const eventCgs = [];
  for (let c = startCol; c + 2 < row.length; c += 3) {
    const cgTitle = row[c]?.trim();
    const cgTrigger = row[c + 1]?.trim();
    const cgUrl = row[c + 2]?.trim();
    if (cgTitle && cgUrl && cgUrl.startsWith("http")) eventCgs.push({ title: cgTitle, trigger: cgTrigger || "", imageUrl: cgUrl });
  }

  const thumbIdx = findIdx(/^(세션카드|대표이미지|썸네일|표지)$/i);
  let sessionCardImg = thumbIdx !== -1 ? (row[thumbIdx] || "").trim() : "";
  if (!sessionCardImg && titleIdx > 0) {
    for (let k = 0; k < titleIdx; k++) {
      const cand = (row[k] || "").trim();
      if (cand.startsWith("http")) { sessionCardImg = cand; break; }
    }
  }

  let resolvedMode = "insane";
  const rawRule = (rule || "").toString().trim();
  if (/미연시|연애|dating/i.test(rawRule)) resolvedMode = "dating";
  else if (/크툴루|coc/i.test(rawRule)) resolvedMode = "coc";
  else if (/인세인|insane/i.test(rawRule)) resolvedMode = "insane";
  else if (/자유|free/i.test(rawRule)) resolvedMode = "freeform";
  else if (rawRule) resolvedMode = rawRule.toLowerCase();

  return {
    id: 9000000000000 + index, presetTitle: title || "새 시나리오", scenarioTitle: title || "새 시나리오",
    thumbnail: sessionCardImg, wizardMode: resolvedMode, playPreference: tags || "", publicSynopsis: synopsis || "",
    openingScene: opening || "", hiddenTruth: truth || "", charName: pcName || "주인공", charJob: pcJob || "",
    charAge: (pcAgeGender || "").toString().match(/\d+/)?.[0] || "20", charGender: (pcAgeGender || "").toString().match(/여성|남성/)?.[0] || "여성",
    charBackground: pcBg || "", charMission: pcMission || "", charSecret: pcSecret || "", charPortraitUrl: pcImg || "",
    insaneSkills: (skills || "").split(",").map(s => s.trim()).filter(Boolean), insaneCuriosity: curiosity || "정서",
    insaneFear: fear || "죽음", insaneLimit: 3, kpcList: kpcList, eventCgs: eventCgs
  };
}
// =====================================================================
// 🚀 [Block 2] 메인 애플리케이션 시작 및 상태(State) 관리
// =====================================================================
export default function App() {
  // 🌟 [Phase 1 & 5] 시간/날짜 상태 머신 (Time & Day Engine)
  const [gameTime, setGameTime] = useState({ day: 1, phase: "낮", turnInPhase: 0, turnCount: 0 });

  const advanceTurnOnly = useCallback(() => {
    setGameTime(prev => ({ ...prev, turnInPhase: prev.turnInPhase + 1, turnCount: prev.turnCount + 1 }));
  }, []);

  const advanceTimePhase = useCallback(() => {
    setGameTime(prev => {
      const phases = ["오전", "낮", "저녁", "심야"];
      const currentIndex = phases.indexOf(prev.phase);
      if (currentIndex === phases.length - 1) return { ...prev, turnInPhase: prev.turnInPhase + 1, turnCount: prev.turnCount + 1 };
      return { ...prev, phase: phases[currentIndex + 1], turnInPhase: 0, turnCount: prev.turnCount + 1 };
    });
  }, []);

  const sleepNextDay = useCallback(() => {
    setGameTime(prev => ({ day: prev.day + 1, phase: "오전", turnInPhase: 0, turnCount: prev.turnCount + 1 }));
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // 🗄️ 기존 모든 상태(State) 변수 모음 (누락 제로 보장)
  // ─────────────────────────────────────────────────────────────────
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showCgAlbumModal, setShowCgAlbumModal] = useState(false);
  const [parsedEnemyName, setCharEnemyName] = useState("");
  const [parsedPrizes, setParsedPrizes] = useState([]);
  const [parsedRituals, setParsedRituals] = useState([]);
  
  // 인세인 전용 UI 상태
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const [showInsaneGuideModal, setShowInsaneGuideModal] = useState(false);
  const [investigationModal, setInvestigationModal] = useState(null);
  const [emotionModal, setEmotionModal] = useState(null);
  const [reviveModalOpen, setReviveModalOpen] = useState(false);
  const [usableHealItem, setUsableHealItem] = useState(null);
  const [weaponRerollModal, setWeaponRerollModal] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [climaxRound, setClimaxRound] = useState(1);
  const [climaxStep, setClimaxStep] = useState("plot"); 
  const [emotionModalOpen, setEmotionModalOpen] = useState(false);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [selectedEmotionTarget, setSelectedEmotionTarget] = useState(null);
  
  const [toast, setToast] = useState(null); 
  const triggerToast = (title, message, icon = "✨") => { setToast({ title, message, icon }); setTimeout(() => setToast(null), 3000); };
  
  const [emotionTargetNpc, setEmotionTargetNpc] = useState(null);
  const [emotionDiceResult, setEmotionDiceResult] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 미연시 & 통합 서사 신규 State
  const [currentPhase, setCurrentPhase] = useState("낮"); 
  const [timeTransition, setTimeTransition] = useState(null); 
  const [recentEvents, setRecentEvents] = useState([]); 
  const [locationCards, setLocationCards] = useState([]); 
  const [incomingCall, setIncomingCall] = useState(null); 
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false); 
  const [voiceCallNpc, setVoiceCallNpc] = useState(null); 
  const [isCallModalOpen, setIsCallModalOpen] = useState(true); 
  const [isCallInputFocused, setIsCallInputFocused] = useState(false); 
  const [collapsedPhotos, setCollapsedPhotos] = useState({});

  // 🎬 시네마틱 CG 및 컷씬 상태
  const [activeCutsceneCg, setActiveCutsceneCg] = useState(null); 
  const [unlockedCgList, setUnlockedCgList] = useState([]); 
  const [scenarioCgs, setScenarioCgs] = useState([]); 
  const [scenarioThumbnail, setScenarioThumbnail] = useState(""); 
  const [zoomedCardUrl, setZoomedCardUrl] = useState(null);
  const [showCgDialog, setShowCgDialog] = useState(true); 

  // 버전 관리 및 공지사항
  const APP_VERSION = "v1.4.0";
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [activeNoticeTab, setActiveNoticeTab] = useState("update");
  const [hideNoticeCheckbox, setHideNoticeCheckbox] = useState(false);
  const [abortController, setAbortController] = useState(null);

  // 반응형 및 오버레이
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isTabletopOpen, setIsTabletopOpen] = useState(false);

  // 모달 제어
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSkillMatrixModal, setShowSkillMatrixModal] = useState(false); 
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [isEditingPortrait, setIsEditingPortrait] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [ruleHelpModal, setRuleHelpModal] = useState(null); 
  const [showLobbyPresetModal, setShowLobbyPresetModal] = useState(false);
  const [lobbyPresets, setLobbyPresets] = useState([]);
  const [lobbyPresetTab, setLobbyPresetTab] = useState("public"); 
  const [officialPresets, setOfficialPresets] = useState([
    {
      id: "official_dating_1", presetTitle: "온실의 오후 (미연시 입문)", scenarioTitle: "온실의 오후", wizardMode: "dating", playPreference: "#GL #달달 #일상",
      publicSynopsis: "비 내리는 늦은 오후, 조용한 식물원 온실에서 차를 마시며 상대방과의 조심스러운 유대를 쌓아가는 잔잔한 일상 이야기입니다.",
      openingScene: "후두둑 유리창을 두드리는 빗소리 사이로 은은한 허브 향이 피어오릅니다. 테이블 맞은편에서 따뜻한 잔을 쥔 파트너가 조용히 당신을 바라봅니다.",
      hiddenTruth: "평화로워 보이지만, 상대방은 조만간 이곳을 떠나야 할지도 모른다는 남모를 고민을 품고 있습니다. 호감도 60 이상 도달 시 고민을 털어놓습니다.",
      charName: "클레어", charJob: "다정함, 경청가", charBackground: "24세, 여성. 온화하고 배려심이 깊은 성격.\n소지품: 손수건, 틴케이스 캔디", charMission: "상대방과 편안하고 따뜻한 오후를 보낸다.", charSecret: "사실 오래전부터 그녀를 조용히 눈여겨보고 있었다.", charPortraitUrl: "",
      kpcList: [{ id: 1, name: "아델", job: "온실 관리자", detail: "26세, 여성. 차분하고 단정한 인상. 상태 메시지는 '비 오는 날의 온기'. 은은한 허브티와 잔잔한 독서를 좋아하고, 소란스러운 장소를 싫어합니다.", secret: "가족과의 문제로 곧 다른 지역으로 떠나야 할 위기에 처해 있습니다.", portraitUrl: "", showSecret: false }]
    }
  ]);

  // 테마 상태
  const [currentPalette, setCurrentPalette] = useState("cloud");
  const [fontChoice, setFontChoice] = useState("maru");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [vibrationLevel, setVibrationLevel] = useState("medium"); 
  const [isPhoneDrawerOpen, setIsPhoneDrawerOpen] = useState(false);
  const [activePhoneContactId, setActivePhoneContactId] = useState(null);
  const [phoneNavTab, setPhoneNavTab] = useState("chats"); 
  const [selectedProfileNpc, setSelectedProfileNpc] = useState(null); 
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false); 
  const [giftModalNpc, setGiftModalNpc] = useState(null); 
  const [clueModalNpc, setClueModalNpc] = useState(null); 
  const [zoomedPortrait, setZoomedPortrait] = useState(null); 
  const [pendingRollback, setPendingRollback] = useState(null); 
  const [appToast, setAppToast] = useState(null); 
  const [lobbySaveModal, setLobbySaveModal] = useState(null); 
  const [lobbySaveInput, setLobbySaveInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [isPhoneSending, setIsPhoneSending] = useState(false);
  const [phoneSuggestions, setPhoneSuggestions] = useState([]);
  const [phoneTheme, setPhoneTheme] = useState("default"); 
  const [dragStartY, setDragStartY] = useState(null);
  const [dragCurrentY, setDragCurrentY] = useState(0);

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
  const [tutorialView, setTutorialView] = useState("menu"); 
  const [studioPromptForm, setStudioPromptForm] = useState({ rule: "", keywords: "", pcAgeGender: "", pcDetail: "", pcSecret: "", npcCount: "", npcAppearance: "" });
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedScenarioText, setPastedScenarioText] = useState("");
  const [showPasteGuideBanner, setShowPasteGuideBanner] = useState(false);

  // 캐릭터 폼 상태
  const [charName, setCharName] = useState("");
  const [originalPresetPcName, setOriginalPresetPcName] = useState("");
  const [originalPresetNpcs, setOriginalPresetNpcs] = useState([]);
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("");
  const [charGender, setCharGender] = useState("");
  const [charBackground, setCharBackground] = useState("");
  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");
  const [showCharSecret, setShowCharSecret] = useState(false);
  const [charPortraitUrl, setCharPortraitUrl] = useState("");
  const [customPortraitPrompt, setCustomPortraitPrompt] = useState("");
  const [activePortraitTarget, setActivePortraitTarget] = useState("pc");
  const [showStudioModal, setShowStudioModal] = useState(false);

  // CoC 상태
  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });
  const [cocSkills, setCocSkills] = useState("관찰력 60, 자료조사 50, 듣기 40, 심리학 50");
  
  // 인세인 상태
  const [insaneLimit, setInsaneLimit] = useState(4);
  const [insaneSkills, setInsaneSkills] = useState(["연심", "소리", "정리"]);
  const [insaneCuriosity, setInsaneCuriosity] = useState("정서");
  const [insaneFear, setInsaneFear] = useState("죽음");
  const [generatedHandouts, setGeneratedHandouts] = useState([]);
  const [generatedItems, setGeneratedItems] = useState([]); 
  const [insaneItems, setInsaneItems] = useState({ "진통제": 2, "무기": 0, "부적": 0 });
  const [kpcList, setKpcList] = useState([{ id: 1, name: "파트너", job: "조력자", detail: "", secret: "", portraitUrl: "", showSecret: false }]);
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [publicSynopsis, setPublicSynopsis] = useState("");
  const [openingScene, setOpeningScene] = useState("");
  const [hiddenTruth, setHiddenTruth] = useState("");
  const [showHiddenTruth, setShowHiddenTruth] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [playPreference, setPlayPreference] = useState("#GL #쌍방구원 #달달");
  const [customPresets, setCustomPresets] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [activeMadnessAlert, setActiveMadnessAlert] = useState(null);
  const [showInsanityFlash, setShowInsanityFlash] = useState(false);

  // ─────────────────────────────────────────────────────────────────
  // 🧩 파생 변수 (Derived Variables)
  // ─────────────────────────────────────────────────────────────────
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const activePalette = THEME_PALETTES[currentPalette] || THEME_PALETTES.cloud;
  const theme = isDarkMode ? activePalette.dark : activePalette.light;
  const activePhoneSkin = PHONE_SKINS[phoneTheme] || PHONE_SKINS.default;

  const remainingPoints = 460 - (Number(cocStats.str) + Number(cocStats.con) + Number(cocStats.siz) + Number(cocStats.dex) + Number(cocStats.app) + Number(cocStats.int) + Number(cocStats.pow) + Number(cocStats.edu));
  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);
  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0";
  if (strPlusSiz <= 64) derivedDb = "-2"; else if (strPlusSiz <= 84) derivedDb = "-1"; else if (strPlusSiz <= 124) derivedDb = "0"; else if (strPlusSiz <= 164) derivedDb = "+1D4"; else derivedDb = "+1D6";

  const chatContainerRef = useRef(null);
  const phoneChatContainerRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────
  // 🔄 생명주기 및 초기화 (useEffect 모음)
  // ─────────────────────────────────────────────────────────────────
  
  // 1. 공지사항 7일 체크
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hideUntil = localStorage.getItem("rp_hub_hide_notice");
    if (!hideUntil || Date.now() > Number(hideUntil)) setShowNoticeModal(true);
  }, []);

  // 2. 구글 시트 프리셋 연동
  useEffect(() => {
    if (GOOGLE_SHEET_CSV_URL && GOOGLE_SHEET_CSV_URL.trim() !== "" && !GOOGLE_SHEET_CSV_URL.includes("여기에")) {
      fetch(GOOGLE_SHEET_CSV_URL)
        .then(res => res.text())
        .then(csvText => {
          const rows = parseCSV(csvText);
          const headers = rows[0] || [];
          const sheetPresets = rows.slice(1).map((row, idx) => convertRowToPreset(row, idx, headers)).filter(Boolean);
          if (sheetPresets.length > 0) setOfficialPresets(sheetPresets);
        })
        .catch(err => console.error("구글 시트 불러오기 실패:", err));
    }
  }, []);

  // 3. 로컬 프리셋 / 테마 연동
  useEffect(() => {
    try {
      const lp = localStorage.getItem("rp_hub_lobby_presets"); if (lp) setLobbyPresets(JSON.parse(lp));
      const savedTheme = localStorage.getItem("rp_hub_phone_theme"); if (savedTheme) setPhoneTheme(savedTheme);
    } catch(e) {}
  }, []);

  // 4. 모바일 리사이즈 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 5. 로컬 스토리지 데이터 로드
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

  // 6. 데이터 변경 시 자동 저장
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try { localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions)); } catch (e) {}
  }, [sessions, isLoaded]);

  // 7. 스크롤 자동 이동
useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }
}, [activeSession?.messages, isLoading]);

  // 8. 전화 수신 시 자동 서랍 열기
  useEffect(() => { if (incomingCall) setIsPhoneDrawerOpen(true); }, [incomingCall]);

  // 10. CG 도감 오해금 찌꺼기 청소
  useEffect(() => {
    if (!activeSession || !activeSession.messages || activeSession.messages.length === 0) return;
    const allScenarioCgs = activeSession.sheet?.scenarioCgs || activeSession.sheet?.cgs || scenarioCgs || [];
    if (allScenarioCgs.length === 0) return;
    const currentUnlocked = activeSession.sheet?.unlockedCgs || [];
    const isBeginning = activeSession.messages.length <= 2;
    
    if (isBeginning) {
      const firstCg = allScenarioCgs[0] || (currentUnlocked.length > 0 ? currentUnlocked[0] : null);
      const resetList = firstCg ? [{ ...(typeof firstCg === "object" ? firstCg : { title: firstCg }), unlockedAt: Date.now() }] : [];
      if (currentUnlocked.map(c => c?.title || "").join(",") !== resetList.map(c => c?.title || "").join(",")) {
        setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, sheet: { ...s.sheet, unlockedCgs: resetList } } : s));
      }
    }
  }, [activeSession?.id, activeSession?.messages?.length]);

  // 11. 모바일 뒤로가기(Popstate) 앱 종료 방지
  useEffect(() => {
    if (activeSessionId) window.history.pushState({ inSession: true }, "");
  }, [activeSessionId]);

  useEffect(() => {
    const handlePopState = () => {
      if (isPhoneDrawerOpen) return setIsPhoneDrawerOpen(false);
      if (isTabletopOpen) return setIsTabletopOpen(false);
      if (isSheetOpen) return setIsSheetOpen(false);
      if (isSidebarOpen) return setIsSidebarOpen(false);
      if (activeSessionId) setActiveSessionId(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeSessionId, isPhoneDrawerOpen, isTabletopOpen, isSheetOpen, isSidebarOpen]);

// =====================================================================
  // 🛠️ [Block 3.5] 누락 복구: 핵심 유틸 및 주사위 엔진
  // =====================================================================

  // 1. 휴대폰 자동 테마 감지
  const detectAutoPhoneTheme = (text) => {
    const t = text.toLowerCase();
    if (/판타지|중세|무협|동양|사극|황실|마법|오컬트|차원/.test(t)) return "parchment";
    if (/사이버펑크|SF|미래|네온|해커|우주/.test(t)) return "cyber";
    if (/현대|일상|학교|회사|카톡|메신저/.test(t)) return "kakao";
    return "default";
  };

  // 2. 자동 초상화 URL 생성기
  const getPortraitUrl = (seed) => {
    const style = portraitStyle === "anime" ? "anime masterpiece, highly detailed, beautiful" : "realistic cinematic portrait, highly detailed";
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(`${seed},${style}`)}?width=400&height=400&nologo=true`;
  };

// 🌟 [복구 완료] AI 시나리오 자동 생성기 (다중 젠더/관계성 연동)
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    const controller = new AbortController();
    setAbortController(controller);

    const randomSeeds = ["비밀 결사", "폭설로 고립된 저택", "안개 낀 호숫가", "금지된 오컬트 서점", "시간이 멈춘 시계탑", "가면무도회"];
    const pickedSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];

    const systemPrompt = `당신은 탁월한 창작력을 지닌 정통 TRPG 마스터입니다.
룰 [${wizardMode}]과 성향 [${playPreference}]에 맞춰 [모티프: ${pickedSeed}]를 살려 매번 완전히 새로운 시나리오를 창작하십시오.

[🚨 절대 수칙]
1. 젠더 및 관계성: 제공된 성향 태그([${playPreference}])에 따라 HL, BL, GL, 또는 논로맨스 서사를 적절히 구성하십시오. 인물의 성별은 태그에 맞게 자연스럽게 설정합니다.
2. 'PC', 'KPC'라는 단어를 일절 쓰지 말고 고유한 이름을 직접 지어 사용하십시오.
3. 맹목적이고 유치한 집착 표현을 배제하고, 섬세하고 깊은 유대감과 입체적인 신념을 묘사하십시오.

[주변 인물(엑스트라/조연) 묘사 및 개입 규칙]
1. 세계관 일관성: 스쳐 지나가는 조연들은 설정된 시대와 성향에 맞게 묘사합니다.
2. 기능성 엑스트라는 고유 이름 대신 직책(예: 시종장)으로만 지칭하십시오.
3. PC와 핵심 인물 간의 깊은 대화 중 무맥락으로 끼어들어 흐름을 끊는 개입은 엄격히 금지합니다.

반드시 마크다운 없이 순수 JSON으로만 응답하십시오:
{
  "name": "주인공 이름", "gender": "여성 또는 남성", "age": "나이", "job": "역할/직업",
  "background": "상처와 성격, 소지품 3가지 상세",
  "mission": "주인공의 표면상 사명", "secret": "주인공이 숨긴 진짜 목적이나 비밀",
  "kpcName": "파트너 이름", "kpcJob": "파트너 직업",
  "kpcDetail": "파트너 성격, 외모, 주인공과의 미묘한 관계성",
  "kpcSecret": "파트너가 숨겨둔 치명적인 비밀이나 진심",
  "limit": ${Math.floor(Math.random() * 2) + 3},
  "scenarioTitle": "독창적이고 매력적인 시나리오 제목",
  "publicSynopsis": "스포일러 없는 시놉시스 3~4줄",
  "openingScene": "서막의 공감각적 묘사와 첫 대사를 담은 풍성한 지문",
  "hiddenTruth": "배후 진상 및 흑막(Keeper 기밀)",
  "items": [ { "name": "소지품 1", "desc": "설명" }, { "name": "소지품 2", "desc": "설명" } ],
  "initialHandouts": [
    { "title": "주인공의 사명과 비밀", "overview": "현재 상황 개요", "secret": "뒤집었을 때의 진실" },
    { "title": "파트너의 태도와 시선", "overview": "겉으로 보이는 태도", "secret": "뒤집었을 때의 진짜 속마음" }
  ]
}`;
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ messages: [{ role: "user", text: systemPrompt }], scenarioText: "", playerSheet: {}, ruleMode: wizardMode, playPreference })
      });

      if (!response.ok) throw new Error(`서버 응답 오류 (상태 코드: ${response.status})`);
      const data = await response.json();
      const cleanJson = (data.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      const p = JSON.parse(cleanJson);

      const pName = p.name || ""; const kName = p.kpcName || "";
      setCharName(pName); setCharJob(p.job || ""); setCharAge(p.age || ""); setCharGender(p.gender || "여성"); setCharBackground(p.background || ""); 
      setCharPortraitUrl(getPortraitUrl(`${pName}, ${p.job}`));
      if (p.mission) setCharMission(p.mission); if (p.secret) setCharSecret(p.secret); if (p.limit) setInsaneLimit(Number(p.limit));

      setKpcList([{ id: 1, name: kName, gender: p.gender === "여성" ? "여성" : "남성", age: "미상", job: p.kpcJob || "", detail: p.kpcDetail || "", secret: p.kpcSecret || "", portraitUrl: getPortraitUrl(`${kName}, portrait`), showSecret: false }]);
      setScenarioTitle(p.scenarioTitle || ""); setPublicSynopsis(p.publicSynopsis || ""); setOpeningScene(p.openingScene || ""); setHiddenTruth(p.hiddenTruth || "");
      setGeneratedHandouts(p.initialHandouts || []); if (p.items && Array.isArray(p.items)) setGeneratedItems(p.items);
      if (wizardMode === "coc") handleRandomCocStats();
    } catch (e) {
      if (e.name === "AbortError") return;
      alert("AI 생성 실패: " + e.message);
    } finally {
      setIsAiGenerating(false); setAbortController(null);
    }
  };
 
 // =====================================================================
  // ⚙️ [Block 3] 유틸리티, 파일 파싱, TRPG 시스템 엔진
  // =====================================================================

  // 🌟 누락되었던 presets.json 불러오기 훅 복구!
  useEffect(() => {
    fetch(`/presets.json?t=${Date.now()}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`파일을 찾을 수 없음 (HTTP ${res.status})`);
        const text = await res.text();
        const data = JSON.parse(text);
        setOfficialPresets(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => console.error("presets.json 불러오기 실패:", err));
  }, []);

  // 1. 공통 모달 및 UI 제어
  const openModal = (setFn) => { window.history.pushState({ modalOpen: true }, ""); setFn(true); };
  const closeModal = (setFn) => { setFn(false); if (window.history.state?.modalOpen) window.history.back(); };
  const handleToggleDarkMode = () => { const next = !isDarkMode; setIsDarkMode(next); if (typeof window !== "undefined") localStorage.setItem("rp_hub_darkmode", next.toString()); };
  const handleSelectPalette = (pKey) => { setCurrentPalette(pKey); if (typeof window !== "undefined") localStorage.setItem("rp_hub_palette", pKey); };
  const handleSelectPhoneTheme = (thKey) => { setPhoneTheme(thKey); if (typeof window !== "undefined") localStorage.setItem("rp_hub_phone_theme", thKey); };
  const handleSaveVolume = (vol) => { setSoundVolume(vol); if (typeof window !== "undefined") localStorage.setItem("rp_hub_sound_vol", vol.toString()); };

  // 2. 햅틱(진동) 및 효과음
  const triggerVibration = (level = vibrationLevel) => {
    if (typeof window === "undefined" || !window.navigator?.vibrate || level === "off") return;
    try {
      if (level === "light") window.navigator.vibrate(35);
      else if (level === "medium") window.navigator.vibrate([60, 40, 60]);
      else if (level === "strong") window.navigator.vibrate([120, 50, 120]);
    } catch (e) {}
  };
  const handleSaveVibration = (lvl) => { setVibrationLevel(lvl); if (typeof window !== "undefined") localStorage.setItem("rp_hub_vibration", lvl); triggerVibration(lvl); };
  const playDiceSound = () => {
    if (soundVolume <= 0) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = "triangle";
        const startTime = ctx.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(160 + Math.random() * 150, startTime);
        osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.04);
        gain.gain.setValueAtTime(soundVolume * 0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(startTime); osc.stop(startTime + 0.05);
      }
    } catch (e) {}
  };

  // 3. 파일 처리 (PDF 파싱, 이미지 업로드, 백업/복원)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setIsPdfLoading(true);
      try {
        if (!window.pdfjsLib) {
          await new Promise((res, rej) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = res; script.onerror = rej; document.head.appendChild(script);
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
      } catch (err) { alert("PDF 오류: " + err.message); } finally { setIsPdfLoading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => processScenarioText(ev.target.result);
      reader.readAsText(file, "UTF-8");
    }
    e.target.value = null;
  };

  const handleSessionCardUpload = (sessionId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = img.width > 500 ? 500 / img.width : 1;
        canvas.width = img.width * scale; canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d"); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, thumbnail: canvas.toDataURL("image/jpeg", 0.8) } : s));
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
        canvas.width = 200; canvas.height = 200;
        const ctx = canvas.getContext("2d"); ctx.drawImage(img, 0, 0, 200, 200);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        if (activePortraitTarget === "pc") {
          if (activeSession) setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, portrait: dataUrl } } : s));
          else setCharPortraitUrl(dataUrl);
        } else {
          if (activeSession) setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, npcs: s.sheet.npcs.map(n => n.id === activePortraitTarget ? { ...n, portrait: dataUrl } : n) } } : s));
          else setKpcList(prev => prev.map(k => k.id === activePortraitTarget ? { ...k, portraitUrl: dataUrl } : k));
        }
        closeModal(setShowPortraitEditModal);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyCustomPortrait = () => {
    if (!customPortraitPrompt.trim()) return;
    const newUrl = customPortraitPrompt.startsWith("http") ? customPortraitPrompt : getPortraitUrl(customPortraitPrompt);
    if (activePortraitTarget === "pc") {
      if (activeSession) setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, portrait: newUrl } } : s));
      else setCharPortraitUrl(newUrl);
    } else {
      if (activeSession) setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, npcs: s.sheet.npcs.map(n => n.id === activePortraitTarget ? { ...n, portrait: newUrl } : n) } } : s));
      else setKpcList(prev => prev.map(k => k.id === activePortraitTarget ? { ...k, portraitUrl: newUrl } : k));
    }
    setCustomPortraitPrompt(""); closeModal(setShowPortraitEditModal);
  };

  const executeSaveBackup = () => {
    if (sessions.length === 0) return alert("백업할 세션이 없습니다.");
    const targets = backupTarget === "all" ? sessions : sessions.filter((s) => s.id === Number(backupTarget));
    const dateStr = new Date().toISOString().slice(0, 10);
    const content = backupFormat === "json" ? JSON.stringify(targets, null, 2) : targets.map(s => `[${s.title}]\n` + (s.messages || []).map(m => `${m.role}: ${m.text}`).join("\n\n")).join("\n===\n");
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
          const map = new Map(); prev.forEach(s => map.set(s.id, s)); imported.forEach(s => map.set(s.id, s)); return Array.from(map.values());
        });
        alert(`${imported.length}개 세션 복원 완료!`);
      } catch (err) { alert("복원 실패: " + err.message); }
    };
    reader.readAsText(file); e.target.value = null;
  };

  const executeExport = () => {
    const targets = sessions.filter(s => selectedExportSessionIds.includes(s.id));
    if (targets.length === 0) return alert("내보낼 세션을 선택해주세요.");
    const dateStr = new Date().toISOString().slice(0, 10);
    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(targets, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `TRPG_백업_${dateStr}.json`; a.click(); URL.revokeObjectURL(url);
    } else if (exportFormat === "pdf") { window.print(); } 
    else {
      let fullOutput = targets.map(s => {
        let msgs = exportScope === "storyOnly" ? (s.messages || []).filter(m => !m.text.includes("[🎲") && !m.text.includes("[⚠️") && !m.text.includes("[시스템")) : (s.messages || []);
        const pName = s.sheet?.name || "주인공"; const kName = s.sheet?.npcs?.[0]?.name || "파트너";
        if (exportFormat === "md") return `# 《${s.title}》\n\n` + msgs.map(m => `**${m.role === "user" ? pName : kName}**:\n${m.text}`).join("\n\n---\n\n") + "\n\n========================================\n\n";
        return `[《${s.title}》]\n\n` + msgs.map(m => `${m.role === "user" ? pName : kName}: ${m.text}`).join("\n\n") + "\n\n========================================\n\n";
      }).join("");
      const blob = new Blob([fullOutput], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `TRPG_기록_${dateStr}.${exportFormat}`; a.click(); URL.revokeObjectURL(url);
    }
    closeModal(setShowExportModal);
  };

  // 4. 프리셋 저장/불러오기 및 동기화 관리
  const handleSaveCurrentAsPreset = () => {
    const targetName = activeSession ? activeSession.sheet?.name : charName;
    if (!targetName) return alert("저장할 캐릭터 이름이 없습니다.");
    const sheetData = activeSession ? activeSession.sheet : { name: charName, job: charJob, age: charAge, gender: charGender, background: charBackground, portrait: charPortraitUrl, ruleMode: wizardMode, cocStats, cocSkills, insaneSkills, insaneCuriosity, insaneFear, mission: charMission, secret: charSecret };
    const newPreset = { id: Date.now(), title: `${sheetData.name} (${sheetData.job || "설정"})`, ...sheetData };
    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated); localStorage.setItem("rp_hub_custom_presets", JSON.stringify(updated));
    triggerToast("저장 완료", `'${sheetData.name}' 캐릭터가 프리셋으로 저장되었습니다!`);
  };

  const handleSaveSessionAsLobbyPreset = () => {
    if (!activeSession) return;
    const s = activeSession;
    setLobbySaveInput(s.title || `${s.sheet?.name || "캐릭터"} 세팅`);
    setLobbySaveModal({ isFromSession: true });
  };

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
        if (synMatch) parsedSynopsis = synMatch[1].trim(); if (opMatch) parsedOpening = opMatch[1].trim(); if (trMatch) parsedTruth = trMatch[1].trim();
      }
      const restoredKpcList = (s.sheet?.npcs || []).map((npc, idx) => ({ id: npc.id || Date.now() + idx, name: npc.name || "", gender: npc.gender || "", age: npc.age || "", job: npc.title || npc.job || "", detail: npc.detail || "", secret: npc.secret || "", portraitUrl: npc.portrait || "", showSecret: false }));
      const newLobbyPreset = {
        id: Date.now(), presetTitle: title, scenarioTitle: s.title || "", publicSynopsis: parsedSynopsis, openingScene: parsedOpening, hiddenTruth: parsedTruth, playPreference: s.preference || "", wizardMode: s.ruleMode || "coc", charName: s.sheet?.name || "", charJob: s.sheet?.job || "", charAge: s.sheet?.age || "24", charGender: s.sheet?.gender || "여성", charBackground: s.sheet?.background || "", charMission: s.sheet?.mission || "", charSecret: s.sheet?.secret || "", charPortraitUrl: s.sheet?.portrait || "", cocStats: s.sheet?.cocStats, cocSkills: s.sheet?.cocSkills || "", insaneSkills: s.sheet?.insaneSkills || [], insaneCuriosity: s.sheet?.insaneCuriosity || "정서", insaneFear: s.sheet?.insaneFear || "죽음", insaneLimit: s.sheet?.limit || 4, kpcList: restoredKpcList.length > 0 ? restoredKpcList : [{ id: 1, name: "파트너", job: "조력자", detail: "", secret: "", portraitUrl: "", showSecret: false }]
      };
      const updated = [newLobbyPreset, ...lobbyPresets];
      setLobbyPresets(updated); localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(updated));
    } else {
      const newLobbyPreset = { id: Date.now(), presetTitle: title, scenarioTitle, publicSynopsis, openingScene, hiddenTruth, playPreference, wizardMode, charName, charJob, charAge, charGender, charBackground, charMission, charSecret, charPortraitUrl, cocStats, cocSkills, insaneSkills, insaneCuriosity, insaneFear, insaneLimit, kpcList };
      const updated = [newLobbyPreset, ...lobbyPresets];
      setLobbyPresets(updated); localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(updated));
    }
    setLobbySaveModal(null); triggerToast("로비 저장", `'${title}' 로비 세팅이 저장되었습니다!`);
  };

  const handleLoadPreset = (preset) => {
    setCharName(preset.name || ""); setCharJob(preset.job || ""); setCharAge(preset.age || "24"); setCharGender(preset.gender || "여성"); setCharBackground(preset.background || ""); if (preset.portrait) setCharPortraitUrl(preset.portrait);
    if (preset.cocStats) setCocStats(preset.cocStats); if (preset.cocSkills) setCocSkills(preset.cocSkills); if (preset.insaneSkills) setInsaneSkills(preset.insaneSkills); if (preset.insaneCuriosity) setInsaneCuriosity(preset.insaneCuriosity); if (preset.insaneFear) setInsaneFear(preset.insaneFear); if (preset.mission) setCharMission(preset.mission); if (preset.secret) setCharSecret(preset.secret);
    closeModal(setShowPresetModal);
  };

  const handleLoadLobbyPreset = (p) => {
    if (p.charName) setOriginalPresetPcName(p.charName);
    const loadedCgs = p.scenarioCgs || p.eventCgs || p.cgs || p.initialSheet?.scenarioCgs || [];
    if (loadedCgs.length > 0) setScenarioCgs(loadedCgs);
    if (p.kpcList && Array.isArray(p.kpcList)) setOriginalPresetNpcs(p.kpcList.map(k => k.name).filter(Boolean));
    if (p.thumbnail) setScenarioThumbnail(p.thumbnail);
    setScenarioTitle(p.scenarioTitle || ""); setPublicSynopsis(p.publicSynopsis || ""); setOpeningScene(p.openingScene || ""); setHiddenTruth(p.hiddenTruth || ""); setPlayPreference(p.playPreference || ""); if (p.wizardMode) setWizardMode(p.wizardMode);
    setCharName(p.charName || ""); setCharJob(p.charJob || ""); setCharAge(p.charAge || "24"); setCharGender(p.charGender || "여성"); setCharBackground(p.charBackground || ""); setCharMission(p.charMission || ""); setCharSecret(p.charSecret || ""); setCharPortraitUrl(p.charPortraitUrl || "");
    if (p.cocStats) setCocStats(p.cocStats); if (p.cocSkills) setCocSkills(p.cocSkills); if (p.insaneSkills) setInsaneSkills(p.insaneSkills); if (p.insaneCuriosity) setInsaneCuriosity(p.insaneCuriosity); if (p.insaneFear) setInsaneFear(p.insaneFear); if (p.insaneLimit) setInsaneLimit(p.insaneLimit);
    if (p.kpcList && Array.isArray(p.kpcList)) setKpcList(p.kpcList);
    closeModal(setShowLobbyPresetModal);
  };

  const exportSingleLobbyPreset = (p) => {
    const fileName = `${(p.presetTitle || p.scenarioTitle || "시나리오").replace(/[\/\\:*?"<>|]/g, "_")}.json`;
    const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
    triggerToast("개별 백업 완료", `'${p.presetTitle}' 세팅 파일이 다운로드되었습니다.`);
  };

  const exportLobbyPresets = () => {
    if (lobbyPresets.length === 0) return alert("백업할 로비 세팅이 없습니다.");
    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(lobbyPresets, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `TRPG_로비세팅_${dateStr}.json`; a.click(); URL.revokeObjectURL(url);
  };

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
        setLobbyPresets(unique); localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(unique));
        alert(`${imported.length}개의 로비 세팅을 불러왔습니다!`);
      } catch (err) { alert("복원 실패: " + err.message); }
    };
    reader.readAsText(file); e.target.value = null;
  };

  const handleSyncCurrentSheet = async () => {
    if (!activeSession) return;
    const targetUrl = activeSession.sheetUrl || activeSession.sheet?.url || GOOGLE_SHEET_CSV_URL;
    if (!targetUrl) return triggerToast("동기화 오류", "시트 URL을 찾을 수 없습니다.", "⚠️");
    try {
      setIsLoading(true);
      const res = await fetch(targetUrl);
      const csvText = await res.text();
      const allRows = parseCSV(csvText);
      if (allRows.length < 2) throw new Error("시트 데이터가 비어 있습니다.");
      const headers = allRows[0];
      const dataRows = allRows.slice(1);
      const currentTitle = (activeSession.title || "").trim();
      const matchedRow = dataRows.find(r => { const rowTitle = (r[0] || "").trim(); return rowTitle === currentTitle || currentTitle.includes(rowTitle) || rowTitle.includes(currentTitle); });
      if (!matchedRow) {
        triggerToast("동기화 알림", "현재 시나리오와 일치하는 시트 행이 없어 기존 이미지를 유지합니다.", "💡");
        setIsLoading(false); return;
      }
      const thumbIdx = headers.findIndex(h => /세션카드|대표이미지|썸네일|표지/i.test(h?.replace(/\s+/g, '') || ""));
      const sessionCardImg = thumbIdx !== -1 ? matchedRow[thumbIdx]?.trim() : "";
      const eventCgs = [];
      for (let c = 61; c < matchedRow.length; c += 3) {
        const cgTitle = matchedRow[c]?.trim(); const cgTrigger = matchedRow[c + 1]?.trim(); const cgUrl = matchedRow[c + 2]?.trim();
        if (cgTitle && cgUrl) eventCgs.push({ title: cgTitle, trigger: cgTrigger || "", imageUrl: cgUrl });
      }
      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return { ...s, sheetUrl: targetUrl, thumbnail: sessionCardImg || s.thumbnail, sheet: { ...(s.sheet || {}), thumbnail: sessionCardImg || s.sheet?.thumbnail, cgs: eventCgs.length > 0 ? eventCgs : s.sheet?.cgs, scenarioCgs: eventCgs.length > 0 ? eventCgs : s.sheet?.scenarioCgs } };
        }
        return s;
      }));
      triggerToast("동기화 완료", "최신 시트 데이터가 동기화되었습니다!", "💡");
    } catch (err) { triggerToast("동기화 실패", err.message, "⚠️"); } finally { setIsLoading(false); }
  };

  // 5. TRPG 상태 조작 (주사위, 아이템, 판정 등)
  const toggleTag = (tag) => { setPlayPreference((prev) => { const list = prev.split(/\s+/).filter(Boolean); return list.includes(tag) ? list.filter((t) => t !== tag).join(" ") : [...list, tag].join(" "); }); };
  const toggleInsaneSkill = (skill) => { setInsaneSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]); };
  const handleRandomCocStats = () => {
    let stats = { str: 15, con: 15, siz: 15, dex: 15, app: 15, int: 15, pow: 15, edu: 15 };
    let rem = 460 - (15 * 8); const keys = Object.keys(stats);
    while (rem > 0) { const k = keys[Math.floor(Math.random() * keys.length)]; if (stats[k] < 85) { const add = Math.min(5, rem, 85 - stats[k]); stats[k] += add; rem -= add; } }
    setCocStats({ ...stats, luck: Math.floor(Math.random() * 50) + 40 });
  };
  const parseCocSkills = (skillsStr) => {
    if (!skillsStr) return [];
    return skillsStr.split(",").map(s => { const parts = s.trim().split(/\s+/); const val = Number(parts[parts.length - 1]); const name = parts.slice(0, -1).join(" "); return { name: name || s.trim(), val: isNaN(val) ? 50 : val }; }).filter(s => s.name);
  };
  const handleItemCountChange = (itemName, delta) => {
    const totalCount = Object.values(insaneItems).reduce((a, b) => a + b, 0); const currentCount = insaneItems[itemName] || 0;
    if (delta > 0 && totalCount >= 2) return triggerToast("아이템 제한", "초기 아이템은 최대 2개까지만 선택할 수 있습니다.", "⚠️");
    if (delta < 0 && currentCount <= 0) return;
    setInsaneItems(prev => ({ ...prev, [itemName]: currentCount + delta }));
  };
  const consumeItem = (itemName) => { setSessions(prev => prev.map(s => { if (s.id !== activeSessionId) return s; const updated = (s.sheet?.items || []).map(it => it.name === itemName ? { ...it, count: Math.max(0, (it.count||1) - 1) } : it); return { ...s, sheet: { ...s.sheet, items: updated } }; })); };
  const adjustStat = (statName, delta) => {
    if (!activeSession) return;
    const currentVal = Number(activeSession.sheet?.[statName] ?? 10);
    const newVal = Math.max(0, currentVal + delta);
    if (statName === "san" && delta < 0) {
      if (activeSession.ruleMode === "insane") drawMadnessCard(activeSessionId, true);
      else if (activeSession.ruleMode === "coc" && delta <= -5) triggerMadnessCheck("coc", Math.abs(delta), activeSessionId);
    }
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, [statName]: newVal } } : s));
  };
  const usePainkiller = () => {
    if (!activeSession || (activeSession.sheet.insaneItems?.painkiller || 0) <= 0) return;
    playDiceSound();
    const healRoll = Math.floor(Math.random() * 6) + 1;
    const curHp = activeSession.sheet.hp || 0; const maxHp = activeSession.sheet.maxHp || 6;
    const newHp = Math.min(maxHp, curHp + healRoll);
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, hp: newHp, insaneItems: { ...s.sheet.insaneItems, painkiller: s.sheet.insaneItems.painkiller - 1 } } } : s));
    // 이 executeMessage는 이따 파이프라인에서 정의될 것입니다. (호이스팅 허용)
    if(typeof executeMessage === "function") executeMessage(`[💊 진통제 복용] 고통을 가라앉힙니다. (1D6 ➔ ${healRoll} 회복 / HP: ${curHp} ➔ ${newHp})`);
  };
  const handleUseReviveItem = () => {
    if (!usableHealItem) return;
    const healRoll = Math.floor(Math.random() * 6) + 1;
    consumeItem(usableHealItem.name);
    setSessions(prev => prev.map(s => { if (s.id !== activeSessionId) return s; return { ...s, sheet: { ...s.sheet, hp: healRoll } }; }));
    setReviveModalOpen(false); setUsableHealItem(null);
    triggerToast("긴급 회복 성공!", `체력 ${healRoll}을(를) 회복했습니다!`, "💊");
    if(typeof executeMessage === "function") executeMessage(`[긴급 회복] 💊 의식을 잃기 직전, ${usableHealItem.name}을(를) 삼켜 1D6(${healRoll}) 회복!`);
  };
  const handleDeclineRevive = () => {
    setReviveModalOpen(false); setUsableHealItem(null);
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, hp: 0, phase: "배드엔딩" } } : s));
    triggerToast("게임 오버", "어둠 속으로 의식이 가라앉았습니다...", "💀");
  };

  // 6. 인세인(inSANe) 핵심 엔진
  const rollInsaneCheck = (skillName, overrideTarget = null, actionType = "판정") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true); playDiceSound();
    const learned = activeSession.sheet?.insaneSkills || [];
    const curiosity = activeSession.sheet?.insaneCuriosity || "정서";
    const targetVal = overrideTarget !== null ? overrideTarget : calculateInsaneTargetNumber(skillName, learned, curiosity);
    const rollInterval = setInterval(() => { setRollingDisplayNum(Math.floor(Math.random() * 12) + 1); }, 50);
    setTimeout(() => {
      clearInterval(rollInterval);
      const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const sum = d1 + d2;
      let outcome = ""; let bonusMessage = "";
      if (sum === 12) {
        outcome = "스페셜(대성공)"; bonusMessage = "\n[체계 알림] 스페셜 달성! 이성치가 1점 회복됩니다.";
        setSessions(prev => prev.map(s => { if (s.id !== activeSessionId) return s; const curSan = s.sheet?.san ?? 6; const maxSan = s.sheet?.maxSan ?? 6; return { ...s, sheet: { ...s.sheet, san: Math.min(maxSan, curSan + 1) } }; }));
      } else if (sum === 2) {
        outcome = "펌블(대실패)"; bonusMessage = "\n[체계 알림] 펌블 발생! 공포에 잠식되어 광기 1장을 획득합니다.";
        drawMadnessCard(activeSessionId, false);
      } else if (sum >= targetVal) { outcome = "성공"; } else { outcome = "실패"; }
      const logText = `[주사위 2D6 ${actionType}: ${d1}+${d2}=${sum} / 목표치: ${targetVal} (${skillName || "임의 판정"}) ➔ 결과: ${outcome}]${bonusMessage}`;
      setIsRolling(false);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, actionUsed: true } } : s));
      if(typeof executeMessage === "function") executeMessage(logText);
    }, animationEnabled ? 600 : 100);
  };

  const handleExecuteInvestigation = (targetType, targetObj, skillName) => {
    setInvestigationModal(null); setIsActionDrawerOpen(false);
    const learned = activeSession.sheet?.insaneSkills || []; const curiosity = activeSession.sheet?.insaneCuriosity || "정서";
    const targetVal = calculateInsaneTargetNumber(skillName, learned, curiosity);
    const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const sum = d1 + d2;
    const isSuccess = sum === 12 || (sum >= targetVal && sum !== 2);
    const targetDisplayName = targetObj.name || targetObj.title || "조사 대상";
    let resultDetail = "";
    if (isSuccess) {
      if (targetType === "secret") {
        resultDetail = `\n[조사 성공: 비밀 해금] 《${targetDisplayName}》의 숨겨진 진실이 해금되었습니다. 테이블탑 핸드아웃에서 내용을 확인하세요.`;
        setSessions(prev => prev.map(s => {
          if (s.id !== activeSessionId) return s;
          const currentSecret = targetObj.secret || (s.sheet?.handouts || []).find(h => (targetObj.id && (h.id === targetObj.id || h.npcId === targetObj.id)) || (targetObj.title && h.title === targetObj.title))?.secret || "";
          const isRitualNowDiscovered = s.sheet?.isRitualDiscovered || /의식|봉인|결계\s*파괴|진혼|구마|제단|퇴치법/i.test(currentSecret) || /의식|봉인/i.test(targetObj.name || targetObj.title || "");
          const hList = (s.sheet?.handouts || []).map(h => {
            const isMatch = (targetObj.id && (h.id === targetObj.id || h.npcId === targetObj.id)) || (targetObj.name && h.title?.includes(targetObj.name)) || (targetObj.title && h.title === targetObj.title);
            if (isMatch) return { ...h, revealed: true, isFlipped: true, discovered: true };
            if (currentSecret && currentSecret.includes(h.title)) return { ...h, discovered: true };
            return h;
          });
          const nList = (s.sheet?.npcs || []).map(n => { const isMatch = n.id === targetObj.id || (targetObj.name && n.name === targetObj.name); return isMatch ? { ...n, secretRevealed: true } : n; });
          return { ...s, sheet: { ...s.sheet, handouts: hList, npcs: nList, isRitualDiscovered: isRitualNowDiscovered } };
        }));
        triggerToast("비밀 열람 완료", `[${targetDisplayName}]의 숨겨진 진실이 밝혀졌습니다.`, "🗝️");
      } else if (targetType === "location") {
        resultDetail = `\n[조사 성공: 거처 확보] 《${targetDisplayName}》의 거처와 활동 경로를 확보했습니다! (메인 페이즈 전투 신청 가능)`;
        setSessions(prev => prev.map(s => { if (s.id !== activeSessionId) return s; const nList = (s.sheet?.npcs || []).map(n => (n.id === targetObj.id || n.name === targetObj.name) ? { ...n, hasLocation: true } : n); return { ...s, sheet: { ...s.sheet, npcs: nList, actionUsed: true } }; }));
      } else if (targetType === "mental") {
        const mCount = targetObj.madnessCards?.length || 0;
        resultDetail = `\n[조사 성공: 정신상태 파악] 《${targetDisplayName}》의 내면을 관찰했습니다. (현재 보유 미공개 광기: ${mCount}장)`;
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, actionUsed: true } } : s));
      }
    } else {
      resultDetail = targetType === "location" ? `\n[거처 확보 실패] 인물의 흔적을 놓쳐 거처와 활동 경로를 파악하지 못했습니다.` : `\n[비밀 조사 실패] 경계가 삼엄하여 핵심 정보를 알아내지 못했습니다.`;
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, actionUsed: true } } : s));
    }
    const logText = `[주요 행동: 조사 선언 (대상: ${targetDisplayName} / 특기: ${skillName})]\n2D6 결과: ${d1}+${d2}=${sum} (목표치: ${targetVal}) ➔ ${isSuccess ? "성공" : "실패"}${resultDetail}`;
    if(typeof executeMessage === "function") executeMessage(logText);
  };

  const startEmotionRoll = (npc) => {
    setEmotionTargetNpc(npc); playDiceSound();
    const d = Math.floor(Math.random() * 6) + 1;
    const table = { 1: { pos: "공감(+)", neg: "불신(-)", name: "공감 / 불신" }, 2: { pos: "우정(+)", neg: "분노(-)", name: "우정 / 분노" }, 3: { pos: "동경(+)", neg: "질투(-)", name: "동경 / 질투" }, 4: { pos: "집착(+)", neg: "경멸(-)", name: "집착 / 경멸" }, 5: { pos: "연정(+)", neg: "의혹(-)", name: "연정 / 의혹" }, 6: { pos: "광신(+)", neg: "살의(-)", name: "광신 / 살의" } };
    setEmotionDiceResult({ roll: d, ...table[d] });
  };
  const confirmEmotion = (selectedEmotion) => {
    if (!activeSession || !emotionTargetNpc || !emotionDiceResult) return;
    const targetName = emotionTargetNpc.name;
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, npcs: (s.sheet.npcs || []).map(n => n.name === targetName ? { ...n, emotion: selectedEmotion } : n) } } : s));
    setEmotionModalOpen(false);
    if(typeof executeMessage === "function") executeMessage(`[💬 감정 판정 완료]\n- 대상: ${targetName}\n- 주사위: 1D6 ➔ ${emotionDiceResult.roll}번 (${emotionDiceResult.name})\n- 획득 감정: ✨ [${selectedEmotion}] 칩을 획득했습니다!`);
  };
  const handleSelectEmotion = (npc, selectedEmotionName) => {
    setEmotionModal(null); setIsActionDrawerOpen(false);
    setSessions(prev => prev.map(s => { if (s.id !== activeSessionId) return s; const nList = (s.sheet?.npcs || []).map(n => n.id === npc.id ? { ...n, emotion: selectedEmotionName } : n); return { ...s, sheet: { ...s.sheet, npcs: nList, actionUsed: true } }; }));
    const isPositive = selectedEmotionName.includes("+");
    const relationDesc = isPositive ? `서로에게 마음이 닿아 《${selectedEmotionName}》의 유대를 맺었습니다. (향후 정보 공유 및 위기 지원 가능)` : `서로에게 날을 세우며 《${selectedEmotionName}》의 인연으로 얽혔습니다. (향후 정보 공유 및 전투 난입 가능)`;
    if(typeof executeMessage === "function") executeMessage(`[주요 행동: 감정 맺기 완료]\n${npc.name}와(과) ${relationDesc}`);
  };

  const advanceInsaneScene = (sessionId) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId || s.ruleMode !== "insane") return s;
      if (s.sheet?.phase === "클라이맥스") return s;
      const currentPhase = s.sheet?.phase || "도입";
      if (currentPhase === "도입") { return { ...s, sheet: { ...s.sheet, phase: "메인", cycle: 1, scene: 1, madnessCards: s.sheet?.madnessCards || [], handouts: s.sheet?.handouts || [] } }; }
      let currScene = s.sheet?.scene || 1; let currCycle = s.sheet?.cycle || 1; const limit = s.sheet?.limit || 4;
      if (currScene >= 2) { currCycle += 1; currScene = 1; } else { currScene += 1; }
      const isClimax = currCycle > limit;
      return { ...s, sheet: { ...s.sheet, cycle: currCycle, scene: currScene, phase: isClimax ? "클라이맥스" : "메인", madnessCards: s.sheet?.madnessCards || [], handouts: s.sheet?.handouts || [] } };
    }));
  };

  const handleSceneClose = () => {
    setIsActionDrawerOpen(false); if (!activeSession) return;
    playDiceSound();
    const currScene = activeSession.sheet?.scene || 1; const currCycle = activeSession.sheet?.cycle || 1; const limit = activeSession.sheet?.limit || 4;
    let nextScene = currScene; let nextCycle = currCycle;
    if (currScene >= 2) { nextCycle += 1; nextScene = 1; } else { nextScene += 1; }
    const isClimax = nextCycle > limit;
    setSessions(prev => prev.map(s => { if (s.id !== activeSessionId) return s; return { ...s, sheet: { ...s.sheet, cycle: nextCycle, scene: nextScene, phase: isClimax ? "클라이맥스" : "메인", actionUsed: false } }; }));
    
    let displayLog = ""; let aiPrompt = "";
    if (isClimax) {
      displayLog = `[🎬 장면 닫기 ➔ ⚠️ 클라이맥스 페이즈 돌입!]`;
      aiPrompt = `[🎬 장면 닫기 ➔ ⚠️ 클라이맥스 페이즈(Climax Phase) 돌입!]\n모든 메인 사이클(${limit}C)이 종료되어 최종 결전이 시작됩니다.\n키퍼로서 긴박한 마스터 씬(Master Scene)을 3~4문장으로 서술하여 흑막과의 최종 대치 국면을 열어주십시오.`;
    } else {
      // 🌟 [수정 완료] 1D6이 아닌 진짜 2D6(주사위 2개 합산) 확률 적용!
      const d1 = Math.floor(Math.random() * 6) + 1; 
      const d2 = Math.floor(Math.random() * 6) + 1; 
      const sum = d1 + d2;
      const sceneDesc = INSANE_SCENE_TABLE[sum] || "정적이 흐른다.";
      displayLog = `[🎬 장면 닫기 ➔ ${nextCycle}사이클 ${nextScene}장면 개막]\n[🎲 2D6 정규 장면표]: "${sceneDesc}"`;
      aiPrompt = `[🎬 장면 닫기 ➔ 새 장면 개막: ${nextCycle}사이클 ${nextScene}장면]\n이전 장면을 퇴장으로 마무리하고 새로운 드라마 씬을 엽니다.\n[🎲 2D6 정규 장면표 ${sum}번 결과]: "${sceneDesc}"\n위 장면표의 분위기를 바탕으로 키퍼로서 새로운 장면 도입 지문(마스터 씬)을 3~4문장으로 서술하십시오.\n지문 끝에는 탐사자가 이번 장면의 새로운 1회 주요 행동(조사/감정/회복)을 취할 수 있도록 상황을 유도하고, 아래 선택지 태그를 출력하십시오:\n<!-- SUGGESTIONS: ["주변 단서 조사", "파트너와 감정 맺기", "휴식 및 회복"] -->`;
    }
    if(typeof executeMessage === "function") executeMessage(displayLog, aiPrompt);
  };

  const handleRollSceneTable = () => {
    if (!activeSession) return;
    playDiceSound();
    const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const sum = d1 + d2;
    const desc = INSANE_SCENE_TABLE[sum] || "정적이 흐른다.";
    if(typeof executeMessage === "function") executeMessage(`[🎬 2D6 장면표 굴림: ${d1}+${d2}=${sum}번]\n"${desc}"\n(이 분위기 속에서 장면을 시작합니다.)`);
  };

  const toggleHandoutReveal = (hId) => {
    if (!activeSession) return;
    const card = (activeSession.sheet?.handouts || []).find(h => h.id === hId);
    if (!card) return;
    const isPcCard = card.id === "pc_base" || (activeSession.sheet?.name && card.title.includes(activeSession.sheet.name));
    const isInvestigatedInChat = (activeSession.messages || []).some(m => m.text.includes("조사 성공") && (m.text.includes(card.title) || (activeSession.sheet?.npcs || []).some(n => (card.title.includes(n.name) || card.overview?.includes(n.title)) && (m.text.includes(n.name) || (n.title && m.text.includes(n.title))))));
    const isNpcRevealed = (activeSession.sheet?.npcs || []).some(n => n.secretRevealed && (card.title.includes(n.name) || (n.title && card.overview?.includes(n.title))));

    if (card.revealed || isPcCard || isInvestigatedInChat || isNpcRevealed) {
      const handouts = (activeSession.sheet.handouts || []).map(h => h.id === hId ? { ...h, revealed: true, isFlipped: !h.isFlipped } : h);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, handouts } } : s));
    } else {
      triggerToast("🔒 아직 조사되지 않은 비밀입니다! (조사 판정 성공 시 해금)");
    }
  };

  const drawMadnessCard = (targetSessionId, autoNotify = true) => {
    let drawnCard = null;
    setSessions(prev => prev.map(s => {
      if (s.id !== targetSessionId || s.ruleMode !== "insane" || s.sheet?.phase === "도입") return s;
      const currentDeck = s.sheet?.madnessDeck || [];
      if (!currentDeck || currentDeck.length === 0) return s;
      const deck = [...currentDeck]; drawnCard = deck.shift();
      if (!drawnCard) return s;
      const newHand = [...(s.sheet?.madnessCards || []), { ...drawnCard, id: Date.now() }];
      const cardName = drawnCard.name || drawnCard.title || "미지의 광기";
      const newMessages = autoNotify ? [...(s.messages || []), { role: "user", text: `[🎲 시스템: 이성 감소로 인해 광기 덱에서 《${cardName}》 카드를 1장 뽑았습니다.]` }] : (s.messages || []);
      return { ...s, messages: newMessages, sheet: { ...s.sheet, madnessDeck: deck, madnessCards: newHand } };
    }));
    if (drawnCard) playDiceSound();
    else triggerToast("광기 덱 소진", "뽑을 수 있는 남은 광기 카드가 없습니다.", "⚠️");
    return drawnCard;
  };

  const manifestMadnessCard = (cardId, targetSessionId) => {
    const session = sessions.find(s => s.id === targetSessionId);
    if (!session) return;
    const card = (session.sheet?.madnessCards || []).find(c => c.id === cardId);
    if (!card) return;
    setShowInsanityFlash(true); setTimeout(() => setShowInsanityFlash(false), 500);
    setActiveMadnessAlert({ name: card.name, desc: card.desc });
    setInput(prev => `[광기 발현: ${card.name}] ` + prev);
    setSessions(prev => prev.map(s => {
      if (s.id !== targetSessionId) return s;
      const updatedCards = (s.sheet?.madnessCards || []).map(c => c.id === cardId ? { ...c, revealed: true } : c);
      return { ...s, sheet: { ...s.sheet, madnessStatus: `광기 발현: ${card.name}`, madnessCards: updatedCards }, messages: [...(s.messages || []), { role: "user", text: `[⚠️ 광기 발현 선언: 《${card.name}》]\n"${card.desc}"\n(이 충동과 공포가 캐릭터의 행동을 잠식합니다.)` }] };
    }));
  };

  const triggerMadnessDirectly = (targetSessionId) => {
    const session = sessions.find(s => s.id === targetSessionId);
    if (!session) return;
    const deck = [...(session.sheet?.madnessDeck && session.sheet.madnessDeck.length > 0 ? session.sheet.madnessDeck : INSANE_MADNESS_TABLE)];
    const card = deck.shift();
    setShowInsanityFlash(true); setTimeout(() => setShowInsanityFlash(false), 500);
    setActiveMadnessAlert({ name: card.name, desc: card.desc });
    setInput(prev => `[광기 발현: ${card.name}] ` + prev);
    const newHand = [...(session.sheet?.madnessCards || []), { ...card, id: Date.now(), revealed: true }];
    setSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, sheet: { ...s.sheet, madnessDeck: deck, madnessCards: newHand, madnessStatus: `광기 발현: ${card.name}` }, messages: [...(s.messages || []), { role: "user", text: `[⚠️ 광기 발현 선언: 《${card.name}》]\n"${card.desc}"\n(이 충동과 공포가 캐릭터의 행동을 잠식합니다.)` }] } : s));
  };

  const triggerMadnessCheck = (rule, lossAmount, targetSessionId) => {
    const session = sessions.find((s) => s.id === targetSessionId);
    if (session?.sheet?.madnessStatus) return;
    setShowInsanityFlash(true); setTimeout(() => setShowInsanityFlash(false), 500);
    let mName = "", mDesc = "", rollNum = 1;
    if (rule === "coc") {
      rollNum = Math.floor(Math.random() * 10) + 1; const m = COC_MADNESS_TABLE.find(it => it.roll === rollNum) || COC_MADNESS_TABLE[0]; mName = m.name; mDesc = m.desc;
    } else {
      rollNum = Math.floor(Math.random() * 6) + 1; const m = INSANE_MADNESS_TABLE.find(it => it.roll === rollNum) || INSANE_MADNESS_TABLE[0]; mName = m.name; mDesc = m.desc;
    }
    const madnessStatusStr = `일시적 광기: ${mName}`;
    setActiveMadnessAlert({ name: mName, desc: mDesc });
    setSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, sheet: { ...s.sheet, madnessStatus: madnessStatusStr } } : s));
  };

  // 7. 클라이맥스(전투) 조작 로직
  const executeClimaxPlot = (playerPlot) => {
    if (!activeSession) return;
    playDiceSound();
    const enemyPlot = Math.floor(Math.random() * 6) + 1;
    const isButting = playerPlot === enemyPlot;
    let buttingText = ""; let updatedPlayerHp = activeSession.sheet?.hp ?? 6; let updatedEnemyHp = activeSession.sheet?.enemyHp ?? 6;
    if (isButting) { updatedPlayerHp = Math.max(0, updatedPlayerHp - 1); updatedEnemyHp = Math.max(0, updatedEnemyHp - 1); buttingText = `\n💥 [버팅 발생!] 속도(${playerPlot})가 겹쳐 플레이어와 적 모두 생명력 -1 피해!`; }
    const orderText = playerPlot > enemyPlot ? `⚔️ 플레이어(속도 ${playerPlot}) 선공 ➔ 적(속도 ${enemyPlot}) 후공` : playerPlot < enemyPlot ? `⚡ 적(속도 ${enemyPlot}) 선공 ➔ 플레이어(속도 ${playerPlot}) 후공` : `💥 동시 행동 (버팅)`;
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, hp: updatedPlayerHp, enemyHp: updatedEnemyHp, currentPlot: playerPlot, enemyPlot: enemyPlot } } : s));

    if (enemyPlot > playerPlot && !isButting) {
      const ea1 = Math.floor(Math.random() * 6) + 1; const ea2 = Math.floor(Math.random() * 6) + 1; const enemyHit = (ea1 + ea2) >= 5;
      if (enemyHit) {
        setClimaxStep("dodge");
        if(typeof executeMessage === "function") executeMessage(`[⚔️ 클라이맥스 플롯 공개]\n- 내 플롯: [${playerPlot}] (회피 목표치: ${playerPlot + 4})\n- 적의 플롯: [${enemyPlot}]\n- 순서: ${orderText}\n\n⚡ [적 선공 개시!] 괴이가 속도(${enemyPlot}) 우위로 먼저 날카로운 공격을 가해옵니다! (적 명중: ${ea1}+${ea2}=${ea1 + ea2})\n👉 아래 [회피 판정] 버튼을 눌러 공격을 피하십시오!`);
        return;
      } else {
        setClimaxStep("action");
        if(typeof executeMessage === "function") executeMessage(`[⚔️ 클라이맥스 플롯 공개]\n- 내 플롯: [${playerPlot}] (회피 목표치: ${playerPlot + 4})\n- 적의 플롯: [${enemyPlot}]\n- 순서: ${orderText}\n\n💨 [적 선공 빗나감!] 괴이가 덮쳐왔으나 공격이 허공을 갈랐습니다! (적 명중: ${ea1}+${ea2}=${ea1 + ea2})\n👉 [내 턴] 아래 [기본 공격] 또는 [의식 진행] 버튼을 누르세요.`);
        return;
      }
    }
    setClimaxStep("action");
    if(typeof executeMessage === "function") executeMessage(`[⚔️ 클라이맥스 플롯 공개]\n- 내 플롯: [${playerPlot}] (회피 목표치: ${playerPlot + 4})\n- 적의 플롯: [${enemyPlot}]\n- 순서: ${orderText}${buttingText}\n\n👉 [행동 선언 단계] 플롯이 확정되었습니다! 아래 [기본 공격] 또는 [의식 진행] 버튼을 눌러 행동을 선언하세요.`, `[⚔️ 클라이맥스 플롯 공개]\n- 내 플롯: [${playerPlot}] (회피 목표치: ${playerPlot + 4})\n- 적의 플롯: [${enemyPlot}]\n- 순서: ${orderText}${buttingText}\n\n👉 [행동 선언 단계] 플롯이 확정되었습니다! 아래 [기본 공격] 또는 [의식 진행] 버튼을 눌러 행동을 선언하세요.\n[🚨 키퍼 연출 절대 수칙]\n- 지금은 턴의 순서(플롯)만 정해진 '대치 단계'입니다. 아직 플레이어의 공격이나 의식이 확정되지 않았습니다.\n- ❌ 절대 금지: 적이 쓰러지거나, 소멸하거나, 에필로그/엔딩으로 직행하는 서술.\n- ⭕ 허용: 두 인물이 숨을 죽이며 서로를 향해 쇄도하려는 '일촉즉발의 긴장감'만 2문장으로 짧게 서술하십시오.`);
  };

  const executePlayerDodge = () => {
    if (!activeSession) return;
    playDiceSound();
    const playerPlot = activeSession.sheet?.currentPlot ?? 3; const enemyPlot = activeSession.sheet?.enemyPlot ?? 3; const dodgeTarget = playerPlot + 4;
    const pd1 = Math.floor(Math.random() * 6) + 1; const pd2 = Math.floor(Math.random() * 6) + 1; const dodgeSum = pd1 + pd2; const isDodged = dodgeSum >= dodgeTarget;
    let curPlayerHp = activeSession.sheet?.hp ?? 6;
    let text = `[🛡️ 회피 판정 선언]\n- 주사위 2D6: ${pd1}+${pd2}=${dodgeSum} (목표치: ${dodgeTarget})\n`;
    if (isDodged) text += `✨ [회피 성공!] 공격 궤도를 간파하여 피해를 완전히 흘려보냈습니다!`;
    else { curPlayerHp = Math.max(0, curPlayerHp - 1); text += `💥 [회피 실패!] 피하지 못하고 1점의 피해를 입었습니다! (내 HP: ${curPlayerHp}/${activeSession.sheet?.maxHp ?? 6})`; }
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, hp: curPlayerHp } } : s));
    if (enemyPlot > playerPlot) { setClimaxStep("action"); text += `\n\n👉 [내 반격 차례] 적의 공격이 끝났습니다. 아래 [기본 공격] 또는 [의식 진행] 버튼을 누르세요.`; } 
    else { setClimaxRound(prev => prev + 1); setClimaxStep("plot"); text += `\n\n🔔 [제 ${climaxRound}라운드 종료] ➔ 제 ${climaxRound + 1}라운드 개막! 새로운 플롯(1~6)을 선택해 주십시오.`; }
    if(typeof executeMessage === "function") executeMessage(text);
  };
// =====================================================================
  // ⚔️ [Block 4.9] 누락 복구: 클라이맥스 기본 공격 & 턴 마무리 엔진
  // =====================================================================
  const executeClimaxAttack = (isWeaponReroll = false, inheritedBonus = null) => {
    if (!activeSession) return;
    playDiceSound();

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

    finishClimaxTurn(curEnemyHp, curPlayerHp, playerPlot, text);
  };

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

    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s, sheet: { ...s.sheet, enemyHp: curEnemyHp, hp: curPlayerHp, flashbackBonus: 0, phase: curEnemyHp <= 0 ? "에필로그" : s.sheet?.phase }
    } : s));

    if (curEnemyHp <= 0) {
      text += `\n\n🏆 [결전 승리!] 괴이가 단말마의 비명과 함께 소멸합니다! 에필로그로 향합니다.`;
      const aiPrompt = `${text}\n[🚨 결전 종결 수칙] 괴이의 HP가 0이 되어 소멸했습니다. 전투를 완전히 마무리하고 승리의 여운과 두 인물의 에필로그를 서술하십시오. 지문 끝에 [Happy End: 새벽의 온기] 형태의 엔딩 태그를 출력하십시오.`;
      if(typeof executeMessage === "function") executeMessage(text, aiPrompt);
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
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, hp: 0, phase: "배드엔딩" } } : s));
        text += `\n\n💀 [게임 오버: 사망] 끝내 치명상을 버티지 못하고 시야가 암전됩니다...`;
        triggerToast("캐릭터 사망", "생명력이 소진되어 의식을 잃었습니다.", "💀");
      }
      if(typeof executeMessage === "function") executeMessage(text);
      return;
    }

    if (climaxRound >= 5) {
      text += `\n\n⚠️ [제 ${climaxRound}라운드 종료] 리미트 도달! 극장의 나락이 붕괴하며 결말을 맞이합니다.`;
      if(typeof executeMessage === "function") executeMessage(text);
      return;
    }

    setClimaxRound(prev => prev + 1);
    setClimaxStep("plot");
    text += `\n\n🔔 [제 ${climaxRound}라운드 종료] ➔ 제 ${climaxRound + 1}라운드 개막! 새로운 플롯(1~6)을 선택해 주십시오.`;
    if(typeof executeMessage === "function") executeMessage(text);
  };
  const executeClimaxRitual = (stepIdx) => {
    if (!activeSession) return;
    const ritual = activeSession.sheet?.rituals?.[stepIdx];
    if (!ritual || ritual.completed) return;
    playDiceSound();
    const targetVal = calculateInsaneTargetNumber(ritual.skill, activeSession.sheet?.insaneSkills || [], activeSession.sheet?.insaneCuriosity || "");
    const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const baseSum = d1 + d2;
    const bonus = activeSession.sheet?.flashbackBonus || 0; const totalSum = baseSum + bonus; const isSuccess = totalSum >= targetVal;
    const rollDetail = bonus > 0 ? `${d1}+${d2} (+회상 3) = ${totalSum}` : `${d1}+${d2} = ${totalSum}`;
    let text = `[📜 의식 판정: ${stepIdx + 1}단계 - ${ritual.name}]\n- 판정 특기: 《${ritual.skill}》(목표치 ${targetVal})\n- 주사위 결과: ${rollDetail} ➔ ${isSuccess ? "성공!" : "실패!"}`;

    if (isSuccess) {
      const updatedRituals = (activeSession.sheet?.rituals || []).map((r, i) => i === stepIdx ? { ...r, completed: true } : r);
      const allDone = updatedRituals.every(r => r.completed);
      if (allDone) {
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, rituals: updatedRituals, phase: "에필로그", enemyHp: 0, flashbackBonus: 0 } } : s));
        text += `\n✨ [의식 단계 완료 ✔️] 결계가 한 꺼풀 벗겨졌습니다!\n\n🎉 [모든 의식 완성!] 마침내 성스러운 3단계 봉인 의식이 모두 완수되어 괴이가 완전히 소멸/봉인되었습니다! 결전이 승리로 막을 내립니다.`;
        if(typeof executeMessage === "function") executeMessage(text, `${text}\n[🚨 결전 종결 수칙] 모든 의식이 완수되어 괴이가 영구히 봉인되었습니다. 전투를 종료하고, 긴장이 풀린 두 인물의 애틋하고 평온한 후일담(에필로그)으로 자연스럽게 이어가십시오. 지문 끝에 [True End: 영원한 앙코르] 형태의 엔딩 태그를 출력하십시오.`);
        return;
      }
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, rituals: updatedRituals, flashbackBonus: 0 } } : s));
      text += `\n✨ [의식 단계 완료 ✔️] 결계가 한 꺼풀 벗겨졌습니다!`;
    } else {
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, flashbackBonus: 0 } } : s));
    }
    setClimaxRound(prev => prev + 1); setClimaxStep("plot");
    text += `\n\n🔔 [제 ${climaxRound}라운드 종료] ➔ 제 ${climaxRound + 1}라운드가 개막합니다! 새로운 플롯(1~6)을 선택해 주십시오.`;
    if(typeof executeMessage === "function") executeMessage(text);
  };

  const triggerFlashback = (bonusType) => {
    if (!activeSession || activeSession.sheet?.flashbackUsed) return;
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, flashbackUsed: true, flashbackBonus: 3 } } : s));
    const secretText = activeSession.sheet?.secret || "감춰둔 진실";
    if(typeof executeMessage === "function") executeMessage(`[🗝️ 회상 선언]\n"……${secretText}"\n가슴속 비밀을 밝히며 온 힘을 다합니다. (효과: 다음 판정 달성치 +3 보너스 부여)`);
  };

  // 8. 튜토리얼 룸 세팅
  const handleStartTutorial = (type) => {
    setIsTutorialModalOpen(false);
    if (type === "coc") {
      const cocSession = { id: "tutorial_coc_" + Date.now(), title: "🔰 [CoC 튜토리얼] 잠긴 서재 탈출", ruleMode: "coc", preference: "#공포 #추리 #탈출", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80", scenarioText: `[튜토리얼 키퍼 절대 행동 지침]\n당신은 크툴루의 부름(CoC) 3분 튜토리얼의 키퍼(GM)입니다. 유저의 선택과 입력에 맞춰 아래 4단계를 순서대로 착실히 완수하세요:\n1단계 (도입): 밀폐된 서재 상황을 묘사하고, 하단의 관찰력 주사위를 굴리도록 유도.\n2단계 (관찰력 판정 후): 성공 연출. 서랍 틈에서 '낡은 서재 열쇠'와 기괴한 양피지를 발견하게 함. 그 직후 거울 속에서 기괴한 형체가 꿈틀거리며 눈이 마주치는 공포 연출을 하고, 즉시 이성(SAN) 체크를 요구할 것.\n3단계 (이성 판정 후): 멘탈이 흔들려 이성치가 1 깎였다고 안내(50 -> 49). 공포에 질린 순간 동행자가 손을 잡고 잠긴 문 앞으로 이끌도록 묘사.\n4단계 (탈출 시도 후): 철컥 문이 열리며 안전한 복도로 탈출 성공! 가쁜 숨을 몰아쉬는 두 사람의 후일담을 묘사하고, 마지막 줄에 "🎉 [축하합니다! CoC 3분 튜토리얼 수료]" 문구로 종료할 것.`, sheet: { name: "견습 탐사자", job: "기록관", hp: 10, maxHp: 10, san: 50, maxSan: 50, luck: 55, db: "0", cocStats: { str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 50, edu: 40, luck: 55 }, cocSkills: "관찰력 65, 자료조사 50, 듣기 50, 심리학 50", background: "호기심 많은 견습 기록관. 서재의 비밀을 밝히고자 합니다.\n소지품: 낡은 수첩, 황동 만년필, 성냥", npcs: [{ id: 1, name: "루이스", title: "동료 탐사자", detail: "냉정하지만 든든한 오랜 조사 파트너.", affection: 10, secret: "이 방의 열쇠 모양을 어렴풋이 기억하고 있다." }], items: [{ name: "낡은 수첩" }, { name: "황동 만년필" }] }, suggestedActions: ["1D100 판정: 관찰력 (65%)", "책상을 자세히 조사한다", "잠긴 철문을 살핀다"], messages: [{ role: "system", text: `📋 [키퍼의 1분 CoC 시트 과외]\n화면 상단/사이드의 내 캐릭터 시트를 확인해 보세요!\n1. HP 10 / SAN 50: 체력과 이성(멘탈)입니다. 0이 되면 사망하거나 영구 광기에 빠집니다.\n2. 관찰력 65%: CoC는 1~100(1D100) 주사위를 굴립니다. 내 수치(65)보다 '낮게' 나와야 판정에 성공합니다! (수치가 높을수록 뛰어난 인물)` }, { role: "model", text: `서늘한 냉기가 감도는 낡은 서재. 육중한 철문이 굳게 잠겨 있고, 바닥엔 마른 핏자국이 길게 이어져 있습니다.\n책상 위에는 어지럽게 널린 고서와 서랍이 보입니다.\n💡 [첫 번째 미션]\n하단의 칩 버튼 [1D100 판정: 관찰력 (65%)]을 클릭하거나, 상단 헤더의 🎲 주사위 버튼을 눌러보세요!` }] };
      setSessions((prev) => [cocSession, ...prev]); setActiveSessionId(cocSession.id);
    } else if (type === "insane") {
      const insaneSession = { id: "tutorial_insane_" + Date.now(), title: "🔰 [인세인 튜토리얼] 멈춰 선 엘리베이터", ruleMode: "insane", preference: "#공포 #서스펜스 #탈출", thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80", scenarioText: `[인세인 3분 튜토리얼 정석 4대 페이즈 가이드]\n당신은 인세인(inSANe) 튜토리얼 GM입니다. 플레이어에게 사이클, 씬, 핸드아웃의 규칙을 명확히 교육하십시오.\n[🚨 절대 규칙]\n1. 유저가 지시된 행동을 완료하기 전까지 임의로 다음 씬을 넘기지 마십시오.\n2. 매 답변 맨 끝에 유저가 무엇을 눌러야 할지 💡 [미션 가이드 박스]를 반드시 출력하십시오.\n[진행 5단계 시퀀스]\n▶ 1단계: [도입 페이즈 - 오프닝]\n- 멈춰 선 엘리베이터 상황 묘사, 불안해하는 유진의 대사.\n- 💡 [첫 번째 미션: 대화 나누기]\n도입 페이즈는 오프닝으로 주사위를 굴리지 않습니다. 유진에게 말을 건네 상황을 진정시켜 보세요!\n▶ 2단계: [메인 1사이클 1씬 - 사이클 교육 & 감정 판정]\n- 유진과 대화 후 씬 선언:\n  🎬 [메인 페이즈: 1사이클 1씬 돌입]\n  - 씬 플레이어: \${pName}\n- "인세인은 사이클(라운드) 단위로 진행되며, 1씬당 [조사/감정/회복] 중 단 1번의 행동만 취할 수 있습니다!" 교육.\n- 💡 [두 번째 미션: 감정 판정]\n하단의 [💭 감정 판정 (1D6)] 버튼을 눌러 유진과 감정(유대)을 맺어보세요!\n▶ 2.5단계: [감정 획득 & 1씬 종료]\n- 감정 획득 묘사 후 <!-- ADVANCE_SCENE --> 태그를 출력해 씬을 정상 종료하십시오.\n▶ 3단계: [메인 1사이클 2씬 - 핸드아웃 소개 & 조사 판정]\n- 🎬 [메인 페이즈: 1사이클 2씬 돌입]\n- 핸드아웃 개념 친절 교육:\n  "인세인의 모든 조사 대상은 '핸드아웃'으로 주어집니다. 상단 우측의 [📜 핸드아웃] 메뉴를 눌러보세요. 겉으로 드러난 '개요'와 조사 성공 시 열리는 '비밀'로 구성되어 있습니다."\n- 💡 [세 번째 미션: 핸드아웃 조사]\n비상 인터폰을 조사해야 합니다!\n하단의 [🔍 조사 판정]을 누르고 특기 [기계]를 선택해 판정(목표치 5)을 시도하세요!\n▶ 3.5단계: [조사 성공, 비밀 해금 및 공포 판정 요구]\n- 플레이어가 기계 판정에 성공하면 반드시 아래 순서로 지문을 작성하십시오:\n  1. 기계 케이스가 열리며 끔찍한 기록이 발견되는 서사.\n  2. 비밀 해금 태그 반드시 출력: <!-- REVEAL_HANDOUT: {"title": "비상 인터폰"} -->\n  3. 비밀의 쇼크로 인한 공포 판정 태그 출력: <!-- CHECK: {"skill": "침착", "target": 5, "type": "FEAR", "targetName": "\${pName}"} -->\n  4. 하단 미션 안내:\n     💡 [네 번째 미션: 비밀 확인 & 공포 판정]\n     상단 우측의 [📜 핸드아웃]을 클릭하여 비상 인터폰의 [비밀]을 확인하세요!\n     충격적인 진실에 흔들리지 않도록 하단의 [🎲 공포 판정 (침착)] 주사위를 굴려 이성을 지키세요!\n▶ 4단계: [클라이맥스 페이즈 - 괴이 강림]\n- 천장에서 괴이가 내려앉으며 최종 결전 돌입.\n- 💡 [다섯 번째 미션: 클라이맥스 의식/플롯]\n하단의 [🎲 플롯/의식 판정]을 눌러 괴이를 저지하고 차단기를 가동하세요!\n▶ 5단계: [결말 페이즈]\n- 엘리베이터 문이 열리며 탈출 성공 서사.\n- "🎉 [축하합니다! inSANe 정규 4대 페이즈 튜토리얼을 완주하셨습니다]" 출력 후 종료.`, sheet: { name: "생존자", job: "연구원", hp: 6, maxHp: 6, san: 6, maxSan: 6, limit: 4, cycle: 1, scene: 1, phase: "도입", insaneSkills: ["기계", "어둠", "비명", "추적", "침착", "괴이"], insaneCuriosity: "기술", insaneFear: "어둠", background: "심야 연구를 마치고 퇴근하던 연구원.\n소지품: 스마트폰, 사원증", npcs: [{ id: 1, name: "유진", title: "동료 연구원", detail: "피곤한 기색의 직장 동료. 은은한 신뢰감을 풍깁니다.", affection: 0, secret: "사실 이 엘리베이터의 비상 차단기 위치를 알고 있다.", secretRevealed: false }], items: [{ id: "item_painkiller", name: "진통제", count: 1, desc: "생명력 또는 이성치 1 회복" }, { id: "item_amulet", name: "부적", count: 1, desc: "타인의 판정 재굴림" }], handouts: [{ id: "ho_interphone", title: "비상 인터폰", overview: "벽면에 설치된 낡은 비상 통신 장치. 붉은 표시등이 깜빡입니다.", secret: "수화기 너머에서 '너도 갇혔구나'라는 기괴한 속삭임이 들려옵니다.", revealed: false }], madnessDeck: [{ id: "m_panic", name: "패닉", trigger: "공포 판정 실패 시", desc: "눈앞의 공포로 인해 이성이 무너지고 극심한 혼란에 빠집니다." }, { id: "m_distrust", name: "불신", trigger: "자신을 제외한 누군가가 판정에 성공했을 때", desc: "주변 사람들을 더 이상 믿지 못하고 의심합니다." }], madnessCards: [], rituals: [{ id: 1, name: "1단계: 비상 차단기 강제 가동", skill: "기계", completed: false }] }, suggestedActions: ["유진에게 진정하라고 다독인다", "\"유진아, 괜찮아? 무슨 소리 안 들렸어?\"", "문틈을 살피며 구조를 기다린다"], messages: [{ role: "system", text: `📋 [키퍼의 1분 inSANe 핵심 룰 과외]\n인세인은 턴과 단서 관리가 명확한 멀티 호러 TRPG입니다!\n1. ⏳ 사이클(Cycle)과 리미트(Limit):\n   - '사이클'은 모든 참가자가 1번씩 차례(씬)를 갖는 한 바퀴(라운드)입니다.\n   - 4사이클(리미트)이 지나면 강제로 보스전(클라이맥스)에 끌려갑니다!\n2. 📜 핸드아웃(Handout)과 단서:\n   - 상단 우측 [📜 핸드아웃]을 눌러보세요. 모든 단서와 인물은 핸드아웃으로 존재합니다.\n   - 누구나 읽는 '개요'와 조사 성공 시 열리는 충격적인 '비밀'로 구성됩니다.\n3. 🎬 씬(Scene)의 주요 행동:\n   - 내 차례가 오면 [조사 / 감정 / 회복] 중 단 '1번의 행동'만 하고 씬을 넘깁니다.\n4. 🎲 2D6 판정 & 🧠 공포 판정:\n   - 주사위 2개를 굴려 특기는 합이 '5 이상'이면 성공합니다.\n   - 비밀을 보면 공포 판정을 하며, 실패 시 광기 카드를 뽑아 미쳐갑니다.` }, { role: "model", text: `🎬 [1단계: 도입 페이즈]\n늦은 밤, 야근을 마치고 동행자 '유진'(KPC)과 함께 고층 빌딩의 엘리베이터에 탑승했습니다.\n덜컹거리는 기계음과 함께 엘리베이터가 갑자기 멈춰 서고, 서늘한 냉기가 발목을 감돕니다. 유진은 겁에 질린 얼굴로 손을 떨고 있습니다.\n\n💡 [첫 번째 미션: 대화 나누기]\n도입 페이즈는 사건의 시작을 알리는 오프닝으로, 주사위를 굴리지 않습니다. 겁먹은 유진에게 말을 건네 안심시켜 보세요!` }] };
      setSessions((prev) => [insaneSession, ...prev]); setActiveSessionId(insaneSession.id);
    }
  };

  // 9. 새로운 게임 시작 설정 및 주입 (Phase 1 연동)
  const startNewSession = async () => {
    setGameTime({ day: 1, phase: "오전", turnInPhase: 0, turnCount: 0 }); // Phase 1 초기화
    
    const sessionTitle = scenarioTitle || (charName ? `${charName}의 이야기` : "새로운 모험");
    const pName = charName.trim() || "클레어";
    const partnerName = kpcList[0]?.name || "아델";

    const autoTheme = detectAutoPhoneTheme(`${playPreference} ${sessionTitle} ${publicSynopsis}`);
    setPhoneTheme(autoTheme);

    const npcs = kpcList.filter(k => k.name.trim() !== "").map(k => {
      const statMatch = (k.detail || "").match(/(?:상태\s*메시지|상메)\s*[:：]?\s*["'“]?([^"'”\r\n.]+?)["'”]?\s*(?:\.|\n|$)/i);
      return { id: k.id, name: k.name, title: k.job || "조력자", detail: k.detail || "", portrait: k.portraitUrl || getPortraitUrl(k.name), affection: 0, secret: k.secret, secretRevealed: false, statusMessage: k.statusMessage || (statMatch ? statMatch[1].trim() : "") };
    });

    let initialHandouts = [];
    const baseCards = [{ id: "pc_base", title: `${pName}의 사명과 비밀`, overview: `[공개 사명]\n${charMission || "표면적인 목적과 상태입니다."}`, secret: charSecret || "감춰진 사명이나 비밀이 없습니다.", revealed: false }];
    if (npcs && npcs.length > 0) {
      npcs.forEach((npc, idx) => baseCards.push({ id: `npc_base_${idx}`, title: `${npc.name}의 상태와 사명`, overview: `[표면상 상태/사명]\n역할: ${npc.title || "조연"}\n이 인물이 겉으로 보여주는 목적과 태도입니다.`, secret: npc.secret || "비밀이 없습니다.", revealed: false }));
    }

    let effectiveHandouts = generatedHandouts;
    if (!effectiveHandouts || effectiveHandouts.length === 0) {
      const fallbackSource = `${hiddenTruth}\n${publicSynopsis}\n${openingScene}`;
      const fallbackRegex = /(?:^|\n)\s*[-*■•]?\s*\[([^\]]+)\]\s*\n([\s\S]*?)(?=(?:\n\s*[-*■•]?\s*\[[^\]]+\]|\n\s*#+|$))/g;
      let fbMatch; const fbList = [];
      while ((fbMatch = fallbackRegex.exec(fallbackSource)) !== null) {
        const fbTitle = fbMatch[1].trim(); const fbBody = fbMatch[2];
        const fbSec = fbBody.match(/(?:획득\s*단서(?:\s*내용)?|비밀(?:\s*내용)?|단서(?:\s*내용)?|조사\s*결과|진실)\s*[:：]\s*([\s\S]*?)(?=(?:\n\s*[*·-]\s*[^:\n]+[:：]|\n\s*#+|$))/i);
        const fbOver = fbBody.match(/(?:구역\s*분위기(?:\s*및\s*개요)?|개요|분위기|설명)\s*[:：]\s*([^\n\r]+)/i);
        if (fbSec) fbList.push({ title: fbTitle, overview: fbOver ? fbOver[1].trim() : `[조사 구역: ${fbTitle}] 탐색 및 조사 단서입니다.`, secret: fbSec[1].trim() });
      }
      if (fbList.length > 0) effectiveHandouts = fbList;
    }

    if (effectiveHandouts && effectiveHandouts.length > 0) {
      const hasBase = effectiveHandouts.some(h => h.title.includes("사명") || h.title.includes(pName) || h.title.includes(partnerName));
      const parsedCards = effectiveHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false }));
      initialHandouts = hasBase ? parsedCards : [...baseCards, ...parsedCards];
    } else { initialHandouts = baseCards; }

    let startingItems = [];
    const bgItemMatch = (charBackground || "").match(/(?:소지품|지닌\s*물건|아이템)\s*[:：]\s*([^\n\r]+)/i);
    if (bgItemMatch) startingItems = bgItemMatch[1].split(/[,/·]\s*/).map(s => s.trim()).filter(Boolean).map(name => ({ name: name.replace(/^[-*•\d.]+\s*/, ""), desc: "개인 소지품" }));
    if (startingItems.length === 0 && generatedItems && generatedItems.length > 0) startingItems = generatedItems;
    if (startingItems.length === 0) {
      if (wizardMode === "dating") startingItems = [{ name: "손수건", desc: "단정하게 접힌 손수건" }, { name: "틴케이스 캔디", desc: "과일향 사탕" }];
      else if (wizardMode === "insane") startingItems = [{ name: "스마트폰", desc: "연락 및 기록용" }, { name: "작은 부적", desc: "소지품" }];
      else startingItems = [{ name: "수첩과 펜", desc: "기록 도구" }, { name: "소형 손전등", desc: "조명" }];
    }

    let initialSheet = {
      name: pName, job: charJob || "조사원", age: charAge, gender: charGender, background: charBackground, secret: charSecret, mission: charMission, portrait: charPortraitUrl || getPortraitUrl(pName), hp: 20, maxHp: 20, npcs, items: startingItems, madnessStatus: null, handouts: initialHandouts, madnessCards: [], madnessDeck: [...INSANE_MADNESS_TABLE].sort(() => 0.5 - Math.random())
    };
    
    if (wizardMode === "insane") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, limit: insaneLimit || 4, cycle: 1, scene: 1, phase: "도입", insaneSkills, insaneCuriosity, insaneFear, flashbackUsed: false, insaneItems: { painkiller: 2, weapon: 0, talisman: 0 }, prizes: (typeof parsedPrizes !== "undefined" && parsedPrizes.length > 0) ? parsedPrizes : [], rituals: (typeof parsedRituals !== "undefined" && parsedRituals.length > 0) ? parsedRituals : [], enemyName: (typeof parsedEnemyName !== "undefined" && parsedEnemyName) ? parsedEnemyName : (scenarioTitle ? `${scenarioTitle}의 괴이` : "미지의 괴이"), enemyHp: 6, maxEnemyHp: 6, currentPlot: null, enemyPlot: null };
    }

    let finalSynopsis = publicSynopsis; let finalOpening = openingScene; let finalTruth = hiddenTruth;
    const origPc = originalPresetPcName || "서지한"; const origPcShort = origPc.length >= 3 ? origPc.slice(1) : origPc;
    const newPcShort = pName.length >= 3 ? pName.slice(1) : pName;
    const pcFullReg = new RegExp(`\\{PC\\}|세리아나|클레어|${origPc}`, "g"); const pcShortReg = new RegExp(`${origPcShort}(?=[아이야은는이가을를의로으로])`, "g");
    finalSynopsis = finalSynopsis.replace(pcFullReg, pName).replace(pcShortReg, newPcShort); finalOpening = finalOpening.replace(pcFullReg, pName).replace(pcShortReg, newPcShort); finalTruth = finalTruth.replace(pcFullReg, pName).replace(pcShortReg, newPcShort);

    let finalScenarioCgs = [...(scenarioCgs || [])];
    (kpcList || []).forEach((kpc, index) => {
      const num = index + 1; const currentName = kpc.name || `인물${num}`;
      const origNpc = (originalPresetNpcs && originalPresetNpcs[index]) || (index === 0 ? "윤설아" : "");
      const origNpcShort = origNpc.length >= 3 ? origNpc.slice(1) : origNpc; const newNpcShort = currentName.length >= 3 ? currentName.slice(1) : currentName;
      const tagRegex = new RegExp(`\\{(KPC|NPC)${num}\\}`, "g");
      finalSynopsis = finalSynopsis.replace(tagRegex, currentName); finalOpening = finalOpening.replace(tagRegex, currentName); finalTruth = finalTruth.replace(tagRegex, currentName);
      if (origNpc) {
        const npcFullReg = new RegExp(`\\{KPC\\}|\\{NPC\\}|발렌틴|아델|${origNpc}`, "g"); const npcShortReg = new RegExp(`${origNpcShort}(?=[아이야은는이가을를의로으로])`, "g");
        finalSynopsis = finalSynopsis.replace(npcFullReg, currentName).replace(npcShortReg, newNpcShort); finalOpening = finalOpening.replace(npcFullReg, currentName).replace(npcShortReg, newNpcShort); finalTruth = finalTruth.replace(npcFullReg, currentName).replace(npcShortReg, newNpcShort);
      }
      finalScenarioCgs = finalScenarioCgs.map(cg => {
        let updatedTitle = (cg.title || "").replace(pcFullReg, pName).replace(tagRegex, currentName); let updatedTrigger = (cg.trigger || cg.condition || "").replace(pcFullReg, pName).replace(tagRegex, currentName);
        if (origNpc) { const npcFullReg = new RegExp(`\\{KPC\\}|\\{NPC\\}|발렌틴|아델|${origNpc}`, "g"); updatedTitle = updatedTitle.replace(npcFullReg, currentName); updatedTrigger = updatedTrigger.replace(npcFullReg, currentName); }
        return { ...cg, title: updatedTitle, trigger: updatedTrigger, condition: updatedTrigger };
      });
    });

    const cleanDisplayOpening = finalOpening.replace(/^\[(?:서막\vert{}도입\vert{}도입부\vert{}오프닝\vert{}시작)\]\s*/i, "").trim();
    const currentNpcName = kpcList[0]?.name || "파트너"; const mainNpcDetail = kpcList[0]?.detail || "외모 설정";
    const fullScenarioContext = `[시나리오 제목: ${sessionTitle}]\n[주요 등장인물 외모 필수 고정]\n- ${currentNpcName}: ${mainNpcDetail}\n\n[공개 시놉시스]\n${finalSynopsis}\n\n[초기 배경/서막]\n${finalOpening}\n\n[키퍼 전용 기밀/진상]\n${finalTruth}`;
    
    let sessionSheet = { ...initialSheet, scenarioCgs: finalScenarioCgs };
    if (wizardMode === "insane") {
      const generated = generateInsaneThemeAssets(sessionTitle, fullScenarioContext);
      const hasPrize = (sessionSheet.handouts || []).some(h => h.type === "prize" || h.title?.includes("프라이즈"));
      if (!hasPrize && generated.prize) sessionSheet.handouts = [...(sessionSheet.handouts || []), generated.prize];
      if (!sessionSheet.rituals || sessionSheet.rituals.length === 0) sessionSheet.rituals = generated.rituals;
    }
    sessionSheet.items = [ { id: "item_painkiller", name: "진통제", type: "heal", count: insaneItems["진통제"] || 0, desc: "생명력/이성치 1 회복" }, { id: "item_weapon", name: "무기", type: "reroll_self", count: insaneItems["무기"] || 0, desc: "전투 재굴림" }, { id: "item_amulet", name: "부적", type: "reroll_other", count: insaneItems["부적"] || 0, desc: "타인 판정 재굴림" } ].filter(it => it.count > 0);

    const openingMsgRegex = /\[([^\]]+)\]\s*:\s*["“]([^"”]+)["”]/g; let msgMatch; const initialPhoneChats = {}; const currentTime = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    while ((msgMatch = openingMsgRegex.exec(finalOpening)) !== null) {
      const senderName = msgMatch[1].trim(); const messageText = msgMatch[2].trim();
      const matchedNpc = npcs.find(n => senderName.includes(n.name) || n.name.includes(senderName)) || npcs[0];
      const contactId = matchedNpc?.id || 1;
      if (!initialPhoneChats[contactId]) initialPhoneChats[contactId] = [];
      const bubbles = messageText.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean);
      bubbles.forEach((bubbleText, sIdx) => initialPhoneChats[contactId].push({ id: Date.now() + Math.random() + sIdx, sender: "npc", text: bubbleText, time: currentTime, unread: true }));
    }
    sessionSheet.phoneChats = initialPhoneChats;

    const newId = Date.now();
    const newSession = {
      id: newId, title: sessionTitle, thumbnail: scenarioThumbnail || "https://cdn.phototourl.com/free/2026-09-13-be3b81ab-c892-4f25-ba89-1bb86ea1518e.jpg",
      ruleMode: wizardMode, preference: playPreference.trim(), scenarioText: fullScenarioContext, sheet: sessionSheet, sheetUrl: GOOGLE_SHEET_CSV_URL || "", messages: [], suggestedActions: [], investigationSpots: [], pendingCheck: null
    };

    setSessions([newSession, ...sessions]); setActiveSessionId(newId); setIsLoading(true);

    const hasOpening = Boolean(finalOpening && finalOpening.trim());
    let openingPrompt = "";
    if (wizardMode === "dating") {
      openingPrompt = hasOpening ? `[초기 배경/서막]을 확인했습니다. 주인공 '${pName}'이 취할 첫 행동 선택지 3개만 <!-- SUGGESTIONS: [...] -->로 출력하십시오.` : `[공개 시놉시스]와 [진상]을 바탕으로 두 사람의 첫 만남을 감각적으로 4~5문장 서술하고 선택지 3개를 출력하십시오.`;
    } else if (wizardMode === "dating_msg") {
      openingPrompt = `[세션 시작: 첫 카톡] 당신은 '${partnerName}' 본인입니다. 상대방 '${pName}'에게 가볍게 말을 건네는 첫 카톡을 1~2줄로 보내주십시오.`;
    } else {
      openingPrompt = hasOpening ? `[초기 배경/서막] 확인. 첫 행동 선택지 3개만 출력하십시오.` : `[배후 진상]과 [초기 배경/서막] 반영하여 정중한 키퍼의 경어체로 서막을 4~5문장 서술하고 SUGGESTIONS 태그를 출력하십시오.`;
    }

    const controller = new AbortController(); setAbortController(controller);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ messages: [{ role: "user", text: openingPrompt }], scenarioText: fullScenarioContext, playerSheet: cleanSheetForAi(sessionSheet), ruleMode: wizardMode, playPreference })
      });
      if (!res.ok) throw new Error("서버 응답 오류");
      const data = await res.json();
      
      // 아래에 정의될 parseTagsSafely 호출 (호이스팅 허용됨)
      const { cleanText, parsedData } = parseTagsSafely(data.text, partnerName, wizardMode);
      
      const currentCgs = finalScenarioCgs || [];
      const firstCg = currentCgs.length > 0 ? currentCgs[0] : null;
      const cgMatch = data.text?.match(/<!--\s*UNLOCK_CG:\s*(\{[\s\S]*?\})\s*-->/);
      let unlockedCgObj = null;
      if (cgMatch) try { unlockedCgObj = JSON.parse(cgMatch[1]); } catch(e) {}
      else if (firstCg && (firstCg.trigger?.includes("프롤로그") || firstCg.trigger?.includes("시작"))) unlockedCgObj = firstCg;

      if (unlockedCgObj) { triggerToast("✨ 일러스트 해금", `새로운 이벤트 CG [${unlockedCgObj.title}]`); setActiveCutsceneCg(unlockedCgObj); }

      setSessions(prev => prev.map(s => s.id === newId ? {
        ...s, sheet: { ...sessionSheet, ...parsedData.newSheetVars, scenarioCgs: currentCgs, unlockedCgs: unlockedCgObj ? [unlockedCgObj] : [] },
        messages: [{ role: "model", text: finalOpening || cleanDisplayOpening || cleanText, cg: unlockedCgObj || null }],
        suggestedActions: parsedData.suggActions, investigationSpots: parsedData.investigationSpots, pendingCheck: parsedData.pendingCheck
      } : s));
    } catch (err) {
      if (err.name !== "AbortError") setSessions(prev => prev.map(s => s.id === newId ? { ...s, messages: [{ role: "model", text: `서막을 불러오는 중 오류가 발생했습니다 (${err.message}).` }] } : s));
    } finally { setIsLoading(false); setAbortController(null); }
  };

  const handleSendPhoneMessage = async () => {
    if (!phoneInput.trim() || isPhoneSending || !activeSession || !activePhoneContactId) return;
    const textToSend = phoneInput.trim(); setPhoneInput(""); setIsPhoneSending(true);
    const currentTime = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), sender: "user", text: textToSend, time: currentTime, unread: false };
    const oldChats = activeSession.sheet?.phoneChats || {}; const oldList = oldChats[activePhoneContactId] || [];
    const updatedChatList = [...oldList, userMsg];
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, phoneChats: { ...oldChats, [activePhoneContactId]: updatedChatList } } } : s));
    triggerVibration("light");

    try {
      const messagesForApi = updatedChatList.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.photo ? `[사진 전송] ${m.text}` : m.text }));
      const currentContact = (activeSession.sheet?.npcs || []).find(n => n.id === activePhoneContactId);
      const partnerName = currentContact?.name || "상대방";
      const recentStoryContext = (activeSession.messages || []).slice(-3).map(m => m.text).join("\n\n");
      const fullGenreText = `${activeSession?.title || ""} ${activeSession?.preference || ""} ${activeSession?.scenarioText || ""}`.toLowerCase();
      const isFantasySetting = /판타지|중세|무협|동양|사극|황실|마법|오컬트|차원/.test(fullGenreText) || phoneTheme === "parchment";
      const statusGuide = isFantasySetting ? `- [판타지/시대극 배경]: 통신석 전언: "${activeSession?.sheet?.statusMessage || "(없음)"}"` : `- [현대/일상 배경]: 메신저 상태메시지: "${activeSession?.sheet?.statusMessage || "(없음)"}"`;
      
      const phoneContextNotice = `\n\n[🎉 메신저 톡 캐릭터 빙의 필수 수칙]\n1. 당신은 지금 '${partnerName}' 본인입니다! (직업/역할: ${currentContact?.title || "인물"})\n- [외모/성격/관계성]: ${currentContact?.detail || "설정 없음"}\n- [감춰둔 비밀/진심]: ${currentContact?.secret || "없음"}\n${statusGuide}\n- 🚨 [정보 격리 절대 수칙]: 당신은 플레이어(PC)가 방 안에서 혼자 겪은 일이나 비밀 약속을 전혀 알지 못합니다! 먼저 말해주기 전까지 아는 척하지 마십시오.\n2. [캐붕 금지] 설정된 말투, 억양, 성격을 철저히 고수하십시오.\n3. 현실의 메신저처럼 1~3문장 이내로 간결히 답장하며, 소설 지문이나 해설은 절대 출력하지 마십시오.\n4. [사진 전송 규칙] 유저가 사진을 요구하면 <!-- SNAP_PHOTO: {"prompt": "...", "caption": "..."} --> 태그를 출력하십시오 (인물 제외, 배경/사물 전용).`;

      // 🌟 [복구 완료] 메신저 선톡 시 미해금 CG 장소로 유도하는 프롬프트 추가
      const activeCgList = activeSession.sheet?.scenarioCgs || activeSession.sheet?.cgs || scenarioCgs || [];
      const currentUnlocked = activeSession.sheet?.unlockedCgs || [];
      const remainingCgs = activeCgList.filter(cg => !currentUnlocked.some(u => (u?.title && u.title === cg.title) || u === cg.title));
      
      let cgInvitePrompt = "";
      if (remainingCgs.length > 0) {
         cgInvitePrompt = `\n\n[🎬 이벤트 CG 명분 유도]\n미해금 CG 조건: ${remainingCgs.map(c => `[${c.title}]:${c.trigger || c.condition}`).join(", ")}\n위 장소나 상황으로 플레이어를 자연스럽게 이끄는 용건을 메신저 선톡의 명분으로 삼으십시오.`;
      }

      const res = await fetch("/api/chat", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: messagesForApi.slice(-20), 
          scenarioText: (activeSession.scenarioText || "") + phoneContextNotice + cgInvitePrompt, 
          playerSheet: cleanSheetForAi(activeSession.sheet), 
          ruleMode: "dating", 
          playPreference: activeSession.preference, 
          isPhoneChat: true, 
          targetNpc: currentContact ? { ...currentContact, portrait: "" } : null, 
          lastStoryContext: (recentStoryContext || "").slice(-1000) 
        })
      });

      if (!res.ok) throw new Error(`서버 오류 (${res.status})`);
      const data = await res.json();
      let rawReply = data.text || "";

      let affDelta = null; const affMatch = rawReply.match(/<!--\s*AFFECTION:\s*(\{.*?\})\s*-->/i); if (affMatch) { try { affDelta = JSON.parse(affMatch[1]); } catch(e){} rawReply = rawReply.replace(affMatch[0], ""); }
      let newClue = null; const clueMatch = rawReply.match(/<!--\s*CLUE:\s*(\{[\s\S]*?\})\s*-->/i); if (clueMatch) { try { newClue = JSON.parse(clueMatch[1]); } catch(e){} rawReply = rawReply.replace(clueMatch[0], ""); }
      let newStatusMsg = null; const statusMatch = rawReply.match(/<!--\s*STATUS:\s*(\{.*?\})\s*-->/i); if (statusMatch) { try { const sObj = JSON.parse(statusMatch[1]); newStatusMsg = (sObj.msg || sObj.status || sObj.message || "").trim(); } catch(e){} rawReply = rawReply.replace(statusMatch[0], ""); }
      const suggMatch = rawReply.match(/<!--\s*SUGGESTIONS:\s*(\[.*?\])\s*-->/i); if (suggMatch) { try { setPhoneSuggestions(JSON.parse(suggMatch[1])); } catch(e){} rawReply = rawReply.replace(suggMatch[0], ""); } else { setPhoneSuggestions([]); }
      
      let snapPhotoUrl = null; const snapMatch = rawReply.match(/<!--\s*SNAP_PHOTO:\s*(\{[\s\S]*?\})\s*-->/i);
      if (snapMatch) {
        try { const snapData = JSON.parse(snapMatch[1]); const p = snapData.prompt || snapData.caption || "beautiful scenery"; snapPhotoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=800&height=1000&nologo=true`; setUnlockedCgList(prev => [...prev, snapPhotoUrl]); triggerToast("📷 사진 도착", "새로운 일상 스냅 사진이 도착했습니다."); } catch (e) {}
        rawReply = rawReply.replace(snapMatch[0], "");
      }
      if (!snapPhotoUrl && /사진|스냅|찍|포토/.test(`${textToSend} ${rawReply}`.toLowerCase())) {
        let topicPrompt = "aesthetic daily snapshot, soft lighting, anime masterpiece";
        if (/진열장|쇼케이스/.test(textToSend.toLowerCase())) topicPrompt = "vintage glass display showcase with warm lighting, highly detailed, anime aesthetic";
        else if (/카페|커피/.test(textToSend.toLowerCase())) topicPrompt = "cozy warm cafe table with hot cup, soft sunlight, anime aesthetic";
        snapPhotoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topicPrompt)}?width=800&height=1000&nologo=true`;
        setUnlockedCgList(prev => [...prev, snapPhotoUrl]); triggerToast("📷 사진 도착", "새로운 일상 스냅 사진이 도착했습니다.");
      }

      const cleanReply = rawReply.replace(/<!--.*?-->/gs, "").trim();
      const bubbles = cleanReply.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      const newNpcMessages = (bubbles.length > 0 ? bubbles : [cleanReply]).map((b, idx) => ({ id: Date.now() + idx + 1, sender: "npc", text: b, time: currentTime, photo: idx === 0 ? snapPhotoUrl : null, unread: false }));

      for (let i = 0; i < newNpcMessages.length; i++) {
        const bubbleMsg = newNpcMessages[i];
        if (i > 0) await new Promise(resolve => setTimeout(resolve, Math.min(900, Math.max(500, bubbleMsg.text.length * 35))));
        setSessions(prev => {
          const session = prev.find(s => s.id === activeSessionId); if (!session) return prev;
          let sSheet = { ...session.sheet }; const contactList = (sSheet.phoneChats || {})[activePhoneContactId] || [];
          if (i === 0) {
            if (affDelta) {
              const incomingRaw = Number(affDelta.value !== undefined ? affDelta.value : affDelta.affection);
              const currentAff = currentContact?.affection ?? 10; const safeDiff = Math.max(-5, Math.min(3, incomingRaw - currentAff));
              sSheet.npcs = (sSheet.npcs || []).map(n => n.id === activePhoneContactId ? { ...n, affection: Math.max(0, Math.min(100, currentAff + safeDiff)) } : n);
            }
            if (newStatusMsg) { sSheet.npcs = (sSheet.npcs || []).map(n => n.id === activePhoneContactId ? { ...n, statusMessage: newStatusMsg } : n); triggerToast("📱 상태메시지 변경", `${partnerName}: "${newStatusMsg}"`, "💬"); }
            if (newClue && newClue.name) { sSheet.clues = [...(sSheet.clues || []), { id: Date.now(), name: newClue.name, desc: newClue.desc || "" }]; }
          }
          sSheet.phoneChats = { ...(sSheet.phoneChats || {}), [activePhoneContactId]: [...contactList, bubbleMsg] };
          return prev.map(s => s.id === activeSessionId ? { ...s, sheet: sSheet } : s);
        });
        triggerVibration("light");
      }
    } catch(err) { alert("전송 실패: " + err.message); } finally { setIsPhoneSending(false); }
  };
 // =====================================================================
  // 🧠 [Block 4] 다중 엔딩 계산기, 통합 파서, 메인 AI 통신 엔진
  // =====================================================================

  // 🌟 [누락 복구 1] 전 시나리오 공용 다중 엔딩 계산기
  const evaluateEnding = (npcs = []) => {
    if (!npcs || npcs.length === 0) {
      return { type: "Departure End", title: "Normal End: 새로운 길을 향한 발걸음", lovers: [], others: [], theme: "누구에게도 얽매이지 않고 담담히 떠나는 결말" };
    }
    const sorted = [...npcs].sort((a, b) => (Number(b.affection) || 0) - (Number(a.affection) || 0));
    const activeTargets = sorted.filter(n => (Number(n.affection) || 0) >= 25);
    const top1 = sorted[0]; const top2 = sorted[1] || null;
    const top1Aff = Number(top1?.affection) || 0; const top2Aff = Number(top2?.affection) || 0;

    if (top1Aff < 25 || sorted.some(n => Number(n.affection) <= -10)) {
      return { type: "Bad End", title: "Bad End: 어긋난 시선과 차가운 침묵", lovers: [], others: sorted.map(n => n.name), theme: "신뢰가 무너지고 차가운 단절 속에 남겨진 결말" };
    }
    const isSoloTrue = top1Aff >= 75 && (!top2 || (top1Aff - top2Aff >= 20) || top2Aff < 45);
    if (isSoloTrue) {
      return { type: "True End", title: `True End: ${top1.name}와의 영원한 서약`, lovers: [top1.name], others: sorted.slice(1).map(n => n.name), theme: `${top1.name}와 단둘만의 확고한 연인 관계 성립` };
    }
    const isMultiRomance = activeTargets.length >= 2 && activeTargets.every(n => (Number(n.affection) || 0) >= 60) && (top1Aff - Number(activeTargets[activeTargets.length - 1].affection)) <= 15;
    if (isMultiRomance) {
      return { type: "Hidden Poly End", title: `Hidden End: 함께 머무는 은밀한 밤`, lovers: activeTargets.map(n => n.name), others: sorted.filter(n => !activeTargets.some(at => at.name === n.name)).map(n => n.name), theme: `주인공과 [${activeTargets.map(n => n.name).join(", ")}] 전원이 이뤄낸 공존` };
    }
    const isTorn = top2 && top1Aff >= 50 && top2Aff >= 50 && (top1Aff - top2Aff) <= 15;
    if (isTorn) {
      return { type: "Solo End", title: `Normal End: 누구의 손도 잡지 못한 채`, lovers: [], others: sorted.map(n => n.name), theme: `${top1.name}와 ${top2.name} 사이에서 누구도 선택하지 못함` };
    }
    return { type: "Departure End", title: `Normal End: 새로운 길을 향한 발걸음`, lovers: [], others: sorted.map(n => n.name), theme: "특정 인물에게 얽매이지 않고 떠나는 작별" };
  };

  // 🌟 [누락 복구 2] 제안 칩 클릭 및 일반 전송 함수
  const handleSuggestionClick = (suggestionText) => {
    if (!suggestionText || isLoading) return;
    executeMessage(suggestionText);
  };

  const sendMessage = () => {
    if (!input || !input.trim()) return;
    const text = input.trim();
    setInput("");

    // ⚡ 개발자용 클라이맥스 치트키
    if (["/클맥", "!클맥", "클맥", "/climax", "!climax"].includes(text)) {
      setIsLoading(false);
      if (activeSessionId) setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...(s.sheet || {}), phase: "클라이맥스" } } : s));
      return;
    }
    if (isLoading) return;
    executeMessage(text);
  };

  // 🛡️ [Phase 5] 배드엔딩 방어 탑재 파서
  const parseTagsSafely = (rawText, partnerName, currentRule) => {
    let cleanText = rawText || "";
    let parsedData = { suggActions: [], pendingCheck: null, newSheetVars: {}, newHandouts: [], revealedHandoutTitles: [], shouldAdvanceScene: false, triggeredMadness: null, badEndTriggered: false, unlockedCg: null };

    try {
      const isBadEndTag = /\[(?:Bad\vert{}Dead\vert{}파멸\vert{}사망)\s*End[^\]]*\]/i.test(cleanText);
      const isEarlyGame = gameTime.day < 2 || gameTime.turnCount < 20;
      if (isBadEndTag) {
        if (isEarlyGame) {
          cleanText = cleanText.replace(/\[(?:Bad\vert{}Dead\vert{}파멸\vert{}사망)\s*End[^\]]*\]/gi, "");
          console.warn("[Phase 5 Guard] 턴 수 부족으로 AI의 조기 배드엔딩을 차단했습니다.");
        } else {
          parsedData.badEndTriggered = true;
        }
      }

      const cgMatch = cleanText.match(/<!--\s*UNLOCK_CG:\s*(\{[\s\S]*?\})\s*-->/);
      if (cgMatch) try { parsedData.unlockedCg = JSON.parse(cgMatch[1]); } catch(e) {}

      const madnessMatch = cleanText.match(/<!--\s*TRIGGER_MADNESS:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (madnessMatch) try { parsedData.triggeredMadness = JSON.parse(madnessMatch[1]); } catch (e) {}

      const checkMatch = cleanText.match(/(?:<!--|\[)\s*CHECK:\s*({[\s\S]*?})\s*(?:-{1,3}>\vert{}\])/i);
      if (checkMatch) try { parsedData.pendingCheck = JSON.parse(checkMatch[1]); } catch(e) {}

      const suggMatch = cleanText.match(/<!--\s*SUGGESTIONS:\s*(\[[\s\S]*?\])\s*-{1,3}>/i);
      if (suggMatch) try { parsedData.suggActions = JSON.parse(suggMatch[1]).map(s => s.replace(/\bKPC\b/g, partnerName || "파트너")); } catch(e) {}

      if (currentRule !== "insane") {
        const spotsMatch = cleanText.match(/<!--\s*SPOTS:\s*(\[[\s\S]*?\])\s*-{1,3}>/i);
        if (spotsMatch) try { parsedData.investigationSpots = JSON.parse(spotsMatch[1]); } catch(e) {}
      }

      const revHandoutRegex = /<!--\s*REVEAL_HANDOUT:\s*({[\s\S]*?})\s*-{1,3}>/gi;
      for (const m of cleanText.matchAll(revHandoutRegex)) {
        try { const obj = JSON.parse(m[1]); if (obj.title) parsedData.revealedHandoutTitles.push(obj.title); } catch (e) {}
      }

      const masterSceneMatch = cleanText.match(/<!--\s*TRIGGER_MASTER_SCENE:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (masterSceneMatch) try { parsedData.triggerMasterScene = JSON.parse(masterSceneMatch[1]); } catch (e) {}
      if (cleanText.includes("<!-- END_MASTER_SCENE")) parsedData.endMasterScene = true;
      if (cleanText.includes("<!-- ADVANCE_SCENE") || cleanText.includes("<!-- END_SCENE")) parsedData.shouldAdvanceScene = true;

      const handoutRegex = /<!--\s*HANDOUT:\s*({[\s\S]*?})\s*-{1,3}>/gi;
      for (const m of cleanText.matchAll(handoutRegex)) {
        try { parsedData.newHandouts.push(JSON.parse(m[1])); } catch (e) {}
      }
      const statMatch = cleanText.match(/<!--\s*STATUS:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (statMatch) try { parsedData.newSheetVars = JSON.parse(statMatch[1]); } catch (e) {}
    } catch (e) {}

    cleanText = cleanText.replace(/```html|```json|```/gi, "").replace(/(?:<!--|\[)\s*CHECK:\s*{[\s\S]*?}\s*(?:-{1,3}>\vert{}\])/gi, "").replace(/<!--[\s\S]*?-{1,3}>/g, "").replace(/<[^>]+>/g, "").replace(/\bKPC\b/g, partnerName || "파트너").trim();
    return { cleanText, parsedData };
  };

  const cleanSheetForAi = (sheet) => {
    if (!sheet) return {};
    const { portrait, ...rest } = sheet;
    return { ...rest, npcs: (rest.npcs || []).map(({ portrait, ...npcRest }) => npcRest) };
  };

  // 🚀 [마스터 플랜 결합] 메인 통신 엔진
  const executeMessage = async (textToSend, aiPromptOverride = null) => {
    if (!textToSend.trim() || !activeSession) return;
    
    advanceTurnOnly(); // [Phase 1] 턴수 증가
    setLocationCards([]); 

    // 💖 호감도 복구/조정 치트키
    if (textToSend.trim().startsWith("/호감도") || textToSend.trim().startsWith("/치트")) {
      const parts = textToSend.trim().split(/\s+/);
      let targetName = null; let targetVal = 50;
      if (parts.length >= 3) { targetName = parts[1]; targetVal = parseInt(parts[2], 10); } else if (parts.length === 2) { targetVal = parseInt(parts[1], 10); }
      if (!isNaN(targetVal)) {
        setSessions(prev => prev.map(s => {
          if (s.id !== activeSessionId) return s;
          const updatedNpcs = (s.sheet?.npcs || []).map((npc, idx) => (targetName ? npc.name?.includes(targetName) : idx === 0) ? { ...npc, affection: targetVal, affinity: targetVal } : npc);
          return { ...s, sheet: { ...s.sheet, npcs: updatedNpcs } };
        }));
        triggerToast("치트키 적용", `호감도가 ${targetVal}(으)로 변경되었습니다.`, "💖");
        return; 
      }
    }

    // 📵 통화 강제 종료 키워드
    const endCallKeywords = ["전화끊", "전화 끊", "통화 종료", "끊을게", "끊겠습니다", "끊는다"];
    if (isVoiceCallActive && endCallKeywords.some(k => textToSend.includes(k))) {
      setIsVoiceCallActive(false); setIsCallModalOpen(false); setVoiceCallNpc(null);
    }

    const isDatingMsg = activeSession.ruleMode === "dating_msg";
    const allNpcs = activeSession.sheet?.npcs || [];
    let detectedPartner = null;
    for (const n of allNpcs) { if (textToSend.includes(n.name) || textToSend.includes(`[${n.name}]`)) { detectedPartner = n; break; } }

    const currentContactId = detectedPartner?.id || activeSession.activeContactId || allNpcs[0]?.id;
    const currentContact = allNpcs.find(n => n.id === currentContactId) || allNpcs[0];
    const partnerName = currentContact?.name || "상대방";

    if (detectedPartner && detectedPartner.id !== activeSession.activeContactId) {
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, activeContactId: detectedPartner.id, sheet: { ...s.sheet, activeContactId: detectedPartner.id } } : s));
    }

    const snapshotSheet = JSON.parse(JSON.stringify(activeSession.sheet || {}));
    const cleanDisplayText = textToSend.replace(/<!--[\s\S]*?-->/g, "").trim();
    const isDirectCallSpeech = textToSend.startsWith("[전화 통화]");

    // 🌟 [Phase 2] 메신저 vs 통화 데이터 격리
    const updatedMessages = [
      ...(activeSession.messages || []), 
      { role: "user", text: cleanDisplayText, contactId: currentContactId, prevSheet: snapshotSheet, isCall: isDirectCallSpeech, isVoiceCall: isVoiceCallActive, callNpc: voiceCallNpc?.name, type: isVoiceCallActive ? "voice_call" : "general" }
    ];

    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [], pendingCheck: null } : s));
    setIsLoading(true);
    const controller = new AbortController(); setAbortController(controller);

    const isDating = activeSession.ruleMode?.startsWith("dating");
    const isR19 = `${activeSession.title} ${activeSession.scenarioText} ${activeSession.preference}`.toLowerCase().includes("r19");
    const pcNameStr = activeSession.sheet?.name || charName.trim() || "주인공";
    const pcJobStr = activeSession.sheet?.job || "시트에 명시된 신분";
    const pcAppearance = activeSession.sheet?.background || "설정 없음";

    // 🌟 다이내믹 룰 & 마스터 플랜
    let dynamicRules = `\n\n[⏰ 시스템 시간 절대 앵커]\n- 현재 시각: ${gameTime.day}일차 [${gameTime.phase}]\n- AI는 자의적으로 시간을 건너뛰거나 날짜를 바꿀 수 없습니다.`;
    
    // 📞 [Phase 2] 통화 2분할 템플릿
    if (isVoiceCallActive && voiceCallNpc) {
      const callName = voiceCallNpc.name || "상대방";
      const fieldNpcName = currentContact?.name !== callName ? currentContact?.name : "주변 환경";
      dynamicRules += `\n\n[📞 실시간 통화 2분할 규칙] 현재 [${callName}]와 통화 중이며, 물리적 현장에는 [${fieldNpcName}]이(가) 있습니다. 아래 2분할 템플릿만 사용하십시오.\n[수화기]: "${callName}의 대사" *(효과음)*\n[현장]: (방 안의 상황 및 ${fieldNpcName}의 반응)`;
    } else if (currentContact) {
      dynamicRules += `\n\n[🚨 대면 상대 고정] 눈앞에 있는 인물은 [${currentContact.name}]입니다. 다른 인물의 신분을 씌우지 마십시오.`;
    }

    // 🎬 [Phase 3] CG 유도
    const remainingCgs = (activeSession.sheet?.scenarioCgs || []).filter(cg => !(activeSession.sheet?.unlockedCgs || []).some(u => u.title === cg.title));
    if (remainingCgs.length > 0) {
      dynamicRules += `\n\n[🎬 이벤트 CG 유도 가이드]\n미해금 이벤트 장소/조건:\n${remainingCgs.map((c, i) => `${i + 1}. [${c.title}]:${c.trigger || c.condition}`).join("\n")}\n지문에 자연스럽게 장소를 묘사해 유도하고, 도달 시 <!-- UNLOCK_CG: {"title": "정확한 CG 제목"} --> 태그를 출력하십시오.`;
    }

    // 📱 [Phase 4] 독심술/앵무새 차단
    const recentPhoneChats = (activeSession.sheet?.phoneChats?.[currentContactId] || []).slice(-3);
    if (recentPhoneChats.length > 0) {
      dynamicRules += `\n\n[📱 메신저 선톡 쿨다운] 최근 3턴 기록:\n${recentPhoneChats.map(m => `${m.sender === "user" ? "PC" : "NPC"}: ${m.text}`).join("\n")}\n중복 질문을 피하고 플레이어의 속마음을 읽지 마십시오.`;
    }

    dynamicRules += `\n\n[키퍼 마스터링 절대 수칙]
1. [진상 누설 금지] 흑막의 정체를 독백으로 해설하지 마십시오.
2. [🚨 급전개 및 결말 직행 금지]
- 한 턴에 사건을 단번에 해결하거나 워프하지 마십시오. 현재 눈앞의 상황에만 집중하십시오.
- 사소한 지문 실수, 업무 조율, 일상적인 대화 지연은 절대 배드엔딩 사유가 될 수 없습니다. 무분별한 파국 묘사를 금지합니다.
3. [시스템 태그] 아이템 획득(ITEM), 호감도 변동(AFFECTION), 취향 파악(CLUE), 연락처 획득(UNLOCK_CONTACT), 상태메시지 갱신(STATUS) 시 해당 시스템 태그를 반드시 출력하십시오.`;

    if (activeSession.ruleMode === "insane") dynamicRules += `\n\n[🎲 인세인 정규 룰 엄수]\n유저가 [장면 닫기]를 누르기 전까지 임의로 장면을 넘기지 마십시오.`;
    if (isDating) dynamicRules += `\n\n[🌸 미연시 대화 분기]\n주인공의 말투에 맞는 선택지 3개를 <!-- SUGGESTIONS: ["대사1", "대사2", "대사3"] --> 태그로 제공하십시오.`;
    if (isR19) dynamicRules += `\n\n[🔥 R19 성인 특화]\n정사 및 스킨십 상황에서 암전 없이 자극적으로 끝까지 묘사하십시오.`;

    let missedCallNotice = "";
    if (incomingCall) missedCallNotice = `\n\n[🚨 부재중 전화 발생]\n플레이어가 '${incomingCall.caller?.name || "상대방"}'의 전화를 무시했습니다. 성격에 따라 폭풍 문자(PHONE_MSG)를 보내거나 무시하십시오.`;

    try {
      const rawSheet = typeof cleanSheetForAi === "function" ? cleanSheetForAi(activeSession.sheet) : activeSession.sheet;
      const safePlayerSheet = rawSheet ? {
        ...rawSheet, portraitUrl: "", npcs: (rawSheet.npcs || []).map(n => ({ ...n, portrait: "" })),
        items: (rawSheet.items || []).map(item => ({ ...item, image: "" })),
        handouts: (rawSheet.handouts || []).map(h => ({ ...h, image: "" }))
      } : {};

      const rawMessagesForAi = isDatingMsg ? updatedMessages.filter(m => (m.contactId ? m.contactId === currentContactId : true)) : updatedMessages;
      const baseAiList = aiPromptOverride ? rawMessagesForAi.map((m, idx) => idx === rawMessagesForAi.length - 1 ? { ...m, text: aiPromptOverride } : m) : rawMessagesForAi;
      const messagesForAi = baseAiList.slice(-50).map(m => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({
          messages: messagesForAi,
          scenarioText: (activeSession.scenarioText || "") + dynamicRules + missedCallNotice,
          playerSheet: safePlayerSheet, ruleMode: activeSession.ruleMode, playPreference: activeSession.preference,
          currentPhase: gameTime.phase, recentEvents: recentEvents || [],
          isVoiceCall: isVoiceCallActive, voiceCallNpc: voiceCallNpc?.name || null, facingNpc: currentContact?.name || null
        })
      });

      if (!res.ok) throw new Error(`서버 응답 오류 (${res.status})`);
      const data = await res.json();
      let rawReply = data.text || "";

      // ──────────────────────────────────────────────
      // 🛠️ 12가지 동적 태그 정밀 파서 적용
      // ──────────────────────────────────────────────
      const locationMatch = rawReply.match(/<!--\s*LOCATION_CARDS:\s*(\[[\s\S]*?\])\s*-->/);
      if (locationMatch) { try { setLocationCards(JSON.parse(locationMatch[1])); } catch (e) {} rawReply = rawReply.replace(locationMatch[0], ""); }

      const callMatch = rawReply.match(/<!--\s*INCOMING_CALL:\s*(\{[\s\S]*?\})\s*-->/);
      if (callMatch) {
        try {
          const rawCall = JSON.parse(callMatch[1]);
          const callerName = (rawCall.name || rawCall.caller || rawCall.from || "").trim();
          const callerObj = (activeSession.sheet?.npcs || []).find(n => n.name === callerName || n.name.includes(callerName)) || { name: callerName };
          setIncomingCall({ caller: callerObj, urgent: Boolean(rawCall.urgent) });
          triggerToast("📞 전화 수신", `${callerObj.name}에게서 전화가 걸려왔습니다!`, "📱");
        } catch (e) {}
        rawReply = rawReply.replace(callMatch[0], "");
      }

      const eventMatch = rawReply.match(/<!--\s*EVENT_FLAG:\s*"([^"]+)"\s*-->/);
      if (eventMatch) { setRecentEvents(prev => [...(prev || []), eventMatch[1]]); rawReply = rawReply.replace(eventMatch[0], ""); }

      let newlyUnlockedCg = null;
      // 🌟 [복구 완료] 원본 데이터와 이름 대조 후 완벽한 이미지 URL 매핑
      if (cgMatch) { 
        try { 
          const parsedCg = JSON.parse(cgMatch[1]); 
          const activeCgList = activeSession.sheet?.scenarioCgs || activeSession.sheet?.cgs || scenarioCgs || [];
          newlyUnlockedCg = activeCgList.find(c => c.title === parsedCg.title || c.title.includes(parsedCg.title)) || parsedCg;
        } catch (e) {} 
        rawReply = rawReply.replace(cgMatch[0], ""); 
      }

      const contactMatch = rawReply.match(/<!--\s*UNLOCK_CONTACT:\s*(\{[\s\S]*?\})\s*-->/);
      if (contactMatch) {
        try {
          const cData = JSON.parse(contactMatch[1]);
          if (cData.name && !activeSession.sheet?.unlockedContacts?.includes(cData.name)) {
            triggerToast("📱 인연 등록", `[${cData.name}]의 연락처가 등록되었습니다!`, "📱");
            setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, unlockedContacts: [...(s.sheet.unlockedContacts||[]), cData.name] } } : s));
          }
        } catch (e) {}
        rawReply = rawReply.replace(contactMatch[0], "");
      }

      let newItems = [];
      const itemRegex = /<!--\s*ITEM:\s*(\{.*?\})\s*-->/gs; let itemMatch;
      while ((itemMatch = itemRegex.exec(rawReply)) !== null) {
        try { const itemObj = JSON.parse(itemMatch[1]); if (itemObj.name) newItems.push({ id: Date.now(), name: itemObj.name, desc: itemObj.desc || "" }); } catch (e) {}
      }
      rawReply = rawReply.replace(itemRegex, "");

      let newClues = [];
      const clueRegex = /<!--\s*CLUE:\s*(\{[\s\S]*?\})\s*-->/gi; let clueM;
      while ((clueM = clueRegex.exec(rawReply)) !== null) {
        try { const c = JSON.parse(clueM[1]); if (c.name) newClues.push({ id: Date.now(), name: c.name, desc: c.desc, type: c.type, npcName: partnerName }); } catch (e) {}
      }
      rawReply = rawReply.replace(clueRegex, "");

      let newlyFoundNpcs = [];
      const newNpcRegex = /<!--\s*NEW_NPC:\s*(\{.*?\})\s*-->/gs; let npcMatch;
      while ((npcMatch = newNpcRegex.exec(rawReply)) !== null) {
        try { newlyFoundNpcs.push(JSON.parse(npcMatch[1])); } catch(e) {}
      }
      rawReply = rawReply.replace(newNpcRegex, "");

      let affChanges = [];
      const affRegex = /<!--\s*AFFECTION:\s*(\{.*?\})\s*-->/gs; let affM;
      while ((affM = affRegex.exec(rawReply)) !== null) {
        try { const a = JSON.parse(affM[1]); if (a.name) affChanges.push({ name: a.name, rawVal: Number(a.delta || a.value), isDelta: a.delta !== undefined }); } catch (e) {}
      }
      rawReply = rawReply.replace(affRegex, "");

      let newPhoneMsg = null;
      const phoneMsgMatch = rawReply.match(/<!--\s*PHONE_MSG:\s*(\{[\s\S]*?\})\s*-->/i);
      if (phoneMsgMatch) { try { newPhoneMsg = JSON.parse(phoneMsgMatch[1]); } catch(e) {} rawReply = rawReply.replace(phoneMsgMatch[0], ""); }

      let snapPhotoUrl = null;
      const snapMatch = rawReply.match(/<!--\s*SNAP_PHOTO:\s*(\{[\s\S]*?\})\s*-->/i);
      if (snapMatch) {
        try {
          const snapData = JSON.parse(snapMatch[1]);
          snapPhotoUrl = `[https://image.pollinations.ai/prompt/$](https://image.pollinations.ai/prompt/$){encodeURIComponent(snapData.prompt)}?width=800&height=1000&nologo=true`;
          setUnlockedCgList(prev => [...prev, snapPhotoUrl]);
          triggerToast("📷 사진 도착", "새로운 일상 스냅 사진이 도착했습니다.");
        } catch(e) {}
        rawReply = rawReply.replace(snapMatch[0], "");
      }

      let statusChanges = [];
      const statusRegex = /<!--\s*STATUS:\s*(\{.*?\})\s*-->/gs; let statMatch;
      while ((statMatch = statusRegex.exec(rawReply)) !== null) {
        try { const s = JSON.parse(statMatch[1]); if (s.name) statusChanges.push({ name: s.name.trim(), msg: (s.msg || s.status).trim() }); } catch(e) {}
      }
      rawReply = rawReply.replace(statusRegex, "");

      // 파싱 마감 및 시트 결합
      const { cleanText, parsedData } = parseTagsSafely(rawReply, partnerName, activeSession.ruleMode);
      let newSheet = { ...activeSession.sheet };

      const giftMatch = textToSend.match(/\[(.*?) 선물하기\]/);
      if (giftMatch) newSheet.items = (newSheet.items || []).filter(it => it.name !== giftMatch[1].trim());
      if (newItems.length > 0) newSheet.items = [...(newSheet.items || []), ...newItems];
      if (newClues.length > 0) newSheet.clues = [...(newSheet.clues || []), ...newClues];

      newSheet.npcs = (newSheet.npcs || []).map(cNpc => {
        const affTarget = affChanges.find(a => a.name.includes(cNpc.name) || cNpc.name.includes(a.name));
        let newAff = cNpc.affection || 0;
        if (affTarget) newAff = affTarget.isDelta ? newAff + Math.max(-5, Math.min(5, affTarget.rawVal)) : affTarget.rawVal;
        const statTarget = statusChanges.find(s => s.name.includes(cNpc.name));
        return { ...cNpc, affection: newAff, statusMessage: statTarget ? statTarget.msg : cNpc.statusMessage };
      });

      if (newPhoneMsg && newPhoneMsg.text) {
        const targetId = (newSheet.npcs.find(n => n.name === newPhoneMsg.from) || newSheet.npcs[0])?.id || 1;
        const msgList = newPhoneMsg.text.split(/\|\|/).map(t => t.trim()).filter(Boolean);
        const incomingMsgs = msgList.map((t, idx) => ({ id: Date.now() + idx, sender: "npc", text: t, time: new Date().toLocaleTimeString(), unread: true, photo: idx === 0 ? snapPhotoUrl : null }));
        newSheet.phoneChats = { ...newSheet.phoneChats, [targetId]: [...(newSheet.phoneChats?.[targetId] || []), ...incomingMsgs] };
        triggerToast("📱 새 메시지 도착", `${newPhoneMsg.from}: "${incomingMsgs[0]?.text}"`, "💬");
      }

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        sheet: { ...s.sheet, ...newSheet, unlockedCgs: newlyUnlockedCg ? [...(s.sheet.unlockedCgs || []), { ...newlyUnlockedCg, unlockedAt: Date.now() }] : s.sheet.unlockedCgs },
        messages: [...updatedMessages, { role: "model", text: cleanText, cg: newlyUnlockedCg || null, contactId: currentContactId, isCall: isDirectCallSpeech, isVoiceCall: isVoiceCallActive, callNpc: voiceCallNpc?.name, type: isVoiceCallActive ? "voice_call" : "general" }],
        suggestedActions: parsedData.suggActions, pendingCheck: parsedData.pendingCheck, investigationSpots: parsedData.investigationSpots || []
      } : s));

      if (newlyUnlockedCg) { triggerToast("✨ 일러스트 해금", `새로운 이벤트 CG [${newlyUnlockedCg.title}]`); setActiveCutsceneCg(newlyUnlockedCg); }
      if (cleanText.includes("ADVANCE_DAY") || newlyUnlockedCg) { setTimeTransition(newlyUnlockedCg ? newlyUnlockedCg.title : "다음 날 아침"); setTimeout(() => setTimeTransition(null), 2000); }

    } catch (err) {
      if (err.name === "AbortError") return;
      alert("통신 에러: " + err.message);
    } finally {
      setIsLoading(false); setAbortController(null);
    }
  };

  // 🌟 [엔딩 계산 파생 변수] (return 전에 렌더링을 위해 선언)
  const lastMsgText = activeSession?.messages?.[activeSession.messages.length - 1]?.text || "";
  const isSanCheckDetected = activeSession?.ruleMode === "coc" && !activeSession?.sheet?.madnessStatus && !activeMadnessAlert && (activeSession?.pendingCheck?.skill?.includes("이성") || lastMsgText.includes("산 체크"));
  
  const calculatedEnding = evaluateEnding(activeSession?.sheet?.npcs || []);
  const isScenarioEnded = /\[(?:True\vert{}Happy\vert{}Bad\vert{}Dead\vert{}Normal\vert{}Open\vert{}Hidden\vert{}Secret)?\s*End[:\]]|완결|막을 내렸다/i.test(lastMsgText);
  const isBadEnding = isScenarioEnded && (calculatedEnding.type === "Bad End" || /Bad\s*End|배드/i.test(lastMsgText));
  const isTrueEnding = isScenarioEnded && (calculatedEnding.type === "True End" || /True\s*End|트루/i.test(lastMsgText));
  const isHiddenEnding = isScenarioEnded && (calculatedEnding.type === "Hidden Poly End" || /Hidden\s*End|히든/i.test(lastMsgText));


// =====================================================================
  // 🧩 [Block 4.5] AI 시나리오 자동 생성기 (다중 젠더 및 태그 연동)
  // =====================================================================
// 🌟 [복구 완료] AI 시나리오 자동 생성기 (다중 젠더/관계성 연동)
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    const controller = new AbortController();
    setAbortController(controller);

    const randomSeeds = ["비밀 결사", "폭설로 고립된 저택", "안개 낀 호숫가", "금지된 오컬트 서점", "시간이 멈춘 시계탑", "가면무도회"];
    const pickedSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];

    const systemPrompt = `당신은 탁월한 창작력을 지닌 정통 TRPG 마스터입니다.
룰 [${wizardMode}]과 성향 [${playPreference}]에 맞춰 [모티프: ${pickedSeed}]를 살려 매번 완전히 새로운 시나리오를 창작하십시오.

[🚨 절대 수칙]
1. 젠더 및 관계성: 제공된 성향 태그([${playPreference}])에 따라 HL, BL, GL, 또는 논로맨스 서사를 적절히 구성하십시오. 인물의 성별은 태그에 맞게 자연스럽게 설정합니다.
2. 'PC', 'KPC'라는 단어를 일절 쓰지 말고 고유한 이름을 직접 지어 사용하십시오.
3. 맹목적이고 유치한 집착 표현을 배제하고, 섬세하고 깊은 유대감과 입체적인 신념을 묘사하십시오.

[주변 인물(엑스트라/조연) 묘사 및 개입 규칙]
1. 세계관 일관성: 스쳐 지나가는 조연들은 설정된 시대와 성향에 맞게 묘사합니다.
2. 기능성 엑스트라는 고유 이름 대신 직책(예: 시종장)으로만 지칭하십시오.
3. PC와 핵심 인물 간의 깊은 대화 중 무맥락으로 끼어들어 흐름을 끊는 개입은 엄격히 금지합니다.

반드시 마크다운 없이 순수 JSON으로만 응답하십시오:
{
  "name": "주인공 이름", "gender": "여성 또는 남성", "age": "나이", "job": "역할/직업",
  "background": "상처와 성격, 소지품 3가지 상세",
  "mission": "주인공의 표면상 사명", "secret": "주인공이 숨긴 진짜 목적이나 비밀",
  "kpcName": "파트너 이름", "kpcJob": "파트너 직업",
  "kpcDetail": "파트너 성격, 외모, 주인공과의 미묘한 관계성",
  "kpcSecret": "파트너가 숨겨둔 치명적인 비밀이나 진심",
  "limit": ${Math.floor(Math.random() * 2) + 3},
  "scenarioTitle": "독창적이고 매력적인 시나리오 제목",
  "publicSynopsis": "스포일러 없는 시놉시스 3~4줄",
  "openingScene": "서막의 공감각적 묘사와 첫 대사를 담은 풍성한 지문",
  "hiddenTruth": "배후 진상 및 흑막(Keeper 기밀)",
  "items": [ { "name": "소지품 1", "desc": "설명" }, { "name": "소지품 2", "desc": "설명" } ],
  "initialHandouts": [
    { "title": "주인공의 사명과 비밀", "overview": "현재 상황 개요", "secret": "뒤집었을 때의 진실" },
    { "title": "파트너의 태도와 시선", "overview": "겉으로 보이는 태도", "secret": "뒤집었을 때의 진짜 속마음" }
  ]
}`;
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ messages: [{ role: "user", text: systemPrompt }], scenarioText: "", playerSheet: {}, ruleMode: wizardMode, playPreference })
      });

      if (!response.ok) throw new Error(`서버 응답 오류 (상태 코드: ${response.status})`);
      const data = await response.json();
      const cleanJson = (data.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      const p = JSON.parse(cleanJson);

      const pName = p.name || ""; const kName = p.kpcName || "";
      setCharName(pName); setCharJob(p.job || ""); setCharAge(p.age || ""); setCharGender(p.gender || "여성"); setCharBackground(p.background || ""); 
      setCharPortraitUrl(getPortraitUrl(`${pName}, ${p.job}`));
      if (p.mission) setCharMission(p.mission); if (p.secret) setCharSecret(p.secret); if (p.limit) setInsaneLimit(Number(p.limit));

      setKpcList([{ id: 1, name: kName, gender: p.gender === "여성" ? "여성" : "남성", age: "미상", job: p.kpcJob || "", detail: p.kpcDetail || "", secret: p.kpcSecret || "", portraitUrl: getPortraitUrl(`${kName}, portrait`), showSecret: false }]);
      setScenarioTitle(p.scenarioTitle || ""); setPublicSynopsis(p.publicSynopsis || ""); setOpeningScene(p.openingScene || ""); setHiddenTruth(p.hiddenTruth || "");
      setGeneratedHandouts(p.initialHandouts || []); if (p.items && Array.isArray(p.items)) setGeneratedItems(p.items);
      if (wizardMode === "coc") handleRandomCocStats();
    } catch (e) {
      if (e.name === "AbortError") return;
      alert("AI 생성 실패: " + e.message);
    } finally {
      setIsAiGenerating(false); setAbortController(null);
    }
  };
// =====================================================================
  // 🛡️ [Block 4.8] 누락 복구: 버튼 유틸리티 함수
  // =====================================================================
  const handleCancelResponse = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsLoading(false);
    setIsAiGenerating(false);
  };

  const handleCloseNotice = () => {
    if (hideNoticeCheckbox) {
      const sevenDaysLater = Date.now() + 604800000; 
      localStorage.setItem("rp_hub_hide_notice", sevenDaysLater.toString());
    }
    setShowNoticeModal(false);
  };

  const exportSingleLobbyPreset = (p) => {
    const fileName = `${(p.presetTitle || p.scenarioTitle || "시나리오").replace(/[\/\\:*?"<>|]/g, "_")}.json`;
    const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); 
    const a = document.createElement("a"); 
    a.href = url; a.download = fileName; a.click(); 
    URL.revokeObjectURL(url);
    triggerToast("개별 백업 완료", `'${p.presetTitle}' 세팅이 파일로 저장되었습니다! 📥`);
  };
 // =====================================================================
  // 🎨 [Block 5] UI 렌더링 1부 (레이아웃, 사이드바, 메인 뷰, 캡슐 입력창)
  // =====================================================================
  return (
    <div style={{ display: "flex", height: "100dvh", width: "100vw", backgroundColor: theme.bg, color: theme.text, overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @font-face { font-family: 'RIDIBatang'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff') format('woff'); font-weight: 400; font-style: normal; }
        *, *::before, *::after { box-sizing: border-box; font-family: 'Pretendard', sans-serif; }
        .serif-text, .serif-text * { font-family: ${(fontChoice === "ridi" || fontChoice === "maru" || fontChoice === "serif") ? "'RIDIBatang', serif" : "'Pretendard', sans-serif"} !important; line-height: 1.95; word-break: keep-all; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(140, 160, 210, 0.2); border-radius: 4px; }
        .glass-card { background: ${theme.panel}; backdrop-filter: blur(14px); border: 1px solid ${theme.border}; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border-radius: 18px; }
        .glass-alt { background: ${theme.panelAlt}; backdrop-filter: blur(10px); border: 1px solid ${theme.border}; }
        @keyframes diceTumble { 0% { transform: rotate(0deg) scale(0.85); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
        .anim-dice-rolling { animation: diceTumble 0.35s infinite linear; }
        @keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-5px); opacity: 1; } }
        .typing-dot { animation: typingBounce 1.3s infinite ease-in-out; }
      `}</style>

{/* 🌟 모바일 사이드바 닫기용 터치 영역 (여긴 이미 있는 코드) */}
      {isMobile && isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} />}

      {/* 🍞 1. 상단 시스템 알림 토스트 (아이콘 + 제목 + 내용) */}
      {toast && (
        <>
          <div onClick={() => setToast(null)} style={{ position: "fixed", inset: 0, zIndex: 9998, backgroundColor: "rgba(0, 0, 0, 0.35)", backdropFilter: "blur(2px)" }} />
          <div style={{ position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 9999, backgroundColor: "rgba(18, 20, 26, 0.96)", border: `1.5px solid ${theme.accent || "#6366f1"}`, borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", boxShadow: "0 12px 35px rgba(0, 0, 0, 0.7)", color: "#fff", maxWidth: "90%", width: "360px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{toast.icon}</span>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.accent || "#818cf8" }}>{toast.title}</span>
                <span style={{ fontSize: "0.8rem", color: "#e2e8f0", marginTop: "2px", lineHeight: "1.3" }}>{toast.message}</span>
              </div>
            </div>
            <button type="button" onClick={() => setToast(null)} style={{ background: "rgba(255, 255, 255, 0.08)", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.85rem", cursor: "pointer", flexShrink: 0 }}>✕</button>
          </div>
        </>
      )}

      {/* 🍞 2. 심플 플로팅 앱 토스트 */}
      {appToast && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 165, backgroundColor: "rgba(35, 35, 35, 0.92)", backdropFilter: "blur(8px)", color: "#ffffff", padding: "10px 20px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "700", boxShadow: "0 8px 24px rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.15)", pointerEvents: "none" }}>
          {appToast}
        </div>
      )}

      {/* 🌟 모바일 사이드바 닫기용 터치 영역 */}
      {isMobile && isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} />
      )}

      {/* 1. 좌측 사이드바 */}
      <div style={{ 
        position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, left: 0, top: 0, bottom: 0, 
        width: isMobile ? "260px" : (isSidebarOpen ? "260px" : "0px"), minWidth: isMobile ? "260px" : (isSidebarOpen ? "260px" : "0px"), 
        transform: isMobile ? (isSidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: isMobile ? "transform 0.25s ease" : "width 0.25s ease, min-width 0.25s ease", 
        overflow: "hidden", backgroundColor: theme.sidebar, borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", 
        display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: isMobile && isSidebarOpen ? "4px 0 20px rgba(0,0,0,0.18)" : "none"
      }}>
        <div style={{ padding: "14px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button onClick={() => { setActiveSessionId(null); setScenarioThumbnail(""); if (isMobile) setIsSidebarOpen(false); }} style={{ flex: 1, padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }}>+ 새 시나리오</button>
          {isMobile && <button onClick={() => setIsSidebarOpen(false)} style={{ padding: "8px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>✕</button>}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.map((s) => {
            const dateDisplay = s.id ? new Date(s.id).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";
            return (
              <div 
                key={s.id} 
                onClick={() => {
                  setActiveSessionId(s.id);
                  setCurrentPhase(s.sheet?.currentPhase || "낮");
                  setRecentEvents(s.sheet?.recentEvents || []);
                  setLocationCards([]); setIncomingCall(null); setIsVoiceCallActive(false);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                style={{ borderRadius: "10px", cursor: "pointer", marginBottom: "8px", backgroundColor: activeSessionId === s.id ? theme.panelAlt : theme.panel, border: `1px solid ${activeSessionId === s.id ? theme.accent : theme.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                <div style={{ width: "100%", position: "relative", backgroundColor: theme.panelAlt, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={s.thumbnail || "https://cdn.phototourl.com/free/2026-09-13-be3b81ab-c892-4f25-ba89-1bb86ea1518e.jpg"} alt="세션 카드" style={{ width: "100%", height: "auto", minHeight: "75px", maxHeight: "185px", objectFit: "cover", objectPosition: "center", display: "block" }} />
                  <label onClick={(e) => e.stopPropagation()} title="내 컴퓨터에서 세션 카드 이미지 선택" style={{ position: "absolute", top: "6px", right: "6px", backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", borderRadius: "4px", padding: "3px 6px", fontSize: "0.7rem", cursor: "pointer", zIndex: 2 }}>
                    ✏️<input type="file" accept="image/*" onChange={(e) => handleSessionCardUpload(s.id, e)} style={{ display: "none" }} />
                  </label>
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "4px" }}>
                      <div style={{ fontWeight: "700", fontSize: "0.82rem", color: theme.text }}>{s.title}</div>
                      <div style={{ fontSize: "0.68rem", color: theme.textMuted }}>{s.ruleMode?.toUpperCase()}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm("이 세션을 삭제하시겠습니까?")) setSessions(sessions.filter(it => it.id !== s.id)); }} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "2px", fontSize: "0.75rem" }}>🗑️</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.65rem", color: theme.textMuted, marginTop: "4px", borderTop: `1px dashed ${theme.border}`, paddingTop: "4px" }}>
                    <div>{dateDisplay ? `🕒 ${dateDisplay}` : ""}</div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setActiveSessionId(s.id); handleSyncCurrentSheet(); }} title="시트 최신 데이터 동기화" style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", fontSize: "0.75rem", lineHeight: 1, opacity: 0.7 }}>🔄</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "6px", backgroundColor: theme.sidebar, flexShrink: 0 }}>
          <button type="button" onClick={() => openModal(setShowSettingsModal)} style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><span>⚙️</span><span>환경 설정</span></button>
          <button type="button" onClick={() => openModal(setShowExportModal)} style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><span>💾</span><span>데이터 관리</span></button>
        </div>
      </div>

      {isMobile && isSheetOpen && <div onClick={() => setIsSheetOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} />}

      {/* 2. 중앙 메인 뷰 */}
      <div 
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const diff = e.changedTouches[0].clientX - touchStartX;
          if (diff < -75 && !isSheetOpen) setIsSheetOpen(true);
          setTouchStartX(null);
        }}
        style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", height: "100%" }}
      >
        {/* 상단 헤더 바 */}
        <div style={{ position: "sticky", top: 0, zIndex: 30, height: "54px", padding: isMobile ? "0 10px" : "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebar, flexShrink: 0 }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px", minWidth: 0, flex: 1, paddingRight: "6px" }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: theme.text, padding: "4px", display: "flex", alignItems: "center", flexShrink: 0 }}>☰</button>
            
            {activeSession && activeSession.ruleMode === "dating_msg" ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${theme.border}`, flexShrink: 0 }}>
                  <img src={(activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId)?.portrait || activeSession.sheet?.npcs?.[0]?.portrait} alt="상대" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

                {/* 🕒 [Phase 1] 시간 머신 달력 배지 (보기 전용) */}
                {activeSession && (() => {
                  const curPhase = gameTime.phase;
                  const phaseTheme = { "오전": { icon: "🌅", bg: "#431407", color: "#fed7aa" }, "낮": { icon: "☀️", bg: "#1e3a5f", color: "#93c5fd" }, "저녁": { icon: "🌆", bg: "#4a2818", color: "#fdba74" }, "심야": { icon: "🌙", bg: "#2d1b4e", color: "#d8b4fe" }, "밤": { icon: "🌙", bg: "#2d1b4e", color: "#d8b4fe" } }[curPhase] || { icon: "☀️", bg: "#1e3a5f", color: "#93c5fd" };
                  return (
                    <div title="현재 진행 중인 일차와 시간대" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "3px 8px", borderRadius: "10px", backgroundColor: phaseTheme.bg, color: phaseTheme.color, fontWeight: "bold", flexShrink: 0, userSelect: "none" }}>
                      <span>{phaseTheme.icon}</span><span>{gameTime.day}일차 {curPhase}</span>
                    </div>
                  );
                })()}
                
                {activeSession && activeSession.ruleMode === "insane" && (
                  <span style={{ padding: "2px 7px", backgroundColor: activeSession.sheet?.phase === "클라이맥스" || activeSession.sheet?.phase === "마스터씬" ? "rgba(214, 56, 87, 0.2)" : activeSession.sheet?.phase === "도입" ? "rgba(0, 183, 211, 0.2)" : "rgba(229, 169, 60, 0.15)", border: `1px solid ${activeSession.sheet?.phase === "클라이맥스" || activeSession.sheet?.phase === "마스터씬" ? theme.danger : activeSession.sheet?.phase === "도입" ? theme.accent : theme.warning}`, borderRadius: "6px", fontSize: "0.68rem", color: activeSession.sheet?.phase === "클라이맥스" || activeSession.sheet?.phase === "마스터씬" ? theme.danger : activeSession.sheet?.phase === "도입" ? theme.accent : theme.warning, fontWeight: "800", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {activeSession.sheet?.phase === "도입" ? "🎬 도입 페이즈" : activeSession.sheet?.phase === "마스터씬" ? "⚠️ 마스터 씬" : activeSession.sheet?.phase === "클라이맥스" ? "⚔️ 클라이맥스" : (isMobile ? `${activeSession.sheet?.cycle || 1}C/${activeSession.sheet?.scene || 1}S` : `${activeSession.sheet?.cycle || 1}C / ${activeSession.sheet?.scene || 1}S (L:${activeSession.sheet?.limit || 4})`)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 우측 액션 아이콘 바 */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "3px" : "5px", flexShrink: 0 }}>
            {activeSession && (activeSession.ruleMode?.startsWith("dating") || activeSession.ruleMode === "freeform") && (() => {
              const phoneChats = activeSession.sheet?.phoneChats || {}; let unreadCount = 0;
              Object.values(phoneChats).forEach(msgs => { unreadCount += (msgs || []).filter(m => m.unread).length; });
              return (
                <button type="button" onClick={(e) => { e.stopPropagation(); setIsSheetOpen(false); setActivePhoneContactId(null); setIsPhoneDrawerOpen(!isPhoneDrawerOpen); triggerVibration("light"); }} title="스마트폰 메신저 열기" style={{ position: "relative", height: isMobile ? "34px" : "36px", width: isMobile ? "34px" : "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: isPhoneDrawerOpen ? "rgba(0,0,0,0.08)" : "none", border: isPhoneDrawerOpen ? `1px solid ${theme.border}` : "none", borderRadius: "8px", cursor: "pointer", padding: 0, flexShrink: 0 }}>
                  <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>📱</span>
                  {unreadCount > 0 && <span style={{ position: "absolute", top: "2px", right: "2px", backgroundColor: theme.danger, color: "#fff", borderRadius: "10px", minWidth: "15px", height: "15px", padding: "0 3px", fontSize: "0.58rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
                </button>
              );
            })()}

            {activeSession && activeSession.ruleMode === "insane" && (
              <button type="button" onClick={() => setIsTabletopOpen(!isTabletopOpen)} title="테이블탑 핸드아웃 & 광기 덱 열기" style={{ height: isMobile ? "34px" : "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "3px", padding: isMobile ? "0 6px" : "0 8px", background: isTabletopOpen ? "rgba(214, 56, 87, 0.12)" : "none", border: isTabletopOpen ? `1.5px solid ${theme.danger}` : "none", borderRadius: "8px", cursor: "pointer", color: isTabletopOpen ? theme.danger : theme.text, whiteSpace: "nowrap", flexShrink: 0 }}>
                <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>🃏</span>
                <span style={{ fontSize: "0.72rem", fontWeight: "800", lineHeight: 1 }}>핸드아웃</span>
              </button>
            )}

            {activeSession && (activeSession.ruleMode === "coc" || activeSession.ruleMode === "insane") && (
              <button type="button" onClick={() => rollDiceDirectly()} title={activeSession.ruleMode === "coc" ? "1D100 주사위 굴리기" : "2D6 주사위 굴리기"} style={{ height: isMobile ? "34px" : "36px", width: isMobile ? "34px" : "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0, flexShrink: 0 }}>
                <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>🎲</span>
              </button>
            )}

            {activeSession && (
              <button type="button" onClick={(e) => { e.stopPropagation(); setIsPhoneDrawerOpen(false); setIsSheetOpen(!isSheetOpen); }} title="캐릭터 시트 및 정보" style={{ height: isMobile ? "34px" : "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "3px", padding: isMobile ? "0 6px" : "0 8px", background: isSheetOpen ? "rgba(0,0,0,0.08)" : "none", border: isSheetOpen ? `1.5px solid ${theme.accent}` : "none", borderRadius: "8px", color: isSheetOpen ? theme.accent : theme.text, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{activeSession.ruleMode?.startsWith("dating") ? "👤" : "📋"}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: "800", lineHeight: 1 }}>{activeSession.ruleMode?.startsWith("dating") ? "정보" : "시트"}</span>
              </button>
            )}

            {!activeSession && (
              <button onClick={() => { setActiveNoticeTab("update"); openModal(setShowNoticeModal); }} title="이용 가이드 및 패치 노트" style={{ height: isMobile ? "34px" : "36px", width: isMobile ? "34px" : "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
                <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>📢</span>
              </button>
            )}

            <button onClick={handleToggleDarkMode} title="다크 모드 전환" style={{ height: isMobile ? "34px" : "36px", width: isMobile ? "34px" : "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
              <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>{isDarkMode ? "☀️" : "🌙"}</span>
            </button>
          </div>
        </div>

        {/* 📞 [Phase 2] 리얼 스마트폰 풀스크린 통화 모달 (텍스트 잘림 해결 & 2분할 뷰) */}
        {isVoiceCallActive && isCallModalOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9998,
            backgroundColor: "#090d16",
            backgroundImage: `radial-gradient(circle at 50% 15%, ${theme.accent || "#38bdf8"}44 0%, #090d16 70%)`,
            display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 34px",
            color: "#fff"
          }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: "1.45rem", fontWeight: "800" }}>{voiceCallNpc?.name || "상대방"}</h2>
              <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.65)" }}>● 통화 중 (HD Voice)</span>
            </div>

            <div style={{
              width: "100%", maxWidth: "420px", backgroundColor: "rgba(22, 27, 34, 0.88)",
              borderRadius: "20px", backdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.12)",
              maxHeight: "55vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)"
            }}>
              {(() => {
                const lastMsg = activeSession?.messages?.[activeSession.messages.length - 1]?.text || "";
                const phoneMatch = lastMsg.match(/\[수화기\]:\s*([^\[]+)/);
                const fieldMatch = lastMsg.match(/\[현장\]:\s*([\s\S]+)/);

                if (phoneMatch || fieldMatch) {
                  return (
                    <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
                      {phoneMatch && (
                        <div style={{ marginBottom: "14px" }}>
                          <div style={{ fontSize: "0.75rem", color: theme.accent, fontWeight: "800", marginBottom: "4px" }}>[📞 수화기 너머]</div>
                          <div style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff", lineHeight: "1.5" }}>{phoneMatch[1].trim()}</div>
                        </div>
                      )}
                      {fieldMatch && (
                        <div style={{ borderTop: "1px dashed rgba(255,255,255,0.15)", paddingTop: "14px" }}>
                          <div style={{ fontSize: "0.75rem", color: theme.textMuted, fontWeight: "800", marginBottom: "4px" }}>[👁️ 방 안 현장]</div>
                          <div style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{fieldMatch[1].trim()}</div>
                        </div>
                      )}
                    </div>
                  );
                }

                const dialogueMatch = lastMsg.match(/"([^"]+)"/);
                const dialogue = dialogueMatch ? dialogueMatch[1] : null;
                const narration = lastMsg.replace(/"[^"]+"/g, "").trim();

                return (
                  <>
                    {dialogue ? (
                      <div style={{ padding: "18px 20px 14px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderBottom: narration ? "1px dashed rgba(255, 255, 255, 0.18)" : "none", flexShrink: 0 }}>
                        <div style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", lineHeight: "1.55", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>"{dialogue}"</div>
                      </div>
                    ) : (
                      <div style={{ padding: "16px 20px", fontSize: "1.05rem", color: "#5eead4", textAlign: "center", fontWeight: "600", flexShrink: 0 }}>{lastMsg || "수화기 너머로 숨소리가 들려옵니다..."}</div>
                    )}
                    {narration && (
                      <div style={{ padding: "16px 20px 20px", overflowY: "auto", flex: 1, fontSize: "0.95rem", color: "rgba(255, 255, 255, 0.88)", lineHeight: "1.75", textAlign: "center", wordBreak: "keep-all" }}>{narration}</div>
                    )}
                  </>
                );
              })()}
            </div>

            <div style={{ width: "100%", maxWidth: "420px", marginTop: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="수화기에 대고 말하기..." style={{ flex: 1, padding: "13px 20px", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", outline: "none" }} />
                <button onClick={() => { executeMessage(`[전화 통화] "${input}"`); setInput(""); }} style={{ padding: "0 22px", borderRadius: "9999px", backgroundColor: theme.accent, color: "#fff", border: "none", fontWeight: "700" }}>전송</button>
              </div>
              <button onClick={() => { setIsVoiceCallActive(false); setIsCallModalOpen(false); executeMessage(`[통화 종료] 전화를 끊었습니다.`); }} style={{ width: "66px", height: "66px", borderRadius: "50%", backgroundColor: "#ef4444", border: "none", alignSelf: "center", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "1.5rem" }}>☎️</span></button>
            </div>
          </div>
        )}

        {/* 💬 메인 대화 로그 (가운데 부분 스크롤) */}
        {!activeSession ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textMuted }}>
            좌측 상단 [☰] 메뉴에서 새 시나리오를 시작해 주세요.
          </div>
        ) : (
          <div ref={chatContainerRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", WebkitOverflowScrolling: "touch" }}>
            
            {/* 주사위 굴림 애니메이션 */}
            {isRolling && animationEnabled && (
              <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)", zIndex: 50, backgroundColor: theme.panel, border: `2px solid ${theme.accent}`, borderRadius: "14px", padding: "10px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="anim-dice-rolling" style={{ fontSize: "1.8rem" }}>🎲</span>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: theme.accent }}>{rollingDisplayNum}</div>
              </div>
            )}

            {(activeSession.messages || []).map((m, i) => {
              const isUser = m.role === "user";
              const isSystem = m.text.includes("[🎲") || m.text.includes("[⚠️") || m.text.includes("[시스템");

              return (
                <div key={i} style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: isMobile ? "88%" : "72%", display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: "8px", alignItems: "flex-start" }}>
                  <div className={isSystem ? "" : "serif-text"} style={{ backgroundColor: isSystem ? "rgba(229, 169, 60, 0.12)" : isUser ? theme.bubbleUser : theme.bubbleAi, color: theme.text, border: isSystem ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`, padding: "14px 18px", borderRadius: isUser ? "16px 2px 16px 16px" : "2px 16px 16px 16px", lineHeight: "1.9", whiteSpace: "pre-wrap", fontSize: "0.92rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    {m.cg && (
                      <div style={{ marginBottom: "14px", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                        <img src={m.cg.imageUrl || m.cg.url} alt={m.cg.title || "CG"} style={{ width: "100%", maxHeight: "380px", objectFit: "cover", display: "block" }} />
                        {m.cg.title && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 12px", background: "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 100%)", color: "#fff", fontSize: "0.78rem", fontWeight: "700" }}>✨ {m.cg.title}</div>}
                      </div>
                    )}
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isLoading && <div style={{ color: theme.accent, fontSize: "0.8rem", padding: "4px" }}>답장을 입력하는 중...</div>}
            
            {/* ========================================== */}
            {/* 🚨 다이내믹 액션 배너 영역 */}
            {/* ========================================== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0, marginTop: "10px" }}>

            {/* ⚠️ 마스터 씬 진행 중 배너 */}
              {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase === "마스터씬" && (
                <div style={{ backgroundColor: "rgba(214, 56, 87, 0.18)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.78rem", color: theme.danger }}>
                    ⚠️ <strong>마스터 씬 진행 중 (주요 행동 잠금)</strong>
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>대사와 반응을 자유롭게 나눈 뒤 씬을 마무리하세요.</div>
                  </div>
                  <button type="button" onClick={() => { setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, phase: "메인" } } : s)); executeMessage(`[🎬 마스터 씬 종료] 사건이 일단락되고, 다시 메인 드라마 장면으로 돌아갑니다.`); }} style={{ padding: "4px 10px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "800", cursor: "pointer" }}>
                    마무리 ➔
                  </button>
                </div>
              )}

              {/* ⚔️ 클라이맥스 1~6 플롯 대결 & 결전 액션 바 */}
              {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase === "클라이맥스" && (
                <div style={{ backgroundColor: "rgba(214, 56, 87, 0.12)", border: `1.5px solid ${theme.danger}`, borderRadius: "10px", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px dashed ${theme.border}`, paddingBottom: "6px" }}>
                    <div style={{ fontSize: "0.76rem", fontWeight: "800", color: theme.danger }}>👾 {activeSession.sheet?.enemyName || "괴이"}: HP {activeSession.sheet?.enemyHp ?? 6} / {activeSession.sheet?.maxEnemyHp ?? 6}</div>
                    <div style={{ fontSize: "0.76rem", fontWeight: "800", color: theme.success }}>❤️ 내 HP: {activeSession.sheet?.hp ?? 6} / {activeSession.sheet?.maxHp ?? 6}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.74rem", fontWeight: "800", color: theme.text }}>속도(플롯) 선택:</span>
                    {!activeSession.sheet?.flashbackUsed && (
                      <button type="button" onClick={() => triggerFlashback("check")} style={{ padding: "2px 7px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.68rem", fontWeight: "800", cursor: "pointer" }}>🗝️ 회상 (판정+3)</button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button key={num} type="button" onClick={() => executeClimaxPlot(num)} style={{ flex: 1, padding: "5px 0", backgroundColor: theme.panel, border: `1px solid ${theme.warning}`, borderRadius: "5px", color: theme.text, fontSize: "0.76rem", fontWeight: "900", cursor: "pointer" }}>{num}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                    {(activeSession.sheet?.rituals || [ { id: 1, name: "1단계", skill: "도구" }, { id: 2, name: "2단계", skill: "소리" }, { id: 3, name: "3단계", skill: "슬픔" } ]).map((r, idx) => (
                      <div key={idx} style={{ flex: 1, padding: "5px 4px", borderRadius: "6px", textAlign: "center", backgroundColor: r.completed ? "rgba(98, 214, 129, 0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${r.completed ? theme.success : theme.border}`, color: r.completed ? theme.success : theme.textMuted, fontSize: "0.7rem", fontWeight: "800" }}>
                        {r.completed ? `✔️ ${idx + 1}단계 완료` : `${idx + 1}단계: 《${r.skill}》`}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    {climaxStep === "dodge" && (
                      <button type="button" onClick={executePlayerDodge} style={{ flex: 1, padding: "8px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.78rem", cursor: "pointer", boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)" }}>🛡️ 회피 판정 (2D6)</button>
                    )}
                    <button type="button" disabled={climaxStep === "plot" || climaxStep === "dodge"} onClick={executeClimaxAttack} style={{ flex: 1, padding: "8px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.78rem", opacity: (climaxStep === "plot" || climaxStep === "dodge") ? 0.35 : 1, cursor: (climaxStep === "plot" || climaxStep === "dodge") ? "not-allowed" : "pointer" }}>⚔️ 기본 공격 (2D6)</button>
                    <button type="button" disabled={climaxStep === "plot" || !activeSession.sheet?.isRitualDiscovered} onClick={() => { if (!activeSession || !activeSession.sheet?.isRitualDiscovered) return; let rituals = activeSession.sheet?.rituals; const nextIdx = rituals.findIndex(r => !r.completed); if (nextIdx !== -1) executeClimaxRitual(nextIdx); }} style={{ flex: 1, padding: "8px", backgroundColor: "#374151", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.78rem", opacity: climaxStep === "plot" ? 0.35 : 1, cursor: climaxStep === "plot" ? "not-allowed" : "pointer" }}>{activeSession.sheet?.isRitualDiscovered ? "📜 의식 진행 (2D6)" : "⚠️ 봉인 단서 미확인"}</button>
                  </div>
                </div>
              )}

              {/* 🌟 1. 도입 페이즈 전용 액션 바 */}
              {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase === "도입" && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "4px 0", marginTop: "4px" }}>
                  <button type="button" onClick={() => setInput("상황을 조용히 지켜보며 주변을 살핀다.")} style={{ flex: 1, padding: "8px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>💬 상황 반응하기</button>
                  <button type="button" onClick={() => { if (window.confirm("도입 페이즈를 종료하고 제 1사이클을 개막하시겠습니까?")) { setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, phase: "메인", cycle: 1, scene: 1, actionUsed: false } } : s)); setInput("도입 페이즈를 종료하고 제 1사이클을 개막합니다. 플레이어의 첫 번째 장면을 열어주십시오."); } }} style={{ flex: 1.2, padding: "8px 10px", backgroundColor: theme.primary, border: "none", borderRadius: "6px", color: "#fff", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer" }}>🚀 도입 종료 (제 1사이클 개막)</button>
                </div>
              )}

              {/* 🎯 인세인 드라마 씬 3대 주요 행동 바 */}
              {activeSession && activeSession.ruleMode === "insane" && activeSession.sheet?.phase !== "마스터씬" && activeSession.sheet?.phase !== "클라이맥스" && activeSession.sheet?.phase !== "도입" && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "4px 0", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.72rem", color: theme.warning, fontWeight: "800", alignSelf: "center" }}>🎯 주요 행동:</span>
                  <button type="button" onClick={() => setShowSkillMatrixModal(true)} style={{ padding: "4px 9px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>🔍 조사 판정(자율)</button>
                  <button type="button" onClick={() => { const npcs = activeSession?.sheet?.npcs || []; const defaultTarget = npcs.length === 1 ? npcs[0] : null; const d = Math.floor(Math.random() * 6) + 1; setEmotionModal({ targetNpc: defaultTarget, roll: d, pair: INSANE_EMOTIONS_TABLE[d] }); }} style={{ padding: "4px 9px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", color: theme.text, cursor: "pointer" }}>💬 감정 판정 (1D6)</button>
                  <button type="button" onClick={() => setInput(`[주요 행동: 회복 판정 선언] 흐트러진 정신과 상처를 추스릅니다. `)} style={{ padding: "4px 9px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.success, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>🩹 회복 판정</button>
                  <button type="button" onClick={handleRollSceneTable} style={{ padding: "4px 9px", backgroundColor: "rgba(229, 169, 60, 0.15)", border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.warning, fontSize: "0.72rem", cursor: "pointer", fontWeight: "800" }}>🎬 장면표 (2D6)</button>
                </div>
              )}

              {/* 🌟 CoC 전용 조사 칩 */}
              {activeSession?.ruleMode !== "insane" && !activeSession?.ruleMode?.startsWith("dating") && (activeSession?.investigationSpots || []).length > 0 && (
                <div onTouchStart={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()} style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.72rem", color: theme.warning, fontWeight: "700", alignSelf: "center" }}>🔍 조사:</span>
                  {activeSession.investigationSpots.map((spot, idx) => (
                    <button key={idx} onClick={() => setInput(prev => `[조사: ${spot.name}] ` + prev)} style={{ padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>{spot.name}</button>
                  ))}
                </div>
              )}
              
              {/* 1. 엔딩 도달 배너 */}
              {isScenarioEnded && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: isTrueEnding ? "rgba(245, 158, 11, 0.15)" : isBadEnding ? "rgba(214, 56, 87, 0.15)" : "rgba(98, 214, 129, 0.15)", border: `1.5px solid ${isTrueEnding ? "#f59e0b" : isBadEnding ? theme.danger : theme.success}`, borderRadius: "8px", padding: "10px 14px" }}>
                  <div style={{ fontSize: "0.8rem", color: theme.text }}>
                    <strong>{calculatedEnding?.title || "✨ 시나리오가 완결되었습니다."}</strong>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>우측 시트에서 에필로그를 확인하세요.</div>
                  </div>
                  <button onClick={() => executeMessage(`[에필로그 요청] 결말 이후의 담담한 후일담을 3~4문단으로 서술해 주십시오.`)} style={{ padding: "6px 12px", backgroundColor: isTrueEnding ? "#f59e0b" : isBadEnding ? theme.danger : theme.accent, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "0.75rem", cursor: "pointer" }}>📜 후일담 보기</button>
                </div>
              )}

              {/* 2. 광기 발현 알림 */}
              {activeMadnessAlert && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(247, 101, 133, 0.22)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "0.78rem", color: theme.danger }}>
                    🩸 <strong>[광기 발현: {activeMadnessAlert.name}]</strong>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{activeMadnessAlert.desc}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => { setInput(prev => `[광기 발현: ${activeMadnessAlert.name}] ` + prev); setActiveMadnessAlert(null); }} style={{ padding: "4px 10px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "0.72rem", cursor: "pointer" }}>대사에 반영</button>
                    <button onClick={() => setActiveMadnessAlert(null)} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              )}

              {/* 3. 시스템 판정 요구 (주사위 굴림 유도) */}
              {activeSession?.pendingCheck && !isSanCheckDetected && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1.5px solid ${theme.warning}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "0.78rem", color: theme.text }}>
                    <strong style={{ color: theme.warning }}>🎲 판정 요구: {activeSession.pendingCheck.skill}</strong>
                    <span style={{ fontSize: "0.72rem", color: theme.textMuted, marginLeft: "6px" }}>(목표치: {activeSession.pendingCheck.target})</span>
                  </div>
                  <button onClick={() => rollDiceDirectly(activeSession.pendingCheck.target, activeSession.pendingCheck.skill)} style={{ padding: "5px 12px", backgroundColor: theme.warning, color: "#000", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.75rem", cursor: "pointer" }}>🎲 판정 굴리기</button>
                </div>
              )}

              {/* 4. 장소 이동 카드 (LOCATION_CARDS) */}
              {locationCards && locationCards.length > 0 && (
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "8px 2px", marginBottom: "6px" }}>
                  {locationCards.map((card, idx) => {
                    const isAppointed = (activeSession?.sheet?.appointments || []).some(app => (app.place && card.name?.includes(app.place)) || (app.npc && card.npc?.includes(app.npc)));
                    const allScenarioCgs = activeSession?.sheet?.scenarioCgs || activeSession?.sheet?.cgs || scenarioCgs || [];
                    const currentUnlocked = activeSession?.sheet?.unlockedCgs || [];
                    const cardWords = (card.name || "").replace(/[^가-힣a-zA-Z0-9\s]/g, " ").split(/\s+/).filter(w => w.length >= 2);
                    
                    const curPhase = currentPhase || activeSession?.sheet?.currentPhase || "낮";
                    const targetNpcName = activeSession?.sheet?.npcs?.[0]?.name || "상대방";

                    // 🌟 시간대와 대상 인물까지 완벽하게 맞아야 뱃지 점등!
                    const hasEventHint = allScenarioCgs.some(cg => {
                      const isAlreadyUnlocked = currentUnlocked.some(u => (u?.title && u.title === cg.title) || u === cg.title);
                      if (isAlreadyUnlocked) return false;
                      const cond = (cg.trigger || cg.condition || "").trim();
                      if (!cond) return false;
                      
                      const isLocationMatch = cardWords.some(w => cond.includes(w));
                      if (!isLocationMatch) return false;
                      
                      const hasTimeCond = /새벽|아침|낮|저녁|노을|밤|심야/.test(cond);
                      if (hasTimeCond && !cond.includes(curPhase)) return false;
                      
                      const hasNpcCond = new RegExp(targetNpcName, "i").test(cond);
                      if (hasNpcCond && !cond.includes(targetNpcName)) return false;
                      
                      return true;
                    });

                    return (
                      <div key={idx} onClick={() => {
                        const targetText = card.npc ? `${card.name}(으)로 향하여 그곳에 있는 [${card.npc}]와(과) 마주친다.` : `${card.name}(으)로 향한다.`;
                        if (card.npc) {
                          const matchedNpc = (activeSession?.sheet?.npcs || []).find(n => n.name === card.npc || (card.npc && n.name.includes(card.npc)));
                          if (matchedNpc) setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, activeContactId: matchedNpc.id } : s));
                        }
                        setLocationCards([]);
                        executeMessage(targetText);
                      }} style={{ position: "relative", flex: "0 0 auto", width: isMobile ? "190px" : "220px", padding: "10px 12px", borderRadius: "10px", border: hasEventHint ? "1.5px solid #f59e0b" : (isAppointed ? "1.5px solid #f43f5e" : "1px solid rgba(255, 255, 255, 0.15)"), backgroundColor: hasEventHint ? "rgba(69, 39, 10, 0.9)" : (isAppointed ? "rgba(76, 29, 44, 0.85)" : "rgba(30, 41, 59, 0.85)"), cursor: "pointer", boxShadow: hasEventHint ? "0 0 12px rgba(245, 158, 11, 0.35)" : (isAppointed ? "0 0 10px rgba(244, 63, 94, 0.25)" : "none") }}>
                        {isAppointed && <div style={{ display: "inline-block", fontSize: "0.62rem", fontWeight: "800", color: "#fff", backgroundColor: "#f43f5e", padding: "1px 6px", borderRadius: "4px", marginBottom: "4px" }}>⭐ 약속 장소</div>}
                        {hasEventHint && !isAppointed && <div style={{ display: "inline-block", fontSize: "0.62rem", fontWeight: "800", color: "#fff", backgroundColor: "#d97706", padding: "1px 6px", borderRadius: "4px", marginBottom: "4px" }}>✨ 묘한 예감</div>}
                        <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: hasEventHint ? "#fde68a" : (isAppointed ? "#fda4af" : "#67e8f9"), marginBottom: "3px" }}>📍 {card.name}</div>
                        {card.desc && <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.3", marginBottom: "4px" }}>{card.desc}</div>}
                        {hasEventHint && <div style={{ fontSize: "0.7rem", color: "#fcd34d", fontStyle: "italic", lineHeight: "1.3", marginBottom: "4px" }}>*(이곳에 가면 어떤 일이 생길 것 같다는 생각이 든다……)*</div>}
                        {card.npc && <div style={{ fontSize: "0.7rem", color: "#cbd5e1" }}>👤 {card.npc}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ⌨️ 하단 캡슐형 입력창 & `+` 액션 서랍 */}
        {activeSession && (
          <div style={{ position: "sticky", bottom: 0, zIndex: 30, padding: "10px 14px", paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "center", flexShrink: 0 }}>
            
            <div style={{ flex: 1, maxWidth: "860px", display: "flex", alignItems: "flex-end", backgroundColor: theme.panel, border: `1.5px solid ${theme.border}`, borderRadius: "28px", padding: "4px 8px 4px 10px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              
              {/* 좌측 + (액션 서랍) 버튼 */}
              <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "4px" }}>
                <button type="button" onClick={() => setIsActionDrawerOpen(!isActionDrawerOpen)} style={{ background: "none", border: "none", color: isActionDrawerOpen ? theme.accent : theme.textMuted, cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>

                {/* 🌟 + 버튼을 누르면 위로 튀어나오는 액션 메뉴 팝오버 */}
                {isActionDrawerOpen && (
                  <>
                    <div onClick={() => setIsActionDrawerOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
                    <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: "48px", left: "0", width: "220px", backgroundColor: theme.panel, backdropFilter: "blur(14px)", border: `1.5px solid ${theme.border}`, borderRadius: "16px", padding: "8px", display: "flex", flexDirection: "column", gap: "4px", boxShadow: "0 12px 32px rgba(0,0,0,0.35)", zIndex: 100 }}>
                      
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted, padding: "4px 8px", fontWeight: "800", borderBottom: `1px dashed ${theme.border}` }}>액션 메뉴</div>

                      {/* 공통 시스템 버튼 */}
                      <button onClick={() => { setShowMemoryModal(true); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", cursor: "pointer" }}>📖 사건 기억 수첩</button>
                      <button onClick={() => { setShowCgAlbumModal(true); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", cursor: "pointer" }}>🖼️ CG 앨범 열람</button>
                      <div style={{ height: "1px", backgroundColor: theme.border, margin: "2px 0" }} />

                      {/* 인세인 전용 메뉴 */}
                      {activeSession.ruleMode === "insane" && (
                        <>
                          {!activeSession?.sheet?.actionUsed ? (
                            <>
                              <button onClick={() => { setInvestigationModal({ step: "selectTarget" }); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>🔍 조사 판정 선언</button>
                              <button onClick={() => { const npcs = activeSession?.sheet?.npcs || []; const defaultTarget = npcs.length === 1 ? npcs[0] : null; const d = Math.floor(Math.random() * 6) + 1; setEmotionModal({ targetNpc: defaultTarget, roll: d, pair: INSANE_EMOTIONS_TABLE[d] }); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>💬 감정 맺기 (1D6 감정표)</button>
                              <button onClick={() => { setInput("휴식을 취하며 상처를 추스릅니다."); rollInsaneCheck("인내", 5, "회복 판정"); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>🩹 휴식 및 회복 판정</button>
                              <button onClick={() => { handleRollSceneTable(); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.warning, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>📜 2D6 정규 장면표 굴리기</button>
                            </>
                          ) : (
                            <button onClick={handleSceneClose} style={{ padding: "10px", textAlign: "center", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1.5px solid ${theme.warning}`, borderRadius: "10px", color: theme.warning, fontSize: "0.82rem", fontWeight: "800", cursor: "pointer" }}>🎬 장면 닫기 (Scene Close)</button>
                          )}
                          <div style={{ height: "1px", backgroundColor: theme.border, margin: "2px 0" }} />
                          <button onClick={() => { setShowInsaneGuideModal(true); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.textMuted, fontSize: "0.75rem", cursor: "pointer" }}>❓ 인세인 룰 가이드</button>
                        </>
                      )}
                      {/* CoC 전용 메뉴 */}
                      {activeSession.ruleMode === "coc" && (
                        <>
                          <button onClick={() => { rollDiceDirectly(); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>🎲 1D100 주사위</button>
                          <button onClick={() => { rollDiceDirectly(activeSession.sheet?.san ?? 50, "이성 체크"); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.danger, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>🧠 이성(SAN) 체크</button>
                        </>
                      )}

                      {/* 미연시 전용 메뉴 */}
                      {(activeSession.ruleMode?.startsWith("dating") || activeSession.ruleMode === "freeform") && (
                        <>
                          <button onClick={() => { setIsPhoneDrawerOpen(true); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>📱 메신저 열기</button>
                          <button onClick={() => { setGiftModalNpc(activeSession.sheet?.npcs?.[0]); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>🎁 선물하기</button>
                          <button onClick={() => { setClueModalNpc(activeSession.sheet?.npcs?.[0]); setIsActionDrawerOpen(false); }} style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>💡 취향 수첩</button>
                        </>
                      )}

                     {/* 🌟 시간 흐름 & 수면 (언제든 선택 가능) */}
                      <div style={{ height: "1px", backgroundColor: theme.border, margin: "2px 0" }} />
                      
                      <button 
                        type="button"
                        onClick={() => { advanceTimePhase(); setIsActionDrawerOpen(false); }} 
                        style={{ padding: "8px 10px", textAlign: "left", background: "none", border: "none", color: theme.text, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        ⏳ 다음 시간대로 이동 (현재: {gameTime.phase})
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => { sleepNextDay(); executeMessage(`[수면] 잠자리에 들어 다음 날을 맞이합니다.`); setIsActionDrawerOpen(false); }} 
                        style={{ padding: "8px 10px", textAlign: "left", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.4)", borderRadius: "8px", color: "#818cf8", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        🛏️ 수면 / 다음 날로 넘어가기
                      </button>
                      )}

              {/* 중앙 입력칸 */}
              <textarea 
                value={input} 
                onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px"; }} 
                onKeyDown={e => { if (!isMobile && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); e.target.style.height = "36px"; } }} 
                placeholder="대사나 행동을 묘사하세요..." 
                rows={1}
                style={{ flex: 1, minHeight: "36px", maxHeight: "130px", backgroundColor: "transparent", color: theme.text, border: "none", outline: "none", padding: "8px 10px", fontSize: "0.88rem", lineHeight: "1.4", resize: "none" }} 
              />

              {/* 우측 전송 버튼 / 취소 버튼 */}
              {abortController || isLoading ? (
                <button onClick={handleCancelResponse} style={{ height: "36px", width: "36px", borderRadius: "50%", backgroundColor: theme.danger, color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2px", flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>
                </button>
              ) : (
                <button onClick={() => { sendMessage(); const el = document.querySelector('textarea'); if(el) el.style.height="36px"; }} disabled={!input.trim()} style={{ height: "36px", width: "36px", borderRadius: "50%", backgroundColor: input.trim() ? theme.accent : "rgba(150, 150, 150, 0.22)", color: input.trim() ? "#fff" : theme.textMuted, border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2px", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ⏳ [서사적 전환 연출] 2초 암전 애니메이션 (ADVANCE_DAY 등) */}
      {timeTransition && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.88)", backdropFilter: "blur(6px)", transition: "all 0.5s ease-in-out" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "38px", marginBottom: "16px", animation: "spin 2s linear infinite" }}>⏳</div>
            <div style={{ color: "#d6d3d1", fontSize: "14px", letterSpacing: "2px", fontFamily: "serif" }}>고요히 흐르는 시간 속에 머무는 중……</div>
          </div>
        </div>
      )}
{/* ===================================================================== */}
      {/* 📋 [Block 6] 우측 시트 패널 및 전체 모달 렌더링 (최종 조립) */}
      {/* ===================================================================== */}
      
      {/* 3. 우측 시트 패널 (▶ 오른쪽으로 밀면 닫힘) */}
      {activeSession && (
        <div 
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const diff = e.changedTouches[0].clientX - touchStartX;
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

            {/* 내 캐릭터 상세 설정 & 비밀 열람 */}
            <div className="glass-card" style={{ padding: "10px 12px", borderRadius: "10px" }}>
              <details style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent, outline: "none" }}>
                  📖 내 캐릭터 백스토리 & 비밀
                </summary>
                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ padding: "12px 14px", backgroundColor: "rgba(0, 0, 0, 0.04)", border: `1px solid ${theme.border}`, borderRadius: "8px", fontSize: "0.82rem", lineHeight: "1.75", color: theme.text, fontWeight: "500", whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                    <div style={{ fontWeight: "800", color: theme.accent, marginBottom: "8px", fontSize: "0.82rem" }}>📜 성격 및 백스토리</div>
                    {(() => {
                      const raw = activeSession.sheet?.background;
                      if (!raw) return "기재된 설정이 없습니다.";
                      let clean = raw.replace(/\*\*/g, "");
                      clean = clean.replace(/([.!?"]\s*)([가-힣\w\s()]{2,15}:)/g, "$1\n\n📌 $2\n");
                      return clean.trim();
                    })()}
                  </div>
                  {activeSession.sheet?.secret && (
                    <div style={{ padding: "10px 12px", backgroundColor: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", fontSize: "0.8rem", lineHeight: "1.7", color: "#f87171", whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                      <div style={{ fontWeight: "800", marginBottom: "6px", fontSize: "0.82rem", color: "#f87171" }}>🔒 숨겨진 비밀 / 사명</div>
                      {activeSession.sheet.secret.replace(/\*\*/g, "")}
                    </div>
                  )}
                </div>
              </details>
            </div>

            {/* 시나리오 정보 및 개요 열람 */}
            <div className="glass-card" style={{ padding: "10px 12px", borderRadius: "10px" }}>
              <details style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent, outline: "none" }}>📜 시나리오 개요 확인</summary>
                <div style={{ marginTop: "8px", fontSize: "0.73rem", lineHeight: "1.5", color: theme.textMuted, whiteSpace: "pre-wrap", maxHeight: "220px", overflowY: "auto", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>
                  {(() => {
                    const fullText = activeSession.scenarioText || "";
                    const parts = fullText.split(/\[키퍼\s*전용\s*(?:기밀|진상|스포일러)[^\]]*\]/i);
                    const publicPart = parts[0]?.trim() || "시나리오 개요가 없습니다.";
                    const secretPart = parts[1]?.trim();
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div>{publicPart}</div>
                        {secretPart && (
                          <details style={{ marginTop: "6px", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>
                            <summary style={{ color: theme.danger, fontWeight: "700", cursor: "pointer" }}>🔒 키퍼 전용 진상/엔딩 분기 (스포일러 주의)</summary>
                            <div style={{ marginTop: "6px", color: theme.danger, whiteSpace: "pre-wrap", opacity: 0.9 }}>{secretPart}</div>
                          </details>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </details>
            </div>

            {/* 취향 & 관심사 노트 / 증거 수첩 */}
            <div className="glass-card" style={{ padding: "10px 12px", borderRadius: "10px" }}>
              <details open style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent, outline: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{activeSession.ruleMode?.startsWith("dating") ? "💡 취향 & 관심사 노트" : "📋 증거 수첩"}</span>
                  <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>{(activeSession.sheet?.clues || []).length}개</span>
                </summary>
                <div style={{ marginTop: "8px", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(!activeSession.sheet?.clues || activeSession.sheet.clues.length === 0) ? (
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, padding: "4px 0" }}>
                      {activeSession.ruleMode?.startsWith("dating") ? "상대가 좋아하는 취향이나 관심사가 아직 기록되지 않았습니다." : "아직 발견된 결정적 단서가 없습니다."}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {activeSession.sheet.clues.filter(clue => {
                        const n = (clue.name || "").trim();
                        if (n.length < 2 || n === "것" || n === "점" || n === "때") return false;
                        if (/(?:있는|없는|하는|되는|같은|않은|적인|스런|스러운|로운|[인한])$/.test(n)) return false;
                        return true;
                      }).map((clue, cIdx) => {
                        const isDislike = clue.type === "dislike";
                        return (
                          <div key={cIdx} title={clue.desc} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 9px", backgroundColor: isDislike ? "rgba(239, 68, 68, 0.1)" : theme.panelAlt, borderRadius: "14px", fontSize: "0.74rem", fontWeight: "600", border: `1px solid ${isDislike ? "rgba(239, 68, 68, 0.4)" : theme.border}`, color: isDislike ? (theme.danger || "#ef4444") : theme.text }}>
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

            {/* 적(에너미) 체력 게이지 카드 */}
            {activeSession.sheet?.phase === "클라이맥스" && (
              <div className="glass-card" style={{ padding: "12px", borderRadius: "10px", border: `1.5px solid ${theme.danger}`, backgroundColor: "rgba(214, 56, 87, 0.08)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.82rem", color: theme.danger }}>👾 {activeSession.sheet?.enemyName || "괴이 (적)"}</span>
                  <strong style={{ fontSize: "0.85rem", color: theme.danger }}>HP {activeSession.sheet?.enemyHp ?? 6} / {activeSession.sheet?.maxEnemyHp ?? 6}</strong>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: theme.panelAlt, borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(0, Math.min(100, ((activeSession.sheet?.enemyHp ?? 6) / (activeSession.sheet?.maxEnemyHp ?? 6)) * 100))}%`, height: "100%", backgroundColor: theme.danger, transition: "width 0.3s ease" }} />
                </div>
              </div>
            )}
   
            {/* 호감도 동적 표시 (미연시 모드) */}
            {(activeSession.ruleMode?.startsWith("dating") || activeSession.ruleMode === "freeform") ? (() => {
              const npcs = activeSession.sheet?.npcs || [];
              const curTargetId = activeSession.activeContactId || activeSession.sheet?.activeContactId;
              const targetChar = npcs.find(n => n.id === curTargetId) || npcs[0];
              const affVal = Number(targetChar?.affection ?? 0);

              return (
                <div className="glass-card" style={{ padding: "14px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px", border: `1.5px solid rgba(247, 101, 133, 0.4)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.danger }}>♥ 호감도 ({targetChar?.name || "상대방"})</span>
                    <strong style={{ fontSize: "0.95rem", color: theme.danger }}>{affVal} / 100</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: theme.panelAlt, borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, Math.max(0, affVal))}%`, height: "100%", backgroundColor: theme.danger, transition: "width 0.4s ease" }} />
                  </div>
                  <div style={{ fontSize: "0.74rem", color: theme.textMuted, textAlign: "center" }}>
                    현재 관계: <strong style={{ color: theme.text }}>{affVal >= 80 ? "💕 깊은 유대와 애정" : affVal >= 50 ? "✨ 미묘한 설렘 (썸)" : affVal >= 30 ? "☕ 호감을 가진 지인" : "🌱 조심스러운 첫 만남"}</strong>
                  </div>
                </div>
              );
            })() : (
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

            {/* CoC 8대 특성치 & 기능치 주사위 굴림 패널 */}
            {activeSession.ruleMode === "coc" && (
              <>
                {activeSession.sheet.cocStats && (
                  <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
                    <div style={{ fontWeight: "800", fontSize: "0.76rem", marginBottom: "6px", color: theme.danger }}>📊 8대 특성치 (1D100 🎲)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                      {Object.keys(COC_STAT_LABELS).map(k => (
                        <button key={k} onClick={() => rollDiceDirectly(activeSession.sheet.cocStats[k], COC_STAT_LABELS[k])} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.68rem", cursor: "pointer" }}>
                          <span>{COC_STAT_LABELS[k]}</span><span style={{ fontWeight: "700" }}>{activeSession.sheet.cocStats[k]}% 🎲</span>
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
                          <button onClick={() => rollDiceDirectly(sk.val, sk.name)} style={{ padding: "2px 6px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.68rem", cursor: "pointer", fontWeight: "700" }}>🎲 판정</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 인세인 특화: 사명, 광기 핸드, 특기 2D6 주사위 패널 */}
            {activeSession.ruleMode === "insane" && (
              <>
                <div className="glass-card" style={{ padding: "10px", borderRadius: "8px", fontSize: "0.72rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: theme.warning }}>공개 사명</strong>
                    <button onClick={() => triggerMadnessDirectly(activeSessionId)} style={{ padding: "2px 6px", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: "4px", fontSize: "0.65rem", fontWeight: "800", cursor: "pointer" }}>💥 광기 발현</button>
                  </div>
                  <div>{activeSession.sheet.mission}</div>
                  <div style={{ color: theme.danger, borderTop: `1px dashed ${theme.border}`, paddingTop: "4px" }}><strong>🔒 비밀:</strong> {activeSession.sheet.secret}</div>
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
                          {!c.revealed && <button onClick={() => manifestMadnessCard(c.id, activeSessionId)} style={{ padding: "1px 6px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "3px", fontSize: "0.65rem", cursor: "pointer", fontWeight: "700" }}>발현</button>}
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
                        <button key={idx} onClick={() => rollDiceDirectly(5, `특기: ${sk}`)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.7rem", cursor: "pointer" }}><span>{sk}</span></button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 등장인물 프로필 리스트 (가장 아래 배치) */}
            <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontWeight: "800", fontSize: "0.78rem", color: theme.accent }}>주요 등장인물</span>
                <button type="button" onClick={() => {
                  const newName = prompt("추가할 등장인물의 이름을 입력하세요 (예: 유진):");
                  if (!newName || !newName.trim()) return;
                  const newJob = prompt(`${newName}의 직업이나 역할을 입력하세요 (예: 동료 연구원, 손님):`, "조력자");
                  const newDetail = prompt(`${newName}의 외모나 관계성을 입력하세요 (선택):`, "");
                  const newNpcObj = { id: Date.now(), name: newName.trim(), title: (newJob || "조력자").trim(), detail: (newDetail || "").trim(), portrait: typeof getPortraitUrl === "function" ? getPortraitUrl(`${newName.trim()}, portrait`) : "", affection: 0, secret: "", secretRevealed: false };
                  setSessions(prev => prev.map(s => { if (s.id !== activeSessionId) return s; return { ...s, sheet: { ...s.sheet, npcs: [...(s.sheet?.npcs || []), newNpcObj] } }; }));
                  alert(`'${newName.trim()}' 인물이 캐릭터 시트와 메신저에 등록되었습니다!`);
                }} style={{ padding: "2px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", fontSize: "0.68rem", fontWeight: "700", color: theme.accent, cursor: "pointer" }}>+ 인물 추가</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(activeSession.sheet.npcs || []).map(npc => (
                  <details key={npc.id} style={{ backgroundColor: theme.panelAlt, borderRadius: "6px", border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                    <summary style={{ display: "flex", gap: "8px", alignItems: "center", padding: "6px 8px", cursor: "pointer", outline: "none" }}>
                      <div onClick={(e) => { e.stopPropagation(); setActivePortraitTarget(npc.id); openModal(setShowPortraitEditModal); }} style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
                        <img src={npc.portrait} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: "0.72rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700" }}>
                          <span>{npc.name}</span>
                          {activeSession.ruleMode === "insane" ? ( npc.emotion ? <span style={{ color: "#a855f7", backgroundColor: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "1px 6px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "800" }}>🎭 {npc.emotion}</span> : <span style={{ color: theme.textMuted, fontSize: "0.65rem", fontWeight: "normal" }}>감정 없음</span> ) : ( <span style={{ color: theme.danger }}>♥ {npc.affection ?? 0}</span> )}
                        </div>
                        <div style={{ color: theme.textMuted, fontSize: "0.65rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{npc.title}</div>
                      </div>
                    </summary>
                    {(() => {
                      const isHandoutUnlocked = (activeSession.sheet?.handouts || []).some(h => (h.npcId === npc.id || (npc.name && h.title?.includes(npc.name))) && h.revealed);
                      const isChatUnlocked = (activeSession.messages || []).some(m => m.text.includes("조사 성공") && (m.text.includes(npc.name) || (npc.title && m.text.includes(npc.title))));
                      const isUnlocked = npc.secretRevealed || isHandoutUnlocked || isChatUnlocked || /\[(?:True|Happy|Bad|Dead|Normal|Open|Hidden|Secret)?\s*End[: \]]|완결|막을 내렸다/i.test(activeSession?.messages?.[activeSession.messages.length - 1]?.text || "");
                      return (
                        <div style={{ padding: "10px 12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "rgba(0, 0, 0, 0.12)" }}>
                          <div style={{ fontSize: "0.84rem", lineHeight: "1.7", color: theme.text, fontWeight: "500", whiteSpace: "pre-wrap", wordBreak: "keep-all", margin: "6px 0 10px 0" }}>
                            {(() => { const raw = npc.desc || npc.detail; if (!raw) return "등록된 상세 설정이 없습니다."; let clean = raw.replace(/\*\*/g, ""); clean = clean.replace(/([.!?"]\s*)([가-힣\w\s()]{2,25}:)/g, "$1\n\n📌 $2\n"); return clean.trim(); })()}
                          </div>
                          {isUnlocked ? (
                            <div style={{ padding: "10px 12px", backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", fontSize: "0.8rem", lineHeight: "1.7", color: "#b91c1c", fontWeight: "500", whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                              <div style={{ fontWeight: "800", marginBottom: "6px", fontSize: "0.82rem", color: "#dc2626" }}>🔓 밝혀진 비밀 / 진심</div>
                              {(npc.secret || "밝혀진 비밀 내용이 기재되어 있지 않습니다.").replace(/\*\*/g, "")}
                            </div>
                          ) : (
                            <div style={{ padding: "9px 12px", backgroundColor: "rgba(0, 0, 0, 0.03)", border: `1px dashed ${theme.border}`, borderRadius: "8px", fontSize: "0.76rem", color: theme.textMuted, display: "flex", alignItems: "center", gap: "8px" }}>
                              <span>🔒</span><span><strong style={{ color: theme.danger }}>[숨겨진 비밀/진심]</strong> 아직 서사 속에서 밝혀지지 않은 비밀입니다.</span>
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

      {/* ===================================================================== */}
      {/* 🌟 전체 화면 오버레이 모달 (메신저 서랍, 테이블탑, 토스트 등) */}
      {/* ===================================================================== */}
      
      {/* 🌟 하단 팝업 메신저 서랍 */}
      {(() => {
        // [수정: 자유서사 지원 완벽 반영]
        if (!isPhoneDrawerOpen || !activeSession || (!activeSession.ruleMode?.startsWith("dating") && activeSession.ruleMode !== "freeform")) return null;

        const currentContact = (activeSession.sheet?.npcs || []).find(n => n.id === activePhoneContactId);
        const partnerName = currentContact?.name || "상대방";
        const currentMsgs = (activeSession.sheet?.phoneChats || {})[activePhoneContactId] || [];

        let totalUnread = 0;
        Object.values(activeSession.sheet?.phoneChats || {}).forEach(msgs => { totalUnread += (msgs || []).filter(m => m.unread).length; });

        const onDragStart = (clientY) => { setDragStartY(clientY); setDragCurrentY(0); };
        const onDragMove = (clientY) => { if (dragStartY !== null && clientY - dragStartY > 0) setDragCurrentY(clientY - dragStartY); };
        const onDragEnd = () => { if (dragCurrentY > 90) { setIsPhoneDrawerOpen(false); setActivePhoneContactId(null); setSelectedProfileNpc(null); setIsMyProfileOpen(false); setGiftModalNpc(null); } setDragStartY(null); setDragCurrentY(0); };

        const handleSendPhoneMessageWrapper = () => {
          if (!phoneInput.trim() || isPhoneSending || !activePhoneContactId) return;
          const text = phoneInput.trim(); setPhoneInput("");
          const newMsg = { id: Date.now(), sender: "user", text, time: new Date().toLocaleTimeString(), unread: false };
          setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, phoneChats: { ...(s.sheet.phoneChats||{}), [activePhoneContactId]: [...((s.sheet.phoneChats||{})[activePhoneContactId]||[]), newMsg] } } } : s));
          executeMessage(`[메신저 전송] "${text}"`);
        };

        return (
          <div onClick={() => { setIsPhoneDrawerOpen(false); setActivePhoneContactId(null); setSelectedProfileNpc(null); setIsMyProfileOpen(false); setGiftModalNpc(null); }} onMouseMove={e => onDragMove(e.clientY)} onMouseUp={onDragEnd} style={{ position: "fixed", inset: 0, zIndex: 125, display: "flex", justifyContent: "center", alignItems: "flex-end", backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
            <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "460px", height: "82vh", maxHeight: "740px", backgroundColor: activePhoneSkin.shellBg, color: activePhoneSkin.text, borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column", overflow: "hidden", border: `1.5px solid ${activePhoneSkin.border}`, borderBottom: "none", boxShadow: "0 -8px 36px rgba(0,0,0,0.38)", transform: `translateY(${dragCurrentY}px)`, transition: dragStartY === null ? "transform 0.2s ease-out" : "none", position: "relative" }}>
              <div onMouseDown={e => onDragStart(e.clientY)} onTouchStart={e => onDragStart(e.touches[0].clientY)} onTouchMove={e => onDragMove(e.touches[0].clientY)} onTouchEnd={onDragEnd} style={{ height: "48px", padding: "0 16px", borderBottom: `1px solid ${activePhoneSkin.border}`, backgroundColor: activePhoneSkin.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, cursor: "grab", userSelect: "none" }}>
                <div style={{ width: "60px" }}>{(activePhoneContactId !== null || selectedProfileNpc !== null || isMyProfileOpen) && <button type="button" onClick={() => { if (isMyProfileOpen) setIsMyProfileOpen(false); else if (selectedProfileNpc) setSelectedProfileNpc(null); else setActivePhoneContactId(null); }} style={{ background: "none", border: "none", color: activePhoneSkin.navBtn, fontSize: "0.85rem", cursor: "pointer", fontWeight: "800" }}>〈 뒤로</button>}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}><div style={{ width: "36px", height: "4px", backgroundColor: activePhoneSkin.textMuted, borderRadius: "2px", opacity: 0.5 }} /><span style={{ fontSize: "0.82rem", fontWeight: "800", color: activePhoneSkin.text }}>{isMyProfileOpen ? "내 프로필" : selectedProfileNpc ? "프로필 상세" : activePhoneContactId !== null ? partnerName : phoneNavTab === "contacts" ? "인연" : phoneNavTab === "chats" ? "대화" : "더보기"}</span></div>
                <div style={{ width: "60px", display: "flex", justifyContent: "flex-end" }}><button type="button" onClick={() => { setIsPhoneDrawerOpen(false); setActivePhoneContactId(null); setSelectedProfileNpc(null); setIsMyProfileOpen(false); setGiftModalNpc(null); }} style={{ background: "none", border: "none", color: activePhoneSkin.navBtn, fontSize: "1.1rem", cursor: "pointer", lineHeight: 1 }}>✕</button></div>
              </div>

              {isMyProfileOpen ? (
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", backgroundColor: activePhoneSkin.shellBg }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "12px" }}>{activeSession.sheet?.job || "조사원"}</span>
                    <div onClick={() => setZoomedPortrait(activeSession.sheet?.portrait)} style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: `3px solid ${activePhoneSkin.accent}`, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", marginBottom: "14px", cursor: "zoom-in" }}><img src={activeSession.sheet?.portrait} alt="내 프로필" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                    <div style={{ fontWeight: "800", fontSize: "1.25rem", color: activePhoneSkin.text }}>{activeSession.sheet?.name || "주인공"}</div>
                    <div style={{ fontSize: "0.8rem", color: activePhoneSkin.textMuted, marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <span>{activeSession?.sheet?.statusMessage ? `"${activeSession.sheet.statusMessage}"` : "새겨진 전언이 없습니다."}</span>
                      <button type="button" onClick={() => { const currentMsg = activeSession?.sheet?.statusMessage || ""; const newMsg = window.prompt("상태 메시지를 입력하세요:", currentMsg); if (newMsg !== null) setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, statusMessage: newMsg.trim() } } : s)); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", padding: "2px" }}>✏️</button>
                    </div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: activePhoneSkin.panelAlt, borderTop: `1px solid ${activePhoneSkin.border}`, borderRadius: "24px 24px 0 0", padding: "20px 20px 40px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "10px" }}><div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>신분 / 직책</div><div style={{ fontSize: "0.85rem", color: activePhoneSkin.text, fontWeight: "700", marginTop: "3px" }}>{activeSession.sheet?.job || "미정"}</div></div>
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "10px" }}><div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>백스토리 및 성격</div><div style={{ fontSize: "0.78rem", color: activePhoneSkin.text, lineHeight: "1.6", marginTop: "3px", whiteSpace: "pre-wrap" }}>{activeSession.sheet?.background || "설정된 내용이 없습니다."}</div></div>
                    {activeSession.sheet?.secret && <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "10px" }}><div style={{ fontSize: "0.68rem", color: activePhoneSkin.heart, fontWeight: "800" }}>나의 비밀 / 사명</div><div style={{ fontSize: "0.78rem", color: activePhoneSkin.heart, lineHeight: "1.5", marginTop: "3px" }}>{activeSession.sheet.secret}</div></div>}
                    <div>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "6px" }}>소지품 가방</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{(activeSession.sheet?.items || []).map((it, idx) => (<span key={idx} style={{ padding: "4px 10px", backgroundColor: activePhoneSkin.shellBg, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "14px", fontSize: "0.72rem", color: activePhoneSkin.text }}>📦 {it.name}</span>))}</div>
                    </div>
                  </div>
                </div>
              ) : selectedProfileNpc ? (
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", backgroundColor: activePhoneSkin.shellBg }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "12px" }}>{selectedProfileNpc.title || "등장인물"}</span>
                    <div onClick={() => setZoomedPortrait(selectedProfileNpc.portrait)} style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: `3px solid ${activePhoneSkin.accent}`, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", marginBottom: "14px", cursor: "zoom-in" }}><img src={selectedProfileNpc.portrait} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                    <div style={{ fontWeight: "800", fontSize: "1.25rem", color: activePhoneSkin.text }}>{selectedProfileNpc.name}</div>
                    <div style={{ fontSize: "0.82rem", color: activePhoneSkin.textMuted, marginTop: "6px" }}>{selectedProfileNpc.statusMessage || `"${selectedProfileNpc.detail?.slice(0, 32) || '대화 가능'}"`}</div>
                  </div>
                  <div style={{ margin: "0 16px 16px", zIndex: 5, backgroundColor: activePhoneSkin.panelAlt, borderRadius: "20px", border: `1px solid ${activePhoneSkin.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-around", padding: "12px 8px" }}>
                    <button type="button" onClick={() => { setIsPhoneDrawerOpen(false); setSelectedProfileNpc(null); setIsVoiceCallActive(true); setVoiceCallNpc(selectedProfileNpc); setIsCallModalOpen(true); setInput(""); executeMessage(`${selectedProfileNpc.name}에게 전화를 건다.`); }} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}><span style={{ fontSize: "1.25rem" }}>📞</span><span style={{ fontSize: "0.72rem", fontWeight: "800" }}>전화 걸기</span></button>
                    <button type="button" onClick={() => { setActivePhoneContactId(selectedProfileNpc.id); setSelectedProfileNpc(null); }} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activePhoneSkin.text }}><span style={{ fontSize: "1.25rem" }}>💬</span><span style={{ fontSize: "0.72rem", fontWeight: "800" }}>1:1 대화</span></button>
                    <button type="button" onClick={() => setGiftModalNpc(selectedProfileNpc)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activePhoneSkin.text }}><span style={{ fontSize: "1.25rem" }}>🎁</span><span style={{ fontSize: "0.72rem", fontWeight: "800" }}>선물하기</span></button>
                    <button type="button" onClick={() => setClueModalNpc(selectedProfileNpc)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", color: activePhoneSkin.text }}><span style={{ fontSize: "1.25rem" }}>💡</span><span style={{ fontSize: "0.72rem", fontWeight: "800" }}>취향 수첩</span></button>
                  </div>
                  <div style={{ flex: 1, backgroundColor: activePhoneSkin.panelAlt, borderTop: `1px solid ${activePhoneSkin.border}`, borderRadius: "24px 24px 0 0", padding: "18px 20px 40px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}><span style={{ fontSize: "0.72rem", color: activePhoneSkin.heart, fontWeight: "800" }}>♥ 정서적 유대감</span><span style={{ fontSize: "0.76rem", color: activePhoneSkin.heart, fontWeight: "800" }}>{selectedProfileNpc.affection ?? 10} / 100</span></div>
                      <div style={{ width: "100%", height: "6px", backgroundColor: activePhoneSkin.shellBg, borderRadius: "3px", overflow: "hidden" }}><div style={{ width: `${Math.min(100, selectedProfileNpc.affection ?? 10)}%`, height: "100%", backgroundColor: activePhoneSkin.heart }} /></div>
                    </div>
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "12px" }}><div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>외모 및 특징 메모</div><div style={{ fontSize: "0.78rem", color: activePhoneSkin.text, lineHeight: "1.5", marginTop: "3px", whiteSpace: "pre-wrap" }}>{selectedProfileNpc.detail || "기록된 특징이 없습니다."}</div></div>
                    <div style={{ borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "12px" }}>
                      <div style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, fontWeight: "700", marginBottom: "6px" }}>발견된 취향 & 관심사</div>
                      {(() => {
                        const npcClues = (activeSession.sheet?.clues || []).filter(c => { const n = (c.name || "").trim(); if (n.length < 2 || /(?:있는|없는|하는|되는|같은)$/.test(n)) return false; return c.name.includes(selectedProfileNpc.name) || c.npcName === selectedProfileNpc.name || (activeSession.sheet?.npcs || []).length <= 1; });
                        if (npcClues.length === 0) return <div style={{ fontSize: "0.74rem", color: activePhoneSkin.textMuted }}>취향을 파악해 보세요.</div>;
                        return <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>{npcClues.map((clue, idx) => (<div key={idx} style={{ fontSize: "0.74rem", borderLeft: `2px solid ${activePhoneSkin.accent}`, paddingLeft: "8px" }}><strong style={{ color: activePhoneSkin.accent }}>{clue.name}</strong><div style={{ color: activePhoneSkin.textMuted, fontSize: "0.68rem" }}>{clue.desc}</div></div>))}</div>;
                      })()}
                    </div>
                    <div><div style={{ fontSize: "0.68rem", color: activePhoneSkin.heart, fontWeight: "800" }}>🔒 은밀한 진실 / 비밀</div><div style={{ fontSize: "0.76rem", color: selectedProfileNpc.secretRevealed ? activePhoneSkin.heart : activePhoneSkin.textMuted, marginTop: "3px" }}>{selectedProfileNpc.secretRevealed ? (selectedProfileNpc.secret || "비밀이 없습니다.") : "서사 진행을 통해 해금할 수 있습니다."}</div></div>
                  </div>
                </div>
              ) : activePhoneContactId !== null ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: activePhoneSkin.chatBg }}>
                  <div ref={phoneChatContainerRef} style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {currentMsgs.length === 0 ? <div style={{ textAlign: "center", color: activePhoneSkin.textMuted, fontSize: "0.78rem", margin: "auto" }}>대화 기록이 없습니다.<br />아래 인풋창에서 메시지를 건네보세요!</div> : currentMsgs.map((m, idx) => {
                      const isUser = m.sender === "user";
                      return (
                        <div key={idx} style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "80%", display: "flex", flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-end", gap: "6px" }}>
                          {!isUser && <div onClick={() => setSelectedProfileNpc(currentContact)} style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginBottom: "2px", border: `1px solid ${activePhoneSkin.border}`, cursor: "pointer" }}><img src={currentContact?.portrait} alt="상대" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
                          
                          <div style={{ backgroundColor: isUser ? activePhoneSkin.userBubbleBg : activePhoneSkin.npcBubbleBg, color: isUser ? activePhoneSkin.userBubbleText : activePhoneSkin.npcBubbleText, border: isUser ? "none" : `1px solid ${activePhoneSkin.npcBubbleBorder}`, padding: "9px 13px", borderRadius: isUser ? "14px 2px 14px 14px" : "2px 14px 14px 14px", fontSize: "0.84rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            
                            {/* 📷 NPC가 보낸 사진 렌더링 (접기/펼치기 토글 탑재) */}
                            {m.photo && (
                              <div style={{ marginBottom: "8px" }}>
                                <div style={{ 
                                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 4px 5px 4px",
                                  borderBottom: collapsedPhotos[m.id || idx] ? "none" : `1px dashed ${activePhoneSkin.border}`,
                                  marginBottom: collapsedPhotos[m.id || idx] ? "0" : "6px"
                                }}>
                                  <span style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted, display: "flex", alignItems: "center", gap: "4px" }}>
                                    📷 <span>사진 첨부</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const targetKey = m.id || idx;
                                      setCollapsedPhotos(prev => ({ ...prev, [targetKey]: !prev[targetKey] }));
                                    }}
                                    style={{
                                      background: "rgba(0, 0, 0, 0.08)", border: `1px solid ${activePhoneSkin.border}`, borderRadius: "10px",
                                      color: activePhoneSkin.accent || activePhoneSkin.text, fontSize: "0.65rem", cursor: "pointer",
                                      padding: "2px 8px", fontWeight: "700", lineHeight: 1.3
                                    }}
                                  >
                                    {collapsedPhotos[m.id || idx] ? "▼ 보기" : "▲ 접기"}
                                  </button>
                                </div>
            
                                {!collapsedPhotos[m.id || idx] && (
                                  <div onClick={() => setZoomedPortrait(m.photo)} style={{ borderRadius: "10px", overflow: "hidden", cursor: "zoom-in", border: `1px solid ${activePhoneSkin.border}`, position: "relative", backgroundColor: "rgba(0,0,0,0.05)" }} title="클릭하여 크게 보기">
                                    <img src={m.photo} alt="전송된 사진" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }} />
                                  </div>
                                )}
                              </div>
                            )}
                            {m.text}
                          </div>
                      
                          <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: "2px", flexShrink: 0, marginBottom: "2px" }}><span style={{ fontSize: "0.62rem", color: activePhoneSkin.textMuted }}>{m.time || ""}</span></div>
                        </div>
                      );
                    })}
                  </div>
                  {phoneSuggestions.length > 0 && (
                    <div style={{ flexShrink: 0, display: "flex", gap: "6px", overflowX: "auto", padding: "6px 12px", backgroundColor: activePhoneSkin.headerBg, borderTop: `1px solid ${activePhoneSkin.border}`, whiteSpace: "nowrap" }}>
                      {phoneSuggestions.map((sugg, sIdx) => <button key={sIdx} type="button" onClick={() => setPhoneInput(sugg)} style={{ padding: "4px 10px", backgroundColor: activePhoneSkin.panelAlt, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "14px", color: activePhoneSkin.text, fontSize: "0.72rem", cursor: "pointer" }}>{sugg}</button>)}
                    </div>
                  )}
                  <div style={{ flexShrink: 0, padding: "10px 12px", backgroundColor: activePhoneSkin.headerBg, borderTop: `1px solid ${activePhoneSkin.border}`, display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="text" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSendPhoneMessageWrapper(); }} placeholder={`${partnerName}에게 전할 말...`} style={{ flex: 1, padding: "10px 14px", backgroundColor: activePhoneSkin.inputBg, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "20px", color: activePhoneSkin.inputText, fontSize: "0.84rem", outline: "none" }} />
                    <button type="button" onClick={handleSendPhoneMessageWrapper} disabled={isPhoneSending || !phoneInput.trim()} style={{ padding: "0 18px", height: "38px", backgroundColor: activePhoneSkin.accent, color: activePhoneSkin.accentText, border: "none", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer", flexShrink: 0 }}>전송</button>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {phoneNavTab === "contacts" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                      <div style={{ padding: "4px 16px 8px 16px", fontSize: "0.72rem", color: activePhoneSkin.textMuted, fontWeight: "700" }}>내 프로필</div>
                      <div onClick={() => setIsMyProfileOpen(true)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: `1px solid ${activePhoneSkin.border}`, marginBottom: "8px", cursor: "pointer" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${activePhoneSkin.border}`, flexShrink: 0 }}><img src={activeSession.sheet?.portrait} alt="나" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                        <div style={{ flex: 1 }}><div style={{ fontWeight: "800", fontSize: "0.9rem", color: activePhoneSkin.text }}>{activeSession.sheet?.name || "주인공"}</div><div style={{ fontSize: "0.72rem", color: activePhoneSkin.textMuted }}>{activeSession.sheet?.statusMessage ? `"${activeSession.sheet.statusMessage}"` : (activeSession.sheet?.job || "상태 메시지를 설정하세요.")}</div></div><span style={{ fontSize: "0.8rem", color: activePhoneSkin.textMuted }}>〉</span>
                      </div>
                      {(() => {
                        const unlockedList = activeSession.sheet?.unlockedContacts || []; const phoneChats = activeSession.sheet?.phoneChats || {};
                        const metNpcs = (activeSession.sheet?.npcs || []).filter(npc => npc.hasContact || npc.unlocked || unlockedList.includes(npc.name) || unlockedList.some(u => npc.name?.includes(u)) || (phoneChats[npc.id] || []).length > 0 || activeSession.ruleMode === "dating_msg");
                        return (
                          <>
                            <div style={{ padding: "4px 16px 6px", fontSize: "0.72rem", color: activePhoneSkin.textMuted, fontWeight: "bold" }}>교류 중인 인물 ({metNpcs.length})</div>
                            {metNpcs.length === 0 && <div style={{ padding: "36px 16px", textAlign: "center", color: activePhoneSkin.textMuted, fontSize: "0.78rem", lineHeight: 1.6 }}>📭 등록된 연락처가 없습니다.</div>}
                            {metNpcs.map(npc => {
                              const aff = Number(npc.affection ?? 0); const fillPercent = Math.max(0, Math.min(100, aff));
                              return (
                                <div key={npc.id} onClick={() => setSelectedProfileNpc(npc)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", cursor: "pointer", borderBottom: `1px solid ${activePhoneSkin.border}` }}>
                                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, backgroundColor: "#e2e8f0" }}><img src={npc.portrait} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                                      <span style={{ fontWeight: "800", fontSize: "0.85rem", color: activePhoneSkin.text }}>{npc.name}</span>
                                      <span style={{ fontSize: "0.72rem", fontWeight: "800", color: aff < 0 ? "#64748b" : activePhoneSkin.heart }}>{aff}</span>
                                    </div>
                                    <div style={{ fontSize: "0.73rem", color: activePhoneSkin.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{npc.statusMessage ? `"${npc.statusMessage}"` : (npc.personality || npc.role || "연락 가능")}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        );
                      })()}
                    </div>
                  )}
                  {phoneNavTab === "chats" && (() => {
                    const activeChatNpcs = (activeSession?.sheet?.npcs || []).filter(npc => ((activeSession?.sheet?.phoneChats || {})[npc.id] || []).length > 0);
                    return (
                      <div style={{ flex: 1, overflowY: "auto" }}>
                        <div style={{ padding: "10px 16px 6px", fontSize: "0.72rem", color: activePhoneSkin.textMuted }}>{activeChatNpcs.length > 0 ? "주고받은 서신 목록" : "진행 중인 대화가 없습니다."}</div>
                        {activeChatNpcs.length === 0 ? <div style={{ textAlign: "center", padding: "60px 20px", color: activePhoneSkin.textMuted, fontSize: "0.82rem" }}><div style={{ fontSize: "2rem", marginBottom: "10px" }}>✉️</div>아직 나누고 있는 서신이 없습니다.</div> : activeChatNpcs.map(npc => {
                          const chats = (activeSession.sheet?.phoneChats || {})[npc.id] || []; const lastMsg = chats[chats.length - 1]; const unread = chats.filter(m => m.unread).length;
                          return (
                            <div key={npc.id} onClick={() => { setActivePhoneContactId(npc.id); setSessions(prev => prev.map(s => s.id !== activeSessionId ? s : { ...s, sheet: { ...s.sheet, phoneChats: { ...s.sheet.phoneChats, [npc.id]: chats.map(m => ({ ...m, unread: false })) } } })); }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${activePhoneSkin.border}` }}>
                              <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}><img src={npc.portrait} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}><span style={{ fontWeight: "800", fontSize: "0.85rem", color: activePhoneSkin.text }}>{npc.name}</span>{lastMsg?.timestamp && <span style={{ fontSize: "0.68rem", color: activePhoneSkin.textMuted }}>{lastMsg.timestamp}</span>}</div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: "0.74rem", color: activePhoneSkin.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastMsg?.text || "새 메시지가 도착했습니다."}</div>{unread > 0 && <span style={{ backgroundColor: activePhoneSkin.heart, color: "#fff", fontSize: "0.65rem", padding: "1px 6px", borderRadius: "10px", fontWeight: "bold" }}>{unread}</span>}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                  {phoneNavTab === "settings" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}><span style={{ fontSize: "0.82rem", fontWeight: "800", color: activePhoneSkin.text }}>🎨 메신저 테마 스킨</span><span style={{ fontSize: "0.74rem", color: activePhoneSkin.accent, fontWeight: "800" }}>{activePhoneSkin.name}</span></div><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>{Object.entries(PHONE_SKINS).map(([k, sk]) => (<button key={k} type="button" onClick={() => handleSelectPhoneTheme(k)} style={{ padding: "10px 4px", borderRadius: "10px", border: `1.5px solid ${phoneTheme === k ? activePhoneSkin.accent : activePhoneSkin.border}`, backgroundColor: phoneTheme === k ? activePhoneSkin.panelAlt : "transparent", color: activePhoneSkin.text, fontSize: "0.74rem", fontWeight: phoneTheme === k ? "800" : "500", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}><span style={{ fontSize: "1.1rem" }}>{sk.icon}</span><span>{sk.name}</span></button>))}</div></div>
                      <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", marginBottom: "6px" }}><span>📳 스마트폰 알림 진동</span><span style={{ fontSize: "0.75rem", color: activePhoneSkin.accent }}>{vibrationLevel === "off" ? "🔇 끄기" : vibrationLevel === "light" ? "📳 부드럽게" : vibrationLevel === "medium" ? "📳 보통" : "📳 강하게"}</span></div><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginBottom: "6px" }}>{[{ k: "off", l: "끄기" }, { k: "light", l: "부드럽게" }, { k: "medium", l: "보통" }, { k: "strong", l: "강하게" }].map(opt => (<button key={opt.k} type="button" onClick={() => handleSaveVibration(opt.k)} style={{ padding: "6px 0", borderRadius: "6px", border: `1.5px solid ${vibrationLevel === opt.k ? activePhoneSkin.accent : activePhoneSkin.border}`, backgroundColor: vibrationLevel === opt.k ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.72rem", cursor: "pointer", fontWeight: vibrationLevel === opt.k ? "700" : "400" }}>{opt.l}</button>))}</div><button type="button" onClick={() => triggerVibration(vibrationLevel)} style={{ width: "100%", padding: "6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer", fontWeight: "600" }}>📳 진동 테스트</button></div>
                    </div>
                  )}
                  <div style={{ height: "56px", borderTop: `1px solid ${activePhoneSkin.border}`, backgroundColor: activePhoneSkin.headerBg, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 10px", flexShrink: 0 }}>
                    {[ { id: "contacts", icon: "👤", label: "인연" }, { id: "chats", icon: "💬", label: "대화" }, { id: "settings", icon: "⚙️", label: "더보기" } ].map(tab => (
                      <button key={tab.id} type="button" onClick={() => setPhoneNavTab(tab.id)} style={{ background: phoneNavTab === tab.id ? activePhoneSkin.panelAlt : "transparent", border: `1px solid ${phoneNavTab === tab.id ? activePhoneSkin.border : "transparent"}`, borderRadius: "14px", padding: "6px 20px", color: phoneNavTab === tab.id ? activePhoneSkin.accent : activePhoneSkin.textMuted, opacity: phoneNavTab === tab.id ? 1 : 0.55, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", fontWeight: phoneNavTab === tab.id ? "800" : "500" }}>
                        <span style={{ fontSize: "1.1rem" }}>{tab.icon}</span><span style={{ fontSize: "0.68rem" }}>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🧩 [Block 6] 인게임 전용 오버레이 모달들 모음 */}
      {/* ===================================================================== */}
      
      {/* 1. 테이블탑 핸드아웃 모달 (인세인) */}
      {activeSession?.ruleMode === "insane" && isTabletopOpen && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "75px", backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 40, padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
            <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>🃏 테이블탑 핸드아웃 & 광기 현황</span>
            <button onClick={() => setIsTabletopOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.3rem", cursor: "pointer" }}>✕</button>
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: "800", color: theme.accent, marginBottom: "10px" }}>📜 시나리오 핸드아웃</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
              {(activeSession.sheet.handouts || []).map((card, idx) => {
                const isPcCard = card.id === "pc_base" || card.title.includes(activeSession.sheet?.name || "주인공");
                const canShowSecret = card.revealed || isPcCard;
                const isShowingSecret = canShowSecret && card.isFlipped;
                if (!(card.discovered ?? (isPcCard || idx < 3))) {
                  return (
                    <div key={card.id || idx} style={{ width: "170px", minHeight: "220px", borderRadius: "12px", border: `1.5px dashed ${theme.border}`, backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: theme.textMuted }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>🔒</div>
                      <div style={{ fontWeight: "800", fontSize: "0.82rem" }}>미발견 구역</div>
                    </div>
                  );
                }
                return (
                  <div key={card.id} onClick={() => toggleHandoutReveal(card.id)} className="glass-card" style={{ width: "170px", minHeight: "220px", borderRadius: "12px", border: `1.5px solid ${isShowingSecret ? theme.danger : card.revealed ? theme.success : theme.border}`, padding: "14px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: isShowingSecret ? theme.danger : card.revealed ? theme.success : theme.accent, fontWeight: "800" }}>{isShowingSecret ? "💀 비밀 열람 중" : card.revealed ? "🔓 조사 완료" : "🔒 비공개 핸드아웃"}</div>
                      <div style={{ fontWeight: "800", fontSize: "0.88rem", margin: "6px 0", color: theme.text }}>{card.title}</div>
                      <div style={{ fontSize: "0.74rem", color: isShowingSecret ? theme.danger : theme.textMuted, lineHeight: "1.4", whiteSpace: "pre-wrap" }}>{isShowingSecret ? card.secret : card.overview}</div>
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
                  <div><div style={{ fontSize: "0.68rem", color: card.revealed ? theme.danger : theme.warning, fontWeight: "800" }}>{card.revealed ? "🩸 발현된 광기" : "🔒 미발현 광기"}</div><div style={{ fontWeight: "800", fontSize: "0.88rem", margin: "6px 0" }}>{card.name}</div><div style={{ fontSize: "0.74rem", color: theme.textMuted }}>{card.desc}</div></div>
                  {!card.revealed && <button onClick={() => manifestMadnessCard(card.id, activeSessionId)} style={{ width: "100%", padding: "6px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "800", cursor: "pointer" }}>발현하기 ➔</button>}
                </div>
              ))}
              <div className="glass-card" style={{ width: "170px", minHeight: "220px", borderRadius: "12px", border: `1.5px dashed ${theme.danger}`, padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(214, 56, 87, 0.08)", gap: "6px" }}>
                <span style={{ fontSize: "1.8rem" }}>🎴</span><span style={{ fontWeight: "800", fontSize: "0.82rem", color: theme.danger }}>미공개 광기 덱</span><span style={{ fontSize: "0.68rem", color: theme.textMuted }}>남은: {activeSession.sheet.madnessDeck?.length || 0}장</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", marginTop: "6px" }}>
                  <button onClick={() => drawMadnessCard(activeSessionId, false)} style={{ padding: "5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", fontSize: "0.68rem", cursor: "pointer" }}>+ 1장 뽑기</button>
                  <button onClick={() => triggerMadnessDirectly(activeSessionId)} style={{ padding: "5px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.68rem", fontWeight: "700", cursor: "pointer" }}>💥 즉시 발현</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 조사 판정 전용 모달 */}
      {investigationModal && (
        <div onClick={() => setInvestigationModal(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 155, padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "20px", borderRadius: "18px", color: theme.text, display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}><span style={{ fontWeight: "800" }}>🔍 인세인 조사 선언</span><button onClick={() => setInvestigationModal(null)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button></div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.accent, display: "block", marginBottom: "6px" }}>1. 조사 대상 선택:</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(activeSession?.sheet?.handouts || []).filter(h => !h.revealed && !h.id?.toString().includes("pc_base")).map((h, idx) => (
                  <button key={idx} type="button" onClick={() => setInvestigationModal({ step: "selectSkill", targetType: "secret", targetObj: h })} style={{ padding: "8px 12px", textAlign: "left", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.78rem", cursor: "pointer" }}>📜 [단서] <strong>{h.title}</strong></button>
                ))}
                {(activeSession?.sheet?.npcs || []).map((npc, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "4px", backgroundColor: theme.panelAlt, padding: "6px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: "700", alignSelf: "center", padding: "0 6px", minWidth: "60px" }}>{npc.name}</span>
                    <button type="button" onClick={() => setInvestigationModal({ step: "selectSkill", targetType: "secret", targetObj: npc })} style={{ flex: 1, padding: "5px", backgroundColor: theme.panel, border: `1px solid ${theme.danger}`, borderRadius: "6px", color: theme.danger, fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}>비밀 파헤치기</button>
                    <button type="button" onClick={() => setInvestigationModal({ step: "selectSkill", targetType: "location", targetObj: npc })} style={{ flex: 1, padding: "5px", backgroundColor: theme.panel, border: `1px solid ${theme.warning}`, borderRadius: "6px", color: theme.warning, fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}>거처 확보</button>
                  </div>
                ))}
              </div>
            </div>
            {investigationModal.step === "selectSkill" && (
              <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "12px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.warning, display: "block", marginBottom: "6px" }}>2. 판정에 사용할 특기 선택:</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(activeSession?.sheet?.insaneSkills || []).map((sk, sIdx) => (
                    <button key={sIdx} type="button" onClick={() => handleExecuteInvestigation(investigationModal.targetType, investigationModal.targetObj, sk)} style={{ padding: "6px 12px", backgroundColor: theme.panelAlt, border: `1.5px solid ${theme.warning}`, borderRadius: "14px", color: theme.text, fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}>⚔️ {sk} (목표 5)</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. 감정 판정 모달 */}
      {emotionModal && (() => {
        const npcList = (activeSession?.sheet?.npcs && activeSession.sheet.npcs.length > 0) ? activeSession.sheet.npcs : (activeSession?.sheet?.kpcList || []);
        const selectedIdx = emotionModal.selectedTargetIdx ?? 0; const selectedNpc = npcList[selectedIdx] || npcList[0];
        return (
          <div onClick={() => setEmotionModal(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 155, padding: "20px" }}>
            <div onClick={e => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: "340px", padding: "20px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}><span style={{ fontWeight: "800" }}>💬 감정 판정 (1D6 ➔ {emotionModal.roll}번)</span><button type="button" onClick={() => setEmotionModal(null)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer" }}>✕</button></div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: theme.textMuted, marginBottom: "6px", fontWeight: "700" }}>🎯 감정을 부여할 대상:</label>
                <select value={selectedIdx} onChange={(e) => setEmotionModal(prev => ({ ...prev, selectedTargetIdx: Number(e.target.value) }))} style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem", fontWeight: "600" }}>
                  {npcList.map((npc, idx) => (<option key={npc.id || idx} value={idx}>{npc.name ? `${npc.name} (${npc.job || "인물"})` : `인물 ${idx + 1}`}</option>))}
                </select>
              </div>
              <div style={{ fontSize: "0.78rem", color: theme.textMuted, marginBottom: "6px" }}>부여할 감정의 극성을 선택해 주십시오:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button type="button" onClick={() => handleSelectEmotion(selectedNpc, emotionModal.pair.pos)} style={{ padding: "10px", backgroundColor: theme.panelAlt, border: `1.5px solid ${theme.success}`, borderRadius: "6px", color: theme.text, fontWeight: "bold", cursor: "pointer" }}>{emotionModal.pair.pos}</button>
                <button type="button" onClick={() => handleSelectEmotion(selectedNpc, emotionModal.pair.neg)} style={{ padding: "10px", backgroundColor: theme.panelAlt, border: `1.5px solid ${theme.danger}`, borderRadius: "6px", color: theme.text, fontWeight: "bold", cursor: "pointer" }}>{emotionModal.pair.neg}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. 긴급 회복 / 게임 오버 체력 모달 */}
      {reviveModalOpen && usableHealItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10001, backgroundColor: "rgba(0, 0, 0, 0.82)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
          <div style={{ backgroundColor: "rgba(20, 24, 33, 0.98)", border: `2px solid ${theme.danger || "#ef4444"}`, borderRadius: "16px", padding: "24px 20px", width: "320px", textAlign: "center", color: "#fff", boxShadow: "0 12px 40px rgba(239, 68, 68, 0.35)" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>🚨</div>
            <div style={{ fontWeight: "800", fontSize: "1.05rem", color: theme.danger || "#ef4444", marginBottom: "8px" }}>치명상! 의식을 잃어갑니다</div>
            <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 18px 0" }}>보유 중인 <strong>[{usableHealItem.name}]</strong>을(를) 사용하시겠습니까?</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={handleDeclineRevive} style={{ flex: 1, padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.06)", border: `1px solid ${theme.border}`, borderRadius: "8px", color: "#94a3b8", cursor: "pointer" }}>포기하기</button>
              <button type="button" onClick={handleUseReviveItem} style={{ flex: 1.4, padding: "10px", backgroundColor: theme.accent || "#6366f1", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "800", cursor: "pointer" }}>💊 복용</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 무기 재굴림 인터럽트 모달 */}
      {weaponRerollModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div className="glass-card" style={{ maxWidth: "380px", width: "100%", backgroundColor: theme.panel || "#1e1e24", border: `1px solid ${weaponRerollModal.type === "weapon" ? (theme.danger || "#ef4444") : (theme.warning || "#eab308")}`, borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "12px", color: weaponRerollModal.type === "weapon" ? (theme.danger || "#ef4444") : (theme.warning || "#eab308") }}>{weaponRerollModal.title}</h3>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.5", color: theme.text || "#fff", whiteSpace: "pre-wrap", marginBottom: "20px" }}>{weaponRerollModal.desc}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={weaponRerollModal.onConfirm} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", backgroundColor: weaponRerollModal.type === "weapon" ? (theme.danger || "#ef4444") : (theme.warning || "#eab308"), color: "#fff", fontWeight: "800", cursor: "pointer" }}>소모하고 재굴림</button>
              <button type="button" onClick={weaponRerollModal.onCancel} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: `1px solid ${theme.border || "#444"}`, backgroundColor: theme.panelAlt || "#2a2a32", color: theme.textMuted || "#aaa", fontWeight: "700", cursor: "pointer" }}>넘어가기</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. 사건 기억 수첩 */}
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
                  <div key={idx} style={{ padding: "10px 12px", backgroundColor: "rgba(15, 23, 42, 0.6)", borderRadius: "8px", borderLeft: "3px solid #38bdf8", fontSize: "0.82rem", color: "#e2e8f0", lineHeight: "1.4" }}>📌 {evt}</div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. CG 앨범 갤러리 */}
      {showCgAlbumModal && (
        <div onClick={() => setShowCgAlbumModal(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(5px)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#0f172a", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "18px", width: "100%", maxWidth: "520px", maxHeight: "85vh", display: "flex", flexDirection: "column", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: "12px" }}>
              <div style={{ fontWeight: "800", fontSize: "1.05rem", color: "#f8fafc" }}>🖼️ 이벤트 CG 앨범 ({activeSession?.sheet?.unlockedCgs?.length || 0})</div>
              <button type="button" onClick={() => setShowCgAlbumModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.3rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))", gap: "12px" }}>
              {(!activeSession?.sheet?.unlockedCgs || activeSession.sheet.unlockedCgs.length === 0) ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#64748b", padding: "40px 0", fontSize: "0.85rem", lineHeight: 1.6 }}>해금된 이벤트 일러스트가 없습니다.</div>
              ) : (
                activeSession.sheet.unlockedCgs.map((cg, idx) => (
                  <div key={idx} onClick={() => setZoomedCardUrl(cg)} title="크게 보기" style={{ cursor: "zoom-in", backgroundColor: "rgba(30, 41, 59, 0.7)", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.15)", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "100px", backgroundColor: "#1e293b", overflow: "hidden" }}>
                      {(cg.imageUrl || cg.url) && <img src={cg.imageUrl || cg.url} alt={cg.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ padding: "8px 10px", backgroundColor: "#1e293b" }}><div style={{ fontSize: "0.76rem", fontWeight: "bold", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cg.title}</div></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. 선물하기 모달 */}
      {giftModalNpc && (
        <div onClick={() => setGiftModalNpc(null)} style={{ position: "fixed", inset: 0, zIndex: 99999, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "360px", backgroundColor: activePhoneSkin.panelAlt, border: `1.5px solid ${activePhoneSkin.accent}`, borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 16px 36px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "8px" }}>
              <div><span style={{ fontWeight: "800", fontSize: "0.95rem", color: activePhoneSkin.text }}>🎁 선물 전달</span><div style={{ fontSize: "0.72rem", color: activePhoneSkin.textMuted }}>전달할 상대와 소지품을 선택하세요</div></div>
              <button type="button" onClick={() => setGiftModalNpc(null)} style={{ background: "none", border: "none", color: activePhoneSkin.textMuted, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            {(activeSession?.sheet?.npcs || []).length > 1 && (
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                {(activeSession?.sheet?.npcs || []).map((npc) => {
                  const isSel = giftModalNpc.id === npc.id || giftModalNpc.name === npc.name;
                  return <button key={npc.id} type="button" onClick={() => setGiftModalNpc(npc)} style={{ padding: "4px 10px", borderRadius: "14px", border: `1.5px solid ${isSel ? activePhoneSkin.accent : activePhoneSkin.border}`, backgroundColor: isSel ? activePhoneSkin.accent : "transparent", color: isSel ? activePhoneSkin.accentText : activePhoneSkin.text, fontSize: "0.74rem", fontWeight: isSel ? "800" : "500", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{npc.name}</button>;
                })}
              </div>
            )}
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "38vh" }}>
              {(!activeSession?.sheet?.items || activeSession.sheet.items.length === 0) ? (
                <div style={{ textAlign: "center", padding: "24px 0", fontSize: "0.78rem", color: activePhoneSkin.textMuted }}>선물함에 소지품이 없습니다.</div>
              ) : (
                activeSession.sheet.items.map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", backgroundColor: activePhoneSkin.shellBg, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "12px" }}>
                    <div style={{ flex: 1, paddingRight: "8px" }}><div style={{ fontWeight: "800", fontSize: "0.85rem", color: activePhoneSkin.text }}>📦 {it.name}</div>{it.desc && <div style={{ fontSize: "0.7rem", color: activePhoneSkin.textMuted }}>{it.desc}</div>}</div>
                    <button type="button" onClick={() => { const n = giftModalNpc.name; setGiftModalNpc(null); setSelectedProfileNpc(null); setIsPhoneDrawerOpen(false); executeMessage(`[${it.name} 선물하기] 품에서 [${it.name}]을(를) 꺼내어 ${n}에게 건넨다.`); }} style={{ padding: "7px 14px", backgroundColor: activePhoneSkin.accent, color: activePhoneSkin.accentText, border: "none", borderRadius: "16px", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer", flexShrink: 0 }}>전달</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. 취향 수첩 모달 */}
      {clueModalNpc && (() => {
        const allNpcs = activeSession?.sheet?.npcs || [];
        return (
          <div onClick={() => setClueModalNpc(null)} style={{ position: "fixed", inset: 0, zIndex: 99999, backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "360px", backgroundColor: activePhoneSkin.panelAlt, border: `1.5px solid ${activePhoneSkin.accent}`, borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 16px 36px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${activePhoneSkin.border}`, paddingBottom: "8px" }}>
                <div><span style={{ fontWeight: "800", fontSize: "0.95rem", color: activePhoneSkin.text }}>💡 취향 수첩</span><div style={{ fontSize: "0.72rem", color: activePhoneSkin.textMuted }}>서사 속에서 수집된 인물별 관심사</div></div>
                <button type="button" onClick={() => setClueModalNpc(null)} style={{ background: "none", border: "none", color: activePhoneSkin.textMuted, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
              </div>
              {allNpcs.length > 1 && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                  {allNpcs.map((npc) => {
                    const isSel = clueModalNpc.id === npc.id || clueModalNpc.name === npc.name;
                    return <button key={npc.id} type="button" onClick={() => setClueModalNpc(npc)} style={{ padding: "4px 10px", borderRadius: "14px", border: `1.5px solid ${isSel ? activePhoneSkin.accent : activePhoneSkin.border}`, backgroundColor: isSel ? activePhoneSkin.accent : "transparent", color: isSel ? activePhoneSkin.accentText : activePhoneSkin.text, fontSize: "0.74rem", fontWeight: isSel ? "800" : "500", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{npc.name}</button>;
                  })}
                </div>
              )}
              <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "38vh" }}>
                {(() => {
                  const npcClues = (activeSession?.sheet?.clues || []).filter(c => { const n = (c.name || "").trim(); if (n.length < 2 || /(?:있는|없는|하는|되는|같은)$/.test(n)) return false; return c.name.includes(clueModalNpc.name) || c.npcName === clueModalNpc.name || allNpcs.length <= 1; });
                  if (npcClues.length === 0) return <div style={{ textAlign: "center", padding: "26px 0", fontSize: "0.78rem", color: activePhoneSkin.textMuted }}>[{clueModalNpc.name}]의 파악된 취향이 아직 없습니다.</div>;
                  return npcClues.map((clue, idx) => {
                    const isDislike = clue.type === "dislike";
                    return (
                      <div key={idx} style={{ padding: "12px 14px", backgroundColor: activePhoneSkin.shellBg, border: `1px solid ${activePhoneSkin.border}`, borderRadius: "12px", borderLeft: `3.5px solid ${isDislike ? (theme.danger || "#ef4444") : activePhoneSkin.accent}`, display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: "800", fontSize: "0.86rem", color: isDislike ? (theme.danger || "#ef4444") : activePhoneSkin.accent }}>{isDislike ? "💔 기피: " : "💖 선호: "}{clue.name}</span></div>
                        <div style={{ fontSize: "0.76rem", color: activePhoneSkin.text, lineHeight: "1.5" }}>{clue.desc}</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 10. 스튜디오 제작 튜토리얼 (가이드) 모달 */}
      {isTutorialModalOpen && (
        <div onClick={() => { setIsTutorialModalOpen(false); setTutorialView("menu"); }} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={(e) => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: "520px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "20px", boxShadow: "0 20px 30px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "90vh", overflowY: "auto" }}>
            {tutorialView === "menu" ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: theme.text }}>🔰 빠른 가이드 & 튜토리얼</h3><p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: theme.textMuted }}>체험하고 싶은 규칙이나 가이드를 선택하세요.</p></div>
                  <button onClick={() => setIsTutorialModalOpen(false)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => handleStartTutorial("coc")} style={{ padding: "12px 14px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "1.5rem" }}>🐙</span><div><div style={{ fontSize: "0.85rem", fontWeight: "800", color: theme.text }}>크툴루의 부름 (CoC) 3분 체험</div><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>1D100 판정, 단서 조사, 이성(SAN) 체크를 배웁니다.</div></div>
                  </button>
                  <button onClick={() => handleStartTutorial("insane")} style={{ padding: "12px 14px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "1.5rem" }}>🎲</span><div><div style={{ fontSize: "0.85rem", fontWeight: "800", color: theme.text }}>인세인 (inSANe) 3분 체험</div><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>감정 판정, 특기 2D6 판정, 비밀 해금 및 의식을 배웁니다.</div></div>
                  </button>
                  <button onClick={() => setTutorialView("studio_guide")} style={{ padding: "12px 14px", backgroundColor: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "12px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "1.5rem" }}>🎬</span><div><div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#818cf8" }}>나만의 시나리오 만들기 (양식 직접 작성) ➔</div><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>키워드를 직접 조합하여 AI 시나리오 프롬프트를 작성합니다.</div></div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button type="button" onClick={() => setTutorialView("menu")} style={{ background: "none", border: "none", color: "#818cf8", fontSize: "0.85rem", cursor: "pointer", fontWeight: "700", padding: 0 }}>← 뒤로 가기</button>
                  <button type="button" onClick={() => setIsTutorialModalOpen(false)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ padding: "14px 16px", backgroundColor: theme.panelAlt, borderRadius: "12px", border: `1.5px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "0.86rem", fontWeight: "800", color: theme.accent }}>💡 룰 & 키워드</span><span style={{ fontSize: "0.74rem", color: theme.textMuted }}>터치하여 간편 선택</span></div>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.textMuted, marginBottom: "6px" }}>[룰 선택]</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {["자유 서사", "크툴루의 부름 (CoC 7판)", "인세인 (inSANe)", "미연시 (연애 시뮬)"].map((r) => (
                        <button key={r} type="button" onClick={() => setStudioPromptForm({ ...studioPromptForm, rule: r })} style={{ padding: "5px 11px", backgroundColor: studioPromptForm.rule === r ? theme.accent : theme.panel, color: studioPromptForm.rule === r ? "#fff" : theme.text, border: `1px solid ${studioPromptForm.rule === r ? theme.accent : theme.border}`, borderRadius: "8px", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.textMuted, marginBottom: "6px" }}>[관계성 & 감정선]</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {["#쌍방구원", "#혐관", "#애증", "#신분차", "#비밀계약", "#착각계", "#짝사랑", "#달달일상", "#후회/미련", "#배틀", "#운명적유대", "#스폰서/후원", "#사제지간", "#소꿉친구"].map((tag) => {
                        const isAdded = (studioPromptForm.keywords || "").includes(tag);
                        return <button key={tag} type="button" onClick={() => { const cur = studioPromptForm.keywords || ""; setStudioPromptForm({ ...studioPromptForm, keywords: isAdded ? cur.replace(tag, "").replace(/\s+/g, " ").trim() : (cur ? `${cur} ${tag}` : tag) }); }} style={{ padding: "5px 10px", backgroundColor: isAdded ? "rgba(99, 102, 241, 0.25)" : theme.panel, color: isAdded ? "#818cf8" : theme.text, border: `1px solid ${isAdded ? "#6366f1" : theme.border}`, borderRadius: "14px", fontSize: "0.78rem", fontWeight: isAdded ? "800" : "500", cursor: "pointer" }}>{tag}</button>;
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.textMuted, marginBottom: "6px" }}>[배경 & 사건 기믹]</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {["#오컬트", "#폐쇄병동", "#고립된저택", "#도시괴담", "#코스믹호러", "#추리/수사", "#시간루프", "#기억상실", "#시한부", "#가면무도회", "#아포칼립스", "#동양풍/사극", "#사이버펑크", "#금지된의식"].map((tag) => {
                        const isAdded = (studioPromptForm.keywords || "").includes(tag);
                        return <button key={tag} type="button" onClick={() => { const cur = studioPromptForm.keywords || ""; setStudioPromptForm({ ...studioPromptForm, keywords: isAdded ? cur.replace(tag, "").replace(/\s+/g, " ").trim() : (cur ? `${cur} ${tag}` : tag) }); }} style={{ padding: "5px 10px", backgroundColor: isAdded ? "rgba(229, 169, 60, 0.2)" : theme.panel, color: isAdded ? "#fbbf24" : theme.text, border: `1px solid ${isAdded ? "#f59e0b" : theme.border}`, borderRadius: "14px", fontSize: "0.78rem", fontWeight: isAdded ? "800" : "500", cursor: "pointer" }}>{tag}</button>;
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div><label style={{ fontSize: "0.82rem", fontWeight: "700", display: "block", marginBottom: "4px" }}>1. 룰 선택하기 (위의 칩을 누르거나 직접 입력) :</label><input type="text" value={studioPromptForm.rule} onChange={(e) => setStudioPromptForm({ ...studioPromptForm, rule: e.target.value })} placeholder="예: CoC 7판 / 인세인" style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }} /></div>
                  <div><label style={{ fontSize: "0.82rem", fontWeight: "700", display: "block", marginBottom: "4px" }}>2. 키워드 선택하기 (위의 해시태그를 누르거나 직접 추가) :</label><input type="text" value={studioPromptForm.keywords} onChange={(e) => setStudioPromptForm({ ...studioPromptForm, keywords: e.target.value })} placeholder="예: #쌍방구원 #혐관" style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }} /></div>
                  <div><label style={{ fontSize: "0.82rem", fontWeight: "700", display: "block", marginBottom: "4px" }}>3. 주인공 나이, 성별 :</label><input type="text" value={studioPromptForm.pcAgeGender} onChange={(e) => setStudioPromptForm({ ...studioPromptForm, pcAgeGender: e.target.value })} placeholder="예: 여성, 24세" style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }} /></div>
                  <div><label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.textMuted, display: "block", marginBottom: "4px" }}>4. (선택) 주인공의 성격, 소지품, 배경 :</label><input type="text" value={studioPromptForm.pcDetail} onChange={(e) => setStudioPromptForm({ ...studioPromptForm, pcDetail: e.target.value })} placeholder="예: 과묵함 / 회중시계" style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }} /></div>
                  <div><label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.textMuted, display: "block", marginBottom: "4px" }}>5. (선택) 주인공의 비밀 :</label><input type="text" value={studioPromptForm.pcSecret} onChange={(e) => setStudioPromptForm({ ...studioPromptForm, pcSecret: e.target.value })} placeholder="예: 기억상실증 환자" style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }} /></div>
                  <div><label style={{ fontSize: "0.82rem", fontWeight: "700", display: "block", marginBottom: "4px" }}>6. 등장 NPC 수(최대 10명) :</label><input type="text" value={studioPromptForm.npcCount} onChange={(e) => setStudioPromptForm({ ...studioPromptForm, npcCount: e.target.value })} placeholder="예: 1명 (파트너)" style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }} /></div>
                  <div><label style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.textMuted, display: "block", marginBottom: "4px" }}>7. (선택) 선호하는 NPC 외형 :</label><input type="text" value={studioPromptForm.npcAppearance} onChange={(e) => setStudioPromptForm({ ...studioPromptForm, npcAppearance: e.target.value })} placeholder="예: 흑발, 제복" style={{ width: "100%", padding: "9px 12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.84rem" }} /></div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button type="button" onClick={() => {
                    const assembledPrompt = `[시나리오 맞춤 생성 요청]\n1. 룰: ${studioPromptForm.rule || "자유 서사"}\n2. 분위기/키워드: ${studioPromptForm.keywords || "미지정"}\n3. 주인공: ${studioPromptForm.pcAgeGender || "여성, 20대"}\n${studioPromptForm.pcDetail ? `4. 주인공 상세: ${studioPromptForm.pcDetail}\n` : ""}${studioPromptForm.pcSecret ? `5. 주인공 비밀: ${studioPromptForm.pcSecret}\n` : ""}6. 등장 NPC: ${studioPromptForm.npcCount || "파트너 1명"}\n${studioPromptForm.npcAppearance ? `7. NPC 외형: ${studioPromptForm.npcAppearance}\n` : ""}\n위 설정에 맞춰 시놉시스, 서막, 진상을 작성해줘.`;
                    navigator.clipboard.writeText(assembledPrompt.trim()); setIsPromptCopied(true); setTimeout(() => setIsPromptCopied(false), 2000);
                  }} style={{ flex: 1, padding: "12px", backgroundColor: isPromptCopied ? "#10b981" : theme.panelAlt, color: isPromptCopied ? "#fff" : theme.text, border: `1px solid ${isPromptCopied ? "#10b981" : theme.border}`, borderRadius: "10px", fontSize: "0.84rem", fontWeight: "700", cursor: "pointer" }}>{isPromptCopied ? "✓ 복사됨!" : "📋 양식 복사"}</button>
                  <a href="https://gemini.google.com/gem/1laNhRvl9HlbyfErFfxUIs05pOrxSh_Sx?usp=sharing" target="_blank" rel="noopener noreferrer" onClick={() => { setIsTutorialModalOpen(false); setTutorialView("menu"); setShowPasteGuideBanner(true); }} style={{ flex: 1.2, padding: "12px", backgroundColor: "#6366f1", color: "#fff", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "800", fontSize: "0.84rem", display: "flex", alignItems: "center", justifyContent: "center" }}>🚀 스튜디오 이동 ➔</a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 11. 스튜디오 & 파일 텍스트 붙여넣기 모달 */}
      {showPasteModal && (
        <div onClick={() => setShowPasteModal(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "520px", backgroundColor: theme.panel, border: `1.5px solid ${theme.border}`, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 20px 35px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <div><h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800" }}>📄 시나리오 불러오기</h3><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>문서를 직접 올리거나 텍스트를 붙여넣으세요.</div></div>
              <button type="button" onClick={() => setShowPasteModal(false)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", backgroundColor: theme.panelAlt, border: `1.5px dashed ${theme.border}`, borderRadius: "10px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700", color: theme.accent }}>
              <span>📂</span><span>컴퓨터 파일 불러오기 (.txt, .pdf, .md)</span>
              <input type="file" accept=".pdf,.txt,.md" onChange={(e) => { handleFileUpload(e); setShowPasteModal(false); }} style={{ display: "none" }} />
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ flex: 1, height: "1px", backgroundColor: theme.border }} /><span style={{ fontSize: "0.7rem", color: theme.textMuted, fontWeight: "700" }}>또는 직접 붙여넣기</span><div style={{ flex: 1, height: "1px", backgroundColor: theme.border }} /></div>
            <textarea rows={8} value={pastedScenarioText} onChange={(e) => setPastedScenarioText(e.target.value)} placeholder={`스튜디오에서 복사한 시나리오를 붙여넣으세요...`} style={{ width: "100%", padding: "12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "0.8rem", lineHeight: "1.5", resize: "vertical" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => setShowPasteModal(false)} style={{ flex: 1, padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.textMuted, fontSize: "0.8rem", cursor: "pointer", fontWeight: "700" }}>닫기</button>
              <button type="button" onClick={() => { if (!pastedScenarioText.trim()) return alert("붙여넣은 내용이 없습니다."); processScenarioText(pastedScenarioText); setShowPasteModal(false); setPastedScenarioText(""); }} style={{ flex: 2, padding: "10px", backgroundColor: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.84rem", fontWeight: "800", cursor: "pointer" }}>🪄 로비에 자동 적용하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 12. 공지사항 모달 */}
      {showNoticeModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: isMobile ? "12px" : "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "560px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: "88dvh" }}>

            {/* 상단 탭 버튼 */}
            <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebar }}>
              <button
                type="button"
                onClick={() => setActiveNoticeTab("update")}
                style={{
                  flex: 1, padding: "14px", background: activeNoticeTab === "update" ? theme.panelAlt : "transparent",
                  border: "none", color: activeNoticeTab === "update" ? theme.accent : theme.textMuted,
                  fontWeight: activeNoticeTab === "update" ? "800" : "500", fontSize: "0.92rem", cursor: "pointer",
                  borderBottom: activeNoticeTab === "update" ? `2px solid ${theme.accent}` : "none"
                }}
              >
                🚀 업데이트 노트 ({APP_VERSION})
              </button>
              <button
                type="button"
                onClick={() => setActiveNoticeTab("guide")}
                style={{
                  flex: 1, padding: "14px", background: activeNoticeTab === "guide" ? theme.panelAlt : "transparent",
                  border: "none", color: activeNoticeTab === "guide" ? theme.accent : theme.textMuted,
                  fontWeight: activeNoticeTab === "guide" ? "800" : "500", fontSize: "0.92rem", cursor: "pointer",
                  borderBottom: activeNoticeTab === "guide" ? `2px solid ${theme.accent}` : "none"
                }}
              >
                📖 시작 가이드
              </button>
            </div>

            {/* 본문 영역 */}
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
                      • <strong>파일 첨부 (.txt / .pdf / .md):</strong> 로비의 [📄 파일 첨부]로 시나리오 문서를 올리면 룰 시스템, 시놉시스, 서막, KPC 명단, 조사 구역 및 단서 핸드아웃이 자동으로 파싱되어 입력란에 배치됩니다.<br/>
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
      {/* 13. 스튜디오 팝업 모달 */}
      {showStudioModal && (
        <div onClick={() => setShowStudioModal(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: "380px", backgroundColor: theme.panel, border: `1.5px solid ${theme.border}`, borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 16px 36px rgba(0, 0, 0, 0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800" }}>🎬 AI 제작 스튜디오</h3>
              <button type="button" onClick={() => setShowStudioModal(false)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="https://gemini.google.com/gem/1OLmZ5oYd-JxqL7S_zSsfMhncpvRgAv71?usp=sharing" target="_blank" rel="noopener noreferrer" onClick={() => setShowStudioModal(false)} style={{ padding: "14px 16px", backgroundColor: theme.panelAlt, border: `1.5px solid ${theme.accent}`, borderRadius: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.6rem" }}>🎨</span><div><div style={{ fontSize: "0.88rem", fontWeight: "800", color: theme.accent }}>초상화 만들기</div><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>캐릭터 프로필 일러스트 및 외형 생성</div></div>
              </a>
              <a href="https://gemini.google.com/gem/1laNhRvl9HlbyfErFfxUIs05pOrxSh_Sx?usp=sharing" target="_blank" rel="noopener noreferrer" onClick={() => setShowStudioModal(false)} style={{ padding: "14px 16px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.6rem" }}>📖</span><div><div style={{ fontSize: "0.88rem", fontWeight: "800", color: theme.text }}>시나리오 만들기</div><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>시놉시스, 서막, 진상 및 핸드아웃 자동 기획</div></div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 14. 롤백 취소 모달 */}
      {pendingRollback && (
        <div onClick={() => setPendingRollback(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 140, padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: "320px", padding: "22px 18px", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
            <span style={{ fontSize: "2rem", lineHeight: 1 }}>⎌</span>
            <div>
              <div style={{ fontWeight: "800", fontSize: "0.95rem", marginBottom: "4px" }}>마지막 대화 취소</div>
              <div style={{ fontSize: "0.75rem", color: theme.textMuted, lineHeight: "1.5" }}>마지막 대사를 취소하고 입력창에 불러올까요?<br />직전 턴의 상태로 롤백됩니다.</div>
            </div>
            <div style={{ display: "flex", gap: "8px", width: "100%", marginTop: "6px" }}>
              <button type="button" onClick={() => setPendingRollback(null)} style={{ flex: 1, padding: "10px 0", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "10px", color: theme.text, fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>닫기</button>
              <button type="button" onClick={() => {
                const { text, index, prevSheet } = pendingRollback; setInput(text);
                setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: prevSheet ? prevSheet : s.sheet, messages: s.messages.slice(0, index), suggestedActions: [], pendingCheck: null } : s));
                setPendingRollback(null);
              }} style={{ flex: 1, padding: "10px 0", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer" }}>되돌리기</button>
            </div>
          </div>
        </div>
      )}

      {/* 15. 인세인 66특기 대용 판정 팝업 모달 */}
      {showSkillMatrixModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 160, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "620px", maxHeight: "88vh", display: "flex", flexDirection: "column", padding: "16px", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <div><span style={{ fontWeight: "800", fontSize: "0.95rem" }}>⚔️ 66개 특기 대용 판정</span><span style={{ fontSize: "0.72rem", color: theme.warning, marginLeft: "8px", fontWeight: "700" }}>호기심 분야: [{activeSession?.sheet?.insaneCuriosity || "미정"}]</span></div>
              <button onClick={() => setShowSkillMatrixModal(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", padding: "10px 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", minWidth: "520px", gap: "4px" }}>
                {INSANE_MATRIX.map(col => (
                  <div key={col.category} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div style={{ textAlign: "center", fontSize: "0.74rem", fontWeight: "900", padding: "6px 0", backgroundColor: col.category === activeSession?.sheet?.insaneCuriosity ? "rgba(229, 169, 60, 0.25)" : theme.panelAlt, border: `1px solid ${col.category === activeSession?.sheet?.insaneCuriosity ? theme.warning : theme.border}`, borderRadius: "6px" }}>{col.category}</div>
                    {col.skills.map(skill => {
                      const isLearned = (activeSession?.sheet?.insaneSkills || []).includes(skill);
                      const targetNum = calculateInsaneTargetNumber(skill, activeSession?.sheet?.insaneSkills || [], activeSession?.sheet?.insaneCuriosity || "");
                      return (
                        <button key={skill} type="button" onClick={() => { setShowSkillMatrixModal(false); rollDiceDirectly(targetNum, skill); }} style={{ padding: "6px 2px", fontSize: "0.7rem", backgroundColor: isLearned ? theme.warning : theme.inputBg, color: isLearned ? "#000" : theme.text, border: `1px solid ${isLearned ? theme.warning : theme.border}`, borderRadius: "5px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                          <span style={{ fontWeight: isLearned ? "900" : "500" }}>{skill}</span><span style={{ fontSize: "0.62rem", opacity: 0.85, fontWeight: "700" }}>{targetNum}</span>
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

      {/* 16. 룰 상세 설명 가이드 모달 */}
      {ruleHelpModal && (
        <div onClick={() => setRuleHelpModal(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 160, padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "22px", borderRadius: "16px", color: theme.text, display: "flex", flexDirection: "column", gap: "12px", maxHeight: "80vh", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "1.2rem" }}>{ruleHelpModal.icon}</span><div><h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800" }}>{ruleHelpModal.name}</h3><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{ruleHelpModal.sub}</div></div></div>
              <button type="button" onClick={() => setRuleHelpModal(null)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", paddingRight: "4px" }}>
              {ruleHelpModal.points?.map((pt, idx) => (
                <div key={idx} style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                  <div style={{ fontWeight: "800", fontSize: "0.82rem", color: theme.accent, marginBottom: "4px" }}>• {pt.title}</div>
                  <div style={{ fontSize: "0.76rem", color: theme.text, lineHeight: "1.6" }}>{pt.desc}</div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setRuleHelpModal(null)} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "0.82rem", cursor: "pointer", marginTop: "4px" }}>확인</button>
          </div>
        </div>
      )}

    </div>
  );
}

 
 
