"use client";
import { useState, useEffect, useRef } from "react";

// 2026 팬톤 트렌드 테마 4종
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
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#일상", "#오컬트"];

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 🌟 AI 답변 강제 취소 컨트롤러
  const [abortController, setAbortController] = useState(null);

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
    return `[https://image.pollinations.ai/prompt/$](https://image.pollinations.ai/prompt/$){encodeURIComponent(clean + ", " + styleTag)}?width=300&height=300&nologo=true`;
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
  "age": "20대 나이",
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setIsPdfLoading(true);
      try {
        if (!window.pdfjsLib) {
          await new Promise((res, rej) => {
            const script = document.createElement("script"); script.src = "[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js)";
            script.onload = res; script.onerror = rej; document.head.appendChild(script);
          });
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js)";
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
      .replace(/```html|```json|```/gi, "")
      .replace(/<!--[\s\S]*?-{1,3}>/g, "")
      .replace(/<!--[\s\S]*?$/g, "")
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

    let initialHandouts = generatedHandouts.length > 0 ? generatedHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false })) : [
      { id: 1, title: `${pName}의 사명과 비밀`, overview: `${pName}의 표면상 상태와 사명입니다.`, secret: charSecret || "모든 짐을 혼자 짊어지려다 무너질까 두려워하고 있다.", revealed: false },
      { id: 2, title: `${partnerName}의 따뜻한 시선`, overview: `${partnerName}가 건네온 따스한 위로와 온기입니다.`, secret: npcs[0]?.secret || "상대방이 고통받지 않도록 제 모든 것을 바쳐 지키려 한다.", revealed: false },
      { id: 3, title: "오래된 가죽 노트", overview: "작업대 구석에 놓인 낡은 기록장입니다.", secret: "과거 두 사람이 나누었던 약속이 적혀 있습니다.", revealed: false },
      { id: 4, title: "책상 서랍의 다이어리", overview: "서랍 안쪽에 숨겨진 묘한 이질감의 책입니다.", secret: "말하지 못했던 진실의 마지막 페이지가 담겨 있습니다.", revealed: false }
    ];

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

    const openingPrompt = `[세션 시작: 첫 서막 지문 요청]
시나리오의 [배후 진상]과 [초기 배경/서막]을 충실히 반영하여 서막을 여십시오.
반드시 정중하고 격조 높은 키퍼의 경어체(~합니다/였습니다)를 고정하십시오.

[🚨 호칭 준수]
- 'KPC'라는 단어를 일절 쓰지 말고, 파트너의 실제 이름 '${partnerName}'(으)로만 지칭하십시오.
- '${pName}'과 '${partnerName}'의 온기를 살려 4~5문장으로 서술하십시오.
- 지문 끝에 씬 행동을 위한 <!-- SUGGESTIONS: ["${partnerName}에게 말을 건다", "주변 단서를 살펴본다", "장면표 굴림"] --> 태그를 출력하십시오.`;

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
    const partnerName = activeSession.sheet?.npcs?.[0]?.name || "아델";
    const updatedMessages = [...(activeSession.messages || []), { role: "user", text: textToSend }];
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [], pendingCheck: null } : s));
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages,
          scenarioText: activeSession.scenarioText,
          playerSheet: cleanSheetForAi(activeSession.sheet),
          ruleMode: activeSession.ruleMode,
          playPreference: activeSession.preference
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `서버 응답 오류 (상태 코드: ${res.status})`);
      }

      const data = await res.json();
      const { cleanText, parsedData } = parseTagsSafely(data.text || "", partnerName, activeSession.ruleMode);
      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };

      // 🌟 AI가 npcs 배열을 지멋대로 덮어쓰면서 KPC 초상화, 설정, 비밀이 날아가는 현상 완벽 방어
      if (parsedData.newSheetVars.npcs && Array.isArray(parsedData.newSheetVars.npcs)) {
        const currentNpcs = activeSession.sheet?.npcs || [];
        const mergedNpcs = currentNpcs.map(cNpc => {
          const updatedNpc = parsedData.newSheetVars.npcs.find(a => a.name === cNpc.name || a.id === cNpc.id);
          if (updatedNpc) {
            return {
              ...cNpc,
              affection: updatedNpc.affection !== undefined ? updatedNpc.affection : cNpc.affection,
              title: updatedNpc.title || cNpc.title,
              secretRevealed: updatedNpc.secretRevealed !== undefined ? updatedNpc.secretRevealed : cNpc.secretRevealed
            };
          }
          return cNpc;
        });
        parsedData.newSheetVars.npcs.forEach(aNpc => {
          if (!currentNpcs.find(cNpc => cNpc.name === aNpc.name || cNpc.id === aNpc.id)) {
            mergedNpcs.push({ ...aNpc, id: aNpc.id || Date.now() + Math.random(), portrait: getPortraitUrl(aNpc.name), detail: "", secret: "" });
          }
        });
        newSheet.npcs = mergedNpcs;
      }

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

      if (parsedData.newHandouts.length > 0) {
        const added = parsedData.newHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false }));
        newSheet.handouts = [...(newSheet.handouts || []), ...added];
      }

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, sheet: newSheet,
        messages: [...updatedMessages, { role: "model", text: cleanText }],
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

  return (
    {/* 🌟 [추가] 본문 글씨체 선택 */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>본문 서사 글씨체</label>
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
      <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, left: 0, top: 0, bottom: 0, width: isSidebarOpen ? "260px" : "0px", minWidth: isSidebarOpen ? "260px" : "0px", transition: "all 0.25s ease", overflow: "hidden", backgroundColor: theme.sidebar, borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
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

      {/* 2. 중앙 메인 뷰 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        
        {/* 상단 단일 헤더 바 */}
        <div style={{ height: "54px", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.sidebar, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: theme.text, padding: "4px" }}>☰</button>
            <span style={{ fontWeight: "800", fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "140px" : "240px" }}>
              {activeSession ? activeSession.title : "로비 (세션 생성)"}
            </span>
            {activeSession && activeSession.ruleMode === "insane" && (
              <span style={{ padding: "2px 6px", backgroundColor: activeSession.sheet?.phase === "클라이맥스" ? "rgba(214, 56, 87, 0.2)" : "rgba(229, 169, 60, 0.2)", border: `1px solid ${activeSession.sheet?.phase === "클라이맥스" ? theme.danger : theme.warning}`, borderRadius: "4px", fontSize: "0.7rem", color: activeSession.sheet?.phase === "클라이맥스" ? theme.danger : theme.warning, fontWeight: "700" }}>
                {activeSession.sheet?.phase === "클라이맥스" ? "⚠️ 클라이맥스" : `${activeSession.sheet?.cycle || 1}C / ${activeSession.sheet?.scene || 1}S (리미트: ${activeSession.sheet?.limit || 4})`}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
              <button onClick={() => setIsSheetOpen(!isSheetOpen)} title="캐릭터 시트" style={{ padding: "6px 10px", backgroundColor: isSheetOpen ? theme.accent : theme.panel, border: `1px solid ${theme.border}`, color: isSheetOpen ? "#fff" : theme.text, borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
                📋
              </button>
            )}
            {activeSession && (
              <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }}>
                {isSheetOpen ? "시트▶" : "◀시트"}
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
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { key: "coc", name: "크툴루의 부름 (CoC)", sub: "1D100 기반 탐색과 공포" },
                  { key: "insane", name: "인세인 (inSANe)", sub: "비밀과 광기의 보드게임" },
                  { key: "freeform", name: "자유 서사 (소설 모드)", sub: "주사위 없는 순수 역극" }
                ].map((item) => (
                  <div key={item.key} onClick={() => setWizardMode(item.key)} style={{ padding: "16px 14px", borderRadius: "12px", border: `1.5px solid ${wizardMode === item.key ? "#4a4947" : theme.border}`, backgroundColor: wizardMode === item.key ? theme.panelAlt : "transparent", cursor: "pointer" }}>
                    <div style={{ fontWeight: "800", fontSize: "0.88rem", color: theme.text }}>{item.name}</div>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "4px" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

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

            {/* 내 프로필 & 등장인물 */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
              <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>내 프로필 (PC)</span>
                  <button onClick={() => openModal(setShowPresetModal)} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text }}>📁 프리셋 불러오기</button>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div onClick={() => { setActivePortraitTarget("pc"); openModal(setShowPortraitEditModal); }} style={{ width: "64px", height: "64px", borderRadius: "50%", border: `1.5px dashed ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                    {charPortraitUrl ? <img src={charPortraitUrl} alt="PC" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>초상화</span>}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <input type="text" value={charName} onChange={e => setCharName(e.target.value)} placeholder="이름" style={{ padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem" }} />
                    <input type="text" value={charJob} onChange={e => setCharJob(e.target.value)} placeholder="직업/역할" style={{ padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem" }} />
                  </div>
                </div>

                <textarea value={charBackground} onChange={e => setCharBackground(e.target.value)} placeholder="백스토리 및 성격..." style={{ width: "100%", height: "70px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.82rem", resize: "none" }} />

                <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "8px" }}>
                  <button type="button" onClick={() => setShowCharSecret(!showCharSecret)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.75rem", fontWeight: "600" }}>
                    {showCharSecret ? "🔒 내 비밀 닫기" : "👀 내 캐릭터의 숨겨진 비밀 (인세인/사명)"}
                  </button>
                  {showCharSecret && (
                    <textarea value={charSecret} onChange={e => setCharSecret(e.target.value)} placeholder="숨겨진 진짜 목적이나 과거" style={{ width: "100%", height: "55px", marginTop: "6px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.danger, fontSize: "0.8rem", resize: "none" }} />
                  )}
                </div>
              </div>

              <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>등장인물 (KPC)</span>
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
                          <input type="text" value={kpc.name} onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, name: e.target.value } : k))} placeholder="파트너" style={{ width: "50%", padding: "6px 8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} />
                          <input type="text" value={kpc.job} onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, job: e.target.value } : k))} placeholder="조력자" style={{ width: "50%", padding: "6px 8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} />
                        </div>
                      </div>
                      <input type="text" value={kpc.detail} onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, detail: e.target.value } : k))} placeholder="외모, 성격, PC와의 관계" style={{ width: "100%", padding: "6px 8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} />
                      
                      <button type="button" onClick={() => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, showSecret: !k.showSecret } : k))} style={{ width: "100%", padding: "6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.72rem", fontWeight: "600" }}>
                        {kpc.showSecret ? "🔒 비밀 닫기" : "👀 이 인물의 비밀 열람 및 수정"}
                      </button>
                      {kpc.showSecret && (
                        <textarea value={kpc.secret} onChange={e => setKpcList(kpcList.map(k => k.id === kpc.id ? { ...k, secret: e.target.value } : k))} placeholder="숨겨진 진심이나 비밀" style={{ width: "100%", height: "50px", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.danger, fontSize: "0.78rem", resize: "none" }} />
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
                <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>시나리오 정보 및 서막(Prologue)</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <label style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text }}>
                    📄 파일 첨부
                    <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>
                  <button onClick={handleAutoReplaceKpcPc} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", cursor: "pointer", color: theme.text }}>🔄 PC/KPC 치환</button>
                </div>
              </div>

              <input type="text" value={scenarioTitle} onChange={e => setScenarioTitle(e.target.value)} placeholder="시나리오 제목" style={{ width: "100%", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.85rem" }} />
              
              <div>
                <label style={{ fontSize: "0.74rem", color: theme.textMuted, marginBottom: "4px", display: "block" }}>[공개 시놉시스] 플레이어에게 주어지는 초기 정보</label>
                <textarea value={publicSynopsis} onChange={e => setPublicSynopsis(e.target.value)} placeholder="도입부, 소문 등 스포일러 없는 배경 설명..." style={{ width: "100%", height: "60px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem", resize: "none" }} />
              </div>

              <div>
                <label style={{ fontSize: "0.74rem", color: theme.accent, marginBottom: "4px", display: "block", fontWeight: "700" }}>[서막] 시작되는 시간, 장소, 혹은 상황 묘사</label>
                <textarea value={openingScene} onChange={e => setOpeningScene(e.target.value)} placeholder="예: 비 내리는 늦은 오후, 작업실 문을 두드리는 소리가 들립니다..." style={{ width: "100%", height: "60px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem", resize: "none" }} />
              </div>

              <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "8px" }}>
                <button type="button" onClick={() => setShowHiddenTruth(!showHiddenTruth)} style={{ width: "100%", padding: "8px", backgroundColor: showHiddenTruth ? "rgba(247, 101, 133, 0.1)" : theme.panelAlt, border: `1px solid ${showHiddenTruth ? theme.danger : theme.border}`, borderRadius: "6px", color: showHiddenTruth ? theme.danger : theme.text, cursor: "pointer", fontSize: "0.78rem", fontWeight: "700" }}>
                  {showHiddenTruth ? "🔒 키퍼 전용 진상 닫기" : "👀 키퍼 전용 스포일러/진상 수동 입력"}
                </button>
                {showHiddenTruth && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ fontSize: "0.72rem", color: theme.danger, marginBottom: "6px" }}>⚠️ 플레이어 열람 주의! 마스터만 참조하는 사건의 흑막과 기믹, 엔딩 분기입니다.</div>
                    <textarea value={hiddenTruth} onChange={e => setHiddenTruth(e.target.value)} placeholder="흑막의 정체, 특수 기믹, 트루/배드 엔딩 조건을 기입하세요." style={{ width: "100%", height: "85px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.danger}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem", resize: "none" }} />
                  </div>
                )}
              </div>
            </div>

            <button onClick={startNewSession} disabled={isLoading || isPdfLoading} style={{ width: "100%", padding: "16px", backgroundColor: "#52504c", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "1rem" }}>
              {isLoading ? "키퍼가 세계를 여는 중..." : "서막 열기"}
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
                        <div style={{ fontSize: "0.65rem", textAlign: "center", color: theme.textMuted, borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>터치하여 앞/뒤 뒤집기</div>
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
                return (
                  <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "90%" : "82%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div className={m.role === "user" ? "" : "serif-text"} style={{ backgroundColor: m.text.includes("[🎲") || m.text.includes("[⚠️") ? "rgba(229, 169, 60, 0.12)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi, color: theme.text, border: m.text.includes("[⚠️") ? `1px solid ${theme.danger}` : m.text.includes("[🎲") ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`, padding: "14px 18px", borderRadius: "12px", lineHeight: "1.9", whiteSpace: "pre-wrap", fontSize: "0.92rem" }}>
                      {m.text}
                    </div>
                    {/* 내 마지막 말풍선 아래에만 취소 링크 표시 */}
                    {isLastUser && !isLoading && (
                      <button
                        onClick={() => {
                          if (confirm("마지막 대화를 취소하고 다시 입력하시겠습니까?")) {
                            setInput(m.text); // 방금 보냈던 글을 입력창에 자동 복구!
                            setSessions(prev => prev.map(s => {
                              if (s.id !== activeSessionId) return s;
                              const newMsgs = s.messages.slice(0, i);
                              return { ...s, messages: newMsgs, suggestedActions: [], pendingCheck: null };
                            }));
                          }
                        }}
                        style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.72rem", cursor: "pointer", marginTop: "4px", padding: "2px 4px", textDecoration: "underline" }}
                      >
                        ⎌ 이 대화 취소 및 다시 쓰기
                      </button>
                    )}
                  </div>
                );
              })}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.8rem", padding: "4px" }}>마스터가 서사를 집필하는 중...</div>}
            </div>

            {/* 알림 배너 */}
            <div style={{ backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, padding: "8px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
              
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

              {/* 🌟 CoC 전용 조사 칩 */}
              {activeSession.ruleMode !== "insane" && (activeSession.investigationSpots || []).length > 0 && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.72rem", color: theme.warning, fontWeight: "700", alignSelf: "center" }}>🔍 조사:</span>
                  {activeSession.investigationSpots.map((spot, idx) => (
                    <button key={idx} onClick={() => setInput(prev => `[조사: ${spot.name}] ` + prev)} style={{ padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>{spot.name}</button>
                  ))}
                </div>
              )}

              {suggestionsEnabled && (activeSession.suggestedActions || []).length > 0 && (
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
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (!isMobile && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="행동이나 대사를 입력하세요..." style={{ flex: 1, minHeight: "48px", maxHeight: "120px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px", outline: "none", fontSize: "0.9rem", resize: "none" }} />
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

      {/* 3. 우측 시트 패널 */}
      {activeSession && (
        <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, right: 0, top: 0, bottom: 0, width: isSheetOpen ? "290px" : "0px", minWidth: isSheetOpen ? "290px" : "0px", transition: "all 0.25s ease", overflow: "hidden", backgroundColor: theme.sidebar, borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          
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
                <div style={{ marginTop: "8px", fontSize: "0.73rem", lineHeight: "1.5", color: theme.textMuted, whiteSpace: "pre-wrap", maxHeight: "180px", overflowY: "auto", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>
                  {activeSession.scenarioText || "시나리오 개요가 없습니다."}
                </div>
              </details>
            </div>

                  {/* 🌟 [추가] 접이식 증거 수첩 */}
            <div className="glass-card" style={{ padding: "10px 12px", borderRadius: "10px" }}>
              <details open style={{ cursor: "pointer" }}>
                <summary style={{ fontSize: "0.78rem", fontWeight: "800", color: theme.accent, outline: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>📋 증거 수첩</span>
                  <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>{(activeSession.sheet.clues || []).length}개</span>
                </summary>
                <div style={{ marginTop: "8px", borderTop: `1px dashed ${theme.border}`, paddingTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(!activeSession.sheet.clues || activeSession.sheet.clues.length === 0) ? (
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, padding: "4px 0" }}>아직 발견된 결정적 단서가 없습니다.</div>
                  ) : (
                    activeSession.sheet.clues.map((clue, cIdx) => (
                      <div key={cIdx} onClick={() => setInput(prev => `[증거 제시: ${clue.name}] ` + prev)} style={{ padding: "6px 8px", backgroundColor: theme.panelAlt, borderRadius: "6px", fontSize: "0.72rem", border: `1px solid ${theme.border}` }}>
                        <strong style={{ color: theme.accent }}>🔎 {clue.name}</strong>
                        <div style={{ fontSize: "0.68rem", color: theme.textMuted, marginTop: "2px" }}>{clue.desc}</div>
                      </div>
                    ))
                  )}
                </div>
              </details>
            </div>

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
                      {activeSession.sheet.insaneSkills.map((sk, idx) => (
                        <button
                          key={idx}
                          onClick={() => rollDiceDirectly(5, `특기: ${sk}`)}
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.7rem", cursor: "pointer" }}
                        >
                          <span>{sk}</span>
                          <span style={{ fontSize: "0.65rem", color: theme.warning }}>🎲</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 소지품 */}
            <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
              <div style={{ fontWeight: "800", fontSize: "0.78rem", marginBottom: "6px", color: theme.accent }}>🎒 소지품</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {(activeSession.sheet.items || []).map((it, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", backgroundColor: theme.panelAlt, padding: "4px 8px", borderRadius: "6px" }}>
                    <span>{it.name}</span>
                    <button onClick={() => setInput(prev => `품에서 [${it.name}]을(를) 꺼내어 ` + prev)} style={{ padding: "1px 6px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.accent, borderRadius: "4px", cursor: "pointer", fontSize: "0.65rem" }}>사용</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 파트너 */}
            {/* 🌟 파트너 상세 아코디언 & 비밀 블라인드 */}
            <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
              <div style={{ fontWeight: "800", fontSize: "0.78rem", marginBottom: "6px", color: theme.accent }}>주요 등장인물 (파트너)</div>
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
                    
                    {/* 드롭다운 펼쳤을 때 나오는 상세 내용 */}
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
                ))}
              </div>
            </div>
                  <div key={npc.id} style={{ display: "flex", gap: "8px", alignItems: "center", backgroundColor: theme.panelAlt, padding: "6px 8px", borderRadius: "6px" }}>
                    <div onClick={() => { setActivePortraitTarget(npc.id); openModal(setShowPortraitEditModal); }} style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
                      <img src={npc.portrait} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, fontSize: "0.72rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                        <span>{npc.name}</span>
                        <span style={{ color: theme.danger }}>♥ {npc.affection}</span>
                      </div>
                      <div style={{ color: theme.textMuted, fontSize: "0.65rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{npc.title}</div>
                    </div>
                  </div>
                ))}
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
              <div style={{ display: "flex", gap: "8px", borderTop: `1px dashed ${theme.border}`, paddingTop: "10px" }}>
                <button onClick={() => openModal(setShowBackupModal)} style={{ flex: 1, padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "700" }}>💾 백업</button>
                <label style={{ flex: 1, padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "700", textAlign: "center" }}>📤 복원<input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} /></label>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPortraitEditModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "400px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>초상화 변경 ({activePortraitTarget === "pc" ? "내 캐릭터" : "파트너"})</h3>
              <button onClick={() => closeModal(setShowPortraitEditModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <label style={{ display: "block", width: "100%", padding: "10px", backgroundColor: theme.panelAlt, border: `1.5px dashed ${theme.accent}`, borderRadius: "8px", textAlign: "center", cursor: "pointer", fontSize: "0.82rem", fontWeight: "700", color: theme.accent, marginBottom: "12px" }}>
              📁 내 컴퓨터에서 이미지 파일 선택
              <input type="file" accept="image/*" onChange={handlePortraitFileUpload} style={{ display: "none" }} />
            </label>

            <div style={{ textAlign: "center", fontSize: "0.72rem", color: theme.textMuted, marginBottom: "8px" }}>또는 AI 프롬프트 / 이미지 URL 입력</div>

            <input type="text" value={customPortraitPrompt} onChange={e => setCustomPortraitPrompt(e.target.value)} placeholder="예: silver hair girl / 이미지 URL" style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem", marginBottom: "12px" }} />
            <button onClick={applyCustomPortrait} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.8rem" }}>적용</button>
          </div>
        </div>
      )}

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

    </div>
  );
}
