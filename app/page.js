"use client";
import { useState, useEffect } from "react";

// 테마 팔레트 4종 및 다크/라이트 모드
const THEME_PALETTES = {
  midnight: { name: "미드나잇 블루", dark: { bg: "#090b10", sidebar: "#0f131c", panel: "#151a26", panelAlt: "#1c2333", border: "rgba(108, 141, 250, 0.2)", text: "#e6eaf5", textMuted: "#8591ab", accent: "#6c8dfa", accentGlow: "rgba(108, 141, 250, 0.35)", danger: "#f76585", warning: "#e5a93c", success: "#62d681", bubbleUser: "#25355e", bubbleAi: "#151a26", inputBg: "#0f131c" }, light: { bg: "#f0f4fc", sidebar: "#e2e8f5", panel: "#ffffff", panelAlt: "#ebf1fd", border: "rgba(58, 104, 216, 0.2)", text: "#1a2233", textMuted: "#5e6c88", accent: "#3a68d8", accentGlow: "rgba(58, 104, 216, 0.25)", danger: "#d63857", warning: "#b57212", success: "#26823f", bubbleUser: "#4b74cb", bubbleAi: "#ffffff", inputBg: "#ffffff" } },
  abyss: { name: "심연 어비스", dark: { bg: "#040507", sidebar: "#080a0f", panel: "#0d1118", panelAlt: "#131822", border: "rgba(86, 121, 224, 0.2)", text: "#dfe3ee", textMuted: "#6f788e", accent: "#5679e0", accentGlow: "rgba(86, 121, 224, 0.35)", danger: "#e0536c", warning: "#cfa14c", success: "#5eb871", bubbleUser: "#1f325c", bubbleAi: "#0e131d", inputBg: "#080a0f" }, light: { bg: "#f3f5f8", sidebar: "#e4e8f0", panel: "#ffffff", panelAlt: "#eaeff6", border: "rgba(52, 82, 168, 0.2)", text: "#12151c", textMuted: "#5c6475", accent: "#3452a8", accentGlow: "rgba(52, 82, 168, 0.25)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "#435994", bubbleAi: "#ffffff", inputBg: "#ffffff" } },
  sepia: { name: "고서적 세피아", dark: { bg: "#1a1512", sidebar: "#15100e", panel: "#241d18", panelAlt: "#302620", border: "rgba(212, 155, 106, 0.22)", text: "#ebe1d5", textMuted: "#9c8b7c", accent: "#d49b6a", accentGlow: "rgba(212, 155, 106, 0.35)", danger: "#d95b5b", warning: "#e3ad5d", success: "#8bb36b", bubbleUser: "#4a3526", bubbleAi: "#241d18", inputBg: "#15100e" }, light: { bg: "#faf7f2", sidebar: "#f1ebe0", panel: "#ffffff", panelAlt: "#ece4d6", border: "rgba(166, 100, 46, 0.22)", text: "#30241b", textMuted: "#7a6755", accent: "#a6642e", accentGlow: "rgba(166, 100, 46, 0.25)", danger: "#b83b3b", warning: "#ad7017", success: "#48782f", bubbleUser: "#825d3d", bubbleAi: "#ffffff", inputBg: "#ffffff" } },
  classic: { name: "클래식 모던", dark: { bg: "#0f1115", sidebar: "#14171d", panel: "#1a1e26", panelAlt: "#222732", border: "rgba(93, 167, 232, 0.2)", text: "#abb3c2", textMuted: "#727b8e", accent: "#5da7e8", accentGlow: "rgba(93, 167, 232, 0.35)", danger: "#dc656f", warning: "#dfb974", success: "#90be72", bubbleUser: "#2e3b50", bubbleAi: "#1a1e26", inputBg: "#14171d" }, light: { bg: "#f5f7fa", sidebar: "#ebedf2", panel: "#ffffff", panelAlt: "#e2e6ed", border: "rgba(35, 97, 230, 0.2)", text: "#20232a", textMuted: "#636a78", accent: "#2361e6", accentGlow: "rgba(35, 97, 230, 0.25)", danger: "#d42424", warning: "#ce7104", success: "#149a44", bubbleUser: "#3b82f6", bubbleAi: "#ffffff", inputBg: "#ffffff" } }
};

const RULE_GUIDES = {
  coc: { title: "크툴루의 부름 (Call of Cthulhu 7판)", desc: "정통 코스믹 호러 추리. 이성치(SAN) 관리 및 심연의 진실 탐색.", system: "1D100 판정. SAN 5점 급감 시 1D10 광기 발작." },
  insane: { title: "멀티 호러 TRPG 인세인 (inSANe)", desc: "의심과 비밀이 교차하는 현대 괴담 심리 호러.", system: "2D6 판정. 사이클별 씬 소모 및 비밀(Secret) 조사." },
  unsung: { title: "언성 듀엣 (Unsung Duet)", desc: "이계 '시프터'에 갇힌 2인 탈출 서사.", system: "2D6 판정. 위기 시 침식도(0~6) 상승 및 신체 변이 발현." },
  freeform: { title: "자유 서사 (Freeform Sandbox)", desc: "정형화된 룰북 없이 분위기와 관계성에 몰입하는 샌드박스.", system: "직관적인 1D20 판정." }
};

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

const INSANE_MADNESS_TABLE = [
  { roll: 1, name: "의혹 (Suspicion)", desc: "동행자의 사명과 대사를 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다." },
  { roll: 2, name: "망상 (Delusion)", desc: "현실에 존재하지 않는 환청과 그림자를 보며 그것에 집착합니다." },
  { roll: 3, name: "강박증 (Obsession)", desc: "소지품을 확인하거나 문을 잠그는 행동을 병적으로 반복합니다." },
  { roll: 4, name: "패닉 (Panic)", desc: "이성적 사고가 마비되어 위험 상황에서 무작정 몸을 숨깁니다." },
  { roll: 5, name: "폭력 충동 (Impulse)", desc: "위협을 제거하기 위해 수단 방법을 가리지 않는 공격성을 드러냅니다." },
  { roll: 6, name: "쇼크 (Shock)", desc: "정신적 붕괴로 인해 다음 씬 동안 행동 선언이 극도로 제한됩니다." }
];

const ORIENT_TAGS = ["#GL", "#BL", "#HL", "#논로맨스"];
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#오컬트", "#광기"];

const PROCEDURAL_DATA = {
  names: {
    western: { female: ["로웨나", "세실리아", "비비안", "엘레노어", "카밀라"], male: ["사반", "알렉스", "루시안", "아드리안", "빅터"] },
    korean: { female: ["서윤", "도아", "은채", "하경", "지수"], male: ["도윤", "하준", "시우", "민재", "서진"] }
  },
  jobs: {
    coc: [{ job: "고서적 감정사", item: "황동 돋보기, 가죽 수첩, 은제 단도", bg: "고대 비전서의 기괴한 필적을 감정해 온 전문가." }, { job: "사립 탐정", item: "리볼버, 라이터, 회중시계", bg: "실종 사건의 뒤편에 도사린 초자연적 어둠을 추적한다." }],
    insane: [{ job: "기숙학교 전학생", item: "오르골, 만년필, 압박붕대", bg: "엄격한 규율 뒤에 기괴한 실종 괴담이 도사린 학교에 막 전학 왔다." }],
    unsung: [{ job: "조난자 (셰이터)", item: "깨진 회중시계, 일기장", bg: "공간이 뒤틀린 이계에 휘말렸다." }],
    freeform: [{ job: "아카데미 수석", item: "만년필, 양피지", bg: "명문 귀족들 틈바구니에서 실력 하나로 수석을 꿰찬 마법사." }]
  },
  scenarios: {
    coc: ["폭풍우와 짙은 해무로 외부와 고립된 해안 절벽의 저택. 지하 서고에서 젖은 속삭임이 들려옵니다."],
    insane: ["안개가 자욱한 숲속의 기숙학교. 자정이 지나 지하 예배당에서 멈췄던 오르골 소리가 울립니다."],
    unsung: ["비가 내리지 않는 잿빛 하늘 아래, 모든 건물들이 중력을 잃고 뒤틀려 부유하는 기괴한 이계."],
    freeform: ["황립 마법 아카데미의 봉인된 지하 서고. 고대 금주가 폭주하며 결계를 옥죄어 옵니다."]
  }
};

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreHelpModal, setShowRestoreHelpModal] = useState(false);
  const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [ruleHelpModalKey, setRuleHelpModalKey] = useState(null);

  const [showPortraits, setShowPortraits] = useState(true);
  const [portraitStyle, setPortraitStyle] = useState("anime");
  const [backupFormat, setBackupFormat] = useState("json");
  const [backupTarget, setBackupTarget] = useState("all");

  const [currentPalette, setCurrentPalette] = useState("midnight");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [exportFormat, setExportFormat] = useState("txt");
  const [exportScope, setExportScope] = useState("all");
  const [apiUsage, setApiUsage] = useState({ date: new Date().toISOString().slice(0, 10), dailyRequests: 0, totalTokens: 0, lastPromptTokens: 0, lastResponseTokens: 0 });

  const [ruleCategory, setRuleCategory] = useState("official");
  const [wizardMode, setWizardMode] = useState("coc");

  // 캐릭터 폼 상태
  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("24");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [charPortraitUrl, setCharPortraitUrl] = useState("");
  const [customPortraitPrompt, setCustomPortraitPrompt] = useState("");
  
  // 시나리오 (스포일러 분리) 상태
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [publicSynopsis, setPublicSynopsis] = useState("");
  const [hiddenTruth, setHiddenTruth] = useState("");
  const [showHiddenTruth, setShowHiddenTruth] = useState(false);
  
  // KPC(등장인물) 상태
  const [kpcList, setKpcList] = useState([
    { id: Date.now(), name: "파트너", job: "조력자", detail: "", secret: "" }
  ]);

  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [selectedCareerIds, setSelectedCareerIds] = useState([]);
  const [pastChronicleText, setPastChronicleText] = useState("");
  const [customPresets, setCustomPresets] = useState([]);
  const [newPresetTitle, setNewPresetTitle] = useState("");

  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");
  const [unsungMutation, setUnsungMutation] = useState("");

  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });
  const remainingPoints = 460 - (Number(cocStats.str) + Number(cocStats.con) + Number(cocStats.siz) + Number(cocStats.dex) + Number(cocStats.app) + Number(cocStats.int) + Number(cocStats.pow) + Number(cocStats.edu));
  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);
  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0";
  if (strPlusSiz <= 64) derivedDb = "-2";
  else if (strPlusSiz <= 84) derivedDb = "-1";
  else if (strPlusSiz <= 124) derivedDb = "0";
  else if (strPlusSiz <= 164) derivedDb = "+1D4";
  else derivedDb = "+1D6";

  const [playPreference, setPlayPreference] = useState("#GL #집착 #오컬트");

  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [activeMadnessAlert, setActiveMadnessAlert] = useState(null);
  const [showInsanityFlash, setShowInsanityFlash] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const activePalette = THEME_PALETTES[currentPalette] || THEME_PALETTES.midnight;
  const theme = isDarkMode ? activePalette.dark : activePalette.light;
  const quotaPercentage = Math.min(100, Math.round((apiUsage.dailyRequests / 1500) * 100));

  function getPortraitUrl(promptText, forceStyle) {
    const clean = promptText || "character portrait";
    const currentStyle = forceStyle || portraitStyle || "anime";
    const styleTag = currentStyle === "anime" ? "anime style, 2d illustration, masterpiece" : "realistic photography, highly detailed, cinematic lighting";
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(clean + ", " + styleTag)}?width=300&height=300&nologo=true`;
  }

  function handleToggleDarkMode() {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_darkmode", nextVal.toString());
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

  function recordApiCall(usage) {
    const todayStr = new Date().toISOString().slice(0, 10);
    setApiUsage((prev) => {
      const isToday = prev.date === todayStr;
      const newDaily = (isToday ? prev.dailyRequests : 0) + 1;
      const totalT = (isToday ? prev.totalTokens : 0) + (usage?.totalTokenCount || 0);
      const updated = { date: todayStr, dailyRequests: newDaily, totalTokens: totalT, lastPromptTokens: usage?.promptTokenCount || 0, lastResponseTokens: usage?.candidatesTokenCount || 0 };
      if (typeof window !== "undefined") localStorage.setItem("rp_hub_api_usage", JSON.stringify(updated));
      return updated;
    });
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
  const closeModal = (setModalFn) => { setModalFn(false); if (window.history.state?.modalOpen) { window.history.back(); } };

  useEffect(() => {
    const handlePopState = () => {
      setShowSettingsModal(false); setShowExportModal(false); setShowBackupModal(false);
      setShowRestoreHelpModal(false); setShowPortraitEditModal(false);
      setShowPresetModal(false); setShowCareerModal(false); setRuleHelpModalKey(null);
      if (isMobile) { setIsSidebarOpen(false); setIsSheetOpen(false); }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isMobile]);

  const toggleTag = (tag) => {
    setPlayPreference((prev) => {
      const currentList = prev.split(/\s+/).filter(Boolean);
      return currentList.includes(tag) ? currentList.filter((t) => t !== tag).join(" ") : [...currentList, tag].join(" ");
    });
  };

  const handleProceduralGenerate = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const newTags = [pick(ORIENT_TAGS), ...[...TROPE_TAGS].sort(() => 0.5 - Math.random()).slice(0, 2)];
    setPlayPreference(newTags.join(" "));

    const isKorean = Math.random() > 0.5;
    const region = isKorean ? "korean" : "western";
    const gender = Math.random() > 0.5 ? "여성" : "남성";
    const genderKey = gender === "여성" ? "female" : "male";

    const name = pick(PROCEDURAL_DATA.names[region][genderKey]);
    const age = String(Math.floor(Math.random() * 34) + 19);
    const modeKey = PROCEDURAL_DATA.jobs[wizardMode] ? wizardMode : "freeform";
    const jobObj = pick(PROCEDURAL_DATA.jobs[modeKey]);
    const scenarioText = pick(PROCEDURAL_DATA.scenarios[modeKey] || PROCEDURAL_DATA.scenarios.freeform);

    setCharName(name);
    setCharJob(jobObj.job);
    setCharAge(age);
    setCharGender(gender);
    setCharBackground(`${jobObj.bg}\n소지품: [${jobObj.item}]`);
    setCharPortraitUrl(getPortraitUrl(`${name}, ${jobObj.job}`));
    
    setScenarioTitle("미상의 사건");
    setPublicSynopsis(scenarioText);
    setHiddenTruth("흑막은 바로 등 뒤에 있습니다.");
    setKpcList([{ id: Date.now(), name: "엘레나", job: "조력자", detail: "당신을 돕기 위해 온 인물", secret: "이 모든 사건의 원흉" }]);

    if (wizardMode === "coc") {
      const base = [30, 30, 30, 30, 30, 30, 30, 30];
      let remaining = 220;
      while (remaining > 0) {
        const idx = Math.floor(Math.random() * 8);
        if (base[idx] < 85) { base[idx] += 5; remaining -= 5; }
      }
      setCocStats({ str: base[0], con: base[1], siz: base[2], dex: base[3], app: base[4], int: base[5], pow: base[6], edu: base[7], luck: Math.floor(Math.random() * 50) + 40 });
    } else if (wizardMode === "insane") {
      setCharMission("이곳에 숨겨진 비밀을 밝혀내고 살아서 탈출한다.");
      setCharSecret("사실 당신은 1년 전 의식에 휘말려 사망했던 기억을 지닌 생환자다.");
    } else if (wizardMode === "unsung") {
      setUnsungMutation("왼쪽 눈동자가 푸른빛으로 물들며 이계의 소리를 듣는 징후");
    }
  };

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    let ruleSpecificGuidance = "";
    if (wizardMode === "coc") {
      ruleSpecificGuidance = "크툴루 신화, 코스믹 호러, 고대의 아티팩트를 엮어 단서 조사 중심의 시나리오를 설계하십시오.";
    } else if (wizardMode === "insane") {
      ruleSpecificGuidance = "사명과 전혀 다른 소름돋는 뒷면의 [비밀]이 존재하는 현대 괴담 심리 호러를 설계하십시오.";
    } else if (wizardMode === "unsung") {
      ruleSpecificGuidance = "기괴하고 초현실적인 이계 시프터를 묘사하고, 탈출 시 일어나는 몽환적인 신체 변이를 설계하십시오.";
    }

    const systemPrompt = `당신은 최고 권위의 정통 TRPG 시나리오 라이터입니다.
선택된 룰 [${wizardMode}]과 서사 성향 [${playPreference}]에 완벽히 부합하는 시나리오를 작성하십시오.

[집필 절대 수칙]
1. 플레이어의 취향 태그([${playPreference}])를 최우선으로 반영하여 등장인물들의 성별과 커플링(GL, HL, BL, 논로맨스 등) 및 관계성을 구성하십시오.
2. 플레이어가 스포일러를 당하지 않도록, 상황을 묘사하는 [공개 시놉시스]와 마스터 전용의 [키퍼 전용 진상]을 철저히 분리하십시오.
3. 인물들은 맹목적인 추종이나 유치한 소유욕 없이, 각자의 신념을 지키는 독립적 인격체로 묘사하십시오.
4. ${ruleSpecificGuidance}

반드시 아래 JSON 포맷으로만 응답하십시오:
{
  "name": "주인공 이름",
  "gender": "여성/남성",
  "age": "24",
  "job": "역할/직업",
  "background": "주인공의 과거 흉터, 성격, 소지품",
  "scenarioTitle": "멋진 시나리오 제목",
  "publicSynopsis": "플레이어가 읽게 될 스포일러 없는 시나리오 개요 및 도입부 (미스터리와 흥미를 유발하는 3~4문장)",
  "hiddenTruth": "사건의 충격적인 배후 진상, 흑막, 특수 기믹, 그리고 트루/노말/배드 엔딩 분기 조건 (Keeper Only 기밀)",
  "mission": "인세인 전용 공개 사명 (인세인이 아니면 공백)",
  "secret": "인세인 전용 개인 비밀 (인세인이 아니면 공백)",
  "mutation": "언성듀엣 전용 초기 변이 징후 (언성듀엣 아니면 공백)",
  "kpcs": [
    {
      "name": "KPC 이름",
      "job": "역할/직업",
      "detail": "외모, 성격, 주인공과의 관계 및 텐션",
      "secret": "이 인물이 숨기고 있는 충격적인 비밀이나 뒷면의 진심"
    }
  ]
}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text: systemPrompt }], scenarioText: "", playerSheet: {}, ruleMode: wizardMode, playPreference: playPreference }),
      });
      const data = await response.json();
      recordApiCall(data.usage);

      const jsonMatch = data.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const p = JSON.parse(jsonMatch[0]);
        setCharName(p.name || "주인공");
        setCharGender(p.gender || "여성");
        setCharAge(p.age || "24");
        setCharJob(p.job || "조사원");
        setCharBackground(p.background || "");
        setCharPortraitUrl(getPortraitUrl(`${p.name}, ${p.job}`));

        setScenarioTitle(p.scenarioTitle || "미상의 밤");
        setPublicSynopsis(p.publicSynopsis || "눈을 뜨자 낯선 천장이 보입니다.");
        setHiddenTruth(`[배후 진상 및 흑막]\n${p.hiddenTruth || "금기된 봉인이 풀리고 있습니다."}`);

        if (p.kpcs && p.kpcs.length > 0) {
          const generatedKpcs = p.kpcs.map((k, i) => ({ id: Date.now() + i, name: k.name, job: k.job, detail: k.detail, secret: k.secret }));
          setKpcList(generatedKpcs);
        }

        if (p.mission) setCharMission(p.mission);
        if (p.secret) setCharSecret(p.secret);
        if (p.mutation) setUnsungMutation(p.mutation);

        if (wizardMode === "coc") {
          const base = [30, 30, 30, 30, 30, 30, 30, 30];
          let remaining = 220;
          while (remaining > 0) {
            const idx = Math.floor(Math.random() * 8);
            if (base[idx] < 85) { base[idx] += 5; remaining -= 5; }
          }
          setCocStats({ str: base[0], con: base[1], siz: base[2], dex: base[3], app: base[4], int: base[5], pow: base[6], edu: base[7], luck: Math.floor(Math.random() * 50) + 40 });
        }
      } else { handleProceduralGenerate(); }
    } catch (e) { handleProceduralGenerate(); } finally { setIsAiGenerating(false); }
  };

  const handleAddKpc = () => {
    if (kpcList.length >= 10) return alert("KPC는 최대 10명까지 추가할 수 있습니다.");
    setKpcList([...kpcList, { id: Date.now(), name: "", job: "", detail: "", secret: "" }]);
  };
  const handleRemoveKpc = (id) => { setKpcList(kpcList.filter(k => k.id !== id)); };
  const updateKpc = (id, field, value) => { setKpcList(kpcList.map(k => k.id === id ? { ...k, [field]: value } : k)); };

  const handleAutoReplaceKpcPc = () => {
    let replacedSyn = publicSynopsis.replace(/\bPC\b/gi, charName || "주인공");
    let replacedTru = hiddenTruth.replace(/\bPC\b/gi, charName || "주인공");
    if (kpcList.length > 0) {
      replacedSyn = replacedSyn.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
      replacedTru = replacedTru.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
    }
    setPublicSynopsis(replacedSyn); setHiddenTruth(replacedTru);
    alert(`개요 및 진상의 'PC/KPC' 단어가 치환되었습니다!`);
  };

  const handleSaveCurrentAsPreset = () => {
    if (!charName.trim()) return alert("프리셋으로 저장할 캐릭터 이름을 먼저 입력해 주세요.");
    const title = newPresetTitle.trim() || `${charName} (${charJob || "설정"})`;
    const newPreset = { id: Date.now(), title, name: charName, job: charJob, age: charAge, gender: charGender, background: charBackground, portrait: charPortraitUrl, ruleMode: wizardMode, cocStats, mission: charMission, secret: charSecret, unsungMutation };
    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_custom_presets", JSON.stringify(updated));
    setNewPresetTitle(""); alert(`'${title}' 프리셋이 저장되었습니다!`);
  };

  const handleLoadPreset = (preset) => {
    setCharName(preset.name || ""); setCharJob(preset.job || ""); setCharAge(preset.age || "24"); setCharGender(preset.gender || "여성"); setCharBackground(preset.background || "");
    if (preset.portrait) setCharPortraitUrl(preset.portrait);
    if (preset.cocStats) setCocStats(preset.cocStats);
    if (preset.mission) setCharMission(preset.mission);
    if (preset.secret) setCharSecret(preset.secret);
    if (preset.unsungMutation) setUnsungMutation(preset.unsungMutation);
    closeModal(setShowPresetModal);
  };

  const toggleCareerSelection = (id) => { setSelectedCareerIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]); };

  const handleInheritFromMultipleSessions = () => {
    if (selectedCareerIds.length === 0) return alert("계승할 세션을 1개 이상 체크해 주세요.");
    const chosenSessions = sessions.filter((s) => selectedCareerIds.includes(s.id));
    if (chosenSessions.length === 0) return;

    const baseSheet = chosenSessions[0].sheet || {};
    setCharName(baseSheet.name || ""); setCharJob(baseSheet.job || ""); setCharAge(baseSheet.age || "24"); setCharGender(baseSheet.gender || "여성");
    if (baseSheet.portrait) setCharPortraitUrl(baseSheet.portrait);
    if (baseSheet.cocStats) setCocStats(baseSheet.cocStats);

    let combinedChronicle = `[🔄 복수 세션 서사 통합 계승 이력]\n`;
    chosenSessions.forEach((s, idx) => {
      const sh = s.sheet || {}; const itemNames = (sh.items || []).map((it) => it.name).join(", ");
      combinedChronicle += `\n• [세션 ${idx + 1}: ${s.title}] (규칙: ${s.ruleMode})\n`;
      combinedChronicle += `  - 생환 수치: HP ${sh.hp}/${sh.maxHp}${s.ruleMode === "coc" ? `, SAN ${sh.san}/99` : ""}\n`;
      combinedChronicle += `  - 획득 전리품: ${itemNames || "없음"}\n`;
    });
    combinedChronicle += `\n위 세션들의 모든 흉터, 기억, 전리품을 간직한 채 새로운 모험에 들어섭니다.`;
    setPastChronicleText(combinedChronicle);
    setCharBackground(`${baseSheet.background || ""}\n\n${combinedChronicle}`);
    closeModal(setShowCareerModal); setSelectedCareerIds([]);
    alert(`${chosenSessions.length}개 세션의 서사가 성공적으로 계승되었습니다!`);
  };

  const handleDeletePreset = (id, e) => {
    e.stopPropagation();
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_custom_presets", JSON.stringify(updated));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFileName(file.name);
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setIsPdfLoading(true);
      try {
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script"); script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
          });
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const arrayBuffer = await file.arrayBuffer(); const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i); const content = await page.getTextContent();
          extractedText += `[${i}페이지]\n${content.items.map((item) => item.str).join(" ")}\n\n`;
        }
        setHiddenTruth(extractedText.trim()); setPublicSynopsis("PDF 파일이 업로드되었습니다. 진상 탭을 확인하세요.");
      } catch (err) { alert("PDF 읽기 실패: " + err.message); } finally { setIsPdfLoading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setHiddenTruth(event.target.result);
      reader.readAsText(file, "UTF-8");
    }
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("이 세션을 삭제하시겠습니까?")) return;
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handlePortraitFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      if (activeSession) {
        const updatedSheet = { ...activeSession.sheet, portrait: base64 };
        setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, sheet: updatedSheet } : s)));
      } else { setCharPortraitUrl(base64); }
      closeModal(setShowPortraitEditModal);
    };
    reader.readAsDataURL(file);
  };

  const applyCustomPortrait = () => {
    if (!customPortraitPrompt.trim()) return;
    const newUrl = customPortraitPrompt.startsWith("http") ? customPortraitPrompt : getPortraitUrl(customPortraitPrompt);
    if (activeSession) {
      const updatedSheet = { ...activeSession.sheet, portrait: newUrl };
      setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, sheet: updatedSheet } : s)));
    } else { setCharPortraitUrl(newUrl); }
    setCustomPortraitPrompt(""); closeModal(setShowPortraitEditModal);
  };

  const executeSaveBackup = () => {
    if (sessions.length === 0) return alert("백업할 시나리오 세션이 없습니다.");
    const targets = backupTarget === "all" ? sessions : sessions.filter((s) => s.id === Number(backupTarget));
    if (targets.length === 0) return alert("선택된 시나리오가 없습니다.");
    const dateStr = new Date().toISOString().slice(0, 10);
    if (backupFormat === "json") {
      const blob = new Blob([JSON.stringify(targets, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.href = url; link.download = backupTarget === "all" ? `TRPG_전체세이브_${dateStr}.json` : `TRPG_${targets[0].title.replace(/\s+/g, "_")}_${dateStr}.json`; link.click(); URL.revokeObjectURL(url);
    } else {
      let txtContent = `====================================================\n         TRPG 세이브 데이터 텍스트 백업 파일         \n====================================================\n\n`;
      targets.forEach((s, idx) => {
        txtContent += `[세션 ${idx + 1}] ${s.title}\n규칙: ${s.ruleMode}\n캐릭터: ${s.sheet?.name} (${s.sheet?.job})\n\n[대화 기록]\n`;
        (s.messages || []).forEach((m) => { const sender = m.role === "user" ? `[${s.sheet?.name}]` : "[마스터]"; txtContent += `${sender}\n${m.text}\n\n`; });
      });
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.href = url; link.download = backupTarget === "all" ? `TRPG_전체세이브텍스트_${dateStr}.txt` : `TRPG_${targets[0].title.replace(/\s+/g, "_")}_${dateStr}.txt`; link.click(); URL.revokeObjectURL(url);
    }
    closeModal(setShowBackupModal);
  };

  const importSaveFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) imported = [imported];
        if (imported.length > 0 && imported[0].title) {
          setSessions((prev) => {
            const map = new Map(); prev.forEach((s) => map.set(s.id, s)); imported.forEach((s) => map.set(s.id, s)); return Array.from(map.values());
          });
          alert(`${imported.length}개의 세션이 복원되었습니다!`);
        } else alert("올바른 규격의 JSON 세이브 파일이 아닙니다.");
      } catch (err) { alert("파일 복원 실패: " + err.message); }
    };
    reader.readAsText(file);
  };

  const executeExport = () => {
    if (!activeSession) return;
    const session = activeSession;
    let exportText = `=========================================\n${session.title}\n=========================================\n\n`;
    (session.messages || []).forEach((m) => {
      if (exportScope === "storyOnly" && m.text.includes("[🎲 시스템 공인")) return;
      exportText += (m.role === "user" ? `[${session.sheet?.name || "플레이어"}]` : "[마스터]") + `\n${m.text}\n\n`;
    });
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `${session.title.replace(/\s+/g, "_")}_대화록.${exportFormat}`; link.click(); URL.revokeObjectURL(url);
    closeModal(setShowExportModal);
  };

  const triggerMadnessCheck = (rule, lossAmount, targetSessionId) => {
    const session = sessions.find((s) => s.id === targetSessionId);
    if (session?.sheet?.madnessStatus) return;
    setShowInsanityFlash(true); setTimeout(() => setShowInsanityFlash(false), 500);

    let madnessName = ""; let madnessDesc = ""; let rollNum = 1;
    if (rule === "coc") { rollNum = Math.floor(Math.random() * 10) + 1; const m = COC_MADNESS_TABLE.find((item) => item.roll === rollNum) || COC_MADNESS_TABLE[0]; madnessName = m.name; madnessDesc = m.desc; } 
    else { rollNum = Math.floor(Math.random() * 6) + 1; const m = INSANE_MADNESS_TABLE.find((item) => item.roll === rollNum) || INSANE_MADNESS_TABLE[0]; madnessName = m.name; madnessDesc = m.desc; }

    const madnessStatusStr = `일시적 광기: ${madnessName}`;
    setActiveMadnessAlert({ name: madnessName, desc: madnessDesc, loss: lossAmount, rule, roll: rollNum });
    setSessions((prev) => prev.map((s) => s.id === targetSessionId ? { ...s, sheet: { ...s.sheet, madnessStatus: madnessStatusStr } } : s ));
  };

  const applyMadnessToInput = () => { if (!activeMadnessAlert) return; setInput((prev) => `[광기 발작: ${activeMadnessAlert.name}] ` + prev); setActiveMadnessAlert(null); };
  const handleEditTitle = (id, currentTitle) => { const newTitle = window.prompt("시나리오 제목 변경:", currentTitle); if (newTitle !== null && newTitle.trim() !== "") { setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: newTitle.trim() } : s))); } };
  
  const adjustStat = (statName, delta) => {
    if (!activeSession) return;
    const currentVal = Number(activeSession.sheet?.[statName] ?? 10);
    const newVal = Math.max(0, currentVal + delta);

    if (statName === "san" && !activeSession.sheet?.madnessStatus) {
      if (activeSession.ruleMode === "coc" && delta <= -5) { triggerMadnessCheck("coc", Math.abs(delta), activeSessionId); } 
      else if (activeSession.ruleMode === "insane" && delta < 0) { triggerMadnessCheck("insane", Math.abs(delta), activeSessionId); }
    }

    const updatedSheet = { ...activeSession.sheet, [statName]: newVal };
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, sheet: updatedSheet } : s)));
  };

  const parseTagsSafely = (rawText) => {
    let cleanText = rawText || ""; let parsedData = { suggActions: [], pendingCheck: null, newSheetVars: {}, revealedSecrets: [], investigationSpots: [] };
    try {
      const suggMatch = cleanText.match(/<!--\s*SUGGESTIONS:\s*(\[.*?\])\s*-->/is); if (suggMatch) parsedData.suggActions = JSON.parse(suggMatch[1]);
      const spotsMatch = cleanText.match(/<!--\s*SPOTS:\s*(\[.*?\])\s*-->/is); if (spotsMatch) parsedData.investigationSpots = JSON.parse(spotsMatch[1]);
      const secRegex = /<!--\s*REVEAL_SECRET:\s*({.*?})\s*-->/gis; const secMatches = [...cleanText.matchAll(secRegex)]; secMatches.forEach((match) => { try { parsedData.revealedSecrets.push(JSON.parse(match[1])); } catch (e) {} });
      const statMatch = cleanText.match(/<!--\s*STATUS:\s*({.*?})\s*-->/is); if (statMatch) parsedData.newSheetVars = JSON.parse(statMatch[1]);
      const checkMatch = cleanText.match(/<!--\s*CHECK:\s*({.*?})\s*-->/is); if (checkMatch) parsedData.pendingCheck = JSON.parse(checkMatch[1]);
    } catch(e) {}
    cleanText = cleanText.replace(/```html|```json|```/gi, "").replace(/<!--[\s\S]*?-->/g, "").trim();
    return { cleanText, parsedData };
  };

  const startNewSession = async () => {
    const sessionTitleName = scenarioTitle || (charName ? `${charName}의 이야기` : "새로운 모험");
    const finalPref = playPreference.trim();
    
    const sessionNpcs = kpcList.filter(k => k.name.trim() !== "").map(k => ({
      name: k.name || "등장인물", title: k.job || "불명", portrait: getPortraitUrl(k.name || "companion"), affection: 10, state: "관망", detail: k.detail, secret: k.secret, secretRevealed: false
    }));

    let initialSheet = {
      name: charName || "주인공", job: charJob || "조사원", age: charAge, gender: charGender,
      portrait: charPortraitUrl || getPortraitUrl(charName), pastChronicle: pastChronicleText, hp: 20, maxHp: 20,
      npcs: sessionNpcs, items: [{ name: "기본 소지품", desc: "시작 템" }], madnessStatus: null,
    };

    if (wizardMode === "insane") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, phase: "메인", cycle: 1, scene: 1, mission: charMission || "생존한다.", secret: charSecret || "과거가 있다." };
    } else if (wizardMode === "coc") {
      initialSheet = { ...initialSheet, hp: derivedHp, maxHp: derivedHp, mp: derivedMp, maxMp: derivedMp, san: derivedSan, maxSan: 99, luck: Number(cocStats.luck), db: derivedDb, cocStats: { ...cocStats } };
    } else if (wizardMode === "unsung") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, erosion: 1, mutation: unsungMutation || "미확인 징후" };
    }

    const fullScenarioContext = `[시나리오 제목: ${sessionTitleName}]
[공개 시놉시스]
${publicSynopsis}

[키퍼 전용 기밀/진상/기믹/엔딩조건]
${hiddenTruth}`;

    const newId = Date.now();
    const newSession = { id: newId, title: sessionTitleName, ruleMode: wizardMode, preference: finalPref, scenarioText: fullScenarioContext, sheet: initialSheet, messages: [], suggestedActions: [], investigationSpots: [], pendingCheck: null };
    setSessions([newSession, ...sessions]); setActiveSessionId(newId); setIsLoading(true);

    const openingPrompt = `[세션 시작: 첫 서막]
서막을 열고 상황을 묘사하십시오. (반드시 정중한 ~합니다/였습니다 경어체 고정)
조사 가능한 구역 2~3곳을 본문 끝에 <!-- SPOTS: [{"name": "오브젝트명", "stat": "관찰력"}] --> 형식으로 추출하십시오.`;

    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", text: openingPrompt }], scenarioText: fullScenarioContext, playerSheet: initialSheet, ruleMode: wizardMode, playPreference: finalPref }) });
      const data = await response.json(); recordApiCall(data.usage);
      const { cleanText, parsedData } = parseTagsSafely(data.text);
      setSessions((prev) => prev.map((s) => s.id === newId ? { ...s, sheet: { ...initialSheet, ...parsedData.newSheetVars }, messages: [{ role: "model", text: cleanText }], suggestedActions: parsedData.suggActions, investigationSpots: parsedData.investigationSpots, pendingCheck: parsedData.pendingCheck } : s ));
    } catch (err) {
      setSessions((prev) => prev.map((s) => s.id === newId ? { ...s, messages: [{ role: "model", text: `오류: ${err.message}` }] } : s ));
    } finally { setIsLoading(false); }
  };

  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;
    const isDiceRollSubmission = textToSend.includes("[🎲");
    const updatedMessages = [...(activeSession.messages || []), { role: "user", text: textToSend }];
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [], pendingCheck: null } : s)));
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: updatedMessages, scenarioText: activeSession.scenarioText, playerSheet: activeSession.sheet, ruleMode: activeSession.ruleMode, playPreference: activeSession.preference }) });
      const data = await response.json(); recordApiCall(data.usage);
      const { cleanText, parsedData } = parseTagsSafely(data.text || "");
      if (isDiceRollSubmission) parsedData.pendingCheck = null;

      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };
      if (parsedData.revealedSecrets.length > 0) {
        parsedData.revealedSecrets.forEach((rev) => { newSheet.npcs = (newSheet.npcs || []).map((npc) => (npc.name === rev.name ? { ...npc, secret: rev.secret, secretRevealed: true } : npc)); });
      }

      setSessions((prev) => prev.map((s) => s.id === activeSessionId ? { ...s, sheet: newSheet, messages: [...updatedMessages, { role: "model", text: cleanText }], suggestedActions: parsedData.suggActions, investigationSpots: parsedData.investigationSpots, pendingCheck: parsedData.pendingCheck } : s ));
    } catch (err) { alert(`오류: ${err.message}`); } finally { setIsLoading(false); }
  };

  const sendMessage = () => { if (!input.trim()) return; executeMessage(input); setInput(""); };
  const handleUseItem = (itemName) => { setInput((prev) => `품에서 [${itemName}]을(를) 꺼내어 ` + prev); };
  const handleRollback = (msgIndex) => {
    if (!window.confirm("이 발언을 취소하시겠습니까?")) return;
    setInput(activeSession.messages[msgIndex].text); const newMessages = activeSession.messages.slice(0, msgIndex);
    setSessions((prev) => (prev.map((s) => (s.id === activeSessionId ? { ...s, messages: newMessages } : s))));
  };

  const rollDiceDirectly = (overrideTarget = null, skillName = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true); setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, pendingCheck: null } : s))); playDiceSound();
    const mode = activeSession.ruleMode;

    const rollInterval = setInterval(() => { setRollingDisplayNum(Math.floor(Math.random() * (mode === "coc" ? 100 : 20)) + 1); }, 50);

    setTimeout(() => {
      clearInterval(rollInterval);
      let rollFormatted = "";
      if (mode === "insane" || mode === "unsung") {
        const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const sum = d1 + d2;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : mode === "unsung" ? 6 : 5);
        let outcome = sum === 12 ? "스페셜(대성공)" : sum === 2 ? "펌블(대실패)" : sum >= targetVal ? "성공" : "실패";
        rollFormatted = `[🎲 시스템 공인 2D6 판정: ${d1}+${d2}=${sum} / 목표: ${targetVal}${skillName ? ` (${skillName})` : ""} ➔ 결과: ${outcome}]`;
      } else if (mode === "coc") {
        const roll = Math.floor(Math.random() * 100) + 1;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : activeSession.sheet?.san ?? 50);
        let outcome = roll === 1 ? "대성공" : roll <= Math.floor(targetVal / 5) ? "극단적 성공" : roll <= Math.floor(targetVal / 2) ? "어려운 성공" : roll <= targetVal ? "보통 성공" : roll >= 96 ? "대실패" : "실패";
        rollFormatted = `[🎲 CoC 1D100 ${skillName ? `${skillName} ` : ""}판정: ${roll} / 목표치: ${targetVal}% ➔ 결과: ${outcome}]`;
      } else {
        const roll = Math.floor(Math.random() * 20) + 1;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : 12);
        const outcome = roll >= targetVal ? "성공" : "실패";
        rollFormatted = `[🎲 판정: 1D20 결과 ${roll} / 목표: ${targetVal}${skillName ? ` (${skillName})` : ""} ➔ 결과: ${outcome}]`;
      }
      setIsRolling(false); executeMessage(rollFormatted);
    }, animationEnabled ? 650 : 150);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { const saved = localStorage.getItem("rp_hub_sessions"); if (saved) setSessions(JSON.parse(saved)); const savedDark = localStorage.getItem("rp_hub_darkmode"); if (savedDark !== null) setIsDarkMode(savedDark === "true"); } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (!isLoaded || typeof window === "undefined") return; try { localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions)); } catch (e) {} }, [sessions, isLoaded]);

  const lastMsgText = activeSession?.messages?.[activeSession.messages.length - 1]?.text || "";
  const lastUserMsg = (activeSession?.messages || []).slice().reverse().find((m) => m.role === "user")?.text || "";
  const justRolledSan = lastUserMsg.includes("이성(SAN) 판정");
  const isSanCheckDetected = activeSession?.ruleMode === "coc" && !activeSession?.sheet?.madnessStatus && !activeMadnessAlert && !justRolledSan && (activeSession?.pendingCheck?.skill?.includes("이성") || lastMsgText.includes("산 체크를 진행") || lastMsgText.includes("이성 체크를 진행") || lastMsgText.includes("산치 체크를 요구"));

  return (
    <div style={{ display: "flex", height: "100dvh", width: "100vw", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(140, 160, 210, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(140, 160, 210, 0.4); }
        @keyframes diceTumble { 0% { transform: rotate(0deg) scale(0.85); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
        .anim-dice-rolling { animation: diceTumble 0.35s infinite linear; }
        .glass-card { background: ${isDarkMode ? "rgba(21, 26, 38, 0.85)" : "rgba(255, 255, 255, 0.9)"}; backdrop-filter: blur(14px); border: 1px solid ${theme.border}; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
      `}</style>
      
      {showInsanityFlash && <div style={{ position: "fixed", inset: 0, zIndex: 120, backgroundColor: "rgba(220, 20, 60, 0.35)", pointerEvents: "none", transition: "opacity 0.5s ease" }} />}
      {isMobile && isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 45, backdropFilter: "blur(4px)" }} />}
      {isMobile && isSheetOpen && <div onClick={() => setIsSheetOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 45, backdropFilter: "blur(4px)" }} />}

      {/* 1. 좌측 사이드바 */}
      <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, left: 0, top: 0, bottom: 0, height: isMobile ? "100dvh" : "100%", width: isSidebarOpen ? "260px" : "0px", minWidth: isSidebarOpen ? "260px" : "0px", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden", backgroundColor: theme.sidebar, borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px", flexShrink: 0 }}>
          <button onClick={() => { setActiveSessionId(null); if (isMobile) setIsSidebarOpen(false); }} style={{ flex: 1, padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", boxShadow: `0 2px 8px ${theme.accentGlow}` }}>+ 새 시나리오</button>
          <button onClick={handleToggleDarkMode} style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px" }}>
          {sessions.map((s) => (
            <div key={s.id} onClick={() => { setActiveSessionId(s.id); if (isMobile) setIsSidebarOpen(false); }} style={{ padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "4px", backgroundColor: activeSessionId === s.id ? theme.panelAlt : "transparent", border: activeSessionId === s.id ? `1px solid ${theme.border}` : "1px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "6px" }}>
                <div style={{ fontWeight: "700", fontSize: "0.84rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{s.ruleMode}</div>
              </div>
              <button onClick={(e) => deleteSession(s.id, e)} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px" }}>🗑️</button>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px", paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0, backgroundColor: theme.sidebar }}>
          {activeSession && <button onClick={() => openModal(setShowExportModal)} style={{ width: "100%", padding: "10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.82rem", fontWeight: "600" }}>📥 대화록 내보내기</button>}
          <button onClick={() => openModal(setShowSettingsModal)} style={{ width: "100%", padding: "10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.82rem", fontWeight: "700" }}>⚙️ 설정</button>
        </div>
      </div>

      {/* 2. 중앙 메인 뷰 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {!activeSession ? (
          /* 세션 생성 마법사 */
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 140px 14px" : "28px 24px 80px 24px", maxWidth: "1080px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", paddingBottom: "12px", borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "6px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.02em" }}>새로운 세션 구성</h2>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>원하는 룰과 인물 설정으로 즉석에서 서사를 직조합니다.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleProceduralGenerate} style={{ padding: "8px 14px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: "20px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700" }}>🎲 무작위 조합 생성</button>
                <button onClick={handleAiGenerate} disabled={isAiGenerating} style={{ padding: "8px 14px", backgroundColor: theme.accent, border: "none", color: "#fff", borderRadius: "20px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", boxShadow: `0 2px 8px ${theme.accentGlow}` }}>
                  {isAiGenerating ? "AI 기획 중..." : "✨ AI 즉석 생성"}
                </button>
              </div>
            </div>

            {/* 1. 룰 선택 바 */}
            <div className="glass-card" style={{ padding: "16px", borderRadius: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: "800", fontSize: "0.88rem" }}>1. TRPG 룰 시스템 선택</span>
                <button onClick={() => setRuleHelpModalKey(wizardMode)} style={{ background: "none", border: "none", color: theme.accent, fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline" }}>현재 룰 가이드 열람 ?</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr repeat(3, 1fr)", gap: "8px" }}>
                <div onClick={() => { setRuleCategory("freeform"); setWizardMode("freeform"); }} style={{ padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${wizardMode === "freeform" ? theme.accent : theme.border}`, backgroundColor: wizardMode === "freeform" ? theme.panelAlt : "transparent", cursor: "pointer" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.85rem", color: theme.accent }}>자유 서사 (1D20)</div>
                  <div style={{ fontSize: "0.68rem", color: theme.textMuted, marginTop: "2px" }}>직관적 판정 / 샌드박스</div>
                </div>
                {[
                  { key: "coc", name: "크툴루의 부름 (CoC)", sub: "1D100 / 정규 460pt & 광기", color: theme.danger },
                  { key: "insane", name: "인세인 (inSANe)", sub: "2D6 / 사명과 비밀 & 광기", color: theme.warning },
                  { key: "unsung", name: "언성 듀엣", sub: "2D6 / 이계 침식 구원", color: "#b87bd8" },
                ].map((item) => (
                  <div key={item.key} onClick={() => { setRuleCategory("official"); setWizardMode(item.key); }} style={{ padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${wizardMode === item.key ? item.color : theme.border}`, backgroundColor: wizardMode === item.key ? theme.panelAlt : "transparent", cursor: "pointer", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", fontSize: "0.85rem", color: item.color }}>{item.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setRuleHelpModalKey(item.key); }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.78rem", cursor: "pointer", padding: "0 4px" }}>?</button>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: theme.textMuted, marginTop: "2px" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2열 대시보드 구조 */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", alignItems: "start" }}>
              
              {/* 좌측 칼럼 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* 2. 탐사자 프로필 (상단 버튼 및 나이/성별 입력란 복구) */}
                <div className="glass-card" style={{ padding: "18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem" }}>2. 탐사자 프로필</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button type="button" onClick={() => openModal(setShowCareerModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "6px", color: theme.warning, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>🔄 서사 계승</button>
                      <button type="button" onClick={() => openModal(setShowPresetModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "6px", color: theme.accent, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>📂 프리셋</button>
                      {showPortraits && <button type="button" onClick={() => openModal(setShowPortraitEditModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>🖼️ 초상화</button>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {showPortraits && (
                      <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.accent}`, flexShrink: 0, backgroundColor: theme.panelAlt, boxShadow: `0 2px 10px ${theme.accentGlow}` }}>
                        <img src={charPortraitUrl || getPortraitUrl(`${charName || "character"}`)} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr", gap: "6px" }}>
                      <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="이름" style={{ width: "100%", minWidth: 0, padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem" }} />
                      <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업 / 역할" style={{ width: "100%", minWidth: 0, padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem" }} />
                      <input type="text" value={charAge} onChange={(e) => setCharAge(e.target.value)} placeholder="나이" style={{ width: "100%", minWidth: 0, padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem" }} />
                      <input type="text" value={charGender} onChange={(e) => setCharGender(e.target.value)} placeholder="성별" style={{ width: "100%", minWidth: 0, padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem" }} />
                    </div>
                  </div>

                  <textarea value={charBackground} onChange={(e) => setCharBackground(e.target.value)} placeholder="인물의 성격, 상세 백스토리, 품에 지닌 소지품 3가지 등을 입력하세요." style={{ width: "100%", minWidth: 0, height: "70px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, resize: "vertical", fontSize: "0.8rem", lineHeight: "1.5" }} />
                </div>

                {/* 룰 전용 특수 카드 UI 완벽 복구 */}
                {wizardMode === "coc" && (
                  <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", border: `1.5px solid ${theme.danger}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.danger }}>CoC 7판 특성치 (460 pt)</span>
                      <button type="button" onClick={() => {
                        const base = [30, 30, 30, 30, 30, 30, 30, 30]; let rem = 220; while (rem > 0) { const idx = Math.floor(Math.random() * 8); if (base[idx] < 85) { base[idx] += 5; rem -= 5; } }
                        setCocStats({ str: base[0], con: base[1], siz: base[2], dex: base[3], app: base[4], int: base[5], pow: base[6], edu: base[7], luck: Math.floor(Math.random() * 50) + 40 });
                      }} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.accent, fontSize: "0.74rem", cursor: "pointer", fontWeight: "700" }}>🎲 자동 분배</button>
                    </div>

                    <div style={{ fontSize: "0.78rem", display: "flex", justifyContent: "space-between", padding: "6px 10px", backgroundColor: theme.panelAlt, borderRadius: "8px", marginBottom: "10px" }}>
                      <span>포인트 풀: <strong>460 pt</strong></span>
                      <span style={{ color: remainingPoints < 0 ? theme.danger : theme.success, fontWeight: "700" }}>잔여: {remainingPoints} pt {remainingPoints < 0 ? "(초과)" : ""}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                      {[{ key: "str", label: "근력(STR)" }, { key: "con", label: "건강(CON)" }, { key: "siz", label: "크기(SIZ)" }, { key: "dex", label: "민첩(DEX)" }, { key: "app", label: "외모(APP)" }, { key: "int", label: "지능(INT)" }, { key: "pow", label: "정신력(POW)" }, { key: "edu", label: "교육(EDU)" }].map((stat) => (
                        <div key={stat.key} style={{ minWidth: 0 }}>
                          <label style={{ display: "block", fontSize: "0.68rem", color: theme.textMuted }}>{stat.label}</label>
                          <input type="number" min="15" max="90" value={cocStats[stat.key]} onChange={(e) => setCocStats({ ...cocStats, [stat.key]: e.target.value })} style={{ width: "100%", minWidth: 0, padding: "5px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem", textAlign: "center" }} />
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: "8px 10px", backgroundColor: theme.inputBg, borderRadius: "8px", fontSize: "0.75rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                      <div>행운: <input type="number" value={cocStats.luck} onChange={(e) => setCocStats({ ...cocStats, luck: e.target.value })} style={{ width: "40px", padding: "2px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", textAlign: "center" }} /></div>
                      <div>체력: <strong>{derivedHp}</strong></div>
                      <div>마력: <strong>{derivedMp}</strong></div>
                      <div>이성(SAN): <strong>{derivedSan}</strong></div>
                      <div>DB: <strong>{derivedDb}</strong></div>
                    </div>
                  </div>
                )}

                {wizardMode === "insane" && (
                  <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", border: `1.5px solid ${theme.warning}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.warning }}>인세인 사명 및 비밀 (HP 6 / SAN 6)</span>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", color: theme.textMuted, marginBottom: "2px" }}>겉보기 사명 (공개 정보)</label>
                      <input type="text" value={charMission} onChange={(e) => setCharMission(e.target.value)} style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", color: theme.danger, marginBottom: "2px" }}>🔒 나의 비밀 (Secret - 미공개)</label>
                      <textarea value={charSecret} onChange={(e) => setCharSecret(e.target.value)} style={{ width: "100%", height: "55px", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.danger}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem", resize: "none" }} />
                    </div>
                  </div>
                )}

                {wizardMode === "unsung" && (
                  <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", border: "1.5px solid #b87bd8", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.85rem", color: "#b87bd8" }}>언성 듀엣: 이계 침식도(0~6) 및 변이 징후</span>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", color: theme.textMuted, marginBottom: "2px" }}>신체/정신적 변이 징후 (Mutation)</label>
                      <input type="text" value={unsungMutation} onChange={(e) => setUnsungMutation(e.target.value)} placeholder="예: 왼쪽 눈동자가 푸른빛으로 물듦" style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem" }} />
                    </div>
                  </div>
                )}
                
                {/* 4. KPC 설정 분리 추가 */}
                <div className="glass-card" style={{ padding: "18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem", color: theme.warning }}>4. KPC (주요 등장인물) 설정</span>
                    <button type="button" onClick={handleAddKpc} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "6px", color: theme.warning, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>+ 인물 추가 ({kpcList.length}/10)</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
                    {kpcList.length === 0 && <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>등록된 KPC가 없습니다.</div>}
                    {kpcList.map((kpc, idx) => (
                      <div key={kpc.id} style={{ backgroundColor: theme.panelAlt, padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                          <input type="text" value={kpc.name} onChange={(e) => updateKpc(kpc.id, 'name', e.target.value)} placeholder="이름" style={{ flex: 1, padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.78rem" }} />
                          <input type="text" value={kpc.job} onChange={(e) => updateKpc(kpc.id, 'job', e.target.value)} placeholder="역할" style={{ flex: 1, padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.78rem" }} />
                          <button onClick={() => handleRemoveKpc(kpc.id)} style={{ padding: "4px 8px", background: "none", border: "none", color: theme.danger, cursor: "pointer" }}>✕</button>
                        </div>
                        <textarea value={kpc.detail} onChange={(e) => updateKpc(kpc.id, 'detail', e.target.value)} placeholder="성격, 외형, PC와의 관계" style={{ width: "100%", height: "45px", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", marginBottom: "6px" }} />
                        <textarea value={kpc.secret} onChange={(e) => updateKpc(kpc.id, 'secret', e.target.value)} placeholder="🔒 이 인물이 숨기고 있는 진심이나 비밀" style={{ width: "100%", height: "45px", padding: "6px", backgroundColor: "rgba(247, 101, 133, 0.1)", border: `1px dashed ${theme.danger}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem" }} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 우측 칼럼 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* 3. 서사 및 관계성 지향 태그 유지 */}
                <div className="glass-card" style={{ padding: "18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem", color: theme.accent }}>3. 서사 및 관계성 지향 태그</span>
                    <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>원클릭 토글</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {[...ORIENT_TAGS, ...TROPE_TAGS].map((tag) => {
                      const isActive = playPreference.includes(tag);
                      return (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: "5px 11px", borderRadius: "20px", fontSize: "0.74rem", fontWeight: isActive ? "700" : "500", backgroundColor: isActive ? theme.accent : theme.panelAlt, color: isActive ? "#fff" : theme.text, border: `1px solid ${isActive ? theme.accent : theme.border}`, cursor: "pointer", transition: "all 0.15s ease" }}>{tag}</button>
                      );
                    })}
                  </div>
                  <textarea value={playPreference} onChange={(e) => setPlayPreference(e.target.value)} placeholder="태그를 클릭하거나 원하는 관계성 지침을 직접 입력하세요." style={{ width: "100%", minWidth: 0, height: "65px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, resize: "vertical", fontSize: "0.8rem", lineHeight: "1.5" }} />
                </div>

                {/* 5. 시나리오 개요 및 진상 (스포일러 분리) */}
                <div className="glass-card" style={{ padding: "18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem" }}>5. 시나리오 개요 및 진상 (스포일러 분리)</span>
                    <button type="button" onClick={handleAutoReplaceKpcPc} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "6px", color: theme.accent, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>🔄 PC/KPC 이름 치환</button>
                  </div>
                  <input type="text" value={scenarioTitle} onChange={(e) => setScenarioTitle(e.target.value)} placeholder="시나리오 제목" style={{ width: "100%", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.9rem", fontWeight: "700" }} />
                  <div>
                    <label style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px", display: "block" }}>[공개 시놉시스] 플레이어에게 주어지는 초기 정보</label>
                    <textarea value={publicSynopsis} onChange={(e) => setPublicSynopsis(e.target.value)} placeholder="도입부, 소문, 미스터리 등 스포일러 없는 배경 설명을 입력하세요." style={{ width: "100%", height: "80px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem", resize: "vertical" }} />
                  </div>
                  <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "12px", marginTop: "4px" }}>
                    <button type="button" onClick={() => setShowHiddenTruth(!showHiddenTruth)} style={{ width: "100%", padding: "10px", backgroundColor: showHiddenTruth ? "rgba(247, 101, 133, 0.15)" : theme.panelAlt, border: `1px solid ${showHiddenTruth ? theme.danger : theme.border}`, borderRadius: "8px", color: showHiddenTruth ? theme.danger : theme.text, cursor: "pointer", fontWeight: "700", fontSize: "0.8rem", transition: "all 0.2s" }}>
                      {showHiddenTruth ? "🔒 키퍼 전용 진상 닫기" : "👀 키퍼 전용 스포일러/진상 열람하기"}
                    </button>
                    {showHiddenTruth && (
                      <div style={{ marginTop: "8px", animation: "fadeIn 0.3s ease" }}>
                        <div style={{ fontSize: "0.72rem", color: theme.danger, marginBottom: "6px" }}>⚠️ 플레이어 열람 주의! 마스터만 참조하는 사건의 흑막과 엔딩 분기입니다.</div>
                        <textarea value={hiddenTruth} onChange={(e) => setHiddenTruth(e.target.value)} placeholder="흑막의 정체, 특수 기믹, 트루/배드 엔딩 조건을 기입하세요." style={{ width: "100%", height: "120px", padding: "10px", backgroundColor: "rgba(247, 101, 133, 0.05)", border: `1px solid ${theme.danger}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem", resize: "vertical", lineHeight: "1.5" }} />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <button onClick={startNewSession} disabled={isLoading || isPdfLoading} style={{ width: "100%", padding: "16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "1.05rem", boxShadow: `0 4px 16px ${theme.accentGlow}`, letterSpacing: "0.02em" }}>
              {isLoading ? "키퍼가 서막을 여는 중..." : "이야기 시작하기"}
            </button>
          </div>
        ) : (
          /* 플레이어 룸 (기존 코드 그대로 렌더링 유지됨) */
          <>
            <div style={{ minHeight: "50px", padding: isMobile ? "0 10px" : "0 16px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, flex: 1 }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <span style={{ fontWeight: "800", fontSize: isMobile ? "0.82rem" : "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "120px" : "220px" }}>{activeSession?.title}</span>
                <button onClick={() => handleEditTitle(activeSession.id, activeSession.title)} title="제목 변경" style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: "0.75rem", padding: "2px", flexShrink: 0 }}>✏️</button>
                {activeSession?.ruleMode === "insane" && ( <span style={{ padding: "1px 5px", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1px solid ${theme.warning}`, borderRadius: "4px", fontSize: "0.65rem", color: theme.warning, fontWeight: "700", whiteSpace: "nowrap", flexShrink: 0 }}>{activeSession?.sheet?.cycle || 1}C / {activeSession?.sheet?.scene || 1}S</span> )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px", flexShrink: 0 }}>
                {activeSession?.ruleMode === "coc" && ( <button onClick={() => rollDiceDirectly(activeSession.sheet?.san ?? 50, "이성(SAN)")} disabled={isRolling || isLoading} style={{ padding: isMobile ? "5px 8px" : "6px 12px", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1.5px solid ${theme.danger}`, color: theme.danger, borderRadius: "16px", cursor: "pointer", fontWeight: "800", fontSize: isMobile ? "0.72rem" : "0.78rem", whiteSpace: "nowrap" }}>🧠 {isMobile ? `${activeSession.sheet?.san ?? 50}` : `산 체크 (${activeSession.sheet?.san ?? 50})`}</button> )}
                <button onClick={() => rollDiceDirectly()} disabled={isRolling || isLoading} style={{ padding: isMobile ? "5px 8px" : "6px 14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "16px", cursor: "pointer", fontWeight: "700", fontSize: isMobile ? "0.72rem" : "0.8rem", whiteSpace: "nowrap" }}>🎲 {isMobile ? "판정" : `주사위 (${activeSession?.ruleMode === "coc" ? "1D100" : activeSession?.ruleMode === "freeform" ? "1D20" : "2D6"})`}</button>
                <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: isMobile ? "5px 8px" : "5px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}>{isSheetOpen ? "시트▶" : "◀시트"}</button>
              </div>
            </div>

            {activeSession?.sheet?.madnessStatus && (
              <div style={{ padding: "5px 14px", backgroundColor: "rgba(247, 101, 133, 0.25)", borderBottom: `1px solid ${theme.danger}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: theme.danger, fontWeight: "700" }}>
                <span>⚠️ {activeSession.sheet.madnessStatus}</span>
                <button onClick={() => setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, madnessStatus: null } } : s))} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.72rem", cursor: "pointer" }}>해제 ✕</button>
              </div>
            )}

            <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "14px", position: "relative" }}>
              {isRolling && animationEnabled && (
                <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)", zIndex: 50, backgroundColor: theme.panel, border: `2px solid ${theme.accent}`, borderRadius: "14px", padding: "12px 28px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                  <span className="anim-dice-rolling" style={{ fontSize: "2rem", display: "inline-block" }}>🎲</span>
                  <div><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>운명의 주사위 롤링 중...</div><div style={{ fontSize: "1.35rem", fontWeight: "800", color: theme.accent }}>{rollingDisplayNum}</div></div>
                </div>
              )}

              {(activeSession?.messages || []).map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "92%" : "82%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ backgroundColor: m.text.includes("[🎲") || m.text.includes("[⚠️") ? "rgba(229, 169, 60, 0.12)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi, color: m.role === "user" && !m.text.includes("[🎲") && !m.text.includes("[⚠️") ? "#ffffff" : theme.text, border: m.text.includes("[⚠️") ? `1px solid ${theme.danger}` : m.text.includes("[🎲") ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`, padding: "14px 18px", borderRadius: "14px", lineHeight: "1.75", whiteSpace: "pre-wrap", fontSize: "0.92rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", }}>
                    {m.text}
                  </div>
                  {m.role === "user" && ( <button onClick={() => handleRollback(i)} title="이 발언 취소 및 재작성" style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.7rem", cursor: "pointer", marginTop: "4px" }}>↩️ 수정/되돌리기</button> )}
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.85rem", padding: "4px" }}>마스터가 서사를 집필하는 중...</div>}
            </div>

            <div style={{ backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "6px", padding: "8px 14px" }}>
              {activeMadnessAlert && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(247, 101, 133, 0.25)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "0.8rem", color: theme.danger }}>🩸 <strong>충격! [{activeMadnessAlert.name}] 발현</strong><div style={{ fontSize: "0.72rem", color: theme.textMuted, marginTop: "2px" }}>{activeMadnessAlert.desc}</div></div>
                  <button onClick={applyMadnessToInput} style={{ padding: "5px 12px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap", marginLeft: "8px" }}>대사 작성에 반영</button>
                </div>
              )}
              {isSanCheckDetected && !isLoading && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "800", color: theme.danger }}>🩸 키퍼의 이성(SAN) 체크 선언! (현재 SAN: {activeSession.sheet?.san ?? 50}%)</span>
                  <button onClick={() => rollDiceDirectly(activeSession.sheet?.san ?? 50, "이성(SAN)")} style={{ padding: "5px 12px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.78rem", cursor: "pointer" }}>🎲 즉시 산 체크 굴리기</button>
                </div>
              )}
              {activeSession?.pendingCheck && !isSanCheckDetected && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(247, 101, 133, 0.15)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: theme.danger }}>⚠️ 키퍼 판정 요구: {activeSession.pendingCheck.skill} (목표치: {activeSession.pendingCheck.target || 50}%)</span>
                  <button onClick={() => rollDiceDirectly(activeSession.pendingCheck.target, activeSession.pendingCheck.skill)} style={{ padding: "5px 12px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.78rem", cursor: "pointer" }}>🎲 즉시 판정 굴리기</button>
                </div>
              )}
              {(activeSession?.investigationSpots || []).length > 0 && !isLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.74rem", color: theme.warning, fontWeight: "700" }}>🔍 조사 구역:</span>
                  {activeSession.investigationSpots.map((spot, idx) => ( <button key={idx} onClick={() => setInput((prev) => `[조사: ${spot.name}] ` + prev)} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "14px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "600" }}>{spot.name}</button> ))}
                </div>
              )}
              {suggestionsEnabled && (activeSession?.suggestedActions || []).length > 0 && !isLoading && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.74rem", color: theme.accent, fontWeight: "700", display: "flex", alignItems: "center" }}>💡 제안:</span>
                  {(activeSession?.suggestedActions || []).map((sugg, idx) => ( <button key={idx} onClick={() => setInput(sugg)} style={{ padding: "5px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "16px", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>{sugg}</button> ))}
                </div>
              )}
            </div>

            <div style={{ padding: "10px 14px", paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (!isMobile && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="행동이나 대사를 입력하세요 (조사 버튼 클릭 시 멘트 병행 가능)..." style={{ flex: 1, minHeight: "52px", maxHeight: "130px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px", outline: "none", fontSize: "16px", lineHeight: "1.4", resize: "vertical" }} />
              <button onClick={sendMessage} disabled={isLoading} style={{ height: "52px", padding: "0 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.88rem", boxShadow: `0 2px 8px ${theme.accentGlow}` }}>전송</button>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 상태창 (시트 유지) */}
      {activeSession && (
        <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, right: 0, top: 0, bottom: 0, height: isMobile ? "100dvh" : "100%", width: isSheetOpen ? "290px" : "0px", minWidth: isSheetOpen ? "290px" : "0px", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden", backgroundColor: theme.sidebar, borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px", paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", width: "290px", height: "100%" }}>
            
            <div className="glass-card" style={{ borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.accent }}>⚡ API 한도 (추정치)</span>
                <span style={{ fontSize: "0.68rem", padding: "1px 6px", backgroundColor: theme.panelAlt, borderRadius: "4px", color: theme.textMuted }}>Free Tier</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "4px" }}>
                <span>오늘 호출 (RPD):</span><strong>{apiUsage.dailyRequests} / 1,500회</strong>
              </div>
              <div style={{ height: "5px", width: "100%", backgroundColor: theme.panelAlt, borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${quotaPercentage}%`, backgroundColor: quotaPercentage > 85 ? theme.danger : quotaPercentage > 60 ? theme.warning : theme.success }} />
              </div>
            </div>

            {activeSession.preference && (
              <div className="glass-card" style={{ fontSize: "0.74rem", padding: "8px 10px", borderRadius: "8px", lineHeight: "1.4" }}>
                <strong style={{ color: theme.accent }}>🎭 서사 지향:</strong><div style={{ color: theme.textMuted, marginTop: "2px" }}>{activeSession.preference}</div>
              </div>
            )}

            {activeSession.ruleMode === "coc" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: `1.5px solid ${theme.danger}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: theme.danger, fontWeight: "800" }}>조사원 기밀 시트</h4>
                  {showPortraits && <button onClick={() => openModal(setShowPortraitEditModal)} style={{ padding: "2px 6px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.68rem", cursor: "pointer" }}>✏️</button>}
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                  {showPortraits && ( <div style={{ position: "relative", width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.danger}`, flexShrink: 0, backgroundColor: theme.panelAlt }}> <img src={activeSession.sheet?.portrait || getPortraitUrl(activeSession.sheet?.name)} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} /> </div> )}
                  <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column" }}><strong>{activeSession.sheet?.name || "탐사자"}</strong><span style={{ fontSize: "0.72rem", color: theme.textMuted }}>{activeSession.sheet?.job || "조사원"}</span></div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", backgroundColor: theme.panelAlt, padding: "10px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", marginBottom: "3px" }}>
                      <span style={{ color: theme.danger, fontWeight: "700" }}>이성 (SAN)</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <button onClick={() => adjustStat("san", -5)} title="5점 급감 (광기 테스트)" style={{ padding: "1px 5px", backgroundColor: "rgba(247, 101, 133, 0.25)", border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: "4px", cursor: "pointer", fontSize: "0.68rem", fontWeight: "800" }}>-5</button>
                        <button onClick={() => adjustStat("san", -1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", cursor: "pointer", fontWeight: "800" }}>-</button>
                        <strong style={{ minWidth: "44px", textAlign: "center" }}>{activeSession.sheet?.san ?? 50} / 99</strong>
                        <button onClick={() => adjustStat("san", 1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", cursor: "pointer", fontWeight: "800" }}>+</button>
                      </div>
                    </div>
                    <div style={{ height: "6px", width: "100%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min(100, Math.max(0, ((activeSession.sheet?.san ?? 50) / 99) * 100))}%`, backgroundColor: theme.danger, transition: "width 0.3s ease" }} /></div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", marginBottom: "3px" }}>
                      <span style={{ color: theme.warning, fontWeight: "700" }}>체력 (HP)</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                        <button onClick={() => adjustStat("hp", -1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", cursor: "pointer", fontWeight: "800" }}>-</button>
                        <strong style={{ minWidth: "44px", textAlign: "center" }}>{activeSession.sheet?.hp ?? 10} / {activeSession.sheet?.maxHp ?? 10}</strong>
                        <button onClick={() => adjustStat("hp", 1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", cursor: "pointer", fontWeight: "800" }}>+</button>
                      </div>
                    </div>
                    <div style={{ height: "6px", width: "100%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min(100, Math.max(0, ((activeSession.sheet?.hp ?? 10) / (activeSession.sheet?.maxHp ?? 10)) * 100))}%`, backgroundColor: theme.warning, transition: "width 0.3s ease" }} /></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", paddingTop: "4px", borderTop: `1px dashed ${theme.border}`, color: theme.textMuted }}>
                    <span>행운: <strong style={{ color: theme.text }}>{activeSession.sheet?.luck ?? 50}</strong></span><span>마력: <strong style={{ color: theme.text }}>{activeSession.sheet?.mp ?? 10}</strong></span><span>DB: <strong style={{ color: theme.text }}>{activeSession.sheet?.db || "0"}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {activeSession.ruleMode === "insane" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: `1.5px solid ${theme.warning}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: theme.warning, fontWeight: "800" }}>인세인 파일철</h4>
                  <button onClick={() => triggerMadnessCheck("insane", 1, activeSessionId)} style={{ padding: "2px 6px", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1px solid ${theme.warning}`, color: theme.warning, borderRadius: "4px", fontSize: "0.68rem", cursor: "pointer", fontWeight: "700" }}>🎲 광기 유발</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", backgroundColor: theme.panelAlt, padding: "8px", borderRadius: "8px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem" }}>
                    <span style={{ color: theme.danger, fontWeight: "700" }}>이성 (SAN):</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <button onClick={() => adjustStat("san", -1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", cursor: "pointer" }}>-</button>
                      <strong>{activeSession.sheet?.san ?? 6} / {activeSession.sheet?.maxSan ?? 6}</strong>
                      <button onClick={() => adjustStat("san", 1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", cursor: "pointer" }}>+</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem" }}>
                    <span style={{ color: theme.warning, fontWeight: "700" }}>생명력 (HP):</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <button onClick={() => adjustStat("hp", -1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", cursor: "pointer" }}>-</button>
                      <strong>{activeSession.sheet?.hp ?? 6} / {activeSession.sheet?.maxHp ?? 6}</strong>
                      <button onClick={() => adjustStat("hp", 1)} style={{ padding: "1px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", cursor: "pointer" }}>+</button>
                    </div>
                  </div>
                </div>
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px", marginBottom: "8px", fontSize: "0.74rem" }}>
                  <div style={{ fontWeight: "700", color: theme.accent, marginBottom: "2px" }}>📜 공개 사명:</div><div>{activeSession.sheet?.mission || "생존하여 진실을 밝힌다."}</div>
                </div>
                <div style={{ backgroundColor: "rgba(224, 83, 108, 0.15)", border: `1.5px dashed ${theme.danger}`, borderRadius: "8px", padding: "10px", fontSize: "0.74rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "800", color: theme.danger }}>🔒 나의 비밀 (Secret)</span><span style={{ fontSize: "0.68rem", color: "#fca5a5" }}>절대 기밀</span>
                  </div>
                  <div style={{ color: "#fca5a5", lineHeight: "1.4" }}>{activeSession.sheet?.secret || "과거의 죄악이 봉인되어 있다."}</div>
                </div>
              </div>
            )}

            {activeSession.ruleMode === "unsung" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: "1.5px solid #b87bd8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: "#b87bd8", fontWeight: "800" }}>언성 듀엣: 조난자 기록</h4><span style={{ fontSize: "0.7rem", color: "#b87bd8", fontWeight: "700" }}>2D6 이계 서사</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem" }}>
                    <span style={{ fontWeight: "700", color: "#b87bd8" }}>이계 침식도 (Erosion)</span><strong>{activeSession.sheet?.erosion ?? 1} / 6</strong>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[0, 1, 2, 3, 4, 5].map((idx) => { const filled = idx < (activeSession.sheet?.erosion ?? 1); return ( <div key={idx} style={{ flex: 1, height: "10px", borderRadius: "2px", backgroundColor: filled ? "#b87bd8" : "rgba(255,255,255,0.08)", boxShadow: filled ? "0 0 8px #b87bd8" : "none", transition: "all 0.3s ease" }} /> ); })}
                  </div>
                </div>
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px", fontSize: "0.74rem" }}>
                  <div style={{ fontWeight: "700", color: "#b87bd8", marginBottom: "2px" }}>🌀 발현된 변이 징후:</div><div style={{ color: theme.textMuted }}>{activeSession.sheet?.mutation || "잠재적 침식 진행 중"}</div>
                </div>
              </div>
            )}

            {activeSession.ruleMode === "freeform" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: theme.accent, fontWeight: "800" }}>자유 서사 기록지</h4><span style={{ fontSize: "0.7rem", color: theme.textMuted }}>1D20 샌드박스</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: theme.textMuted, lineHeight: "1.5" }}>
                  <div><strong>{activeSession.sheet?.name || "주인공"}</strong> ({activeSession.sheet?.job || "모험가"})</div><div>HP: <strong>{activeSession.sheet?.hp || 20} / {activeSession.sheet?.maxHp || 20}</strong></div>
                </div>
              </div>
            )}

            {/* 소지품 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "0.84rem", color: theme.accent, fontWeight: "800" }}>🎒 소지품 및 인벤토리</h4><span style={{ fontSize: "0.7rem", color: theme.textMuted }}>{(activeSession.sheet?.items || []).length}개</span>
              </div>
              {(!activeSession.sheet?.items || activeSession.sheet.items.length === 0) ? (
                <div style={{ fontSize: "0.76rem", color: theme.textMuted }}>소지품이 비어 있습니다.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {activeSession.sheet.items.map((item, idx) => (
                    <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "7px 10px", fontSize: "0.76rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{item.name}</strong><button onClick={() => handleUseItem(item.name)} style={{ padding: "2px 7px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.accent, borderRadius: "4px", cursor: "pointer", fontSize: "0.68rem", fontWeight: "700" }}>사용</button>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            {/* KPC 등장인물 리스트 (기밀 해제 포함) */}
            <div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.84rem", color: theme.warning, fontWeight: "800" }}>주요 등장인물 (KPC)</h4>
              {(!activeSession.sheet?.npcs || activeSession.sheet.npcs.length === 0) ? (
                <div style={{ fontSize: "0.76rem", color: theme.textMuted }}>등장인물 없음</div>
              ) : (
                activeSession.sheet.npcs.map((npc, idx) => (
                  <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 10px", marginBottom: "6px", fontSize: "0.76rem" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {showPortraits && ( <div style={{ width: "34px", height: "34px", borderRadius: "50%", overflow: "hidden", border: `1px solid ${theme.border}`, flexShrink: 0, backgroundColor: theme.panelAlt }}> <img src={npc.portrait || getPortraitUrl(`${npc.name}, portrait`)} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} /> </div> )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "700", display: "flex", justifyContent: "space-between" }}>
                          <span>{npc.name} <span style={{fontSize:"0.65rem", color: theme.textMuted}}>({npc.title})</span></span>
                          <span style={{ color: theme.danger }}>♥ {npc.affection || 0}</span>
                        </div>
                        <div style={{ color: theme.textMuted, fontSize: "0.7rem", marginTop:"4px" }}>
                          {npc.secretRevealed ? <strong style={{color: theme.danger}}>🔒 {npc.secret}</strong> : npc.detail || "관망 중"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 모달 8종 모음 */}
      {ruleHelpModalKey && RULE_GUIDES[ruleHelpModalKey] && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 140, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "500px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", color: theme.accent }}>📖 {RULE_GUIDES[ruleHelpModalKey].title}</h3><button onClick={() => setRuleHelpModalKey(null)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem", lineHeight: "1.6" }}>
              <div><strong style={{ color: theme.warning }}>💡 어떤 룰인가요?</strong><div style={{ color: theme.textMuted, marginTop: "4px" }}>{RULE_GUIDES[ruleHelpModalKey].desc}</div></div>
              <div><strong style={{ color: theme.accent }}>🎲 핵심 규칙 및 판정 방식:</strong><div style={{ color: theme.textMuted, marginTop: "4px" }}>{RULE_GUIDES[ruleHelpModalKey].system}</div></div>
            </div>
            <button onClick={() => setRuleHelpModalKey(null)} style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>확인 완료</button>
          </div>
        </div>
      )}

      {showCareerModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 125, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "500px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", color: theme.warning }}>🔄 이전 세션 서사 다중 계승</h3><button onClick={() => closeModal(setShowCareerModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontSize: "0.8rem", color: theme.textMuted, marginBottom: "12px" }}>이전에 클리어한 세션들을 체크박스로 복수 선택하면, 생환자의 잔여 수치와 전리품, 흉터 이력을 통합하여 새 캐릭터에 부여합니다.</div>
            {sessions.length === 0 ? ( <div style={{ padding: "16px", textAlign: "center", color: theme.textMuted, backgroundColor: theme.panelAlt, borderRadius: "8px" }}>계승할 수 있는 이전 세션이 없습니다.</div> ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto", marginBottom: "14px" }}>
                {sessions.map((s) => {
                  const isChecked = selectedCareerIds.includes(s.id);
                  return (
                    <div key={s.id} onClick={() => toggleCareerSelection(s.id)} style={{ padding: "10px 12px", backgroundColor: isChecked ? theme.panel : theme.panelAlt, border: `1px solid ${isChecked ? theme.warning : theme.border}`, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                      <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ accentColor: theme.warning, width: "16px", height: "16px" }} />
                      <div style={{ flex: 1 }}><strong style={{ fontSize: "0.85rem", color: theme.text }}>{s.title}</strong><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{s.sheet?.name || "탐사자"} ({s.sheet?.job || "조사원"}) | 룰: {s.ruleMode}</div></div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => closeModal(setShowCareerModal)} style={{ flex: 1, padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>취소</button>
              <button onClick={handleInheritFromMultipleSessions} style={{ flex: 2, padding: "10px", backgroundColor: theme.warning, color: "#000", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>선택한 {selectedCareerIds.length}개 세션 통합 계승</button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "460px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>⚙️ 환경 설정</h3><button onClick={() => closeModal(setShowSettingsModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}><label style={{ fontSize: "0.85rem", fontWeight: "700" }}>테마 색상 팔레트</label><span style={{ fontSize: "0.75rem", color: theme.accent }}>{isDarkMode ? "🌙 나이트" : "☀️ 라이트"}</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {[{ id: "midnight", label: "미드나잇 블루" }, { id: "abyss", label: "심연 어비스" }, { id: "sepia", label: "고서적 세피아" }, { id: "classic", label: "클래식 모던" }].map((p) => ( <button key={p.id} onClick={() => handleSelectPalette(p.id)} style={{ padding: "8px 10px", borderRadius: "8px", border: `1.5px solid ${currentPalette === p.id ? theme.accent : theme.border}`, backgroundColor: currentPalette === p.id ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.8rem", cursor: "pointer", fontWeight: currentPalette === p.id ? "700" : "500" }}>{p.label}</button> ))}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}><label style={{ fontSize: "0.85rem", fontWeight: "700" }}>주사위 효과음 볼륨</label><span style={{ fontSize: "0.8rem", color: theme.accent }}>{Math.round(soundVolume * 100)}%</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="range" min="0" max="1" step="0.05" value={soundVolume} onChange={(e) => handleSaveVolume(Number(e.target.value))} style={{ flex: 1, accentColor: theme.accent }} />
                  <button onClick={playDiceSound} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>🔊 테스트</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <div><div style={{ fontSize: "0.85rem", fontWeight: "700" }}>주사위 굴림 연출 효과</div><div style={{ fontSize: "0.7rem", color: theme.textMuted }}>3D 회전과 난수 롤링을 표시합니다.</div></div>
                <button onClick={() => handleSaveAnim(!animationEnabled)} style={{ padding: "6px 14px", backgroundColor: animationEnabled ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" }}>{animationEnabled ? "켜짐" : "꺼짐"}</button>
              </div>
              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}><span style={{ fontSize: "0.85rem", fontWeight: "700", color: theme.accent }}>💾 세이브 백업 및 복원</span><button onClick={() => openModal(setShowRestoreHelpModal)} style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.accent, cursor: "pointer" }}>?</button></div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => openModal(setShowBackupModal)} style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700" }}>💾 백업</button>
                  <label style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", textAlign: "center" }}>📤 복원<input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} /></label>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <div><div style={{ fontSize: "0.85rem", fontWeight: "700" }}>🎨 초상화 화풍 (스타일)</div><div style={{ fontSize: "0.7rem", color: theme.textMuted }}>생성되는 초상화의 그림체를 지정합니다.</div></div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => { setPortraitStyle("anime"); localStorage.setItem("rp_hub_portrait_style", "anime"); }} style={{ padding: "4px 10px", backgroundColor: portraitStyle === "anime" ? theme.accent : "transparent", color: portraitStyle === "anime" ? "#fff" : theme.text, border: `1px solid ${theme.accent}`, borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>애니풍</button>
                  <button onClick={() => { setPortraitStyle("realistic"); localStorage.setItem("rp_hub_portrait_style", "realistic"); }} style={{ padding: "4px 10px", backgroundColor: portraitStyle === "realistic" ? theme.accent : "transparent", color: portraitStyle === "realistic" ? "#fff" : theme.text, border: `1px solid ${theme.accent}`, borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>실사풍</button>
                </div>
              </div>
            </div>
            <button onClick={() => closeModal(setShowSettingsModal)} style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>닫기</button>
          </div>
        </div>
      )}

      {showPresetModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "480px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>📂 캐릭터 프리셋 관리</h3><button onClick={() => closeModal(setShowPresetModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}`, marginBottom: "16px" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: "700", color: theme.accent, display: "block", marginBottom: "6px" }}>💾 현재 작성한 캐릭터를 프리셋으로 저장</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <input type="text" value={newPresetTitle} onChange={(e) => setNewPresetTitle(e.target.value)} placeholder={charName ? `${charName}의 프리셋` : "프리셋 제목 입력"} style={{ flex: 1, padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} />
                <button onClick={handleSaveCurrentAsPreset} style={{ padding: "7px 12px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontSize: "0.78rem" }}>저장</button>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: "700", display: "block", marginBottom: "8px" }}>⭐ 저장된 프리셋 ({customPresets.length}개)</span>
              {customPresets.length === 0 ? ( <div style={{ fontSize: "0.76rem", color: theme.textMuted, padding: "10px", backgroundColor: theme.panelAlt, borderRadius: "8px" }}>저장된 프리셋이 없습니다.</div> ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "160px", overflowY: "auto" }}>
                  {customPresets.map((p) => (
                    <div key={p.id} onClick={() => handleLoadPreset(p)} style={{ padding: "8px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><strong style={{ fontSize: "0.84rem", color: theme.text }}>{p.title}</strong><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{p.name} | {p.job} ({p.gender}, {p.age}세)</div></div>
                      <button onClick={(e) => handleDeletePreset(p.id, e)} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px" }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => closeModal(setShowPresetModal)} style={{ width: "100%", padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {showBackupModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "440px", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>💾 세이브 백업 옵션</h3><button onClick={() => closeModal(setShowBackupModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button onClick={() => setBackupFormat("json")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1.5px solid ${backupFormat === "json" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "json" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>JSON (.json)</button>
              <button onClick={() => setBackupFormat("txt")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1.5px solid ${backupFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>텍스트 (.txt)</button>
            </div>
            <button onClick={executeSaveBackup} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>다운로드</button>
          </div>
        </div>
      )}

      {showRestoreHelpModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 130, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "450px", padding: "24px", color: theme.text }}>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "1.05rem", color: theme.accent }}>📖 세이브 백업 및 복원 안내</h3>
            <div style={{ fontSize: "0.82rem", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>• <strong>JSON (.json):</strong> 시트 수치와 대화가 완벽 보존되는 게임 파일입니다. [복원]을 통해 그대로 다시 불러올 수 있습니다.</div>
              <div>• <strong>TXT (.txt):</strong> 스마트폰이나 메모장으로 소설처럼 편하게 읽을 수 있는 보관용 문서입니다.</div>
            </div>
            <button onClick={() => closeModal(setShowRestoreHelpModal)} style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>확인</button>
          </div>
        </div>
      )}

      {showPortraitEditModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "440px", padding: "22px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>🖼️ 초상화 변경</h3><button onClick={() => closeModal(setShowPortraitEditModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>1. 사진 파일 직접 업로드</span>
                <input type="file" accept="image/*" onChange={handlePortraitFileUpload} style={{ width: "100%", fontSize: "0.8rem" }} />
              </div>
              <div>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>2. AI 프롬프트 또는 이미지 링크</span>
                <input type="text" value={customPortraitPrompt} onChange={(e) => setCustomPortraitPrompt(e.target.value)} placeholder="예: silver hair girl / 이미지 URL" style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, boxSizing: "border-box", marginBottom: "8px" }} />
                <button onClick={applyCustomPortrait} style={{ width: "100%", padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>적용</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "440px", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>📥 대화록 내보내기</h3><button onClick={() => closeModal(setShowExportModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>포맷 선택</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => setExportFormat("txt")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${exportFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: exportFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", fontSize: "0.8rem" }}>텍스트 (.txt)</button>
                  <button onClick={() => setExportFormat("md")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${exportFormat === "md" ? theme.accent : theme.border}`, backgroundColor: exportFormat === "md" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", fontSize: "0.8rem" }}>마크다운 (.md)</button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>내보내기 범위</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => setExportScope("all")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${exportScope === "all" ? theme.accent : theme.border}`, backgroundColor: exportScope === "all" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", fontSize: "0.8rem" }}>전체 대화록</button>
                  <button onClick={() => setExportScope("storyOnly")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${exportScope === "storyOnly" ? theme.accent : theme.border}`, backgroundColor: exportScope === "storyOnly" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", fontSize: "0.8rem" }}>순수 서사만</button>
                </div>
              </div>
            </div>
            <button onClick={executeExport} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>내보내기 다운로드</button>
          </div>
        </div>
      )}
    </div>
  );
}
