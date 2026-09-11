"use client";
import { useState, useEffect, useRef } from "react";

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

const INSANE_MATRIX = [
  { category: "폭력", skills: ["소각", "고문", "포박", "협박", "파괴", "구타", "절단", "찌르기", "사격", "전쟁", "매장"] },
  { category: "정서", skills: ["연심", "기쁨", "걱정", "부끄러움", "웃음", "인내", "놀람", "노여움", "원한", "슬픔", "친애"] },
  { category: "지각", skills: ["고통", "관능", "촉감", "냄새", "맛", "소리", "풍경", "추적", "미행", "제육감", "그늘"] },
  { category: "기술", skills: ["분해", "전자기기", "정리", "약품", "효율", "미디어", "카메라", "탈것", "기계", "함정", "병기"] },
  { category: "지식", skills: ["물리학", "수학", "화학", "생물학", "의학", "교양", "인류학", "역사", "민속학", "고고학", "천문학"] },
  { category: "괴이", skills: ["시간", "혼돈", "심해", "죽음", "영혼", "마술", "암흑", "종말", "꿈", "지저", "우주"] }
];

const INSANE_MADNESS_TABLE = [
  { roll: 1, name: "의혹 (Suspicion)", desc: "동행자의 사명과 대사를 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다." },
  { roll: 2, name: "망상 (Delusion)", desc: "현실에 존재하지 않는 환청과 그림자를 보며 그것에 집착합니다." },
  { roll: 3, name: "강박증 (Obsession)", desc: "소지품을 확인하거나 문을 잠그는 행동을 병적으로 반복합니다." },
  { roll: 4, name: "패닉 (Panic)", desc: "이성적 사고가 마비되어 위험 상황에서 무작정 몸을 숨깁니다." },
  { roll: 5, name: "폭력 충동 (Impulse)", desc: "위협을 제거하기 위해 수단 방법을 가리지 않는 공격성을 드러냅니다." },
  { roll: 6, name: "쇼크 (Shock)", desc: "정신적 붕괴로 인해 다음 씬 동안 행동 선언이 극도로 제한됩니다." }
];

const COC_MADNESS_TABLE = [
  { roll: 1, name: "기절 및 의식 상실", desc: "극심한 충격으로 눈앞이 아득해지며 바닥에 쓰러져 의식을 잃습니다." },
  { roll: 2, name: "통제 불능 비명", desc: "이성을 잃고 목이 쉴 때까지 원초적인 비명을 내지릅니다." },
  { roll: 3, name: "급성 공포증 (Phobia)", desc: "특정 사물이나 현상에 극단적인 공포를 느껴 접근을 거부합니다." },
  { roll: 4, name: "편집증 및 피해망상", desc: "주변의 모든 존재가 자신을 해치려 한다는 의심에 사로잡힙니다." },
  { roll: 5, name: "맹목적 도주 (Flee)", desc: "이유를 불문하고 반대 방향을 향해 무작정 질주합니다." },
  { roll: 6, name: "히스테리성 실성", desc: "통제할 수 없는 기괴한 웃음과 눈물을 동시에 쏟아냅니다." }
];

const INSANE_SCENE_TABLE = [
  "창밖으로 빗줄기가 거세지며 불길한 그림자가 유리창을 스칩니다.",
  "오래된 벽시계가 불규칙한 박자로 째깍거리며 방 안의 정적을 깨뜨립니다.",
  "어디선가 스며드는 눅눅하고 서늘한 바람에 촛불이 위태롭게 흔들립니다.",
  "복도 끝에서 무언가 무겁게 끌리는 소리가 들려오다 뚝 멈춥니다.",
  "익숙했던 방의 가구 배치가 왠지 낯설고 왜곡되어 보이기 시작합니다.",
  "순간적으로 전등이 깜빡이며 등 뒤에서 서늘한 기척이 스쳐 지나갑니다."
];

const ORIENT_TAGS = ["#GL", "#BL", "#HL", "#논로맨스"];
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#일상", "#오컬트"];

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 반응형 및 오버레이
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTabletopOpen, setIsTabletopOpen] = useState(false);

  // 모달 제어
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  // 테마 상태
  const [currentPalette, setCurrentPalette] = useState("cloud");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [portraitStyle, setPortraitStyle] = useState("anime");
  const [exportFormat, setExportFormat] = useState("txt");
  const [exportScope, setExportScope] = useState("all");
  const [backupFormat, setBackupFormat] = useState("json");
  const [backupTarget, setBackupTarget] = useState("all");

  const [wizardMode, setWizardMode] = useState("insane");

  // 캐릭터 폼 상태
  const [charName, setCharName] = useState("");
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

  // CoC 스탯
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

  // KPC(파트너) 상태
  const [kpcList, setKpcList] = useState([
    { id: 1, name: "아델", job: "조력자", detail: "다정하고 굳은 눈빛을 지닌 파트너.", secret: "클레어가 혼자 모든 아픔을 짊어지지 않도록 제 불안을 숨긴 채 곁을 지킨다.", portraitUrl: "", showSecret: false }
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

  // 연출 상태
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [activeMadnessAlert, setActiveMadnessAlert] = useState(null);
  const [showInsanityFlash, setShowInsanityFlash] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const activePalette = THEME_PALETTES[currentPalette] || THEME_PALETTES.cloud;
  const theme = isDarkMode ? activePalette.dark : activePalette.light;
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

  function handleSaveAnim(enabled) {
    setAnimationEnabled(enabled);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_anim", enabled.toString());
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
      if (!mobile) { setIsSidebarOpen(true); setIsSheetOpen(true); }
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

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    const systemPrompt = `당신은 최고 권위의 정통 TRPG 시나리오 라이터 겸 키퍼입니다.
선택된 룰 [${wizardMode}]과 서사 성향 [${playPreference}]에 부합하는 시나리오와 캐릭터를 설계하십시오.

[🚨 절대 수칙]
1. 모든 인물은 무조건 여성(GL)입니다. 얀데레나 유치한 소유욕을 배제하고 깊은 유대감을 부여하십시오.
2. 지문과 설정에서 'PC', 'KPC'라는 단어를 쓰지 마십시오! 실제 이름을 직접 지어 사용하십시오.
3. initialHandouts에는 인세인을 위한 4개의 완전한 카드가 포함되어야 합니다:
   - 1번: 주인공 카드 (사명 및 비밀)
   - 2번: 파트너 카드 (관계 및 숨겨진 진심/비밀)
   - 3번: 현장 사물/장소 핸드아웃
   - 4번: 결정적 사건 단서 핸드아웃

반드시 마크다운 없이 순수 JSON 포맷으로만 응답하십시오:
{
  "name": "주인공 이름 (예: 클레어)",
  "gender": "여성",
  "age": "24",
  "job": "역할/직업",
  "background": "인물의 과거 상처, 성격, 소지품 3가지 상세",
  "mission": "주인공의 공개 사명",
  "secret": "주인공의 숨겨진 개인적 비밀",
  "kpcName": "파트너 이름 (예: 아델)",
  "kpcJob": "파트너 직업",
  "kpcDetail": "파트너의 성격, 외모, 주인공과의 관계성 상세",
  "kpcSecret": "파트너가 숨기고 있는 진심이나 비밀",
  "limit": ${Math.floor(Math.random() * 2) + 3},
  "scenarioTitle": "녹비(綠碑)의 안식처",
  "publicSynopsis": "스포일러 없는 시나리오 개요",
  "openingScene": "비 내리는 작업실의 분위기와 첫 대사를 담은 풍성한 서막 지문",
  "hiddenTruth": "사건의 배후 진상 및 흑막(Keeper 기밀)",
  "initialHandouts": [
    { "title": "클레어의 사명과 비밀", "overview": "작업실 한켠에서 기록을 보수하고 있는 클레어의 현재 상태입니다.", "secret": "자신이 모든 아픔을 짊어지려다 무너질까 두려워하고 있습니다." },
    { "title": "아델의 따뜻한 시선", "overview": "굳은비 속을 뚫고 찾아온 아델이 가져온 위로와 온기입니다.", "secret": "클레어가 홀로 고통받지 않도록 제 모든 것을 바쳐 지키려 합니다." },
    { "title": "오래된 가죽 노트", "overview": "작업대 구석에 놓인 손때 묻은 낡은 기록장입니다.", "secret": "과거 두 사람이 함께했던 약속의 문구가 적혀 있습니다." },
    { "title": "책상 서랍의 다이어리", "overview": "서랍 안쪽에 숨겨진 채 묘한 이질감을 풍기는 책입니다.", "secret": "서로에게 말하지 못했던 진실의 마지막 페이지가 뜯겨져 있습니다." }
  ]
}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: systemPrompt }],
          scenarioText: "",
          playerSheet: {},
          ruleMode: wizardMode,
          playPreference
        })
      });
      const data = await response.json();
      const cleanJson = (data.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      const p = JSON.parse(cleanJson);

      const pName = p.name || "클레어";
      const kName = p.kpcName || "아델";

      setCharName(pName);
      setCharJob(p.job || "복원가");
      setCharAge(p.age || "24");
      setCharGender("여성");
      setCharBackground(p.background || "");
      setCharPortraitUrl(getPortraitUrl(`${pName}, ${p.job}`));

      if (p.mission) setCharMission(p.mission);
      if (p.secret) setCharSecret(p.secret);
      if (p.limit) setInsaneLimit(Number(p.limit));

      setKpcList([{
        id: 1,
        name: kName,
        job: p.kpcJob || "조력자",
        detail: p.kpcDetail || "",
        secret: p.kpcSecret || "",
        portraitUrl: getPortraitUrl(`${kName}, portrait`),
        showSecret: false
      }]);

      setScenarioTitle(p.scenarioTitle || "녹비의 안식처");
      setPublicSynopsis(p.publicSynopsis || "");
      setOpeningScene(p.openingScene || "");
      setHiddenTruth(p.hiddenTruth || "");
      setGeneratedHandouts(p.initialHandouts || []);

      if (wizardMode === "coc") handleRandomCocStats();
    } catch (e) {
      alert("AI 생성 실패: " + e.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAutoReplaceKpcPc = () => {
    const pName = charName.trim() || "주인공";
    const kName = kpcList[0]?.name || "파트너";
    setPublicSynopsis(publicSynopsis.replace(/\bKPC\b/gi, kName).replace(/\bPC\b/gi, pName));
    setOpeningScene(openingScene.replace(/\bKPC\b/gi, kName).replace(/\bPC\b/gi, pName));
    setHiddenTruth(hiddenTruth.replace(/\bKPC\b/gi, kName).replace(/\bPC\b/gi, pName));
    alert(`'PC' ➔ '${pName}', 'KPC' ➔ '${kName}' 치환 완료!`);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setIsPdfLoading(true);
      try {
        if (!window.pdfjsLib) {
          await new Promise((res, rej) => {
            const script = document.createElement("script"); script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
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
        setHiddenTruth(text.trim());
        setPublicSynopsis("PDF 파일 내용이 진상란에 추출되었습니다.");
      } catch (err) { alert("PDF 오류: " + err.message); } finally { setIsPdfLoading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => setHiddenTruth(ev.target.result);
      reader.readAsText(file, "UTF-8");
    }
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

  const triggerMadnessCheck = (rule, lossAmount, targetSessionId) => {
    const session = sessions.find((s) => s.id === targetSessionId);
    if (session?.sheet?.madnessStatus) return;
    setShowInsanityFlash(true);
    setTimeout(() => setShowInsanityFlash(false), 500);

    let mName = "", mDesc = "", rollNum = 1;
    if (rule === "coc") {
      rollNum = Math.floor(Math.random() * 6) + 1;
      const m = COC_MADNESS_TABLE.find(it => it.roll === rollNum) || COC_MADNESS_TABLE[0];
      mName = m.name; mDesc = m.desc;
    } else {
      rollNum = Math.floor(Math.random() * 6) + 1;
      const m = INSANE_MADNESS_TABLE.find(it => it.roll === rollNum) || INSANE_MADNESS_TABLE[0];
      mName = m.name; mDesc = m.desc;
    }

    const madnessStatusStr = `일시적 광기: ${mName}`;
    setActiveMadnessAlert({ name: mName, desc: mDesc, loss: lossAmount, rule, roll: rollNum });
    setSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, sheet: { ...s.sheet, madnessStatus: madnessStatusStr } } : s));
  };

  const adjustStat = (statName, delta) => {
    if (!activeSession) return;
    const currentVal = Number(activeSession.sheet?.[statName] ?? 10);
    const newVal = Math.max(0, currentVal + delta);
    if (statName === "san" && !activeSession.sheet?.madnessStatus) {
      if (activeSession.ruleMode === "coc" && delta <= -5) triggerMadnessCheck("coc", Math.abs(delta), activeSessionId);
      else if (activeSession.ruleMode === "insane" && delta < 0) triggerMadnessCheck("insane", Math.abs(delta), activeSessionId);
    }
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, [statName]: newVal } } : s));
  };

  const handleRollSceneTable = () => {
    if (!activeSession) return;
    playDiceSound();
    const roll = Math.floor(Math.random() * 6);
    const desc = INSANE_SCENE_TABLE[roll];
    executeMessage(`[🎲 장면표 1D6 ➔ ${roll + 1}번 결과]: "${desc}"\n(이 분위기를 무대로 다음 행동을 이어갑니다.)`);
  };

  const parseTagsSafely = (rawText, partnerName, currentRule) => {
    let cleanText = rawText || "";
    let parsedData = { 
      suggActions: [], pendingCheck: null, newSheetVars: {}, 
      revealedSecrets: [], investigationSpots: [], newHandouts: [],
      revealedHandoutTitles: [], shouldAdvanceScene: false
    };

    try {
      const checkMatch = cleanText.match(/<!--\s*CHECK:\s*({[\s\S]*?})\s*-{1,3}>/i);
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
      .replace(/```html|
