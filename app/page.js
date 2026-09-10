"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 모바일 감지
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

  // 이미지 및 초상화 스타일
  const [showPortraits, setShowPortraits] = useState(true);
  const [portraitStyle, setPortraitStyle] = useState("anime"); // 'anime' | 'realistic'

  // 백업
  const [backupFormat, setBackupFormat] = useState("json");
  const [backupTarget, setBackupTarget] = useState("all");

  // 테마
  const [currentPalette, setCurrentPalette] = useState("midnight");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 사운드/애니/칩
  const [soundVolume, setSoundVolume] = useState(0.6);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [suggestedActions, setSuggestedActions] = useState([]);

  // 내보내기
  const [exportFormat, setExportFormat] = useState("txt");
  const [exportScope, setExportScope] = useState("all");

  // API 모니터링
  const [apiUsage, setApiUsage] = useState({ date: new Date().toISOString().slice(0, 10), dailyRequests: 0, totalTokens: 0, lastPromptTokens: 0, lastResponseTokens: 0 });
  const [manualCountInput, setManualCountInput] = useState("");

  // 모드
  const [ruleCategory, setRuleCategory] = useState("official");
  const [wizardMode, setWizardMode] = useState("coc");

  // 캐릭터 폼
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

  // 인세인
  const [charMission, setCharMission] = useState("");
  const [charSecret, setCharSecret] = useState("");

  // DND / COC 수치
  const [dndStats, setDndStats] = useState({ str: 15, dex: 14, con: 13, int: 10, wis: 12, cha: 8 });
  const [dndAc, setDndAc] = useState(14);
  const [dndHp, setDndHp] = useState(12);

  const [cocStats, setCocStats] = useState({ str: 40, con: 50, siz: 50, dex: 60, app: 70, int: 75, pow: 75, edu: 40, luck: 55 });

  const totalAllocated = Number(cocStats.str) + Number(cocStats.con) + Number(cocStats.siz) + Number(cocStats.dex) + Number(cocStats.app) + Number(cocStats.int) + Number(cocStats.pow) + Number(cocStats.edu);
  const remainingPoints = 460 - totalAllocated;
  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);
  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0"; let derivedBuild = 0;
  if (strPlusSiz <= 64) { derivedDb = "-2"; derivedBuild = -2; }
  else if (strPlusSiz <= 84) { derivedDb = "-1"; derivedBuild = -1; }
  else if (strPlusSiz <= 124) { derivedDb = "0"; derivedBuild = 0; }
  else if (strPlusSiz <= 164) { derivedDb = "+1D4"; derivedBuild = 1; }
  else { derivedDb = "+1D6"; derivedBuild = 2; }

  // 관계성 지향 태그
  const orientTags = ["#GL", "#BL", "#HL", "#논로맨스"];
  const tropeTags = ["#집착", "#혐관", "#쌍방구원", "#우정", "#R19", "#피폐", "#애증", "#신분차", "#배틀", "#계약", "#착각", "#구원", "#짝사랑", "#달달", "#오컬트", "#광기"];
  const [playPreference, setPlayPreference] = useState("#GL #집착 #오컬트");

  // 판정 상태
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDisplayNum, setRollingDisplayNum] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(5);
  const [targetStat, setTargetStat] = useState(50);
  const [pendingCheck, setPendingCheck] = useState(null);

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
      setShowRestoreHelpModal(false); setShowGuideModal(false); setShowPortraitEditModal(false);
      if (isMobile) { setIsSidebarOpen(false); setIsSheetOpen(false); }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isMobile]);

  // 직접 타이핑 및 토글 연동
  const toggleTag = (tag) => {
    setPlayPreference((prev) => {
      const regex = new RegExp(`\\s*${tag}\\b`, "g");
      if (prev.includes(tag)) {
        return prev.replace(regex, "").trim();
      } else {
        return prev ? `${prev} ${tag}` : tag;
      }
    });
  };

  const handleSelectCategory = (category) => {
    setRuleCategory(category);
    if (category === "freeform") setWizardMode("freeform");
    else if (wizardMode === "freeform") setWizardMode("coc");
  };

  const calcMod = (score) => { const mod = Math.floor((Number(score) - 10) / 2); return mod >= 0 ? `+${mod}` : `${mod}`; };
  
  // 초상화 스타일 분기 적용
  const getPortraitUrl = (promptText, forceStyle) => {
    const clean = promptText || "character portrait";
    const currentStyle = forceStyle || portraitStyle;
    const styleTag = currentStyle === "anime" 
      ? "anime style, 2d illustration, masterpiece" 
      : "realistic photography, highly detailed, cinematic lighting, 8k";
    return `[https://image.pollinations.ai/prompt/$](https://image.pollinations.ai/prompt/$){encodeURIComponent(clean + ", " + styleTag)}?width=300&height=300&nologo=true`;
  };

  const generateRandomCocStats = () => {
    const base = [30, 30, 30, 30, 30, 30, 30, 30];
    let remaining = 220;
    while (remaining > 0) {
      const idx = Math.floor(Math.random() * 8);
      if (base[idx] < 85) { base[idx] += 5; remaining -= 5; }
    }
    return { str: base[0], con: base[1], siz: base[2], dex: base[3], app: base[4], int: base[5], pow: base[6], edu: base[7], luck: Math.floor(Math.random() * 50) + 40 };
  };

  // 절차적 데이터 풀
  const proceduralData = {
    names: {
      western: ["사반", "로웨나", "세실리아", "비비안", "엘레노어", "카밀라", "발렌티나", "이졸데", "마리안", "키이라", "아리아", "알렉스"],
      korean: ["서윤", "도아", "은채", "하경", "지수", "연우", "태리", "수아", "유진", "세아"]
    },
    jobs: {
      coc: [
        { region: "western", job: "고서적 감정사", item: "황동 돋보기, 수첩, 은제 단도", bg: "고대 비전서의 기괴한 필적을 감정하며 살아온 인물." },
        { region: "western", job: "사립 탐정", item: "나침반, 권총, 잠금해제용 철사", bg: "기괴한 밀실 범죄를 전담해 온 탐정. 날카로운 직관을 지녔다." },
        { region: "korean", job: "민속학 대학원생", item: "캠코더, 소형 녹음기, 낡은 부적", bg: "토속 신앙과 괴담을 연구하며 방방곡곡을 돌아다니는 대학원생." },
        { region: "korean", job: "흥신소 탐정", item: "손전등, 호신용 삼단봉, 폴라로이드", bg: "뒷골목의 궂은일을 도맡아 해결하며 세상물정에 통달한 탐정." },
      ],
      insane: [
        { region: "western", job: "기숙학교 학생", item: "오르골 태엽 열쇠, 만년필, 붕대", bg: "엄격한 규율의 명문 기숙학교 학생. 학교에 숨겨진 비밀을 밝혀내려 한다." },
        { region: "western", job: "저택 관리인", item: "열쇠 뭉치, 비밀 가계도, 소형 가위", bg: "저택 가문의 피비린내 나는 어두운 비밀을 은밀히 지켜본 인물." },
        { region: "korean", job: "폐병원 탐험 BJ", item: "짐벌 카메라, 보조 배터리, 야광 스틱", bg: "흉가와 폐병원을 넘나들며 생방송을 강행하는 스트리머." },
        { region: "korean", job: "특수 청소부", item: "공업용 방독면, 장갑, 만능 열쇠", bg: "사망 사건이 일어난 현장을 정리하며 도시의 기괴한 이면을 마주하는 인물." },
      ],
      dnd: [
        { region: "western", job: "복수의 맹세 팔라딘", item: "그레이트소드, 성표, 성수", bg: "악을 처단하기 위해 맹세를 세운 성기사.", stats: { str: 16, dex: 10, con: 14, int: 8, wis: 12, cha: 15 }, ac: 16, hp: 14 },
        { region: "western", job: "그림자 도적", item: "도둑 도구 세트, 단검, 연막탄", bg: "치명적인 함정을 해제하는 침투 전문가.", stats: { str: 10, dex: 16, con: 12, int: 14, wis: 13, cha: 10 }, ac: 14, hp: 11 },
      ],
      freeform: [
        { region: "western", job: "아카데미 수석", item: "마력 만년필, 양피지 노트, 포션", bg: "실력 하나로 수석을 꿰찬 평민 천재." },
        { region: "western", job: "북부 대공가 후계자", item: "인장 반지, 독침 부채, 해독제", bg: "가문의 멸문을 막기 위해 정략결혼으로 들어온 인물." },
        { region: "korean", job: "S급 공인 가이드", item: "안정제 키트, 가이딩 팔찌, 섬광탄", bg: "통제 불능인 에스퍼들을 진정시켜 온 베테랑 가이드." },
        { region: "korean", job: "현대 퇴마사", item: "복숭아나무 가지, 붉은 부적, 향단", bg: "도심의 악령과 원귀들을 상대하며 음지를 살아가는 영능력자." },
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
      dnd: [
        { region: "western", text: "언데드의 저주가 창궐한 변경의 지하 묘지. 고대 리치가 깨어나며 묘지 입구가 무너지고, 어둠 속에서 푸른 도깨비불이 타오릅니다." },
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
    const newTags = [pick(orientTags), ...[...tropeTags].sort(() => 0.5 - Math.random()).slice(0, 2)];
    setPlayPreference(newTags.join(" "));

    const isKorean = Math.random() > 0.5 && wizardMode !== "dnd";
    const region = isKorean ? "korean" : "western";
    
    const name = pick(proceduralData.names[region]);
    const modeKey = wizardMode === "freeform" ? "freeform" : wizardMode;
    
    const availableJobs = proceduralData.jobs[modeKey].filter(j => j.region === region);
    const jobObj = pick(availableJobs.length > 0 ? availableJobs : proceduralData.jobs[modeKey]);
    
    const availableScenarios = proceduralData.scenarios[modeKey].filter(s => s.region === region);
    const scenarioObj = pick(availableScenarios.length > 0 ? availableScenarios : proceduralData.scenarios[modeKey]);

    setCharName(name);
    setCharJob(jobObj.job);
    setCharAge(String(Math.floor(Math.random() * 12) + 18));
    setCharGender("여성");
    setCharBackground(`${jobObj.bg} 품에는 [${jobObj.item}]을(를) 소지하고 있다.`);
    setScenarioInput(`${scenarioObj.text} 현재 동행자와의 관계성 분위기: ${newTags.join(" ")}.`);
    setCharPortraitUrl(getPortraitUrl(`${name}, ${jobObj.job}`));

    if (wizardMode === "coc") {
      setCocStats(generateRandomCocStats());
    } else if (wizardMode === "insane") {
      const msList = proceduralData.insaneMissions.filter(m => m.region === region);
      const ms = pick(msList.length > 0 ? msList : proceduralData.insaneMissions);
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
            script.src = "[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js)";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "[https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js)";
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
        s.messages.forEach((m) => {
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
    session.messages.forEach((m) => {
      if (exportScope === "storyOnly" && m.text.includes("[🎲 시스템 공인")) return;
      exportText += (m.role === "user" ? `[${session.sheet.name}]` : "[마스터]") + `\n${m.text}\n\n`;
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

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // 강력한 마크다운 및 HTML 주석 파싱/제거 함수
  const parseTagsSafely = (rawText) => {
    let cleanText = rawText;
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

    // 마크다운 코드 블록 문법 및 남은 주석 완벽히 제거
    cleanText = cleanText.replace(/```html/gi, "").replace(/```/g, "").replace(/<!--[\s\S]*?-->/g, "").trim();

    return { cleanText, parsedData };
  };

  const startNewSession = async () => {
    const isDnd = wizardMode === "dnd";
    const isInsane = wizardMode === "insane";
    const isCoc = wizardMode === "coc";

    const sessionTitle = charName ? `${charName}의 이야기` : "새로운 모험";
    const finalPref = playPreference.trim();
    const defaultPortrait = charPortraitUrl || getPortraitUrl(`${charName || "character"}`);

    let initialSheet = {};
    if (isDnd) {
      initialSheet = {
        name: charName || "모험가", job: charJob || "전사", age: charAge, gender: charGender, portrait: defaultPortrait,
        hp: dndHp, maxHp: dndHp, ac: dndAc, dndStats: { ...dndStats },
        npcs: [{ name: "파트너", title: "동행자", portrait: getPortraitUrl("companion"), affection: 10, state: "신뢰" }],
        items: [{ name: "주 무기", desc: "기본 무기" }],
      };
    } else if (isInsane) {
      initialSheet = {
        name: charName || "탐사자", job: charJob || "학생", age: charAge, gender: charGender, portrait: defaultPortrait,
        hp: 6, maxHp: 6, san: 6, maxSan: 6, phase: "메인", cycle: 1, scene: 1,
        mission: charMission || "생존하고 진상을 밝힌다.", secret: charSecret || "감춰둔 과거의 죄가 있다.",
        npcs: [
          { name: "파트너", title: "동행자", portrait: getPortraitUrl("partner"), affection: 10, state: "의존", secret: "의식을 주도한 장본인이다.", secretRevealed: false }
        ],
        items: [{ name: "손전등", desc: "조명 도구" }],
      };
    } else if (isCoc) {
      initialSheet = {
        name: charName || "탐사자", job: charJob || "조사원", age: charAge, gender: charGender, portrait: defaultPortrait,
        hp: derivedHp, maxHp: derivedHp, mp: derivedMp, maxMp: derivedMp, san: derivedSan, maxSan: 99, luck: Number(cocStats.luck), db: derivedDb, build: derivedBuild, cocStats: { ...cocStats },
        npcs: [{ name: "파트너", title: "동료", portrait: getPortraitUrl("companion"), affection: 10, state: "호기심" }],
        items: [{ name: "황동 돋보기", desc: "확대경" }, { name: "수첩", desc: "단서 보관" }],
      };
    } else {
      initialSheet = {
        name: charName || "주인공", job: charJob || "모험가", age: charAge, gender: charGender, portrait: defaultPortrait,
        hp: 20, maxHp: 20, npcs: [{ name: "파트너", title: "라이벌", portrait: getPortraitUrl("rival"), affection: 10, state: "라이벌" }],
        items: [{ name: "여행용 검", desc: "호신구" }],
      };
    }

    const newId = Date.now();
    const newSession = { id: newId, title: sessionTitle, ruleMode: wizardMode, preference: finalPref, scenarioText: scenarioInput, sheet: initialSheet, messages: [] };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);
    setPendingCheck(null);
    setSuggestedActions([]);

    const openingPrompt = `[세션 시작: 첫 서막을 열어주십시오.]`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text: openingPrompt }], scenarioText: scenarioInput, playerSheet: initialSheet, ruleMode: wizardMode, playPreference: finalPref }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      const { cleanText, parsedData } = parseTagsSafely(data.text || "서막을 불러오지 못했습니다.");
      let updatedSheet = { ...initialSheet, ...parsedData.newSheetVars };
      setSuggestedActions(parsedData.suggActions);
      setPendingCheck(parsedData.pendingCheck);

      setSessions((prev) => prev.map((s) => s.id === newId ? { ...s, sheet: updatedSheet, messages: [{ role: "model", text: cleanText }] } : s));
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const executeMessage = async (textToSend) => {
    if (!textToSend.trim() || !activeSession) return;
    const updatedMessages = [...activeSession.messages, { role: "user", text: textToSend }];
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages } : s)));
    setIsLoading(true);
    setSuggestedActions([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, scenarioText: activeSession.scenarioText, playerSheet: activeSession.sheet, ruleMode: activeSession.ruleMode, playPreference: activeSession.preference }),
      });

      const data = await response.json();
      recordApiCall(data.usage);

      const { cleanText, parsedData } = parseTagsSafely(data.text || "");
      let newSheet = { ...activeSession.sheet, ...parsedData.newSheetVars };

      if (parsedData.revealedSecrets.length > 0) {
        parsedData.revealedSecrets.forEach(rev => {
          newSheet.npcs = (newSheet.npcs || []).map(npc => npc.name === rev.name ? { ...npc, secret: rev.secret, secretRevealed: true } : npc);
        });
      }

      setSuggestedActions(parsedData.suggActions);
      setPendingCheck(parsedData.pendingCheck);

      setSessions((prev) => prev.map((s) => s.id === activeSessionId ? { ...s, sheet: newSheet, messages: [...updatedMessages, { role: "model", text: cleanText }] } : s));
    } catch (err) { alert(`통신 오류: ${err.message}`); } finally { setIsLoading(false); }
  };

  const sendMessage = () => { if (!input.trim()) return; const text = input; setInput(""); executeMessage(text); };
  const handleUseItem = (itemName) => { setInput((prev) => `품에서 [${itemName}]을(를) 꺼내어 ` + prev); };

  const rollDiceDirectly = (overrideTarget = null, reasonText = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true); setDiceResult(null); playDiceSound();

    let rollInterval = null;
    if (animationEnabled) { rollInterval = setInterval(() => { setRollingDisplayNum(Math.floor(Math.random() * (activeSession.ruleMode === "coc" ? 100 : 20)) + 1); }, 50); }

    const mode = activeSession.ruleMode;
    setTimeout(() => {
      if (rollInterval) clearInterval(rollInterval);
      let rollFormatted = "";
      if (mode === "insane") {
        const d1 = Math.floor(Math.random() * 6) + 1; const d2 = Math.floor(Math.random() * 6) + 1; const sum = d1 + d2;
        const targetVal = Number(overrideTarget !== null ? overrideTarget : targetDc || 5);
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
      setIsRolling(false); setPendingCheck(null); executeMessage(rollFormatted);
    }, animationEnabled ? 650 : 150);
  };

  useEffect(() => {
    const saved = localStorage.getItem("rp_hub_sessions");
    if (saved) { try { setSessions(JSON.parse(saved)); } catch (e) {} }
    setIsLoaded(true);
    const savedDark = localStorage.getItem("rp_hub_darkmode");
    if (savedDark !== null) setIsDarkMode(savedDark === "true");
    const savedPortraits = localStorage.getItem("rp_hub_show_portraits");
    if (savedPortraits !== null) setShowPortraits(savedPortraits === "true");
    const savedSugg = localStorage.getItem("rp_hub_suggestions_enabled");
    if (savedSugg !== null) setSuggestionsEnabled(savedSugg === "true");
    const savedStyle = localStorage.getItem("rp_hub_portrait_style");
    if (savedStyle !== null) setPortraitStyle(savedStyle);
  }, []);

  const themePalettes = {
    midnight: { dark: { bg: "#0d1017", sidebar: "#131722", panel: "#1b2030", panelAlt: "#23293d", border: "#2b334d", text: "#e4e7f5", textMuted: "#8e96b3", accent: "#6c8dfa", danger: "#f76585", warning: "#e0af68", success: "#7bd88f", bubbleUser: "#324b87", bubbleAi: "#1b2030", inputBg: "#121520" }, light: { bg: "#eef2fa", sidebar: "#dfe5f5", panel: "#ffffff", panelAlt: "#e6ecf8", border: "#c5cee8", text: "#1e2638", textMuted: "#606c88", accent: "#3f6cd8", danger: "#d13b5a", warning: "#b87514", success: "#2e8544", bubbleUser: "#4b74cb", bubbleAi: "#ffffff", inputBg: "#ffffff" } },
    abyss: { dark: { bg: "#050608", sidebar: "#090c12", panel: "#0e131d", panelAlt: "#141c2b", border: "#1d2638", text: "#dcdfe8", textMuted: "#6f788e", accent: "#5679e0", danger: "#e0536c", warning: "#cfa14c", success: "#5eb871", bubbleUser: "#1f325c", bubbleAi: "#0e131d", inputBg: "#080a10" }, light: { bg: "#f3f4f7", sidebar: "#e3e6eb", panel: "#ffffff", panelAlt: "#e9edf3", border: "#cbd0d9", text: "#13161c", textMuted: "#5e6473", accent: "#3651a1", danger: "#c2344f", warning: "#a87720", success: "#2d7d42", bubbleUser: "#435994", bubbleAi: "#ffffff", inputBg: "#ffffff" } },
    sepia: { dark: { bg: "#241e1a", sidebar: "#1c1714", panel: "#302822", panelAlt: "#3d332b", border: "#4d4036", text: "#ede3d8", textMuted: "#ad9c8f", accent: "#d49b6a", danger: "#d95b5b", warning: "#e3ad5d", success: "#8bb36b", bubbleUser: "#5e4533", bubbleAi: "#302822", inputBg: "#1a1512" }, light: { bg: "#f9f6f0", sidebar: "#efe7dc", panel: "#fffdf9", panelAlt: "#e6dcce", border: "#d6c8b4", text: "#362b22", textMuted: "#7a6a5a", accent: "#a96934", danger: "#b83d3d", warning: "#b0741b", success: "#4e7d34", bubbleUser: "#825d3d", bubbleAi: "#fffdf9", inputBg: "#fffdf9" } },
    classic: { dark: { bg: "#121316", sidebar: "#181a1f", panel: "#21242b", panelAlt: "#282c34", border: "#333842", text: "#abb2bf", textMuted: "#7f848e", accent: "#61afef", danger: "#e06c75", warning: "#e5c07b", success: "#98c379", bubbleUser: "#3b4860", bubbleAi: "#21242b", inputBg: "#16181d" }, light: { bg: "#f7f8fa", sidebar: "#edf0f4", panel: "#ffffff", panelAlt: "#e4e8ef", border: "#cfd5df", text: "#24272e", textMuted: "#6b7280", accent: "#2563eb", danger: "#dc2626", warning: "#d97706", success: "#16a34a", bubbleUser: "#3b82f6", bubbleAi: "#ffffff", inputBg: "#ffffff" } }
  };
  const theme = isDarkMode ? themePalettes[currentPalette].dark : themePalettes[currentPalette].light;
  const quotaPercentage = Math.min(100, Math.round((apiUsage.dailyRequests / 1500) * 100));

  return (
    <div style={{ display: "flex", height: "100dvh", minHeight: "100vh", width: "100vw", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`*, *::before, *::after { box-sizing: border-box; } @keyframes diceTumble { 0% { transform: rotate(0deg) scale(0.85); } 50% { transform: rotate(180deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } } .anim-dice-rolling { animation: diceTumble 0.35s infinite linear; }`}</style>
      
      {isMobile && isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 45, backdropFilter: "blur(2px)" }} />}
      {isMobile && isSheetOpen && <div onClick={() => setIsSheetOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 45, backdropFilter: "blur(2px)" }} />}

      <div style={{ position: isMobile ? "absolute" : "relative", zIndex: isMobile ? 50 : 1, left: 0, top: 0, bottom: 0, width: isSidebarOpen ? "260px" : "0px", minWidth: isSidebarOpen ? "260px" : "0px", transition: "width 0.25s ease", overflow: "hidden", backgroundColor: theme.sidebar, borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "12px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button onClick={() => { setActiveSessionId(null); if (isMobile) setIsSidebarOpen(false); }} style={{ flex: 1, padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>+ 새 시나리오</button>
          <button onClick={handleToggleDarkMode} style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {sessions.map((s) => (
            <div key={s.id} onClick={() => { setActiveSessionId(s.id); if (isMobile) setIsSidebarOpen(false); }} style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${theme.border}`, backgroundColor: activeSessionId === s.id ? theme.panel : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: "6px" }}>
                <div style={{ fontWeight: "bold", fontSize: "0.86rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>{s.ruleMode === "dnd" ? "D&D 5e" : s.ruleMode === "insane" ? "인세인" : s.ruleMode === "coc" ? "CoC 7판" : "자유 서사"}</div>
              </div>
              <button onClick={(e) => deleteSession(s.id, e)} title="삭제" style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px", fontSize: "0.9rem" }}>🗑️</button>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px" }}>
          {activeSession && <button onClick={() => openModal(setShowExportModal)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.82rem" }}>📥 대화록 내보내기</button>}
          <button onClick={() => openModal(setShowSettingsModal)} style={{ width: "100%", padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, cursor: "pointer", fontSize: "0.82rem" }}>⚙️ 설정</button>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {!activeSession ? (
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 140px 14px" : "30px 25px 80px 25px", maxWidth: "680px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "6px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <h2 style={{ margin: 0, fontSize: "1.3rem" }}>새로운 세션 구성</h2>
              </div>
              <button onClick={handleProceduralGenerate} style={{ padding: "7px 11px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}>🎲 무작위 조합 생성</button>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>룰 대분류 선택</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button type="button" onClick={() => handleSelectCategory("freeform")} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `2px solid ${ruleCategory === "freeform" ? theme.accent : theme.border}`, backgroundColor: ruleCategory === "freeform" ? theme.panel : "transparent", color: theme.text, cursor: "pointer" }}>
                  <strong>자유 서사</strong><div style={{ fontSize: "0.74rem", color: theme.textMuted, marginTop: "3px" }}>자유 샌드박스 / 1D20</div>
                </button>
                <button type="button" onClick={() => handleSelectCategory("official")} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `2px solid ${ruleCategory === "official" ? theme.warning : theme.border}`, backgroundColor: ruleCategory === "official" ? theme.panel : "transparent", color: theme.text, cursor: "pointer" }}>
                  <strong style={{ color: theme.warning }}>공식 TRPG 룰</strong><div style={{ fontSize: "0.74rem", color: theme.textMuted, marginTop: "3px" }}>정규 룰북 기반 시스템</div>
                </button>
              </div>
              {ruleCategory === "official" && (
                <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "12px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "8px" }}>
                  <button type="button" onClick={() => setWizardMode("insane")} style={{ padding: "10px", borderRadius: "6px", border: `2px solid ${wizardMode === "insane" ? theme.warning : theme.border}`, backgroundColor: wizardMode === "insane" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.warning }}>인세인 (inSANe)</div><div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>2D6 / 사명과 비밀 탐색</div>
                  </button>
                  <button type="button" onClick={() => setWizardMode("coc")} style={{ padding: "10px", borderRadius: "6px", border: `2px solid ${wizardMode === "coc" ? theme.danger : theme.border}`, backgroundColor: wizardMode === "coc" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.danger }}>크툴루의 부름 (CoC)</div><div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>1D100 / 7판 정규 &amp; SAN</div>
                  </button>
                  <button type="button" onClick={() => setWizardMode("dnd")} style={{ padding: "10px", borderRadius: "6px", border: `2px solid ${wizardMode === "dnd" ? theme.accent : theme.border}`, backgroundColor: wizardMode === "dnd" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>던전 앤 드래곤 (D&amp;D)</div><div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>1D20 / 5e 판타지 어드벤처</div>
                  </button>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>{"🎭 서사 & 관계성 지향 (클릭하여 텍스트에 추가)"}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[...orientTags, ...tropeTags].map((tag) => {
                  const isActive = playPreference.includes(tag);
                  return (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: "4px 9px", borderRadius: "14px", fontSize: "0.75rem", backgroundColor: isActive ? theme.accent : theme.panelAlt, color: isActive ? "#fff" : theme.text, border: `1px solid ${isActive ? theme.accent : theme.border}`, cursor: "pointer" }}>
                      {tag}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={playPreference}
                onChange={(e) => setPlayPreference(e.target.value)}
                placeholder="태그를 클릭하거나, 원하는 분위기를 이곳에 직접 적어주세요."
                style={{ width: "100%", minWidth: 0, height: "65px", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", marginTop: "4px", fontSize: "0.82rem" }}
              />
            </div>

            {wizardMode === "insane" && (
              <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.warning}`, display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.warning }}>🔒 인세인 사명과 비밀 설정</span>
                <div><label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>겉보기 사명 (공개 정보)</label><input type="text" value={charMission} onChange={(e) => setCharMission(e.target.value)} style={{ width: "100%", minWidth: 0, padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} /></div>
                <div><label style={{ display: "block", fontSize: "0.75rem", color: theme.danger }}>숨겨진 비밀 (Secret)</label><textarea value={charSecret} onChange={(e) => setCharSecret(e.target.value)} style={{ width: "100%", height: "50px", padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.danger}`, borderRadius: "4px", color: theme.text, resize: "none" }} /></div>
              </div>
            )}

            {wizardMode === "dnd" && (
              <div style={{ backgroundColor: theme.panel, padding: "14px", borderRadius: "8px", border: `1px solid ${theme.accent}`, display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", color: theme.accent }}>{"⚔️ D&D 5e 6대 능력치 & 방어도"}</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", width: "100%" }}>
                  {[{ key: "str", label: "근력 (STR)" }, { key: "dex", label: "민첩 (DEX)" }, { key: "con", label: "건강 (CON)" }, { key: "int", label: "지능 (INT)" }, { key: "wis", label: "지혜 (WIS)" }, { key: "cha", label: "매력 (CHA)" }].map((stat) => (
                    <div key={stat.key} style={{ backgroundColor: theme.inputBg, padding: "6px 8px", borderRadius: "4px", border: `1px solid ${theme.border}`, minWidth: 0 }}>
                      <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{stat.label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <input type="number" value={dndStats[stat.key]} onChange={(e) => setDndStats({ ...dndStats, [stat.key]: e.target.value })} style={{ width: "42px", minWidth: 0, padding: "3px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "3px" }} />
                        <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: theme.accent }}>{calcMod(dndStats[stat.key])}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem" }}>
                  <div>방어도(AC): <input type="number" value={dndAc} onChange={(e) => setDndAc(e.target.value)} style={{ width: "45px", minWidth: 0, padding: "3px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                  <div>생명력(HP): <input type="number" value={dndHp} onChange={(e) => setDndHp(e.target.value)} style={{ width: "45px", minWidth: 0, padding: "3px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                </div>
              </div>
            )}

            {wizardMode === "coc" && (
              <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.danger}`, display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: theme.danger }}>CoC 7판 특성치 배분 (460 pt)</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button type="button" onClick={() => setCocStats(generateRandomCocStats())} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.75rem", cursor: "pointer" }}>🎲 주사위</button>
                    <button type="button" onClick={() => openModal(setShowGuideModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.75rem", cursor: "pointer" }}>📖 가이드</button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "8px", width: "100%" }}>
                  {[{ key: "str", label: "근력(STR)" }, { key: "con", label: "건강(CON)" }, { key: "siz", label: "크기(SIZ)" }, { key: "dex", label: "민첩(DEX)" }, { key: "app", label: "외모(APP)" }, { key: "int", label: "지능(INT)" }, { key: "pow", label: "정신력(POW)" }, { key: "edu", label: "교육(EDU)" }].map((stat) => (
                    <div key={stat.key} style={{ minWidth: 0 }}>
                      <label style={{ display: "block", fontSize: "0.7rem", color: theme.textMuted }}>{stat.label}</label>
                      <input type="number" min="15" max="90" value={cocStats[stat.key]} onChange={(e) => setCocStats({ ...cocStats, [stat.key]: e.target.value })} style={{ width: "100%", minWidth: 0, padding: "5px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.85rem" }}>내 캐릭터 정보</span>
                {showPortraits && <button type="button" onClick={() => openModal(setShowPortraitEditModal)} style={{ padding: "4px 8px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.74rem", cursor: "pointer" }}>🖼️ 초상화 변경</button>}
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", width: "100%", minWidth: 0 }}>
                {showPortraits && (
                  <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.accent}`, flexShrink: 0, backgroundColor: theme.panelAlt }}>
                    <img src={charPortraitUrl || getPortraitUrl(`${charName || "character"}`)} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1.2fr 1.2fr 0.8fr 0.8fr", gap: "8px", width: "100%" }}>
                  <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="이름" style={{ width: "100%", minWidth: 0, padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.82rem" }} />
                  <input type="text" value={charJob} onChange={(e) => setCharJob(e.target.value)} placeholder="직업 / 클래스" style={{ width: "100%", minWidth: 0, padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.82rem" }} />
                  <input type="text" value={charAge} onChange={(e) => setCharAge(e.target.value)} placeholder="나이" style={{ width: "100%", minWidth: 0, padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.82rem" }} />
                  <input type="text" value={charGender} onChange={(e) => setCharGender(e.target.value)} placeholder="성별" style={{ width: "100%", minWidth: 0, padding: "7px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, fontSize: "0.82rem" }} />
                </div>
              </div>
              <textarea value={charBackground} onChange={(e) => setCharBackground(e.target.value)} placeholder="캐릭터 상세 설정 및 소지품" style={{ width: "100%", minWidth: 0, height: "65px", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical" }} />
            </div>

            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>📁 시나리오 문서 등록 (.pdf, .txt, .md 지원)</span>
              <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} style={{ display: "block", width: "100%", minWidth: 0, padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem", cursor: "pointer" }} />
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "0.8rem", color: theme.textMuted }}>시나리오 내용 미리보기 / 직접 작성</label>
                <textarea value={scenarioInput} onChange={(e) => setScenarioInput(e.target.value)} style={{ width: "100%", minWidth: 0, height: "85px", padding: "8px 10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical" }} />
              </div>
            </div>

            <button onClick={startNewSession} disabled={isLoading || isPdfLoading || isAiGenerating} style={{ width: "100%", padding: "15px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
              {isLoading ? "마스터가 서막을 여는 중..." : "이야기 시작하기"}
            </button>
          </div>
        ) : (
          /* 플레이 룸 */
          <>
            <div style={{ padding: "8px 12px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ padding: "5px 9px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer" }}>{isSidebarOpen ? "◀" : "▶"}</button>
                <span style={{ fontWeight: "bold", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeSession.title}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button onClick={() => rollDiceDirectly()} disabled={isRolling || isLoading} style={{ padding: "5px 10px", backgroundColor: activeSession.ruleMode === "insane" ? theme.warning : activeSession.ruleMode === "coc" ? theme.danger : theme.accent, color: activeSession.ruleMode === "insane" ? "#000" : "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "0.8rem" }}>
                  🎲 {activeSession.ruleMode === "insane" ? "2D6" : activeSession.ruleMode === "coc" ? "1D100" : "1D20"}
                </button>
                <button onClick={() => setIsSheetOpen(!isSheetOpen)} style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer", fontSize: "0.78rem" }}>{isSheetOpen ? "시트▶" : "◀시트"}</button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
              {isRolling && animationEnabled && (
                <div style={{ position: "absolute", top: "15px", left: "50%", transform: "translateX(-50%)", zIndex: 50, backgroundColor: theme.panel, border: `2px solid ${theme.accent}`, borderRadius: "12px", padding: "12px 24px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                  <span className="anim-dice-rolling" style={{ fontSize: "2rem", display: "inline-block" }}>🎲</span>
                  <div><div style={{ fontSize: "0.72rem", color: theme.textMuted }}>주사위를 굴리는 중...</div><div style={{ fontSize: "1.3rem", fontWeight: "bold", color: theme.accent }}>{rollingDisplayNum}</div></div>
                </div>
              )}
              {activeSession.messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: isMobile ? "92%" : "85%" }}>
                  <div style={{ backgroundColor: m.text.includes("[🎲 시스템 공인") ? "rgba(224, 175, 104, 0.15)" : m.role === "user" ? theme.bubbleUser : theme.bubbleAi, color: m.role === "user" && !m.text.includes("[🎲 시스템 공인") ? "#ffffff" : theme.text, border: m.text.includes("[🎲 시스템 공인") ? `1px solid ${theme.warning}` : m.role === "model" ? `1px solid ${theme.border}` : "none", padding: "12px 15px", borderRadius: "10px", lineHeight: "1.65", whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && <div style={{ color: theme.accent, fontSize: "0.85rem" }}>마스터가 서사를 구성하는 중...</div>}
            </div>

            {suggestionsEnabled && suggestedActions.length > 0 && !isLoading && (
              <div style={{ padding: "6px 12px", backgroundColor: theme.panel, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "0.74rem", color: theme.accent, fontWeight: "bold", display: "flex", alignItems: "center" }}>💡 제안:</span>
                {suggestedActions.map((sugg, idx) => (
                  <button key={idx} onClick={() => setInput(sugg)} style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "14px", color: theme.text, fontSize: "0.75rem", cursor: "pointer" }}>{sugg}</button>
                ))}
              </div>
            )}

            <div style={{ padding: "10px 12px", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="행동이나 대사를 입력하세요..." style={{ flex: 1, height: "42px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px", resize: "none", outline: "none" }} />
              <button onClick={sendMessage} disabled={isLoading} style={{ padding: "0 16px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>전송</button>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 상태창 */}
      {activeSession && (
        <div style={{ position: isMobile ? "absolute" : "relative", zIndex: isMobile ? 50 : 1, right: 0, top: 0, bottom: 0, width: isSheetOpen ? "275px" : "0px", minWidth: isSheetOpen ? "275px" : "0px", transition: "width 0.25s ease", overflow: "hidden", backgroundColor: theme.sidebar, borderLeft: isSheetOpen ? `1px solid ${theme.border}` : "none", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", width: "275px", boxSizing: "border-box" }}>
            <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}><span style={{ fontSize: "0.8rem", fontWeight: "bold", color: theme.accent }}>⚡ API 한도 (추정치)</span><span style={{ fontSize: "0.68rem", padding: "1px 5px", backgroundColor: theme.panelAlt, borderRadius: "4px", color: theme.textMuted }}>Free Tier</span></div>
              <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "3px" }}><span>오늘 호출 (RPD):</span><strong>{apiUsage.dailyRequests} / 1,500회</strong></div><div style={{ height: "6px", width: "100%", backgroundColor: theme.panelAlt, borderRadius: "3px", overflow: "hidden" }}><div style={{ height: "100%", width: `${quotaPercentage}%`, backgroundColor: quotaPercentage > 85 ? theme.danger : quotaPercentage > 60 ? theme.warning : theme.success }} /></div></div>
            </div>

            {activeSession.preference && (
              <div style={{ fontSize: "0.74rem", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, padding: "8px 10px", borderRadius: "6px", lineHeight: "1.4" }}><strong style={{ color: theme.accent }}>{"🎭 관계성 지향:"}</strong><div style={{ color: theme.textMuted, marginTop: "2px" }}>{activeSession.preference}</div></div>
            )}

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}><h4 style={{ margin: 0, fontSize: "0.88rem", color: theme.accent }}>내 캐릭터</h4>{showPortraits && <button onClick={() => openModal(setShowPortraitEditModal)} style={{ padding: "2px 6px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.7rem", cursor: "pointer" }}>✏️ 변경</button>}</div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                {showPortraits && <div onClick={() => openModal(setShowPortraitEditModal)} style={{ position: "relative", width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.accent}`, flexShrink: 0, backgroundColor: theme.panelAlt, cursor: "pointer" }}><img src={activeSession.sheet.portrait || getPortraitUrl(activeSession.sheet.name)} alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} /></div>}
                <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "2px" }}><div><strong>{activeSession.sheet.name}</strong> ({activeSession.sheet.job || "모험가"})</div><div>HP: <strong>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>{activeSession.ruleMode === "coc" && <div>SAN: <strong>{activeSession.sheet.san} / 99</strong></div>}{activeSession.ruleMode === "dnd" && <div>AC: <strong>{activeSession.sheet.ac || 14}</strong></div>}</div>
              </div>
            </div>

            {activeSession.ruleMode === "insane" && (
              <><hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} /><div><h4 style={{ margin: "0 0 6px 0", fontSize: "0.85rem", color: theme.warning }}>{"내 사명 & 비밀"}</h4><div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "7px 9px", marginBottom: "6px", fontSize: "0.74rem" }}><div style={{ fontWeight: "bold", color: theme.accent }}>📜 사명:</div><div>{activeSession.sheet.mission}</div></div><div style={{ backgroundColor: "#2b1414", border: `1px solid ${theme.danger}`, borderRadius: "6px", padding: "7px 9px", fontSize: "0.74rem" }}><div style={{ fontWeight: "bold", color: theme.danger }}>🔒 비밀:</div><div style={{ color: "#fca5a5" }}>{activeSession.sheet.secret}</div></div></div></>
            )}

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

            <div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.85rem", color: theme.accent }}>{"주변 인물 & 호감도"}</h4>
              {(!activeSession.sheet.npcs || activeSession.sheet.npcs.length === 0) ? <div style={{ fontSize: "0.76rem", color: theme.textMuted }}>등장인물 없음</div> : activeSession.sheet.npcs.map((npc, idx) => (
                <div key={idx} style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "8px", marginBottom: "6px", fontSize: "0.76rem" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {showPortraits && <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", border: `1px solid ${theme.border}`, flexShrink: 0, backgroundColor: theme.panelAlt }}><img src={npc.portrait || getPortraitUrl(`${npc.name}, portrait`)} alt={npc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} /></div>}
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between" }}><span>{npc.name}</span><span style={{ color: theme.danger }}>♥ {npc.affection || 0}</span></div><div style={{ color: theme.textMuted, fontSize: "0.7rem" }}>{npc.state || npc.title || "동행자"}</div></div>
                  </div>
                  {activeSession.ruleMode === "insane" && (
                    <div style={{ marginTop: "6px", paddingTop: "4px", borderTop: `1px dashed ${theme.border}` }}>
                      {npc.secretRevealed ? <div style={{ backgroundColor: "#2b1414", border: `1px solid ${theme.danger}`, padding: "4px 6px", borderRadius: "4px", color: "#fca5a5", fontSize: "0.7rem" }}>🔓 {npc.secret}</div> : <div style={{ color: theme.textMuted, fontStyle: "italic", fontSize: "0.68rem" }}>🔒 비밀 잠김 (조사 성공 시 해금)</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                  <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: theme.accent }}>{"💾 세이브 데이터 관리 & 백업"}</span>
                  <button onClick={() => openModal(setShowRestoreHelpModal)} style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.accent, cursor: "pointer" }}>?</button>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => openModal(setShowBackupModal)} style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold" }}>💾 세이브 백업</button>
                  <label style={{ flex: 1, padding: "8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", fontWeight: "bold", textAlign: "center" }}>📤 파일 복원<input type="file" accept=".json" onChange={importSaveFile} style={{ display: "none" }} /></label>
                </div>
              </div>

              {/* 초상화 화풍 선택 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>👤 인물 초상화 (상태창)</div>
                  <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>우측 상태창에 얼굴 썸네일을 표시합니다.</div>
                </div>
                <button onClick={() => { setShowPortraits(!showPortraits); localStorage.setItem("rp_hub_show_portraits", (!showPortraits).toString()); }} style={{ padding: "6px 14px", backgroundColor: showPortraits ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}>
                  {showPortraits ? "ON" : "OFF"}
                </button>
              </div>

              {showPortraits && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>🎨 초상화 화풍 (스타일)</div>
                    <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>새로 생성되는 초상화의 그림체를 지정합니다.</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => { setPortraitStyle("anime"); localStorage.setItem("rp_hub_portrait_style", "anime"); }} style={{ padding: "4px 10px", backgroundColor: portraitStyle === "anime" ? theme.accent : "transparent", color: portraitStyle === "anime" ? "#fff" : theme.text, border: `1px solid ${theme.accent}`, borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}>애니풍</button>
                    <button onClick={() => { setPortraitStyle("realistic"); localStorage.setItem("rp_hub_portrait_style", "realistic"); }} style={{ padding: "4px 10px", backgroundColor: portraitStyle === "realistic" ? theme.accent : "transparent", color: portraitStyle === "realistic" ? "#fff" : theme.text, border: `1px solid ${theme.accent}`, borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}>실사풍</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.panelAlt, padding: "10px 12px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>💡 AI 답변 제안 칩</div>
                  <div style={{ fontSize: "0.72rem", color: theme.textMuted }}>입력창 위에 3가지 행동 제안 칩을 띄웁니다.</div>
                </div>
                <button onClick={() => { setSuggestionsEnabled(!suggestionsEnabled); localStorage.setItem("rp_hub_suggestions_enabled", (!suggestionsEnabled).toString()); }} style={{ padding: "6px 14px", backgroundColor: suggestionsEnabled ? theme.success : theme.border, color: "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}>
                  {suggestionsEnabled ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            <button onClick={() => closeModal(setShowSettingsModal)} style={{ marginTop: "24px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>닫기</button>
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
              <button onClick={() => setBackupFormat("json")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: `2px solid ${backupFormat === "json" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "json" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>JSON 파일 (.json)</button>
              <button onClick={() => setBackupFormat("txt")} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: `2px solid ${backupFormat === "txt" ? theme.accent : theme.border}`, backgroundColor: backupFormat === "txt" ? theme.panelAlt : "transparent", color: theme.text, cursor: "pointer" }}>텍스트 파일 (.txt)</button>
            </div>
            <button onClick={executeSaveBackup} style={{ width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>다운로드</button>
          </div>
        </div>
      )}

      {/* 복원 도움말 모달 */}
      {showRestoreHelpModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 130, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "460px", padding: "24px", color: theme.text }}>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "1.1rem", color: theme.accent }}>{"📖 세이브 백업 & 복원 안내"}</h3>
            <div style={{ fontSize: "0.82rem", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>• <strong>JSON (.json):</strong> 시트 수치와 대화가 완벽 보존되는 게임 파일입니다. [파일 복원]을 통해 다시 불러올 수 있습니다.</div>
              <div>• <strong>TXT (.txt):</strong> 스마트폰/메모장으로 소설처럼 편하게 읽을 수 있는 문서입니다.</div>
            </div>
            <button onClick={() => closeModal(setShowRestoreHelpModal)} style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>확인</button>
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
                <input type="text" value={customPortraitPrompt} onChange={(e) => setCustomPortraitPrompt(e.target.value)} placeholder="예: silver hair girl / 이미지 URL" style={{ width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box", marginBottom: "8px" }} />
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
            <button onClick={() => closeModal(setShowGuideModal)} style={{ marginTop: "18px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
