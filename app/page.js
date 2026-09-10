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

  // ============================================================
  // 대분류 및 세부 룰 선택 상태
  // - ruleCategory: 'freeform' (자유 서사) | 'official' (공식 TRPG 룰)
  // - wizardMode: 'freeform' | 'insane' | 'coc' | 'dnd'
  // ============================================================
  const [ruleCategory, setRuleCategory] = useState("official");
  const [wizardMode, setWizardMode] = useState("insane");

  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("24");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [scenarioInput, setScenarioInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 인세인 전용 상태
  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");

  // D&D 5e 6대 능력치 (기본 표준 배열: 15, 14, 13, 12, 10, 8)
  const [dndStats, setDndStats] = useState({
    str: 15,
    dex: 14,
    con: 13,
    int: 10,
    wis: 12,
    cha: 8,
  });
  const [dndAc, setDndAc] = useState(14);
  const [dndHp, setDndHp] = useState(12);

  // CoC 특성치 (460pt)
  const [cocStats, setCocStats] = useState({
    str: 40, con: 50, siz: 50, dex: 60,
    app: 70, int: 75, pow: 75, edu: 40, luck: 55,
  });

  // 관계성 지향 단일 태그
  const availableTags = [
    "#GL", "#BL", "#HL", "#논로맨스",
    "#집착", "#혐관", "#쌍방구원", "#우정",
    "#R19", "#피폐", "#애증", "#신분차",
    "#배틀", "#계약", "#착각", "#구원",
    "#짝사랑", "#달달", "#오컬트", "#광기"
  ];
  const [selectedTags, setSelectedTags] = useState(["#GL", "#집착", "#혐관"]);
  const [customPreferenceText, setCustomPreferenceText] = useState("");

  // 주사위 상태
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(5);
  const [targetStat, setTargetStat] = useState(50);
  const [pendingCheck, setPendingCheck] = useState(null);

  // 뷰포트 반응형 감지
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

  // 대분류 선택 핸들러
  const handleSelectCategory = (category) => {
    setRuleCategory(category);
    if (category === "freeform") {
      setWizardMode("freeform");
    } else {
      if (wizardMode === "freeform") setWizardMode("insane");
    }
  };

  // D&D 수정치 계산기 (예: 15 -> +2, 8 -> -1)
  const calcMod = (score) => {
    const mod = Math.floor((Number(score) - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // 클리셰 프리셋 풀
  const clichesPool = {
    dnd: [
      {
        theme: "성기사와 사령술사의 위험한 동행",
        name: "발렌티나",
        job: "복수의 맹세 팔라딘",
        age: "24",
        stats: { str: 16, dex: 10, con: 14, int: 8, wis: 12, cha: 15 },
        ac: 16,
        hp: 14,
        items: "은제 그레이트소드, 신성한 성표, 성수 2병",
        scenario: "언데드의 저주가 창궐한 변경의 지하 묘지 '영면의 회랑'. 신성 기사단의 주인공은 묘지를 정화하러 진입했으나, 묘지 깊은 곳에서 언데드를 부리며 나른하게 웃고 있는 배교 사령술사 '모르가나'와 마주칩니다. 그녀는 성스러운 팔라딘에게 묘한 독점욕을 보이며 묘지를 무너뜨리려는 거대 리치의 출현을 경고합니다."
      },
      {
        theme: "용병 도적과 황실 마법사의 던전 탈출",
        name: "키이라",
        job: "그림자 도적(Rogue)",
        age: "22",
        stats: { str: 10, dex: 16, con: 12, int: 14, wis: 13, cha: 10 },
        ac: 14,
        hp: 11,
        items: "도둑 도구 세트, 단검 2자루, 그림자 연막탄",
        scenario: "붕괴하는 고대 드래곤의 보물창고. 보물을 털고 빠져나가려던 도적 주인공의 앞에, 텔레포트 실패로 마력이 고갈된 오만하지만 유약한 궁정 대마법사 '엘레노어'가 고립되어 있습니다. 서로 으르렁대던 라이벌이었으나 용의 포효와 함께 천장이 무너져 내리며 단둘이 등을 맞대게 됩니다."
      }
    ],
    insane: [
      {
        title: "기숙학교의 밀실과 피의 서약",
        name: "세실리아",
        job: "고등학부 3학년",
        age: "18",
        items: "오르골 열쇠, 은제 만년필, 압박 붕대",
        mission: "졸업식 전까지 학교에 떠도는 7대 괴담의 실체를 파헤치고 단짝 친구와 함께 살아서 졸업한다.",
        secret: "사실 당신은 이미 1년 전 괴담 의식에 휘말려 목숨을 잃은 상태이며, 자신의 시체를 찾지 못해 기억을 잃은 채 유령으로 배회하고 있다.",
        scenario: "안개가 자욱한 숲속에 자리 잡은 명문 기숙학교 '성 마리안 학원'. 자정이 지나면 굳게 닫힌 예배당 지하에서 오르골 소리가 울려 퍼집니다. 곁에는 주인공에게 병적으로 집착하는 후배 '엘리제'와, 주인공의 뒤를 미행하며 살벌한 경계를 늦추지 않는 풍기위원장 '유스티나'가 있습니다. 종소리가 울리며 기숙사의 모든 출입문이 밖에서 잠깁니다.",
        npcs: [
          { name: "엘리제", title: "병약한 후배", trait: "주인공을 신처럼 따름", secret: "주인공을 영원히 학교에 묶어두기 위해 의식을 주도한 장본인이다.", secretRevealed: false },
          { name: "유스티나", title: "풍기위원장", trait: "차가운 감시자", secret: "교장의 명령으로 괴담의 희생자가 된 학생들을 은폐하는 교단의 하수인이다.", secretRevealed: false }
        ]
      }
    ],
    coc: [
      {
        name: "사반",
        job: "고서적 및 유물 감정사",
        age: "26",
        items: "황동 돋보기, 가죽 수첩, 은제 만년필 나이프",
        scenario: "폭풍우와 해무로 고립된 해안 절벽의 빅토리아풍 고택 '블랙우드 저택'. 사반은 저택 서고에서 발견된 고대 양피지를 해독해 달라는 의뢰를 받고 도착했다. 곁에는 은발의 상속녀 '엘리제'와 경호원 '유스티나'가 팽팽한 신경전을 벌이고 있다. 자정이 지나 서재 문틈에서 기괴한 젖은 속삭임이 흘러나옵니다."
      }
    ],
    freeform: [
      {
        name: "세리스",
        job: "마법 아카데미 수석",
        age: "20",
        items: "마력 만년필, 정밀 양피지 노트, 마나 포션",
        scenario: "황립 마법 아카데미의 봉인된 지하 서고. 주인공을 눈엣가시로 여기면서도 집착하는 명문 공작가의 차석 '비올라'와 함께 갇히게 되었습니다. 고대 금주가 폭주하며 서고의 탈출로가 차단됩니다."
      }
    ]
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
    } catch (e) {
      console.error(e);
    }
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

  // 무작위 조합 생성기
  const handleProceduralGenerate = () => {
    if (wizardMode === "dnd") {
      const picked = clichesPool.dnd[Math.floor(Math.random() * clichesPool.dnd.length)];
      setCharName(picked.name);
      setCharJob(picked.job);
      setCharAge(picked.age);
      setCharGender("여성");
      setCharBackground(`소지품: ${picked.items}`);
      setScenarioInput(picked.scenario);
      setDndStats({ ...picked.stats });
      setDndAc(picked.ac);
      setDndHp(picked.hp);
      setSelectedTags(["#GL", "#혐관", "#쌍방구원"]);
    } else if (wizardMode === "insane") {
      const picked = clichesPool.insane[0];
      setCharName(picked.name);
      setCharJob(picked.job);
      setCharAge(picked.age);
      setCharGender("여성");
      setCharBackground(`소지품: ${picked.items}`);
      setCharMission(picked.mission);
      setCharSecret(picked.secret);
      setScenarioInput(picked.scenario);
      setSelectedTags(["#GL", "#집착", "#광기"]);
    } else if (wizardMode === "coc") {
      const picked = clichesPool.coc[0];
      setCharName(picked.name);
      setCharJob(picked.job);
      setCharAge(picked.age);
      setCharGender("여성");
      setCharBackground(`소지품: ${picked.items}`);
      setScenarioInput(picked.scenario);
      setSelectedTags(["#GL", "#오컬트", "#집착"]);
    } else {
      const picked = clichesPool.freeform[0];
      setCharName(picked.name);
      setCharJob(picked.job);
      setCharAge(picked.age);
      setCharGender("여성");
      setCharBackground(`소지품: ${picked.items}`);
      setScenarioInput(picked.scenario);
      setSelectedTags(["#GL", "#라이벌", "#성장"]);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // 세션 시작
  const startNewSession = async () => {
    const isDnd = wizardMode === "dnd";
    const isInsane = wizardMode === "insane";
    const isCoc = wizardMode === "coc";

    const sessionTitle = charName
      ? `${charName}의 모험`
      : isDnd
      ? "새 D&D 던전 모험"
      : isInsane
      ? "새 인세인 괴이"
      : isCoc
      ? "새 CoC 조사"
      : "새 자유 서사";

    const finalPref = [...selectedTags, customPreferenceText.trim()].filter(Boolean).join(" ");

    let initialSheet = {};
    if (isDnd) {
      initialSheet = {
        name: charName || "모험가",
        job: charJob || "전사",
        age: charAge,
        gender: charGender,
        hp: dndHp,
        maxHp: dndHp,
        ac: dndAc,
        dndStats: { ...dndStats },
        npcs: [{ name: "동료 인물", affection: 10, state: "신뢰" }],
        items: [{ name: "주 무기", desc: "기본 무기" }, { name: "모험가 배낭", desc: "밧줄, 횃불, 배급식량" }],
      };
    } else if (isInsane) {
      initialSheet = {
        name: charName || "탐사자",
        job: charJob || "학생",
        age: charAge,
        gender: charGender,
        hp: 6, maxHp: 6, san: 6, maxSan: 6,
        phase: "메인", cycle: 1, scene: 1,
        mission: charMission || "살아서 진상을 밝힌다.",
        secret: charSecret || "밝혀지지 않은 과거의 죄가 있다.",
        npcs: clichesPool.insane[0].npcs,
        items: [{ name: "손전등", desc: "조명" }],
      };
    } else if (isCoc) {
      initialSheet = {
        name: charName || "탐사자",
        job: charJob || "조사원",
        hp: 10, maxHp: 10, san: 50, luck: 50,
        npcs: [{ name: "엘리제", affection: 10, state: "호기심" }],
        items: [{ name: "황동 돋보기", desc: "확대경" }],
      };
    } else {
      initialSheet = {
        name: charName || "주인공",
        job: charJob || "모험가",
        hp: 20, maxHp: 20,
        npcs: [],
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

    const openingPrompt = `[세션 시작: ${
      isDnd
        ? "D&D 5e 판타지 캠페인의 첫 서막을 던전 마스터(DM)로서 묘사하십시오. 모험가가 처한 위기와 동행 인물과의 첫 대면을 던져주십시오."
        : isInsane
        ? "인세인 메인 사이클 1씬의 막을 여십시오. 사명을 상기시키는 기괴한 사건을 묘사하되 NPC의 비밀을 미리 폭로하지 마십시오."
        : "시나리오 원문과 성향 지침을 반영해 첫 도입부 소설 지문을 생생하게 묘사하십시오."
    }]`;

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

      // 비밀 해금 태그 파싱
      const secretMatch = rawText.match(/<!--REVEAL_SECRET:\s*({.*?})-->/s);
      if (secretMatch) {
        try {
          const revealed = JSON.parse(secretMatch[1]);
          updatedSheet.npcs = (updatedSheet.npcs || []).map((npc) =>
            npc.name === revealed.name ? { ...npc, secret: revealed.secret, secretRevealed: true } : npc
          );
        } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--REVEAL_SECRET:\s*({.*?})-->/s, "").trim();
      }

      // 상태 태그 파싱
      const statusMatch = rawText.match(/<!--STATUS:\s*({.*?})-->/s);
      if (statusMatch) {
        try {
          const parsed = JSON.parse(statusMatch[1]);
          if (parsed.hp !== undefined) updatedSheet.hp = parsed.hp;
          if (parsed.san !== undefined) updatedSheet.san = parsed.san;
          if (parsed.ac !== undefined) updatedSheet.ac = parsed.ac;
          if (parsed.cycle !== undefined) updatedSheet.cycle = parsed.cycle;
          if (parsed.scene !== undefined) updatedSheet.scene = parsed.scene;
        } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--STATUS:\s*({.*?})-->/s, "").trim();
      }

      // 제안 칩 파싱
      const suggMatch = rawText.match(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s);
      if (suggMatch) {
        try { setSuggestedActions(JSON.parse(suggMatch[1])); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s, "").trim();
      }

      // 판정 요구 태그 파싱
      const checkMatch = rawText.match(/<!--CHECK:\s*({.*?})-->/s);
      if (checkMatch) {
        try { setPendingCheck(JSON.parse(checkMatch[1])); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--CHECK:\s*({.*?})-->/s, "").trim();
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

  // 대화 전송 코어
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

      const secretMatch = rawText.match(/<!--REVEAL_SECRET:\s*({.*?})-->/s);
      if (secretMatch) {
        try {
          const revealed = JSON.parse(secretMatch[1]);
          newSheet.npcs = (newSheet.npcs || []).map((npc) =>
            npc.name === revealed.name ? { ...npc, secret: revealed.secret, secretRevealed: true } : npc
          );
        } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--REVEAL_SECRET:\s*({.*?})-->/s, "").trim();
      }

      const statusMatch = rawText.match(/<!--STATUS:\s*({.*?})-->/s);
      if (statusMatch) {
        try {
          const parsed = JSON.parse(statusMatch[1]);
          if (parsed.hp !== undefined) newSheet.hp = parsed.hp;
          if (parsed.san !== undefined) newSheet.san = parsed.san;
          if (parsed.ac !== undefined) newSheet.ac = parsed.ac;
          if (parsed.cycle !== undefined) newSheet.cycle = parsed.cycle;
          if (parsed.scene !== undefined) newSheet.scene = parsed.scene;
        } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--STATUS:\s*({.*?})-->/s, "").trim();
      }

      const checkMatch = rawText.match(/<!--CHECK:\s*({.*?})-->/s);
      if (checkMatch) {
        try { setPendingCheck(JSON.parse(checkMatch[1])); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--CHECK:\s*({.*?})-->/s, "").trim();
      } else {
        setPendingCheck(null);
      }

      const suggMatch = rawText.match(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s);
      if (suggMatch) {
        try { setSuggestedActions(JSON.parse(suggMatch[1])); } catch (e) { console.error(e); }
        rawText = rawText.replace(/<!--SUGGESTIONS:\s*(\[.*?\])-->/s, "").trim();
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

  // 주사위 굴림 (D&D 1D20 / 인세인 2D6 / CoC 1D100 / 자유 서사 1D20)
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
        rollFormatted = `[🎲 시스템 공인 2D6 판정: ${d1}+${d2}=${sum} / 목표치: ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      } else if (mode === "coc") {
        const roll = Math.floor(Math.random() * 100) + 1;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : targetStat);
        let outcome = roll === 1 ? "대성공" : roll <= Math.floor(targetVal / 5) ? "극단적 성공" : roll <= Math.floor(targetVal / 2) ? "어려운 성공" : roll <= targetVal ? "보통 성공" : roll >= 96 ? "대실패" : "실패";
        setDiceResult({ roll, outcome, target: targetVal, type: "1D100" });
        rollFormatted = `[🎲 시스템 공인 1D100 판정: ${roll} / 목표: ${targetVal}${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
      } else if (mode === "dnd") {
        const roll = Math.floor(Math.random() * 20) + 1;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : targetDc || 15);
        let outcome = roll === 20 ? "크리티컬 성공(Natural 20)" : roll === 1 ? "대실패(Natural 1)" : roll >= targetVal ? "성공" : "실패";
        setDiceResult({ roll, outcome, target: targetVal, type: "1D20" });
        rollFormatted = `[🎲 시스템 공인 D&D 판정: 1D20 결과 ${roll} (DC ${targetVal})${reasonText ? ` (${reasonText})` : ""} ➔ 결과: ${outcome}]`;
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
                  {s.ruleMode === "dnd" ? "던전 앤 드래곤 (D&D)" : s.ruleMode === "insane" ? "인세인 (inSANe)" : s.ruleMode === "coc" ? "CoC 7판 정규" : "자유 서사"}
                </div>
              </div>
            </div>
          ))}
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
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={handleProceduralGenerate} style={{ padding: "7px 11px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}>
                  🎲 무작위 조합 생성
                </button>
              </div>
            </div>

            {/* ============================================================
                대분류 탭 (자유 서사 vs 공식 TRPG 룰)
               ============================================================ */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>룰 대분류 선택</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("freeform")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: `2px solid ${ruleCategory === "freeform" ? theme.accent : theme.border}`,
                    backgroundColor: ruleCategory === "freeform" ? theme.panel : "transparent",
                    color: theme.text,
                    cursor: "pointer",
                  }}
                >
                  <strong>자유 서사</strong>
                  <div style={{ fontSize: "0.74rem", color: theme.textMuted, marginTop: "3px" }}>자유 샌드박스 / 직관적 1D20</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCategory("official")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: `2px solid ${ruleCategory === "official" ? theme.warning : theme.border}`,
                    backgroundColor: ruleCategory === "official" ? theme.panel : "transparent",
                    color: theme.text,
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ color: theme.warning }}>공식 TRPG 룰</strong>
                  <div style={{ fontSize: "0.74rem", color: theme.textMuted, marginTop: "3px" }}>정규 룰북 기반 3대 시스템</div>
                </button>
              </div>

              {/* 공식 TRPG 룰 선택 시 나타나는 하위 3종 탭 */}
              {ruleCategory === "official" && (
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: theme.textMuted, fontWeight: "bold" }}>세부 공식 룰 선택:</span>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setWizardMode("insane")}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: `2px solid ${wizardMode === "insane" ? theme.warning : theme.border}`,
                        backgroundColor: wizardMode === "insane" ? theme.panelAlt : "transparent",
                        color: theme.text,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.warning }}>인세인 (inSANe)</div>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>2D6 / 사명과 비밀 탐색</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWizardMode("coc")}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: `2px solid ${wizardMode === "coc" ? theme.danger : theme.border}`,
                        backgroundColor: wizardMode === "coc" ? theme.panelAlt : "transparent",
                        color: theme.text,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.danger }}>크툴루의 부름 (CoC)</div>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>1D100 / 7판 정규 & SAN</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWizardMode("dnd")}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: `2px solid ${wizardMode === "dnd" ? theme.accent : theme.border}`,
                        backgroundColor: wizardMode === "dnd" ? theme.panelAlt : "transparent",
                        color: theme.text,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>던전 앤 드래곤 (D&D)</div>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>1D20 / 5e 판타지 어드벤처</div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 관계성 태그 선택 */}
            <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>🎭 서사 & 관계성 지향</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {availableTags.map((tag) => {
                  const isActive = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: "4px 9px",
                        borderRadius: "14px",
                        fontSize: "0.75rem",
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

            {/* 인세인 선택 시 전용 입력란 (사명과 비밀) */}
            {wizardMode === "insane" && (
              <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.warning}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.warning }}>🔒 인세인 사명과 비밀 설정</span>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>겉보기 사명 (공개 정보)</label>
                  <input
                    type="text"
                    value={charMission}
                    onChange={(e) => setCharMission(e.target.value)}
                    placeholder="예: 학교를 탈출한다."
                    style={{ width: "100%", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.danger }}>숨겨진 비밀 (Secret)</label>
                  <textarea
                    value={charSecret}
                    onChange={(e) => setCharSecret(e.target.value)}
                    placeholder="예: 사실 당신은 이미 사망한 상태이며..."
                    style={{ width: "100%", height: "50px", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.danger}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box", resize: "none" }}
                  />
                </div>
              </div>
            )}

            {/* D&D 선택 시 전용 능력치 및 AC/HP */}
            {wizardMode === "dnd" && (
              <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.accent}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.accent }}>⚔️ D&D 5e 6대 능력치 & 방어도</span>
                  <span style={{ fontSize: "0.72rem", color: theme.textMuted }}>수정치 자동 산출</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {[
                    { key: "str", label: "근력 (STR)" },
                    { key: "dex", label: "민첩 (DEX)" },
                    { key: "con", label: "건강 (CON)" },
                    { key: "int", label: "지능 (INT)" },
                    { key: "wis", label: "지혜 (WIS)" },
                    { key: "cha", label: "매력 (CHA)" },
                  ].map((stat) => (
                    <div key={stat.key} style={{ backgroundColor: theme.inputBg, padding: "6px 8px", borderRadius: "4px", border: `1px solid ${theme.border}` }}>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{stat.label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <input
                          type="number"
                          value={dndStats[stat.key]}
                          onChange={(e) => setDndStats({ ...dndStats, [stat.key]: e.target.value })}
                          style={{ width: "42px", padding: "3px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "3px" }}
                        />
                        <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: theme.accent }}>{calcMod(dndStats[stat.key])}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem", marginTop: "2px" }}>
                  <div>방어도(AC): <input type="number" value={dndAc} onChange={(e) => setDndAc(e.target.value)} style={{ width: "45px", padding: "3px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                  <div>생명력(HP): <input type="number" value={dndHp} onChange={(e) => setDndHp(e.target.value)} style={{ width: "45px", padding: "3px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                </div>
              </div>
            )}

            {/* 기본 캐릭터 정보 */}
            <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem" }}>캐릭터 정보</span>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1.4fr 1.2fr 0.7fr 0.7fr", gap: "8px" }}>
                <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="이름" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업 / 클래스" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                <input type="text" value={charAge} onChange={(e) => setCharAge(e.target.value)} placeholder="나이" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                <input type="text" value={charGender} onChange={(e) => setCharGender(e.target.value)} placeholder="성별" style={{ padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
              </div>
            </div>

            {/* 시나리오 배경 */}
            <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem" }}>시나리오 배경</span>
              <textarea
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder="시나리오 배경을 입력하세요."
                style={{ width: "100%", height: "80px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            <button
              onClick={startNewSession}
              disabled={isLoading}
              style={{ padding: "14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
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

            {/* 인세인 진행 인디케이터 */}
            {activeSession.ruleMode === "insane" && (
              <div style={{ backgroundColor: "#261c12", borderBottom: `1px solid ${theme.warning}`, padding: "6px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: theme.warning }}>
                <span>📍 <strong>인세인 페이즈:</strong> {activeSession.sheet.phase || "메인"} 페이즈</span>
                <span>제<strong>{activeSession.sheet.cycle || 1}</strong>사이클 / 제<strong>{activeSession.sheet.scene || 1}</strong>씬</span>
              </div>
            )}

            {/* 판정 요구 알림 배너 */}
            {pendingCheck && (
              <div style={{ backgroundColor: "#3b2611", borderBottom: `1px solid ${theme.warning}`, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
                <span>⚠️ 판정 요구: [{pendingCheck.stat}] (기준치: {pendingCheck.target})</span>
                <button onClick={() => rollDiceDirectly(pendingCheck.target, `${pendingCheck.stat}`)} style={{ padding: "4px 10px", backgroundColor: theme.warning, color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                  주사위 굴리기
                </button>
              </div>
            )}

            {/* 대화 로그 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {activeSession.messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: m.text.includes("[🎲 시스템 공인") ? "rgba(224, 175, 104, 0.15)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi,
                    color: m.role === "user" && !m.text.includes("[🎲 시스템 공인") ? "#ffffff" : theme.text,
                    border: m.text.includes("[🎲 시스템 공인") ? `1px solid ${theme.warning}` : m.role === "model" ? `1px solid ${theme.border}` : "none",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    maxWidth: isMobile ? "90%" : "85%",
                    lineHeight: "1.65",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9rem",
                  }}
                >
                  {m.text}
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.85rem" }}>마스터가 서사를 구성하는 중...</div>}
            </div>

            {/* AI 행동 제안 칩 */}
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
            {/* 캐릭터 수치 */}
            <div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.88rem", color: theme.accent }}>캐릭터 정보</h4>
              <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "3px" }}>
                <div>이름: <strong>{activeSession.sheet.name}</strong> ({activeSession.sheet.job || "모험가"})</div>
                <div>HP: <strong>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>
                {activeSession.ruleMode === "dnd" && (
                  <div>방어도(AC): <strong>{activeSession.sheet.ac || 14}</strong></div>
                )}
                {activeSession.ruleMode === "coc" && (
                  <div>SAN: <strong>{activeSession.sheet.san} / 99</strong></div>
                )}
              </div>
            </div>

            {/* D&D 6대 능력치 표시 */}
            {activeSession.ruleMode === "dnd" && activeSession.sheet.dndStats && (
              <>
                <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />
                <div>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "0.85rem", color: theme.accent }}>6대 능력치 (D&D)</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "0.76rem" }}>
                    <div>STR: {activeSession.sheet.dndStats.str} ({calcMod(activeSession.sheet.dndStats.str)})</div>
                    <div>DEX: {activeSession.sheet.dndStats.dex} ({calcMod(activeSession.sheet.dndStats.dex)})</div>
                    <div>CON: {activeSession.sheet.dndStats.con} ({calcMod(activeSession.sheet.dndStats.con)})</div>
                    <div>INT: {activeSession.sheet.dndStats.int} ({calcMod(activeSession.sheet.dndStats.int)})</div>
                    <div>WIS: {activeSession.sheet.dndStats.wis} ({calcMod(activeSession.sheet.dndStats.wis)})</div>
                    <div>CHA: {activeSession.sheet.dndStats.cha} ({calcMod(activeSession.sheet.dndStats.cha)})</div>
                  </div>
                </div>
              </>
            )}

            {/* 인세인 사명/비밀 카드 */}
            {activeSession.ruleMode === "insane" && (
              <>
                <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
