"use client";
import { useState, useEffect, useRef } from "react";

// 2026 팬톤 트렌드 테마 4종
const THEME_PALETTES = {
  cloud: { name: "클라우드 댄서", dark: { bg: "#161615", sidebar: "#1d1d1b", panel: "rgba(38, 37, 36, 0.75)", panelAlt: "rgba(51, 49, 48, 0.8)", border: "rgba(240, 238, 233, 0.15)", text: "#F0EEE9", textMuted: "#9e9c96", accent: "#b3b0a6", accentGlow: "rgba(240, 238, 233, 0.2)", danger: "#d63857", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(64, 62, 60, 0.6)", bubbleAi: "transparent", inputBg: "#1d1d1b" }, light: { bg: "#F0EEE9", sidebar: "#e3e0d8", panel: "rgba(255, 255, 255, 0.75)", panelAlt: "rgba(247, 246, 242, 0.8)", border: "rgba(110, 108, 104, 0.15)", text: "#2c2a29", textMuted: "#7a7773", accent: "#6e6c68", accentGlow: "rgba(110, 108, 104, 0.2)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(227, 224, 216, 0.6)", bubbleAi: "transparent", inputBg: "#ffffff" } },
  rose: { name: "우드 로즈", dark: { bg: "#1f1819", sidebar: "#291e20", panel: "rgba(54, 40, 42, 0.75)", panelAlt: "rgba(69, 52, 55, 0.8)", border: "rgba(227, 142, 132, 0.2)", text: "#f2ecee", textMuted: "#a19093", accent: "#E38E84", accentGlow: "rgba(227, 142, 132, 0.3)", danger: "#f76585", warning: "#E29A67", success: "#62d681", bubbleUser: "rgba(163, 114, 119, 0.4)", bubbleAi: "transparent", inputBg: "#1f1819" }, light: { bg: "#f5f0eb", sidebar: "#ebe2d8", panel: "rgba(255, 255, 255, 0.75)", panelAlt: "rgba(252, 250, 248, 0.8)", border: "rgba(163, 114, 119, 0.2)", text: "#3d2f31", textMuted: "#8f7c80", accent: "#A37277", accentGlow: "rgba(163, 114, 119, 0.25)", danger: "#c43350", warning: "#E29A67", success: "#287a3e", bubbleUser: "rgba(235, 226, 216, 0.6)", bubbleAi: "transparent", inputBg: "#ffffff" } },
  baltic: { name: "발틱 씨", dark: { bg: "#121417", sidebar: "#181a20", panel: "rgba(33, 36, 44, 0.75)", panelAlt: "rgba(45, 49, 60, 0.8)", border: "rgba(154, 150, 185, 0.2)", text: "#e8e9ec", textMuted: "#7c808f", accent: "#9A96B9", accentGlow: "rgba(154, 150, 185, 0.3)", danger: "#d63857", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(69, 74, 84, 0.5)", bubbleAi: "transparent", inputBg: "#181a20" }, light: { bg: "#f0f1f5", sidebar: "#e4e6ec", panel: "rgba(255, 255, 255, 0.75)", panelAlt: "rgba(247, 248, 251, 0.8)", border: "rgba(69, 74, 84, 0.15)", text: "#1f2229", textMuted: "#6b6f7d", accent: "#454A54", accentGlow: "rgba(69, 74, 84, 0.2)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(228, 230, 236, 0.6)", bubbleAi: "transparent", inputBg: "#ffffff" } },
  capri: { name: "카프리 블루", dark: { bg: "#091214", sidebar: "#0d1b1e", panel: "rgba(19, 37, 41, 0.75)", panelAlt: "rgba(27, 51, 56, 0.8)", border: "rgba(0, 183, 211, 0.25)", text: "#e3f0f2", textMuted: "#6b8e96", accent: "#00B7D3", accentGlow: "rgba(0, 183, 211, 0.3)", danger: "#e0536c", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(20, 72, 82, 0.5)", bubbleAi: "transparent", inputBg: "#0d1b1e" }, light: { bg: "#e9f4f7", sidebar: "#d9edf2", panel: "rgba(255, 255, 255, 0.75)", panelAlt: "rgba(242, 249, 251, 0.8)", border: "rgba(0, 152, 176, 0.2)", text: "#16282c", textMuted: "#5e7c85", accent: "#0098b0", accentGlow: "rgba(0, 152, 176, 0.25)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(217, 237, 242, 0.6)", bubbleAi: "transparent", inputBg: "#ffffff" } }
};

const INSANE_MATRIX = [
  { category: "폭력", skills: ["소각", "고문", "포박", "협박", "파괴", "구타", "절단", "찌르기", "사격", "전쟁", "매장"] },
  { category: "정서", skills: ["연심", "기쁨", "걱정", "부끄러움", "웃음", "인내", "놀람", "노여움", "원한", "슬픔", "친애"] },
  { category: "지각", skills: ["고통", "관능", "촉감", "냄새", "맛", "소리", "풍경", "추적", "미행", "제육감", "그늘"] },
  { category: "기술", skills: ["분해", "전자기기", "정리", "약품", "효율", "미디어", "카메라", "탈것", "기계", "함정", "병기"] },
  { category: "지식", skills: ["물리학", "수학", "화학", "생물학", "의학", "교양", "인류학", "역사", "민속학", "고고학", "천문학"] },
  { category: "괴이", skills: ["시간", "혼돈", "심해", "죽음", "영혼", "마술", "암흑", "종말", "꿈", "지저", "우주"] }
];

const ORIENT_TAGS = ["#GL", "#BL", "#HL", "#논로맨스"];
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#일상", "#오컬트"];
const COC_STAT_LABELS = { str: "근력", con: "건강", siz: "크기", dex: "민첩", app: "외모", int: "지능", pow: "정신력", edu: "교육", luck: "행운" };

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // UI 상태
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTabletopOpen, setIsTabletopOpen] = useState(false);

  // 모달 상태
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [activePortraitTarget, setActivePortraitTarget] = useState(null); 

  // 설정 및 데이터 상태
  const [currentPalette, setCurrentPalette] = useState("cloud");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [portraitStyle, setPortraitStyle] = useState("anime");
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [backupTarget, setBackupTarget] = useState("all");
  const [pcPresets, setPcPresets] = useState([]); 

  const [wizardMode, setWizardMode] = useState("coc");

  // PC 캐릭터 폼 상태
  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("24");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [charSecret, setCharSecret] = useState(""); // [신규] PC 비밀
  const [showCharSecret, setShowCharSecret] = useState(false); // [신규] PC 비밀 토글
  const [charPortraitUrl, setCharPortraitUrl] = useState("");
  const [customPortraitPrompt, setCustomPortraitPrompt] = useState("");
  
  // KPC 상태
  const [kpcList, setKpcList] = useState([
    { id: Date.now(), name: "파트너", job: "조력자", detail: "", secret: "", portraitUrl: "", showSecret: false }
  ]);

  // 시나리오 상태
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [publicSynopsis, setPublicSynopsis] = useState("");
  const [hiddenTruth, setHiddenTruth] = useState("");
  const [showHiddenTruth, setShowHiddenTruth] = useState(false);
  const [openingScene, setOpeningScene] = useState(""); 
  const [scenarioLimit, setScenarioLimit] = useState(3); // [신규] 인세인 리미트
  const [playPreference, setPlayPreference] = useState("#GL #쌍방구원 #달달");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 룰 별 세팅 스탯 (CoC)
  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });
  const [cocSkills, setCocSkills] = useState("관찰력 60, 자료조사 50, 듣기 40");
  const currentCocTotal = Object.keys(cocStats).filter(k => k !== 'luck').reduce((sum, k) => sum + Number(cocStats[k]), 0);
  
  // 룰 별 세팅 스탯 (인세인)
  const [insaneSkills, setInsaneSkills] = useState([]); 
  const [insaneCuriosity, setInsaneCuriosity] = useState("폭력");
  const [insaneFear, setInsaneFear] = useState("");

  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);
  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0";
  if (strPlusSiz <= 64) derivedDb = "-2"; else if (strPlusSiz <= 84) derivedDb = "-1"; else if (strPlusSiz <= 124) derivedDb = "0"; else if (strPlusSiz <= 164) derivedDb = "+1D4"; else derivedDb = "+1D6";

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const activePalette = THEME_PALETTES[currentPalette] || THEME_PALETTES.cloud;
  const theme = isDarkMode ? activePalette.dark : activePalette.light;

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeSession?.messages, isLoading]);

  function getPortraitUrl(promptText) {
    const clean = promptText || "character portrait";
    const styleTag = portraitStyle === "anime" ? "anime style, 2d illustration, masterpiece" : "realistic photography, highly detailed, cinematic lighting";
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(clean + ", " + styleTag)}?width=300&height=300&nologo=true`;
  }

  function handleToggleDarkMode() {
    setIsDarkMode(!isDarkMode);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_darkmode", (!isDarkMode).toString());
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
  const closeModal = (setModalFn) => { setModalFn(false); if (window.history.state?.modalOpen) { window.history.back(); } };

  const toggleTag = (tag) => {
    setPlayPreference((prev) => {
      const currentList = prev.split(/\s+/).filter(Boolean);
      return currentList.includes(tag) ? currentList.filter((t) => t !== tag).join(" ") : [...currentList, tag].join(" ");
    });
  };

  const handleRandomCocStats = () => {
    let stats = { str: 15, con: 15, siz: 15, dex: 15, app: 15, int: 15, pow: 15, edu: 15 };
    let remaining = 460 - (15 * 8); 
    const keys = Object.keys(stats);
    
    while(remaining > 0) {
      let key = keys[Math.floor(Math.random() * keys.length)];
      if(stats[key] < 90) { 
        let add = Math.min(Math.floor(Math.random() * 5) + 1, remaining, 90 - stats[key]);
        stats[key] += add;
        remaining -= add;
      }
    }
    const luckRoll = (Math.floor(Math.random()*6)+1 + Math.floor(Math.random()*6)+1 + Math.floor(Math.random()*6)+1) * 5;
    setCocStats({ ...stats, luck: luckRoll });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
        setHiddenTruth(extractedText.trim()); setPublicSynopsis("PDF 파일이 업로드되었습니다. 아래 진상 탭을 확인하세요.");
      } catch (err) { alert("PDF 읽기 실패: " + err.message); } finally { setIsPdfLoading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setHiddenTruth(event.target.result);
      reader.readAsText(file, "UTF-8");
    }
  };

  const handleAutoReplaceKpcPc = () => {
    let replacedSyn = publicSynopsis.replace(/\bPC\b/gi, charName || "주인공");
    let replacedTru = hiddenTruth.replace(/\bPC\b/gi, charName || "주인공");
    let replacedOpen = openingScene.replace(/\bPC\b/gi, charName || "주인공");
    let replacedSec = charSecret.replace(/\bPC\b/gi, charName || "주인공");
    if (kpcList.length > 0) {
      replacedSyn = replacedSyn.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
      replacedTru = replacedTru.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
      replacedOpen = replacedOpen.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
      replacedSec = replacedSec.replace(/\bKPC\b/gi, kpcList[0].name || "파트너");
    }
    setPublicSynopsis(replacedSyn); setHiddenTruth(replacedTru); setOpeningScene(replacedOpen); setCharSecret(replacedSec);
    alert(`텍스트 내의 'PC/KPC' 단어가 모두 치환되었습니다!`);
  };

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    let ruleSpecificGuidance = "";
    if (wizardMode === "coc") {
      ruleSpecificGuidance = "크툴루 신화, 코스믹 호러. 핵심 단서 노드 3개와 요구 기능치(Skill), 이성(SAN) 체크 구간을 진상에 명시하십시오.";
    } else if (wizardMode === "insane") {
      ruleSpecificGuidance = "인세인 룰. [limit]을 2~5 사이의 정수로 필히 반환하고, PC와 KPC 모두에게 공개 사명과 [pcSecret] 등 숨겨진 진심/비밀을 매칭하십시오.";
    } else {
      ruleSpecificGuidance = "자유 서사 역극. 주사위 판정이나 스탯 기믹을 일절 배제하고 감정선에 집중하십시오.";
    }

    const systemPrompt = `당신은 최고 권위의 정통 TRPG/역극 시나리오 라이터입니다.
선택된 룰 [${wizardMode}]과 서사 성향 [${playPreference}]에 완벽히 부합하는 뼈대를 작성하십시오.

[🚨 절대 수칙]
태그에 #달달, #일상 등이 있다면 유혈이나 고어 묘사를 100% 배제하고 애틋하게 재해석하십시오.

반드시 아래 JSON 포맷으로만 응답하십시오 (마크다운 없이 순수 JSON만 반환할 것):
{
  "scenarioTone": "분위기 요약",
  "limit": 3,
  "name": "주인공 이름",
  "job": "주인공 직업",
  "background": "주인공 백스토리",
  "pcSecret": "주인공(PC)의 숨겨진 과거, 흑막, 혹은 진짜 목적/비밀",
  "scenarioTitle": "시나리오 제목",
  "publicSynopsis": "스포일러 없는 개요",
  "openingScene": "플레이어가 게임을 시작할 때 맞닥뜨리는 첫 씬의 장소, 시간, 상황 묘사",
  "hiddenTruth": "마스터 전용 배후 진상 및 엔딩 분기 조건. ${ruleSpecificGuidance}",
  "kpcs": [
    {
      "name": "KPC 이름",
      "job": "역할/직업",
      "detail": "외모, 성격, 주인공과의 관계",
      "secret": "KPC가 숨기고 있는 진심이나 비밀"
    }
  ]
}`;

    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", text: systemPrompt }], ruleMode: wizardMode, playPreference }) });
      const data = await response.json();
      
      const jsonMatch = data.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const p = JSON.parse(jsonMatch[0]);
          setCharName(p.name || "주인공"); setCharJob(p.job || "조사원"); setCharBackground(p.background || "");
          setCharSecret(p.pcSecret || "");
          if (p.limit) setScenarioLimit(p.limit);
          setScenarioTitle(p.scenarioTitle || "미상의 밤");
          setPublicSynopsis(p.publicSynopsis || "눈을 뜨자 낯선 천장이 보입니다.");
          setOpeningScene(p.openingScene || "당신은 현재 거리를 걷고 있습니다.");
          setHiddenTruth(`[장르 톤: ${p.scenarioTone}]\n\n[배후 진상]\n${p.hiddenTruth || "진상이 없습니다."}`);
          
          if (p.kpcs && p.kpcs.length > 0) {
            setKpcList(p.kpcs.map((k, i) => ({ id: Date.now() + i, name: k.name, job: k.job, detail: k.detail, secret: k.secret, portraitUrl: "", showSecret: false })));
          }
        } catch(parseErr) {
           alert("AI가 반환한 데이터를 분석하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      } else alert("AI가 올바른 규격으로 응답하지 않았습니다. 다시 시도해 주세요.");
    } catch (e) { alert("생성 실패: " + e.message); } finally { setIsAiGenerating(false); }
  };

  const executeSaveBackup = () => {
    if (sessions.length === 0) return alert("백업할 시나리오 세션이 없습니다.");
    const targets = backupTarget === "all" ? sessions : sessions.filter((s) => s.id === Number(backupTarget));
    if (targets.length === 0) return alert("선택된 시나리오가 없습니다.");
    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(targets, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `TRPG_전체세이브_${dateStr}.json`; link.click(); URL.revokeObjectURL(url);
    closeModal(setShowSettingsModal);
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

  // 프리셋 저장/로드
  const savePcPreset = () => {
    if (!activeSession) return;
    const sheet = activeSession.sheet;
    const newPreset = { id: Date.now(), name: sheet.name, job: sheet.job, age: sheet.age, gender: sheet.gender, background: sheet.background, secret: sheet.secret, portraitUrl: sheet.portrait };
    const updated = [...pcPresets, newPreset];
    setPcPresets(updated);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_pc_presets", JSON.stringify(updated));
    alert(`[${sheet.name}] 프리셋이 저장되었습니다.`);
  };

  const loadPcPreset = (preset) => {
    setCharName(preset.name); setCharJob(preset.job); setCharAge(preset.age || "24"); setCharGender(preset.gender || "여성"); setCharBackground(preset.background); setCharSecret(preset.secret || ""); setCharPortraitUrl(preset.portraitUrl);
    closeModal(setShowPresetModal);
  };

  const handleAddKpc = () => { if (kpcList.length >= 10) return; setKpcList([...kpcList, { id: Date.now(), name: "", job: "", detail: "", secret: "", portraitUrl: "", showSecret: false }]); };
  const handleRemoveKpc = (id) => { setKpcList(kpcList.filter(k => k.id !== id)); };
  const updateKpc = (id, field, value) => { setKpcList(kpcList.map(k => k.id === id ? { ...k, [field]: value } : k)); };

  const handlePortraitClick = (targetId) => {
    setActivePortraitTarget(targetId);
    setCustomPortraitPrompt("");
    openModal(setShowPortraitEditModal);
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
        const newNpcs = activeSession.sheet.npcs.map(npc => npc.id === activePortraitTarget ? { ...npc, portrait: newUrl } : npc);
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, sheet: { ...s.sheet, npcs: newNpcs } } : s));
      } else {
        setKpcList(prev => prev.map(k => k.id === activePortraitTarget ? { ...k, portraitUrl: newUrl } : k));
      }
    }
    closeModal(setShowPortraitEditModal);
  };

  const toggleInsaneSkill = (skill) => {
    setInsaneSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const startNewSession = async () => {
    const sessionTitleName = scenarioTitle || (charName ? `${charName}의 이야기` : "새로운 모험");
    
    const sessionNpcs = kpcList.filter(k => k.name.trim() !== "").map(k => ({
      id: k.id, name: k.name || "등장인물", title: k.job || "불명", portrait: k.portraitUrl || getPortraitUrl(k.name), affection: 50, detail: k.detail, secret: k.secret, secretRevealed: false
    }));

    let initialSheet = {
      name: charName || "주인공", job: charJob || "조사원", age: charAge, gender: charGender,
      background: charBackground, secret: charSecret, portrait: charPortraitUrl || getPortraitUrl(charName), 
      hp: 20, maxHp: 20,
      npcs: sessionNpcs, items: ["기본 소지품", "스마트폰"], madnessStatus: null,
    };

    if (wizardMode === "insane") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, limit: scenarioLimit, cycle: 1, scene: 1, insaneSkills, insaneCuriosity, insaneFear, madnessDeck: 6, handouts: [] };
    } else if (wizardMode === "coc") {
      initialSheet = { ...initialSheet, hp: derivedHp, maxHp: derivedHp, mp: derivedMp, maxMp: derivedMp, san: derivedSan, maxSan: 99, luck: Number(cocStats.luck), db: derivedDb, cocStats: { ...cocStats }, cocSkills };
    } 

    const fullScenarioContext = `[시나리오 제목: ${sessionTitleName}]\n[공개 시놉시스]\n${publicSynopsis}\n\n[초기 배경/서막]\n${openingScene}\n\n[키퍼 전용 기밀/진상]\n${hiddenTruth}`;

    const newId = Date.now();
    const newSession = { 
      id: newId, 
      title: sessionTitleName, 
      ruleMode: wizardMode, 
      preference: playPreference.trim(), 
      scenarioText: fullScenarioContext, 
      publicSynopsis: publicSynopsis || "시나리오 개요가 없습니다.",
      sheet: initialSheet, 
      messages: [{ role: "model", text: `[시스템] ${wizardMode === 'freeform' ? '자유 서사' : wizardMode === 'insane' ? '인세인' : '크툴루의 부름'} 방이 세팅되었습니다.\n\n${openingScene ? openingScene : '대화나 판정을 시작하세요.'}` }], 
      investigationSpots: ["주변", "소지품"], 
      suggestedActions: ["관찰력을 굴려본다", "인물에게 말을 건다"], 
      pendingCheck: null 
    };
    
    setSessions(prev => [newSession, ...prev]); 
    setActiveSessionId(newId); 
  };

  // 주사위 버튼 굴림 로직
  const handleDiceClick = () => {
    if (!activeSession) return;
    playDiceSound();
    if (activeSession.ruleMode === 'coc') {
      const roll = Math.floor(Math.random() * 100) + 1;
      executeMessage(`[다이스 판정] 1D100 ➔ 🎲 ${roll}`);
    } else if (activeSession.ruleMode === 'insane') {
      const r1 = Math.floor(Math.random() * 6) + 1;
      const r2 = Math.floor(Math.random() * 6) + 1;
      executeMessage(`[다이스 판정] 2D6 ➔ 🎲 ${r1} + ${r2} = ${r1 + r2}`);
    }
  };

// 백엔드 실제 통신 및 파싱 로직
  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;
    const updatedMessages = [...(activeSession.messages || []), { role: "user", text: textToSend }];
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages, pendingCheck: null, investigationSpots: [], suggestedActions: [] } : s)));
    setIsLoading(true);

    try {
      // route.js 백엔드 호출
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages, // 쓸데없는 시스템 프롬프트 덧붙임 제거!
          ruleMode: activeSession.ruleMode,
          playPreference: activeSession.preference,
          scenarioText: activeSession.scenarioText,
          playerSheet: activeSession.sheet // [핵심] 백엔드가 캐릭터 상태를 알도록 전달
        })
      });
      const data = await response.json();
      let aiText = data.text || "마스터가 응답하지 않았습니다.";
      
      // 오리지널 태그 파싱 로직 (<!-- SPOTS:... -->, <!-- SUGGESTIONS:... -->)
      let spots = [];
      let actions = [];

      // SPOTS 파싱
      const spotsMatch = aiText.match(/<!--\s*SPOTS:\s*(\[.*?\])\s*-->/);
      if (spotsMatch) {
        try {
          const parsedSpots = JSON.parse(spotsMatch[1]);
          // "책상 (관찰력)" 형태로 변환
          spots = parsedSpots.map(s => `${s.name} (${s.stat})`);
          aiText = aiText.replace(spotsMatch[0], "");
        } catch(e) {}
      }

      // SUGGESTIONS 파싱
      const sugMatch = aiText.match(/<!--\s*SUGGESTIONS:\s*(\[.*?\])\s*-->/);
      if (sugMatch) {
        try {
          actions = JSON.parse(sugMatch[1]);
          aiText = aiText.replace(sugMatch[0], "");
        } catch(e) {}
      }

      // 상태 업데이트
      setSessions((prev) => prev.map((s) => s.id === activeSessionId ? { 
          ...s, 
          messages: [...updatedMessages, { role: "model", text: aiText.trim() }],
          investigationSpots: spots.length > 0 ? spots : [],
          suggestedActions: actions.length > 0 ? actions : []
      } : s ));

    } catch (e) {
      setSessions((prev) => prev.map((s) => s.id === activeSessionId ? { ...s, messages: [...updatedMessages, { role: "model", text: `[통신 오류] ${e.message}` }] } : s ));
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => { if (!input.trim()) return; executeMessage(input); setInput(""); };
  
  const deleteSession = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("이 세션을 삭제하시겠습니까?")) return;
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) setActiveSessionId(null);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { 
      const saved = localStorage.getItem("rp_hub_sessions"); if (saved) setSessions(JSON.parse(saved)); 
      const savedDark = localStorage.getItem("rp_hub_darkmode"); if (savedDark !== null) setIsDarkMode(savedDark === "true"); 
      const savedPresets = localStorage.getItem("rp_hub_pc_presets"); if (savedPresets) setPcPresets(JSON.parse(savedPresets));
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (!isLoaded || typeof window === "undefined") return; try { localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions)); } catch (e) {} }, [sessions, isLoaded]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", width: "100vw", backgroundColor: theme.bg, color: theme.text, overflow: "hidden", position: "relative" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; font-family: 'Pretendard', sans-serif; }
        .serif-text { font-family: 'Noto Serif KR', serif; line-height: 1.8; letter-spacing: -0.02em; }
        .sans-text { font-family: 'Pretendard', sans-serif; }
        
        ::-webkit-scrollbar { display: none; }
        
        /* Glassmorphism */
        .glass-panel { background: ${theme.panel}; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid ${theme.border}; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
        .glass-alt { background: ${theme.panelAlt}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid ${theme.border}; }
        
        input, textarea, button, select { outline: none; transition: all 0.2s ease; }
        input:focus, textarea:focus, select:focus { border-color: ${theme.accent}; box-shadow: 0 0 0 2px ${theme.accentGlow}; }
        
        .msg-box { padding: 16px 20px; border-radius: 12px; font-size: 0.95rem; max-width: 90%; }
        .msg-user { border-left: 3px solid ${theme.accent}; background: ${theme.bubbleUser}; color: ${theme.text}; align-self: flex-end; border-radius: 12px 2px 12px 12px; }
        .msg-ai { border-left: 3px solid ${theme.textMuted}; background: ${theme.bubbleAi}; color: ${theme.text}; align-self: flex-start; border-radius: 2px 12px 12px 12px; }
      `}} />

      {/* 헤더 바 */}
      <header className="glass-panel" style={{ height: "60px", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer", padding: "4px" }}>☰</button>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "700", fontSize: "1.05rem" }}>
            {activeSession ? activeSession.title : "로비 (세션 생성)"}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {activeSession && <button onClick={() => setIsSheetOpen(true)} style={{ padding: "6px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>📋 시트</button>}
          <button onClick={handleToggleDarkMode} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, position: "relative" }}>
        
        {/* 좌측 사이드바 */}
        {isSidebarOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 150, display: "flex" }}>
            <div onClick={() => setIsSidebarOpen(false)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
            <div className="glass-panel" style={{ position: "relative", width: "280px", height: "100%", display: "flex", flexDirection: "column", borderRight: `1px solid ${theme.border}` }}>
              <div style={{ padding: "16px", borderBottom: `1px solid ${theme.border}` }}>
                <button onClick={() => { setActiveSessionId(null); setIsSidebarOpen(false); }} style={{ width: "100%", padding: "12px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", boxShadow: `0 4px 12px ${theme.accentGlow}` }}>+ 새 시나리오</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {sessions.map(s => (
                  <div key={s.id} onClick={() => { setActiveSessionId(s.id); setIsSidebarOpen(false); }} className="glass-alt" style={{ padding: "12px", borderRadius: "8px", cursor: "pointer", border: activeSessionId === s.id ? `1px solid ${theme.accent}` : `1px solid transparent`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: "6px" }}>
                      <div style={{ fontWeight: "700", fontSize: "0.85rem", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{s.ruleMode === 'freeform' ? '자유 서사' : s.ruleMode === 'insane' ? '인세인' : 'CoC 7판'}</div>
                    </div>
                    <button onClick={(e) => deleteSession(s.id, e)} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px" }}>🗑️</button>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px", borderTop: `1px solid ${theme.border}` }}>
                <button onClick={() => { setIsSidebarOpen(false); openModal(setShowSettingsModal); }} style={{ width: "100%", padding: "10px", backgroundColor: "transparent", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>⚙️ 환경 설정</button>
              </div>
            </div>
          </div>
        )}

        {/* 룸 (세션 생성 OR 채팅) */}
        {!activeSession ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 80px 16px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "16px" }}>
              <div>
                <h1 className="serif-text" style={{ margin: "0 0 8px 0", fontSize: "1.6rem", color: theme.text }}>새로운 서사의 시작</h1>
                <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>룰과 장르를 선택하면 AI 마스터가 세계를 구축합니다.</div>
              </div>
              <button onClick={handleAiGenerate} disabled={isAiGenerating} style={{ padding: "10px 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "24px", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", boxShadow: `0 4px 12px ${theme.accentGlow}` }}>
                {isAiGenerating ? "세계 구축 중..." : "✨ AI 즉석 생성"}
              </button>
            </div>

            {/* 1. 룰 선택 */}
            <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px", marginBottom: "20px" }}>
              <div style={{ fontWeight: "700", marginBottom: "12px", fontSize: "0.95rem" }}>1. 룰 시스템 선택</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { key: "freeform", name: "자유 서사 (소설 모드)", sub: "주사위 없는 순수 역극" },
                  { key: "coc", name: "크툴루의 부름 (CoC)", sub: "1D100 기반 탐색과 공포" },
                  { key: "insane", name: "인세인 (inSANe)", sub: "비밀과 광기의 보드게임" }
                ].map(r => (
                  <button key={r.key} onClick={() => setWizardMode(r.key)} className="glass-alt" style={{ padding: "16px", borderRadius: "12px", border: wizardMode === r.key ? `2px solid ${theme.accent}` : `1px solid transparent`, textAlign: "left", cursor: "pointer" }}>
                    <div style={{ fontWeight: "800", color: wizardMode === r.key ? theme.accent : theme.text, fontSize: "0.9rem" }}>{r.name}</div>
                    <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 장르 톤 설정 */}
            <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px", marginBottom: "20px" }}>
              <div style={{ fontWeight: "700", marginBottom: "12px", fontSize: "0.95rem", display: "flex", justifyContent: "space-between" }}>
                <span>2. 장르 톤 (서사 지향 태그)</span>
                <span style={{ fontSize: "0.7rem", color: theme.accent }}>태그가 룰의 분위기를 완전히 지배합니다.</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {[...ORIENT_TAGS, ...TROPE_TAGS].map(tag => {
                  const isActive = playPreference.includes(tag);
                  return (
                    <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: isActive ? "700" : "500", backgroundColor: isActive ? theme.accent : theme.panelAlt, color: isActive ? "#fff" : theme.text, border: `1px solid ${isActive ? theme.accent : theme.border}`, cursor: "pointer" }}>{tag}</button>
                  );
                })}
              </div>
              <textarea value={playPreference} onChange={(e) => setPlayPreference(e.target.value)} placeholder="원하는 장르나 관계성을 자유롭게 서술하세요..." style={{ width: "100%", height: "60px", padding: "12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, resize: "none", fontSize: "0.85rem" }} />
            </div>

            {/* 3. 인물 설정 (PC & KPC) */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>내 프로필 (PC)</div>
                  {/* 프리셋 불러오기 */}
                  <button onClick={() => openModal(setShowPresetModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", fontSize: "0.75rem", color: theme.text, cursor: "pointer", fontWeight: "700" }}>📂 프리셋 불러오기</button>
                </div>
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div onClick={() => handlePortraitClick("pc")} style={{ width: "70px", height: "70px", borderRadius: "50%", backgroundColor: theme.inputBg, border: `2px dashed ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                    {charPortraitUrl ? <img src={charPortraitUrl} alt="PC" style={{width:"100%", height:"100%", objectFit:"cover"}}/> : <span style={{fontSize:"0.7rem", color:theme.textMuted}}>초상화</span>}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="이름" style={{ padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem" }} />
                    <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업/역할" style={{ padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem" }} />
                  </div>
                </div>
                <textarea value={charBackground} onChange={(e) => setCharBackground(e.target.value)} placeholder="백스토리 및 성격..." style={{ width: "100%", height: "80px", padding: "12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, resize: "none", fontSize: "0.85rem" }} />
                
                {/* [복구] PC 비밀 스포일러 방지 토글 */}
                <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "8px", marginTop: "8px" }}>
                  <button type="button" onClick={() => setShowCharSecret(!showCharSecret)} style={{ width: "100%", padding: "6px", backgroundColor: showCharSecret ? "rgba(247, 101, 133, 0.1)" : theme.panelAlt, border: `1px solid ${showCharSecret ? theme.danger : theme.border}`, borderRadius: "4px", color: showCharSecret ? theme.danger : theme.text, cursor: "pointer", fontSize: "0.75rem", fontWeight: "700" }}>
                    {showCharSecret ? "🔒 내 비밀 닫기" : "👀 내 캐릭터의 숨겨진 비밀 (인세인/사명)"}
                  </button>
                  {showCharSecret && (
                    <textarea value={charSecret} onChange={(e) => setCharSecret(e.target.value)} placeholder="다른 사람에게 숨기고 있는 진짜 목적이나 과거" style={{ width: "100%", height: "60px", marginTop: "8px", padding: "8px", backgroundColor: "rgba(247, 101, 133, 0.05)", border: `1px solid ${theme.danger}`, borderRadius: "4px", color: theme.danger, fontSize: "0.8rem", resize: "none" }} />
                  )}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>등장인물 (KPC)</div>
                  <button onClick={handleAddKpc} style={{ background: "none", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", padding: "2px 8px", fontSize: "0.75rem", cursor: "pointer" }}>+ 추가</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", maxHeight: "240px", paddingRight: "4px" }}>
                  {kpcList.map(kpc => (
                    <div key={kpc.id} className="glass-alt" style={{ padding: "12px", borderRadius: "8px", position: "relative" }}>
                      <button onClick={() => handleRemoveKpc(kpc.id)} style={{ position: "absolute", top: "8px", right: "8px", background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
                      <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                        <div onClick={() => handlePortraitClick(kpc.id)} style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: theme.inputBg, border: `1px dashed ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                           {kpc.portraitUrl ? <img src={kpc.portraitUrl} alt="KPC" style={{width:"100%", height:"100%", objectFit:"cover"}}/> : <span style={{fontSize:"0.6rem", color:theme.textMuted}}>사진</span>}
                        </div>
                        <div style={{ flex: 1, display: "flex", gap: "6px" }}>
                          <input type="text" value={kpc.name} onChange={(e) => updateKpc(kpc.id, 'name', e.target.value)} placeholder="이름" style={{ width: "50%", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.8rem" }} />
                          <input type="text" value={kpc.job} onChange={(e) => updateKpc(kpc.id, 'job', e.target.value)} placeholder="역할" style={{ width: "50%", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.8rem" }} />
                        </div>
                      </div>
                      <input type="text" value={kpc.detail} onChange={(e) => updateKpc(kpc.id, 'detail', e.target.value)} placeholder="외모, 성격, PC와의 관계" style={{ width: "100%", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.8rem" }} />
                      
                      <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "8px", marginTop: "8px" }}>
                        <button type="button" onClick={() => updateKpc(kpc.id, 'showSecret', !kpc.showSecret)} style={{ width: "100%", padding: "6px", backgroundColor: kpc.showSecret ? "rgba(247, 101, 133, 0.1)" : theme.panelAlt, border: `1px solid ${kpc.showSecret ? theme.danger : theme.border}`, borderRadius: "4px", color: kpc.showSecret ? theme.danger : theme.text, cursor: "pointer", fontSize: "0.75rem", fontWeight: "700" }}>
                          {kpc.showSecret ? "🔒 비밀 닫기" : "👀 이 인물의 비밀 열람 및 수정"}
                        </button>
                        {kpc.showSecret && (
                          <textarea value={kpc.secret} onChange={(e) => updateKpc(kpc.id, 'secret', e.target.value)} placeholder="숨겨진 진심/비밀 (마스터 전용)" style={{ width: "100%", height: "60px", marginTop: "8px", padding: "8px", backgroundColor: "rgba(247, 101, 133, 0.05)", border: `1px solid ${theme.danger}`, borderRadius: "4px", color: theme.danger, fontSize: "0.8rem", resize: "none" }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. 시나리오 개요 및 진상 & 서막 입력란 */}
            <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>시나리오 정보 및 서막(Prologue)</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <label style={{ padding: "6px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "600" }}>
                    📄 파일 첨부
                    <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>
                  <button type="button" onClick={handleAutoReplaceKpcPc} style={{ padding: "6px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "6px", color: theme.accent, fontSize: "0.75rem", cursor: "pointer", fontWeight: "600" }}>🔄 PC/KPC 치환</button>
                </div>
              </div>
              
              <input type="text" value={scenarioTitle} onChange={(e) => setScenarioTitle(e.target.value)} placeholder="시나리오 제목" style={{ width: "100%", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px" }} />
              
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "6px", display: "block" }}>[공개 시놉시스] 플레이어에게 주어지는 초기 정보</label>
                <textarea value={publicSynopsis} onChange={(e) => setPublicSynopsis(e.target.value)} placeholder="도입부, 소문, 미스터리 등 스포일러 없는 배경 설명..." style={{ width: "100%", height: "60px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.85rem", resize: "none" }} />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "0.75rem", color: theme.accent, marginBottom: "6px", display: "block", fontWeight: "700" }}>[서막] 시작되는 시간, 장소, 혹은 상황 묘사</label>
                <textarea value={openingScene} onChange={(e) => setOpeningScene(e.target.value)} placeholder="예: 비 내리는 수요일 밤, 당신은 낡은 서재에서 누군가를 기다리고 있습니다..." style={{ width: "100%", height: "60px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.accent}`, borderRadius: "8px", color: theme.text, fontSize: "0.85rem", resize: "none" }} />
              </div>
              
              <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "12px" }}>
                <button type="button" onClick={() => setShowHiddenTruth(!showHiddenTruth)} style={{ width: "100%", padding: "10px", backgroundColor: showHiddenTruth ? "rgba(247, 101, 133, 0.1)" : theme.panelAlt, border: `1px solid ${showHiddenTruth ? theme.danger : theme.border}`, borderRadius: "8px", color: showHiddenTruth ? theme.danger : theme.text, cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", transition: "all 0.2s" }}>
                  {showHiddenTruth ? "🔒 키퍼 전용 진상 닫기" : "👀 키퍼 전용 스포일러/진상 수동 입력"}
                </button>
                {showHiddenTruth && (
                  <div style={{ marginTop: "12px", animation: "fadeIn 0.3s ease" }}>
                    <div style={{ fontSize: "0.75rem", color: theme.danger, marginBottom: "8px" }}>⚠️ 플레이어 열람 주의! 마스터만 참조하는 사건의 흑막과 엔딩 분기입니다.</div>
                    <textarea value={hiddenTruth} onChange={(e) => setHiddenTruth(e.target.value)} placeholder="흑막의 정체, 특수 기믹, 트루/배드 엔딩 조건을 기입하세요." style={{ width: "100%", height: "120px", padding: "10px", backgroundColor: "rgba(247, 101, 133, 0.05)", border: `1px solid ${theme.danger}`, borderRadius: "8px", color: theme.text, fontSize: "0.85rem", resize: "none", lineHeight: "1.5" }} />
                  </div>
                )}
              </div>
            </div>

            {/* 5-1. 특화 룰 세팅 (CoC 7판) */}
            {wizardMode === "coc" && (
              <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px", marginBottom: "20px", border: `1px solid ${theme.danger}` }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                   <div style={{ fontWeight: "700", fontSize: "0.95rem", color: theme.danger }}>CoC 7판 특성치 & 기능치 세팅</div>
                   <button onClick={handleRandomCocStats} style={{ padding: "6px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.danger}`, color: theme.text, borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontWeight: "700" }}>🎲 460pt 캡 난수 굴림</button>
                 </div>
                 
                 <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "12px" }}>탐사자의 8대 특성치(총합 460 고정 권장) 및 행운을 설정하세요. HP, 이성 등은 자동 계산됩니다.</div>
                 <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
                   {Object.keys(cocStats).map(key => (
                     <label key={key} style={{ display: "flex", flexDirection: "column", fontSize: "0.75rem", gap: "4px" }}>
                       {COC_STAT_LABELS[key]}
                       <input type="number" min="15" max="99" value={cocStats[key]} onChange={e => setCocStats({...cocStats, [key]: Number(e.target.value)})} style={{ padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, textAlign: "center" }} />
                     </label>
                   ))}
                 </div>
                 <div style={{ textAlign: "right", fontSize: "0.85rem", fontWeight: "700", color: currentCocTotal > 460 ? theme.danger : theme.accent, marginBottom: "16px", paddingBottom: "16px", borderBottom: `1px dashed ${theme.border}` }}>
                   특성치 총합: {currentCocTotal} / 460 pt (행운 제외)
                 </div>

                 <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "8px" }}>
                   <strong>추가 기능치(Skill):</strong> 직업과 배경에 맞는 주요 기능치와 수치를 쉼표(,)로 구분해 적어주세요.
                 </div>
                 <input type="text" value={cocSkills} onChange={(e) => setCocSkills(e.target.value)} placeholder="예: 관찰력 70, 자료조사 60, 심리학 50" style={{ width: "100%", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.85rem" }} />
              </div>
            )}
            
            {/* 5-2. 특화 룰 세팅 (인세인) */}
            {wizardMode === "insane" && (
              <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px", marginBottom: "20px", border: `1px solid ${theme.warning}` }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ fontWeight: "700", fontSize: "0.95rem", color: theme.warning }}>인세인 특기표 체킹</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: theme.warning }}>리미트 설정: <input type="number" min="2" max="6" value={scenarioLimit} onChange={e => setScenarioLimit(Number(e.target.value))} style={{ width: "50px", padding: "4px", backgroundColor: theme.inputBg, border: `1px solid ${theme.warning}`, borderRadius: "4px", color: theme.text, textAlign: "center" }} /></div>
                 </div>
                 <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "12px" }}>나의 특기(2~6개)를 클릭하고, 하단의 호기심/공포심을 지정하세요.</div>
                 <div style={{ overflowX: "auto", paddingBottom: "8px" }}>
                   <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", minWidth: "500px", gap: "4px" }}>
                     {INSANE_MATRIX.map(col => (
                       <div key={col.category} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                         <div style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: "800", padding: "4px 0", backgroundColor: theme.panelAlt }}>{col.category}</div>
                         {col.skills.map(skill => {
                           const isSel = insaneSkills.includes(skill);
                           return (
                             <button key={skill} onClick={() => toggleInsaneSkill(skill)} style={{ padding: "4px 0", fontSize: "0.65rem", backgroundColor: isSel ? theme.warning : theme.inputBg, color: isSel ? "#000" : theme.text, border: `1px solid ${isSel ? theme.warning : theme.border}`, borderRadius: "2px", cursor: "pointer", fontWeight: isSel ? "700" : "400" }}>{skill}</button>
                           );
                         })}
                       </div>
                     ))}
                   </div>
                 </div>
                 <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                   <label style={{ flex: 1, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px" }}>호기심 분야: 
                     <select value={insaneCuriosity} onChange={(e) => setInsaneCuriosity(e.target.value)} style={{ flex: 1, padding: "6px", backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "4px" }}>
                       {INSANE_MATRIX.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                     </select>
                   </label>
                   <label style={{ flex: 1, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px" }}>공포심 특기: 
                     <input type="text" value={insaneFear} onChange={(e) => setInsaneFear(e.target.value)} placeholder="예: 죽음, 피" style={{ flex: 1, padding: "6px", backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "4px" }} />
                   </label>
                 </div>
              </div>
            )}

            <button onClick={startNewSession} disabled={isLoading} style={{ width: "100%", padding: "18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", fontSize: "1.1rem", cursor: "pointer", boxShadow: `0 8px 24px ${theme.accentGlow}` }}>
              {isLoading ? "세계를 생성하는 중..." : "서막 열기"}
            </button>
          </div>
        ) : (
          /* 채팅 룸 */
          <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, position: "relative" }}>
            
            {activeSession.ruleMode === "insane" && (
              <div className="glass-alt" style={{ padding: "8px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: theme.warning }}>{activeSession.sheet?.cycle}C / {activeSession.sheet?.scene}S (리미트: {activeSession.sheet?.limit})</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setIsTabletopOpen(!isTabletopOpen)} style={{ padding: "4px 10px", backgroundColor: isTabletopOpen ? theme.warning : "transparent", border: `1px solid ${theme.warning}`, color: isTabletopOpen ? "#000" : theme.warning, borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}>🃏 테이블탑 보기</button>
                </div>
              </div>
            )}

            {/* 인세인 테이블탑 오버레이 */}
            {activeSession.ruleMode === "insane" && isTabletopOpen && (
              <div style={{ position: "absolute", top: "45px", left: 0, right: 0, bottom: "120px", backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 50, display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: "16px", padding: "20px", overflowY: "auto" }}>
                <div style={{ width: "100%", color: "#fff", fontWeight: "700", marginBottom: "8px" }}>🃏 현재 활성화된 카드 덱</div>
                <div className="glass-panel" style={{ width: "140px", height: "200px", borderRadius: "12px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: theme.panelAlt }}>
                  <span style={{ fontSize: "2rem" }}>📜</span>
                  <span style={{ fontWeight: "700", marginTop: "12px", fontSize: "0.9rem" }}>핸드아웃 덱</span>
                </div>
                <div className="glass-panel" style={{ width: "140px", height: "200px", borderRadius: "12px", border: `1px solid ${theme.danger}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "rgba(214, 56, 87, 0.1)" }}>
                  <span style={{ fontSize: "2rem" }}>💀</span>
                  <span style={{ fontWeight: "700", marginTop: "12px", fontSize: "0.9rem", color: theme.danger }}>미공개 광기</span>
                  <span style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "4px" }}>남은 장수: 6장</span>
                </div>
              </div>
            )}

            <div ref={chatContainerRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", scrollBehavior: "smooth" }}>
              {activeSession.messages.map((m, i) => (
                <div key={i} className={`msg-box ${m.role === 'user' ? 'msg-user' : 'msg-ai'} ${m.role === 'ai' ? 'serif-text' : 'sans-text'}`}>
                  {m.text.split('\n').map((line, idx) => <span key={idx} style={{display: 'block', minHeight: '1em'}}>{line}</span>)}
                </div>
              ))}
              {isLoading && <div style={{ fontSize: "0.85rem", color: theme.textMuted, fontStyle: "italic", alignSelf: "flex-start", padding: "10px" }}>마스터가 서사를 집필 중입니다...</div>}
            </div>

            {/* 조사(SPOTS) 버튼 및 추천 행동 칩 영역 */}
            {(activeSession.investigationSpots?.length > 0 || activeSession.suggestedActions?.length > 0) && (
              <div style={{ padding: "0 16px 10px 16px", display: "flex", flexWrap: "wrap", gap: "8px", zIndex: 100 }}>
                {activeSession.investigationSpots?.map((spot, idx) => (
                  <button key={`spot-${idx}`} onClick={() => { setInput(`[${spot}] 조사할게요.`); executeMessage(`[${spot}] 조사할게요.`); }} style={{ padding: "6px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "16px", color: theme.accent, fontSize: "0.8rem", cursor: "pointer", fontWeight: "600" }}>
                    🔍 {spot}
                  </button>
                ))}
                {activeSession.suggestedActions?.map((act, idx) => (
                  <button key={`act-${idx}`} onClick={() => { setInput(act); executeMessage(act); }} style={{ padding: "6px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "16px", color: theme.text, fontSize: "0.8rem", cursor: "pointer" }}>
                    💡 {act}
                  </button>
                ))}
              </div>
            )}

            <div className="glass-panel" style={{ padding: "12px 16px", paddingBottom: "max(12px, env(safe-area-inset-bottom))", borderTop: `1px solid ${theme.border}`, flexShrink: 0, display: "flex", gap: "10px", alignItems: "flex-end", zIndex: 100 }}>
              {activeSession.ruleMode !== "freeform" && (
                <button onClick={handleDiceClick} title="주사위 판정" style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>🎲</button>
              )}
              <textarea 
                value={input} onChange={(e) => setInput(e.target.value)} 
                placeholder={activeSession.ruleMode === 'freeform' ? "행동이나 대사를 묘사하세요..." : "행동 선언을 입력하세요..."}
                style={{ flex: 1, minHeight: "44px", maxHeight: "150px", padding: "12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.text, resize: "none", fontSize: "0.95rem", lineHeight: "1.5" }} 
              />
              <button onClick={sendMessage} disabled={isLoading || !input.trim()} style={{ height: "44px", padding: "0 20px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer", flexShrink: 0, opacity: (!input.trim() || isLoading) ? 0.5 : 1 }}>전송</button>
            </div>
          </div>
        )}

        {/* 우측 시트 패널 */}
        {activeSession && isSheetOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 120, display: "flex", justifyContent: "flex-end" }}>
            <div onClick={() => setIsSheetOpen(false)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />
            <div className="glass-panel" style={{ position: "relative", width: "320px", height: "100%", display: "flex", flexDirection: "column", borderLeft: `1px solid ${theme.border}`, animation: "slideInRight 0.3s ease" }}>
              <div style={{ padding: "16px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "1.05rem" }}>캐릭터 시트</span>
                <button onClick={() => setIsSheetOpen(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                <button onClick={savePcPreset} style={{ width: "100%", padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "8px", color: theme.accent, cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }}>
                  💾 이 캐릭터 프리셋으로 저장
                </button>

                <div className="glass-alt" style={{ fontSize: "0.8rem", padding: "12px", borderRadius: "12px", lineHeight: "1.5", border: `1px solid ${theme.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ color: theme.warning }}>📜 시나리오 개요</strong>
                  </div>
                  <div style={{ color: theme.textMuted, whiteSpace: "pre-wrap" }}>
                    {activeSession.publicSynopsis || "시나리오 개요가 없습니다."}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "4px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: theme.panelAlt, border: `2px solid ${theme.accent}`, overflow: "hidden", flexShrink: 0 }}>
                    <img src={activeSession.sheet.portrait} alt="PC" style={{width:"100%", height:"100%", objectFit:"cover"}} onError={(e)=>(e.currentTarget.style.display='none')}/>
                  </div>
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>{activeSession.sheet.name}</div>
                    <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>{activeSession.sheet.job}</div>
                  </div>
                </div>
                
                {/* [복구] PC 백스토리 노출 */}
                {activeSession.sheet.background && (
                  <div style={{ fontSize: "0.8rem", color: theme.text, backgroundColor: theme.inputBg, padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}`, whiteSpace: "pre-wrap" }}>
                    {activeSession.sheet.background}
                  </div>
                )}
                
                {/* [복구] PC 비밀 노출 (토글) */}
                {activeSession.sheet.secret && (
                  <div style={{ border: `1px dashed ${theme.danger}`, borderRadius: "8px", padding: "10px", backgroundColor: "rgba(247, 101, 133, 0.05)" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.danger, marginBottom: "4px" }}>🔒 나의 진짜 목적 / 비밀</div>
                    <div style={{ fontSize: "0.8rem", color: theme.danger, whiteSpace: "pre-wrap" }}>{activeSession.sheet.secret}</div>
                  </div>
                )}

                {/* [복구] 장비창(소지품) */}
                <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                  <div style={{ fontWeight: "700", fontSize: "0.85rem", marginBottom: "8px" }}>🎒 소지품 / 장비</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {activeSession.sheet.items?.map((item, idx) => (
                      <span key={idx} style={{ padding: "4px 8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", fontSize: "0.75rem", color: theme.text }}>{item}</span>
                    ))}
                  </div>
                </div>

                {activeSession.ruleMode === "coc" && (
                  <div className="glass-alt" style={{ padding: "16px", borderRadius: "12px", border: `1px solid ${theme.danger}` }}>
                    <div style={{ fontWeight: "700", color: theme.danger, marginBottom: "12px", fontSize: "0.85rem" }}>CoC 7판 스테이터스</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{fontSize:"0.8rem"}}>이성 (SAN)</span><strong style={{color:theme.danger}}>{activeSession.sheet.san} / 99</strong></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{fontSize:"0.8rem"}}>체력 (HP)</span><strong style={{color:theme.warning}}>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{fontSize:"0.8rem"}}>행운</span><strong>{activeSession.sheet.luck}</strong></div>
                    </div>
                  </div>
                )}

                {activeSession.ruleMode === "insane" && (
                  <div className="glass-alt" style={{ padding: "16px", borderRadius: "12px", border: `1px solid ${theme.warning}` }}>
                    <div style={{ fontWeight: "700", color: theme.warning, marginBottom: "12px", fontSize: "0.85rem" }}>인세인 파일철</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{fontSize:"0.8rem"}}>이성 (SAN)</span><strong style={{color:theme.danger}}>{activeSession.sheet.san} / {activeSession.sheet.maxSan}</strong></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{fontSize:"0.8rem"}}>생명력 (HP)</span><strong style={{color:theme.warning}}>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem", marginBottom: "12px", color: theme.accent }}>주요 등장인물 (KPC)</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activeSession.sheet.npcs.map(npc => (
                      <div key={npc.id} className="glass-alt" style={{ padding: "12px", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: theme.inputBg, overflow: "hidden", flexShrink: 0 }}>
                           <img src={npc.portrait} alt={npc.name} style={{width:"100%", height:"100%", objectFit:"cover"}} onError={(e)=>(e.currentTarget.style.display='none')}/>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: "700", fontSize: "0.85rem" }}>{npc.name}</span>
                            <span style={{ fontSize: "0.75rem", color: theme.danger }}>♥ {npc.affection}</span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>{npc.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* 설정 모달 */}
      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => closeModal(setShowSettingsModal)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }} />
          <div className="glass-panel" style={{ width: "90%", maxWidth: "460px", padding: "24px", borderRadius: "16px", zIndex: 201, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "12px" }}>
              <h3 style={{ margin: 0 }}>⚙️ 환경 설정</h3>
              <button onClick={() => closeModal(setShowSettingsModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>테마 색상 팔레트</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {Object.entries(THEME_PALETTES).map(([key, pal]) => (
                    <button key={key} onClick={() => handleSelectPalette(key)} style={{ padding: "12px", backgroundColor: currentPalette === key ? theme.panelAlt : "transparent", border: `1px solid ${currentPalette === key ? theme.accent : theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontWeight: currentPalette === key ? "700" : "400", fontSize: "0.85rem" }}>
                      {pal.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "700" }}>주사위 효과음 볼륨</label>
                  <span style={{ fontSize: "0.8rem", color: theme.accent }}>{Math.round(soundVolume * 100)}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input type="range" min="0" max="1" step="0.05" value={soundVolume} onChange={(e) => handleSaveVolume(Number(e.target.value))} style={{ flex: 1, accentColor: theme.accent }} />
                  <button onClick={playDiceSound} style={{ padding: "6px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer" }}>🔊 테스트</button>
                </div>
              </div>

              <div style={{ backgroundColor: theme.panelAlt, padding: "14px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: "700", color: theme.accent }}>💾 세이브 백업 및 복원</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={executeSaveBackup} style={{ flex: 1, padding: "10px", backgroundColor: "transparent", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700" }}>저장 (백업)</button>
                  <label style={{ flex: 1, padding: "10px", backgroundColor: "transparent", border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700", textAlign: "center" }}>
                    불러오기
                    <input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 초상화 수정 모달 */}
      {showPortraitEditModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => closeModal(setShowPortraitEditModal)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }} />
          <div className="glass-panel" style={{ width: "90%", maxWidth: "400px", padding: "24px", borderRadius: "16px", zIndex: 201 }}>
            <h3 style={{ margin: "0 0 20px 0" }}>초상화 변경 ({activePortraitTarget === 'pc' ? '내 캐릭터' : 'KPC'})</h3>
            <div style={{ fontSize: "0.8rem", color: theme.textMuted, marginBottom: "12px" }}>AI 프롬프트(영문 추천) 또는 직접 이미지 URL 링크를 입력하세요.</div>
            <input type="text" value={customPortraitPrompt} onChange={(e) => setCustomPortraitPrompt(e.target.value)} placeholder="예: silver hair girl / 이미지 URL" style={{ width: "100%", padding: "12px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, marginBottom: "16px" }} />
            <button onClick={applyCustomPortrait} style={{ width: "100%", padding: "14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>초상화 적용하기</button>
          </div>
        </div>
      )}

      {/* 프리셋 로드 모달 */}
      {showPresetModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => closeModal(setShowPresetModal)} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }} />
          <div className="glass-panel" style={{ width: "90%", maxWidth: "400px", padding: "24px", borderRadius: "16px", zIndex: 201, maxHeight: "70vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 16px 0" }}>📂 저장된 캐릭터 프리셋</h3>
            {pcPresets.length === 0 ? (
              <div style={{ fontSize: "0.85rem", color: theme.textMuted, textAlign: "center", padding: "20px 0" }}>저장된 프리셋이 없습니다.<br/>(세션 진행 중 시트에서 저장할 수 있습니다)</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {pcPresets.map(preset => (
                  <div key={preset.id} className="glass-alt" style={{ padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${theme.border}` }}>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{preset.name}</div>
                      <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>{preset.job}</div>
                    </div>
                    <button onClick={() => loadPcPreset(preset)} style={{ padding: "6px 12px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700" }}>적용</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => closeModal(setShowPresetModal)} style={{ width: "100%", padding: "10px", marginTop: "16px", backgroundColor: "transparent", border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer" }}>닫기</button>
          </div>
        </div>
      )}

    </div>
  );
}
