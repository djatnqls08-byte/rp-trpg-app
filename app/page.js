"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 패널 제어
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  // 모달 제어
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // 테마 시스템
  const [currentPalette, setCurrentPalette] = useState("midnight");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 효과음, 연출, AI 답변 제안 칩 설정
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [suggestedActions, setSuggestedActions] = useState([]);

  // 대화록 내보내기 옵션
  const [exportFormat, setExportFormat] = useState("txt");
  const [exportScope, setExportScope] = useState("all");

  // API 모니터링
  const [apiUsage, setApiUsage] = useState({
    date: new Date().toISOString().slice(0, 10),
    dailyRequests: 0,
    totalTokens: 0,
    lastPromptTokens: 0,
    lastResponseTokens: 0,
  });
  const [manualCountInput, setManualCountInput] = useState("");

  // 마법사 입력 상태
  const [wizardMode, setWizardMode] = useState("coc");
  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("26");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [scenarioInput, setScenarioInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 서사 톤 & 관계성 성향
  const [playPreference, setPlayPreference] = useState("");

  // CoC 7판 특성치
  const [cocStats, setCocStats] = useState({
    str: 40,
    con: 50,
    siz: 50,
    dex: 60,
    app: 70,
    int: 75,
    pow: 75,
    edu: 40,
    luck: 55,
  });

  // 주사위 상태
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(12);
  const [targetStat, setTargetStat] = useState(50);
  const [pendingCheck, setPendingCheck] = useState(null);

  // ============================================================
  // 대규모 클리셰 서사 & 캐릭터 절차적 생성 데이터베이스
  // ============================================================
  const clichesPool = {
    coc: {
      names: ["사반", "로웨나", "비비안", "엘레노어", "카밀라", "샬롯", "이졸데", "마리안", "세실리아", "베아트리스"],
      jobs: [
        { job: "고서적 및 유물 감정사", item: "황동 돋보기, 가죽 수첩, 은제 만년필 나이프", bg: "금서와 고대 비전서의 기괴한 필적을 감정하며 살아온 인물. 지적 호기심과 미지에 대한 집착이 강하다." },
        { job: "사립 탐정", item: "회중시계형 나침반, 콜트 32구경 권총, 잠금해제용 철사", bg: "어둠에 묻힌 실종 사건과 기괴한 밀실 범죄를 전담해 온 탐정. 날카로운 직관과 침착함을 지녔다." },
        { job: "정신과 의사", item: "진정제 앰플, 가죽 청진기, 임상 기록 노트", bg: "원인 불명의 집단 광기와 망상 환자들을 치료해 온 학자. 타인의 미묘한 심리 변화를 짚어낸다." },
        { job: "고고학 발굴단원", item: "제도용 캘리퍼스, 손전등, 발굴용 작은 단도", bg: "모래와 석조 잔해 밑에 묻힌 고대 신전을 탐사해 온 현장주의자. 금기된 유적에 매료되어 있다." },
        { job: "탐사 저널리스트", item: "소형 카메라, 만년필 녹음기, 압박 붕대", bg: "가문의 스캔들과 사교 집단의 밀실 의식을 파헤쳐 온 기자. 위험 앞에서도 물러서지 않는다." },
      ],
      places: [
        "폭풍우와 해무로 고립된 해안 절벽의 빅토리아풍 고택 '블랙우드 저택'",
        "폭설로 외부 진입로가 완전히 봉쇄된 산 정상의 '아컴 요양 병동'",
        "지진으로 유일한 석조 출입구가 무너져 내린 고대 사막의 '이형 지하 신전'",
        "밤마다 짙은 안개 속에서 타종 소리가 울려 퍼지는 호숫가의 '폐쇄된 수녀원'",
        "출항 직후 원인 불명으로 통신이 두절되고 안개 속에 표류한 호화 여객선",
        "외지인의 출입을 극도로 꺼리며 매년 기괴한 제사를 지내는 외딴 섬마을",
      ],
      npc1: [
        { name: "엘리제", title: "은발의 상속녀", trait: "병약하고 서늘한 인상이지만 주인공에게 깊은 호기심과 강박적인 의존을 드러냄" },
        { name: "아이린", title: "의문의 기록원", trait: "비밀을 감춘 나른한 눈빛으로 주인공의 일거수일투족을 관찰하며 은밀한 호감을 보임" },
        { name: "베아트리스", title: "귀족 출신 후원자", trait: "오만하고 까칠한 말투 뒤편으로 주인공의 안위를 누구보다 조마조마하게 걱정함" },
        { name: "세실", title: "비밀을 품은 섬마을 무녀", trait: "신비롭고 위태로운 분위기 속에서 오직 주인공에게만 진실을 털어놓으려 함" },
      ],
      npc2: [
        { name: "유스티나", title: "단호한 호위 경호원", trait: "권총을 차고 주인공을 외부인이라며 매섭게 견제하지만 기이한 독점욕을 숨기지 못함" },
        { name: "마가렛", title: "냉혹한 관리인", trait: "엄격하고 무자비하게 현장을 통제하면서도 주인공의 시선과 인정에 집착함" },
        { name: "카라", title: "과묵한 현지 길잡이", trait: "말수는 적으나 주인공을 가로막는 위험 앞에서는 목숨을 걸고 앞장서며 과보호함" },
        { name: "다프네", title: "경찰 소속 수사관", trait: "주인공을 의심스러운 용의자로 대하면서도 결코 자신의 시야 밖으로 벗어나지 못하게 함" },
      ],
      events: [
        "서재 안쪽에서 유리창이 산산조각 나며 인간의 성대가 아닌 듯한 젖은 속삭임이 쏟아져 내립니다.",
        "석문 틈새로 푸른 인광이 새어 나오며 바닥의 마법진이 액체처럼 검게 끓어오르기 시작합니다.",
        "괘종시계의 바늘이 반대 방향으로 회전하며 저택 안의 모든 촛불이 일제히 푸른 불꽃으로 물듭니다.",
        "복도 끝 어둠 속에서 축축한 점막이 마룻바닥을 기어오는 듯한 기괴한 소음이 다가옵니다.",
      ]
    },
    d20: [
      {
        theme: "아카데미 수석·차석 라이벌",
        name: "세리스",
        job: "마법 아카데미 평민 수석",
        age: "20",
        items: "마력 각인 만년필, 정밀 양피지 노트, 비상용 마나 포션",
        bg: "엄격한 신분제 아카데미에서 실력 하나로 수석을 꿰찬 수재. 타인에게 약점을 보이지 않으려 늘 꼿꼿하다.",
        scenario: "황립 마법 아카데미의 봉인된 지하 서고. 주인공을 눈엣가시로 여기면서도 집착하는 명문 공작가의 차석 '비올라'와, 주인공을 과보호하며 전담 호위를 자처하는 기사학부 수석 '헬레나'가 함께 갇히게 됩니다. 봉인석이 깨지며 고대 금주가 폭주하기 시작합니다."
      },
      {
        theme: "북부대공 & 계약 정략결혼",
        name: "로웨나",
        job: "몰락 귀족의 후계자",
        age: "24",
        items: "가문의 인장 반지, 독침이 숨겨진 부채, 해독제 앰플",
        bg: "가문의 멸문을 막기 위해 냉혹하기로 악명 높은 북부 대공가로 팔려오듯 시집온 인물. 이성적이고 침착하다.",
        scenario: "눈보라가 몰아치는 험준한 북부의 '흑철성'. 피도 눈물도 없다고 알려진 얼음 같은 북부 대공 '베아트릭스'는 주인공에게 냉정하게 선을 긋지만 묘한 집착을 드러내고, 그녀를 견제하는 근위대장 '발렌티나'는 주인공을 암살자로 의심하며 날을 세웁니다. 자정의 연회장 조명이 일제히 꺼집니다."
      },
      {
        theme: "가이드버스 & 폭주 센티넬",
        name: "서윤",
        job: "S급 공인 가이드",
        age: "25",
        items: "고농축 안정제 키트, 가이딩 측정 팔찌, 호신용 섬광탄",
        bg: "희귀한 파동을 지녀 통제 불능인 강력한 에스퍼들을 전담 진정시켜 온 베테랑 가이드.",
        scenario: "폭주 경보가 울려 퍼지는 특수 격리 구역. 주인공 외에는 그 누구의 손길도 거부하며 파멸 직전에 이른 최강의 에스퍼 '권유화'가 피투성이가 된 채 주인공의 옷자락을 붙잡고, 그녀를 사살하라는 명령을 받은 냉혹한 집행관 '차선우'가 총구를 겨눈 채 주인공의 결단을 재촉합니다."
      },
      {
        theme: "황녀 & 전속 호위기사",
        name: "아리아",
        job: "황실 근위 기사",
        age: "23",
        items: "서약의 은검, 황실 문장 망토, 숫돌",
        bg: "반역으로 황궁이 불타던 날, 유일하게 어린 황녀를 빼돌려 지켜낸 전속 호위기사.",
        scenario: "국경 지대의 버려진 산장. 황권을 되찾으려는 오만하지만 유약한 황녀 '카밀라'는 주인공에게만 필사적으로 의존하고, 피난길을 안내해 준 냉철한 용병 대장 '레니에'는 주인공에게 기이한 흥미를 보이며 자신의 곁에 남으라 회유합니다. 숲속에서 추격대의 말발굽 소리가 들려옵니다."
      },
      {
        theme: "재벌 3세 & 전속 경호원",
        name: "도아",
        job: "VIP 전속 경호원",
        age: "27",
        items: "전술 무전 이어셋, 방탄 조끼, 특수 테이저건",
        bg: "특수부대 출신의 과묵하고 유능한 경호원. VIP의 생명을 지키는 것을 절대 원칙으로 삼는다.",
        scenario: "비 내리는 도심 펜트하우스. 의문의 살해 위협에 시달리며 누구도 믿지 못하는 까칠한 재벌 3세 '신예은'은 주인공에게만 곁을 내어주며 집착하고, 사건을 파헤치는 집요한 강력계 형사 '강이경'은 주인공과 날카로운 신경전을 벌입니다. 정전과 함께 도어록이 강제로 해제됩니다."
      },
      {
        theme: "시한부 & 쌍방 구원 서사",
        name: "이졸데",
        job: "저주받은 연금술사",
        age: "22",
        items: "생명 유지 에테르병, 은제 단도, 고대 연구 수첩",
        bg: "금지된 지식을 대가로 수명이 얼마 남지 않은 시한부 연구자. 담담하게 최후를 준비하고 있다.",
        scenario: "안개 자욱한 성벽 도시의 은신처. 주인공을 구원하기 위해 자신의 영혼마저 악마에게 저당 잡힌 암살자 '키이라'가 피를 흘리며 돌아오고, 그녀를 추적해 온 거룩하지만 냉혹한 성기사 '클레어'가 칼을 빼어 듭니다. 주인공의 서약이 시험대에 오릅니다."
      },
      {
        theme: "앙숙 배틀 라이벌 & 전우애",
        name: "알렉스",
        job: "자유 용병",
        age: "26",
        items: "개조 샷건, 군용 컴뱃 나이프, 지혈제",
        bg: "거칠고 위험한 의뢰를 도맡아 온 용병. 입은 험하지만 등을 맡긴 동료는 절대 버리지 않는다.",
        scenario: "무너져 내리는 지하 벙커. 오랜 라이벌이자 마주치기만 하면 칼부터 겨누던 앙숙 용병 '모건'과 단둘이 고립되었습니다. 서로 으르렁대면서도 등을 맞대고 총구를 겨눈 가운데, 어둠 속에서 기괴한 변이 생명체들이 떼를 지어 몰려들기 시작합니다."
      }
    ]
  };

  // CoC 460pt 정규 룰 주사위 배분
  const generateRandomCocStats = () => {
    const base = [30, 30, 30, 30, 30, 30, 30, 30];
    let remaining = 220;
    while (remaining > 0) {
      const idx = Math.floor(Math.random() * 8);
      if (base[idx] < 85) {
        base[idx] += 5;
        remaining -= 5;
      }
    }
    return {
      str: base[0],
      con: base[1],
      siz: base[2],
      dex: base[3],
      app: base[4],
      int: base[5],
      pow: base[6],
      edu: base[7],
      luck: Math.floor(Math.random() * 50) + 40,
    };
  };

  const themePalettes = {
    midnight: {
      name: "미드나잇 블루",
      dark: {
        bg: "#0d1017",
        sidebar: "#131722",
        panel: "#1b2030",
        panelAlt: "#23293d",
        border: "#2b334d",
        text: "#e4e7f5",
        textMuted: "#8e96b3",
        accent: "#6c8dfa",
        danger: "#f76585",
        warning: "#e0af68",
        success: "#7bd88f",
        bubbleUser: "#324b87",
        bubbleAi: "#1b2030",
        inputBg: "#121520",
      },
      light: {
        bg: "#eef2fa",
        sidebar: "#dfe5f5",
        panel: "#ffffff",
        panelAlt: "#e6ecf8",
        border: "#c5cee8",
        text: "#1e2638",
        textMuted: "#606c88",
        accent: "#3f6cd8",
        danger: "#d13b5a",
        warning: "#b87514",
        success: "#2e8544",
        bubbleUser: "#4b74cb",
        bubbleAi: "#ffffff",
        inputBg: "#ffffff",
      },
    },
    abyss: {
      name: "심연 어비스",
      dark: {
        bg: "#050608",
        sidebar: "#090c12",
        panel: "#0e131d",
        panelAlt: "#141c2b",
        border: "#1d2638",
        text: "#dcdfe8",
        textMuted: "#6f788e",
        accent: "#5679e0",
        danger: "#e0536c",
        warning: "#cfa14c",
        success: "#5eb871",
        bubbleUser: "#1f325c",
        bubbleAi: "#0e131d",
        inputBg: "#080a10",
      },
      light: {
        bg: "#f3f4f7",
        sidebar: "#e3e6eb",
        panel: "#ffffff",
        panelAlt: "#e9edf3",
        border: "#cbd0d9",
        text: "#13161c",
        textMuted: "#5e6473",
        accent: "#3651a1",
        danger: "#c2344f",
        warning: "#a87720",
        success: "#2d7d42",
        bubbleUser: "#435994",
        bubbleAi: "#ffffff",
        inputBg: "#ffffff",
      },
    },
    sepia: {
      name: "고서적 세피아",
      dark: {
        bg: "#241e1a",
        sidebar: "#1c1714",
        panel: "#302822",
        panelAlt: "#3d332b",
        border: "#4d4036",
        text: "#ede3d8",
        textMuted: "#ad9c8f",
        accent: "#d49b6a",
        danger: "#d95b5b",
        warning: "#e3ad5d",
        success: "#8bb36b",
        bubbleUser: "#5e4533",
        bubbleAi: "#302822",
        inputBg: "#1a1512",
      },
      light: {
        bg: "#f9f6f0",
        sidebar: "#efe7dc",
        panel: "#fffdf9",
        panelAlt: "#e6dcce",
        border: "#d6c8b4",
        text: "#362b22",
        textMuted: "#7a6a5a",
        accent: "#a96934",
        danger: "#b83d3d",
        warning: "#b0741b",
        success: "#4e7d34",
        bubbleUser: "#825d3d",
        bubbleAi: "#fffdf9",
        inputBg: "#fffdf9",
      },
    },
    classic: {
      name: "클래식 모던",
      dark: {
        bg: "#121316",
        sidebar: "#181a1f",
        panel: "#21242b",
        panelAlt: "#282c34",
        border: "#333842",
        text: "#abb2bf",
        textMuted: "#7f848e",
        accent: "#61afef",
        danger: "#e06c75",
        warning: "#e5c07b",
        success: "#98c379",
        bubbleUser: "#3b4860",
        bubbleAi: "#21242b",
        inputBg: "#16181d",
      },
      light: {
        bg: "#f7f8fa",
        sidebar: "#edf0f4",
        panel: "#ffffff",
        panelAlt: "#e4e8ef",
        border: "#cfd5df",
        text: "#24272e",
        textMuted: "#6b7280",
        accent: "#2563eb",
        danger: "#dc2626",
        warning: "#d97706",
        success: "#16a34a",
        bubbleUser: "#3b82f6",
        bubbleAi: "#ffffff",
        inputBg: "#ffffff",
      },
    },
  };

  const activePaletteObj = themePalettes[currentPalette] || themePalettes.midnight;
  const theme = isDarkMode ? activePaletteObj.dark : activePaletteObj.light;

  const playDiceSound = () => {
    if (soundVolume <= 0) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      for (let i = 0; i < 7; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const startTime = now + i * 0.08 + Math.random() * 0.03;
        osc.frequency.setValueAtTime(140 + Math.random() * 180, startTime);
        osc.frequency.exponentialRampToValueAtTime(45, startTime + 0.04);
        gain.gain.setValueAtTime(soundVolume * 0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.05);
      }

      const clackOsc = ctx.createOscillator();
      const clackGain = ctx.createGain();
      clackOsc.type = "sine";
      const finishTime = now + 0.65;
      clackOsc.frequency.setValueAtTime(280, finishTime);
      clackOsc.frequency.exponentialRampToValueAtTime(60, finishTime + 0.09);
      clackGain.gain.setValueAtTime(soundVolume * 0.55, finishTime);
      clackGain.gain.exponentialRampToValueAtTime(0.001, finishTime + 0.09);
      clackOsc.connect(clackGain);
      clackGain.connect(ctx.destination);
      clackOsc.start(finishTime);
      clackOsc.stop(finishTime + 0.1);
    } catch (e) {
      console.error(e);
    }
  };

  const totalAllocated =
    Number(cocStats.str) +
    Number(cocStats.con) +
    Number(cocStats.siz) +
    Number(cocStats.dex) +
    Number(cocStats.app) +
    Number(cocStats.int) +
    Number(cocStats.pow) +
    Number(cocStats.edu);
  const remainingPoints = 460 - totalAllocated;

  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);

  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0";
  let derivedBuild = 0;
  if (strPlusSiz <= 64) { derivedDb = "-2"; derivedBuild = -2; }
  else if (strPlusSiz <= 84) { derivedDb = "-1"; derivedBuild = -1; }
  else if (strPlusSiz <= 124) { derivedDb = "0"; derivedBuild = 0; }
  else if (strPlusSiz <= 164) { derivedDb = "+1D4"; derivedBuild = 1; }
  else { derivedDb = "+1D6"; derivedBuild = 2; }

  useEffect(() => {
    const saved = localStorage.getItem("rp_hub_sessions");
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);

    const savedPalette = localStorage.getItem("rp_hub_palette");
    if (savedPalette) setCurrentPalette(savedPalette);

    const savedDark = localStorage.getItem("rp_hub_darkmode");
    if (savedDark !== null) setIsDarkMode(savedDark === "true");

    const savedVol = localStorage.getItem("rp_hub_sound_vol");
    if (savedVol !== null) setSoundVolume(Number(savedVol));

    const savedAnim = localStorage.getItem("rp_hub_anim");
    if (savedAnim !== null) setAnimationEnabled(savedAnim === "true");

    const savedSugg = localStorage.getItem("rp_hub_suggestions_enabled");
    if (savedSugg !== null) setSuggestionsEnabled(savedSugg === "true");

    const todayStr = new Date().toISOString().slice(0, 10);
    const savedUsage = localStorage.getItem("rp_hub_api_usage");
    if (savedUsage) {
      const parsed = JSON.parse(savedUsage);
      if (parsed.date === todayStr) {
        setApiUsage(parsed);
      } else {
        const fresh = { date: todayStr, dailyRequests: 0, totalTokens: 0, lastPromptTokens: 0, lastResponseTokens: 0 };
        setApiUsage(fresh);
        localStorage.setItem("rp_hub_api_usage", JSON.stringify(fresh));
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions));
  }, [sessions, isLoaded]);

  const handleToggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    localStorage.setItem("rp_hub_darkmode", nextVal.toString());
  };

  const handleSelectPalette = (pKey) => {
    setCurrentPalette(pKey);
    localStorage.setItem("rp_hub_palette", pKey);
  };

  const handleSaveVolume = (vol) => {
    setSoundVolume(vol);
    localStorage.setItem("rp_hub_sound_vol", vol.toString());
  };

  const handleSaveAnim = (enabled) => {
    setAnimationEnabled(enabled);
    localStorage.setItem("rp_hub_anim", enabled.toString());
  };

  const handleSaveSuggestions = (enabled) => {
    setSuggestionsEnabled(enabled);
    localStorage.setItem("rp_hub_suggestions_enabled", enabled.toString());
  };

  const recordApiCall = (usage) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setApiUsage((prev) => {
      const isToday = prev.date === todayStr;
      const newDaily = (isToday ? prev.dailyRequests : 0) + 1;
      const promptT = usage?.promptTokenCount || 0;
      const respT = usage?.candidatesTokenCount || 0;
      const totalT = (isToday ? prev.totalTokens : 0) + (usage?.totalTokenCount || 0);

      const updated = {
        date: todayStr,
        dailyRequests: newDaily,
        totalTokens: totalT,
        lastPromptTokens: promptT,
        lastResponseTokens: respT,
      };
      localStorage.setItem("rp_hub_api_usage", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateManualApiCount = () => {
    const num = parseInt(manualCountInput, 10);
    if (isNaN(num) || num < 0) return alert("올바른 숫자를 입력하세요.");
    setApiUsage((prev) => {
      const updated = { ...prev, dailyRequests: num };
      localStorage.setItem("rp_hub_api_usage", JSON.stringify(updated));
      return updated;
    });
    setManualCountInput("");
    alert(`오늘 API 호출 횟수가 ${num}회로 보정되었습니다.`);
  };

  // 클리셰 무작위 조합 생성기
  const handleProceduralGenerate = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (wizardMode === "coc") {
      const pool = clichesPool.coc;
      const name = pick(pool.names);
      const jobObj = pick(pool.jobs);
      const place = pick(pool.places);
      const n1 = pick(pool.npc1);
      const n2 = pick(pool.npc2);
      const evt = pick(pool.events);

      setCharName(name);
      setCharJob(jobObj.job);
      setCharAge(String(Math.floor(Math.random() * 15) + 22));
      setCharGender("여성");
      setCharBackground(`${jobObj.bg} 품에는 [${jobObj.item}]을(를) 소지하고 있다.`);
      setScenarioInput(`${place}. ${name}은(는) 숨겨진 진상을 조사하기 위해 도착했다. 곁에는 ${n1.title} '${n1.name}'(${n1.trait})과(와), ${n2.title} '${n2.name}'(${n2.trait})이(가) 동행 중이다. 자정이 지난 시각, ${evt}`);
      setCocStats(generateRandomCocStats());
    } else {
      const picked = pick(clichesPool.d20);
      setCharName(picked.name);
      setCharJob(picked.job);
      setCharAge(picked.age);
      setCharGender("여성");
      setCharBackground(`${picked.bg} 소지품: ${picked.items}`);
      setScenarioInput(picked.scenario);
    }
  };

  // AI 즉석 신규 생성
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    const prompt = `당신은 흥미진진한 이야기를 엮어내는 노련한 TRPG 마스터입니다. 
${wizardMode === "coc" ? "크툴루의 부름(CoC 7판)" : "자유 서사(1D20)"} 룰에 쓸 매력적인 캐릭터와 몰입감 높은 시나리오 도입부를 작성하세요.
절대로 장르 말머리(예: [다크 판타지])를 붙이지 마십시오.

반드시 아래 JSON 포맷으로만 응답하세요:
{
  "name": "캐릭터 이름",
  "job": "직업",
  "age": "24",
  "gender": "여성",
  "background": "캐릭터의 배경 설정과 소지품 3가지",
  "scenario": "장소와 상황 묘사, 매력적인 동행 여성 인물 2명과의 미묘한 관계성, 첫 장면에 터진 위기 사건을 포함한 3~4문장의 소설 지문 도입부"
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
        if (wizardMode === "coc") setCocStats(generateRandomCocStats());
      } else {
        handleProceduralGenerate();
      }
    } catch (e) {
      handleProceduralGenerate();
    } finally {
      setIsAiGenerating(false);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const exportSaveFile = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TRPG_세이브백업_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSaveFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setSessions(imported);
          alert("세이브 데이터가 복원되었습니다!");
        } else {
          alert("올바른 세이브 파일이 아닙니다.");
        }
      } catch (err) {
        alert("파일 복원 실패: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("이 세션을 삭제하시겠습니까?")) return;
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) setActiveSessionId(null);
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
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(" ");
          extractedText += `[${i}페이지]\n${strings}\n\n`;
        }

        setScenarioInput(extractedText.trim());
      } catch (err) {
        alert("PDF 읽기 실패: " + err.message);
      } finally {
        setIsPdfLoading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setScenarioInput(event.target.result);
      reader.readAsText(file, "UTF-8");
    }
  };

  const getInitialItems = (bgText) => {
    const defaultList = [
      { name: "황동 돋보기", desc: "오컬트 문양과 미세한 필적을 확대해 살피는 도구" },
      { name: "가죽 수첩", desc: "고대 상형문자와 단서가 빼곡히 적힌 수첩" },
      { name: "은제 만년필 나이프", desc: "만년필 모양 속에 숨겨진 호신용 단도" },
    ];
    if (!bgText) return defaultList;

    const items = [];
    const keywords = [
      { key: "돋보기", name: "황동 돋보기", desc: "오컬트 문양과 미세한 필적을 살피는 도구" },
      { key: "수첩", name: "가죽 수첩", desc: "단서와 기록이 빼곡히 적힌 수첩" },
      { key: "만년필", name: "마력 만년필", desc: "마력을 각인할 수 있는 정밀 만년필" },
      { key: "권총", name: "콜트 32구경 권총", desc: "호신용 소형 리볼버 권총" },
      { key: "철사", name: "잠금해제용 철사 세트", desc: "자물쇠를 해제할 수 있는 도구" },
      { key: "카메라", name: "소형 필름 카메라", desc: "현장의 결정적 단서를 기록하는 카메라" },
      { key: "녹음기", name: "만년필형 소형 녹음기", desc: "음성을 기록하는 도구" },
      { key: "붕대", name: "응급 압박 붕대", desc: "지혈 및 부상 처치용 붕대" },
      { key: "나침반", name: "회중시계형 정밀 나침반", desc: "방향과 방위를 측정하는 도구" },
      { key: "손전등", name: "소형 손전등", desc: "어둠 속을 밝히는 도구" },
      { key: "은검", name: "서약의 은검", desc: "호위의 맹세가 깃든 날카로운 직검" },
      { key: "단도", name: "은제 단도", desc: "호신용으로 은밀히 숨겨둔 단도" },
      { key: "반지", name: "가문의 인장 반지", desc: "신분을 증명하고 마력을 품은 반지" },
      { key: "부채", name: "철골 부채", desc: "날카로운 살이 숨겨진 무도회용 부채" },
      { key: "안정제", name: "가이딩 안정제 키트", desc: "폭주하는 파동을 가라앉히는 주사기" },
      { key: "테이저", name: "특수 테이저건", desc: "순간적으로 대상을 제압하는 전기 충격기" },
      { key: "샷건", name: "개조 샷건", desc: "근접전에서 막강한 화력을 자랑하는 총기" },
    ];

    keywords.forEach((k) => {
      if (bgText.includes(k.key) && !items.some((it) => it.name === k.name)) {
        items.push({ name: k.name, desc: k.desc });
      }
    });

    return items.length > 0 ? items : defaultList;
  };

  const executeExport = () => {
    if (!activeSession) return;
    const session = activeSession;
    let exportText = "";

    if (exportFormat === "md") {
      exportText += `# ${session.title}\n\n`;
      exportText += `- **규칙**: ${session.ruleMode === "coc" ? "크툴루의 부름 7판" : "1D20 자유 서사"}\n`;
      exportText += `- **관계성 지향**: ${session.preference || "지정 없음"}\n`;
      exportText += `- **탐사자**: ${session.sheet.name} (${session.sheet.job || "조사원"})\n`;
      exportText += `- **내보낸 날짜**: ${new Date().toLocaleString()}\n\n---\n\n`;

      session.messages.forEach((m) => {
        const isRoll = m.text.includes("[🎲 시스템 공인 주사위 판정");
        if (exportScope === "storyOnly" && isRoll) return;

        if (m.role === "user") {
          exportText += isRoll
            ? `> **${m.text}**\n\n`
            : `### 👤 ${session.sheet.name}\n${m.text}\n\n`;
        } else {
          exportText += `### 📜 수호자(Keeper)\n${m.text}\n\n`;
        }
      });
    } else {
      exportText += `=========================================\n`;
      exportText += `  TRPG 세션 대화록: ${session.title}\n`;
      exportText += `  규칙: ${session.ruleMode === "coc" ? "크툴루의 부름 7판" : "1D20 자유 서사"}\n`;
      exportText += `  관계성 지향: ${session.preference || "지정 없음"}\n`;
      exportText += `  탐사자: ${session.sheet.name} | 일시: ${new Date().toLocaleString()}\n`;
      exportText += `=========================================\n\n`;

      session.messages.forEach((m) => {
        const isRoll = m.text.includes("[🎲 시스템 공인 주사위 판정");
        if (exportScope === "storyOnly" && isRoll) return;

        const sender = m.role === "user" ? (isRoll ? "[시스템 판정]" : `[${session.sheet.name}]`) : "[수호자]";
        exportText += `${sender}\n${m.text}\n\n-----------------------------------------\n\n`;
      });
    }

    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${session.title.replace(/\s+/g, "_")}_대화록.${exportFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const startNewSession = async () => {
    const isCoc = wizardMode === "coc";
    const sessionTitle = charName
      ? `${charName}의 이야기`
      : uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : isCoc
      ? "새 CoC 조사"
      : "새 1D20 서사";

    const initialItems = getInitialItems(charBackground);

    const initialSheet = isCoc
      ? {
          name: charName || "탐사자",
          job: charJob || "조사원",
          age: charAge,
          gender: charGender,
          background: charBackground,
          hp: derivedHp,
          maxHp: derivedHp,
          mp: derivedMp,
          maxMp: derivedMp,
          san: derivedSan,
          maxSan: 99,
          luck: Number(cocStats.luck),
          db: derivedDb,
          build: derivedBuild,
          npcs: [],
          items: initialItems,
        }
      : {
          name: charName || "주인공",
          job: charJob,
          background: charBackground,
          hp: 20,
          maxHp: 20,
          npcs: [],
          items: initialItems,
        };

    const newId = Date.now();
    const newSession = {
      id: newId,
      title: sessionTitle,
      ruleMode: wizardMode,
      preference: playPreference,
      scenarioText: scenarioInput,
      sheet: initialSheet,
      messages: [],
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);
    setPendingCheck(null);
    setSuggestedActions([]);

    const openingPrompt = `[세션 시작: 시나리오 원문과 인물 설정, 그리고 지정된 서사/관계성 지침("${playPreference || "자연스러운 심리 묘사"}")을 깊이 있게 반영하여 첫 장면의 서막을 여십시오. 
- 메타 발언, 챗봇 인사말, 본문 객관식 번호 선택지를 일체 배제하십시오.
- 공간의 분위기와 날씨, 주인공이 마주한 위기, 함께 있는 인물들의 표정과 미묘한 감정 기류를 생생하게 묘사하십시오.]`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: openingPrompt }],
          scenarioText: scenarioInput,
          playerSheet: initialSheet,
          ruleMode: wizardMode,
          playPreference: playPreference,
        }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      let rawText = data.text || "서막을 불러오지 못했습니다.";
      let updatedSheet = { ...initialSheet };

      const suggMatch = rawText.match(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s);
      if (suggMatch) {
        try {
          setSuggestedActions(JSON.parse(suggMatch[1]));
        } catch (e) {
          console.error(e);
        }
        rawText = rawText.replace(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s, "").trim();
      }

      const checkMatch = rawText.match(/<!--CHECK:\s*({.*?})-->/s);
      if (checkMatch) {
        try {
          setPendingCheck(JSON.parse(checkMatch[1]));
        } catch (e) {
          console.error(e);
        }
        rawText = rawText.replace(/<!--CHECK:\s*({.*?})-->/s, "").trim();
      }

      const statusMatch = rawText.match(/<!--STATUS:\s*({.*?})-->/s);
      if (statusMatch) {
        try {
          const parsed = JSON.parse(statusMatch[1]);
          if (parsed.hp !== undefined) updatedSheet.hp = parsed.hp;
          if (parsed.san !== undefined) updatedSheet.san = parsed.san;
          if (parsed.luck !== undefined) updatedSheet.luck = parsed.luck;
          if (parsed.npcs) updatedSheet.npcs = parsed.npcs;
          if (parsed.items) updatedSheet.items = parsed.items;
        } catch (e) {
          console.error(e);
        }
        rawText = rawText.replace(/<!--STATUS:\s*({.*?})-->/s, "").trim();
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === newId
            ? { ...s, sheet: updatedSheet, messages: [{ role: "model", text: rawText }] }
            : s
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;

    const updatedMessages = [...activeSession.messages, { role: "user", text: textToSend }];
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages } : s))
    );
    setIsLoading(true);
    setSuggestedActions([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          scenarioText: activeSession.scenarioText,
          playerSheet: activeSession.sheet,
          ruleMode: activeSession.ruleMode,
          playPreference: activeSession.preference,
        }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      if (!response.ok || !data.text) {
        alert(`마스터 응답 에러: ${data.error || "빈 응답"}`);
        setIsLoading(false);
        return;
      }

      let rawText = data.text;
      let newSheet = { ...activeSession.sheet };

      const suggMatch = rawText.match(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s);
      if (suggMatch) {
        try {
          setSuggestedActions(JSON.parse(suggMatch[1]));
        } catch (e) {
          console.error(e);
        }
        rawText = rawText.replace(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s, "").trim();
      }

      const checkMatch = rawText.match(/<!--CHECK:\s*({.*?})-->/s);
      if (checkMatch) {
        try {
          setPendingCheck(JSON.parse(checkMatch[1]));
        } catch (e) {
          console.error(e);
        }
        rawText = rawText.replace(/<!--CHECK:\s*({.*?})-->/s, "").trim();
      } else {
        setPendingCheck(null);
      }

      const statusMatch = rawText.match(/<!--STATUS:\s*({.*?})-->/s);
      if (statusMatch) {
        try {
          const parsed = JSON.parse(statusMatch[1]);
          if (parsed.hp !== undefined) newSheet.hp = parsed.hp;
          if (parsed.san !== undefined) newSheet.san = parsed.san;
          if (parsed.luck !== undefined) newSheet.luck = parsed.luck;
          if (parsed.npcs) newSheet.npcs = parsed.npcs;
          if (parsed.items) newSheet.items = parsed.items;
        } catch (e) {
          console.error(e);
        }
        rawText = rawText.replace(/<!--STATUS:\s*({.*?})-->/s, "").trim();
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, sheet: newSheet, messages: [...updatedMessages, { role: "model", text: rawText }] }
            : s
        )
      );
    } catch (err) {
      alert(`통신 오류: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    executeMessage(text);
  };

  const handleUseItem = (itemName) => {
    setInput((prev) => `품에서 [${itemName}]을(를) 꺼내어 ` + prev);
  };

  const rollDiceDirectly = (overrideTarget = null, reasonText = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true);
    setDiceResult(null);

    playDiceSound();

    let rollInterval = null;
    if (animationEnabled) {
      rollInterval = setInterval(() => {
        setRollingDisplayNum(Math.floor(Math.random() * (activeSession.ruleMode === "coc" ? 100 : 20)) + 1);
      }, 50);
    }

    const isCoc = activeSession.ruleMode === "coc";
    const targetVal = Number(overrideTarget !== null ? overrideTarget : isCoc ? targetStat : targetDc);

    setTimeout(() => {
      if (rollInterval) clearInterval(rollInterval);

      let rollFormatted = "";
      if (isCoc) {
        const roll = Math.floor(Math.random() * 100) + 1;
        let outcome = "";

        if (roll === 1) outcome = "대성공 (Critical)";
        else if (roll <= Math.floor(targetVal / 5)) outcome = "극단적 성공 (Extreme)";
        else if (roll <= Math.floor(targetVal / 2)) outcome = "어려운 성공 (Hard)";
        else if (roll <= targetVal) outcome = "보통 성공 (Regular)";
        else if (roll >= 96 && targetVal < 50) outcome = "대실패 (Fumble)";
        else if (roll === 100) outcome = "대실패 (Fumble)";
        else outcome = "실패 (Failure)";

        setDiceResult({ roll, outcome, target: targetVal, type: "1D100" });
        rollFormatted = `[🎲 시스템 공인 주사위 판정: 1D100 결과 ${roll} / 목표치: ${targetVal}${
          reasonText ? ` (${reasonText})` : ""
        } ➔ 결과: ${outcome}]`;
      } else {
        const roll = Math.floor(Math.random() * 20) + 1;
        let outcome = "";

        if (roll === 20) outcome = "대성공 (Natural 20)";
        else if (roll === 1) outcome = "대실패 (Natural 1)";
        else if (roll >= targetVal) outcome = "성공";
        else outcome = "실패";

        setDiceResult({ roll, outcome, target: targetVal, type: "1D20" });
        rollFormatted = `[🎲 시스템 공인 주사위 판정: 1D20 결과 ${roll} / DC ${targetVal}${
          reasonText ? ` (${reasonText})` : ""
        } ➔ 결과: ${outcome}]`;
      }

      setIsRolling(false);
      setPendingCheck(null);
      executeMessage(rollFormatted);
    }, animationEnabled ? 800 : 200);
  };

  const quotaPercentage = Math.min(100, Math.round((apiUsage.dailyRequests / 1500) * 100));

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      <style>{`
        @keyframes diceTumble {
          0% { transform: rotate(0deg) scale(0.85); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .anim-dice-rolling {
          animation: diceTumble 0.35s infinite linear;
        }
      `}</style>

      {/* 1. 좌측 시나리오 목록 */}
      <div
        style={{
          width: isSidebarOpen ? "255px" : "0px",
          minWidth: isSidebarOpen ? "255px" : "0px",
          transition: "width 0.2s ease",
          overflow: "hidden",
          backgroundColor: theme.sidebar,
          borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "12px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveSessionId(null)}
            style={{ flex: 1, padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            + 새 시나리오
          </button>
          <button
            onClick={handleToggleDarkMode}
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "1rem" }}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: `1px solid ${theme.border}`,
                backgroundColor: activeSessionId === s.id ? theme.panel : "transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "6px" }}>
                <div style={{ fontWeight: "bold", fontSize: "0.86rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>
                  {s.ruleMode === "coc" ? "CoC 7판 정규" : "1D20 자유 서사"}
                </div>
              </div>
              <button
                onClick={(e) => deleteSession(s.id, e)}
                title="삭제"
                style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px", fontSize: "0.9rem" }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
          {activeSession && (
            <button
              onClick={() => setShowExportModal(true)}
              style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              📥 대화록 내보내기
            </button>
          )}

          <button
            onClick={() => setShowSettingsModal(true)}
            style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            ⚙️ 설정
          </button>
        </div>
      </div>

      {/* 2. 중앙 메인 뷰 */}
      <div style={{ flex: 1, minWidth: "320px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {!activeSession ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "30px 25px 60px 25px", maxWidth: "680px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  title={isSidebarOpen ? "사이드바 접기" : "사이드바 펼치기"}
                  style={{ padding: "6px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" }}
                >
                  {isSidebarOpen ? "◀" : "▶"}
                </button>
                <h2 style={{ margin: 0, fontSize: "1.4rem" }}>새로운 세션 구성</h2>
              </div>

              {/* 듀얼 생성 버튼 */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={handleProceduralGenerate}
                  style={{ padding: "7px 11px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}
                >
                  🎲 무작위 조합 생성
                </button>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating}
                  style={{ padding: "7px 11px", backgroundColor: theme.accent, border: "none", color: "#fff", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}
                >
                  {isAiGenerating ? "집필 중..." : "✨ AI 즉석 생성"}
                </button>
              </div>
            </div>

            {/* 진행 룰 선택 (깔끔한 문구로 개편) */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>진행 룰 선택</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setWizardMode("d20")}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `2px solid ${wizardMode === "d20" ? theme.accent : theme.border}`, backgroundColor: wizardMode === "d20" ? theme.panel : "transparent", color: theme.text, cursor: "pointer" }}
                >
                  <strong>1D20 자유 서사</strong>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>자유 샌드박스 서사 / 1D20 룰</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWizardMode("coc")}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `2px solid ${wizardMode === "coc" ? theme.danger : theme.border}`, backgroundColor: wizardMode === "coc" ? theme.panel : "transparent", color: theme.text, cursor: "pointer" }}
                >
                  <strong>CoC 크툴루 7판</strong>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>크툴루의 부름 정규 룰 / 1D100</div>
                </button>
              </div>
            </div>

            {/* 서사 톤 & 관계성 지향 */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.accent }}>🎭 서사 톤 & 관계성 지향 (선택)</span>
                <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>원하는 분위기/관계 지향을 자유롭게 입력</span>
              </div>

              {/* 관계 지향 미니 칩 */}
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: theme.textMuted, marginRight: "3px" }}>성향 태그:</span>
                {["GL", "BL", "HL", "논로맨스"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPlayPreference((prev) => (prev ? `${type} 지향. ${prev}` : `${type} 지향.`))}
                    style={{ padding: "3px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.72rem", cursor: "pointer", fontWeight: "bold" }}
                  >
                    +{type}
                  </button>
                ))}
              </div>

              {/* 프리셋 버튼 */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { label: "🖤 애증 & 집착의 텐션", text: "상호 독점욕과 집착, 팽팽한 신경전과 애증이 교차하는 위태로운 서사." },
                  { label: "🤝 쌍방 구원 & 깊은 신뢰", text: "위기 속에서 서로에게 유일한 안식처가 되어주는 굳건한 신뢰와 쌍방 구원 서사." },
                  { label: "🥀 위태롭고 서정적인 감정선", text: "상실과 결핍 속에서 은밀하게 피어나는 서정적이고 섬세한 감정선." },
                  { label: "⚔️ 하드보일드 & 생존 중심", text: "감정적 교류는 절제하며 등을 맞대고 살아남는 거칠고 묵직한 서사." },
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPlayPreference(tag.text)}
                    style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.74rem", cursor: "pointer" }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              <textarea
                value={playPreference}
                onChange={(e) => setPlayPreference(e.target.value)}
                placeholder="예: 애증 혐관 텐션, 아카데미 라이벌, 북부대공 정략결혼, 쌍방 구원 등 원하는 설정을 자유롭게 적어주세요."
                style={{ width: "100%", height: "65px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box", fontSize: "0.82rem" }}
              />
            </div>

            {/* 시나리오 등록 */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>📁 시나리오 문서 등록 (.pdf, .txt, .md 지원)</span>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                style={{ display: "block", width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem", cursor: "pointer", boxSizing: "border-box" }}
              />
              {isPdfLoading && <div style={{ fontSize: "0.78rem", color: theme.warning }}>⏳ PDF 문서의 본문 텍스트를 추출하는 중입니다...</div>}
              {uploadedFileName && !isPdfLoading && (
                <div style={{ fontSize: "0.75rem", color: theme.success }}>✓ 본문이 로드되었습니다: {uploadedFileName}</div>
              )}

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "0.8rem", color: theme.textMuted }}>시나리오 내용 미리보기 / 직접 작성</label>
                <textarea
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  placeholder="파일을 선택하거나 상단의 [🎲 무작위 조합 생성] 버튼을 누르면 내용이 채워집니다."
                  style={{ width: "100%", height: "85px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* 캐릭터 정보 */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>내 캐릭터 정보</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 0.7fr 0.7fr", gap: "8px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>이름</label>
                  <input
                    type="text"
                    value={charName}
                    onChange={(e) => setCharName(e.target.value)}
                    placeholder="사반"
                    style={{ width: "100%", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>직업</label>
                  <input
                    type="text"
                    value={charJob}
                    onChange={(e) => setCharJob(e.target.value)}
                    placeholder="고서적 감정사"
                    style={{ width: "100%", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>나이</label>
                  <input
                    type="text"
                    value={charAge}
                    onChange={(e) => setCharAge(e.target.value)}
                    style={{ width: "100%", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>성별</label>
                  <input
                    type="text"
                    value={charGender}
                    onChange={(e) => setCharGender(e.target.value)}
                    placeholder="여성"
                    style={{ width: "100%", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "0.75rem", color: theme.textMuted }}>캐릭터 상세 설정 및 백스토리</label>
                <textarea
                  value={charBackground}
                  onChange={(e) => setCharBackground(e.target.value)}
                  placeholder="성격, 비밀, 소지품 등을 적어주세요. 소지품 내용(돋보기, 은검 등)은 인벤토리에 자동 등록됩니다."
                  style={{ width: "100%", height: "70px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* CoC 특성치 */}
            {wizardMode === "coc" && (
              <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: theme.danger }}>CoC 7판 특성치 배분</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setCocStats(generateRandomCocStats())}
                      style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      🎲 특성치 주사위
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGuideModal(true)}
                      style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      📖 가이드
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "0.8rem", display: "flex", justifyContent: "space-between", padding: "6px 10px", backgroundColor: theme.panelAlt, borderRadius: "6px" }}>
                  <span>포인트 풀: <strong>460 pt</strong></span>
                  <span style={{ color: remainingPoints < 0 ? theme.danger : theme.success, fontWeight: "bold" }}>
                    잔여: {remainingPoints} pt {remainingPoints < 0 ? "(초과)" : ""}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {[
                    { key: "str", label: "근력(STR)" },
                    { key: "con", label: "건강(CON)" },
                    { key: "siz", label: "크기(SIZ)" },
                    { key: "dex", label: "민첩(DEX)" },
                    { key: "app", label: "외모(APP)" },
                    { key: "int", label: "지능(INT)" },
                    { key: "pow", label: "정신력(POW)" },
                    { key: "edu", label: "교육(EDU)" },
                  ].map((stat) => (
                    <div key={stat.key}>
                      <label style={{ display: "block", fontSize: "0.7rem", color: theme.textMuted }}>{stat.label}</label>
                      <input
                        type="number"
                        min="15"
                        max="90"
                        value={cocStats[stat.key]}
                        onChange={(e) => setCocStats({ ...cocStats, [stat.key]: e.target.value })}
                        style={{ width: "100%", padding: "5px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ padding: "8px 10px", backgroundColor: theme.inputBg, borderRadius: "6px", fontSize: "0.76rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                  <div>행운: <input type="number" value={cocStats.luck} onChange={(e) => setCocStats({ ...cocStats, luck: e.target.value })} style={{ width: "40px", padding: "2px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                  <div>체력(HP): <strong>{derivedHp}</strong></div>
                  <div>마력(MP): <strong>{derivedMp}</strong></div>
                  <div>이성(SAN): <strong>{derivedSan}</strong></div>
                  <div>DB/체구: <strong>{derivedDb} / {derivedBuild}</strong></div>
                </div>
              </div>
            )}

            <button
              onClick={startNewSession}
              disabled={isLoading || isPdfLoading || isAiGenerating}
              style={{ padding: "14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
            >
              {isLoading ? "키퍼가 서막을 여는 중..." : "이야기 시작하기"}
            </button>
          </div>
        ) : (
          /* 플레이 룸 */
          <>
            <div style={{ padding: "8px 15px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  title={isSidebarOpen ? "사이드바 접기" : "사이드바 펼치기"}
                  style={{ padding: "5px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  {isSidebarOpen ? "◀" : "▶"}
                </button>
                <span style={{ fontWeight: "bold", fontSize: "0.92rem", wordBreak: "keep-all" }}>{activeSession.title}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.82rem", color: theme.textMuted }}>{activeSession.ruleMode === "coc" ? "임의 수치:" : "임의 DC:"}</span>
                <input
                  type="number"
                  value={activeSession.ruleMode === "coc" ? targetStat : targetDc}
                  onChange={(e) => activeSession.ruleMode === "coc" ? setTargetStat(e.target.value) : setTargetDc(e.target.value)}
                  style={{ width: "45px", padding: "4px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "4px" }}
                />
                <button
                  onClick={() => rollDiceDirectly()}
                  disabled={isRolling || isLoading}
                  style={{ padding: "5px 12px", backgroundColor: activeSession.ruleMode === "coc" ? theme.danger : theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}
                >
                  🎲 {activeSession.ruleMode === "coc" ? "1D100 판정" : "1D20 판정"}
                </button>
                <button
                  onClick={() => setIsSheetOpen(!isSheetOpen)}
                  style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  {isSheetOpen ? "시트 닫기 ▶" : "◀ 시트 열기"}
                </button>
              </div>
            </div>

            {/* 판정 요구 알림 배너 */}
            {pendingCheck && (
              <div style={{ backgroundColor: "#3b2611", borderBottom: `1px solid ${theme.warning}`, padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ fontSize: "0.85rem", color: "#fbd38d" }}>
                  ⚠️ <strong>키퍼의 판정 요구:</strong> [{pendingCheck.stat}] (기준치: {pendingCheck.target}) — {pendingCheck.desc}
                </div>
                <button
                  onClick={() => rollDiceDirectly(pendingCheck.target, `${pendingCheck.stat} 판정: ${pendingCheck.desc}`)}
                  disabled={isRolling || isLoading}
                  style={{ padding: "6px 14px", backgroundColor: theme.warning, color: "#1a1005", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  🎲 [{pendingCheck.stat}] 판정 주사위 굴리기
                </button>
              </div>
            )}

            {/* 주사위 판정 결과 */}
            {diceResult && (
              <div style={{ backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}`, padding: "6px 15px", fontSize: "0.82rem", display: "flex", justifyContent: "space-between" }}>
                <span>🎲 {diceResult.type} 결과: <strong>{diceResult.roll}</strong> (기준: {diceResult.target})</span>
                <span style={{ color: diceResult.outcome.includes("성공") ? theme.success : theme.danger, fontWeight: "bold" }}>{diceResult.outcome}</span>
              </div>
            )}

            {/* 대화 히스토리 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
              {isRolling && animationEnabled && (
                <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 50, backgroundColor: theme.panel, border: `2px solid ${theme.accent}`, borderRadius: "12px", padding: "15px 25px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                  <span className="anim-dice-rolling" style={{ fontSize: "2rem", display: "inline-block" }}>🎲</span>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>운명의 주사위를 굴리는 중...</div>
                    <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: theme.accent }}>{rollingDisplayNum}</div>
                  </div>
                </div>
              )}

              {activeSession.messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: m.text.includes("[🎲 시스템 공인 주사위 판정")
                      ? "rgba(122, 162, 247, 0.15)"
                      : m.role === "user"
                      ? theme.bubbleUser
                      : theme.bubbleAi,
                    color: m.role === "user" && !m.text.includes("[🎲 시스템 공인 주사위 판정") ? "#ffffff" : theme.text,
                    border: m.text.includes("[🎲 시스템 공인 주사위 판정")
                      ? `1px solid ${theme.accent}`
                      : m.role === "model"
                      ? `1px solid ${theme.border}`
                      : "none",
                    padding: "13px 17px",
                    borderRadius: "12px",
                    maxWidth: "85%",
                    lineHeight: "1.7",
                    whiteSpace: "pre-wrap",
                    wordBreak: "keep-all",
                  }}
                >
                  {m.text}
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.88rem", padding: "10px" }}>마스터가 서사를 구성하는 중...</div>}
            </div>

            {/* AI 답변 제안 칩 */}
            {suggestionsEnabled && suggestedActions.length > 0 && !isLoading && (
              <div style={{ padding: "8px 15px", backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px", overflowX: "auto", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "0.76rem", color: theme.accent, display: "flex", alignItems: "center", fontWeight: "bold" }}>
                  💡 추천 행동:
                </span>
                {suggestedActions.map((sugg, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setInput(sugg)}
                    style={{
                      padding: "5px 11px",
                      backgroundColor: theme.panelAlt,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "16px",
                      color: theme.text,
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease",
                      flexShrink: 0,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = theme.accent)}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = theme.border)}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            )}

            {/* 입력창 */}
            <div style={{ padding: "12px 15px", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "10px" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="지문이나 대사를 입력하세요 (위 제안 칩을 클릭해 바로 채울 수도 있습니다)..."
                style={{ flex: 1, height: "45px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px", resize: "none", outline: "none", boxSizing: "border-box" }}
              />
              <button onClick={sendMessage} disabled={isLoading} style={{ padding: "0 18px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                전송
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 상태창 */}
      {activeSession && (
        <div
          style={{
            width: isSheetOpen ? "255px" : "0px",
            minWidth: isSheetOpen ? "255px" : "0px",
            transition: "width 0.2s ease",
            overflow: "hidden",
            backgroundColor: theme.sidebar,
            borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            whiteSpace: "normal",
            wordBreak: "keep-all",
          }}
        >
          <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", width: "255px", boxSizing: "border-box" }}>
            {/* API 모니터링 */}
            <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: theme.accent }}>⚡ API 한도 (추정치)</span>
                <span style={{ fontSize: "0.68rem", padding: "1px 5px", backgroundColor: theme.panelAlt, borderRadius: "4px", color: theme.textMuted }}>Free Tier</span>
              </div>

              <div style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "3px" }}>
                  <span>오늘 호출 (RPD):</span>
                  <strong>{apiUsage.dailyRequests} / 1,500회</strong>
                </div>
                <div style={{ height: "6px", width: "100%", backgroundColor: theme.panelAlt, borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${quotaPercentage}%`,
                      backgroundColor: quotaPercentage > 85 ? theme.danger : quotaPercentage > 60 ? theme.warning : theme.success,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              <div style={{ fontSize: "0.7rem", color: theme.textMuted, display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>분당 속도 (RPM):</span>
                  <span>최대 15회 / 분</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>직전 토큰 (입/출력):</span>
                  <span>{apiUsage.lastPromptTokens} / {apiUsage.lastResponseTokens}</span>
                </div>
              </div>
            </div>

            {/* 관계성 성향 안내 */}
            {activeSession.preference && (
              <div style={{ fontSize: "0.75rem", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, padding: "8px", borderRadius: "6px", lineHeight: "1.35" }}>
                <strong style={{ color: theme.accent }}>🎭 관계성 지향:</strong>
                <div style={{ color: theme.textMuted, marginTop: "2px" }}>{activeSession.preference}</div>
              </div>
            )}

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            {/* 탐사자/캐릭터 정보 */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: theme.accent }}>캐릭터 정보</h4>
              <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>이름: <strong>{activeSession.sheet.name}</strong> ({activeSession.sheet.job || "모험가"})</div>
                <div>HP: <strong>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>
                {activeSession.ruleMode === "coc" && (
                  <>
                    <div>SAN: <strong>{activeSession.sheet.san} / 99</strong></div>
                    <div>MP: <strong>{activeSession.sheet.mp} / {activeSession.sheet.maxMp}</strong></div>
                    <div>LUCK: <strong>{activeSession.sheet.luck}</strong></div>
                    <div>DB/체구: <strong>{activeSession.sheet.db} / {activeSession.sheet.build}</strong></div>
                  </>
                )}
              </div>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            {/* 소지품 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "0.9rem", color: theme.accent }}>🎒 소지품 / 인벤토리</h4>
                <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>{(activeSession.sheet.items || []).length}개</span>
              </div>
              
              {(!activeSession.sheet.items || activeSession.sheet.items.length === 0) ? (
                <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>소지품이 비어 있습니다.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {activeSession.sheet.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "7px 9px", fontSize: "0.78rem" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <strong style={{ color: theme.text }}>{item.name}</strong>
                        <button
                          onClick={() => handleUseItem(item.name)}
                          style={{ padding: "2px 6px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.accent, borderRadius: "3px", cursor: "pointer", fontSize: "0.7rem" }}
                        >
                          사용
                        </button>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: theme.textMuted, lineHeight: "1.3" }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            {/* 호감도 */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: theme.accent }}>주변 인물 호감도</h4>
              {activeSession.sheet.npcs.length === 0 ? (
                <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>등장인물 없음</div>
              ) : (
                activeSession.sheet.npcs.map((npc, idx) => (
                  <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "8px", marginBottom: "8px", fontSize: "0.8rem" }}>
                    <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                      <span>{npc.name}</span>
                      <span style={{ color: theme.danger }}>♥ {npc.affection || 0}</span>
                    </div>
                    <div style={{ color: theme.textMuted, marginTop: "4px" }}>{npc.state || "평온"}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. 설정 & 세이브 백업 모달 */}
      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "470px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text, wordBreak: "keep-all" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>⚙️ 환경 설정</h3>
              <button onClick={() => setShowSettingsModal(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* AI 행동 제안 칩 토글 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>AI 답변 제안 칩 (3가지 선택지)</div>
                  <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>답변이 어려울 때 입력창 위에 제안 칩을 띄웁니다.</div>
                </div>
                <button
                  onClick={() => handleSaveSuggestions(!suggestionsEnabled)}
                  style={{ padding: "6px 14px", backgroundColor: suggestionsEnabled ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  {suggestionsEnabled ? "켜짐 (ON)" : "꺼짐 (OFF)"}
                </button>
              </div>

              {/* API 사용량 수동 보정 */}
              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px", color: theme.accent }}>⚡ API 사용량 수동 동기화</div>
                <div style={{ fontSize: "0.72rem", color: theme.textMuted, marginBottom: "8px" }}>
                  구글 콘솔의 실제 호출 횟수와 차이가 날 경우, 직접 숫자를 입력하여 게이지를 보정할 수 있습니다.
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="number"
                    value={manualCountInput}
                    onChange={(e) => setManualCountInput(e.target.value)}
                    placeholder={`현재 ${apiUsage.dailyRequests}회`}
                    style={{ flex: 1, padding: "6px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.8rem" }}
                  />
                  <button
                    onClick={handleUpdateManualApiCount}
                    style={{ padding: "6px 12px", backgroundColor: theme.accent, border: "none", color: "#fff", borderRadius: "4px", fontSize: "0.78rem", fontWeight: "bold", cursor: "pointer" }}
                  >
                    보정 적용
                  </button>
                </div>
              </div>

              {/* 세이브 백업 / 복원 */}
              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "6px", color: theme.accent }}>💾 세이브 데이터 백업 / 복원</label>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "10px" }}>
                  진행 중인 모든 시나리오와 캐릭터 정보를 PC에 JSON 파일로 다운로드하거나 복원합니다.
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={exportSaveFile}
                    style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}
                  >
                    📥 전체 세이브 백업
                  </button>
                  <label
                    style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold", textAlign: "center" }}
                  >
                    📤 백업 파일 복원
                    <input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} />
                  </label>
                </div>
              </div>

              {/* 팔레트 선택 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>테마 색상 팔레트</label>
                  <span style={{ fontSize: "0.75rem", color: theme.accent }}>현재 모드: {isDarkMode ? "🌙 나이트" : "☀️ 데이(라이트)"}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {[
                    { id: "midnight", label: "미드나잇 블루" },
                    { id: "abyss", label: "심연 어비스" },
                    { id: "sepia", label: "고서적 세피아" },
                    { id: "classic", label: "클래식 모던" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPalette(p.id)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: `2px solid ${currentPalette === p.id ? theme.accent : theme.border}`,
                        backgroundColor: currentPalette === p.id ? theme.panelAlt : "transparent",
                        color: theme.text,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 볼륨 조절 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>주사위 효과음 볼륨</label>
                  <span style={{ fontSize: "0.8rem", color: theme.accent }}>{Math.round(soundVolume * 100)}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => handleSaveVolume(Number(e.target.value))}
                    style={{ flex: 1, accentColor: theme.accent }}
                  />
                  <button
                    onClick={playDiceSound}
                    style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    🔊 테스트
                  </button>
                </div>
              </div>

              {/* 연출 효과 토글 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>주사위 굴림 연출 효과</div>
                  <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>주사위 회전 연출과 난수 롤링을 표시합니다.</div>
                </div>
                <button
                  onClick={() => handleSaveAnim(!animationEnabled)}
                  style={{ padding: "6px 14px", backgroundColor: animationEnabled ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  {animationEnabled ? "켜짐 (ON)" : "꺼짐 (OFF)"}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              style={{ marginTop: "24px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 5. 대화록 내보내기 모달 */}
      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "440px", padding: "22px", color: theme.text, wordBreak: "keep-all" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>📥 대화록 내보내기 옵션</h3>
              <button onClick={() => setShowExportModal(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "bold", marginBottom: "6px" }}>파일 형식 선택</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setExportFormat("txt")}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `2px solid ${exportFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: exportFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.82rem", cursor: "pointer" }}
                  >
                    일반 텍스트 (.txt)
                  </button>
                  <button
                    onClick={() => setExportFormat("md")}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `2px solid ${exportFormat === "md" ? theme.accent : theme.border}`, backgroundColor: exportFormat === "md" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.82rem", cursor: "pointer" }}
                  >
                    마크다운 (.md)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "bold", marginBottom: "6px" }}>내용 추출 범위</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setExportScope("all")}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `2px solid ${exportScope === "all" ? theme.accent : theme.border}`, backgroundColor: exportScope === "all" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.82rem", cursor: "pointer" }}
                  >
                    전체 로그 (주사위 판정 포함)
                  </button>
                  <button
                    onClick={() => setExportScope("storyOnly")}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `2px solid ${exportScope === "storyOnly" ? theme.accent : theme.border}`, backgroundColor: exportScope === "storyOnly" ? theme.panelAlt : "transparent", color: theme.text, fontSize: "0.82rem", cursor: "pointer" }}
                  >
                    소설 서사만 (주사위 제외)
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "22px" }}>
              <button
                onClick={() => setShowExportModal(false)}
                style={{ flex: 1, padding: "10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}
              >
                취소
              </button>
              <button
                onClick={executeExport}
                style={{ flex: 2, padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
              >
                파일 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CoC 룰 가이드 모달 */}
      {showGuideModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "520px", maxHeight: "80vh", overflowY: "auto", padding: "22px", color: theme.text, wordBreak: "keep-all" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, color: theme.danger }}>📖 CoC 7판 룰 & 캐릭터 가이드</h3>
              <button onClick={() => setShowGuideModal(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ fontSize: "0.85rem", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <strong>1. 특성치 배분</strong>
                <div>• 총 8대 특성치 합계: <strong>460 포인트</strong> 기본 한계</div>
                <div>• 성인 기준 평균치 50이며 범위는 15~90 사이로 설정합니다.</div>
              </div>
              <div>
                <strong>2. 성공 등급 (1D100)</strong>
                <div>• <strong>보통 성공:</strong> 판정치 이하</div>
                <div>• <strong>어려운 성공:</strong> 판정치의 1/2 이하</div>
                <div>• <strong>극단적 성공:</strong> 판정치의 1/5 이하</div>
                <div>• <strong>대성공:</strong> 01 / <strong>대실패:</strong> 96~100</div>
              </div>
              <div>
                <strong>3. 파생 수치 공식</strong>
                <div>• <strong>HP:</strong> (CON + SIZ) ÷ 10</div>
                <div>• <strong>MP:</strong> POW ÷ 5</div>
                <div>• <strong>초기 SAN:</strong> POW 수치와 동일</div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              style={{ marginTop: "18px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
