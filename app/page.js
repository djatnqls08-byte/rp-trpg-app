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

  // 효과음 및 연출
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [animationEnabled, setAnimationEnabled] = useState(true);

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

  // 서사 톤 & 관계성 성향 입력란 (깔끔한 기본 플레이스홀더 지원)
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

  // 추천 시나리오 & 캐릭터 랜덤 프리셋
  const randomPresets = {
    coc: [
      {
        name: "사반",
        job: "고서적 및 유물 감정사",
        age: "26",
        gender: "여성",
        background: "런던 뒷골목 고서점에서 금서와 유물을 감정하며 살아온 인물. 겉으로는 침착하지만 금기된 오컬트 지식과 수수께끼에 강하게 매혹된다. 품에는 황동 돋보기, 가죽 수첩, 은제 만년필 나이프를 소지하고 있다.",
        preference: "GL 지향. 상속녀 엘리제의 유약한 의존성과 경호원 유스티나의 과보호적 집착 사이의 미묘한 기류 중심.",
        stats: { str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 },
        scenario: "폭풍우와 짙은 안개로 고립된 해안 절벽의 빅토리아풍 고택 '블랙우드 저택'. 사반은 저택 서고에서 발견된 고대 양피지를 해독해 달라는 의뢰를 받고 도착했다. 저택에는 사반에게 깊은 호기심과 의존을 느끼는 은발의 상속녀 '엘리제'와, 그녀를 호위하며 사반을 매섭게 견제하면서도 독점욕을 드러내는 경호원 '유스티나'가 함께하고 있다. 자정 무렵, 2층 서재 문틈 사이로 유리창 깨지는 소리와 함께 기괴한 속삭임이 울려 퍼지며 검은 그림자가 액체처럼 흘러나온다."
      },
      {
        name: "비비안",
        job: "탐사 저널리스트",
        age: "28",
        gender: "여성",
        background: "아컴 가제트의 잠입 취재 전문 기자. 폐쇄 병동의 비밀 수용실과 연쇄 실종 사건을 파헤치고 있다. 품에는 소형 카메라, 압박 붕대, 만년필 녹음기를 소지하고 있다.",
        preference: "GL 지향. 수간호사 마가렛과의 서늘한 신경전, 의문의 환자 아이린의 은밀한 애착과 쌍방 구원 서사.",
        stats: { str: 35, con: 55, siz: 45, dex: 65, app: 65, int: 80, pow: 70, edu: 45, luck: 60 },
        scenario: "폭설로 외부와 완전히 차단된 아컴 시립 정신병원 지하 병동. 비밀을 알고 있는 냉철하고 엄격한 수간호사 '마가렛'과, 원장실의 열쇠를 쥐고 비비안에게 비정상적인 애착을 보이는 의문의 환자 '아이린'이 곁에 있다. 지하 독방 깊숙한 곳에서 인간의 언어가 아닌 둔탁한 긁는 소리가 벽을 타고 울리기 시작한다."
      },
      {
        name: "카밀라",
        job: "고고학 연구원",
        age: "27",
        gender: "여성",
        background: "왕립 발굴단의 현장 총괄. 모래 아래 파묻힌 잊혀진 신전을 조사하기 위해 위험을 감수한다. 품에는 제도용 나침반, 고대 상형문자 사전, 손전등을 소지하고 있다.",
        preference: "GL 지향. 귀족 후원자 베아트리스의 츤데레적 호감과 현지 길잡이 나디아의 맹목적인 충성심 사이의 감정선.",
        stats: { str: 50, con: 60, siz: 55, dex: 55, app: 50, int: 75, pow: 65, edu: 50, luck: 50 },
        scenario: "이집트 외곽의 검은 모래 언덕 밑 미지의 제단. 지진으로 무덤 입구가 무너지며 고립된 카밀라의 곁에는 귀족 출신의 까칠한 후원자 '베아트리스'와 신전의 금기를 두려워하면서도 카밀라를 과보호하는 현지인 길잡이 '나디아'가 위험한 신경전을 벌인다. 굳게 닫힌 석문 틈새로 푸른 인광이 새어 나오기 시작한다."
      }
    ],
    d20: [
      {
        name: "레니에",
        job: "방랑 검사",
        age: "25",
        gender: "여성",
        background: "왕국에서 추방된 근위대 출신의 검객. 마검에 깃든 저주의 속삭임을 억누르고 있다. 품에는 흑철 롱소드, 여행자 망토, 숫돌을 지니고 있다.",
        preference: "GL 판타지. 은둔 마녀 모르가나의 나른한 유혹과 옛 동료 성기사 클레어의 억눌린 애증 대립.",
        scenario: "끝없는 비가 내리는 버려진 요새 '카르코사'. 저주를 풀 단서를 찾아온 요새의 성소에서 매혹적인 미소로 레니에를 시험하는 은둔 마녀 '모르가나'와, 마녀를 처단하기 위해 추적해 온 레니에의 옛 동료이자 고지식한 성기사 '클레어'가 서로 무기를 겨눈 채 레니에의 선택을 요구한다."
      },
      {
        name: "시안",
        job: "블랙넷 브로커",
        age: "24",
        gender: "여성",
        background: "메가코프의 비밀 메모리 칩을 탈취해 도주 중인 해커. 신경 가속 사이버웨어를 장착했다. 품에는 해킹 덱, EMP 수류탄, 홀로그램 위장기를 지니고 있다.",
        preference: "사이버펑크 GL. 냉혹한 사이보그 집행관 이브의 집요한 추적과 신디케이트 보스 베로니카의 위험한 독점욕.",
        scenario: "비에 젖은 네온사인이 번쩍이는 슬럼가 지하 바 '글리치'. 메모리 칩의 보안 코드를 해독하려는 찰나, 시안을 생포하라는 명령을 받았지만 묘한 집착을 보이는 사이보그 집행관 '이브'와, 시안을 숨겨주는 대가로 영원한 복종을 요구하는 뒷골목 신디케이트 보스 '베로니카'가 동시에 나타난다."
      },
      {
        name: "알렉스",
        job: "함선 파일럿",
        age: "29",
        gender: "여성",
        background: "개조 수송선의 선장. 거칠지만 동료를 버리지 않는 신념이 있다. 품에는 플라즈마 토치, 가죽 재킷, 은하 성도 칩을 소지하고 있다.",
        preference: "SF 스페이스 오페라 GL. 망명 귀족 세레나와의 신분차 감정선과 헌신적인 수석 엔지니어 카라와의 유대감.",
        scenario: "버려진 군사 우주정거장의 잔해 속에서 정체불명의 외계 코어를 회수했다. 수송선 안에서 코어를 가문의 복권에 쓰려는 망명 귀족 '세레나'와, 코어의 위험성을 경고하며 알렉스의 안전만을 우선시하는 수석 엔지니어 '카라' 사이의 갈등이 임계점에 달한다."
      }
    ]
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

  // 로컬 스토리지 안전 불러오기
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

  // 모드별 랜덤 추천 로드
  const loadRandomScenario = () => {
    const modeKey = wizardMode === "coc" ? "coc" : "d20";
    const list = randomPresets[modeKey];
    const picked = list[Math.floor(Math.random() * list.length)];

    setCharName(picked.name);
    setCharJob(picked.job);
    setCharAge(picked.age);
    setCharGender(picked.gender);
    setCharBackground(picked.background);
    setScenarioInput(picked.scenario);
    if (picked.preference) setPlayPreference(picked.preference);

    if (modeKey === "coc" && picked.stats) {
      setCocStats({ ...picked.stats });
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
    if (bgText && bgText.includes("돋보기")) {
      return [
        { name: "황동 돋보기", desc: "오컬트 문양과 미세한 필적을 확대해 살피는 도구" },
        { name: "가죽 수첩", desc: "고대 상형문자와 단서가 빼곡히 적힌 수첩" },
        { name: "은제 만년필 나이프", desc: "만년필 모양 속에 숨겨진 호신용 단도" },
      ];
    }
    if (bgText && bgText.includes("카메라")) {
      return [
        { name: "소형 카메라", desc: "현장의 결정적 단서를 기록하는 필름 카메라" },
        { name: "만년필 녹음기", desc: "소리를 은밀히 담는 소형 녹음 도구" },
        { name: "압박 붕대", desc: "부상을 즉시 지혈할 수 있는 구급용 붕대" },
      ];
    }
    if (bgText && bgText.includes("나침반")) {
      return [
        { name: "제도용 나침반", desc: "방향과 방위를 정밀하게 측정하는 도구" },
        { name: "손전등", desc: "어둠 속 지하 유적을 밝히는 도구" },
        { name: "고대 상형문자 사전", desc: "잊혀진 문자를 번역하는 고서" },
      ];
    }
    if (bgText && bgText.includes("롱소드")) {
      return [
        { name: "흑철 롱소드", desc: "저주받은 마기가 서려 있는 날카로운 검" },
        { name: "여행자 망토", desc: "비바람과 시선을 차단하는 두터운 외투" },
        { name: "휴대용 숫돌", desc: "날을 예리하게 벼릴 수 있는 도구" },
      ];
    }
    if (bgText && bgText.includes("해킹")) {
      return [
        { name: "휴대용 해킹 덱", desc: "전자 잠금장치와 네트워크를 교란하는 단말기" },
        { name: "EMP 수류탄", desc: "기계 장치를 일시 무력화하는 소형 폭탄" },
        { name: "홀로그램 위장기", desc: "외모를 일시적으로 속이는 광학 장비" },
      ];
    }
    return [
      { name: "휴대용 라이터", desc: "어둠 속을 밝히거나 불을 지필 수 있는 금속 라이터" },
      { name: "가죽 지갑", desc: "신분증과 약간의 비상금이 들어 있는 지갑" },
    ];
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
      ? `${charName}의 여정`
      : uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : isCoc
      ? "새 CoC 조사"
      : "새 샌드박스 RP";

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

    const openingPrompt = `[세션 시작: 시나리오 원문과 인물 설정, 그리고 지정된 서사/관계성 지침("${playPreference || "자연스러운 심리 묘사"}")을 깊이 있게 반영하여 첫 장면의 서막을 여십시오. 
- 메타 발언, 챗봇 인사말, 객관식 번호 선택지를 일체 배제하십시오.
- 공간의 분위기와 날씨, 탐사자가 마주한 위기, 함께 있는 인물들의 표정과 미묘한 감정 기류를 생생하게 묘사하십시오.]`;

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

              <button
                type="button"
                onClick={loadRandomScenario}
                style={{
                  padding: "8px 12px",
                  backgroundColor: theme.panelAlt,
                  border: `1px solid ${theme.accent}`,
                  color: theme.accent,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                🎲 랜덤 추천 설정 ({wizardMode === "coc" ? "CoC" : "자유 서사"})
              </button>
            </div>

            {/* 진행 룰 선택 */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>진행 룰 선택</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setWizardMode("d20")}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `2px solid ${wizardMode === "d20" ? theme.accent : theme.border}`, backgroundColor: wizardMode === "d20" ? theme.panel : "transparent", color: theme.text, cursor: "pointer" }}
                >
                  <strong>1D20 자유 서사</strong>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>자유 샌드박스 / 직관적 DC 판정</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWizardMode("coc")}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `2px solid ${wizardMode === "coc" ? theme.danger : theme.border}`, backgroundColor: wizardMode === "coc" ? theme.panel : "transparent", color: theme.text, cursor: "pointer" }}
                >
                  <strong>CoC 1D100 정규 룰</strong>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>크툴루 7판 / SAN & 특성치 관리</div>
                </button>
              </div>
            </div>

            {/* 개편: 서사 톤 & 관계성 지향 (선택) */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.accent }}>🎭 서사 톤 & 관계성 지향 (선택)</span>
                <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>원하는 분위기/관계 지향을 자유롭게 입력</span>
              </div>

              {/* 상단: 관계 지향 미니 칩 (클릭 시 텍스트에 쏙 들어감) */}
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: theme.textMuted, marginRight: "3px" }}>성향 태그:</span>
                {["GL", "BL", "HL", "논로맨스"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPlayPreference((prev) => (prev ? `${type} 지향. ${prev}` : `${type} 지향.`))}
                    style={{
                      padding: "3px 8px",
                      backgroundColor: theme.panelAlt,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "4px",
                      color: theme.accent,
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    +{type}
                  </button>
                ))}
              </div>

              {/* 분위기 / 서사 클리셰 프리셋 버튼 */}
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
                    style={{
                      padding: "4px 8px",
                      backgroundColor: theme.panelAlt,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "4px",
                      color: theme.text,
                      fontSize: "0.74rem",
                      cursor: "pointer",
                    }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              <textarea
                value={playPreference}
                onChange={(e) => setPlayPreference(e.target.value)}
                placeholder="예: GL 지향, 애증 혐관 텐션, 쌍방 구원 서사, 불필요한 이성 로맨스 배제 등 자유롭게 적어주세요."
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
                  placeholder="파일을 선택하거나 상단의 [🎲 랜덤 추천 설정] 버튼을 누르면 내용이 채워집니다."
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
                  placeholder="성격, 비밀, 소지품 등을 적어주세요. 소지품 내용(돋보기, 롱소드 등)은 인벤토리에 자동 등록됩니다."
                  style={{ width: "100%", height: "70px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* CoC 특성치 */}
            {wizardMode === "coc" && (
              <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: theme.danger }}>CoC 7판 특성치 배분</span>
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(true)}
                    style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    📖 룰 가이드
                  </button>
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
              disabled={isLoading || isPdfLoading}
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
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.88rem", padding: "10px" }}>키퍼가 서사를 구성하는 중...</div>}
            </div>

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
                placeholder="지문이나 대사를 입력하세요..."
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
                <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: theme.accent }}>⚡ API 한도 / 사용량</span>
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
                  <span>분당 한도 (RPM):</span>
                  <span>최대 15회 / 분</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>직전 토큰 (입/출력):</span>
                  <span>{apiUsage.lastPromptTokens} / {apiUsage.lastResponseTokens}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>오늘 누적 토큰:</span>
                  <span>{apiUsage.totalTokens.toLocaleString()} T</span>
                </div>
              </div>
            </div>

            {/* 관계성 성향 안내 표시 (단정한 표현 적용) */}
            {activeSession.preference && (
              <div style={{ fontSize: "0.75rem", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, padding: "8px", borderRadius: "6px", lineHeight: "1.35" }}>
                <strong style={{ color: theme.accent }}>🎭 관계성 지향:</strong>
                <div style={{ color: theme.textMuted, marginTop: "2px" }}>{activeSession.preference}</div>
              </div>
            )}

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            {/* 탐사자 정보 */}
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: theme.accent }}>탐사자 정보</h4>
              <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>이름: <strong>{activeSession.sheet.name}</strong> ({activeSession.sheet.job || "조사원"})</div>
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
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>⚙️ 환경 설정 & 세이브 관리</h3>
              <button onClick={() => setShowSettingsModal(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* 세이브 백업 / 복원 */}
              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "6px", color: theme.accent }}>💾 세이브 데이터 백업 / 복원</label>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "10px" }}>
                  진행 중인 모든 시나리오와 캐릭터 정보를 PC에 JSON 파일로 다운로드하거나, 이전 세이브 파일을 불러와 복원합니다.
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
