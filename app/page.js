"use client";
import { useState, useEffect } from "react";

// 테마 팔레트 4종 & 다크/라이트 모드
const THEME_PALETTES = {
  midnight: {
    name: "미드나잇 블루",
    dark: { bg: "#090b10", sidebar: "#0f131c", panel: "#151a26", panelAlt: "#1c2333", border: "rgba(108, 141, 250, 0.2)", text: "#e6eaf5", textMuted: "#8591ab", accent: "#6c8dfa", accentGlow: "rgba(108, 141, 250, 0.35)", danger: "#f76585", warning: "#e5a93c", success: "#62d681", bubbleUser: "#25355e", bubbleAi: "#151a26", inputBg: "#0f131c" },
    light: { bg: "#f0f4fc", sidebar: "#e2e8f5", panel: "#ffffff", panelAlt: "#ebf1fd", border: "rgba(58, 104, 216, 0.2)", text: "#1a2233", textMuted: "#5e6c88", accent: "#3a68d8", accentGlow: "rgba(58, 104, 216, 0.25)", danger: "#d63857", warning: "#b57212", success: "#26823f", bubbleUser: "#4b74cb", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  abyss: {
    name: "심연 어비스",
    dark: { bg: "#040507", sidebar: "#080a0f", panel: "#0d1118", panelAlt: "#131822", border: "rgba(86, 121, 224, 0.2)", text: "#dfe3ee", textMuted: "#6b7488", accent: "#5679e0", accentGlow: "rgba(86, 121, 224, 0.35)", danger: "#e0536c", warning: "#cfa14c", success: "#5eb871", bubbleUser: "#1a2a4d", bubbleAi: "#0d1118", inputBg: "#080a0f" },
    light: { bg: "#f3f5f8", sidebar: "#e4e8f0", panel: "#ffffff", panelAlt: "#eaeff6", border: "rgba(52, 82, 168, 0.2)", text: "#12151c", textMuted: "#5c6475", accent: "#3452a8", accentGlow: "rgba(52, 82, 168, 0.25)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "#435994", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  sepia: {
    name: "고서적 세피아",
    dark: { bg: "#1a1512", sidebar: "#15100e", panel: "#241d18", panelAlt: "#302620", border: "rgba(212, 155, 106, 0.22)", text: "#ebe1d5", textMuted: "#9c8b7c", accent: "#d49b6a", accentGlow: "rgba(212, 155, 106, 0.35)", danger: "#d95b5b", warning: "#e3ad5d", success: "#8bb36b", bubbleUser: "#4a3526", bubbleAi: "#241d18", inputBg: "#15100e" },
    light: { bg: "#faf7f2", sidebar: "#f1ebe0", panel: "#ffffff", panelAlt: "#ece4d6", border: "rgba(166, 100, 46, 0.22)", text: "#30241b", textMuted: "#7a6755", accent: "#a6642e", accentGlow: "rgba(166, 100, 46, 0.25)", danger: "#b83b3b", warning: "#ad7017", success: "#48782f", bubbleUser: "#825d3d", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  classic: {
    name: "클래식 모던",
    dark: { bg: "#0f1115", sidebar: "#14171d", panel: "#1a1e26", panelAlt: "#222732", border: "rgba(93, 167, 232, 0.2)", text: "#abb3c2", textMuted: "#727b8e", accent: "#5da7e8", accentGlow: "rgba(93, 167, 232, 0.35)", danger: "#dc656f", warning: "#dfb974", success: "#90be72", bubbleUser: "#2e3b50", bubbleAi: "#1a1e26", inputBg: "#14171d" },
    light: { bg: "#f5f7fa", sidebar: "#ebedf2", panel: "#ffffff", panelAlt: "#e2e6ed", border: "rgba(35, 97, 230, 0.2)", text: "#20232a", textMuted: "#636a78", accent: "#2361e6", accentGlow: "rgba(35, 97, 230, 0.25)", danger: "#d42424", warning: "#ce7104", success: "#149a44", bubbleUser: "#3b82f6", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  }
};

// 4대 정규 룰 가이드
const RULE_GUIDES = {
  coc: {
    title: "크툴루의 부름 (Call of Cthulhu 7판)",
    desc: "러브크래프트의 코스믹 호러 기반 정통 추리 TRPG입니다. 평범한 인간 조사원들이 상식을 초월한 금기의 진실과 조우합니다.",
    system: "1D100 다이스 판정. 이성치(SAN) 감소 및 광기 관리, 8대 특성치(460pt) 분배 기반."
  },
  insane: {
    title: "멀티 호러 TRPG 인세인 (inSANe)",
    desc: "의심과 광기가 교차하는 현대 괴담 호러. 겉보기 사명 뒤에 치명적인 비밀을 품고 있습니다.",
    system: "2D6 판정. 사이클마다 씬을 소모해 비밀(Secret)을 조사하며 공포를 극복합니다."
  },
  unsung: {
    title: "언성 듀엣 (Unsung Duet)",
    desc: "이계 '시프터'에 갇힌 조난자(셰이터)와 구원자(바인더) 단둘의 처절한 2인 서사 TRPG입니다.",
    system: "2D6 판정. 위기 시 이계 침식도(0~6)가 상승하며 신체/정신적 '변이'가 발현됩니다."
  },
  freeform: {
    title: "자유 서사 (Freeform Sandbox)",
    desc: "정형화된 룰북 없이 관계성과 분위기, 스토리텔링에 온전히 몰입하는 샌드박스 서사 모드입니다.",
    system: "직관적인 1D20 판정과 키퍼와의 유연한 대화로 이야기를 직조합니다."
  }
};

const ORIENT_TAGS = ["#GL", "#BL", "#HL", "#논로맨스"];
const TROPE_TAGS = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#오컬트", "#광기"];

// CoC 원형 다이얼 게이지 컴포넌트
function CircularGauge({ value = 0, max = 100, label, color, size = 56 }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const safeVal = Math.min(Math.max(Number(value) || 0, 0), max);
  const strokeDashoffset = circumference - (safeVal / max) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: `${size}px` }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="4.5" fill="none" />
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke={color}
            strokeWidth="4.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 30 30)"
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "0.82rem" }}>
          {value}
        </div>
      </div>
      <span style={{ fontSize: "0.68rem", fontWeight: "600", color: "#8e96b3", marginTop: "2px" }}>{label}</span>
    </div>
  );
}

// 언성 듀엣 세그먼트 침식 바 컴포넌트
function SegmentedErosionBar({ current = 0, max = 6, color = "#b87bd8", label = "이계 침식도" }) {
  const safeCurrent = Math.min(Math.max(Number(current) || 0, 0), max);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem" }}>
        <span style={{ fontWeight: "700", color: color }}>{label}</span>
        <strong>{safeCurrent} / {max}</strong>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < safeCurrent;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: "10px",
                borderRadius: "2px",
                backgroundColor: filled ? color : "rgba(255,255,255,0.08)",
                boxShadow: filled ? `0 0 8px ${color}` : "none",
                transition: "all 0.3s ease"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 모바일 뷰포트 & 사이드바
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 모달 제어
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreHelpModal, setShowRestoreHelpModal] = useState(false);
  const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [ruleHelpModalKey, setRuleHelpModalKey] = useState(null);

  // 초상화 설정
  const [showPortraits, setShowPortraits] = useState(true);
  const [portraitStyle, setPortraitStyle] = useState("anime");

  // 백업 포맷
  const [backupFormat, setBackupFormat] = useState("json");
  const [backupTarget, setBackupTarget] = useState("all");

  // 테마 시스템
  const [currentPalette, setCurrentPalette] = useState("midnight");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 사운드 & 연출
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);

  // 대화록 내보내기 포맷
  const [exportFormat, setExportFormat] = useState("txt");
  const [exportScope, setExportScope] = useState("all");

  // API 모니터링
  const [apiUsage, setApiUsage] = useState({ date: new Date().toISOString().slice(0, 10), dailyRequests: 0, totalTokens: 0, lastPromptTokens: 0, lastResponseTokens: 0 });

  // 4대 정규 룰 모드 ('freeform' | 'coc' | 'insane' | 'unsung')
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
  const [scenarioInput, setScenarioInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 서사 계승 상태 (다중 선택 ID 배열)
  const [selectedCareerIds, setSelectedCareerIds] = useState([]);
  const [pastChronicleText, setPastChronicleText] = useState("");

  // 프리셋 목록
  const [customPresets, setCustomPresets] = useState([]);
  const [newPresetTitle, setNewPresetTitle] = useState("");

  // 룰별 고유 상태
  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");
  const [unsungMutation, setUnsungMutation] = useState("");

  // CoC 460pt 특성치 연산
  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });
  const totalAllocated = Number(cocStats.str) + Number(cocStats.con) + Number(cocStats.siz) + Number(cocStats.dex) + Number(cocStats.app) + Number(cocStats.int) + Number(cocStats.pow) + Number(cocStats.edu);
  const remainingPoints = 460 - totalAllocated;
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

  // 관계성 지향 태그
  const [playPreference, setPlayPreference] = useState("#GL #집착 #오컬트");

  // 주사위 판정 상태
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(5);
  const [targetStat, setTargetStat] = useState(50);

  const activePalette = THEME_PALETTES[currentPalette] || THEME_PALETTES.midnight;
  const theme = isDarkMode ? activePalette.dark : activePalette.light;
  const quotaPercentage = Math.min(100, Math.round((apiUsage.dailyRequests / 1500) * 100));

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
      if (currentList.includes(tag)) {
        return currentList.filter((t) => t !== tag).join(" ");
      } else {
        return [...currentList, tag].join(" ");
      }
    });
  };

  const handleSelectCategory = (category) => {
    setRuleCategory(category);
    if (category === "freeform") setWizardMode("freeform");
    else if (wizardMode === "freeform") setWizardMode("coc");
  };

  const getPortraitUrl = (promptText, forceStyle) => {
    const clean = promptText || "character portrait";
    const currentStyle = forceStyle || portraitStyle;
    const styleTag = currentStyle === "anime" 
      ? "anime style, 2d illustration, masterpiece" 
      : "realistic photography, highly detailed, cinematic lighting, 8k";
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(clean + ", " + styleTag)}?width=300&height=300&nologo=true`;
  };

  const proceduralData = {
    names: {
      western: ["사반", "로웨나", "세실리아", "비비안", "엘레노어", "카밀라", "발렌티나", "이졸데", "마리안", "키이라", "아리아", "알렉스"],
      korean: ["서윤", "도아", "은채", "하경", "지수", "연우", "태리", "수아", "유진", "세아"]
    },
    jobs: {
      coc: [
        { region: "western", job: "고서적 감정사", item: "황동 돋보기, 가죽 수첩, 은제 단도", bg: "고대 비전서의 기괴한 필적을 감정하며 살아온 인물." },
        { region: "korean", job: "민속학 대학원생", item: "캠코더, 소형 녹음기, 낡은 부적", bg: "토속 신앙과 괴담을 연구하며 방방곡곡을 돌아다니는 대학원생." },
      ],
      insane: [
        { region: "western", job: "기숙학교 학생", item: "오르골 태엽 열쇠, 만년필, 붕대", bg: "엄격한 규율의 명문 기숙학교 학생. 학교에 숨겨진 비밀을 밝혀내려 한다." },
        { region: "korean", job: "폐병원 탐험 BJ", item: "짐벌 카메라, 보조 배터리, 야광 스틱", bg: "흉가와 폐병원을 넘나들며 생방송을 강행하는 스트리머." },
      ],
      unsung: [
        { region: "western", job: "이계의 조난자 (셰이터)", item: "깨진 회중시계, 낡은 일기장", bg: "기괴하게 뒤틀린 이계(시프터)에 휘말린 평범한 인간. 구원자에게 의존한다." },
        { region: "korean", job: "이계 진입자 (바인더)", item: "이능력 정제 부적, 결계용 나이프", bg: "이계의 침식을 버텨내며 파트너를 현실로 되찾아오기 위해 뛰어든 이능력자." }
      ],
      freeform: [
        { region: "western", job: "아카데미 수석", item: "마력 만년필, 양피지 노트, 포션", bg: "실력 하나로 수석을 꿰찬 평민 천재." },
        { region: "korean", job: "S급 공인 가이드", item: "안정제 키트, 가이딩 팔찌, 섬광탄", bg: "통제 불능인 에스퍼들을 진정시켜 온 베테랑 가이드." },
      ]
    },
    scenarios: {
      coc: [
        { region: "western", text: "폭풍우와 해무로 고립된 해안 절벽의 빅토리아풍 고택 '블랙우드 저택'. 서재 안쪽에서 유리창이 깨지며 젖은 속삭임이 쏟아집니다." },
        { region: "korean", text: "폭우로 물에 잠긴 도심의 낡은 상가 지하실. 부적과 기괴한 굿판 흔적이 널린 한가운데서 인간의 것이 아닌 울음소리가 들립니다." }
      ],
      insane: [
        { region: "western", text: "안개가 자욱한 숲속의 '성 마리안 기숙학교'. 자정이 지나 지하에서 멈췄던 오르골 소리가 울리며 출입문이 잠깁니다." },
        { region: "korean", text: "출입이 통제된 심야의 폐병원 연구동. 차단된 방화벽 너머에서 죽은 자의 목소리를 흉내 내는 기괴한 알림 방송이 복도를 울립니다." },
      ],
      unsung: [
        { region: "western", text: "비가 내리지 않는 회색 구름 아래, 모든 건물들이 뒤틀린 채 중력을 잃고 부유하는 기괴한 이계 '시프터'. 파트너의 손을 잡지 않으면 현실로 돌아갈 수 없습니다." }
      ],
      freeform: [
        { region: "western", text: "황립 마법 아카데미의 봉인된 지하 서고. 공작가의 차석과 단둘이 갇힌 가운데 고대 금주가 폭주하기 시작합니다." },
        { region: "korean", text: "폭주 경보가 울려 퍼지는 특수 격리 구역. 누구의 손길도 거부하는 폭주 직전의 에스퍼가 피투성이가 된 채 당신의 옷자락을 쥡니다." }
      ]
    },
    insaneMissions: [
      { region: "western", mission: "학교의 7대 괴담 실체를 파헤치고 살아서 졸업한다.", secret: "사실 당신은 1년 전 의식에 휘말려 사망한 유령이다." },
      { region: "korean", mission: "폐병원의 기괴한 현상을 영상으로 담고 무사히 아침을 맞는다.", secret: "당신은 이미 광기에 감염되어 동행자를 제물로 바칠 생각이다." }
    ]
  };

  const handleProceduralGenerate = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const newTags = [pick(ORIENT_TAGS), ...[...TROPE_TAGS].sort(() => 0.5 - Math.random()).slice(0, 2)];
    setPlayPreference(newTags.join(" "));

    const isKorean = Math.random() > 0.5;
    const region = isKorean ? "korean" : "western";
    
    const name = pick(proceduralData.names[region]);
    const modeKey = proceduralData.jobs[wizardMode] ? wizardMode : "freeform";
    
    const availableJobs = proceduralData.jobs[modeKey].filter(j => j.region === region);
    const jobObj = pick(availableJobs.length > 0 ? availableJobs : proceduralData.jobs[modeKey]);
    
    const availableScenarios = proceduralData.scenarios[modeKey].filter(s => s.region === region);
    const scenarioObj = pick(availableScenarios.length > 0 ? availableScenarios : proceduralData.scenarios[modeKey]);

    setCharName(name);
    setCharJob(jobObj.job);
    setCharAge(String(Math.floor(Math.random() * 12) + 18));
    setCharGender("여성");
    setCharBackground(`${jobObj.bg} 품에는 [${jobObj.item}]을(를) 소지하고 있다.`);
    setScenarioInput(scenarioObj.text);
    setCharPortraitUrl(getPortraitUrl(`${name}, ${jobObj.job}`));

    if (wizardMode === "coc") {
      const base = [30, 30, 30, 30, 30, 30, 30, 30];
      let remaining = 220;
      while (remaining > 0) {
        const idx = Math.floor(Math.random() * 8);
        if (base[idx] < 85) { base[idx] += 5; remaining -= 5; }
      }
      setCocStats({ str: base[0], con: base[1], siz: base[2], dex: base[3], app: base[4], int: base[5], pow: base[6], edu: base[7], luck: Math.floor(Math.random() * 50) + 40 });
    } else if (wizardMode === "insane") {
      const msList = proceduralData.insaneMissions.filter(m => m.region === region);
      const ms = pick(msList.length > 0 ? msList : proceduralData.insaneMissions);
      setCharMission(ms.mission);
      setCharSecret(ms.secret);
    } else if (wizardMode === "unsung") {
      setUnsungMutation("왼쪽 눈동자가 푸른빛으로 물드는 징후");
    }
  };

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    const prompt = `당신은 노련한 TRPG 기획자입니다.
선택된 룰 [${wizardMode}]과 서사 성향 [${playPreference}]에 어울리는 캐릭터와 시나리오 도입부를 작성하세요.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "name": "캐릭터 이름",
  "job": "직업/역할",
  "age": "24",
  "gender": "여성",
  "background": "상세 배경 및 소지품 3가지",
  "scenario": "사건의 장소 묘사, 동행 파트너와의 관계성 분위기, 첫 장면의 위기를 포함한 3~4문장의 소설 지문"
}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: prompt }],
          scenarioText: "",
          playerSheet: {},
          ruleMode: wizardMode,
          playPreference: playPreference,
        }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      const jsonMatch = data.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setCharName(parsed.name || "주인공");
        setCharJob(parsed.job || "조사원");
        setCharAge(parsed.age || "24");
        setCharGender(parsed.gender || "여성");
        setCharBackground(parsed.background || "");
        setScenarioInput(parsed.scenario || "");
        setCharPortraitUrl(getPortraitUrl(`${parsed.name}, ${parsed.job}`));
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

  const handleAutoReplaceKpcPc = () => {
    if (!scenarioInput.trim()) return alert("치환할 시나리오 본문이 없습니다.");
    const playerName = charName.trim() || "주인공";
    const partnerName = "파트너";

    let replaced = scenarioInput;
    replaced = replaced.replace(/\bKPC\b/gi, partnerName);
    replaced = replaced.replace(/\bPC\b/gi, playerName);

    setScenarioInput(replaced);
    alert(`시나리오 내 'PC' ➔ '${playerName}', 'KPC' ➔ '${partnerName}'(으)로 치환되었습니다!`);
  };

  const handleSaveCurrentAsPreset = () => {
    if (!charName.trim()) return alert("프리셋으로 저장할 캐릭터 이름을 먼저 입력해 주세요.");
    const title = newPresetTitle.trim() || `${charName} (${charJob || "설정"})`;
    const newPreset = {
      id: Date.now(),
      title: title,
      name: charName,
      job: charJob,
      age: charAge,
      gender: charGender,
      background: charBackground,
      portrait: charPortraitUrl,
      ruleMode: wizardMode,
      cocStats: cocStats,
      mission: charMission,
      secret: charSecret,
      unsungMutation: unsungMutation,
    };
    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_custom_presets", JSON.stringify(updated));
    setNewPresetTitle("");
    alert(`'${title}' 프리셋이 저장되었습니다!`);
  };

  const handleLoadPreset = (preset) => {
    setCharName(preset.name || "");
    setCharJob(preset.job || "");
    setCharAge(preset.age || "24");
    setCharGender(preset.gender || "여성");
    setCharBackground(preset.background || "");
    if (preset.portrait) setCharPortraitUrl(preset.portrait);
    if (preset.cocStats) setCocStats(preset.cocStats);
    if (preset.mission) setCharMission(preset.mission);
    if (preset.secret) setCharSecret(preset.secret);
    if (preset.unsungMutation) setUnsungMutation(preset.unsungMutation);
    closeModal(setShowPresetModal);
  };

  const toggleCareerSelection = (id) => {
    setSelectedCareerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleInheritFromMultipleSessions = () => {
    if (selectedCareerIds.length === 0) return alert("계승할 세션을 1개 이상 체크해 주세요.");
    const chosenSessions = sessions.filter((s) => selectedCareerIds.includes(s.id));
    if (chosenSessions.length === 0) return;

    const baseSheet = chosenSessions[0].sheet || {};
    setCharName(baseSheet.name || "");
    setCharJob(baseSheet.job || "");
    setCharAge(baseSheet.age || "24");
    setCharGender(baseSheet.gender || "여성");
    if (baseSheet.portrait) setCharPortraitUrl(baseSheet.portrait);
    if (baseSheet.cocStats) setCocStats(baseSheet.cocStats);

    let combinedChronicle = `[🔄 복수 세션 서사 통합 계승 이력]\n`;
    chosenSessions.forEach((s, idx) => {
      const sh = s.sheet || {};
      const itemNames = (sh.items || []).map((it) => it.name).join(", ");
      combinedChronicle += `\n• [세션 ${idx + 1}: ${s.title}] (규칙: ${s.ruleMode})\n`;
      combinedChronicle += `  - 생환 수치: HP ${sh.hp}/${sh.maxHp}${s.ruleMode === "coc" ? `, SAN ${sh.san}/99` : ""}\n`;
      combinedChronicle += `  - 획득 전리품: ${itemNames || "없음"}\n`;
    });

    combinedChronicle += `\n위 세션들의 모든 흉터, 기억, 전리품을 간직한 채 새로운 모험에 들어섭니다.`;
    setPastChronicleText(combinedChronicle);
    setCharBackground(`${baseSheet.background || ""}\n\n${combinedChronicle}`);

    closeModal(setShowCareerModal);
    setSelectedCareerIds([]);
    alert(`${chosenSessions.length}개 세션의 서사와 전리품이 성공적으로 통합 계승되었습니다!`);
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
        setScenarioInput(extractedText.trim());
      } catch (err) { alert("PDF 읽기 실패: " + err.message); } finally { setIsPdfLoading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setScenarioInput(event.target.result);
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
      } else {
        setCharPortraitUrl(base64);
      }
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
    } else {
      setCharPortraitUrl(newUrl);
    }
    setCustomPortraitPrompt("");
    closeModal(setShowPortraitEditModal);
  };

  const executeSaveBackup = () => {
    if (sessions.length === 0) return alert("백업할 시나리오 세션이 없습니다.");
    const targets = backupTarget === "all" ? sessions : sessions.filter((s) => s.id === Number(backupTarget));
    if (targets.length === 0) return alert("선택된 시나리오가 없습니다.");
    
    const dateStr = new Date().toISOString().slice(0, 10);
    if (backupFormat === "json") {
      const blob = new Blob([JSON.stringify(targets, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = backupTarget === "all" ? `TRPG_전체세이브_${dateStr}.json` : `TRPG_${targets[0].title.replace(/\s+/g, "_")}_${dateStr}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      let txtContent = `====================================================\n         TRPG 세이브 데이터 텍스트 백업 파일         \n====================================================\n\n`;
      targets.forEach((s, idx) => {
        txtContent += `[세션 ${idx + 1}] ${s.title}\n규칙: ${s.ruleMode}\n캐릭터: ${s.sheet?.name} (${s.sheet?.job})\n\n[대화 기록]\n`;
        (s.messages || []).forEach((m) => {
          const sender = m.role === "user" ? `[${s.sheet?.name}]` : "[마스터]";
          txtContent += `${sender}\n${m.text}\n\n`;
        });
      });
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = backupTarget === "all" ? `TRPG_전체세이브텍스트_${dateStr}.txt` : `TRPG_${targets[0].title.replace(/\s+/g, "_")}_${dateStr}.txt`;
      link.click();
      URL.revokeObjectURL(url);
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
            const map = new Map();
            prev.forEach((s) => map.set(s.id, s));
            imported.forEach((s) => map.set(s.id, s));
            return Array.from(map.values());
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
    const link = document.createElement("a");
    link.href = url;
    link.download = `${session.title.replace(/\s+/g, "_")}_대화록.${exportFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    closeModal(setShowExportModal);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const parseTagsSafely = (rawText) => {
    let cleanText = rawText || "";
    let parsedData = { suggActions: [], pendingCheck: null, newSheetVars: {}, revealedSecrets: [] };

    const suggRegex = /<!--\s*SUGGESTIONS:\s*(\[.*?\])\s*-->/is;
    const suggMatch = cleanText.match(suggRegex);
    if (suggMatch) { try { parsedData.suggActions = JSON.parse(suggMatch[1]); } catch(e){} }

    const secRegex = /<!--\s*REVEAL_SECRET:\s*({.*?})\s*-->/gis;
    const secMatches = [...cleanText.matchAll(secRegex)];
    secMatches.forEach(match => { try { parsedData.revealedSecrets.push(JSON.parse(match[1])); } catch(e){} });

    const statRegex = /<!--\s*STATUS:\s*({.*?})\s*-->/is;
    const statMatch = cleanText.match(statRegex);
    if (statMatch) { try { parsedData.newSheetVars = JSON.parse(statMatch[1]); } catch(e){} }

    const checkRegex = /<!--\s*CHECK:\s*({.*?})\s*-->/is;
    const checkMatch = cleanText.match(checkRegex);
    if (checkMatch) { try { parsedData.pendingCheck = JSON.parse(checkMatch[1]); } catch(e){} }

    cleanText = cleanText
      .replace(/```html/gi, "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();

    return { cleanText, parsedData };
  };

  // 세션 시작
  const startNewSession = async () => {
    const sessionTitle = charName ? `${charName}의 이야기` : "새로운 모험";
    const finalPref = playPreference.trim();
    const defaultPortrait = charPortraitUrl || getPortraitUrl(`${charName || "character"}`);

    let initialSheet = {
      name: charName || "주인공",
      job: charJob || "조사원",
      age: charAge,
      gender: charGender,
      portrait: defaultPortrait,
      pastChronicle: pastChronicleText,
      hp: 20, maxHp: 20,
      npcs: [{ name: "파트너", title: "동행자", portrait: getPortraitUrl("companion"), affection: 10, state: "신뢰" }],
      items: [{ name: "황동 돋보기", desc: "확대경" }, { name: "가죽 수첩", desc: "단서 보관" }, { name: "만년필 나이프", desc: "호신구" }],
    };

    if (wizardMode === "insane") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, phase: "메인", cycle: 1, scene: 1, mission: charMission || "생존하여 진실을 밝힌다.", secret: charSecret || "과거의 죄가 있다." };
    } else if (wizardMode === "coc") {
      initialSheet = { ...initialSheet, hp: derivedHp, maxHp: derivedHp, mp: derivedMp, maxMp: derivedMp, san: derivedSan, maxSan: 99, luck: Number(cocStats.luck), db: derivedDb, cocStats: { ...cocStats } };
    } else if (wizardMode === "unsung") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, erosion: 1, mutation: unsungMutation || "미확인 징후" };
    }

    const newId = Date.now();
    const newSession = {
      id: newId,
      title: sessionTitle,
      ruleMode: wizardMode,
      preference: finalPref,
      scenarioText: scenarioInput,
      sheet: initialSheet,
      messages: [],
      suggestedActions: [],
      pendingCheck: null,
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);

    const openingPrompt = `[세션 시작: 첫 서막]
플레이어를 곧바로 급박한 위기나 전투로 던져넣지 마십시오.
마치 웰메이드 소설의 첫 페이지처럼, 천천히 몰입할 수 있도록 다음을 순서대로 서술하십시오:
1. 현재 장소의 풍경, 날씨, 시각적 분위기를 감각적으로 묘사합니다.
2. 주인공이 왜 이곳에 있는지, 현재 상황과 목적을 자연스럽게 짚어줍니다.
3. 동행 인물이 있다면 그들이 현재 주인공을 어떻게 바라보는지(관계성 지침 반영) 짧은 행동이나 표정으로 암시합니다.
4. 플레이어가 주변을 둘러보거나 말을 걸 수 있도록 여유를 준 뒤, "어떻게 하시겠습니까?"라고 물으며 턴을 넘기십시오.`;

    const fetchOpening = async (retryCount = 0) => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", text: openingPrompt }], scenarioText: scenarioInput, playerSheet: initialSheet, ruleMode: wizardMode, playPreference: finalPref }),
        });

        const data = await response.json();
        recordApiCall(data.usage);

        if (!response.ok || !data.text) {
          if (retryCount < 1) return await fetchOpening(retryCount + 1);
          throw new Error(data.error || "응답 실패");
        }

        const { cleanText, parsedData } = parseTagsSafely(data.text);
        let updatedSheet = { ...initialSheet, ...parsedData.newSheetVars };

        setSessions((prev) => prev.map((s) => s.id === newId ? {
          ...s,
          sheet: updatedSheet,
          messages: [{ role: "model", text: cleanText }],
          suggestedActions: parsedData.suggActions,
          pendingCheck: parsedData.pendingCheck,
        } : s));
      } catch (err) {
        setSessions((prev) => prev.map((s) => s.id === newId ? { ...s, messages: [{ role: "model", text: `서막을 불러오지 못했습니다 (${err.message}). 잠시 후 행동을 입력해 주세요.` }] } : s));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpening();
  };

  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;
    const updatedMessages = [...(activeSession.messages || []), { role: "user", text: textToSend }];
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [] } : s)));
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, scenarioText: activeSession.scenarioText, playerSheet: activeSession.sheet, ruleMode: activeSession.ruleMode, playPreference: activeSession.preference }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      const { cleanText, parsedData } = parseTagsSafely(data.text || "");
      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };

      if (parsedData.revealedSecrets.length > 0) {
        parsedData.revealedSecrets.forEach(rev => {
          newSheet.npcs = (newSheet.npcs || []).map(npc => npc.name === rev.name ? { ...npc, secret: rev.secret, secretRevealed: true } : npc);
        });
      }

      setSessions((prev) => prev.map((s) => s.id === activeSessionId ? {
        ...s,
        sheet: newSheet,
        messages: [...updatedMessages, { role: "model", text: cleanText }],
        suggestedActions: parsedData.suggActions,
        pendingCheck: parsedData.pendingCheck,
      } : s));
    } catch (err) { alert(`통신 오류: ${err.message}`); } finally { setIsLoading(false); }
  };

  const sendMessage = () => { if (!input.trim()) return; const text = input; setInput(""); executeMessage(text); };
  const handleUseItem = (itemName) => { setInput((prev) => `품에서 [${itemName}]을(를) 꺼내어 ` + prev); };

  // 4대 룰별 주사위 판정
  const rollDiceDirectly = (overrideTarget = null, reasonText = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true); setDiceResult(null); playDiceSound();

    let rollInterval = null;
    if (animationEnabled) { rollInterval = setInterval(() => { setRollingDisplayNum(Math.floor(Math.random() * (activeSession.ruleMode === "coc" ? 100 : 20)) + 1); }, 50); }

    const mode = activeSession.ruleMode;
    setTimeout(() => {
      if (rollInterval) clearInterval(rollInterval);
      let rollFormatted = "";

      if (mode === "insane" || mode === "unsung") {
        const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const sum = d1 + d2;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : targetDc || (mode === "unsung" ? 6 : 5));
        let outcome = sum === 12 ? "스페셜(대성공)" : sum === 2 ? "펌블(대실패)" : sum >= targetVal ? "성공" : "실패";
        setDiceResult({ roll: `${d1}+${d2}=${sum}`, outcome, target: targetVal, type: "2D6" });
        rollFormatted = `[🎲 시스템 공인 2D6 판정: ${d1}+${d2}=${sum} / 목표: ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      } else if (mode === "coc") {
        const roll = Math.floor(Math.random() * 100) + 1; const targetVal = Number(overrideTarget !== null ? overrideTarget : targetStat);
        let outcome = roll === 1 ? "대성공" : roll <= Math.floor(targetVal / 5) ? "극단적 성공" : roll <= Math.floor(targetVal / 2) ? "어려운 성공" : roll <= targetVal ? "보통 성공" : roll >= 96 ? "대실패" : "실패";
        setDiceResult({ roll, outcome, target: targetVal, type: "1D100" });
        rollFormatted = `[🎲 시스템 공인 1D100 판정: ${roll} / 목표: ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      } else {
        const roll = Math.floor(Math.random() * 20) + 1; const targetVal = Number(overrideTarget !== null ? overrideTarget : targetDc || 12);
        const outcome = roll >= targetVal ? "성공" : "실패";
        setDiceResult({ roll, outcome, target: targetVal, type: "1D20" });
        rollFormatted = `[🎲 시스템 공인 판정: 1D20 결과 ${roll} / DC ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      }

      setIsRolling(false);
      executeMessage(rollFormatted);
    }, animationEnabled ? 650 : 150);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("rp_hub_sessions");
      if (saved) setSessions(JSON.parse(saved));
      const savedDark = localStorage.getItem("rp_hub_darkmode");
      if (savedDark !== null) setIsDarkMode(savedDark === "true");
      const savedPortraits = localStorage.getItem("rp_hub_show_portraits");
      if (savedPortraits !== null) setShowPortraits(savedPortraits === "true");
      const savedSugg = localStorage.getItem("rp_hub_suggestions_enabled");
      if (savedSugg !== null) setSuggestionsEnabled(savedSugg === "true");
      const savedStyle = localStorage.getItem("rp_hub_portrait_style");
      if (savedStyle !== null) setPortraitStyle(savedStyle);
      const savedPresets = localStorage.getItem("rp_hub_custom_presets");
      if (savedPresets) setCustomPresets(JSON.parse(savedPresets));
      const savedPalette = localStorage.getItem("rp_hub_palette");
      if (savedPalette && THEME_PALETTES[savedPalette]) setCurrentPalette(savedPalette);
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try { localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions)); } catch (e) {}
  }, [sessions, isLoaded]);

  return (
    <div style={{ display: "flex", height: "100dvh", minHeight: "100vh", width: "100vw", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(140, 160, 210, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(140, 160, 210, 0.4); }
        @keyframes diceTumble { 0% { transform: rotate(0deg) scale(0.85); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
        .anim-dice-rolling { animation: diceTumble 0.35s infinite linear; }
        .glass-card {
          background: ${isDarkMode ? "rgba(21, 26, 38, 0.85)" : "rgba(255, 255, 255, 0.9)"};
          backdrop-filter: blur(14px);
          border: 1px solid ${theme.border};
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
      `}</style>
      
      {isMobile && isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 45, backdropFilter: "blur(4px)" }} />}
      {isMobile && isSheetOpen && <div onClick={() => setIsSheetOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 45, backdropFilter: "blur(4px)" }} />}

      {/* 1. 좌측 사이드바 */}
      <div style={{ position: isMobile ? "absolute" : "relative", zIndex: isMobile ? 50 : 1, left: 0, top: 0, bottom: 0, width: isSidebarOpen ? "260px" : "0px", minWidth: isSidebarOpen ? "260px" : "0px", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden", backgroundColor: theme.sidebar, borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button onClick={() => { setActiveSessionId(null); if (isMobile) setIsSidebarOpen(false); }} style={{ flex: 1, padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", boxShadow: `0 2px 8px ${theme.accentGlow}` }}>+ 새 시나리오</button>
          <button onClick={handleToggleDarkMode} style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.map((s) => (
            <div key={s.id} onClick={() => { setActiveSessionId(s.id); if (isMobile) setIsSidebarOpen(false); }} style={{ padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "4px", backgroundColor: activeSessionId === s.id ? theme.panelAlt : "transparent", border: activeSessionId === s.id ? `1px solid ${theme.border}` : "1px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "6px" }}>
                <div style={{ fontWeight: "700", fontSize: "0.84rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{s.ruleMode}</div>
              </div>
              <button onClick={(e) => deleteSession(s.id, e)} title="삭제" style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px", fontSize: "0.85rem" }}>🗑️</button>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
          {activeSession && <button onClick={() => openModal(setShowExportModal)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.8rem" }}>📥 대화록 내보내기</button>}
          <button onClick={() => openModal(setShowSettingsModal)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.8rem" }}>⚙️ 설정</button>
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
                  {isAiGenerating ? "AI 집필 중..." : "✨ AI 즉석 생성"}
                </button>
              </div>
            </div>

            {/* 룰 선택 바 */}
            <div className="glass-card" style={{ padding: "16px", borderRadius: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontWeight: "800", fontSize: "0.88rem" }}>1. TRPG 룰 시스템 선택</span>
                <button onClick={() => setRuleHelpModalKey(wizardMode)} style={{ background: "none", border: "none", color: theme.accent, fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline" }}>
                  현재 룰 가이드 열람 ?
                </button>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr repeat(3, 1fr)", gap: "8px" }}>
                <div onClick={() => { setRuleCategory("freeform"); setWizardMode("freeform"); }} style={{ padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${wizardMode === "freeform" ? theme.accent : theme.border}`, backgroundColor: wizardMode === "freeform" ? theme.panelAlt : "transparent", cursor: "pointer" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.85rem", color: theme.accent }}>자유 서사 (1D20)</div>
                  <div style={{ fontSize: "0.68rem", color: theme.textMuted, marginTop: "2px" }}>직관적 판정 / 샌드박스</div>
                </div>

                {[
                  { key: "coc", name: "크툴루의 부름 (CoC)", sub: "1D100 / 정규 460pt & SAN", color: theme.danger },
                  { key: "insane", name: "인세인 (inSANe)", sub: "2D6 / 사명과 비밀 탐색", color: theme.warning },
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

                {/* CoC 460pt 특성치 배분 카드 */}
                {wizardMode === "coc" && (
                  <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", border: `1.5px solid ${theme.danger}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.danger }}>CoC 7판 특성치 (460 pt)</span>
                      <button type="button" onClick={() => {
                        const base = [30, 30, 30, 30, 30, 30, 30, 30];
                        let rem = 220;
                        while (rem > 0) {
                          const idx = Math.floor(Math.random() * 8);
                          if (base[idx] < 85) { base[idx] += 5; rem -= 5; }
                        }
                        setCocStats({ str: base[0], con: base[1], siz: base[2], dex: base[3], app: base[4], int: base[5], pow: base[6], edu: base[7], luck: Math.floor(Math.random() * 50) + 40 });
                      }} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.accent, fontSize: "0.74rem", cursor: "pointer", fontWeight: "700" }}>🎲 자동 분배</button>
                    </div>

                    <div style={{ fontSize: "0.78rem", display: "flex", justifyContent: "space-between", padding: "6px 10px", backgroundColor: theme.panelAlt, borderRadius: "8px", marginBottom: "10px" }}>
                      <span>포인트 풀: <strong>460 pt</strong></span>
                      <span style={{ color: remainingPoints < 0 ? theme.danger : theme.success, fontWeight: "700" }}>
                        잔여: {remainingPoints} pt {remainingPoints < 0 ? "(초과)" : ""}
                      </span>
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
                      <div>이성: <strong>{derivedSan}</strong></div>
                      <div>DB: <strong>{derivedDb}</strong></div>
                    </div>
                  </div>
                )}

                {/* 인세인 사명/비밀 카드 */}
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

                {/* 언성듀엣 변이징후 카드 */}
                {wizardMode === "unsung" && (
                  <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", border: "1.5px solid #b87bd8", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.85rem", color: "#b87bd8" }}>언성 듀엣: 이계 침식도(0~6) 및 변이 징후</span>
                    <div>
                      <label style={{ display: "block", fontSize: "0.72rem", color: theme.textMuted, marginBottom: "2px" }}>신체/정신적 변이 징후 (Mutation)</label>
                      <input type="text" value={unsungMutation} onChange={(e) => setUnsungMutation(e.target.value)} placeholder="예: 왼쪽 눈동자가 푸른빛으로 물듦" style={{ width: "100%", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* 우측 칼럼 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="glass-card" style={{ padding: "18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem", color: theme.accent }}>3. 서사 및 관계성 지향</span>
                    <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>원클릭 토글</span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {[...ORIENT_TAGS, ...TROPE_TAGS].map((tag) => {
                      const isActive = playPreference.includes(tag);
                      return (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: "5px 11px", borderRadius: "20px", fontSize: "0.74rem", fontWeight: isActive ? "700" : "500", backgroundColor: isActive ? theme.accent : theme.panelAlt, color: isActive ? "#fff" : theme.text, border: `1px solid ${isActive ? theme.accent : theme.border}`, cursor: "pointer", transition: "all 0.15s ease" }}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    value={playPreference}
                    onChange={(e) => setPlayPreference(e.target.value)}
                    placeholder="태그를 클릭하거나 원하는 관계성 지침을 직접 입력하세요."
                    style={{ width: "100%", minWidth: 0, height: "65px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, resize: "vertical", fontSize: "0.8rem", lineHeight: "1.5" }}
                  />
                </div>

                <div className="glass-card" style={{ padding: "18px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem" }}>4. 시나리오 문서 및 배경</span>
                    <button type="button" onClick={handleAutoReplaceKpcPc} style={{ padding: "5px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "6px", color: theme.accent, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>
                      🔄 시나리오 내 KPC/PC 자동 치환
                    </button>
                  </div>

                  <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} style={{ display: "block", width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem", cursor: "pointer" }} />
                  {isPdfLoading && <div style={{ fontSize: "0.75rem", color: theme.warning }}>⏳ PDF 본문 텍스트를 추출하는 중입니다...</div>}

                  <textarea value={scenarioInput} onChange={(e) => setScenarioInput(e.target.value)} placeholder="시나리오를 직접 적거나, 상단 [무작위 조합 생성] 버튼을 누르면 채워집니다." style={{ width: "100%", minWidth: 0, height: "110px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, resize: "vertical", fontSize: "0.8rem", lineHeight: "1.6" }} />
                </div>
              </div>
            </div>

            <button onClick={startNewSession} disabled={isLoading || isPdfLoading} style={{ width: "100%", padding: "16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "1.05rem", boxShadow: `0 4px 16px ${theme.accentGlow}`, letterSpacing: "0.02em" }}>
              {isLoading ? "키퍼가 서막을 여는 중..." : "이야기 시작하기"}
            </button>
          </div>
        ) : (
          /* 플레이 룸 */
          <>
            <div style={{ height: "50px", padding: "0 16px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "5px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <span style={{ fontWeight: "800", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeSession?.title}</span>
                {activeSession?.ruleMode === "insane" && (
                  <span style={{ padding: "2px 7px", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1px solid ${theme.warning}`, borderRadius: "4px", fontSize: "0.68rem", color: theme.warning, fontWeight: "700" }}>
                    사이클 {activeSession?.sheet?.cycle || 1} / 씬 {activeSession?.sheet?.scene || 1}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={() => rollDiceDirectly()} disabled={isRolling || isLoading} style={{ padding: "6px 14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "700", fontSize: "0.8rem", boxShadow: `0 2px 8px ${theme.accentGlow}` }}>
                  🎲 주사위 판정 ({activeSession?.ruleMode === "coc" ? "1D100" : activeSession?.ruleMode === "freeform" ? "1D20" : "2D6"})
                </button>
                <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: "5px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem" }}>{isSheetOpen ? "시트▶" : "◀시트"}</button>
              </div>
            </div>

            {/* 대화 로그 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "14px", position: "relative" }}>
              {isRolling && animationEnabled && (
                <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)", zIndex: 50, backgroundColor: theme.panel, border: `2px solid ${theme.accent}`, borderRadius: "14px", padding: "12px 28px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                  <span className="anim-dice-rolling" style={{ fontSize: "2rem", display: "inline-block" }}>🎲</span>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>운명의 주사위 롤링 중...</div>
                    <div style={{ fontSize: "1.35rem", fontWeight: "800", color: theme.accent }}>{rollingDisplayNum}</div>
                  </div>
                </div>
              )}

              {(activeSession?.messages || []).map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "92%" : "82%" }}>
                  <div
                    style={{
                      backgroundColor: m.text.includes("[🎲 시스템 공인") ? "rgba(229, 169, 60, 0.12)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi,
                      color: m.role === "user" && !m.text.includes("[🎲 시스템 공인") ? "#ffffff" : theme.text,
                      border: m.text.includes("[🎲 시스템 공인") ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`,
                      padding: "14px 18px",
                      borderRadius: "14px",
                      lineHeight: "1.75",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.92rem",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.85rem", padding: "4px" }}>마스터가 서사를 집필하는 중...</div>}
            </div>

            {/* 제안 칩 */}
            {suggestionsEnabled && (activeSession?.suggestedActions || []).length > 0 && !isLoading && (
              <div style={{ padding: "8px 14px", backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "0.74rem", color: theme.accent, fontWeight: "700", display: "flex", alignItems: "center" }}>💡 제안:</span>
                {(activeSession?.suggestedActions || []).map((sugg, idx) => (
                  <button key={idx} onClick={() => setInput(sugg)} style={{ padding: "5px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "16px", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>{sugg}</button>
                ))}
              </div>
            )}

            {/* 입력창 */}
            <div style={{ padding: "12px 14px", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="행동이나 대사를 입력하세요..." style={{ flex: 1, height: "46px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px", resize: "none", outline: "none", fontSize: "0.88rem" }} />
              <button onClick={sendMessage} disabled={isLoading} style={{ padding: "0 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.88rem", boxShadow: `0 2px 8px ${theme.accentGlow}` }}>전송</button>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 상태창 (시안 01, 02, 03 완벽 분기 렌더링) */}
      {activeSession && (
        <div style={{ position: isMobile ? "absolute" : "relative", zIndex: isMobile ? 50 : 1, right: 0, top: 0, bottom: 0, width: isSheetOpen ? "290px" : "0px", minWidth: isSheetOpen ? "290px" : "0px", transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden", backgroundColor: theme.sidebar, borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", width: "290px" }}>
            
            {/* API 모니터링 */}
            <div className="glass-card" style={{ borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "700", color: theme.accent }}>⚡ API 한도 (추정치)</span>
                <span style={{ fontSize: "0.68rem", padding: "1px 6px", backgroundColor: theme.panelAlt, borderRadius: "4px", color: theme.textMuted }}>Free Tier</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "4px" }}>
                <span>오늘 호출 (RPD):</span>
                <strong>{apiUsage.dailyRequests} / 1,500회</strong>
              </div>
              <div style={{ height: "5px", width: "100%", backgroundColor: theme.panelAlt, borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${quotaPercentage}%`, backgroundColor: quotaPercentage > 85 ? theme.danger : quotaPercentage > 60 ? theme.warning : theme.success }} />
              </div>
            </div>

            {/* 관계성 태그 뱃지 */}
            {activeSession.preference && (
              <div className="glass-card" style={{ fontSize: "0.74rem", padding: "8px 10px", borderRadius: "8px", lineHeight: "1.4" }}>
                <strong style={{ color: theme.accent }}>🎭 서사 지향:</strong>
                <div style={{ color: theme.textMuted, marginTop: "2px" }}>{activeSession.preference}</div>
              </div>
            )}

            {/* [룰 1. 크툴루의 부름 (CoC) 전용 UI: 01. Modern Occult Noir] */}
            {activeSession.ruleMode === "coc" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: `1.5px solid ${theme.danger}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: theme.danger, fontWeight: "800" }}>조사원 기밀 시트</h4>
                  {showPortraits && <button onClick={() => openModal(setShowPortraitEditModal)} style={{ padding: "2px 6px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.68rem", cursor: "pointer" }}>✏️</button>}
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                  {showPortraits && (
                    <div style={{ position: "relative", width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.danger}`, flexShrink: 0, backgroundColor: theme.panelAlt }}>
                      <img src={activeSession.sheet?.portrait || getPortraitUrl(activeSession.sheet?.name)} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                  )}
                  <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column" }}>
                    <strong>{activeSession.sheet?.name || "탐사자"}</strong>
                    <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>{activeSession.sheet?.job || "조사원"}</span>
                  </div>
                </div>

                {/* CoC 원형 다이얼 게이지 3연 배치 */}
                <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 0", backgroundColor: theme.panelAlt, borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                  <CircularGauge 50} color="{theme.danger}" label="이성 (SAN)" max="{99}" value="{activeSession.sheet?.san" ||/>
                  <CircularGauge 10} color="{theme.warning}" label="체력 (HP)" max="{activeSession.sheet?.maxHp" value="{activeSession.sheet?.hp" ||/>
                  <CircularGauge 50} color="{theme.accent}" label="행운 (LUCK)" max="{99}" value="{activeSession.sheet?.luck" ||/>
                </div>
              </div>
            )}

            {/* [룰 2. 인세인 (inSANe) 전용 UI: 02. Obsidian Glass & Tarot Vault] */}
            {activeSession.ruleMode === "insane" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: `1.5px solid ${theme.warning}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: theme.warning, fontWeight: "800" }}>인세인 파일철</h4>
                  <span style={{ fontSize: "0.7rem", color: theme.warning, fontWeight: "700" }}>HP 6 / SAN 6</span>
                </div>

                {/* 사명 카드 */}
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px", marginBottom: "8px", fontSize: "0.74rem" }}>
                  <div style={{ fontWeight: "700", color: theme.accent, marginBottom: "2px" }}>📜 공개 사명:</div>
                  <div>{activeSession.sheet?.mission || "생존하여 진실을 밝힌다."}</div>
                </div>

                {/* 타로 카드 뒷면 형태의 비밀 보관함 */}
                <div style={{ backgroundColor: "rgba(224, 83, 108, 0.15)", border: `1.5px dashed ${theme.danger}`, borderRadius: "8px", padding: "10px", fontSize: "0.74rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "800", color: theme.danger }}>🔒 나의 비밀 (Secret)</span>
                    <span style={{ fontSize: "0.68rem", color: "#fca5a5" }}>절대 기밀</span>
                  </div>
                  <div style={{ color: "#fca5a5", lineHeight: "1.4" }}>{activeSession.sheet?.secret || "과거의 죄악이 봉인되어 있다."}</div>
                </div>
              </div>
            )}

            {/* [룰 3. 언성 듀엣 전용 UI: 세그먼트 침식 바 & 변이 징후 카드] */}
            {activeSession.ruleMode === "unsung" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: "1.5px solid #b87bd8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: "#b87bd8", fontWeight: "800" }}>언성 듀엣: 조난자 기록</h4>
                  <span style={{ fontSize: "0.7rem", color: "#b87bd8", fontWeight: "700" }}>2D6 이계 서사</span>
                </div>

                {/* 세그먼트 LED 침식도 바 */}
                <div style={{ marginBottom: "10px" }}>
                  <SegmentedErosionBar 1} color="#b87bd8" current="{activeSession.sheet?.erosion" label="이계 침식도 (Erosion)" max="{6}" ||/>
                </div>

                {/* 변이 징후 슬롯 */}
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px", fontSize: "0.74rem" }}>
                  <div style={{ fontWeight: "700", color: "#b87bd8", marginBottom: "2px" }}>🌀 발현된 변이 징후:</div>
                  <div style={{ color: theme.textMuted }}>{activeSession.sheet?.mutation || "잠재적 침식 진행 중"}</div>
                </div>
              </div>
            )}

            {/* [룰 4. 자유 서사 (Freeform) 전용 UI: 03. Editorial Storybook 메모] */}
            {activeSession.ruleMode === "freeform" && (
              <div className="glass-card" style={{ padding: "14px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: theme.accent, fontWeight: "800" }}>자유 서사 기록지</h4>
                  <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>1D20 샌드박스</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: theme.textMuted, lineHeight: "1.5" }}>
                  <div><strong>{activeSession.sheet?.name || "주인공"}</strong> ({activeSession.sheet?.job || "모험가"})</div>
                  <div>HP: <strong>{activeSession.sheet?.hp || 20} / {activeSession.sheet?.maxHp || 20}</strong></div>
                </div>
              </div>
            )}

            {/* 소지품 / 인벤토리 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "0.84rem", color: theme.accent, fontWeight: "800" }}>🎒 소지품 / 인벤토리</h4>
                <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>{(activeSession.sheet?.items || []).length}개</span>
              </div>
              {(!activeSession.sheet?.items || activeSession.sheet.items.length === 0) ? (
                <div style={{ fontSize: "0.76rem", color: theme.textMuted }}>소지품이 비어 있습니다.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {activeSession.sheet.items.map((item, idx) => (
                    <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "7px 10px", fontSize: "0.76rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{item.name}</strong>
                        <button onClick={() => handleUseItem(item.name)} style={{ padding: "2px 7px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.accent, borderRadius: "4px", cursor: "pointer", fontSize: "0.68rem", fontWeight: "700" }}>
                          사용
                        </button>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            {/* 주변 인물 & 호감도 */}
            <div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.84rem", color: theme.accent, fontWeight: "800" }}>주변 인물 및 호감도</h4>
              {(!activeSession.sheet?.npcs || activeSession.sheet.npcs.length === 0) ? (
                <div style={{ fontSize: "0.76rem", color: theme.textMuted }}>등장인물 없음</div>
              ) : (
                activeSession.sheet.npcs.map((npc, idx) => (
                  <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 10px", marginBottom: "6px", fontSize: "0.76rem" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {showPortraits && (
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", overflow: "hidden", border: `1px solid ${theme.border}`, flexShrink: 0, backgroundColor: theme.panelAlt }}>
                          <img src={npc.portrait || getPortraitUrl(`${npc.name}, portrait`)} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "700", display: "flex", justifyContent: "space-between" }}>
                          <span>{npc.name}</span>
                          <span style={{ color: theme.danger }}>♥ {npc.affection || 0}</span>
                        </div>
                        <div style={{ color: theme.textMuted, fontSize: "0.7rem" }}>{npc.state || npc.title || "동행자"}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 룰별 상세 가이드 ? 모달 */}
      {ruleHelpModalKey && RULE_GUIDES[ruleHelpModalKey] && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 140, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "500px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", color: theme.accent }}>📖 {RULE_GUIDES[ruleHelpModalKey].title}</h3>
              <button onClick={() => setRuleHelpModalKey(null)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem", lineHeight: "1.6" }}>
              <div>
                <strong style={{ color: theme.warning }}>💡 어떤 룰인가요?</strong>
                <div style={{ color: theme.textMuted, marginTop: "4px" }}>{RULE_GUIDES[ruleHelpModalKey].desc}</div>
              </div>
              <div>
                <strong style={{ color: theme.accent }}>🎲 핵심 규칙 및 판정 방식:</strong>
                <div style={{ color: theme.textMuted, marginTop: "4px" }}>{RULE_GUIDES[ruleHelpModalKey].system}</div>
              </div>
            </div>
            <button onClick={() => setRuleHelpModalKey(null)} style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>확인 완료</button>
          </div>
        </div>
      )}

      {/* 서사 다중 계승 모달 */}
      {showCareerModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 125, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "500px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", color: theme.warning }}>🔄 이전 세션 서사 다중 계승</h3>
              <button onClick={() => closeModal(setShowCareerModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontSize: "0.8rem", color: theme.textMuted, marginBottom: "12px" }}>
              이전에 클리어한 세션들을 체크박스로 복수 선택하면, 생환자의 잔여 수치와 전리품, 흉터 이력을 통합하여 새 캐릭터에 부여합니다.
            </div>
            {sessions.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", color: theme.textMuted, backgroundColor: theme.panelAlt, borderRadius: "8px" }}>계승할 수 있는 이전 세션이 없습니다.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto", marginBottom: "14px" }}>
                {sessions.map((s) => {
                  const isChecked = selectedCareerIds.includes(s.id);
                  return (
                    <div key={s.id} onClick={() => toggleCareerSelection(s.id)} style={{ padding: "10px 12px", backgroundColor: isChecked ? theme.panel : theme.panelAlt, border: `1px solid ${isChecked ? theme.warning : theme.border}`, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                      <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ accentColor: theme.warning, width: "16px", height: "16px" }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: "0.85rem", color: theme.text }}>{s.title}</strong>
                        <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{s.sheet?.name || "탐사자"} ({s.sheet?.job || "조사원"}) | 룰: {s.ruleMode}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => closeModal(setShowCareerModal)} style={{ flex: 1, padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>취소</button>
              <button onClick={handleInheritFromMultipleSessions} style={{ flex: 2, padding: "10px", backgroundColor: theme.warning, color: "#000", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                선택한 {selectedCareerIds.length}개 세션 통합 계승
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 환경 설정 모달 */}
      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "460px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>⚙️ 환경 설정</h3>
              <button onClick={() => closeModal(setShowSettingsModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700" }}>테마 색상 팔레트</label>
                  <span style={{ fontSize: "0.75rem", color: theme.accent }}>{isDarkMode ? "🌙 나이트" : "☀️ 라이트"}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {[
                    { id: "midnight", label: "미드나잇 블루" },
                    { id: "abyss", label: "심연 어비스" },
                    { id: "sepia", label: "고서적 세피아" },
                    { id: "classic", label: "클래식 모던" },
                  ].map((p) => (
                    <button key={p.id} onClick={() => handleSelectPalette(p.id)} style={{ padding: "8px 10px", borderRadius: "8px", border: `1.5px solid ${currentPalette === p.id ? theme.accent : theme.border}`, backgroundColor: currentPalette === p.id ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.8rem", cursor: "pointer", fontWeight: currentPalette === p.id ? "700" : "500" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700" }}>주사위 효과음 볼륨</label>
                  <span style={{ fontSize: "0.8rem", color: theme.accent }}>{Math.round(soundVolume * 100)}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="range" min="0" max="1" step="0.05" value={soundVolume} onChange={(e) => handleSaveVolume(Number(e.target.value))} style={{ flex: 1, accentColor: theme.accent }} />
                  <button onClick={playDiceSound} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>🔊 테스트</button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>주사위 굴림 연출 효과</div>
                  <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>3D 회전과 난수 롤링을 표시합니다.</div>
                </div>
                <button onClick={() => handleSaveAnim(!animationEnabled)} style={{ padding: "6px 14px", backgroundColor: animationEnabled ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" }}>
                  {animationEnabled ? "켜짐" : "꺼짐"}
                </button>
              </div>

              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: theme.accent }}>{"💾 세이브 백업 및 복원"}</span>
                  <button onClick={() => openModal(setShowRestoreHelpModal)} style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.accent, cursor: "pointer" }}>?</button>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => openModal(setShowBackupModal)} style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700" }}>💾 백업</button>
                  <label style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "700", textAlign: "center" }}>📤 복원<input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} /></label>
                </div>
              </div>

              {/* 초상화 화풍 선택 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>🎨 초상화 화풍 (스타일)</div>
                  <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>생성되는 초상화의 그림체를 지정합니다.</div>
                </div>
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

      {/* 프리셋 관리 모달 */}
      {showPresetModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "480px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>📂 캐릭터 프리셋 관리</h3>
              <button onClick={() => closeModal(setShowPresetModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
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
              {customPresets.length === 0 ? (
                <div style={{ fontSize: "0.76rem", color: theme.textMuted, padding: "10px", backgroundColor: theme.panelAlt, borderRadius: "8px" }}>저장된 프리셋이 없습니다.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "160px", overflowY: "auto" }}>
                  {customPresets.map((p) => (
                    <div key={p.id} onClick={() => handleLoadPreset(p)} style={{ padding: "8px 12px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ fontSize: "0.84rem", color: theme.text }}>{p.title}</strong>
                        <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{p.name} | {p.job} ({p.gender}, {p.age}세)</div>
                      </div>
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

      {/* 세이브 백업 옵션 모달 */}
      {showBackupModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "440px", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>💾 세이브 백업 옵션</h3>
              <button onClick={() => closeModal(setShowBackupModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button onClick={() => setBackupFormat("json")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1.5px solid ${backupFormat === "json" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "json" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>JSON (.json)</button>
              <button onClick={() => setBackupFormat("txt")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1.5px solid ${backupFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>텍스트 (.txt)</button>
            </div>
            <button onClick={executeSaveBackup} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>다운로드</button>
          </div>
        </div>
      )}

      {/* 복원 도움말 모달 */}
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

      {/* 초상화 변경 모달 */}
      {showPortraitEditModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "14px", width: "100%", maxWidth: "440px", padding: "22px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem" }}>🖼️ 초상화 변경</h3>
              <button onClick={() => closeModal(setShowPortraitEditModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
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
    </div>
  );
}
