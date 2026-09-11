"use client";
import { useState, useEffect, useRef } from "react";

// 2026 팬톤 트렌드 테마 4종 (한국어 표기)
const THEME_PALETTES = {
  cloud: {
    name: "클라우드 댄서",
    dark: { bg: "#161615", sidebar: "#1d1d1b", panel: "rgba(38, 37, 36, 0.85)", panelAlt: "rgba(51, 49, 48, 0.85)", border: "rgba(240, 238, 233, 0.15)", text: "#F0EEE9", textMuted: "#9e9c96", accent: "#b3b0a6", accentGlow: "rgba(240, 238, 233, 0.25)", danger: "#d63857", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(64, 62, 60, 0.75)", bubbleAi: "rgba(38, 37, 36, 0.6)", inputBg: "#1d1d1b" },
    light: { bg: "#F0EEE9", sidebar: "#e3e0d8", panel: "rgba(255, 255, 255, 0.9)", panelAlt: "rgba(247, 246, 242, 0.9)", border: "rgba(110, 108, 104, 0.15)", text: "#2c2a29", textMuted: "#7a7773", accent: "#6e6c68", accentGlow: "rgba(110, 108, 104, 0.25)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(227, 224, 216, 0.8)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  rose: {
    name: "우드 로즈",
    dark: { bg: "#1f1819", sidebar: "#291e20", panel: "rgba(54, 40, 42, 0.85)", panelAlt: "rgba(69, 52, 55, 0.85)", border: "rgba(227, 142, 132, 0.2)", text: "#f2ecee", textMuted: "#a19093", accent: "#E38E84", accentGlow: "rgba(227, 142, 132, 0.35)", danger: "#f76585", warning: "#E29A67", success: "#62d681", bubbleUser: "rgba(163, 114, 119, 0.6)", bubbleAi: "rgba(54, 40, 42, 0.6)", inputBg: "#1f1819" },
    light: { bg: "#f5f0eb", sidebar: "#ebe2d8", panel: "rgba(255, 255, 255, 0.9)", panelAlt: "rgba(252, 250, 248, 0.9)", border: "rgba(163, 114, 119, 0.2)", text: "#3d2f31", textMuted: "#8f7c80", accent: "#A37277", accentGlow: "rgba(163, 114, 119, 0.25)", danger: "#c43350", warning: "#E29A67", success: "#287a3e", bubbleUser: "rgba(235, 226, 216, 0.8)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  baltic: {
    name: "발틱 씨",
    dark: { bg: "#121417", sidebar: "#181a20", panel: "rgba(33, 36, 44, 0.85)", panelAlt: "rgba(45, 49, 60, 0.85)", border: "rgba(154, 150, 185, 0.2)", text: "#e8e9ec", textMuted: "#7c808f", accent: "#9A96B9", accentGlow: "rgba(154, 150, 185, 0.35)", danger: "#d63857", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(69, 74, 84, 0.7)", bubbleAi: "rgba(33, 36, 44, 0.6)", inputBg: "#181a20" },
    light: { bg: "#f0f1f5", sidebar: "#e4e6ec", panel: "rgba(255, 255, 255, 0.9)", panelAlt: "rgba(247, 248, 251, 0.9)", border: "rgba(69, 74, 84, 0.15)", text: "#1f2229", textMuted: "#6b6f7d", accent: "#454A54", accentGlow: "rgba(69, 74, 84, 0.2)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(228, 230, 236, 0.8)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  },
  capri: {
    name: "카프리 블루",
    dark: { bg: "#091214", sidebar: "#0d1b1e", panel: "rgba(19, 37, 41, 0.85)", panelAlt: "rgba(27, 51, 56, 0.85)", border: "rgba(0, 183, 211, 0.25)", text: "#e3f0f2", textMuted: "#6b8e96", accent: "#00B7D3", accentGlow: "rgba(0, 183, 211, 0.35)", danger: "#e0536c", warning: "#e5a93c", success: "#62d681", bubbleUser: "rgba(20, 72, 82, 0.7)", bubbleAi: "rgba(19, 37, 41, 0.6)", inputBg: "#0d1b1e" },
    light: { bg: "#e9f4f7", sidebar: "#d9edf2", panel: "rgba(255, 255, 255, 0.9)", panelAlt: "rgba(242, 249, 251, 0.9)", border: "rgba(0, 152, 176, 0.2)", text: "#16282c", textMuted: "#5e7c85", accent: "#0098b0", accentGlow: "rgba(0, 152, 176, 0.25)", danger: "#c43350", warning: "#a8751d", success: "#287a3e", bubbleUser: "rgba(217, 237, 242, 0.8)", bubbleAi: "#ffffff", inputBg: "#ffffff" }
  }
};

const RULE_GUIDES = {
  coc: { title: "크툴루의 부름 (CoC 7판)", desc: "정통 코스믹 호러 추리. 이성치(SAN) 관리 및 심연의 진실 탐색.", system: "1D100 판정. SAN 5점 급감 시 1D10 광기 발작." },
  insane: { title: "멀티 호러 TRPG 인세인 (inSANe)", desc: "의심과 비밀이 교차하는 현대 괴담 심리 호러.", system: "2D6 판정. 사이클별 씬 소모 및 핸드아웃/비밀(Secret) 조사." },
  freeform: { title: "자유 서사 (공동 집필 역극)", desc: "주사위 판정 없이 대사와 묘사로만 깊은 서사를 엮어가는 소설형 롤플레잉.", system: "판정 없음. 온전히 대화와 지문으로 전개." }
};

const COC_MADNESS_TABLE = [
  { roll: 1, name: "기절 및 의식 상실", desc: "극심한 충격으로 눈앞이 아득해지며 바닥에 쓰러져 의식을 잃습니다." },
  { roll: 2, name: "통제 불능 비명", desc: "이성을 잃고 목이 쉴 때까지 원초적인 비명을 내지릅니다." },
  { roll: 3, name: "급성 공포증", desc: "특정 사물이나 현상에 극단적인 공포를 느껴 접근을 거부합니다." },
  { roll: 4, name: "편집증 및 피해망상", desc: "주변의 모든 존재가 자신을 해치려 한다는 의심에 사로잡힙니다." },
  { roll: 5, name: "맹목적 도주", desc: "이유를 불문하고 반대 방향을 향해 무작정 질주합니다." },
  { roll: 6, name: "히스테리성 실성", desc: "통제할 수 없는 기괴한 웃음과 눈물을 동시에 쏟아냅니다." }
];

const INSANE_MADNESS_TABLE = [
  { roll: 1, name: "의혹 (Suspicion)", desc: "동행자의 사명과 말을 신뢰하지 못하고 숨겨진 적의가 있다고 확신합니다." },
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

  // 반응형 및 모달 제어
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTabletopOpen, setIsTabletopOpen] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [ruleHelpModalKey, setRuleHelpModalKey] = useState(null);

  // 설정값
  const [currentPalette, setCurrentPalette] = useState("cloud");
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  // 인세인 동적 리미트 & 핸드아웃 임시 풀
  const [insaneLimit, setInsaneLimit] = useState(3);
  const [generatedHandouts, setGeneratedHandouts] = useState([]);

  // KPC 상태
  const [kpcList, setKpcList] = useState([
    { id: 1, name: "은하", job: "조력자", detail: "", secret: "", portraitUrl: "", showSecret: false }
  ]);

  // 시나리오 폼 상태
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [scenarioInput, setScenarioInput] = useState("");
  const [openingNovelText, setOpeningNovelText] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [playPreference, setPlayPreference] = useState("#GL #쌍방구원 #달달");

  // 프리셋 및 다중 계승
  const [customPresets, setCustomPresets] = useState([]);
  const [newPresetTitle, setNewPresetTitle] = useState("");
  const [selectedCareerIds, setSelectedCareerIds] = useState([]);
  const [pastChronicleText, setPastChronicleText] = useState("");

  // CoC 460pt 스탯
  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });
  const remainingPoints = 460 - (Number(cocStats.str) + Number(cocStats.con) + Number(cocStats.siz) + Number(cocStats.dex) + Number(cocStats.app) + Number(cocStats.int) + Number(cocStats.pow) + Number(cocStats.edu));
  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);
  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0";
  if (strPlusSiz <= 64) derivedDb = "-2"; else if (strPlusSiz <= 84) derivedDb = "-1"; else if (strPlusSiz <= 124) derivedDb = "0"; else if (strPlusSiz <= 164) derivedDb = "+1D4"; else derivedDb = "+1D6";

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
  const closeModal = (setModalFn) => { setModalFn(false); if (window.history.state?.modalOpen) window.history.back(); };

  const toggleTag = (tag) => {
    setPlayPreference((prev) => {
      const list = prev.split(/\s+/).filter(Boolean);
      return list.includes(tag) ? list.filter((t) => t !== tag).join(" ") : [...list, tag].join(" ");
    });
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

  // 🔥 AI 시나리오 고밀도 즉석 생성 (핸드아웃 4종 및 실명 강제)
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    const systemPrompt = `당신은 최고 권위의 정통 TRPG 시나리오 라이터 겸 키퍼입니다.
선택된 룰 [${wizardMode}]과 서사 성향 [${playPreference}]에 맞추어, 단순한 요약이 아닌 깊이 있는 인물 서사와 사건의 진상, 그리고 4개의 완벽한 핸드아웃을 설계하십시오.

[🚨 절대 수칙]
1. 모든 인물은 무조건 여성(GL)입니다. '너는 내 것' 같은 유치한 소유욕이나 얀데레 묘사는 엄격히 배제하고, 절제되고 성숙한 유대감을 부여하십시오.
2. 지문과 설정에서 'PC', 'KPC'라는 단어를 절대 쓰지 마십시오! 무조건 주인공 이름과 파트너 이름을 직접 지어서 사용하십시오.
3. initialHandouts에는 반드시 4개의 카드가 포함되어야 합니다:
   - 1번: 주인공(PC) 카드 (사명 및 비밀)
   - 2번: 파트너(KPC) 카드 (표면상 관계 및 숨겨진 진심/비밀)
   - 3번: 현장 중요한 사물/장소 핸드아웃 (개요 및 조사 시 밝혀지는 비밀)
   - 4번: 결정적 과거/사건 단서 핸드아웃 (개요 및 조사 시 밝혀지는 비밀)

반드시 마크다운 코드블럭(\`\`\`json) 없이 순수한 JSON 규격으로만 응답하십시오:
{
  "name": "주인공 이름 (예: 서윤)",
  "gender": "여성",
  "age": "24",
  "job": "역할/직업",
  "background": "인물의 과거 상처, 성격, 소지품 3가지 상세 묘사",
  "mission": "주인공의 공개 사명",
  "secret": "주인공의 숨겨진 개인적 비밀",
  "kpcName": "파트너 이름 (예: 은하)",
  "kpcJob": "파트너의 역할/직업",
  "kpcDetail": "파트너의 성격, 외모, 주인공과의 관계성 상세",
  "kpcSecret": "파트너가 숨기고 있는 충격적인 진심이나 비밀",
  "limit": ${Math.floor(Math.random() * 3) + 2},
  "scenarioTitle": "시나리오 제목",
  "scenarioTruth": "사건의 충격적인 배후 진상 및 흑막(Keeper Only 기밀)",
  "scenarioGimmick": "해당 룰 특유의 특수 기믹 및 엔딩 조건",
  "openingNovel": "플레이어가 마주하는 첫 장소의 감각적 분위기와 날씨, 파트너와의 첫 대사를 담은 4~5문장의 풍성한 서막 지문 (반드시 ~합니다/였습니다 경어체, 파트너 실제 이름 명시)",
  "initialHandouts": [
    { "title": "서윤의 사명", "overview": "마감에 쫓기며 방에 틀어박혀 있다.", "secret": "자신이 상처받을까 두려워 스스로를 고립시키고 있다." },
    { "title": "은하의 손길", "overview": "눈길을 뚫고 따뜻한 수프를 들고 찾아온 이웃.", "secret": "서윤이 무너질까 두려워 자신의 불안을 숨긴 채 곁을 지키고 있다." },
    { "title": "낡은 스케치북", "overview": "작업대 한구석에 펼쳐진 오래된 그림들.", "secret": "두 사람이 처음 만났던 날의 미완성 풍경화가 숨겨져 있다." },
    { "title": "현관문 앞의 온기", "overview": "차가운 바깥바람과 대조되는 은하의 보온병.", "secret": "보온병 바닥에 떨리는 글씨로 적힌 작은 쪽지가 들어있다." }
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

      const pName = p.name || "주인공";
      const kName = p.kpcName || "파트너";

      setCharName(pName);
      setCharJob(p.job || "조사원");
      setCharAge(p.age || "24");
      setCharGender(p.gender || "여성");
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

      setScenarioTitle(p.scenarioTitle || "미상의 밤");
      setOpeningNovelText(p.openingNovel || "");

      const richScenario = `[시나리오 제목: ${p.scenarioTitle}]

[사건의 배후 진상 (Keeper 기밀)]
${p.scenarioTruth}

[핵심 서사 기믹]
${p.scenarioGimmick || "시간이 흐를수록 감정적 긴장이 고조됩니다."}

--------------------------------------------------
[첫 장면 도입부 설정]
${p.openingNovel}`;

      setScenarioInput(richScenario);
      setGeneratedHandouts(p.initialHandouts || []);

      if (wizardMode === "coc") handleRandomCocStats();
    } catch (e) {
      alert("AI 시나리오 생성 실패: " + e.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAutoReplaceKpcPc = () => {
    if (!scenarioInput.trim()) return alert("시나리오 본문이 없습니다.");
    const pName = charName.trim() || "주인공";
    const kName = kpcList[0]?.name || "파트너";
    setScenarioInput(scenarioInput.replace(/\bKPC\b/gi, kName).replace(/\bPC\b/gi, pName));
    alert(`'PC' ➔ '${pName}', 'KPC' ➔ '${kName}' 치환 완료!`);
  };

  const handleSaveCurrentAsPreset = () => {
    if (!charName.trim()) return alert("캐릭터 이름을 입력해 주세요.");
    const title = newPresetTitle.trim() || `${charName} (${charJob || "설정"})`;
    const newPreset = {
      id: Date.now(), title, name: charName, job: charJob, age: charAge, gender: charGender,
      background: charBackground, portrait: charPortraitUrl, ruleMode: wizardMode,
      cocStats, mission: charMission, secret: charSecret
    };
    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    if (typeof window !== "undefined") localStorage.setItem("rp_hub_custom_presets", JSON.stringify(updated));
    setNewPresetTitle("");
    alert(`'${title}' 프리셋 저장 완료!`);
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
    closeModal(setShowPresetModal);
  };

  const toggleCareerSelection = (id) => {
    setSelectedCareerIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const handleInheritFromMultipleSessions = () => {
    if (selectedCareerIds.length === 0) return alert("계승할 세션을 선택해 주세요.");
    const chosen = sessions.filter((s) => selectedCareerIds.includes(s.id));
    if (chosen.length === 0) return;

    const baseSheet = chosen[0].sheet || {};
    setCharName(baseSheet.name || "");
    setCharJob(baseSheet.job || "");
    if (baseSheet.portrait) setCharPortraitUrl(baseSheet.portrait);
    if (baseSheet.cocStats) setCocStats(baseSheet.cocStats);

    let chronicle = `[🔄 복수 세션 서사 통합 계승 이력]\n`;
    chosen.forEach((s, idx) => {
      const sh = s.sheet || {};
      chronicle += `• [세션 ${idx + 1}: ${s.title}] (규칙: ${s.ruleMode}) 잔여 HP: ${sh.hp}/${sh.maxHp}\n`;
    });
    setPastChronicleText(chronicle);
    setCharBackground(`${baseSheet.background || ""}\n\n${chronicle}`);
    closeModal(setShowCareerModal);
    setSelectedCareerIds([]);
    alert("서사 계승 완료!");
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
        setScenarioInput(text.trim());
      } catch (err) { alert("PDF 오류: " + err.message); } finally { setIsPdfLoading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => setScenarioInput(ev.target.result);
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
    reader.readAsText(file);
  };

  const executeExport = () => {
    if (!activeSession) return;
    let txt = `=========================================\n${activeSession.title}\n=========================================\n\n`;
    (activeSession.messages || []).forEach((m) => {
      if (exportScope === "storyOnly" && m.text.includes("[🎲")) return;
      txt += `${m.role === "user" ? `[${activeSession.sheet?.name || "플레이어"}]` : "[마스터]"}\n${m.text}\n\n`;
    });
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${activeSession.title}_대화록.${exportFormat}`; a.click(); URL.revokeObjectURL(url);
    closeModal(setShowExportModal);
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

  // 강력한 태그 파서 (오탈자 및 KPC 실명 치환 필터)
  const parseTagsSafely = (rawText, partnerName) => {
    let cleanText = rawText || "";
    let parsedData = { suggActions: [], pendingCheck: null, newSheetVars: {}, revealedSecrets: [], investigationSpots: [], newHandouts: [] };

    try {
      const checkMatch = cleanText.match(/<!--\s*CHECK:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (checkMatch) {
        try { parsedData.pendingCheck = JSON.parse(checkMatch[1]); } catch(e) {}
      }

      const suggMatch = cleanText.match(/<!--\s*SUGGESTIONS:\s*(\[[\s\S]*?\])\s*-{1,3}>/i);
      if (suggMatch) {
        try {
          const rawSuggs = JSON.parse(suggMatch[1]);
          // 제안 칩에서도 'KPC' 단어 박멸! 파트너 실명으로 치환
          parsedData.suggActions = rawSuggs.map(s => s.replace(/\bKPC\b/g, partnerName || "파트너"));
        } catch(e) {}
      }

      const spotsMatch = cleanText.match(/<!--\s*SPOTS:\s*(\[[\s\S]*?\])\s*-{1,3}>/i);
      if (spotsMatch) {
        try { parsedData.investigationSpots = JSON.parse(spotsMatch[1]); } catch(e) {}
      }

      const handoutRegex = /<!--\s*HANDOUT:\s*({[\s\S]*?})\s*-{1,3}>/gi;
      for (const m of cleanText.matchAll(handoutRegex)) {
        try { parsedData.newHandouts.push(JSON.parse(m[1])); } catch (e) {}
      }

      const secRegex = /<!--\s*REVEAL_SECRET:\s*({[\s\S]*?})\s*-{1,3}>/gi;
      for (const m of cleanText.matchAll(secRegex)) {
        try { parsedData.revealedSecrets.push(JSON.parse(m[1])); } catch (e) {}
      }

      const statMatch = cleanText.match(/<!--\s*STATUS:\s*({[\s\S]*?})\s*-{1,3}>/i);
      if (statMatch) {
        try { parsedData.newSheetVars = JSON.parse(statMatch[1]); } catch (e) {}
      }
    } catch (e) {}

    // 말풍선 본문에서 태그 제거 및 'KPC' 단어 실명 치환
    cleanText = cleanText
      .replace(/```html|```json|```/gi, "")
      .replace(/<!--[\s\S]*?-{1,3}>/g, "")
      .replace(/<!--[\s\S]*?$/g, "")
      .replace(/\bKPC\b/g, partnerName || "파트너")
      .trim();

    return { cleanText, parsedData };
  };

  // 🔥 서막 열기 (설정과 핸드아웃 4종 100% 반영)
  const startNewSession = async () => {
    const sessionTitle = scenarioTitle || (charName ? `${charName}의 이야기` : "새로운 모험");
    const pName = charName.trim() || "주인공";
    const partnerName = kpcList[0]?.name || "은하";

    const npcs = kpcList.filter(k => k.name.trim() !== "").map(k => ({
      id: k.id, name: k.name, title: k.job || "조력자", portrait: k.portraitUrl || getPortraitUrl(k.name), affection: 10, secret: k.secret, secretRevealed: false
    }));

    // AI가 생성해 둔 4종 핸드아웃이 있다면 우선 로드, 없으면 기본 4종 덱 세팅
    let initialHandouts = generatedHandouts.length > 0 ? generatedHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false })) : [
      { id: 1, title: `${pName}의 사명`, overview: charMission || "사건의 진상을 파악하고 무사히 생환한다.", secret: charSecret || "밝혀지지 않은 과거의 상처가 있다.", revealed: false },
      { id: 2, title: `${partnerName}의 사명`, overview: `${partnerName}와 함께 이 위기를 헤쳐나간다.`, secret: npcs[0]?.secret || "말하지 못한 애틋한 진심이 있다.", revealed: false },
      { id: 3, title: "주변의 단서", overview: "방 안 어딘가에 놓여있는 오래된 기록물.", secret: "두 사람의 운명이 얽히게 된 계기가 기록되어 있다.", revealed: false },
      { id: 4, title: "현장의 소지품", overview: "테이블 위에 놓인 온기 어린 물건.", secret: "소중한 사람을 지키기 위한 결의가 담겨있다.", revealed: false }
    ];

    let initialSheet = {
      name: pName, job: charJob || "조사원", age: charAge, gender: charGender,
      portrait: charPortraitUrl || getPortraitUrl(pName), hp: 20, maxHp: 20,
      npcs, items: [{ name: "황동 돋보기", desc: "확대경" }, { name: "수첩과 만년필", desc: "기록 도구" }],
      madnessStatus: null, handouts: initialHandouts
    };

    if (wizardMode === "insane") {
      initialSheet = { ...initialSheet, hp: 6, maxHp: 6, san: 6, maxSan: 6, limit: insaneLimit, cycle: 1, scene: 1, mission: charMission || "생존과 탈출", secret: charSecret || "밝혀지지 않은 과거" };
    } else if (wizardMode === "coc") {
      initialSheet = { ...initialSheet, hp: derivedHp, maxHp: derivedHp, mp: derivedMp, maxMp: derivedMp, san: derivedSan, maxSan: 99, luck: Number(cocStats.luck), db: derivedDb, cocStats: { ...cocStats } };
    }

    const newId = Date.now();
    const newSession = {
      id: newId, title: sessionTitle, ruleMode: wizardMode, preference: playPreference.trim(),
      scenarioText: scenarioInput, sheet: initialSheet, messages: [], suggestedActions: [],
      investigationSpots: [], pendingCheck: null
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);

    // 고밀도 서막 요청문 (KPC 실명 사용 강제)
    const openingPrompt = `[세션 시작: 첫 서막 지문 요청]
시나리오의 [배후 진상]과 [첫 장면 도입부 설정]을 100% 반영하여, 플레이어가 현장 분위기에 완전히 몰입할 수 있도록 감각적이고 밀도 높은 서막을 여십시오.
반드시 키퍼의 정중한 경어체(~합니다/였습니다)를 유지하십시오.

[🚨 절대 준수]
- 'KPC'라는 단어를 절대 쓰지 마십시오! 반드시 동행자의 실제 이름인 '${partnerName}'(으)로만 호칭하십시오.
- 탐사자 이름 '${pName}'과 '${partnerName}'의 관계성 텐션을 살려 첫 대사와 함께 분위기를 여십시오.
- 지문 끝에 씬 주도권 액션을 위한 <!-- SUGGESTIONS: ["${partnerName}에게 말을 건다", "주변 단서를 살펴본다", "장면표 굴림"] --> 태그를 출력하십시오.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: openingPrompt }],
          scenarioText: scenarioInput,
          playerSheet: initialSheet,
          ruleMode: wizardMode,
          playPreference
        })
      });
      const data = await res.json();
      const { cleanText, parsedData } = parseTagsSafely(data.text, partnerName);

      setSessions(prev => prev.map(s => s.id === newId ? {
        ...s, sheet: { ...initialSheet, ...parsedData.newSheetVars },
        messages: [{ role: "model", text: cleanText }],
        suggestedActions: parsedData.suggActions,
        investigationSpots: parsedData.investigationSpots,
        pendingCheck: parsedData.pendingCheck
      } : s));
    } catch (err) {
      setSessions(prev => prev.map(s => s.id === newId ? { ...s, messages: [{ role: "model", text: `서막을 불러오는 중 오류가 발생했습니다 (${err.message}). 잠시 후 다시 시도해 주세요.` }] } : s));
    } finally {
      setIsLoading(false);
    }
  };

  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;
    const partnerName = activeSession.sheet?.npcs?.[0]?.name || "파트너";
    const updatedMessages = [...(activeSession.messages || []), { role: "user", text: textToSend }];
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, suggestedActions: [], pendingCheck: null } : s));
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          scenarioText: activeSession.scenarioText,
          playerSheet: activeSession.sheet,
          ruleMode: activeSession.ruleMode,
          playPreference: activeSession.preference
        })
      });
      const data = await res.json();
      const { cleanText, parsedData } = parseTagsSafely(data.text || "", partnerName);
      let newSheet = { ...(activeSession.sheet || {}), ...parsedData.newSheetVars };

      if (parsedData.revealedSecrets.length > 0) {
        parsedData.revealedSecrets.forEach(rev => {
          newSheet.npcs = (newSheet.npcs || []).map(n => n.name === rev.name ? { ...n, secret: rev.secret, secretRevealed: true } : n);
        });
      }

      if (parsedData.newHandouts.length > 0) {
        const added = parsedData.newHandouts.map((h, i) => ({ id: Date.now() + i, ...h, revealed: false }));
        newSheet.handouts = [...(newSheet.handouts || []), ...added];
      }

      const prevSan = Number(activeSession.sheet?.san ?? 50);
      const newSan = parsedData.newSheetVars?.san !== undefined ? Number(parsedData.newSheetVars.san) : prevSan;
      if (!activeSession.sheet?.madnessStatus) {
        if (activeSession.ruleMode === "coc" && prevSan - newSan >= 5) triggerMadnessCheck("coc", prevSan - newSan, activeSessionId);
        else if (activeSession.ruleMode === "insane" && prevSan > newSan) triggerMadnessCheck("insane", prevSan - newSan, activeSessionId);
      }

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s, sheet: newSheet,
        messages: [...updatedMessages, { role: "model", text: cleanText }],
        suggestedActions: parsedData.suggActions,
        investigationSpots: parsedData.investigationSpots,
        pendingCheck: parsedData.pendingCheck
      } : s));
    } catch (err) {
      alert("통신 에러: " + err.message);
    } finally {
      setIsLoading(false);
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
    <div style={{ display: "flex", height: "100dvh", width: "100vw", backgroundColor: theme.bg, color: theme.text, overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('[https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css](https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css)');
        @import url('[https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap](https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap)');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Pretendard', sans-serif; }
        .serif-text { font-family: 'Noto Serif KR', serif; line-height: 1.85; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(140, 160, 210, 0.2); border-radius: 4px; }
        .glass-card { background: ${theme.panel}; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid ${theme.border}; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); }
        .glass-alt { background: ${theme.panelAlt}; backdrop-filter: blur(10px); border: 1px solid ${theme.border}; }
        @keyframes diceTumble { 0% { transform: rotate(0deg) scale(0.85); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
        .anim-dice-rolling { animation: diceTumble 0.35s infinite linear; }
      `}</style>

      {showInsanityFlash && <div style={{ position: "fixed", inset: 0, zIndex: 120, backgroundColor: "rgba(220, 20, 60, 0.35)", pointerEvents: "none" }} />}

      {/* 1. 좌측 사이드바 */}
      <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, left: 0, top: 0, bottom: 0, width: isSidebarOpen ? "260px" : "0px", minWidth: isSidebarOpen ? "260px" : "0px", transition: "all 0.25s ease", overflow: "hidden", backgroundColor: theme.sidebar, borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button onClick={() => { setActiveSessionId(null); if (isMobile) setIsSidebarOpen(false); }} style={{ flex: 1, padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }}>+ 새 시나리오</button>
          <button onClick={handleToggleDarkMode} style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.map((s) => (
            <div key={s.id} onClick={() => { setActiveSessionId(s.id); if (isMobile) setIsSidebarOpen(false); }} style={{ padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "4px", backgroundColor: activeSessionId === s.id ? theme.panelAlt : "transparent", border: activeSessionId === s.id ? `1px solid ${theme.border}` : "1px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "6px" }}>
                <div style={{ fontWeight: "700", fontSize: "0.84rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{s.ruleMode}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); if (confirm("삭제하시겠습니까?")) setSessions(sessions.filter(it => it.id !== s.id)); }} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px" }}>🗑️</button>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px", backgroundColor: theme.sidebar }}>
          {activeSession && <button onClick={() => openModal(setShowExportModal)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" }}>📥 대화록 내보내기</button>}
          <button onClick={() => openModal(setShowSettingsModal)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, cursor: "pointer", fontSize: "0.8rem", fontWeight: "700" }}>⚙️ 환경 설정</button>
        </div>
      </div>

      {/* 2. 중앙 메인 뷰 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {!activeSession ? (
          /* 세션 생성 마법사 */
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 100px 14px" : "28px 24px 80px 24px", maxWidth: "980px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}`, paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "6px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "8px", cursor: "pointer" }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800" }}>새로운 세션 생성</h2>
              </div>
              <button onClick={handleAiGenerate} disabled={isAiGenerating} style={{ padding: "8px 16px", backgroundColor: theme.accent, border: "none", color: "#fff", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700" }}>
                {isAiGenerating ? "AI 기획 중..." : "✨ AI 즉석 생성"}
              </button>
            </div>

            {/* 룰 선택 바 */}
            <div className="glass-card" style={{ padding: "16px", borderRadius: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.85rem", fontWeight: "800" }}>
                <span>1. TRPG 룰 시스템</span>
                <button onClick={() => setRuleHelpModalKey(wizardMode)} style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", textDecoration: "underline", fontSize: "0.75rem" }}>룰북 가이드 열람 ?</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "8px" }}>
                {[
                  { key: "insane", name: "인세인 (inSANe)", sub: "2D6 / 비밀 & 핸드아웃", color: theme.warning },
                  { key: "coc", name: "크툴루의 부름 (CoC)", sub: "1D100 / 460pt & 광기", color: theme.danger },
                  { key: "freeform", name: "자유 서사 (소설)", sub: "주사위 없는 역극", color: theme.accent }
                ].map((item) => (
                  <div key={item.key} onClick={() => setWizardMode(item.key)} style={{ padding: "12px", borderRadius: "10px", border: `1.5px solid ${wizardMode === item.key ? item.color : theme.border}`, backgroundColor: wizardMode === item.key ? theme.panelAlt : "transparent", cursor: "pointer" }}>
                    <div style={{ fontWeight: "700", fontSize: "0.85rem", color: item.color }}>{item.name}</div>
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "4px" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 인물 & 시나리오 설정 */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.85rem" }}>2. 탐사자 프로필 (PC)</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => openModal(setShowCareerModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "6px", color: theme.warning, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>🔄 서사 계승</button>
                      <button onClick={() => openModal(setShowPresetModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "6px", color: theme.accent, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>📂 프리셋</button>
                      <button onClick={() => { setActivePortraitTarget("pc"); openModal(setShowPortraitEditModal); }} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>🖼️ 초상화</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div onClick={() => { setActivePortraitTarget("pc"); openModal(setShowPortraitEditModal); }} style={{ width: "55px", height: "55px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.accent}`, cursor: "pointer", flexShrink: 0 }}>
                      <img src={charPortraitUrl || getPortraitUrl(charName)} alt="PC" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="이름" style={{ padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} />
                      <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업/역할" style={{ padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} />
                    </div>
                  </div>
                  <textarea value={charBackground} onChange={(e) => setCharBackground(e.target.value)} placeholder="상세 백스토리 및 소지품 3가지..." style={{ width: "100%", height: "65px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem", resize: "none" }} />
                  
                  {/* PC 비밀 토글 */}
                  <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "8px" }}>
                    <button type="button" onClick={() => setShowCharSecret(!showCharSecret)} style={{ width: "100%", padding: "6px", backgroundColor: showCharSecret ? "rgba(247, 101, 133, 0.1)" : theme.panelAlt, border: `1px solid ${showCharSecret ? theme.danger : theme.border}`, borderRadius: "4px", color: showCharSecret ? theme.danger : theme.text, cursor: "pointer", fontSize: "0.75rem", fontWeight: "700" }}>
                      {showCharSecret ? "🔒 내 비밀 닫기" : "👀 내 캐릭터의 숨겨진 비밀 (인세인/사명)"}
                    </button>
                    {showCharSecret && (
                      <textarea value={charSecret} onChange={(e) => setCharSecret(e.target.value)} placeholder="다른 사람에게 숨기고 있는 진짜 목적이나 과거" style={{ width: "100%", height: "55px", marginTop: "6px", padding: "8px", backgroundColor: "rgba(247, 101, 133, 0.05)", border: `1px solid ${theme.danger}`, borderRadius: "4px", color: theme.danger, fontSize: "0.8rem", resize: "none" }} />
                    )}
                  </div>
                </div>

                {/* CoC 460pt 배분기 */}
                {wizardMode === "coc" && (
                  <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", border: `1.5px solid ${theme.danger}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.danger }}>CoC 7판 특성치 (460 pt)</span>
                      <button onClick={handleRandomCocStats} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.accent, fontSize: "0.74rem", cursor: "pointer", fontWeight: "700" }}>🎲 460pt 자동 분배</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginBottom: "8px" }}>
                      {[{ k: "str", l: "근력" }, { k: "con", l: "건강" }, { k: "siz", l: "크기" }, { k: "dex", l: "민첩" }, { k: "app", l: "외모" }, { k: "int", l: "지능" }, { k: "pow", l: "정신" }, { k: "edu", l: "교육" }].map(s => (
                        <div key={s.k}>
                          <label style={{ fontSize: "0.68rem", color: theme.textMuted }}>{s.l}</label>
                          <input type="number" min="15" max="90" value={cocStats[s.k]} onChange={e => setCocStats({ ...cocStats, [s.k]: Number(e.target.value) })} style={{ width: "100%", padding: "4px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.8rem", textAlign: "center" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: "0.75rem", textAlign: "right", color: remainingPoints < 0 ? theme.danger : theme.success, fontWeight: "700" }}>
                      잔여: {remainingPoints} pt | 행운: <input type="number" value={cocStats.luck} onChange={e => setCocStats({ ...cocStats, luck: Number(e.target.value) })} style={{ width: "40px", padding: "2px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", textAlign: "center" }} />
                    </div>
                  </div>
                )}

                {/* 인세인 리미트 & 사명 설정 */}
                {wizardMode === "insane" && (
                  <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", border: `1.5px solid ${theme.warning}`, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.warning }}>인세인 설정 (HP 6 / SAN 6)</span>
                      <label style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.warning }}>
                        리미트: <input type="number" min="2" max="5" value={insaneLimit} onChange={e => setInsaneLimit(Number(e.target.value))} style={{ width: "45px", padding: "2px 6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.warning}`, borderRadius: "4px", color: theme.text, textAlign: "center" }} /> 사이클
                      </label>
                    </div>
                    <input type="text" value={charMission} onChange={e => setCharMission(e.target.value)} placeholder="공개 사명 (예: 사건의 비밀을 밝혀내고 생환한다)" style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem" }} />
                  </div>
                )}
              </div>

              {/* 우측 칼럼 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.85rem", color: theme.accent }}>3. 서사 지향 태그</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {[...ORIENT_TAGS, ...TROPE_TAGS].map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "4px 10px", borderRadius: "16px", fontSize: "0.72rem", fontWeight: playPreference.includes(tag) ? "700" : "400", backgroundColor: playPreference.includes(tag) ? theme.accent : theme.panelAlt, color: playPreference.includes(tag) ? "#fff" : theme.text, border: `1px solid ${playPreference.includes(tag) ? theme.accent : theme.border}`, cursor: "pointer" }}>{tag}</button>
                    ))}
                  </div>
                  <input type="text" value={playPreference} onChange={e => setPlayPreference(e.target.value)} placeholder="태그 직접 입력..." style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem", marginTop: "4px" }} />
                </div>

                <div className="glass-card" style={{ padding: "16px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.85rem" }}>4. 시나리오 진상 및 개요</span>
                    <button onClick={handleAutoReplaceKpcPc} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, borderRadius: "6px", color: theme.accent, fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>🔄 PC/KPC 치환</button>
                  </div>
                  <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} style={{ width: "100%", fontSize: "0.75rem" }} />
                  {isPdfLoading && <div style={{ fontSize: "0.75rem", color: theme.warning }}>⏳ PDF 파싱 중...</div>}
                  <textarea value={scenarioInput} onChange={e => setScenarioInput(e.target.value)} placeholder="시나리오 진상, 특수 기믹, 첫 장면을 입력하세요..." style={{ width: "100%", height: "130px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "0.8rem", lineHeight: "1.5", resize: "vertical" }} />
                </div>
              </div>
            </div>

            <button onClick={startNewSession} disabled={isLoading || isPdfLoading} style={{ width: "100%", padding: "16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "1.05rem" }}>
              {isLoading ? "키퍼가 세계를 여는 중..." : "서막 열기"}
            </button>
          </div>
        ) : (
          /* 플레이 룸 */
          <>
            {/* 상단 바 */}
            <div style={{ height: "52px", padding: "0 14px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "4px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <span style={{ fontWeight: "800", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "110px" : "200px" }}>{activeSession.title}</span>
                {activeSession.ruleMode === "insane" && (
                  <span style={{ padding: "2px 6px", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1px solid ${theme.warning}`, borderRadius: "4px", fontSize: "0.7rem", color: theme.warning, fontWeight: "700" }}>
                    {activeSession.sheet?.cycle || 1}C / {activeSession.sheet?.scene || 1}S (리미트: {activeSession.sheet?.limit || 3})
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {activeSession.ruleMode === "insane" && (
                  <>
                    <button onClick={handleRollSceneTable} style={{ padding: "5px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, color: theme.warning, borderRadius: "12px", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}>🎲 장면표</button>
                    <button onClick={() => setIsTabletopOpen(!isTabletopOpen)} style={{ padding: "5px 10px", backgroundColor: isTabletopOpen ? theme.warning : theme.panel, border: `1px solid ${theme.warning}`, color: isTabletopOpen ? "#000" : theme.warning, borderRadius: "12px", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}>🃏 테이블탑</button>
                  </>
                )}
                {activeSession.ruleMode === "coc" && (
                  <button onClick={() => rollDiceDirectly(activeSession.sheet?.san ?? 50, "이성(SAN)")} disabled={isRolling || isLoading} style={{ padding: "5px 8px", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: "14px", cursor: "pointer", fontWeight: "800", fontSize: "0.72rem" }}>
                    🧠 산 체크 ({activeSession.sheet?.san ?? 50})
                  </button>
                )}
                <button onClick={() => rollDiceDirectly()} disabled={isRolling || isLoading} style={{ padding: "5px 10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "0.75rem" }}>
                  🎲 주사위
                </button>
                <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }}>{isSheetOpen ? "시트▶" : "◀시트"}</button>
              </div>
            </div>

            {/* 인세인 테이블탑 오버레이 (카드 4종 이상 깔끔 노출) */}
            {activeSession.ruleMode === "insane" && isTabletopOpen && (
              <div style={{ position: "absolute", top: "52px", left: 0, right: 0, bottom: "75px", backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", zIndex: 40, padding: "20px", display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: "16px", overflowY: "auto" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                  <span style={{ fontWeight: "800", fontSize: "0.95rem" }}>🃏 활성화된 핸드아웃 ({activeSession.sheet.handouts?.length || 0}개)</span>
                  <button onClick={() => setIsTabletopOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
                </div>
                
                {(activeSession.sheet.handouts || []).map(card => (
                  <div key={card.id} onClick={() => toggleHandoutReveal(card.id)} className="glass-card" style={{ width: "170px", minHeight: "230px", borderRadius: "12px", border: `1.5px solid ${card.revealed ? theme.danger : theme.border}`, padding: "14px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all 0.2s" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: card.revealed ? theme.danger : theme.accent, fontWeight: "800" }}>{card.revealed ? "💀 비밀 해금됨" : "📜 공개 핸드아웃"}</div>
                      <div style={{ fontWeight: "800", fontSize: "0.9rem", margin: "6px 0", color: theme.text }}>{card.title}</div>
                      <div style={{ fontSize: "0.75rem", color: card.revealed ? theme.danger : theme.textMuted, lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                        {card.revealed ? card.secret : card.overview}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.65rem", textAlign: "center", color: theme.textMuted, borderTop: `1px dashed ${theme.border}`, paddingTop: "6px" }}>터치하여 앞/뒤 뒤집기</div>
                  </div>
                ))}

                <div className="glass-card" onClick={() => triggerMadnessCheck("insane", 1, activeSessionId)} style={{ width: "170px", minHeight: "230px", borderRadius: "12px", border: `1.5px solid ${theme.danger}`, padding: "14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(214, 56, 87, 0.1)" }}>
                  <span style={{ fontSize: "2.2rem" }}>💀</span>
                  <span style={{ fontWeight: "800", marginTop: "10px", fontSize: "0.9rem", color: theme.danger }}>미공개 광기 덱</span>
                  <span style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "4px" }}>터치하여 광기 발현</span>
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

              {(activeSession.messages || []).map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "90%" : "82%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div className={m.role === "user" ? "" : "serif-text"} style={{ backgroundColor: m.text.includes("[🎲") ? "rgba(229, 169, 60, 0.12)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi, color: theme.text, border: m.text.includes("[🎲") ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`, padding: "12px 16px", borderRadius: "12px", lineHeight: "1.75", whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                    {m.text}
                  </div>
                  {m.role === "user" && (
                    <button onClick={() => { if (confirm("되돌리시겠습니까?")) { setInput(m.text); setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: s.messages.slice(0, i) } : s)); } }} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "0.68rem", cursor: "pointer", marginTop: "2px" }}>↩️ 수정/되돌리기</button>
                  )}
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.8rem", padding: "4px" }}>마스터가 서사를 집필하는 중...</div>}
            </div>

            {/* 판정/조사/행동 제안 칩 바 */}
            <div style={{ backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, padding: "8px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
              
              {/* 판정 요구 배너 */}
              {activeSession?.pendingCheck && !isSanCheckDetected && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(229, 169, 60, 0.2)", border: `1.5px solid ${theme.warning}`, borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "0.78rem", color: theme.text }}>
                    <strong style={{ color: theme.warning }}>🎲 판정 요구: {activeSession.pendingCheck.skill}</strong>
                    <span style={{ fontSize: "0.72rem", color: theme.textMuted, marginLeft: "6px" }}>
                      (목표치: {activeSession.pendingCheck.target}) {activeSession.pendingCheck.reason ? `- ${activeSession.pendingCheck.reason}` : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => rollDiceDirectly(activeSession.pendingCheck.target, activeSession.pendingCheck.skill)}
                    style={{ padding: "5px 12px", backgroundColor: theme.warning, color: "#000", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    🎲 판정 굴리기 ({activeSession.ruleMode === "coc" ? "1D100" : "2D6"})
                  </button>
                </div>
              )}

              {/* 산 체크 알림 배너 */}
              {isSanCheckDetected && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(247, 101, 133, 0.2)", border: `1px solid ${theme.danger}`, borderRadius: "8px", padding: "6px 10px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.danger }}>⚠️ 키퍼의 이성(SAN) 체크 선언!</span>
                  <button onClick={() => rollDiceDirectly(activeSession.sheet?.san ?? 50, "이성(SAN)")} style={{ padding: "4px 10px", backgroundColor: theme.danger, color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}>🎲 산 체크 굴리기</button>
                </div>
              )}

              {/* 조사 구역 칩 */}
              {(activeSession.investigationSpots || []).length > 0 && (
                <div style={{ display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "0.72rem", color: theme.warning, fontWeight: "700", alignSelf: "center" }}>🔍 조사:</span>
                  {activeSession.investigationSpots.map((spot, idx) => (
                    <button key={idx} onClick={() => setInput(prev => `[조사: ${spot.name}] ` + prev)} style={{ padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.warning}`, borderRadius: "12px", color: theme.text, fontSize: "0.72rem", cursor: "pointer" }}>{spot.name}</button>
                  ))}
                </div>
              )}

              {/* 추천 행동 칩 */}
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
              <button onClick={sendMessage} disabled={isLoading || !input.trim()} style={{ height: "48px", padding: "0 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }}>전송</button>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 상태창 */}
      {activeSession && (
        <div style={{ position: isMobile ? "fixed" : "relative", zIndex: isMobile ? 50 : 1, right: 0, top: 0, bottom: 0, width: isSheetOpen ? "280px" : "0px", minWidth: isSheetOpen ? "280px" : "0px", transition: "all 0.25s ease", overflow: "hidden", backgroundColor: theme.sidebar, borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
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

            {activeSession.ruleMode === "insane" && (
              <div className="glass-card" style={{ padding: "10px", borderRadius: "8px", fontSize: "0.72rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div><strong style={{ color: theme.warning }}>공개 사명:</strong> {activeSession.sheet.mission}</div>
                <div style={{ color: theme.danger, borderTop: `1px dashed ${theme.border}`, paddingTop: "4px" }}>
                  <strong>🔒 비밀:</strong> {activeSession.sheet.secret}
                </div>
              </div>
            )}

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

            <div className="glass-card" style={{ padding: "10px", borderRadius: "8px" }}>
              <div style={{ fontWeight: "800", fontSize: "0.78rem", marginBottom: "6px", color: theme.accent }}>주요 등장인물 (KPC)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(activeSession.sheet.npcs || []).map(npc => (
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

      {/* 모달 창 목록 */}
      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "22px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>⚙️ 환경 설정</h3>
              <button onClick={() => closeModal(setShowSettingsModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", display: "block", marginBottom: "6px" }}>2026 팬톤 테마 팔레트</label>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "8px 12px", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "700" }}>주사위 롤링 3D 애니메이션</span>
                <button onClick={() => handleSaveAnim(!animationEnabled)} style={{ padding: "4px 10px", backgroundColor: animationEnabled ? theme.accent : theme.border, color: "#fff", border: "none", borderRadius: "12px", fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>{animationEnabled ? "켜짐" : "꺼짐"}</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "8px 12px", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "700" }}>AI 행동 제안 칩 노출</span>
                <button onClick={() => setSuggestionsEnabled(!suggestionsEnabled)} style={{ padding: "4px 10px", backgroundColor: suggestionsEnabled ? theme.accent : theme.border, color: "#fff", border: "none", borderRadius: "12px", fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}>{suggestionsEnabled ? "켜짐" : "꺼짐"}</button>
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
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "400px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>초상화 변경 ({activePortraitTarget === "pc" ? "내 캐릭터" : "KPC"})</h3>
              <button onClick={() => closeModal(setShowPortraitEditModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "10px" }}>AI 프롬프트 또는 이미지 URL을 입력하세요.</div>
            <input type="text" value={customPortraitPrompt} onChange={e => setCustomPortraitPrompt(e.target.value)} placeholder="예: silver hair girl / 이미지 URL" style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.8rem", marginBottom: "12px" }} />
            <button onClick={applyCustomPortrait} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.8rem" }}>적용</button>
          </div>
        </div>
      )}

      {showPresetModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem" }}>📂 캐릭터 프리셋 관리</h3>
              <button onClick={() => closeModal(setShowPresetModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              <input type="text" value={newPresetTitle} onChange={e => setNewPresetTitle(e.target.value)} placeholder="프리셋 이름" style={{ flex: 1, padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.78rem" }} />
              <button onClick={handleSaveCurrentAsPreset} style={{ padding: "6px 12px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontSize: "0.75rem" }}>저장</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "160px", overflowY: "auto" }}>
              {customPresets.map(p => (
                <div key={p.id} onClick={() => handleLoadPreset(p)} style={{ padding: "8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "6px", cursor: "pointer", display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                  <span><strong>{p.title}</strong> ({p.name})</span>
                  <button onClick={(e) => { e.stopPropagation(); setCustomPresets(customPresets.filter(it => it.id !== p.id)); }} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer" }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCareerModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 125, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", color: theme.warning }}>🔄 이전 세션 서사 계승</h3>
              <button onClick={() => closeModal(setShowCareerModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto", marginBottom: "12px" }}>
              {sessions.map(s => (
                <div key={s.id} onClick={() => toggleCareerSelection(s.id)} style={{ padding: "8px", backgroundColor: selectedCareerIds.includes(s.id) ? theme.panel : theme.panelAlt, border: `1px solid ${selectedCareerIds.includes(s.id) ? theme.warning : theme.border}`, borderRadius: "6px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontSize: "0.75rem" }}>
                  <input type="checkbox" checked={selectedCareerIds.includes(s.id)} onChange={() => {}} />
                  <span>{s.title} ({s.sheet?.name})</span>
                </div>
              ))}
            </div>
            <button onClick={handleInheritFromMultipleSessions} style={{ width: "100%", padding: "10px", backgroundColor: theme.warning, color: "#000", border: "none", borderRadius: "8px", fontWeight: "800", cursor: "pointer", fontSize: "0.8rem" }}>계승 적용</button>
          </div>
        </div>
      )}

      {ruleHelpModalKey && RULE_GUIDES[ruleHelpModalKey] && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 140, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "440px", padding: "22px", borderRadius: "14px", color: theme.text }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: theme.accent }}>📖 {RULE_GUIDES[ruleHelpModalKey].title}</h3>
            <div style={{ fontSize: "0.8rem", color: theme.textMuted, lineHeight: "1.5", marginBottom: "10px" }}>{RULE_GUIDES[ruleHelpModalKey].desc}</div>
            <div style={{ fontSize: "0.8rem", color: theme.warning }}>{RULE_GUIDES[ruleHelpModalKey].system}</div>
            <button onClick={() => setRuleHelpModalKey(null)} style={{ marginTop: "16px", width: "100%", padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>확인</button>
          </div>
        </div>
      )}

      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "400px", padding: "20px", borderRadius: "14px", color: theme.text }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem" }}>📥 대화록 내보내기</h3>
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              <button onClick={() => setExportFormat("txt")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${exportFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: exportFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>TXT</button>
              <button onClick={() => setExportFormat("md")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${exportFormat === "md" ? theme.accent : theme.border}`, backgroundColor: exportFormat === "md" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>MD</button>
            </div>
            <button onClick={executeExport} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.8rem" }}>다운로드</button>
          </div>
        </div>
      )}

      {showBackupModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
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
    </div>
  );
}
