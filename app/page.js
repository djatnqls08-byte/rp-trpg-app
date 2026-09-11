"use client";
import { useState, useEffect } from "react";

// 🌟 완전히 새로워진 4종 프리미엄 팔레트
const THEME_PALETTES = {
  crimson_velvet: {
    name: "크림슨 벨벳",
    dark: { bg: "#0a0505", sidebar: "#120808", panel: "#1a0b0b", panelAlt: "#261111", border: "rgba(220, 38, 38, 0.25)", text: "#f3e8e8", textMuted: "#a38b8b", accent: "#dc2626", accentGlow: "rgba(220, 38, 38, 0.4)", danger: "#ef4444", warning: "#f59e0b", success: "#10b981", bubbleUser: "#450a0a", bubbleAi: "#1a0b0b", inputBg: "#0a0505" },
    light: { bg: "#fdf8f8", sidebar: "#f7eded", panel: "#ffffff", panelAlt: "#fce8e8", border: "rgba(185, 28, 28, 0.2)", text: "#2c1c1c", textMuted: "#7f6262", accent: "#b91c1c", accentGlow: "rgba(185, 28, 28, 0.25)", danger: "#dc2626", warning: "#d97706", success: "#059669", bubbleUser: "#fee2e2", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  emerald_mystic: {
    name: "에메랄드 미스틱",
    dark: { bg: "#050f0a", sidebar: "#081710", panel: "#0c2117", panelAlt: "#112e21", border: "rgba(16, 185, 129, 0.25)", text: "#e8f3ee", textMuted: "#79998d", accent: "#10b981", accentGlow: "rgba(16, 185, 129, 0.4)", danger: "#ef4444", warning: "#f59e0b", success: "#34d399", bubbleUser: "#064e3b", bubbleAi: "#0c2117", inputBg: "#050f0a" },
    light: { bg: "#f5fdf9", sidebar: "#e6f8f0", panel: "#ffffff", panelAlt: "#dcfce7", border: "rgba(5, 150, 105, 0.2)", text: "#1b2c25", textMuted: "#648275", accent: "#059669", accentGlow: "rgba(5, 150, 105, 0.25)", danger: "#dc2626", warning: "#d97706", success: "#10b981", bubbleUser: "#a7f3d0", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  starlight_neon: {
    name: "스타라이트 네온",
    dark: { bg: "#0b0c10", sidebar: "#12141a", panel: "#191c24", panelAlt: "#222631", border: "rgba(139, 92, 246, 0.25)", text: "#e2e8f0", textMuted: "#808a9d", accent: "#8b5cf6", accentGlow: "rgba(139, 92, 246, 0.4)", danger: "#f43f5e", warning: "#fbbf24", success: "#10b981", bubbleUser: "#2e1065", bubbleAi: "#191c24", inputBg: "#0b0c10" },
    light: { bg: "#f8fafc", sidebar: "#e2e8f0", panel: "#ffffff", panelAlt: "#f1f5f9", border: "rgba(99, 102, 241, 0.2)", text: "#0f172a", textMuted: "#64748b", accent: "#6366f1", accentGlow: "rgba(99, 102, 241, 0.25)", danger: "#e11d48", warning: "#d97706", success: "#059669", bubbleUser: "#c7d2fe", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  twilight_amethyst: {
    name: "트와일라잇 아메시스트",
    dark: { bg: "#0d0812", sidebar: "#150d1d", panel: "#1e1329", panelAlt: "#2a1b38", border: "rgba(217, 70, 239, 0.25)", text: "#f1e8f5", textMuted: "#9a85a8", accent: "#d946ef", accentGlow: "rgba(217, 70, 239, 0.4)", danger: "#f43f5e", warning: "#f59e0b", success: "#10b981", bubbleUser: "#4a044e", bubbleAi: "#1e1329", inputBg: "#0d0812" },
    light: { bg: "#fdfaff", sidebar: "#f3e8f8", panel: "#ffffff", panelAlt: "#fae8ff", border: "rgba(192, 38, 211, 0.2)", text: "#2c1c38", textMuted: "#8a739c", accent: "#c026d3", accentGlow: "rgba(192, 38, 211, 0.25)", danger: "#e11d48", warning: "#d97706", success: "#059669", bubbleUser: "#f5d0fe", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  }
};

const RULE_GUIDES = {
  coc: { title: "크툴루의 부름 (CoC)", desc: "코스믹 호러 기반. 이성(SAN) 관리 및 단서 조사.", system: "1D100 판정. SAN 5점 감소 시 1D10 광기 굴림 발동." },
  insane: { title: "인세인 (inSANe)", desc: "의심과 광기의 현대 호러.", system: "2D6 판정. 사명과 비밀을 탐색합니다." },
  unsung: { title: "언성 듀엣", desc: "이계에 갇힌 2인 서사.", system: "2D6 판정. 이계 침식도(0~6)와 변이 관리." },
  freeform: { title: "자유 서사", desc: "룰북 없이 관계성에 몰입하는 샌드박스.", system: "1D20 직관적 판정." }
};

const MADNESS_TABLE_1D10 = [
  { roll: 1, name: "기절/의식 상실", desc: "극심한 충격으로 눈앞이 아득해지며 의식을 잃습니다." },
  { roll: 2, name: "비명 발작", desc: "이성을 잃고 원초적인 비명을 내지릅니다. 은밀 행동 불가." },
  { roll: 3, name: "급성 공포증", desc: "특정 사물에 극단적인 공포를 느껴 접근을 거부합니다." },
  { roll: 4, name: "편집증", desc: "모든 존재가 자신을 해치려 한다는 의심에 사로잡힙니다." },
  { roll: 5, name: "맹목적 도주", desc: "이유 불문하고 반대 방향을 향해 무작정 질주합니다." },
  { roll: 6, name: "히스테리성 실성", desc: "통제할 수 없는 기괴한 웃음과 눈물을 쏟아냅니다." },
  { roll: 7, name: "신체 반응 이상", desc: "말을 할 수 없거나 온몸이 사시나무 떨듯 마비됩니다." },
  { roll: 8, name: "기억 상실", desc: "직전 30분간 목격한 공포스러운 진실에 대한 기억이 지워집니다." },
  { roll: 9, name: "파괴 충동", desc: "주변의 사물을 닥치는 대로 부수거나 던지려 합니다." },
  { roll: 10, name: "긴장증 (Catatonia)", desc: "넋이 완전히 나가 석상처럼 굳어버립니다." }
];

export default function App() {
  // 시스템 기본 상태
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI/모달 상태
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPalette, setCurrentPalette] = useState("crimson_velvet");
  const [soundVolume, setSoundVolume] = useState(0.6);
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [ruleHelpModalKey, setRuleHelpModalKey] = useState(null);

  // 설정 마법사 및 프리셋 상태 (복구됨)
  const [ruleCategory, setRuleCategory] = useState("official");
  const [wizardMode, setWizardMode] = useState("coc");
  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("24");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [charPortraitUrl, setCharPortraitUrl] = useState("");
  const [scenarioInput, setScenarioInput] = useState("");
  const [playPreference, setPlayPreference] = useState("#GL #집착 #오컬트");
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // 룰별 고유 수치 (복구됨)
  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");
  const [unsungMutation, setUnsungMutation] = useState("");
  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });
  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedSan = Number(cocStats.pow);

  // 다이스 및 광기 연출
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [madnessModal, setMadnessModal] = useState(null);
  const [showInsanityFlash, setShowInsanityFlash] = useState(false);

  const activePalette = THEME_PALETTES[currentPalette] || THEME_PALETTES.crimson_velvet;
  const theme = isDarkMode ? activePalette.dark : activePalette.light;

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

  const playDiceSound = () => {
    if (soundVolume <= 0) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // 제목 변경 기능 (신규)
  const handleEditTitle = (id, currentTitle) => {
    const newTitle = window.prompt("새로운 시나리오 제목을 입력하세요:", currentTitle);
    if (newTitle !== null && newTitle.trim() !== "") {
      setSessions((prev) => prev.map((s) => s.id === id ? { ...s, title: newTitle.trim() } : s));
    }
  };

  // 수치 수동 조절 및 광기 감지
  const adjustStat = (statName, delta) => {
    if (!activeSession) return;
    const currentVal = Number(activeSession.sheet?.[statName] ?? 50);
    const newVal = Math.max(0, currentVal + delta);
    if (activeSession.ruleMode === "coc" && statName === "san" && delta <= -5) {
      triggerMadnessCheck(Math.abs(delta), activeSessionId);
    }
    const updatedSheet = { ...activeSession.sheet, [statName]: newVal };
    setSessions((prev) => prev.map((s) => s.id === activeSessionId ? { ...s, sheet: updatedSheet } : s));
  };

  const triggerMadnessCheck = (lossAmount, targetSessionId) => {
    const roll1D10 = Math.floor(Math.random() * 10) + 1;
    const madness = MADNESS_TABLE_1D10.find((m) => m.roll === roll1D10) || MADNESS_TABLE_1D10[0];
    setShowInsanityFlash(true);
    setTimeout(() => setShowInsanityFlash(false), 800);
    setMadnessModal({ loss: lossAmount, roll: roll1D10, name: madness.name, desc: madness.desc, sessionId: targetSessionId });
    setSessions((prev) => prev.map((s) => s.id === targetSessionId ? { ...s, sheet: { ...s.sheet, madnessStatus: `일시적 광기: ${madness.name}` } } : s));
  };

  const confirmMadnessToMaster = () => {
    if (!madnessModal) return;
    const madnessNotice = `[⚠️ CoC 정규 룰: 이성치 ${madnessModal.loss}점 급감으로 1D10=${madnessModal.roll} 굴림 ➔ '${madnessModal.name}' 발작 발생]`;
    setMadnessModal(null);
    executeMessage(madnessNotice);
  };

  const parseTagsSafely = (rawText) => {
    let cleanText = rawText || "";
    let parsedData = { suggActions: [], pendingCheck: null, newSheetVars: {}, investigationSpots: [], revealedSecrets: [] };
    
    try {
      const suggMatch = cleanText.match(/<!--\s*SUGGESTIONS:\s*(\[.*?\])\s*-->/is);
      if (suggMatch) parsedData.suggActions = JSON.parse(suggMatch[1]);
      
      const spotsMatch = cleanText.match(/<!--\s*SPOTS:\s*(\[.*?\])\s*-->/is);
      if (spotsMatch) parsedData.investigationSpots = JSON.parse(spotsMatch[1]);
      
      const statMatch = cleanText.match(/<!--\s*STATUS:\s*({.*?})\s*-->/is);
      if (statMatch) parsedData.newSheetVars = JSON.parse(statMatch[1]);
      
      const checkMatch = cleanText.match(/<!--\s*CHECK:\s*({.*?})\s*-->/is);
      if (checkMatch) parsedData.pendingCheck = JSON.parse(checkMatch[1]);
      
      const secRegex = /<!--\s*REVEAL_SECRET:\s*({.*?})\s*-->/gis;
      const secMatches = [...cleanText.matchAll(secRegex)];
      secMatches.forEach(match => { parsedData.revealedSecrets.push(JSON.parse(match[1])); });
    } catch (e) {}

    cleanText = cleanText.replace(/```html|```json|```/gi, "").replace(/<!--[\s\S]*?-->/g, "").trim();
    return { cleanText, parsedData };
  };

  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;
    const updatedMessages = [...(activeSession.messages || []), { role: "user", text: textToSend }];
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [], pendingCheck: null } : s)));
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, scenarioText: activeSession.scenarioText, playerSheet: activeSession.sheet, ruleMode: activeSession.ruleMode, playPreference: activeSession.preference }),
      });

      const data = await response.json();
      const { cleanText, parsedData } = parseTagsSafely(data.text || "");

      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };
      
      // NPC 비밀 공개 처리
      if (parsedData.revealedSecrets.length > 0) {
        parsedData.revealedSecrets.forEach(rev => {
          newSheet.npcs = (newSheet.npcs || []).map(npc => npc.name === rev.name ? { ...npc, secret: rev.secret, secretRevealed: true } : npc);
        });
      }

      // SAN 급감 감지 (CoC 전용)
      if (activeSession.ruleMode === "coc") {
        const prevSan = Number(activeSession.sheet?.san ?? 50);
        let newSan = parsedData.newSheetVars?.san !== undefined ? Number(parsedData.newSheetVars.san) : prevSan;
        if (prevSan - newSan >= 5) triggerMadnessCheck(prevSan - newSan, activeSessionId);
      }

      setSessions((prev) => prev.map((s) => s.id === activeSessionId ? {
        ...s, sheet: newSheet, messages: [...updatedMessages, { role: "model", text: cleanText }],
        suggestedActions: parsedData.suggActions, investigationSpots: parsedData.investigationSpots, pendingCheck: parsedData.pendingCheck,
      } : s));
    } catch (err) { alert(`통신 오류: ${err.message}`); } finally { setIsLoading(false); }
  };

  const sendMessage = () => { if (!input.trim()) return; const text = input; setInput(""); executeMessage(text); };

  const handleRollback = (msgIndex) => {
    if (!window.confirm("이 발언을 취소하고 수정하시겠습니까? (이후의 답변도 취소됩니다)")) return;
    setInput(activeSession.messages[msgIndex].text);
    const newMessages = activeSession.messages.slice(0, msgIndex);
    setSessions((prev) => prev.map((s) => s.id === activeSessionId ? { ...s, messages: newMessages } : s));
  };

  // 다이내믹 다이스 롤러 (룰에 맞춰 1D100, 2D6, 1D20 지원)
  const rollDiceDirectly = (overrideTarget = null, skillName = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true); playDiceSound();
    const mode = activeSession.ruleMode;

    const rollInterval = setInterval(() => {
      setRollingDisplayNum(Math.floor(Math.random() * (mode === "coc" ? 100 : 20)) + 1);
    }, 50);

    setTimeout(() => {
      clearInterval(rollInterval);
      let rollFormatted = "";
      
      if (mode === "insane" || mode === "unsung") {
        const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const sum = d1 + d2;
        const targetVal = Number(overrideTarget || (mode === "unsung" ? 6 : 5));
        let outcome = sum === 12 ? "스페셜(대성공)" : sum === 2 ? "펌블(대실패)" : sum >= targetVal ? "성공" : "실패";
        rollFormatted = `[🎲 시스템 공인 2D6 ${skillName} 판정: ${d1}+${d2}=${sum} / 목표: ${targetVal} ➔ 결과: ${outcome}]`;
      } else if (mode === "coc") {
        const roll = Math.floor(Math.random() * 100) + 1; const targetVal = Number(overrideTarget || 50);
        let outcome = roll === 1 ? "대성공" : roll <= Math.floor(targetVal / 5) ? "극단적 성공" : roll <= Math.floor(targetVal / 2) ? "어려운 성공" : roll <= targetVal ? "보통 성공" : roll >= 96 ? "대실패" : "실패";
        rollFormatted = `[🎲 CoC 1D100 ${skillName} 판정: ${roll} / 목표: ${targetVal} ➔ 결과: ${outcome}]`;
      } else {
        const roll = Math.floor(Math.random() * 20) + 1; const targetVal = Number(overrideTarget || 12);
        const outcome = roll >= targetVal ? "성공" : "실패";
        rollFormatted = `[🎲 자유 1D20 ${skillName} 판정: ${roll} / DC: ${targetVal} ➔ 결과: ${outcome}]`;
      }

      setIsRolling(false);
      executeMessage(rollFormatted);
    }, 600);
  };

  const startNewSession = async () => {
    const sessionTitle = charName ? `${charName}의 이야기` : "새로운 모험";
    let initialSheet = {
      name: charName || "주인공", job: charJob || "조사원", age: charAge, gender: charGender,
      hp: 10, maxHp: 10, items: [{ name: "기본 호신구", desc: "쓸모있어 보인다." }],
      npcs: [{ name: "파트너", title: "동행자", affection: 10, state: "신뢰" }]
    };

    if (wizardMode === "insane") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, cycle: 1, scene: 1, mission: charMission || "생존", secret: charSecret };
    } else if (wizardMode === "coc") {
      initialSheet = { ...initialSheet, hp: derivedHp, maxHp: derivedHp, san: derivedSan, maxSan: 99, luck: Number(cocStats.luck), cocStats: { ...cocStats } };
    } else if (wizardMode === "unsung") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, erosion: 1, mutation: unsungMutation || "미확인 징후" };
    }

    const newId = Date.now();
    const newSession = {
      id: newId, title: sessionTitle, ruleMode: wizardMode, preference: playPreference,
      scenarioText: scenarioInput, sheet: initialSheet, messages: [], suggestedActions: [], investigationSpots: [], pendingCheck: null,
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text: "[세션 시작] 서막을 열고 탐색 가능한 구역 2~3곳을 제시해 주세요." }], scenarioText: scenarioInput, playerSheet: initialSheet, ruleMode: wizardMode, playPreference: playPreference }),
      });
      const data = await response.json();
      const { cleanText, parsedData } = parseTagsSafely(data.text || "");
      setSessions((prev) => prev.map((s) => s.id === newId ? {
        ...s, sheet: { ...initialSheet, ...parsedData.newSheetVars }, messages: [{ role: "model", text: cleanText }],
        suggestedActions: parsedData.suggActions, investigationSpots: parsedData.investigationSpots, pendingCheck: parsedData.pendingCheck,
      } : s));
    } catch (err) { alert("서막을 시작하지 못했습니다."); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("rp_hub_sessions");
      if (saved) setSessions(JSON.parse(saved));
      const savedPalette = localStorage.getItem("rp_hub_palette");
      if (savedPalette && THEME_PALETTES[savedPalette]) setCurrentPalette(savedPalette);
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try { localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions)); } catch (e) {}
  }, [sessions, isLoaded]);

  // PDF 업로드 처리 (복원)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setIsPdfLoading(true);
      try {
        if (!window.pdfjsLib) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js)";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js)";
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = "";
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText += content.items.map((item) => item.str).join(" ") + "\n";
        }
        setScenarioInput(extractedText.trim());
      } catch (err) { alert("PDF 읽기 실패"); } finally { setIsPdfLoading(false); }
    }
  };

  return (
    <div style={{ display: "flex", height: "100dvh", width: "100vw", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, sans-serif", overflow: "hidden", position: "relative" }}>
      
      {showInsanityFlash && <div style={{ position: "fixed", inset: 0, zIndex: 120, backgroundColor: "rgba(220, 20, 60, 0.45)", pointerEvents: "none", transition: "opacity 0.8s ease" }} />}
      {isMobile && isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 45 }} />}
      {isMobile && isSheetOpen && <div onClick={() => setIsSheetOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 45 }} />}

      {/* 1. 좌측 사이드바 */}
      <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, left: 0, top: 0, bottom: 0, height: isMobile ? "100dvh" : "100%", width: isSidebarOpen ? "260px" : "0px", overflow: "hidden", backgroundColor: theme.sidebar, borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", transition: "all 0.25s ease" }}>
        <div style={{ padding: "14px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button onClick={() => { setActiveSessionId(null); if (isMobile) setIsSidebarOpen(false); }} style={{ flex: 1, padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>+ 새 시나리오</button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.map((s) => (
            <div key={s.id} onClick={() => { setActiveSessionId(s.id); if (isMobile) setIsSidebarOpen(false); }} style={{ padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "4px", backgroundColor: activeSessionId === s.id ? theme.panelAlt : "transparent", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "700", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px", paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={() => setShowSettingsModal(true)} style={{ width: "100%", padding: "10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.82rem", fontWeight: "700" }}>⚙️ 환경 설정</button>
        </div>
      </div>

      {/* 2. 중앙 메인 뷰 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {!activeSession ? (
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 140px 14px" : "28px 24px 80px 24px", maxWidth: "800px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>새로운 세션 구성</h2>
            
            {/* 룰 선택 */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "14px", border: `1px solid ${theme.border}` }}>
              <span style={{ fontWeight: "800", fontSize: "0.88rem", marginBottom: "10px", display: "block" }}>1. TRPG 룰 시스템 선택</span>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "8px" }}>
                {Object.entries(RULE_GUIDES).map(([key, data]) => (
                  <div key={key} onClick={() => setWizardMode(key)} style={{ padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${wizardMode === key ? theme.accent : theme.border}`, backgroundColor: wizardMode === key ? theme.panelAlt : "transparent", cursor: "pointer" }}>
                    <div style={{ fontWeight: "700", fontSize: "0.85rem", color: wizardMode === key ? theme.accent : theme.text }}>{data.title}</div>
                    <div style={{ fontSize: "0.68rem", color: theme.textMuted, marginTop: "2px" }}>{data.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="주인공 이름" style={{ flex: 1, padding: "10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text }} />
              <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업/역할" style={{ flex: 1, padding: "10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text }} />
            </div>
            
            <input type="text" value={playPreference} onChange={(e) => setPlayPreference(e.target.value)} placeholder="서사 성향 태그 (예: #오컬트 #쌍방구원)" style={{ padding: "10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text }} />
            
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "14px", border: `1px solid ${theme.border}` }}>
              <span style={{ fontWeight: "800", fontSize: "0.88rem", marginBottom: "10px", display: "block" }}>PDF 시나리오 업로드 또는 직접 입력</span>
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} style={{ marginBottom: "10px", display: "block", width: "100%" }} />
              {isPdfLoading && <div style={{ fontSize: "0.75rem", color: theme.warning, marginBottom: "8px" }}>⏳ PDF 텍스트 추출 중...</div>}
              <textarea value={scenarioInput} onChange={(e) => setScenarioInput(e.target.value)} placeholder="시나리오 배경을 적어주세요." style={{ width: "100%", height: "100px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text }} />
            </div>

            <button onClick={startNewSession} disabled={isLoading || isPdfLoading} style={{ width: "100%", padding: "16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "1.05rem" }}>
              {isLoading ? "마스터가 서막을 쓰는 중..." : "이야기 시작하기"}
            </button>
          </div>
        ) : (
          <>
            {/* 상단 바 및 제목 수정 버튼 */}
            <div style={{ height: "50px", padding: "0 14px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "5px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px" }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <span style={{ fontWeight: "800", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activeSession.title}</span>
                <button onClick={() => handleEditTitle(activeSession.id, activeSession.title)} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: "0.8rem", padding: "4px" }}>✏️</button>
                
                {activeSession.sheet?.madnessStatus && (
                  <span style={{ padding: "2px 8px", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1px solid ${theme.danger}`, borderRadius: "4px", fontSize: "0.7rem", color: theme.danger, fontWeight: "800", marginLeft: "6px" }}>
                    ⚠️ {activeSession.sheet.madnessStatus}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => rollDiceDirectly(null, "일반")} disabled={isRolling || isLoading} style={{ padding: "6px 12px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "16px", fontWeight: "700", fontSize: "0.75rem" }}>
                  🎲 굴리기
                </button>
                <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: "5px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", fontSize: "0.75rem" }}>{isSheetOpen ? "시트▶" : "◀시트"}</button>
              </div>
            </div>

            {/* 대화 로그 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {isRolling && (
                <div style={{ position: "fixed", top: "70px", left: "50%", transform: "translateX(-50%)", backgroundColor: theme.panel, border: `2px solid ${theme.accent}`, borderRadius: "12px", padding: "10px 24px", zIndex: 60, fontWeight: "800", fontSize: "1.2rem", color: theme.accent }}>
                  🎲 판정 롤링... {rollingDisplayNum}
                </div>
              )}

              {(activeSession.messages || []).map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "94%" : "84%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ backgroundColor: m.text.includes("[🎲") || m.text.includes("[⚠️") ? "rgba(229, 169, 60, 0.15)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi, color: m.role === "user" && !m.text.includes("[🎲") && !m.text.includes("[⚠️") ? "#fff" : theme.text, border: `1px solid ${m.text.includes("[⚠️") ? theme.danger : m.text.includes("[🎲") ? theme.warning : theme.border}`, padding: "12px 16px", borderRadius: "12px", lineHeight: "1.7", whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                    {m.text}
                  </div>
                  {m.role === "user" && (
                    <button onClick={() => handleRollback(i)} title="발언 취소/수정" style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.7rem", cursor: "pointer", marginTop: "4px" }}>
                      ↩️ 되돌리기
                    </button>
                  )}
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.85rem" }}>키퍼가 서사를 기록 중입니다...</div>}
            </div>

            {/* 터치형 조사 구역 (SPOTS) & 판정 유도 (CHECK) */}
            <div style={{ backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "6px", padding: "8px 12px" }}>
              {activeSession.pendingCheck && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(247, 101, 133, 0.15)", border: `1.5px solid ${theme.danger}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: theme.danger }}>
                    ⚠️ {activeSession.pendingCheck.skill} 판정 요구 (목표: {activeSession.pendingCheck.target || "?"})
                  </span>
                  <button onClick={() => rollDiceDirectly(activeSession.pendingCheck.target, activeSession.pendingCheck.skill)} style={{ padding: "5px 12px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.78rem" }}>
                    🎲 즉시 굴리기
                  </button>
                </div>
              )}

              {(activeSession.investigationSpots || []).length > 0 && !isLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.74rem", color: theme.warning, fontWeight: "700" }}>🔍 조사 구역:</span>
                  {activeSession.investigationSpots.map((spot, idx) => (
                    <button key={idx} onClick={() => executeMessage(`[조사 행동] ${spot.name}을(를) 살핍니다.`)} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "14px", color: theme.text, fontSize: "0.75rem", cursor: "pointer", fontWeight: "600" }}>
                      {spot.name}
                    </button>
                  ))}
                </div>
              )}

              {(activeSession.suggestedActions || []).length > 0 && !isLoading && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.74rem", color: theme.accent, fontWeight: "700" }}>💡 제안:</span>
                  {activeSession.suggestedActions.map((sugg, idx) => (
                    <button key={idx} onClick={() => setInput(sugg)} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "14px", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>
                      {sugg}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 입력창: 모바일 줄바꿈 고정 및 UI 확장 */}
            <div style={{ padding: "10px 12px", paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (isMobile) return;
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder="행동이나 대사를 적어주세요 (모바일은 전송 버튼을 누르세요)..."
                style={{ flex: 1, minHeight: "52px", maxHeight: "130px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px", outline: "none", fontSize: "16px", lineHeight: "1.4", resize: "vertical" }}
              />
              <button onClick={sendMessage} disabled={isLoading} style={{ height: "52px", padding: "0 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "0.9rem" }}>
                전송
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 시트창 */}
      {activeSession && (
        <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, right: 0, top: 0, bottom: 0, height: isMobile ? "100dvh" : "100%", width: isSheetOpen ? "280px" : "0px", overflow: "hidden", backgroundColor: theme.sidebar, borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", transition: "all 0.25s ease" }}>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto" }}>
            <h4 style={{ margin: 0, color: theme.accent, fontWeight: "800" }}>{RULE_GUIDES[activeSession.ruleMode]?.title} 시트</h4>
            <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>{activeSession.sheet?.name} ({activeSession.sheet?.job})</div>

            {/* 수동 수치 조절 (CoC 전용 이성치 포함) */}
            {activeSession.ruleMode === "coc" && (
              <div style={{ backgroundColor: theme.panelAlt, padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ color: theme.danger, fontWeight: "700", fontSize: "0.8rem" }}>이성 (SAN)</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button onClick={() => adjustStat("san", -5)} title="5점 급감 (광기 테스트)" style={{ padding: "2px 5px", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: "4px", fontSize: "0.7rem", fontWeight: "800" }}>-5</button>
                    <button onClick={() => adjustStat("san", -1)} style={{ padding: "2px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", fontWeight: "800" }}>-1</button>
                    <strong style={{ fontSize: "0.85rem", minWidth: "50px", textAlign: "center" }}>{activeSession.sheet?.san ?? 50} / 99</strong>
                    <button onClick={() => adjustStat("san", 1)} style={{ padding: "2px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", fontWeight: "800" }}>+1</button>
                  </div>
                </div>
                <div style={{ height: "6px", width: "100%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, ((activeSession.sheet?.san ?? 50) / 99) * 100)}%`, backgroundColor: theme.danger }} />
                </div>
              </div>
            )}

            {/* 공통 체력(HP) */}
            <div style={{ backgroundColor: theme.panelAlt, padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ color: theme.warning, fontWeight: "700", fontSize: "0.8rem" }}>체력 (HP)</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button onClick={() => adjustStat("hp", -1)} style={{ padding: "2px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.danger, borderRadius: "4px", fontWeight: "800" }}>-1</button>
                  <strong style={{ fontSize: "0.85rem", minWidth: "40px", textAlign: "center" }}>{activeSession.sheet?.hp ?? 10} / {activeSession.sheet?.maxHp ?? 10}</strong>
                  <button onClick={() => adjustStat("hp", 1)} style={{ padding: "2px 5px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.success, borderRadius: "4px", fontWeight: "800" }}>+1</button>
                </div>
              </div>
              <div style={{ height: "6px", width: "100%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, ((activeSession.sheet?.hp ?? 10) / (activeSession.sheet?.maxHp ?? 10)) * 100)}%`, backgroundColor: theme.warning }} />
              </div>
            </div>

            {/* 인벤토리 (복구됨) */}
            <div style={{ marginTop: "10px" }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.84rem", color: theme.accent, fontWeight: "800" }}>🎒 소지품</h4>
              {(activeSession.sheet?.items || []).map((item, idx) => (
                <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "7px 10px", fontSize: "0.76rem", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                  <strong>{item.name}</strong>
                  <button onClick={() => setInput(`품에서 [${item.name}]을(를) 꺼내어 `)} style={{ padding: "2px 7px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.accent, borderRadius: "4px", cursor: "pointer", fontSize: "0.68rem" }}>사용</button>
                </div>
              ))}
            </div>

            {/* NPC 호감도 (복구됨) */}
            <div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.84rem", color: theme.accent, fontWeight: "800" }}>NPC 호감도</h4>
              {(activeSession.sheet?.npcs || []).map((npc, idx) => (
                <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 10px", marginBottom: "6px", fontSize: "0.76rem" }}>
                  <div style={{ fontWeight: "700", display: "flex", justifyContent: "space-between" }}>
                    <span>{npc.name}</span>
                    <span style={{ color: theme.danger }}>♥ {npc.affection || 0}</span>
                  </div>
                  <div style={{ color: theme.textMuted, fontSize: "0.7rem" }}>{npc.secretRevealed ? npc.secret : npc.state || npc.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 설정 모달 (테마 팔레트 선택) */}
      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "460px", padding: "24px", color: theme.text }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "1.05rem" }}>⚙️ 환경 설정</h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "700", display: "block", marginBottom: "8px" }}>테마 색상 팔레트</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {Object.entries(THEME_PALETTES).map(([key, p]) => (
                  <button key={key} onClick={() => { setCurrentPalette(key); localStorage.setItem("rp_hub_palette", key); }} style={{ padding: "8px 10px", borderRadius: "8px", border: `1.5px solid ${currentPalette === key ? theme.accent : theme.border}`, backgroundColor: currentPalette === key ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.8rem", cursor: "pointer", fontWeight: currentPalette === key ? "700" : "500" }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setShowSettingsModal(false)} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>닫기</button>
          </div>
        </div>
      )}

      {/* 일시적 광기 발작 팝업 모달 */}
      {madnessModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 130, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `2px solid ${theme.danger}`, borderRadius: "14px", width: "100%", maxWidth: "440px", padding: "24px", color: theme.text, boxShadow: "0 0 30px rgba(247, 101, 133, 0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: theme.danger, fontWeight: "800" }}>⚠️ 일시적 광기 발작!</h3>
            </div>
            <div style={{ fontSize: "0.85rem", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ color: theme.warning }}>이성치가 한 번에 {madnessModal.loss}점 감소했습니다!</div>
              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>1D10 굴림: {madnessModal.roll}번</div>
                <div style={{ fontSize: "1.05rem", fontWeight: "800", color: theme.danger }}>[{madnessModal.name}]</div>
                <div style={{ fontSize: "0.82rem", color: theme.text }}>{madnessModal.desc}</div>
              </div>
            </div>
            <button onClick={confirmMadnessToMaster} style={{ marginTop: "20px", width: "100%", padding: "12px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "800" }}>서사에 반영하기</button>
          </div>
        </div>
      )}
    </div>
  );
}
