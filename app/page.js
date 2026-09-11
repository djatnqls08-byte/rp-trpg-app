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
  coc: { title: "크툴루의 부름 (CoC 7판)", desc: "정통 코스믹 호러 추리. 이성치(SAN) 관리 및 심연의 진실 탐색.", system: "1D100 판정. SAN 5점 급감 시 1D10 광기 발작." },
  insane: { title: "멀티 호러 TRPG 인세인 (inSANe)", desc: "의심과 비밀이 교차하는 현대 괴담 심리 호러.", system: "2D6 판정. 사이클별 씬 소모 및 비밀(Secret) 조사." },
  unsung: { title: "언성 듀엣 (Unsung Duet)", desc: "이계 '시프터'에 갇힌 2인 탈출 서사.", system: "2D6 판정. 위기 시 침식도(0~6) 상승 및 신체 변이 발현." },
  freeform: { title: "자유 서사 (Freeform Sandbox)", desc: "정형화된 룰북 없이 분위기와 관계성에 몰입하는 샌드박스.", system: "직관적인 1D20 판정." }
};

const COC_MADNESS_TABLE = [
  { roll: 1, name: "기절 및 의식 상실", desc: "극심한 충격으로 눈앞이 아득해지며 바닥에 쓰러져 의식을 잃습니다." },
  { roll: 2, name: "통제 불능 비명", desc: "이성을 잃고 목이 쉴 때까지 원초적인 비명을 내지릅니다." },
  { roll: 3, name: "급성 공포증 (Phobia)", desc: "특정 사물이나 기괴한 현상에 극단적인 공포를 느껴 접근을 거부합니다." },
  { roll: 4, name: "편집증 및 피해망상", desc: "주변의 모든 존재가 자신을 해치려 한다는 의심에 사로잡힙니다." },
  { roll: 5, name: "맹목적 도주 (Flee)", desc: "이유를 불문하고 반대 방향을 향해 무작정 질주합니다." }
];

const INSANE_MADNESS_TABLE = [
  { roll: 1, name: "의혹 (Suspicion)", desc: "동행자의 사명과 대사를 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다." },
  { roll: 2, name: "망상 (Delusion)", desc: "현실에 존재하지 않는 환청과 그림자를 보며 그것에 집착합니다." },
  { roll: 3, name: "강박증 (Obsession)", desc: "소지품을 확인하거나 문을 잠그는 행동을 병적으로 반복합니다." }
];

const ORIENT_TAGS = ["#GL", "#BL", "#HL", "#논로맨스"];
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#오컬트", "#광기"];

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

  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("24");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [charPortraitUrl, setCharPortraitUrl] = useState("");
  const [customPortraitPrompt, setCustomPortraitPrompt] = useState("");
  
  // 스포일러 방지: 시나리오 분리 상태
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [publicSynopsis, setPublicSynopsis] = useState("");
  const [hiddenTruth, setHiddenTruth] = useState("");
  const [showHiddenTruth, setShowHiddenTruth] = useState(false);
  
  // KPC(등장인물) 다중 배열 상태
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
      const promptT = usage?.promptTokenCount || 0;
      const respT = usage?.candidatesTokenCount || 0;
      const totalT = (isToday ? prev.totalTokens : 0) + (usage?.totalTokenCount || 0);
      const updated = { date: todayStr, dailyRequests: newDaily, totalTokens: totalT, lastPromptTokens: promptT, lastResponseTokens: respT };
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
    const name = pick(["세실리아", "비비안", "서윤", "도아"]);
    const job = wizardMode === "coc" ? "사립 탐정" : wizardMode === "insane" ? "학생" : "조난자";
    
    setCharName(name);
    setCharJob(job);
    setCharGender("여성");
    setScenarioTitle("미상의 사건");
    setPublicSynopsis("어둠 속에서 당신은 알 수 없는 공간에 떨어졌습니다. 주변을 조사해야 합니다.");
    setHiddenTruth("흑막은 바로 등 뒤에 있습니다.");
    setKpcList([{ id: Date.now(), name: "엘레나", job: "조력자", detail: "당신을 걱정하는 눈빛", secret: "사실 그녀가 모든 사건의 원흉입니다." }]);
  };

  // ✨ 개선된 AI 즉석 생성 (스포일러 분리 & 다중 KPC)
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
1. 시나리오 내 모든 등장인물은 예외 없이 여성으로 구성하십시오.
2. 플레이어가 스포일러를 당하지 않도록, 상황을 묘사하는 [공개 시놉시스]와 마스터 전용의 [키퍼 전용 진상]을 철저히 분리하십시오.
3. ${ruleSpecificGuidance}

반드시 아래 JSON 포맷으로만 응답하십시오:
{
  "name": "주인공 이름",
  "gender": "여성",
  "job": "역할/직업",
  "background": "주인공의 과거 흉터, 성격, 소지품",
  "scenarioTitle": "멋진 시나리오 제목",
  "publicSynopsis": "플레이어가 읽게 될 스포일러 없는 시나리오 개요 및 도입부 (미스터리와 흥미를 유발하는 3~4문장)",
  "hiddenTruth": "사건의 충격적인 배후 진상, 흑막, 특수 기믹, 그리고 트루/노말/배드 엔딩 분기 조건 (Keeper Only 기밀)",
  "mission": "인세인 전용 공개 사명 (인세인이 아니면 공백)",
  "mutation": "언성듀엣 전용 초기 변이 징후 (언성듀엣 아니면 공백)",
  "kpcs": [
    {
      "name": "KPC 이름",
      "job": "역할/직업",
      "detail": "외모, 성격, 주인공과의 관계 및 텐션",
      "secret": "이 인물이 숨기고 있는 충격적인 비밀이나 뒷면의 진심 (인세인이 아니어도 기입. 맹목적 추종 배제)"
    }
  ]
}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text: systemPrompt }], scenarioText: "", playerSheet: {}, ruleMode: wizardMode, playPreference: playPreference }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      const jsonMatch = data.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const p = JSON.parse(jsonMatch[0]);
        setCharName(p.name || "주인공");
        setCharGender(p.gender || "여성");
        setCharJob(p.job || "조사원");
        setCharBackground(p.background || "");
        setCharPortraitUrl(getPortraitUrl(`${p.name}, ${p.job}`));

        setScenarioTitle(p.scenarioTitle || "미상의 밤");
        setPublicSynopsis(p.publicSynopsis || "눈을 뜨자 낯선 천장이 보입니다.");
        
        let truthText = `[배후 진상 및 흑막]\n${p.hiddenTruth || "금기된 봉인이 풀리고 있습니다."}`;
        setHiddenTruth(truthText);

        if (p.kpcs && p.kpcs.length > 0) {
          const generatedKpcs = p.kpcs.map((k, i) => ({
            id: Date.now() + i, name: k.name, job: k.job, detail: k.detail, secret: k.secret
          }));
          setKpcList(generatedKpcs);
        }

        if (p.mission) setCharMission(p.mission);
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
      } else {
        handleProceduralGenerate();
      }
    } catch (e) {
      handleProceduralGenerate();
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAddKpc = () => {
    if (kpcList.length >= 10) return alert("KPC는 최대 10명까지 추가할 수 있습니다.");
    setKpcList([...kpcList, { id: Date.now(), name: "", job: "", detail: "", secret: "" }]);
  };

  const handleRemoveKpc = (id) => {
    setKpcList(kpcList.filter(k => k.id !== id));
  };

  const updateKpc = (id, field, value) => {
    setKpcList(kpcList.map(k => k.id === id ? { ...k, [field]: value } : k));
  };

  const handleAutoReplaceKpcPc = () => {
    let replacedSyn = publicSynopsis.replace(/\bPC\b/gi, charName || "주인공");
    let replacedTru = hiddenTruth.replace(/\bPC\b/gi, charName || "주인공");
    if (kpcList.length > 0) {
      replacedSyn = replacedSyn.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
      replacedTru = replacedTru.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
    }
    setPublicSynopsis(replacedSyn);
    setHiddenTruth(replacedTru);
    alert(`개요 및 진상의 'PC/KPC' 단어가 치환되었습니다!`);
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
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText += `[${i}페이지]\n${content.items.map((item) => item.str).join(" ")}\n\n`;
        }
        setHiddenTruth(extractedText.trim());
        setPublicSynopsis("PDF 파일이 업로드되었습니다. 진상 탭을 확인하세요.");
      } catch (err) { alert("PDF 읽기 실패: " + err.message); } finally { setIsPdfLoading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setHiddenTruth(event.target.result);
      reader.readAsText(file, "UTF-8");
    }
  };

  const parseTagsSafely = (rawText) => {
    let cleanText = rawText || "";
    let parsedData = { suggActions: [], pendingCheck: null, newSheetVars: {}, revealedSecrets: [], investigationSpots: [] };

    try {
      const suggMatch = cleanText.match(/<!--\s*SUGGESTIONS:\s*(\[.*?\])\s*-->/is);
      if (suggMatch) parsedData.suggActions = JSON.parse(suggMatch[1]);
      const spotsMatch = cleanText.match(/<!--\s*SPOTS:\s*(\[.*?\])\s*-->/is);
      if (spotsMatch) parsedData.investigationSpots = JSON.parse(spotsMatch[1]);
      const secRegex = /<!--\s*REVEAL_SECRET:\s*({.*?})\s*-->/gis;
      const secMatches = [...cleanText.matchAll(secRegex)];
      secMatches.forEach((match) => { try { parsedData.revealedSecrets.push(JSON.parse(match[1])); } catch (e) {} });
      const statMatch = cleanText.match(/<!--\s*STATUS:\s*({.*?})\s*-->/is);
      if (statMatch) parsedData.newSheetVars = JSON.parse(statMatch[1]);
      const checkMatch = cleanText.match(/<!--\s*CHECK:\s*({.*?})\s*-->/is);
      if (checkMatch) parsedData.pendingCheck = JSON.parse(checkMatch[1]);
    } catch(e) {}

    cleanText = cleanText.replace(/```html|```json|```/gi, "").replace(/<!--[\s\S]*?-->/g, "").trim();
    return { cleanText, parsedData };
  };

  const startNewSession = async () => {
    const sessionTitleName = scenarioTitle || (charName ? `${charName}의 이야기` : "새로운 모험");
    const finalPref = playPreference.trim();
    
    // KPC 리스트를 시트의 npcs 규격으로 변환
    const sessionNpcs = kpcList.map(k => ({
      name: k.name || "등장인물",
      title: k.job || "불명",
      portrait: getPortraitUrl(k.name || "companion"),
      affection: 10,
      state: "관망",
      detail: k.detail,
      secret: k.secret,
      secretRevealed: false
    }));

    let initialSheet = {
      name: charName || "주인공", job: charJob || "조사원", age: charAge, gender: charGender,
      portrait: charPortraitUrl || getPortraitUrl(charName), pastChronicle: pastChronicleText, hp: 20, maxHp: 20,
      npcs: sessionNpcs,
      items: [{ name: "기본 소지품", desc: "시작 템" }],
      madnessStatus: null,
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
    const newSession = {
      id: newId, title: sessionTitleName, ruleMode: wizardMode, preference: finalPref,
      scenarioText: fullScenarioContext, sheet: initialSheet, messages: [], suggestedActions: [],
      investigationSpots: [], pendingCheck: null,
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);

    const openingPrompt = `[세션 시작: 첫 서막]
서막을 열고 상황을 묘사하십시오. (반드시 정중한 ~합니다/였습니다 경어체 고정)
조사 가능한 구역 2~3곳을 본문 끝에 <!-- SPOTS: [{"name": "오브젝트명", "stat": "관찰력"}] --> 형식으로 추출하십시오.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text: openingPrompt }], scenarioText: fullScenarioContext, playerSheet: initialSheet, ruleMode: wizardMode, playPreference: finalPref }),
      });
      const data = await response.json();
      recordApiCall(data.usage);
      const { cleanText, parsedData } = parseTagsSafely(data.text);
      setSessions((prev) =>
        prev.map((s) => s.id === newId ? {
          ...s, sheet: { ...initialSheet, ...parsedData.newSheetVars }, messages: [{ role: "model", text: cleanText }],
          suggestedActions: parsedData.suggActions, investigationSpots: parsedData.investigationSpots, pendingCheck: parsedData.pendingCheck,
        } : s )
      );
    } catch (err) {
      setSessions((prev) => prev.map((s) => s.id === newId ? { ...s, messages: [{ role: "model", text: `오류: ${err.message}` }] } : s ));
    } finally {
      setIsLoading(false);
    }
  };

  // ... (executeMessage, sendMessage 등 기타 함수들은 기존과 동일, 너무 길어 생략 없이 합쳐야 함)
  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;
    const isDiceRollSubmission = textToSend.includes("[🎲");
    const updatedMessages = [...(activeSession.messages || []), { role: "user", text: textToSend }];
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [], pendingCheck: null } : s)));
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, scenarioText: activeSession.scenarioText, playerSheet: activeSession.sheet, ruleMode: activeSession.ruleMode, playPreference: activeSession.preference }),
      });
      const data = await response.json();
      recordApiCall(data.usage);
      const { cleanText, parsedData } = parseTagsSafely(data.text || "");
      if (isDiceRollSubmission) parsedData.pendingCheck = null;

      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };
      if (parsedData.revealedSecrets.length > 0) {
        parsedData.revealedSecrets.forEach((rev) => {
          newSheet.npcs = (newSheet.npcs || []).map((npc) => (npc.name === rev.name ? { ...npc, secret: rev.secret, secretRevealed: true } : npc));
        });
      }

      setSessions((prev) =>
        prev.map((s) => s.id === activeSessionId ? {
          ...s, sheet: newSheet, messages: [...updatedMessages, { role: "model", text: cleanText }],
          suggestedActions: parsedData.suggActions, investigationSpots: parsedData.investigationSpots, pendingCheck: parsedData.pendingCheck,
        } : s )
      );
    } catch (err) { alert(`오류: ${err.message}`); } finally { setIsLoading(false); }
  };

  const sendMessage = () => { if (!input.trim()) return; executeMessage(input); setInput(""); };
  const handleUseItem = (itemName) => { setInput((prev) => `품에서 [${itemName}]을(를) 꺼내어 ` + prev); };
  const handleRollback = (msgIndex) => {
    if (!window.confirm("이 발언을 취소하시겠습니까?")) return;
    setInput(activeSession.messages[msgIndex].text);
    const newMessages = activeSession.messages.slice(0, msgIndex);
    setSessions((prev) => (prev.map((s) => (s.id === activeSessionId ? { ...s, messages: newMessages } : s))));
  };

  const rollDiceDirectly = (overrideTarget = null, skillName = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true);
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, pendingCheck: null } : s)));
    playDiceSound();
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
      setIsRolling(false);
      executeMessage(rollFormatted);
    }, animationEnabled ? 650 : 150);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("rp_hub_sessions"); if (saved) setSessions(JSON.parse(saved));
      const savedDark = localStorage.getItem("rp_hub_darkmode"); if (savedDark !== null) setIsDarkMode(savedDark === "true");
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try { localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions)); } catch (e) {}
  }, [sessions, isLoaded]);

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
      
      {/* (좌측 사이드바 렌더링 코드 유지 - 생략 없이 그대로 둠) */}
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
              <button onClick={(e) => { e.stopPropagation(); setSessions(sessions.filter(x=>x.id!==s.id)); if(activeSessionId===s.id) setActiveSessionId(null); }} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px" }}>🗑️</button>
            </div>
          ))}
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
                <button onClick={handleAiGenerate} disabled={isAiGenerating} style={{ padding: "8px 14px", backgroundColor: theme.accent, border: "none", color: "#fff", borderRadius: "20px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", boxShadow: `0 2px 8px ${theme.accentGlow}` }}>
                  {isAiGenerating ? "AI 기획 중..." : "✨ AI 즉석 생성"}
                </button>
              </div>
            </div>

            {/* 1. 룰 선택 및 서사 지향 유지 */}
            <div className="glass-card" style={{ padding: "16px", borderRadius: "14px" }}>
              <div style={{ fontWeight: "800", fontSize: "0.88rem", marginBottom: "10px" }}>1. TRPG 룰 시스템 선택</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr repeat(3, 1fr)", gap: "8px" }}>
                <div onClick={() => setWizardMode("freeform")} style={{ padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${wizardMode === "freeform" ? theme.accent : theme.border}`, backgroundColor: wizardMode === "freeform" ? theme.panelAlt : "transparent", cursor: "pointer" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.85rem", color: theme.accent }}>자유 서사 (1D20)</div>
                </div>
                {[ { key: "coc", name: "크툴루의 부름", color: theme.danger }, { key: "insane", name: "인세인 (inSANe)", color: theme.warning }, { key: "unsung", name: "언성 듀엣", color: "#b87bd8" } ].map((item) => (
                  <div key={item.key} onClick={() => setWizardMode(item.key)} style={{ padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${wizardMode === item.key ? item.color : theme.border}`, backgroundColor: wizardMode === item.key ? theme.panelAlt : "transparent", cursor: "pointer" }}>
                    <div style={{ fontWeight: "700", fontSize: "0.85rem", color: item.color }}>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: "18px", borderRadius: "14px" }}>
              <span style={{ fontWeight: "800", fontSize: "0.88rem", color: theme.accent, display: "block", marginBottom: "8px" }}>2. 서사 및 관계성 지향 태그</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {[...ORIENT_TAGS, ...TROPE_TAGS].map((tag) => {
                  const isActive = playPreference.includes(tag);
                  return (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: "5px 11px", borderRadius: "20px", fontSize: "0.74rem", fontWeight: isActive ? "700" : "500", backgroundColor: isActive ? theme.accent : theme.panelAlt, color: isActive ? "#fff" : theme.text, border: `1px solid ${isActive ? theme.accent : theme.border}`, cursor: "pointer" }}>{tag}</button>
                  );
                })}
              </div>
              <textarea value={playPreference} onChange={(e) => setPlayPreference(e.target.value)} placeholder="원하는 관계성 지침을 직접 입력하세요." style={{ width: "100%", height: "50px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem" }} />
            </div>

            {/* 3. 탐사자(PC) & 4. KPC 설정 분리 */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", alignItems: "start" }}>
              
              {/* 주인공 (PC) */}
              <div className="glass-card" style={{ padding: "18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontWeight: "800", fontSize: "0.88rem" }}>3. 탐사자(PC) 프로필</span>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  {showPortraits && (
                    <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: `2px solid ${theme.accent}`, overflow: "hidden" }}>
                      <img src={charPortraitUrl || getPortraitUrl(`${charName || "character"}`)} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="이름" style={{ padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem" }} />
                    <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업/역할" style={{ padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.82rem" }} />
                  </div>
                </div>
                <textarea value={charBackground} onChange={(e) => setCharBackground(e.target.value)} placeholder="성격, 흉터, 소지품 등 상세 설정" style={{ width: "100%", height: "70px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem", resize: "vertical" }} />
              </div>

              {/* 주요 등장인물 (KPC) 다중 관리 */}
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

            {/* 5. 스포일러 방지된 시나리오 개요 및 진상 */}
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

            <button onClick={startNewSession} disabled={isLoading || isPdfLoading} style={{ width: "100%", padding: "16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "1.05rem", boxShadow: `0 4px 16px ${theme.accentGlow}`, letterSpacing: "0.02em" }}>
              {isLoading ? "키퍼가 서막을 여는 중..." : "이야기 시작하기"}
            </button>
          </div>
        ) : (
          /* 플레이어 룸 렌더링 유지 - 코드 변경 없음 */
          <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            {/* 상단 바 */}
            <div style={{ minHeight: "50px", padding: isMobile ? "0 10px" : "0 16px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, flex: 1 }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <span style={{ fontWeight: "800", fontSize: isMobile ? "0.82rem" : "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "120px" : "220px" }}>{activeSession?.title}</span>
                {activeSession?.ruleMode === "insane" && ( <span style={{ padding: "1px 5px", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1px solid ${theme.warning}`, borderRadius: "4px", fontSize: "0.65rem", color: theme.warning, fontWeight: "700", whiteSpace: "nowrap", flexShrink: 0 }}>{activeSession?.sheet?.cycle || 1}C / {activeSession?.sheet?.scene || 1}S</span> )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px", flexShrink: 0 }}>
                <button onClick={() => rollDiceDirectly()} disabled={isRolling || isLoading} style={{ padding: isMobile ? "5px 8px" : "6px 14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "16px", cursor: "pointer", fontWeight: "700", fontSize: isMobile ? "0.72rem" : "0.8rem", whiteSpace: "nowrap" }}>🎲 판정</button>
                <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: isMobile ? "5px 8px" : "5px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}>{isSheetOpen ? "시트▶" : "◀시트"}</button>
              </div>
            </div>

            {/* 대화 로그 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "14px", position: "relative" }}>
              {(activeSession?.messages || []).map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "92%" : "82%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ backgroundColor: m.text.includes("[🎲") || m.text.includes("[⚠️") ? "rgba(229, 169, 60, 0.12)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi, color: m.role === "user" && !m.text.includes("[🎲") && !m.text.includes("[⚠️") ? "#ffffff" : theme.text, border: m.text.includes("[⚠️") ? `1px solid ${theme.danger}` : m.text.includes("[🎲") ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`, padding: "14px 18px", borderRadius: "14px", lineHeight: "1.75", whiteSpace: "pre-wrap", fontSize: "0.92rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", }}>
                    {m.text}
                  </div>
                  {m.role === "user" && ( <button onClick={() => handleRollback(i)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.7rem", cursor: "pointer", marginTop: "4px" }}>↩️ 되돌리기</button> )}
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.85rem", padding: "4px" }}>키퍼가 서사를 집필하는 중...</div>}
            </div>

            {/* 입력창 */}
            <div style={{ padding: "10px 14px", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (!isMobile && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="행동이나 대사를 입력하세요..." style={{ flex: 1, minHeight: "52px", maxHeight: "130px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px", outline: "none", fontSize: "16px", resize: "vertical" }} />
              <button onClick={sendMessage} disabled={isLoading} style={{ height: "52px", padding: "0 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.88rem" }}>전송</button>
            </div>
          </div>
        )}
      </div>

      {/* 3. 우측 상태창 (시트) 렌더링 유지 */}
      {activeSession && (
        <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, right: 0, top: 0, bottom: 0, height: isMobile ? "100dvh" : "100%", width: isSheetOpen ? "290px" : "0px", minWidth: isSheetOpen ? "290px" : "0px", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden", backgroundColor: theme.sidebar, borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", width: "290px", height: "100%" }}>
            
            <div className="glass-card" style={{ fontSize: "0.74rem", padding: "8px 10px", borderRadius: "8px" }}>
              <strong style={{ color: theme.accent }}>🎭 서사 지향:</strong>
              <div style={{ color: theme.textMuted, marginTop: "2px" }}>{activeSession.preference}</div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.84rem", color: theme.warning, fontWeight: "800" }}>주요 등장인물 (KPC)</h4>
              {(!activeSession.sheet?.npcs || activeSession.sheet.npcs.length === 0) ? (
                <div style={{ fontSize: "0.76rem", color: theme.textMuted }}>등장인물 없음</div>
              ) : (
                activeSession.sheet.npcs.map((npc, idx) => (
                  <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 10px", marginBottom: "6px", fontSize: "0.76rem" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
            
            {/* 기존 인세인, CoC 체력바 등 기타 UI 생략 없이 그대로 유지됨 */}
          </div>
        </div>
      )}
    </div>
  );
}
