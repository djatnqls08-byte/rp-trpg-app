"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 모바일 뷰포트 감지
  const [isMobile, setIsMobile] = useState(false);

  // 패널 제어
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 모달 제어
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreHelpModal, setShowRestoreHelpModal] = useState(false);
  const [showPortraitEditModal, setShowPortraitEditModal] = useState(false);

  // 이미지 기능 온/오프
  const [showSceneImages, setShowSceneImages] = useState(true);
  const [showPortraits, setShowPortraits] = useState(true);

  // 세이브 백업 옵션
  const [backupFormat, setBackupFormat] = useState("json");
  const [backupTarget, setBackupTarget] = useState("all");

  // 테마 시스템
  const [currentPalette, setCurrentPalette] = useState("midnight");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 효과음, 연출, 제안 칩
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

  // 대분류 및 세부 룰 ('freeform' | 'insane' | 'coc' | 'dnd')
  const [ruleCategory, setRuleCategory] = useState("official");
  const [wizardMode, setWizardMode] = useState("coc");

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

  // 인세인 전용 상태 (사명 & 비밀)
  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");

  // D&D 5e 능력치
  const [dndStats, setDndStats] = useState({ str: 15, dex: 14, con: 13, int: 10, wis: 12, cha: 8 });
  const [dndAc, setDndAc] = useState(14);
  const [dndHp, setDndHp] = useState(12);

  // CoC 7판 특성치 (460pt)
  const [cocStats, setCocStats] = useState({
    str: 40, con: 50, siz: 50, dex: 60,
    app: 70, int: 75, pow: 75, edu: 40, luck: 55,
  });

  // CoC 파생 수치 계산
  const totalAllocated =
    Number(cocStats.str) + Number(cocStats.con) + Number(cocStats.siz) +
    Number(cocStats.dex) + Number(cocStats.app) + Number(cocStats.int) +
    Number(cocStats.pow) + Number(cocStats.edu);
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

  // 관계성 지향 단일 태그 풀
  const orientTags = ["#GL", "#BL", "#HL", "#논로맨스"];
  const tropeTags = [
    "#집착", "#혐관", "#쌍방구원", "#우정",
    "#R19", "#피폐", "#애증", "#신분차",
    "#배틀", "#계약", "#착각", "#구원",
    "#짝사랑", "#달달", "#오컬트", "#광기"
  ];
  const [selectedTags, setSelectedTags] = useState(["#GL", "#집착", "#오컬트"]);
  const [customPreferenceText, setCustomPreferenceText] = useState("");

  // 주사위 상태
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(5);
  const [targetStat, setTargetStat] = useState(50);
  const [pendingCheck, setPendingCheck] = useState(null);

  // 뷰포트 감지
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
        setIsSheetOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openModal = (setModalFn) => {
    window.history.pushState({ modalOpen: true }, "");
    setModalFn(true);
  };

  const closeModal = (setModalFn) => {
    setModalFn(false);
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setShowSettingsModal(false);
      setShowExportModal(false);
      setShowBackupModal(false);
      setShowRestoreHelpModal(false);
      setShowGuideModal(false);
      setShowPortraitEditModal(false);
      if (isMobile) {
        setIsSidebarOpen(false);
        setIsSheetOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isMobile]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSelectCategory = (category) => {
    setRuleCategory(category);
    if (category === "freeform") {
      setWizardMode("freeform");
    } else {
      if (wizardMode === "freeform") setWizardMode("coc");
    }
  };

  const calcMod = (score) => {
    const mod = Math.floor((Number(score) - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getPortraitUrl = (promptText) => {
    const clean = promptText || "anime character portrait, highly detailed";
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(clean + ", masterpiece, high quality, digital art")}?width=300&height=300&nologo=true`;
  };

  const getSceneImageUrl = (promptText) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText + ", atmospheric landscape, masterpiece, digital painting, cinematic")}?width=800&height=400&nologo=true`;
  };

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
      str: base[0], con: base[1], siz: base[2], dex: base[3],
      app: base[4], int: base[5], pow: base[6], edu: base[7],
      luck: Math.floor(Math.random() * 50) + 40,
    };
  };

  // 절차적 생성 풀
  const proceduralData = {
    names: ["사반", "로웨나", "세실리아", "비비안", "엘레노어", "카밀라", "발렌티나", "이졸데", "마리안", "서윤", "도아", "키이라", "아리아", "알렉스"],
    jobs: {
      coc: [
        { job: "고서적 및 유물 감정사", item: "황동 돋보기, 가죽 수첩, 은제 만년필 나이프", bg: "금서와 고대 비전서의 기괴한 필적을 감정하며 살아온 인물. 지적 호기심과 미지에 대한 집착이 강하다." },
        { job: "사립 탐정", item: "회중시계형 나침반, 콜트 32구경 권총, 잠금해제용 철사", bg: "어둠에 묻힌 실종 사건과 기괴한 밀실 범죄를 전담해 온 탐정. 날카로운 직관과 침착함을 지녔다." },
        { job: "정신과 의사", item: "진정제 앰플, 가죽 청진기, 임상 기록 노트", bg: "원인 불명의 집단 광기와 망상 환자들을 치료해 온 학자. 타인의 미묘한 심리 변화를 짚어낸다." },
        { job: "고고학 발굴단원", item: "제도용 캘리퍼스, 손전등, 발굴용 작은 단도", bg: "모래와 석조 잔해 밑에 묻힌 고대 신전을 탐사해 온 현장주의자. 금기된 유적에 매료되어 있다." },
        { job: "법의학자 및 검시관", item: "은제 해부용 메스, 방부용 알코올 병, 확대경", bg: "원인 불명의 변사체들을 부검하며 인간 이상의 존재가 남긴 기괴한 자국들을 추적해 온 학자." },
      ],
      insane: [
        { job: "기숙학교 학생", item: "오르골 태엽 열쇠, 은제 만년필, 압박 붕대", bg: "엄격한 규율의 명문 기숙학교 학생. 학교에 숨겨진 비밀을 밝혀내려 한다." },
        { job: "오컬트 프리랜서 기자", item: "소형 카메라, 녹음기, 가죽 다이어리", bg: "괴담과 실종 사건이 빈발하는 위험 지역을 전문으로 취재하는 르포 기자." },
        { job: "사립 도서관 사서", item: "도서관 마스터키, 손전등, 낡은 양피지", bg: "외부에 공개되지 않은 금서 보관고를 관리하며 위기 상황에 처한 인물." },
        { job: "저택 전속 가사관리인", item: "열쇠 뭉치, 비밀 가계도, 소형 가위", bg: "저택의 가문 구성원들이 품은 어두운 비밀과 기괴한 의식을 은밀히 지켜본 인물." },
      ],
      dnd: [
        { job: "복수의 맹세 팔라딘", item: "은제 그레이트소드, 신성한 성표, 성수 2병", bg: "악을 처단하기 위해 신성한 맹세를 세운 성기사. 동료를 지키기 위해 물러서지 않는다.", stats: { str: 16, dex: 10, con: 14, int: 8, wis: 12, cha: 15 }, ac: 16, hp: 14 },
        { job: "그림자 도적 (Rogue)", item: "도둑 도구 세트, 단검 2자루, 그림자 연막탄", bg: "치명적인 함정과 자물쇠를 해제하는 침투 전문가. 날렵하고 기민하다.", stats: { str: 10, dex: 16, con: 12, int: 14, wis: 13, cha: 10 }, ac: 14, hp: 11 },
        { job: "전쟁학파 위저드", item: "비전 마법서, 룬 각인 지팡이, 마나 시약", bg: "고대 던전의 봉인 마법과 결계를 분석하는 학자형 전투 마법사.", stats: { str: 8, dex: 14, con: 13, int: 16, wis: 12, cha: 10 }, ac: 12, hp: 9 },
      ],
      freeform: [
        { job: "마법 아카데미 수석", item: "마력 만년필, 정밀 양피지 노트, 마나 포션", bg: "실력 하나로 수석을 꿰찬 평민 천재. 약점을 보이지 않으려 꼿꼿하다." },
        { job: "북부 대공가 후계자", item: "가문의 인장 반지, 독침 부채, 해독제 앰플", bg: "가문의 멸문을 막기 위해 정략결혼으로 들어온 인물. 이성적이고 침착하다." },
        { job: "S급 공인 가이드", item: "고농축 안정제 키트, 가이딩 측정 팔찌, 섬광탄", bg: "통제 불능인 강력한 에스퍼들을 전담 진정시켜 온 베테랑 가이드." },
        { job: "VIP 전속 경호원", item: "전술 무전 이어셋, 방탄 조끼, 특수 테이저건", bg: "특수부대 출신의 과묵하고 빈틈없는 경호원. 계약자의 안전이 절대 원칙이다." },
      ]
    },
    scenarios: {
      coc: [
        "폭풍우와 해무로 고립된 해안 절벽의 빅토리아풍 고택 '블랙우드 저택'. 서재 안쪽에서 유리창이 산산조각 나며 인간의 성대가 아닌 듯한 젖은 속삭임이 쏟아져 내립니다.",
        "폭설로 외부 진입로가 완전히 봉쇄된 산 정상의 '아컴 요양 병동'. 자정이 지나자 지하 독방에서 벽을 긁어내리는 둔탁한 소리와 함께 복도의 불이 일제히 꺼집니다.",
        "지진으로 유일한 석조 출입구가 무너져 내린 고대 사막의 '이형 지하 신전'. 석문 틈새로 푸른 인광이 새어 나오며 바닥의 마법진이 액체처럼 검게 끓어오릅니다.",
        "출항 직후 원인 불명으로 통신이 두절되고 짙은 안개 속에 표류한 호화 여객선. 1등실 선실 문틈으로 바다 밑 거대한 점막이 비벼지는 듯한 기척이 다가옵니다."
      ],
      insane: [
        "안개가 자욱한 숲속의 명문 기숙학교 '성 마리안 학원'. 자정이 지나 예배당 지하에서 멈췄던 오르골 소리가 울려 퍼지며 모든 기숙사 출입문이 밖에서 굳게 잠깁니다.",
        "눈보라로 고립된 산속 별장 13호실. 벽난로에서 불길한 피비린내가 풍기고, 피 묻은 열쇠를 쥔 인물이 다가오며 괘종시계가 거꾸로 돌기 시작합니다.",
        "출입이 통제된 심야의 폐병원 연구동. 차단된 방화벽 너머에서 인간의 목소리를 흉내 내는 기괴한 알림 방송이 복도를 울립니다.",
      ],
      dnd: [
        "언데드의 저주가 창궐한 변경의 지하 묘지 '영면의 회랑'. 고대 리치가 깨어나며 묘지 입구가 무너지고, 어둠 속에서 푸른 도깨비불을 든 사령술사와 등을 맞대게 됩니다.",
        "고대 붉은 용의 보물창고가 무너져 내리는 용의 둥지 하층. 마력이 고갈된 라이벌 마법사와 함께 고립된 가운데, 굶주린 드레이크 무리가 포효하며 다가옵니다.",
        "심연의 차원문이 열리기 시작한 지하 드워프 요새 '카라크 둠'. 붕괴하는 다리 위에서 사악한 마법 결계를 해제해야만 탈출할 수 있습니다."
      ],
      freeform: [
        "황립 마법 아카데미의 봉인된 지하 서고. 주인공을 눈엣가시로 여기던 공작가의 차석과 단둘이 갇힌 가운데 고대 금주가 폭주하기 시작합니다.",
        "눈보라가 몰아치는 북부의 흑철성 대연회장. 암살 위협에 신경이 곤두선 차가운 북부 대공과 계약 결혼을 치르던 순간 조명이 일제히 꺼집니다.",
        "폭주 경보가 울려 퍼지는 특수 격리 구역. 주인공 외에는 그 누구의 손길도 거부하는 폭주 직전의 에스퍼가 피투성이가 된 채 주인공의 옷자락을 쥐어 잡습니다."
      ]
    },
    insaneMissions: [
      { mission: "학교의 7대 괴담의 실체를 파헤치고 단짝 친구와 함께 살아서 졸업한다.", secret: "사실 당신은 이미 1년 전 의식에 휘말려 사망한 상태이며, 자신의 시체를 찾지 못해 기억을 잃은 채 유령으로 배회하고 있다." },
      { mission: "산장의 괴이를 해결하고 눈보라가 그칠 때까지 버텨 탈출한다.", secret: "당신은 조난자가 아니라, 5년 전 살인사건의 진범에게 복수하기 위해 가명으로 잠입한 유족이다." },
      { mission: "동행한 파트너를 무사히 보호하며 폐쇄 병동의 비밀 연구 일지를 입수한다.", secret: "당신은 이미 광기에 감염되어 있으며, 파트너를 누구에게도 빼앗기지 않기 위해 이곳에 영원히 가둘 생각이다." },
      { mission: "저택의 저주를 푸는 열쇠를 찾아내어 동이 트기 전에 탈출한다.", secret: "사실 저택에 괴물을 풀어놓은 것은 당신이며, 과거의 계약을 완수하기 위해 모두를 기만하고 있다." },
    ]
  };

  const handleProceduralGenerate = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const randomOrient = pick(orientTags);
    const shuffledTropes = [...tropeTags].sort(() => 0.5 - Math.random());
    const randomTropes = shuffledTropes.slice(0, Math.floor(Math.random() * 2) + 2);
    const newTags = [randomOrient, ...randomTropes];
    setSelectedTags(newTags);

    const modeKey = wizardMode === "freeform" ? "freeform" : wizardMode;
    const name = pick(proceduralData.names);
    const jobList = proceduralData.jobs[modeKey] || proceduralData.jobs.freeform;
    const jobObj = pick(jobList);
    const scenario = pick(proceduralData.scenarios[modeKey] || proceduralData.scenarios.freeform);

    setCharName(name);
    setCharJob(jobObj.job);
    setCharAge(String(Math.floor(Math.random() * 12) + 18));
    setCharGender("여성");
    setCharBackground(`${jobObj.bg} 품에는 [${jobObj.item}]을(를) 소지하고 있다.`);
    setScenarioInput(`${scenario} 현재 파트너와의 관계성 분위기: ${newTags.join(" ")}.`);
    setCharPortraitUrl(getPortraitUrl(`${name}, ${jobObj.job}, anime portrait`));

    if (wizardMode === "coc") {
      setCocStats(generateRandomCocStats());
    } else if (wizardMode === "insane") {
      const ms = pick(proceduralData.insaneMissions);
      setCharMission(ms.mission);
      setCharSecret(ms.secret);
    } else if (wizardMode === "dnd") {
      if (jobObj.stats) {
        setDndStats({ ...jobObj.stats });
        setDndAc(jobObj.ac || 14);
        setDndHp(jobObj.hp || 12);
      }
    }
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
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, sheet: updatedSheet } : s))
        );
      } else {
        setCharPortraitUrl(base64);
      }
      closeModal(setShowPortraitEditModal);
    };
    reader.readAsDataURL(file);
  };

  const applyCustomPortrait = () => {
    if (!customPortraitPrompt.trim()) return;
    const newUrl = customPortraitPrompt.startsWith("http")
      ? customPortraitPrompt
      : getPortraitUrl(customPortraitPrompt);
    if (activeSession) {
      const updatedSheet = { ...activeSession.sheet, portrait: newUrl };
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, sheet: updatedSheet } : s))
      );
    } else {
      setCharPortraitUrl(newUrl);
    }
    setCustomPortraitPrompt("");
    closeModal(setShowPortraitEditModal);
  };

  const executeSaveBackup = () => {
    if (sessions.length === 0) {
      alert("백업할 시나리오 세션이 없습니다.");
      return;
    }
    const targets = backupTarget === "all"
      ? sessions
      : sessions.filter((s) => s.id === Number(backupTarget));
    if (targets.length === 0) {
      alert("선택된 시나리오가 없습니다.");
      return;
    }
    const dateStr = new Date().toISOString().slice(0, 10);
    if (backupFormat === "json") {
      const dataStr = JSON.stringify(targets, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = backupTarget === "all"
        ? `TRPG_전체세이브_${dateStr}.json`
        : `TRPG_${targets[0].title.replace(/\s+/g, "_")}_${dateStr}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      let txtContent = `====================================================\n`;
      txtContent += `         TRPG 세이브 데이터 텍스트 백업 파일         \n`;
      txtContent += `  생성일자: ${new Date().toLocaleString()}\n`;
      txtContent += `====================================================\n\n`;
      targets.forEach((s, idx) => {
        txtContent += `[세션 ${idx + 1}] ${s.title}\n`;
        txtContent += `규칙: ${s.ruleMode}\n`;
        txtContent += `캐릭터: ${s.sheet?.name} (${s.sheet?.job || "모험가"})\n`;
        txtContent += `배경:\n${s.scenarioText || "기록 없음"}\n\n`;
        txtContent += `[대화 기록]\n`;
        s.messages.forEach((m) => {
          const sender = m.role === "user" ? `[${s.sheet?.name}]` : "[마스터]";
          txtContent += `${sender}\n${m.text}\n\n`;
        });
      });
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = backupTarget === "all"
        ? `TRPG_전체세이브텍스트_${dateStr}.txt`
        : `TRPG_${targets[0].title.replace(/\s+/g, "_")}_${dateStr}.txt`;
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
        } else {
          alert("올바른 규격의 JSON 세이브 파일이 아닙니다.");
        }
      } catch (err) {
        alert("파일 복원 실패: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const executeExport = () => {
    if (!activeSession) return;
    const session = activeSession;
    let exportText = "";
    if (exportFormat === "md") {
      exportText += `# ${session.title}\n\n- 규칙: ${session.ruleMode}\n- 캐릭터: ${session.sheet.name}\n\n---\n\n`;
      session.messages.forEach((m) => {
        if (exportScope === "storyOnly" && m.text.includes("[🎲 시스템 공인")) return;
        exportText += m.role === "user" ? `### 👤 ${session.sheet.name}\n${m.text}\n\n` : `### 📜 마스터\n${m.text}\n\n`;
      });
    } else {
      exportText += `=========================================\n${session.title}\n=========================================\n\n`;
      session.messages.forEach((m) => {
        if (exportScope === "storyOnly" && m.text.includes("[🎲 시스템 공인")) return;
        exportText += (m.role === "user" ? `[${session.sheet.name}]` : "[마스터]") + `\n${m.text}\n\n`;
      });
    }
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${session.title.replace(/\s+/g, "_")}_대화록.${exportFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    closeModal(setShowExportModal);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const startNewSession = async () => {
    const isDnd = wizardMode === "dnd";
    const isInsane = wizardMode === "insane";
    const isCoc = wizardMode === "coc";

    const sessionTitle = charName
      ? `${charName}의 여정`
      : isDnd ? "새 D&D 모험" : isInsane ? "새 인세인 괴이" : isCoc ? "새 CoC 조사" : "새 자유 서사";

    const finalPref = [...selectedTags, customPreferenceText.trim()].filter(Boolean).join(" ");
    const defaultPortrait = charPortraitUrl || getPortraitUrl(`${charName || "character"}, portrait`);

    let initialSheet = {};
    if (isDnd) {
      initialSheet = {
        name: charName || "모험가",
        job: charJob || "전사",
        age: charAge, gender: charGender,
        portrait: defaultPortrait,
        hp: dndHp, maxHp: dndHp, ac: dndAc,
        dndStats: { ...dndStats },
        npcs: [{ name: "동료 인물", affection: 10, state: "신뢰" }],
        items: [{ name: "주 무기", desc: "기본 무기" }],
      };
    } else if (isInsane) {
      initialSheet = {
        name: charName || "탐사자",
        job: charJob || "학생",
        age: charAge, gender: charGender,
        portrait: defaultPortrait,
        hp: 6, maxHp: 6, san: 6, maxSan: 6,
        phase: "메인", cycle: 1, scene: 1,
        mission: charMission || "생존하고 진상을 밝힌다.",
        secret: charSecret || "감춰둔 과거의 죄가 있다.",
        npcs: [
          { name: "엘리제", title: "동행자", portrait: getPortraitUrl("silver hair anime girl"), trait: "의존", secret: "의식을 주도한 장본인이다.", secretRevealed: false },
          { name: "유스티나", title: "감시자", portrait: getPortraitUrl("black hair anime guard girl"), trait: "경계", secret: "교단의 비밀 하수인이다.", secretRevealed: false }
        ],
        items: [{ name: "손전등", desc: "조명 도구" }],
      };
    } else if (isCoc) {
      initialSheet = {
        name: charName || "탐사자",
        job: charJob || "조사원",
        age: charAge, gender: charGender,
        portrait: defaultPortrait,
        hp: derivedHp, maxHp: derivedHp,
        mp: derivedMp, maxMp: derivedMp,
        san: derivedSan, maxSan: 99,
        luck: Number(cocStats.luck),
        db: derivedDb, build: derivedBuild,
        cocStats: { ...cocStats },
        npcs: [{ name: "엘리제", title: "상속녀", portrait: getPortraitUrl("victorian noble girl"), affection: 10, state: "호기심" }],
        items: [{ name: "황동 돋보기", desc: "확대경" }, { name: "가죽 수첩", desc: "단서 수첩" }],
      };
    } else {
      initialSheet = {
        name: charName || "주인공",
        job: charJob || "모험가",
        age: charAge, gender: charGender,
        portrait: defaultPortrait,
        hp: 20, maxHp: 20,
        npcs: [{ name: "비올라", title: "라이벌", portrait: getPortraitUrl("blonde noble anime girl"), affection: 10, state: "라이벌" }],
        items: [{ name: "여행용 검", desc: "호신구" }],
      };
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
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);
    setPendingCheck(null);
    setSuggestedActions([]);

    const openingPrompt = `[세션 시작: 첫 서막을 열어주십시오. 현장 분위기를 담은 영문 이미지 프롬프트를 반드시 맨 끝에 첨부하십시오: <!--IMAGE: {"prompt": "..."}-->]`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: openingPrompt }],
          scenarioText: scenarioInput,
          playerSheet: initialSheet,
          ruleMode: wizardMode,
          playPreference: finalPref,
        }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      let rawText = data.text || "서막을 불러오지 못했습니다.";
      let updatedSheet = { ...initialSheet };
      let sceneImg = null;

      const imgMatch = rawText.match(/<!--IMAGE:\s*({.*?})-->/s);
      if (imgMatch) {
        try { sceneImg = getSceneImageUrl(JSON.parse(imgMatch[1]).prompt); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--IMAGE:\s*({.*?})-->/s, "").trim();
      }

      const suggMatch = rawText.match(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s);
      if (suggMatch) {
        try { setSuggestedActions(JSON.parse(suggMatch[1])); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s, "").trim();
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === newId
            ? { ...s, sheet: updatedSheet, messages: [{ role: "model", text: rawText, sceneImage: sceneImg }] }
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

      let rawText = data.text;
      let newSheet = { ...activeSession.sheet };
      let sceneImg = null;

      const imgMatch = rawText.match(/<!--IMAGE:\s*({.*?})-->/s);
      if (imgMatch) {
        try { sceneImg = getSceneImageUrl(JSON.parse(imgMatch[1]).prompt); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--IMAGE:\s*({.*?})-->/s, "").trim();
      }

      const suggMatch = rawText.match(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s);
      if (suggMatch) {
        try { setSuggestedActions(JSON.parse(suggMatch[1])); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s, "").trim();
      }

      const checkMatch = rawText.match(/<!--CHECK:\s*({.*?})-->/s);
      if (checkMatch) {
        try { setPendingCheck(JSON.parse(checkMatch[1])); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--CHECK:\s*({.*?})-->/s, "").trim();
      } else {
        setPendingCheck(null);
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, sheet: newSheet, messages: [...updatedMessages, { role: "model", text: rawText, sceneImage: sceneImg }] }
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

  const rollDiceDirectly = (overrideTarget = null, reasonText = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true);
    setDiceResult(null);

    playDiceSound();
    const mode = activeSession.ruleMode;

    setTimeout(() => {
      let rollFormatted = "";
      if (mode === "insane") {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : targetDc || 5);
        let outcome = sum === 12 ? "스페셜(대성공)" : sum === 2 ? "펌블(대실패)" : sum >= targetVal ? "성공" : "실패";
        setDiceResult({ roll: `${d1}+${d2}=${sum}`, outcome, target: targetVal, type: "2D6" });
        rollFormatted = `[🎲 시스템 공인 2D6 판정: ${d1}+${d2}=${sum} / 목표: ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      } else if (mode === "coc") {
        const roll = Math.floor(Math.random() * 100) + 1;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : targetStat);
        let outcome = roll === 1 ? "대성공" : roll <= Math.floor(targetVal / 5) ? "극단적 성공" : roll <= Math.floor(targetVal / 2) ? "어려운 성공" : roll <= targetVal ? "보통 성공" : roll >= 96 ? "대실패" : "실패";
        setDiceResult({ roll, outcome, target: targetVal, type: "1D100" });
        rollFormatted = `[🎲 시스템 공인 1D100 판정: ${roll} / 목표: ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      } else {
        const roll = Math.floor(Math.random() * 20) + 1;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : targetDc || 12);
        const outcome = roll >= targetVal ? "성공" : "실패";
        setDiceResult({ roll, outcome, target: targetVal, type: "1D20" });
        rollFormatted = `[🎲 시스템 공인 판정: 1D20 결과 ${roll} / DC ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      }

      setIsRolling(false);
      setPendingCheck(null);
      executeMessage(rollFormatted);
    }, 600);
  };

  const themePalettes = {
    midnight: {
      name: "미드나잇 블루",
      dark: { bg: "#0d1017", sidebar: "#131722", panel: "#1b2030", panelAlt: "#23293d", border: "#2b334d", text: "#e4e7f5", textMuted: "#8e96b3", accent: "#6c8dfa", danger: "#f76585", warning: "#e0af68", success: "#7bd88f", bubbleUser: "#324b87", bubbleAi: "#1b2030", inputBg: "#121520" },
      light: { bg: "#eef2fa", sidebar: "#dfe5f5", panel: "#ffffff", panelAlt: "#e6ecf8", border: "#c5cee8", text: "#1e2638", textMuted: "#606c88", accent: "#3f6cd8", danger: "#d13b5a", warning: "#b87514", success: "#2e8544", bubbleUser: "#4b74cb", bubbleAi: "#ffffff", inputBg: "#ffffff" }
    }
  };
  const theme = isDarkMode ? themePalettes.midnight.dark : themePalettes.midnight.light;

  const playDiceSound = () => {
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
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const saved = localStorage.getItem("rp_hub_sessions");
    if (saved) {
      try { setSessions(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
    const savedDark = localStorage.getItem("rp_hub_darkmode");
    if (savedDark !== null) setIsDarkMode(savedDark === "true");
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

  const quotaPercentage = Math.min(100, Math.round((apiUsage.dailyRequests / 1500) * 100));

  return (
    <div style={{ display: "flex", height: "100dvh", minHeight: "100vh", width: "100vw", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, sans-serif", overflow: "hidden", position: "relative" }}>
      {isMobile && isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 45, backdropFilter: "blur(2px)" }} />
      )}

      {/* 1. 좌측 사이드바 */}
      <div
        style={{
          position: isMobile ? "absolute" : "relative",
          zIndex: isMobile ? 50 : 1,
          left: 0, top: 0, bottom: 0,
          width: isSidebarOpen ? "260px" : "0px",
          minWidth: isSidebarOpen ? "260px" : "0px",
          transition: "width 0.25s ease",
          overflow: "hidden",
          backgroundColor: theme.sidebar,
          borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}
      >
        <div style={{ padding: "12px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button
            onClick={() => { setActiveSessionId(null); if (isMobile) setIsSidebarOpen(false); }}
            style={{ flex: 1, padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            + 새 시나리오
          </button>
          <button onClick={handleToggleDarkMode} style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => { setActiveSessionId(s.id); if (isMobile) setIsSidebarOpen(false); }}
              style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${theme.border}`, backgroundColor: activeSessionId === s.id ? theme.panel : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "6px" }}>
                <div style={{ fontWeight: "bold", fontSize: "0.86rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>
                  {s.ruleMode === "dnd" ? "D&D 5e" : s.ruleMode === "insane" ? "인세인" : s.ruleMode === "coc" ? "CoC 7판" : "자유 서사"}
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
              onClick={() => openModal(setShowExportModal)}
              style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.82rem" }}
            >
              📥 대화록 내보내기
            </button>
          )}

          <button
            onClick={() => openModal(setShowSettingsModal)}
            style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.82rem" }}
          >
            ⚙️ 설정
          </button>
        </div>
      </div>

      {/* 2. 중앙 메인 뷰 */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {!activeSession ? (
          /* 세션 생성 마법사 */
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 140px 14px" : "30px 25px 80px 25px", maxWidth: "680px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "6px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}>
                  {isSidebarOpen ? "◀" : "▶"}
                </button>
                <h2 style={{ margin: 0, fontSize: "1.3rem" }}>새로운 세션 구성</h2>
              </div>
              <button onClick={handleProceduralGenerate} style={{ padding: "7px 11px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}>
                🎲 무작위 조합 생성
              </button>
            </div>

            {/* 룰 대분류 선택 */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>룰 대분류 선택</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("freeform")}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "8px",
                    border: `2px solid ${ruleCategory === "freeform" ? theme.accent : theme.border}`,
                    backgroundColor: ruleCategory === "freeform" ? theme.panel : "transparent",
                    color: theme.text, cursor: "pointer",
                  }}
                >
                  <strong>자유 서사</strong>
                  <div style={{ fontSize: "0.74rem", color: theme.textMuted, marginTop: "3px" }}>자유 샌드박스 / 1D20</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCategory("official")}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "8px",
                    border: `2px solid ${ruleCategory === "official" ? theme.warning : theme.border}`,
                    backgroundColor: ruleCategory === "official" ? theme.panel : "transparent",
                    color: theme.text, cursor: "pointer",
                  }}
                >
                  <strong style={{ color: theme.warning }}>공식 TRPG 룰</strong>
                  <div style={{ fontSize: "0.74rem", color: theme.textMuted, marginTop: "3px" }}>정규 룰북 기반 시스템</div>
                </button>
              </div>

              {ruleCategory === "official" && (
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "12px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setWizardMode("insane")}
                    style={{ padding: "10px", borderRadius: "6px", border: `2px solid ${wizardMode === "insane" ? theme.warning : theme.border}`, backgroundColor: wizardMode === "insane" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.warning }}>인세인 (inSANe)</div>
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>2D6 / 사명과 비밀 탐색</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardMode("coc")}
                    style={{ padding: "10px", borderRadius: "6px", border: `2px solid ${wizardMode === "coc" ? theme.danger : theme.border}`, backgroundColor: wizardMode === "coc" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.danger }}>크툴루의 부름 (CoC)</div>
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>1D100 / 7판 정규 & SAN</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardMode("dnd")}
                    style={{ padding: "10px", borderRadius: "6px", border: `2px solid ${wizardMode === "dnd" ? theme.accent : theme.border}`, backgroundColor: wizardMode === "dnd" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>던전 앤 드래곤 (D&D)</div>
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>1D20 / 5e 판타지 어드벤처</div>
                  </button>
                </div>
              )}
            </div>

            {/* 관계성 태그 선택 */}
            <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>🎭 서사 & 관계성 지향</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[...orientTags, ...tropeTags].map((tag) => {
                  const isActive = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: "4px 9px", borderRadius: "14px", fontSize: "0.75rem",
                        backgroundColor: isActive ? theme.accent : theme.panelAlt,
                        color: isActive ? "#fff" : theme.text,
                        border: `1px solid ${isActive ? theme.accent : theme.border}`,
                        cursor: "pointer",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 인세인 사명/비밀 란 */}
            {wizardMode === "insane" && (
              <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.warning}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.warning }}>🔒 인세인 사명과 비밀 설정</span>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>겉보기 사명 (공개 정보)</label>
                  <input type="text" value={charMission} onChange={(e) => setCharMission(e.target.value)} placeholder="예: 살아서 학교를 탈출한다." style={{ width: "100%", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.danger }}>숨겨진 비밀 (Secret)</label>
                  <textarea value={charSecret} onChange={(e) => setCharSecret(e.target.value)} placeholder="예: 사실 당신은 이미 사망한 상태이며..." style={{ width: "100%", height: "50px", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.danger}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box", resize: "none" }} />
                </div>
              </div>
            )}

            {/* D&D 6대 능력치 란 */}
            {wizardMode === "dnd" && (
              <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.accent}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.accent }}>⚔️ D&D 5e 6대 능력치 & 방어도</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {[
                    { key: "str", label: "근력 (STR)" }, { key: "dex", label: "민첩 (DEX)" },
                    { key: "con", label: "건강 (CON)" }, { key: "int", label: "지능 (INT)" },
                    { key: "wis", label: "지혜 (WIS)" }, { key: "cha", label: "매력 (CHA)" },
                  ].map((stat) => (
                    <div key={stat.key} style={{ backgroundColor: theme.inputBg, padding: "6px 8px", borderRadius: "4px", border: `1px solid ${theme.border}` }}>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{stat.label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <input type="number" value={dndStats[stat.key]} onChange={(e) => setDndStats({ ...dndStats, [stat.key]: e.target.value })} style={{ width: "42px", padding: "3px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "3px" }} />
                        <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: theme.accent }}>{calcMod(dndStats[stat.key])}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem" }}>
                  <div>방어도(AC): <input type="number" value={dndAc} onChange={(e) => setDndAc(e.target.value)} style={{ width: "45px", padding: "3px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                  <div>생명력(HP): <input type="number" value={dndHp} onChange={(e) => setDndHp(e.target.value)} style={{ width: "45px", padding: "3px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                </div>
              </div>
            )}

            {/* CoC 7판 특성치 배분 란 (정상 복구) */}
            {wizardMode === "coc" && (
              <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.danger}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: theme.danger }}>CoC 7판 특성치 배분 (460 pt)</span>
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
                      onClick={() => openModal(setShowGuideModal)}
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
                    { key: "str", label: "근력(STR)" }, { key: "con", label: "건강(CON)" },
                    { key: "siz", label: "크기(SIZ)" }, { key: "dex", label: "민첩(DEX)" },
                    { key: "app", label: "외모(APP)" }, { key: "int", label: "지능(INT)" },
                    { key: "pow", label: "정신력(POW)" }, { key: "edu", label: "교육(EDU)" },
                  ].map((stat) => (
                    <div key={stat.key}>
                      <label style={{ display: "block", fontSize: "0.7rem", color: theme.textMuted }}>{stat.label}</label>
                      <input
                        type="number"
                        min="15" max="90"
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

            {/* 기본 캐릭터 정보 및 초상화 */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem" }}>내 캐릭터 정보</span>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {showPortraits && (
                  <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.accent}`, flexShrink: 0, backgroundColor: theme.panelAlt }}>
                    <img
                      src={charPortraitUrl || getPortraitUrl(`${charName || "character"}, portrait`)}
                      alt="Portrait"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1.2fr 1.2fr 0.8fr 0.8fr", gap: "8px" }}>
                  <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="이름" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                  <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업 / 클래스" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                  <input type="text" value={charAge} onChange={(e) => setCharAge(e.target.value)} placeholder="나이" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                  <input type="text" value={charGender} onChange={(e) => setCharGender(e.target.value)} placeholder="성별" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                </div>
              </div>

              <textarea
                value={charBackground}
                onChange={(e) => setCharBackground(e.target.value)}
                placeholder="캐릭터 상세 설정 및 소지품을 적어주세요."
                style={{ width: "100%", height: "65px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* 시나리오 문서 등록 (PDF/TXT/MD 복구) */}
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

            <button
              onClick={startNewSession}
              disabled={isLoading || isPdfLoading || isAiGenerating}
              style={{
                padding: "15px", backgroundColor: theme.accent, color: "#fff",
                border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer",
                fontSize: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {isLoading ? "마스터가 서막을 여는 중..." : "이야기 시작하기"}
            </button>
          </div>
        ) : (
          /* 플레이 룸 */
          <>
            <div style={{ padding: "8px 12px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "5px 9px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer" }}>
                  {isSidebarOpen ? "◀" : "▶"}
                </button>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeSession.title}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  onClick={() => rollDiceDirectly()}
                  disabled={isRolling || isLoading}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: activeSession.ruleMode === "insane" ? theme.warning : activeSession.ruleMode === "coc" ? theme.danger : theme.accent,
                    color: activeSession.ruleMode === "insane" ? "#000" : "#fff",
                    border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.8rem",
                  }}
                >
                  🎲 {activeSession.ruleMode === "insane" ? "2D6" : activeSession.ruleMode === "coc" ? "1D100" : "1D20"}
                </button>
                <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem" }}>
                  {isSheetOpen ? "시트▶" : "◀시트"}
                </button>
              </div>
            </div>

            {/* 대화 로그 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeSession.messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "92%" : "85%" }}>
                  {showSceneImages && m.sceneImage && m.role === "model" && (
                    <div style={{ marginBottom: "8px", borderRadius: "10px", overflow: "hidden", border: `1px solid ${theme.border}`, backgroundColor: theme.panel }}>
                      <img src={m.sceneImage} alt="현장 배경 일러스트" style={{ width: "100%", maxHeight: "280px", objectFit: "cover", display: "block" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                      <div style={{ padding: "5px 10px", fontSize: "0.72rem", color: theme.textMuted, display: "flex", justifyContent: "space-between" }}>
                        <span>🖼️ 현장 정경 일러스트</span>
                        <a href={m.sceneImage} target="_blank" rel="noreferrer" style={{ color: theme.accent, textDecoration: "none" }}>크게 보기 ↗</a>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      backgroundColor: m.text.includes("[🎲 시스템 공인") ? "rgba(224, 175, 104, 0.15)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi,
                      color: m.role === "user" && !m.text.includes("[🎲 시스템 공인") ? "#ffffff" : theme.text,
                      border: m.text.includes("[🎲 시스템 공인") ? `1px solid ${theme.warning}` : m.role === "model" ? `1px solid ${theme.border}` : "none",
                      padding: "12px 15px", borderRadius: "10px", lineHeight: "1.65", whiteSpace: "pre-wrap", fontSize: "0.9rem",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.85rem" }}>마스터가 서사를 구성하는 중...</div>}
            </div>

            {/* 제안 칩 */}
            {suggestionsEnabled && suggestedActions.length > 0 && !isLoading && (
              <div style={{ padding: "6px 12px", backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "0.74rem", color: theme.accent, fontWeight: "bold", display: "flex", alignItems: "center" }}>💡 제안:</span>
                {suggestedActions.map((sugg, idx) => (
                  <button key={idx} onClick={() => setInput(sugg)} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "14px", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>
                    {sugg}
                  </button>
                ))}
              </div>
            )}

            {/* 입력창 */}
            <div style={{ padding: "10px 12px", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="행동이나 대사를 입력하세요..."
                style={{ flex: 1, height: "42px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px", resize: "none", outline: "none" }}
              />
              <button onClick={sendMessage} disabled={isLoading} style={{ padding: "0 16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
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
            position: isMobile ? "absolute" : "relative",
            zIndex: isMobile ? 50 : 1,
            right: 0, top: 0, bottom: 0,
            width: isSheetOpen ? "270px" : "0px",
            minWidth: isSheetOpen ? "270px" : "0px",
            transition: "width 0.25s ease",
            overflow: "hidden",
            backgroundColor: theme.sidebar,
            borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none",
            display: "flex", flexDirection: "column", flexShrink: 0,
          }}
        >
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", width: "270px", boxSizing: "border-box" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "0.88rem", color: theme.accent }}>내 캐릭터</h4>
                {showPortraits && (
                  <button onClick={() => openModal(setShowPortraitEditModal)} style={{ padding: "2px 6px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.7rem", cursor: "pointer" }}>
                    ✏️ 변경
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {showPortraits && (
                  <div onClick={() => openModal(setShowPortraitEditModal)} style={{ position: "relative", width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.accent}`, flexShrink: 0, backgroundColor: theme.panelAlt, cursor: "pointer" }}>
                    <img src={activeSession.sheet.portrait || getPortraitUrl(activeSession.sheet.name)} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
                <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div><strong>{activeSession.sheet.name}</strong> ({activeSession.sheet.job || "모험가"})</div>
                  <div>HP: <strong>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>
                  {activeSession.ruleMode === "coc" && <div>SAN: <strong>{activeSession.sheet.san || "-"} / 99</strong></div>}
                  {activeSession.ruleMode === "dnd" && <div>AC: <strong>{activeSession.sheet.ac || 14}</strong></div>}
                </div>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            {/* 인세인 사명과 비밀 */}
            {activeSession.ruleMode === "insane" && (
              <div>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "0.88rem", color: theme.warning }}>내 사명 & 비밀</h4>
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "8px", marginBottom: "6px", fontSize: "0.75rem" }}>
                  <div style={{ fontWeight: "bold", color: theme.accent }}>📜 사명:</div>
                  <div>{activeSession.sheet.mission}</div>
                </div>
                <div style={{ backgroundColor: "#2b1414", border: `1px solid ${theme.danger}`, borderRadius: "6px", padding: "8px", fontSize: "0.75rem" }}>
                  <div style={{ fontWeight: "bold", color: theme.danger }}>🔒 비밀:</div>
                  <div style={{ color: "#fca5a5" }}>{activeSession.sheet.secret}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 설정 모달 */}
      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "470px", maxHeight: "85vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>⚙️ 환경 설정</h3>
              <button onClick={() => closeModal(setShowSettingsModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ backgroundColor: theme.panelAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: theme.accent }}>💾 세이브 데이터 관리</span>
                  <button onClick={() => openModal(setShowRestoreHelpModal)} style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.accent, cursor: "pointer" }}>?</button>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => openModal(setShowBackupModal)} style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}>
                    💾 세이브 백업
                  </button>
                  <label style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold", textAlign: "center" }}>
                    📤 파일 복원
                    <input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} />
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>🖼️ 현장 배경 일러스트</div>
                  <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>채팅창 상단에 배경 일러스트를 표시합니다.</div>
                </div>
                <button onClick={() => setShowSceneImages(!showSceneImages)} style={{ padding: "6px 14px", backgroundColor: showSceneImages ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}>
                  {showSceneImages ? "ON" : "OFF"}
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>👤 인물 초상화 토큰</div>
                  <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>우측 상태창에 얼굴 썸네일을 표시합니다.</div>
                </div>
                <button onClick={() => setShowPortraits(!showPortraits)} style={{ padding: "6px 14px", backgroundColor: showPortraits ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}>
                  {showPortraits ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            <button onClick={() => closeModal(setShowSettingsModal)} style={{ marginTop: "24px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 세이브 백업 옵션 모달 */}
      {showBackupModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "450px", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>💾 세이브 백업 옵션</h3>
              <button onClick={() => closeModal(setShowBackupModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button onClick={() => setBackupFormat("json")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: `2px solid ${backupFormat === "json" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "json" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>
                JSON 파일 (.json)
              </button>
              <button onClick={() => setBackupFormat("txt")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: `2px solid ${backupFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>
                텍스트 파일 (.txt)
              </button>
            </div>
            <button onClick={executeSaveBackup} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              다운로드
            </button>
          </div>
        </div>
      )}

      {/* 복원 도움말 모달 */}
      {showRestoreHelpModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 130, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "460px", padding: "24px", color: theme.text }}>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "1.1rem", color: theme.accent }}>📖 세이브 백업 & 복원 안내</h3>
            <div style={{ fontSize: "0.82rem", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>• <strong>JSON (.json):</strong> 시트 수치와 대화가 완벽 보존되는 게임 파일입니다. [파일 복원]을 통해 다시 불러올 수 있습니다.</div>
              <div>• <strong>TXT (.txt):</strong> 스마트폰/메모장으로 소설처럼 편하게 읽을 수 있는 문서입니다.</div>
            </div>
            <button onClick={() => closeModal(setShowRestoreHelpModal)} style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* 초상화 변경 모달 */}
      {showPortraitEditModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "440px", padding: "22px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>🖼️ 초상화 변경</h3>
              <button onClick={() => closeModal(setShowPortraitEditModal)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <span style={{ fontSize: "0.82rem", fontWeight: "bold", display: "block", marginBottom: "6px" }}>1. 사진 파일 업로드</span>
                <input type="file" accept="image/*" onChange={handlePortraitFileUpload} style={{ width: "100%", fontSize: "0.8rem" }} />
              </div>
              <div>
                <span style={{ fontSize: "0.82rem", fontWeight: "bold", display: "block", marginBottom: "6px" }}>2. AI 프롬프트 또는 이미지 링크</span>
                <input type="text" value={customPortraitPrompt} onChange={(e) => setCustomPortraitPrompt(e.target.value)} placeholder="예: silver hair anime girl" style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box", marginBottom: "8px" }} />
                <button onClick={applyCustomPortrait} style={{ width: "100%", padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>적용</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CoC 가이드 모달 */}
      {showGuideModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "500px", padding: "22px", color: theme.text }}>
            <h3 style={{ margin: "0 0 12px 0", color: theme.danger }}>📖 CoC 7판 룰 가이드</h3>
            <div style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
              • 8대 특성치 총합: <strong>460 pt</strong><br />
              • HP = (CON+SIZ)/10 | MP = POW/5 | 초기 SAN = POW<br />
              • 판정 등급: 대성공(01), 극단(1/5 이하), 어려움(1/2 이하), 보통(목표 이하), 대실패(96~100)
            </div>
            <button onClick={() => closeModal(setShowGuideModal)} style={{ marginTop: "18px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
