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
  { roll: 3, name: "급성 공포증 (Phobia)", desc: "특정 사물이나 기괴한 현상에 극단적인 공포를 느껴 접근을 거부합니다." },
  { roll: 4, name: "편집증 및 피해망상", desc: "주변의 모든 존재가 자신을 해치려 한다는 의심에 사로잡힙니다." },
  { roll: 5, name: "맹목적 도주 (Flee)", desc: "이유를 불문하고 반대 방향을 향해 무작정 질주합니다." },
  { roll: 6, name: "히스테리성 실성", desc: "통제할 수 없는 기괴한 웃음과 눈물을 동시에 쏟아냅니다." },
  { roll: 7, name: "신체 이상 (마비/실어증)", desc: "말을 전혀 할 수 없거나 온몸이 사시나무 떨듯 마비됩니다." },
  { roll: 8, name: "심인성 기억상실", desc: "직전 목격한 공포스러운 진실에 대한 기억이 완전히 지워집니다." },
  { roll: 9, name: "파괴 충동", desc: "주변의 사물을 닥치는 대로 부수거나 집어던집니다." },
  { roll: 10, name: "긴장증 (Catatonia)", desc: "넋이 완전히 나가 석상처럼 굳어버립니다." }
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

const INSANE_MADNESS_TABLE = [
  { roll: 1, name: "의혹 (Suspicion)", desc: "동행자의 사명과 대사를 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다." },
  { roll: 2, name: "망상 (Delusion)", desc: "현실에 존재하지 않는 환청과 그림자를 보며 그것에 집착합니다." },
  { roll: 3, name: "강박증 (Obsession)", desc: "소지품을 확인하거나 문을 잠그는 행동을 병적으로 반복합니다." },
  { roll: 4, name: "패닉 (Panic)", desc: "이성적 사고가 마비되어 위험 상황에서 무작정 몸을 숨깁니다." },
  { roll: 5, name: "폭력 충동 (Impulse)", desc: "위협을 제거하기 위해 수단 방법을 가리지 않는 공격성을 드러냅니다." },
  { roll: 6, name: "쇼크 (Shock)", desc: "정신적 붕괴로 인해 다음 씬 동안 행동 선언이 극도로 제한됩니다." }
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
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#일상", "#오컬트", "이능력"];

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🌟 [추가] 버전 관리 및 공지사항/가이드 상태
  const APP_VERSION = "v1.0.0";
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [activeNoticeTab, setActiveNoticeTab] = useState("guide"); // 'guide' 또는 'update'
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [isEditingPortrait, setIsEditingPortrait] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [ruleHelpModal, setRuleHelpModal] = useState(null); // 🌟 [추가] 룰 설명 전용 팝업 상태
  const [showLobbyPresetModal, setShowLobbyPresetModal] = useState(false);
  const [lobbyPresets, setLobbyPresets] = useState([]);

  useEffect(() => {
    try {
      const lp = localStorage.getItem("rp_hub_lobby_presets");
      if (lp) setLobbyPresets(JSON.parse(lp));
    } catch(e) {}
  }, []);

  const handleSaveLobbyPreset = () => {
    const titlePrompt = prompt("저장할 로비 세팅의 이름을 입력하세요:", scenarioTitle || `${charName}의 캠페인`);
    if (!titlePrompt) return;

    const newLobbyPreset = {
      id: Date.now(),
      presetTitle: titlePrompt,
      scenarioTitle, publicSynopsis, openingScene, hiddenTruth, playPreference, wizardMode,
      charName, charJob, charAge, charGender, charBackground, charMission, charSecret, charPortraitUrl,
      cocStats, cocSkills, insaneSkills, insaneCuriosity, insaneFear, insaneLimit,
      kpcList
    };

    const updated = [newLobbyPreset, ...lobbyPresets];
    setLobbyPresets(updated);
    localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(updated));
    alert(`'${titlePrompt}' 로비 세팅이 저장되었습니다!`);
  };

  const handleLoadLobbyPreset = (p) => {
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
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [portraitStyle, setPortraitStyle] = useState("anime");
  const [exportFormat, setExportFormat] = useState("txt");
  const [selectedExportSessionIds, setSelectedExportSessionIds] = useState([]);
  const [exportScope, setExportScope] = useState("all");
  const [backupFormat, setBackupFormat] = useState("json");
  const [backupTarget, setBackupTarget] = useState("all");

  const [wizardMode, setWizardMode] = useState("coc");

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

      if (wizardMode === "coc") handleRandomCocStats();
    } catch (e) {
      if (e.name === "AbortError") return;
      alert("AI 생성 실패: " + e.message);
    } finally {
      setIsAiGenerating(false);
      setAbortController(null);
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

// 🌟 [CoC / 인세인 / 자유 서사 통합 파서] 룰 감지 및 전 룰 완벽 자동 배분
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const processScenarioText = (rawText) => {
      const cleanVal = (str) => {
        if (!str) return "";
        return str
          .replace(/^\|\||\|\|$/g, "")
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .trim();
      };

      // ── [0. 룰 시스템 자동 감지 및 전환] ──
      let detectedMode = wizardMode;
      if (/인세인|insane/i.test(rawText)) {
        detectedMode = "insane";
        setWizardMode("insane");
      } else if (/자유\s*서사|소설\s*모드|freeform/i.test(rawText)) {
        detectedMode = "freeform";
        setWizardMode("freeform");
      } else if (/크툴루|coc/i.test(rawText)) {
        detectedMode = "coc";
        setWizardMode("coc");
      }

      // 태그 자동 추출 (있을 경우)
      const tagMatch = rawText.match(/(?:서사\s*지향\s*태그|장르\s*톤|태그)\s*[:：]\s*([^\n\r]+)/i);
      if (tagMatch) setPlayPreference(tagMatch[1].trim());

      // ── [1. 시나리오 본문 & 진상] ──
      const titleMatch = rawText.match(/(?:시나리오\s*제목|제목)\s*[:：]\s*([^\n\r]+)/i);
      if (titleMatch) setScenarioTitle(titleMatch[1].trim());

      const synMatch = rawText.match(/(?:\[공개\s*시놉시스\][^\n]*|공개\s*시놉시스\s*[:：]?)\s*([\s\S]*?)(?=\n\s*(?:\[서막\]|서막\s*[:：]|###|\n\n\[|$))/i);
      if (synMatch) setPublicSynopsis(synMatch[1].trim());

      const opMatch = rawText.match(/(?:\[서막\][^\n]*|서막\s*[:：]?)\s*([\s\S]*?)(?=\n\s*(?:\[키퍼|키퍼\s*전용|###|\n\n\[|$))/i);
      if (opMatch) setOpeningScene(opMatch[1].trim());

      const trMatch = rawText.match(/(?:\[키퍼\s*전용[^\n]*\]|키퍼\s*전용\s*(?:스포일러|진상|기밀)[^:：\n]*[:：]?|사건의\s*진상)\s*([\s\S]*?)(?=\n\s*(?:###\s*\d|\[내 프로필|\[등장인물|$))/i);
      if (trMatch) setHiddenTruth(cleanVal(trMatch[1]));

      // ── [2. 내 프로필 (PC 공통)] ──
      const pcSectionMatch = rawText.match(/(?:###\s*1\.\s*내\s*프로필|\[PC\s*프로필\])([\s\S]*?)(?=\n\s*(?:###\s*2\.|\[등장인물|\[CoC|\[인세인))/i);
      const pcText = pcSectionMatch ? pcSectionMatch[1] : rawText;

      const pcNameMatch = pcText.match(/이름\s*[:：]\s*([^\n\r]+)/i);
      if (pcNameMatch) setCharName(pcNameMatch[1].trim());

      const pcJobMatch = pcText.match(/(?:직업|역할|직업\/역할)\s*[:：]\s*([^\n\r]+)/i);
      if (pcJobMatch) setCharJob(pcJobMatch[1].trim());

      const pcBgMatch = pcText.match(/(?:백스토리(?:\s*및\s*성격)?|성격(?:\s*및\s*백스토리)?)\s*[:：]\s*([\s\S]*?)(?=\n\s*(?:-?\s*\[?내\s*캐릭터|###|\[|-?\s*사명|$))/i);
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
          const list = skillsMatch[1].split(/[,/]\s*/).map(s => s.trim()).filter(Boolean);
          if (list.length > 0) setInsaneSkills(list);
        }
      }

      // ── [4. 등장인물 (KPC 및 서브 NPC)] ──
      let parsedNpcList = [];

      // 파트너 KPC
      const kpcSection = rawText.match(/(?:\[파트너\s*KPC\]|파트너\s*KPC)([\s\S]*?)(?=\n\s*(?:\[서브\s*NPC|서브\s*NPC|###\s*3\.|\[시나리오))/i);
      if (kpcSection) {
        const kText = kpcSection[1];
        const kName = (kText.match(/이름\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "파트너";
        const kJob = (kText.match(/(?:역할|직업|역할\/직업)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "조력자";
        const kDetail = (kText.match(/(?:외모[,\s]*성격[^\n:]*|관계성?)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "";
        
        const kSecMatch = rawText.match(/(?:\[(?:파트너\s*)?KPC\s*비밀[^\]]*\]|\[이\s*인물의\s*비밀\])\s*[:：]?\s*([\s\S]*?)(?=\n\s*(?:\[서브|서브\s*NPC|###|\[|\n\n-|$))/i);
        const kSecret = kSecMatch ? cleanVal(kSecMatch[1]) : "";

        parsedNpcList.push({
          id: 1,
          name: kName.trim(),
          job: kJob.trim(),
          detail: kDetail.trim(),
          secret: kSecret,
          portraitUrl: typeof getPortraitUrl === "function" ? getPortraitUrl(kName.trim()) : "",
          showSecret: false
        });
      }

      // 서브 NPC (1~9명)
      const subNpcRegex = /(?:\(서브\s*NPC\s*(\d+)\)|\[서브\s*NPC\s*(\d+)\])([\s\S]*?)(?=\n\s*(?:\(서브\s*NPC|\[서브\s*NPC|###\s*3\.|\[시나리오|$))/gi;
      let match;
      while ((match = subNpcRegex.exec(rawText)) !== null) {
        const idx = Number(match[1] || match[2] || parsedNpcList.length + 1);
        const sText = match[3];

        const sName = (sText.match(/이름\s*[:：]\s*([^\n\r]+)/i) || [])[1] || `NPC ${idx}`;
        const sJob = (sText.match(/(?:역할|직업|역할\/직업)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "조연";
        const sDetail = (sText.match(/(?:외모[,\s]*성격[^\n:]*|관계성?)\s*[:：]\s*([^\n\r]+)/i) || [])[1] || "";

        const sSecReg = new RegExp(`(?:\\[서브\\s*NPC\\s*${idx}\\s*비밀[^\\]]*\\]|\\[이\\s*인물의\\s*비밀\\])\\s*[:：]?\\s*([\\s\\S]*?)(?=\\n\\s*(?:\\[서브|\\(서브|###|\\[|\\n\\n-|$))`, "i");
        const sSecMatch = rawText.match(sSecReg);
        const sSecret = sSecMatch ? cleanVal(sSecMatch[1]) : "";

        parsedNpcList.push({
          id: Date.now() + idx,
          name: sName.trim(),
          job: sJob.trim(),
          detail: sDetail.trim(),
          secret: sSecret,
          portraitUrl: typeof getPortraitUrl === "function" ? getPortraitUrl(sName.trim()) : "",
          showSecret: false
        });
      }

      if (parsedNpcList.length > 0) {
        setKpcList(parsedNpcList);
      }
      // ── [5. 핸드아웃 (조사 구역 및 단서) 자동 추출] ──
      let extractedHandouts = [];
      // V3 프롬프트 양식: "- [조사 구역 이름]" 와 "* 획득 단서 내용:"
      const handoutBlocks = rawText.split("- [");
      
      handoutBlocks.slice(1).forEach((block) => {
        const titleMatch = block.match(/^(.*?)\]/);
        const secretMatch = block.match(/획득\s*단서\s*내용\s*[:：]\s*([^\n]+)/);

        if (titleMatch && secretMatch) {
          extractedHandouts.push({
            title: titleMatch[1].trim(), // 예: 제3 생물표본 격리실
            overview: `[조사 구역: ${titleMatch[1].trim()}] 탐색 시 발견할 수 있는 단서입니다.`,
            secret: secretMatch[1].trim() // 예: 미확인 유기체 '테티스'의...
          });
        }
      });

      if (extractedHandouts.length > 0) {
        setGeneratedHandouts(extractedHandouts);
      } else {
        setGeneratedHandouts([]); // 단서가 없으면 더미 데이터 방지를 위해 초기화
      }
      // 👆👆👆 여기까지 👆👆👆

      const modeNames = { coc: "크툴루(CoC)", insane: "인세인(inSANe)", freeform: "자유 서사" };
      alert(`🎉 [${modeNames[detectedMode] || "맞춤"}] 시나리오 연동 완료!\n룰 선택, 캐릭터 시트, NPC 명단, 서막/진상이 모두 세팅되었습니다.`);
    };

    if (file.name.toLowerCase().endsWith(".pdf")) {
      setIsPdfLoading(true);
      try {
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
    const roll = Math.floor(Math.random() * 6);
    const desc = INSANE_SCENE_TABLE[roll];
    executeMessage(`[🎲 장면표 1D6 ➔ ${roll + 1}번 결과]: "${desc}"\n(이 분위기를 무대로 다음 행동을 이어갑니다.)`);
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

    const npcs = kpcList.filter(k => k.name.trim() !== "").map(k => ({
      id: k.id, name: k.name, title: k.job || "조력자", detail: k.detail || "", portrait: k.portraitUrl || getPortraitUrl(k.name), affection: 10, secret: k.secret, secretRevealed: false
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

    if (generatedHandouts && generatedHandouts.length > 0) {
      // AI 즉석 생성으로 만들어진 카드인지 확인 (사명 등이 포함되어 있는지)
      const hasBase = generatedHandouts.some(h => h.title.includes("사명") || h.title.includes(pName) || h.title.includes(partnerName));
      const parsedCards = generatedHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false }));
      
      if (hasBase) {
        initialHandouts = parsedCards; // AI 즉석생성이면 통째로 적용
      } else {
        initialHandouts = [...baseCards, ...parsedCards]; // 파일 첨부 시: [PC + 모든 NPC 카드] + [파일에서 뽑아낸 조사구역 단서들] 합치기
      }
    } else {
      // 단서가 아무것도 없다면 생성한 인물들의 기본 사명/비밀 카드들만 깔아둠
      initialHandouts = baseCards;
    }

    let initialSheet = {
      name: pName, job: charJob || "조사원", age: charAge, gender: charGender,
      background: charBackground, secret: charSecret, mission: charMission,
      portrait: charPortraitUrl || getPortraitUrl(pName), hp: 20, maxHp: 20,
      npcs, items: [{ name: "황동 돋보기", desc: "확대경" }, { name: "수첩과 만년필", desc: "기록 도구" }],
      madnessStatus: null, 
      handouts: initialHandouts,
      madnessCards: [],
      madnessDeck: [...INSANE_MADNESS_TABLE].sort(() => 0.5 - Math.random())
    };

    if (wizardMode === "insane") {
      initialSheet = { 
        ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, limit: insaneLimit, cycle: 1, scene: 1, phase: "메인",
        mission: charMission || "일상의 온기를 되찾는다.", secret: charSecret || "밝혀지지 않은 과거",
        insaneSkills, insaneCuriosity, insaneFear
      };
    } else if (wizardMode === "coc") {
      initialSheet = { 
        ...initialSheet, hp: derivedHp, maxHp: derivedHp, mp: derivedMp, maxMp: derivedMp, san: derivedSan, maxSan: 99, 
        luck: Number(cocStats.luck), db: derivedDb, cocStats: { ...cocStats }, cocSkills 
      };
    }

    const fullScenarioContext = `[시나리오 제목: ${sessionTitle}]\n[공개 시놉시스]\n${publicSynopsis}\n\n[초기 배경/서막]\n${openingScene}\n\n[키퍼 전용 기밀/진상]\n${hiddenTruth}`;

    const newId = Date.now();
    const newSession = {
      id: newId, title: sessionTitle, ruleMode: wizardMode, preference: playPreference.trim(),
      scenarioText: fullScenarioContext, sheet: initialSheet, messages: [], suggestedActions: [],
      investigationSpots: [], pendingCheck: null
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);

   let openingPrompt = "";
if (wizardMode === "dating_msg") {
      // 1. 미연시 (문자형) - 절대 소설 지문 금지
      openingPrompt = `[🚨 절대 경고: 스마트폰 1:1 메신저 톡 화면입니다!]
소설 지문, 3인칭 서술, 날짜/시간 헤더(**[1일 차 ...]**), 상황 묘사를 단 한 줄도 쓰지 마십시오! (출력 시 즉시 오류 처리됨)
당신은 오직 메신저(카카오톡)를 켠 '${partnerName}' 본인입니다.
상대방 '${pName}'에게 방금 카톡을 보내듯 아주 자연스럽고 일상적인 톡 1~3줄만 보내십시오.
(예: "${pName}, 집 잘 들어갔어?", "아직 안 자지? 잠깐 생각나서 톡해봤어.")

말미에 주인공 '${pName}'이 보낼 답장 3개를 아래 형식으로만 출력하십시오:
<!-- SUGGESTIONS: ["답장 1", "답장 2", "답장 3"] -->
- '${pName}'의 성격/말투 설정: [${charBackground || "자연스러운 성향"}] 준수`;
    } else {
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

      setSessions(prev => prev.map(s => s.id === newId ? {
        ...s, sheet: { ...initialSheet, ...parsedData.newSheetVars },
        messages: [{ role: "model", text: cleanText }],
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

   const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;

    // 🌟 현재 톡 중인 연락처의 인물을 정확히 찾아오기
    const isDatingMsg = activeSession.ruleMode === "dating_msg";
    const currentContactId = activeSession.activeContactId || activeSession.sheet?.npcs?.[0]?.id;
    const currentContact = (activeSession.sheet?.npcs || []).find(n => n.id === currentContactId) || activeSession.sheet?.npcs?.[0];
    const partnerName = currentContact?.name || "상대방";

    // 🌟 메시지에 누구와의 대화인지(contactId) 이름표를 달아줌!
    const snapshotSheet = JSON.parse(JSON.stringify(activeSession.sheet || {}));
    const updatedMessages = [
      ...(activeSession.messages || []), 
      { role: "user", text: textToSend, contactId: currentContactId, prevSheet: snapshotSheet }
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

    let dynamicRules = `\n\n[키퍼 시스템 연동 절대 수칙]
1. 탐사자가 새로운 물건이나 소지품을 획득하면 지문 맨 끝에 반드시 <!-- ITEM: {"name": "아이템 이름", "desc": "간략한 설명"} --> 태그를 출력하십시오.
2. 사건의 결정적 단서나 비밀 기록을 조사해 알아내면 지문 맨 끝에 반드시 <!-- CLUE: {"name": "단서명", "desc": "발견한 진실 내용 요약"} --> 태그를 출력하십시오.
3. [NPC 호감도 및 인격 관리 절대 수칙]
- 호감도 범위는 0~100입니다. 
- [🚨 절대 경고: 급격한 변동 및 착각 금지] 
  * 질투, 쌀쌀맞음, 다른 사람 이름 부르기, 실수, 선 넘는 무례함은 절대 호감 행동이 아닙니다! 로맨스 텐션으로 착각하지 말고 반드시 단호하게 감점(-2~-5)하십시오.
  * 호감도는 한 턴에 절대로 5점 이상 크게 뛸 수 없습니다! (일반 호감 행동은 +1~2, 매우 깊은 공감일 때만 최대 +3)
  * 반드시 현재 NPC의 시트에 적힌 [기존 호감도]를 확인한 후, 거기서 1~3점 단위로 더하거나 뺀 '정확한 최종 계산 결과'만 value에 넣으십시오.
- [채팅창 노출 절대 금지] 본문에 호감도 증감 문구를 적지 마시고 오직 지문 맨 끝에 <!-- AFFECTION: {"name": "NPC이름", "value": 변경후수치} --> 태그로만 출력하십시오.`;

    // 🌟 미연시 모드일 때 주인공 말투 맞춤형 답장 후보 생성 수칙 추가
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

    if (isFreeform) {
      dynamicRules += `\n\n[문체 마감 수칙 (자유 서사 전용)]
- 지문 말미에 "다음으로 어떤 행동을 취하시겠습니까?" 같은 기계적 질문을 절대 출력하지 마십시오.
- 문장의 끝은 항상 인물의 가쁜 호흡, 대사, 혹은 감각적인 신체 묘사의 여운으로 자연스럽게 매듭지으십시오.`;
    } else {
      dynamicRules += `\n\n[TRPG 진행 수칙]
- 지문 끝에 상황에 맞는 탐사자의 다음 행동이나 판정 선언을 자연스럽게 유도하십시오.`;
    }


     
 // 🌟 메신저 모드일 때는 현재 톡 중인 상대와의 대화 내역만 추려서 AI에게 전달
    const messagesForAi = isDatingMsg
      ? updatedMessages.filter(m => (m.contactId ? m.contactId === currentContactId : true))
      : updatedMessages;

    // 🌟 AI에게 현재 선택된 인물의 성격과 비밀을 확실하게 주입
    let currentNpcPrompt = "";
    if (isDatingMsg && currentContact) {
      currentNpcPrompt = `\n\n[🚨 현재 메신저 톡 상대방 전환 알림]
당신은 지금 '${partnerName}' 본인입니다! (직업/역할: ${currentContact.title || currentContact.job || "인물"})
- 인물 외모 및 성격/관계: [${currentContact.detail || "설정 없음"}]
- 감춰둔 비밀/진심: [${currentContact.secret || "비밀 없음"}]
절대 다른 사람의 입장에서 말하지 마십시오! 오직 '${partnerName}' 본인의 말투와 감정선으로만 톡 답장을 1~3줄 보내십시오.`;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: messagesForAi,
          scenarioText: (activeSession.scenarioText || "") + dynamicRules + currentNpcPrompt,
          playerSheet: typeof cleanSheetForAi === "function" ? cleanSheetForAi(activeSession.sheet) : activeSession.sheet,
          ruleMode: activeSession.ruleMode,
          playPreference: activeSession.preference
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `서버 응답 오류 (상태 코드: ${res.status})`);
      }

      const data = await res.json();
      let rawText = data.text || "";

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

      // [단서 자동 추출 및 수첩 추가]
      let newClues = [];
      const clueRegex = /<!--\s*CLUE:\s*(\{.*?\})\s*-->/gs;
      let clueMatch;
      while ((clueMatch = clueRegex.exec(rawText)) !== null) {
        try {
          const clueObj = JSON.parse(clueMatch[1]);
          if (clueObj.name) newClues.push({ id: Date.now() + Math.random(), name: clueObj.name, desc: clueObj.desc || "" });
        } catch (e) {}
      }
      rawText = rawText.replace(clueRegex, "");

      // [호감도 변화 자동 추출]
      let affChanges = [];
      const affRegex = /<!--\s*AFFECTION:\s*(\{.*?\})\s*-->/gs;
      let affMatch;
      while ((affMatch = affRegex.exec(rawText)) !== null) {
        try {
          const affObj = JSON.parse(affMatch[1]);
          const val = affObj.value !== undefined ? affObj.value : affObj.affection;
          if (affObj.name && val !== undefined) affChanges.push({ name: affObj.name, value: Number(val) });
        } catch (e) {}
      }
      rawText = rawText.replace(affRegex, "");

      const { cleanText, parsedData } = parseTagsSafely(rawText, partnerName, activeSession.ruleMode);
      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };

      // 아이템 및 단서 반영
      if (newItems.length > 0) newSheet.items = [...(newSheet.items || []), ...newItems];
      if (newClues.length > 0) newSheet.clues = [...(newSheet.clues || []), ...newClues];

      // 🌟 AI가 npcs 배열을 지멋대로 덮어쓰면서 KPC 초상화, 설정, 비밀이 날아가는 현상 완벽 방어
      const currentNpcs = activeSession.sheet?.npcs || [];
      let mergedNpcs = currentNpcs.map(cNpc => {
        // 1) AFFECTION 태그로 호감도가 변경된 경우
        const affTarget = affChanges.find(a => a.name === cNpc.name || a.name.includes(cNpc.name) || cNpc.name.includes(a.name));
        let affVal = affTarget ? Math.max(0, Math.min(100, affTarget.value)) : cNpc.affection;

        // 2) 기존 SHEET 태그로 데이터가 온 경우
        if (parsedData.newSheetVars.npcs && Array.isArray(parsedData.newSheetVars.npcs)) {
          const updatedNpc = parsedData.newSheetVars.npcs.find(a => a.name === cNpc.name || a.id === cNpc.id);
          if (updatedNpc) {
            return {
              ...cNpc,
              affection: updatedNpc.affection !== undefined ? updatedNpc.affection : affVal,
              title: updatedNpc.title || cNpc.title,
              secretRevealed: updatedNpc.secretRevealed !== undefined ? updatedNpc.secretRevealed : cNpc.secretRevealed
            };
          }
        }
        return { ...cNpc, affection: affVal };
      });

      // 새로운 NPC가 추가된 경우에만 안전하게 밀어넣기 (기존 데이터 파괴 방지)
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
      newSheet.npcs = mergedNpcs;

      // 광기 및 핸드아웃 처리
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

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, sheet: newSheet,
       messages: [...updatedMessages, { role: "model", text: cleanText, contactId: currentContactId }],
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

  const sendMessage = () => { if (!input.trim()) return; const t = input; setInput(""); executeMessage(t); };

  const handleSuggestionClick = (sugg) => {
    if (sugg.includes("장면표")) {
      handleRollSceneTable();
    } else {
      setInput(sugg);
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
        let outcome = sum === 12 ? "스페셜(대성공)" : sum === 2 ? "펌블(대실패)" : sum >= targetVal ? "성공" : "실패";
        rollFormatted = `[🎲 2D6 판정: ${d1}+${d2}=${sum} / 목표치: ${targetVal}${skillName ? ` (${skillName})` : ""} ➔ 결과: ${outcome}]`;
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

  const toggleHandoutReveal = (hId) => {
    if (!activeSession) return;
    const handouts = (activeSession.sheet.handouts || []).map(h => h.id === hId ? { ...h, revealed: !h.revealed } : h);
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, handouts } } : s));
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

const isSanCheckDetected = activeSession?.ruleMode === "coc" && !activeSession?.sheet?.madnessStatus && !activeMadnessAlert && (activeSession?.pendingCheck?.skill?.includes("이성") || (activeSession?.messages?.[activeSession.messages.length - 1]?.text || "").includes("산 체크"));

// 🌟 [엔딩 감지 로직] 히든 / 배드 / 일반 엔딩 형태와 분위기 판별
  const lastMsgText = activeSession?.messages?.[activeSession.messages.length - 1]?.text || "";
  const isScenarioEnded = /\[(?:True|Happy|Bad|Dead|Normal|Open|Hidden|Secret)?\s*End[:：]|완결\]/i.test(lastMsgText);
  const isHiddenEnding = isScenarioEnded && /Hidden\s*End|Secret\s*End|히든|시크릿|진엔딩/i.test(lastMsgText);
  const isBadEnding = isScenarioEnded && !isHiddenEnding && /Bad\s*End|Dead\s*End|배드|파멸|비극/i.test(lastMsgText);

  return (
    <div style={{ display: "flex", height: "100dvh", width: "100vw", backgroundColor: theme.bg, color: theme.text, overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @import url('https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Pretendard', sans-serif; }
        .serif-text { font-family: ${fontChoice === "maru" ? "'MaruBuri', serif" : "'Pretendard', sans-serif"}; line-height: 1.95; word-break: keep-all; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(140, 160, 210, 0.2); border-radius: 4px; }
        .glass-card { background: ${theme.panel}; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid ${theme.border}; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border-radius: 18px; }
        .glass-alt { background: ${theme.panelAlt}; backdrop-filter: blur(10px); border: 1px solid ${theme.border}; }
        @keyframes diceTumble { 0% { transform: rotate(0deg) scale(0.85); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
        .anim-dice-rolling { animation: diceTumble 0.35s infinite linear; }
      `}</style>
      {showInsanityFlash && <div style={{ position: "fixed", inset: 0, zIndex: 120, backgroundColor: "rgba(220, 20, 60, 0.35)", pointerEvents: "none" }} />}

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
                onClick={() => { setActiveSessionId(s.id); if (isMobile) setIsSidebarOpen(false); }} 
                style={{ borderRadius: "10px", cursor: "pointer", marginBottom: "8px", backgroundColor: activeSessionId === s.id ? theme.panelAlt : theme.panel, border: `1px solid ${activeSessionId === s.id ? theme.accent : theme.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                {/* 상단 썸네일 배너 영역 (고정 높이 70px) */}
                <div style={{ width: "100%", height: "70px", backgroundColor: theme.panelAlt, backgroundImage: s.thumbnail ? `url(${s.thumbnail})` : "linear-gradient(135deg, rgba(150,150,150,0.1), rgba(100,100,100,0.2))", backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                  {/* 🌟 클릭 시 컴퓨터 파일 선택 창 바로 열림 */}
                  <label 
                    onClick={(e) => e.stopPropagation()} 
                    title="내 컴퓨터에서 세션 카드 이미지 선택"
                    style={{ position: "absolute", top: "4px", right: "4px", backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: "4px", padding: "3px 6px", fontSize: "0.7rem", cursor: "pointer" }}
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
                  {dateDisplay && (
                    <div style={{ fontSize: "0.65rem", color: theme.textMuted, marginTop: "4px", borderTop: `1px dashed ${theme.border}`, paddingTop: "4px" }}>
                      🕒 {dateDisplay}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
       <div style={{ padding: "12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px", backgroundColor: theme.sidebar }}>
          <button 
            onClick={() => {
              setSelectedExportSessionIds(activeSessionId ? [activeSessionId] : sessions.map(s => s.id));
              openModal(setShowExportModal);
            }} 
            style={{ width: "100%", padding: "9px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.8rem", fontWeight: "700" }}
          >
            💾 데이터 관리 (백업/내보내기)
          </button>
          <button onClick={() => openModal(setShowSettingsModal)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.8rem", fontWeight: "700" }}>⚙️ 환경 설정</button>
        </div>
      </div>

      {/* 🌟 모바일 시트 열렸을 때 바깥 누르면 닫히는 어두운 배경 */}
      {isMobile && isSheetOpen && (
        <div 
          onClick={() => setIsSheetOpen(false)} 
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 45 }} 
        />
      )}

    {/* 2. 중앙 메인 뷰 (◀ 왼쪽으로 밀면 시트 열림) */}
      <div 
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const diff = e.changedTouches[0].clientX - touchStartX;
          // 오른쪽에서 왼쪽으로 60px 이상 밀었을 때 시트 열기
          if (diff < -60 && !isSheetOpen) setIsSheetOpen(true);
          setTouchStartX(null);
        }}
        style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      >
{/* 상단 단일 헤더 바 */}
        <div style={{ height: "54px", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebar, flexShrink: 0 }}>
          
          {/* 좌측: 메신저 톡일 때는 선택된 인물 헤더 / 일반 룰일 때는 시나리오 제목 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: theme.text, padding: "4px" }}>☰</button>
            
            {activeSession && activeSession.ruleMode === "dating_msg" ? (
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${theme.border}`, flexShrink: 0 }}>
                  <img 
                    src={(activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId)?.portrait || activeSession.sheet?.npcs?.[0]?.portrait} 
                    alt="상대" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
                <div>
                  <div style={{ fontWeight: "800", fontSize: "0.88rem", color: theme.text, display: "flex", alignItems: "center", gap: "5px" }}>
                    {(activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId)?.name || activeSession.sheet?.npcs?.[0]?.name || "상대방"}
                    <span style={{ fontSize: "0.62rem", color: "#62d681", fontWeight: "700" }}>● 대화 중</span>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: theme.textMuted }}>
                    {(activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId)?.title || activeSession.sheet?.npcs?.[0]?.title || "1:1 대화"}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <span style={{ fontWeight: "800", fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "140px" : "240px" }}>
                  {activeSession ? activeSession.title : "로비 (세션 생성)"}
                </span>
                {activeSession && activeSession.ruleMode === "insane" && (
                  <span style={{ padding: "2px 6px", backgroundColor: activeSession.sheet?.phase === "클라이맥스" ? "rgba(214, 56, 87, 0.2)" : "rgba(229, 169, 60, 0.2)", border: `1px solid ${activeSession.sheet?.phase === "클라이맥스" ? theme.danger : theme.warning}`, borderRadius: "4px", fontSize: "0.7rem", color: activeSession.sheet?.phase === "클라이맥스" ? theme.danger : theme.warning, fontWeight: "700" }}>
                    {activeSession.sheet?.phase === "클라이맥스" ? "⚠️ 클라이맥스" : `${activeSession.sheet?.cycle || 1}C / ${activeSession.sheet?.scene || 1}S (리미트: ${activeSession.sheet?.limit || 4})`}
                  </span>
                )}
              </>
            )}
          </div>

{/* 우측 아이콘 및 수치 영역 */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* 미연시일 때는 상단에 하트 호감도 배지 출력 */}
            {activeSession && activeSession.ruleMode?.startsWith("dating") && (
              <span style={{ padding: "4px 10px", backgroundColor: "rgba(247, 101, 133, 0.15)", border: `1px solid ${theme.danger}`, borderRadius: "14px", fontSize: "0.78rem", color: theme.danger, fontWeight: "800" }}>
                ♥ {((activeSession.sheet?.npcs || []).find(n => n.id === activeSession.activeContactId) || activeSession.sheet?.npcs?.[0])?.affection ?? 10}
              </span>
            )}

            {activeSession && activeSession.ruleMode === "insane" && (
              <>
                <button onClick={() => advanceInsaneScene(activeSessionId)} title="수동으로 씬을 넘깁니다" style={{ padding: "5px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "12px", fontSize: "0.72rem", cursor: "pointer" }}>씬 종료 ➔</button>
                <button onClick={handleRollSceneTable} style={{ padding: "5px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, color: theme.warning, borderRadius: "12px", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}>🎲 장면표</button>
                <button onClick={() => setIsTabletopOpen(!isTabletopOpen)} style={{ padding: "5px 10px", backgroundColor: isTabletopOpen ? theme.warning : theme.panel, border: `1px solid ${theme.warning}`, color: isTabletopOpen ? "#000" : theme.warning, borderRadius: "12px", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}>🃏 테이블탑</button>
              </>
            )}
            {activeSession && activeSession.ruleMode === "coc" && (
              <button onClick={() => rollDiceDirectly(activeSession.sheet?.san ?? 50, "이성(SAN)")} disabled={isRolling || isLoading} title="1D100 이성 체크" style={{ padding: "6px 10px", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1.5px solid ${theme.danger}`, color: theme.danger, borderRadius: "16px", cursor: "pointer", fontWeight: "800", fontSize: "0.78rem" }}>
                🧠 {activeSession.sheet?.san ?? 50}
              </button>
            )}
            {activeSession && (
              <button onClick={() => setIsSheetOpen(!isSheetOpen)} title="프로필 및 설정" style={{ padding: "6px 10px", backgroundColor: isSheetOpen ? theme.accent : theme.panel, border: `1px solid ${theme.border}`, color: isSheetOpen ? "#fff" : theme.text, borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
                {activeSession.ruleMode?.startsWith("dating") ? "👤 정보" : "📋"}
              </button>
            )}

            {/* 🌟 플레이 중에는 숨기고, 로비 화면일 때만 공지 버튼 표시 */}
            {!activeSession && (
              <button onClick={() => { setActiveNoticeTab("guide"); openModal(setShowNoticeModal); }} title="이용 가이드 및 패치 노트" style={{ background: "none", border: "none", fontSize: "1.15rem", cursor: "pointer", padding: "0 4px" }}>
                📢
              </button>
            )}
            <button onClick={handleToggleDarkMode} style={{ background: "none", border: "none", fontSize: "1.15rem", cursor: "pointer", padding: "0 4px" }}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {!activeSession ? (
          /* 로비 화면 */
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 100px 14px" : "28px 24px 80px 24px", maxWidth: "860px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h1 className="serif-text" style={{ margin: "0 0 6px 0", fontSize: "1.65rem", fontWeight: "800", color: theme.text }}>새로운 서사의 시작</h1>
                <div style={{ fontSize: "0.82rem", color: theme.textMuted }}>룰과 장르를 선택하면 AI 마스터가 세계를 구축합니다.</div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "flex-end" }}>
                <button 
                  type="button" 
                  onClick={handleSaveLobbyPreset} 
                  title="로비 세팅 저장"
                  style={{ 
                    width: "38px", 
                    height: "38px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    backgroundColor: theme.panelAlt, 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: "50%", 
                    cursor: "pointer", 
                    fontSize: "1.05rem" 
                  }}
                >
                  💾
                </button>
                <button 
                  type="button" 
                  onClick={() => openModal(setShowLobbyPresetModal)} 
                  title="로비 세팅 불러오기"
                  style={{ 
                    width: "38px", 
                    height: "38px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    backgroundColor: theme.panelAlt, 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: "50%", 
                    cursor: "pointer", 
                    fontSize: "1.05rem" 
                  }}
                >
                  📂
                </button>
                <button 
                  type="button" 
                  onClick={handleAiGenerate} 
                  disabled={isAiGenerating || isLoading} 
                  style={{ 
                    padding: "8px 16px", 
                    height: "38px",
                    backgroundColor: "#4a4947", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "20px", 
                    cursor: "pointer", 
                    fontSize: "0.82rem", 
                    fontWeight: "700", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)", 
                    whiteSpace: "nowrap" 
                  }}
                >
                  {isAiGenerating || isLoading ? "기획 중..." : "✨ AI 즉석 생성"}
                </button>
              </div>
            </div>

{/* 1. 룰 시스템 선택 */}
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: "800", marginBottom: "14px" }}>1. 룰 시스템 선택</div>
              
              {/* 메인 4개 룰 카드: 자유 서사 ➔ CoC ➔ inSANe ➔ 미연시 */}
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
                      { title: "핵심 판정", desc: "2D6 주사위와 6대 분야 66개 특기표 매트릭스를 기반으로 판정을 진행합니다." },
                      { title: "비밀과 사명", desc: "모든 인물이 겉으로 드러난 '사명'과 숨겨둔 '비밀'을 가지고 서로를 탐색합니다." },
                      { title: "추천 분위기", desc: "서로를 향한 복잡한 의혹과 집착, 영화적이고 극적인 서스펜스 호러에 적합합니다." }
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
                  const isDating = wizardMode === "dating_novel" || wizardMode === "dating_msg";
                  const isSelected = item.key === "dating" ? isDating : wizardMode === item.key;

                  return (
                    <div
                      key={item.key}
                      onClick={() => {
                        if (item.key === "dating") {
                          if (!isDating) setWizardMode("dating_novel");
                        } else {
                          setWizardMode(item.key);
                        }
                      }}
                      style={{
                        padding: "16px 14px",
                        borderRadius: "12px",
                        border: `1.5px solid ${isSelected ? "#4a4947" : theme.border}`,
                        backgroundColor: isSelected ? theme.panelAlt : "transparent",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      {/* ? 상세 도움말 버튼 */}
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

              {/* 미연시 선택 시 바로 아래에 열리는 2차 세부 모드 선택 패널 */}
              {(wizardMode === "dating_novel" || wizardMode === "dating_msg") && (
                <div style={{ marginTop: "14px", padding: "16px", backgroundColor: "rgba(247, 101, 133, 0.05)", border: `1.5px dashed rgba(247, 101, 133, 0.4)`, borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "800", color: theme.danger, marginBottom: "10px" }}>
                    🌸 모드 선택
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px" }}>
                    
                    {/* 정통 미연시 */}
                    <div
                      onClick={() => setWizardMode("dating_novel")}
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        border: `1.5px solid ${wizardMode === "dating_novel" ? theme.danger : theme.border}`,
                        backgroundColor: wizardMode === "dating_novel" ? "rgba(247, 101, 133, 0.12)" : theme.panel,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>📖</div>
                      <div style={{ fontWeight: "800", fontSize: "0.84rem", color: theme.text }}>비주얼 노벨 (소설형)</div>
                      <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "4px" }}>풍부한 지문 묘사와 3지선다 선택지 카드</div>
                    </div>

                    {/* 문자형 (메신저) */}
                    <div
                      onClick={() => setWizardMode("dating_msg")}
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        border: `1.5px solid ${wizardMode === "dating_msg" ? theme.danger : theme.border}`,
                        backgroundColor: wizardMode === "dating_msg" ? "rgba(247, 101, 133, 0.12)" : theme.panel,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>📱</div>
                      <div style={{ fontWeight: "800", fontSize: "0.84rem", color: theme.text }}>메신저 톡 (문자형)</div>
                      <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "4px" }}>스마트폰 메신저 형태의 빠르고 가벼운 티키타카</div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 내 프로필 & 등장인물 */}
{/* 2. 장르 톤 */}
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
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
              
              {/* 내 프로필 (PC) */}
              <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>
                    {wizardMode.startsWith("dating") ? "내 프로필 (주인공)" : "내 프로필 (PC)"}
                  </span>
                  <button onClick={() => openModal(setShowPresetModal)} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text }}>📁 프리셋 불러오기</button>
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
              <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>
                    {wizardMode.startsWith("dating") ? "히로인 / 공략 상대" : "등장인물 (KPC)"}
                  </span>
                  <button onClick={() => setKpcList([...kpcList, { id: Date.now(), name: "", job: "", detail: "", secret: "", portraitUrl: "", showSecret: false }])} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text }}>+ 추가</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflowY: "auto", maxHeight: "250px" }}>
                  {kpcList.map((kpc) => (
                    <div key={kpc.id} style={{ display: "flex", flexDirection: "column", gap: "6px", border: `1px solid ${theme.border}`, padding: "10px", borderRadius: "8px", position: "relative" }}>
                      {kpcList.length > 1 && (
                        <button onClick={() => setKpcList(kpcList.filter(it => it.id !== kpc.id))} style={{ position: "absolute", top: "6px", right: "6px", background: "none", border: "none", color: theme.danger, cursor: "pointer" }}>✕</button>
                      )}
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div onClick={() => { setActivePortraitTarget(kpc.id); openModal(setShowPortraitEditModal); }} style={{ width: "42px", height: "42px", borderRadius: "50%", border: `1.5px dashed ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                          {kpc.portraitUrl ? <img src={kpc.portraitUrl} alt="KPC" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "0.68rem", color: theme.textMuted }}>사진</span>}
                        </div>
                        <div style={{ flex: 1, display: "flex", gap: "6px" }}>
                          <input 
                            type="text" 
                            value={kpc.name} 
                            onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, name: e.target.value } : k))} 
                            placeholder={wizardMode.startsWith("dating") ? "상대 이름" : "파트너"} 
                            style={{ width: "50%", padding: "6px 8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} 
                          />
                          <input 
                            type="text" 
                            value={kpc.job} 
                            onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, job: e.target.value } : k))} 
                            placeholder={wizardMode.startsWith("dating") ? "관계 / 신분 (예: 소꿉친구)" : "조력자"} 
                            style={{ width: "50%", padding: "6px 8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} 
                          />
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={kpc.detail} 
                        onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, detail: e.target.value } : k))} 
                        placeholder={wizardMode.startsWith("dating") ? "외모, 매력적인 특징, 나와의 미묘한 관계성..." : "외모, 성격, PC와의 관계"} 
                        style={{ width: "100%", padding: "6px 8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} 
                      />
                      
                      <button type="button" onClick={() => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, showSecret: !k.showSecret } : k))} style={{ width: "100%", padding: "6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.72rem", fontWeight: "600" }}>
                        {kpc.showSecret 
                          ? (wizardMode.startsWith("dating") ? "🔒 진심 닫기" : "🔒 비밀 닫기") 
                          : (wizardMode.startsWith("dating") ? "👀 이 인물의 숨겨진 진심 열람 및 수정" : "👀 이 인물의 비밀 열람 및 수정")}
                      </button>
                      {kpc.showSecret && (
                        <textarea 
                          value={kpc.secret} 
                          onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, secret: e.target.value } : k))} 
                          placeholder={wizardMode.startsWith("dating") ? "당신에게 쉽게 드러내지 않는 진짜 속마음이나 약점..." : "숨겨진 진심이나 비밀"} 
                          style={{ width: "100%", height: "50px", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.danger, fontSize: "0.78rem", resize: "none" }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🌟 1. CoC 특화 설정 블록 */}
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

            {/* 🌟 2. 인세인 특기표 매트릭스 블록 */}
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
              </div>
            )}

          
{/* 시나리오 정보 및 서막 */}
            <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>
                  {wizardMode.startsWith("dating") ? "스토리 설정 및 첫 만남 (Prologue)" : "시나리오 정보 및 서막(Prologue)"}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <label style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text }}>
                    📄 파일 첨부
                    <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>
                  <button onClick={handleAutoReplaceKpcPc} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text }}>🔄 PC/KPC 치환</button>
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
            {/* 테이블탑 오버레이 */}
            {activeSession.ruleMode === "insane" && isTabletopOpen && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "75px", backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 40, padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                  <span style={{ fontWeight: "800", fontSize: "1.05rem" }}>🃏 테이블탑 핸드아웃 & 광기 현황</span>
                  <button onClick={() => setIsTabletopOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.3rem", cursor: "pointer" }}>✕</button>
                </div>

                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: "800", color: theme.accent, marginBottom: "10px" }}>📜 시나리오 핸드아웃 (터치하여 앞/뒤 확인)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                    {(activeSession.sheet.handouts || []).map(card => (
                      <div key={card.id} onClick={() => toggleHandoutReveal(card.id)} className="glass-card" style={{ width: "170px", minHeight: "220px", borderRadius: "12px", border: `1.5px solid ${card.revealed ? theme.danger : theme.border}`, padding: "14px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: "0.68rem", color: card.revealed ? theme.danger : theme.accent, fontWeight: "800" }}>{card.revealed ? "💀 비밀 해금됨" : "📜 공개 핸드아웃"}</div>
                          <div style={{ fontWeight: "800", fontSize: "0.88rem", margin: "6px 0", color: theme.text }}>{card.title}</div>
                          <div style={{ fontSize: "0.74rem", color: card.revealed ? theme.danger : theme.textMuted, lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                            {card.revealed ? card.secret : card.overview}
                          </div>
                        </div>
                      <div style={{ fontSize: "0.65rem", textAlign: "center", color: theme.textMuted, borderTop: `1px dashed ${theme.border}`, paddingTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                          {card.revealed && <strong style={{ color: theme.danger, fontSize: "0.7rem" }}>✋ 이 비밀은 스스로 밝힐 수 없다.</strong>}
                          <span>터치하여 앞/뒤 뒤집기</span>
                        </div>
                      </div>
                    ))}
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

      {/* 대화 로그 */}
            <div ref={chatContainerRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
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
                    
                    {/* 🌟 메신저 모드일 때 상대방 프사 출력 */}
                    {isDatingMsg && m.role === "model" && (
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${theme.border}`, flexShrink: 0, marginTop: "2px" }}>
                        <img src={partnerNpc?.portrait} alt="상대" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                      {/* 메신저 모드 상대방 이름 표시 */}
                      {isDatingMsg && m.role === "model" && (
                        <span style={{ fontSize: "0.74rem", color: theme.textMuted, marginBottom: "4px", fontWeight: "700" }}>
                          {partnerNpc?.name || "상대방"}
                        </span>
                      )}

                      <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                        {/* 말풍선 본체 (유저는 노란 카톡, 상대방은 패널색) */}
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
                          {m.text}
                        </div>

                        {/* 🌟 상대방 답장이 아직 안 왔을 때만 노란색 '1' 표시, 답장이 오면 자동으로 읽음 처리되어 사라짐! */}
                        {isDatingMsg && m.role === "user" && !(activeSession.messages || []).slice(i + 1).some(next => next.role === "model") && (
                          <span style={{ fontSize: "0.65rem", color: theme.warning, fontWeight: "700" }}>1</span>
                        )}
                      </div>

                      {/* 대화 취소 링크 */}
                      {isLastUser && !isLoading && (
                        <button
                          onClick={() => {
                            if (confirm("마지막 대화를 취소하고 다시 입력하시겠습니까?")) {
                              setInput(m.text);
                              setSessions(prev => prev.map(s => {
                                if (s.id !== activeSessionId) return s;
                                const newMsgs = s.messages.slice(0, i);
                                return { 
                                  ...s, 
                                  sheet: m.prevSheet ? m.prevSheet : s.sheet,
                                  messages: newMsgs, 
                                  suggestedActions: [], 
                                  pendingCheck: null 
                                };
                              }));
                            }
                          }}
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

              {/* 알림 배너 */}
            <div style={{ backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, padding: "8px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
              
{/* 🌟 엔딩 전용 맞춤형 배너 & 에필로그 버튼 (히든 / 배드 / 트루 3단 분기) */}
              {isScenarioEnded && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  backgroundColor: isHiddenEnding 
                    ? "rgba(154, 100, 255, 0.15)" 
                    : isBadEnding 
                    ? "rgba(214, 56, 87, 0.15)" 
                    : "rgba(98, 214, 129, 0.15)", 
                  border: `1.5px solid ${isHiddenEnding ? "#9d4edd" : isBadEnding ? theme.danger : theme.success}`, 
                  borderRadius: "8px", 
                  padding: "8px 12px" 
                }}>
                  <div style={{ fontSize: "0.8rem", color: theme.text }}>
                    <strong>
                      {isHiddenEnding 
                        ? "🗝️ 숨겨진 진실(히든 엔딩)에 도달했습니다" 
                        : isBadEnding 
                        ? "🥀 비극적 결말에 도달했습니다" 
                        : "✨ 시나리오가 완결되었습니다"}
                    </strong>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "2px" }}>
                      우측 시트에서 감춰졌던 모든 진상과 인물들의 비밀이 해금되었습니다.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      let promptText = "";
                      if (isHiddenEnding) {
                        promptText = `[에필로그 요청: 숨겨진 진실의 후일담]\n본 시나리오의 히든 엔딩(Hidden End)에 도달했습니다. 표면상 드러나지 않았던 배후의 진실, 두 사람만이 공유하게 된 은밀한 운명, 혹은 세계관의 숨겨진 비하인드를 담은 신비롭고 깊은 여운의 후일담을 3~4문단으로 서술해 주십시오.`;
                      } else if (isBadEnding) {
                        promptText = `[에필로그 요청: 비극의 후일담]\n본 시나리오가 비극적인 결말(Bad End)로 막을 내렸습니다. 사건이 끝난 후 남겨진 세계, 혹은 홀로 남거나 스러져간 두 인물의 쓸쓸하고 애틋한 여운을 담은 후일담을 3~4문단으로 서술해 주십시오.`;
                      } else {
                        promptText = `[에필로그 요청: 평온의 후일담]\n본 시나리오가 성공적으로 완결되었습니다. 시련을 넘어선 두 사람이 계절이 바뀐 뒤 평온한 일상 속에서 서로의 온기를 나누며 살아가는 감성적인 후일담을 3~4문단으로 서술해 주십시오.`;
                      }
                      executeMessage(promptText);
                    }}
                    style={{ 
                      padding: "6px 12px", 
                      backgroundColor: isHiddenEnding ? "#7b2cbf" : isBadEnding ? theme.danger : theme.accent, 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "6px", 
                      fontWeight: "700", 
                      fontSize: "0.75rem", 
                      cursor: "pointer", 
                      whiteSpace: "nowrap" 
                    }}
                  >
                    {isHiddenEnding 
                      ? "🗝️ 숨겨진 후일담 보기" 
                      : isBadEnding 
                      ? "📜 비극의 후일담 보기" 
                      : "📜 에필로그(후일담) 보기"}
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

              {/* CoC 전용 조사 칩 */}
              {activeSession?.ruleMode !== "insane" && !activeSession?.ruleMode?.startsWith("dating") && (activeSession?.investigationSpots || []).length > 0 && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.72rem", color: theme.warning, fontWeight: "700", alignSelf: "center" }}>🔍 조사:</span>
                  {activeSession.investigationSpots.map((spot, idx) => (
                    <button key={idx} onClick={() => setInput(prev => `[조사: ${spot.name}] ` + prev)} style={{ padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>{spot.name}</button>
                  ))}
                </div>
              )}

              {suggestionsEnabled && (activeSession?.suggestedActions || []).length > 0 && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.72rem", color: theme.accent, fontWeight: "700", alignSelf: "center" }}>💡 제안:</span>
                  {activeSession.suggestedActions.map((sugg, idx) => (
                    <button key={idx} onClick={() => handleSuggestionClick(sugg)} style={{ padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>{sugg}</button>
                  ))}
                </div>
              )}
            </div>

            {/* 입력창 */}
            <div style={{ padding: "10px 14px", paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (!isMobile && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="대사나 메시지를 입력하세요..." style={{ flex: 1, minHeight: "48px", maxHeight: "120px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px", outline: "none", fontSize: "0.9rem", resize: "none" }} />
             {abortController || isLoading ? (
                <button 
                  onClick={handleCancelResponse} 
                  style={{ height: "48px", padding: "0 18px", backgroundColor: theme.danger || "#dc3545", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                >
                  ⏹️ 취소
                </button>
              ) : (
             <button 
                  onClick={sendMessage} 
                  disabled={isLoading || !input.trim()} 
                  style={{ height: "48px", padding: "0 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }}
                >
                  전송
                </button>
              )}
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
                <div style={{ marginTop: "8px", fontSize: "0.74rem", lineHeight: "1.5", color: theme.text, borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>
                  <div style={{ marginBottom: "6px", whiteSpace: "pre-wrap" }}>
                    <strong style={{ color: theme.textMuted }}>[성격 및 백스토리]</strong><br />
                    {activeSession.sheet.background || "기재된 설정이 없습니다."}
                  </div>
                  {activeSession.sheet.secret && (
                    <div style={{ color: theme.danger, whiteSpace: "pre-wrap" }}>
                      <strong>[🔒 숨겨진 비밀/사명]</strong><br />
                      {activeSession.sheet.secret}
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
                  <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>{(activeSession.sheet.clues || []).length}개</span>
                </summary>
                <div style={{ marginTop: "8px", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(!activeSession.sheet.clues || activeSession.sheet.clues.length === 0) ? (
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, padding: "4px 0" }}>
                      {activeSession.ruleMode?.startsWith("dating") 
                        ? "상대가 좋아하는 취향이나 관심사가 아직 기록되지 않았습니다." 
                        : "아직 발견된 결정적 단서가 없습니다."}
                    </div>
                  ) : (
                    activeSession.sheet.clues.map((clue, cIdx) => (
                      <div key={cIdx} onClick={() => setInput(prev => `[취향 언급: ${clue.name}] ` + prev)} style={{ padding: "6px 8px", backgroundColor: theme.panelAlt, borderRadius: "6px", fontSize: "0.72rem", border: `1px solid ${theme.border}` }}>
                        <strong style={{ color: theme.accent }}>{activeSession.ruleMode?.startsWith("dating") ? "💖" : "🔎"} {clue.name}</strong>
                        <div style={{ fontSize: "0.68rem", color: theme.textMuted, marginTop: "2px" }}>{clue.desc}</div>
                      </div>
                    ))
                  )}
                </div>
              </details>
            </div>
   
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

    {/* 🌟 파트너 상세 아코디언 & 비밀 블라인드 + [톡하기] 연락처 전환 통합 */}
      <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
        <div style={{ fontWeight: "800", fontSize: "0.78rem", marginBottom: "6px", color: theme.accent }}>
          {activeSession.ruleMode?.startsWith("dating") ? "연락처 목록 (등장인물)" : "주요 등장인물 (파트너)"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {(activeSession.sheet.npcs || []).map(npc => {
            const isCurrentContact = (activeSession.activeContactId || activeSession.sheet.npcs[0]?.id) === npc.id;
            return (
              <details key={npc.id} style={{ backgroundColor: isCurrentContact && activeSession.ruleMode?.startsWith("dating") ? "rgba(247, 101, 133, 0.08)" : theme.panelAlt, borderRadius: "6px", border: `1px solid ${isCurrentContact && activeSession.ruleMode?.startsWith("dating") ? theme.danger : theme.border}`, overflow: "hidden" }}>
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

                  {/* 🌟 미연시 모드일 때만 연락 전환 버튼 출력 (클릭 시 아코디언이 열리지 않도록 차단) */}
                  {activeSession.ruleMode?.startsWith("dating") && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, activeContactId: npc.id } : s));
                        alert(`'${npc.name}' 님과의 대화창으로 전환되었습니다.`);
                      }}
                      disabled={isCurrentContact}
                      style={{ padding: "3px 8px", backgroundColor: isCurrentContact ? theme.danger : theme.panel, color: isCurrentContact ? "#fff" : theme.text, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.65rem", fontWeight: "700", cursor: isCurrentContact ? "default" : "pointer", whiteSpace: "nowrap", marginLeft: "4px" }}
                    >
                      {isCurrentContact ? "대화 중" : "💬 톡하기"}
                    </button>
                  )}
                </summary>
                
                {/* 드롭다운 펼쳤을 때 나오는 상세 내용 (외모/관계성 & 비밀 완벽 보존) */}
                <div style={{ padding: "8px 10px", fontSize: "0.72rem", borderTop: `1px dashed ${theme.border}`, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div>
                    <strong style={{ color: theme.accent }}>[외모 및 관계성]</strong>
                    <div style={{ color: theme.text, marginTop: "2px" }}>{npc.detail || "등록된 상세 설정이 없습니다."}</div>
                  </div>
                  <div style={{ backgroundColor: "rgba(214, 56, 87, 0.08)", padding: "6px", borderRadius: "4px", border: `1px solid ${theme.border}` }}>
                    <strong style={{ color: theme.danger }}>[🔒 숨겨진 비밀/진심]</strong>
                    <div style={{ marginTop: "2px", color: npc.secretRevealed ? theme.danger : theme.textMuted }}>
                      {npc.secretRevealed ? npc.secret : (npc.secret ? "🔒 아직 서사 속에서 밝혀지지 않은 비밀입니다." : "숨겨진 비밀이 없습니다.")}
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  </div>
)}

      {/* 설정 모달 */}
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
                    📖 마루 부리 (명조체)
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

      {/* 🌟 로비 전체 프리셋 모달 */}
      {showLobbyPresetModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>📂 로비 전체 세팅 목록</h3>
              <button onClick={() => closeModal(setShowLobbyPresetModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            {/* 🌟 로비 세팅 JSON 백업/복원 버튼 */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              <button onClick={exportLobbyPresets} style={{ flex: 1, padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "700" }}>
                📥 JSON 다운로드
              </button>
              <label style={{ flex: 1, padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "700", textAlign: "center" }}>
                📤 JSON 복원
                <input type="file" accept=".json" onChange={importLobbyPresets} style={{ display: "none" }} />
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "240px", overflowY: "auto" }}>
              {lobbyPresets.length === 0 ? (
                <div style={{ fontSize: "0.78rem", color: theme.textMuted, textAlign: "center", padding: "20px 0" }}>
                  저장된 로비 세팅이 없습니다.<br />(상단의 [💾 로비 세팅 저장]을 눌러보세요)
                </div>
              ) : (
                lobbyPresets.map(p => (
                  <div key={p.id} onClick={() => handleLoadLobbyPreset(p)} style={{ padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "0.82rem" }}>{p.presetTitle}</div>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>PC: {p.charName || "미상"} / KPC: {p.kpcList?.length || 0}명 / {p.wizardMode}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm("삭제하시겠습니까?")) { const filtered = lobbyPresets.filter(it => it.id !== p.id); setLobbyPresets(filtered); localStorage.setItem("rp_hub_lobby_presets", JSON.stringify(filtered)); } }} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px" }}>🗑️</button>
                  </div>
                ))
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

{/* 🌟 [수정] 통합 데이터 관리 모달 */}
      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>💾 데이터 관리 (내보내기 & 백업)</h3>
              <button onClick={() => closeModal(setShowExportModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            
            {/* 세션 다중 체크박스 목록 */}
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
                      if (e.target.checked) setSelectedExportSessionIds([...selectedExportSessionIds, s.id]);
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

            {/* 드롭다운 파일 형식 */}
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

{/* 🌟 공지사항 및 시작 가이드 모달 (구문 완벽 복원) */}
      {showNoticeModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "500px", borderRadius: "14px", color: theme.text, display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: "85vh" }}>
            
            {/* 상단 탭 버튼 */}
            <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebar }}>
              <button onClick={() => setActiveNoticeTab("guide")} style={{ flex: 1, padding: "14px", background: activeNoticeTab === "guide" ? theme.panelAlt : "transparent", border: "none", color: activeNoticeTab === "guide" ? theme.accent : theme.textMuted, fontWeight: activeNoticeTab === "guide" ? "800" : "500", fontSize: "0.9rem", cursor: "pointer", borderBottom: activeNoticeTab === "guide" ? `2px solid ${theme.accent}` : "none" }}>
                📖 시작 가이드
              </button>
              <button onClick={() => setActiveNoticeTab("update")} style={{ flex: 1, padding: "14px", background: activeNoticeTab === "update" ? theme.panelAlt : "transparent", border: "none", color: activeNoticeTab === "update" ? theme.accent : theme.textMuted, fontWeight: activeNoticeTab === "update" ? "800" : "500", fontSize: "0.9rem", cursor: "pointer", borderBottom: activeNoticeTab === "update" ? `2px solid ${theme.accent}` : "none" }}>
                🚀 업데이트 노트 ({APP_VERSION})
              </button>
            </div>

            {/* 본문 영역 */}
            <div style={{ padding: "20px", overflowY: "auto", flex: 1, fontSize: "0.82rem", lineHeight: "1.7" }}>
              {activeNoticeTab === "guide" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", color: theme.text, fontSize: "1.05rem", fontWeight: "800" }}>
                      LyrisTable (LT) 시스템 가이드
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.76rem", color: theme.textMuted }}>
                      1:1 타이만 세션과 관계성 서사를 위한 플랫폼 핵심 기능 안내입니다.
                    </p>
                  </div>

                  {/* 1. 시나리오 연동 방법 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.accent, fontSize: "0.82rem", marginBottom: "6px" }}>
                      📄 1. 시나리오 연동 (파일 첨부 & AI 생성)
                    </div>
                    <div style={{ fontSize: "0.74rem", color: theme.text, lineHeight: "1.6" }}>
                      • <strong>파일 첨부 (.txt / .pdf):</strong> 로비의 [📄 파일 첨부]로 시나리오 문서를 올리면 룰 시스템, 시놉시스, 서막, KPC 명단, 조사 구역 및 단서 핸드아웃이 자동으로 파싱되어 입력란에 배치됩니다.<br/>
                      • <strong>AI 즉석 생성:</strong> 원하는 분위기 태그(#GL, #쌍방구원, #오컬트 등)를 선택하고 [✨ AI 즉석 생성]을 누르면 세계관과 핸드아웃이 포함된 단편 시나리오가 자동으로 기획됩니다.<br/>
                      • <strong>PC/KPC 자동 치환:</strong> 시나리오 본문에 'PC', 'KPC'로 적힌 단어는 [🔄 PC/KPC 치환] 버튼으로 캐릭터의 실제 고유 이름으로 일괄 변경할 수 있습니다.
                    </div>
                  </div>

                  {/* 2. 캐릭터 시트 및 로비 저장 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.accent, fontSize: "0.82rem", marginBottom: "6px" }}>
                      💾 2. 시트 & 로비 세팅 저장 (프리셋/백업)
                    </div>
                    <div style={{ fontSize: "0.74rem", color: theme.text, lineHeight: "1.6" }}>
                      • <strong>로비 전체 저장 (상단 💾 / 📂):</strong> PC와 KPC 프로필, 시나리오 본문, 스탯까지 포함된 '로비 풀 세팅'을 저장해 두고 원클릭으로 다시 불러올 수 있습니다. (JSON 파일 다운로드/복원 지원)<br/>
                      • <strong>PC만 단독 저장 (우측 시트 💾 PC만):</strong> 세션 진행 도중 우측 시트 상단의 [💾 PC만]을 누르면 내 캐릭터 설정과 스탯만 별도 저장되어 다른 시나리오에서도 재활용할 수 있습니다.<br/>
                      • <strong>전체 데이터 관리:</strong> 좌측 사이드바 하단의 [💾 데이터 관리]에서 진행 중인 세션을 텍스트(.txt), 마크다운(.md), PDF 인쇄본, 혹은 복원용 세이브(.json)로 안전하게 백업할 수 있습니다.
                    </div>
                  </div>

                  {/* 3. 인세인 & CoC 조사/핸드아웃 기믹 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.warning, fontSize: "0.82rem", marginBottom: "6px" }}>
                      🔍 3. 조사 단서 및 테이블탑 핸드아웃
                    </div>
                    <div style={{ fontSize: "0.74rem", color: theme.text, lineHeight: "1.6" }}>
                      • <strong>사명과 비밀 (인세인):</strong> 모든 등장인물의 공개 사명(앞면)과 비밀(뒷면) 카드가 헤더의 [🃏 테이블탑]에 배치됩니다. 카드를 터치해 앞뒤로 뒤집을 수 있습니다.<br/>
                      • <strong>단서 조사:</strong> 시나리오 파일 내에 배치된 조사 구역은 탐색 성공 시 핸드아웃으로 해금되며, 발견한 결정적 증거는 시트 내 [📋 증거 수첩]에 자동 보관됩니다.
                    </div>
                  </div>

                  {/* 4. 플레이 편의 기능 */}
                  <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                    <div style={{ fontWeight: "800", color: theme.danger, fontSize: "0.82rem", marginBottom: "6px" }}>
                      ⎌ 4. 편의 기능 및 되돌리기 (롤백)
                    </div>
                    <div style={{ fontSize: "0.74rem", color: theme.text, lineHeight: "1.6" }}>
                      • <strong>대화 취소 및 다시 쓰기:</strong> 내 마지막 말풍선 아래의 [⎌ 이 대화 취소 및 다시 쓰기]를 누르면 직전 상태로 메시지가 복구되며 호감도, 단서, 소지품 상태가 이전 턴으로 완전 롤백됩니다.<br/>
                      • <strong>답변 강제 중단:</strong> AI 응답 도중 [⏹️ 취소] 버튼을 누르면 실시간 통신을 즉시 중단하고 재입력할 수 있습니다.
                    </div>
                  </div>

                  <p style={{ margin: "4px 0 0 0", color: theme.textMuted, fontSize: "0.72rem" }}>
                    * 본 플랫폼은 GL, BL, HL부터 논로맨스까지, 플레이어가 원하는 모든 관계성과 서사를 폭넓게 지원합니다.
                  </p>
                </div>
              ) : (
                /* 업데이트 노트 탭 */
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h3 style={{ margin: "0 0 4px 0", color: theme.text, fontSize: "1.1rem" }}>{APP_VERSION} 패치 노트</h3>
                  <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                    <strong style={{ color: theme.success, display: "block", marginBottom: "6px" }}>✨ 정식 배포 주요 변경 사항</strong>
                    • <strong>미연시 (소설/문자) 모드 도입:</strong> 주사위 대신 선택지와 관계성 중심의 비주얼 노벨 및 메신저 모드가 추가되었습니다.<br/>
                    • <strong>인세인(inSANe) 시스템 고도화:</strong> PC 및 모든 서브 NPC의 사명/비밀 분리 생성 및 '스스로 밝힐 수 없다' 핸드아웃 카드가 완성되었습니다.<br/>
                    • <strong>온보딩 가이드 & 세이브 백업:</strong> 신규 사용자를 위한 가이드 모달과 JSON 풀세팅 백업/복원 기능이 탑재되었습니다.
                  </div>
                </div>
              )}
            </div>

            {/* 하단 닫기 및 7일 체크 영역 */}
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.sidebar }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", cursor: "pointer", color: theme.textMuted }}>
                <input type="checkbox" checked={hideNoticeCheckbox} onChange={(e) => setHideNoticeCheckbox(e.target.checked)} />
                7일간 다시 보지 않기
              </label>
              <button onClick={handleCloseNotice} style={{ padding: "6px 16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "0.8rem" }}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 [추가] 스타일 매칭 룰 설명 전용 팝업 모달 */}
      {ruleHelpModal && (
        <div
          onClick={() => setRuleHelpModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 140,
            padding: "16px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "22px",
              borderRadius: "16px",
              color: theme.text,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.25)"
            }}
          >
            {/* 팝업 헤더 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.6rem" }}>{ruleHelpModal.icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800" }}>{ruleHelpModal.name}</h3>
                    <span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.accent, fontWeight: "700" }}>
                      {ruleHelpModal.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.74rem", color: theme.textMuted, marginTop: "2px" }}>
                    {ruleHelpModal.sub}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setRuleHelpModal(null)}
                style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "1.2rem", cursor: "pointer", padding: "2px 6px" }}
              >
                ✕
              </button>
            </div>

            {/* 항목별 상세 카드 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: `1px dashed ${theme.border}`, paddingTop: "12px" }}>
              {ruleHelpModal.points.map((pt, idx) => (
                <div key={idx} style={{ padding: "10px 12px", backgroundColor: theme.panelAlt, borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: "800", color: theme.accent, marginBottom: "3px" }}>
                    • {pt.title}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: theme.text, lineHeight: "1.5" }}>
                    {pt.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 버튼 */}
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setRuleHelpModal(null)}
                style={{ flex: 1, padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem", cursor: "pointer" }}
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  setWizardMode(ruleHelpModal.key);
                  setRuleHelpModal(null);
                }}
                style={{ flex: 2, padding: "10px", backgroundColor: theme.accent, border: "none", borderRadius: "8px", color: "#fff", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer" }}
              >
                이 룰로 시작하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
