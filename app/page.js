"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 사이드바 및 상태창 토글
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // 마법사 설정값
  const [wizardMode, setWizardMode] = useState("coc");
  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("26");
  const [charGender, setCharGender] = useState("여성");
  const [charBackground, setCharBackground] = useState("");
  const [scenarioInput, setScenarioInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // CoC 7판 특성치 (합계 460 기본값)
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

  // 주사위 및 키퍼 판정 상태
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(12);
  const [targetStat, setTargetStat] = useState(50);
  const [pendingCheck, setPendingCheck] = useState(null); // 키퍼가 요구한 판정 정보

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

  const theme = isDarkMode
    ? {
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
      }
    : {
        bg: "#f4f6fa",
        sidebar: "#e8ecf4",
        panel: "#ffffff",
        panelAlt: "#f0f3fa",
        border: "#d0d6e6",
        text: "#242938",
        textMuted: "#727b94",
        accent: "#4368d4",
        danger: "#d13b5a",
        warning: "#d97706",
        success: "#3ba358",
        bubbleUser: "#4f75c2",
        bubbleAi: "#ffffff",
        inputBg: "#ffffff",
      };

  useEffect(() => {
    const saved = localStorage.getItem("rp_hub_sessions");
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("rp_hub_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // 세션 삭제 핸들러
  const deleteSession = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("이 시나리오 세션을 완전히 삭제하시겠습니까?")) return;
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) setActiveSessionId(null);
  };

  // TXT, MD 및 PDF 통합 파일 업로드 파서
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
        alert("PDF 문서를 읽는 중 문제가 발생했습니다: " + err.message);
      } finally {
        setIsPdfLoading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => setScenarioInput(event.target.result);
      reader.readAsText(file, "UTF-8");
    }
  };

  // 세션 생성 및 도입부 자동 생성
  const startNewSession = async () => {
    const isCoc = wizardMode === "coc";
    const sessionTitle = charName
      ? `${charName}의 여정`
      : uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : isCoc
      ? "새 CoC 조사"
      : "새 샌드박스 RP";

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
        }
      : {
          name: charName || "주인공",
          job: charJob,
          background: charBackground,
          hp: 20,
          maxHp: 20,
          npcs: [],
        };

    const newId = Date.now();
    const newSession = {
      id: newId,
      title: sessionTitle,
      ruleMode: wizardMode,
      scenarioText: scenarioInput,
      sheet: initialSheet,
      messages: [],
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setIsLoading(true);
    setPendingCheck(null);

    const openingPrompt = `[세션 시작: 시나리오 원문 및 인물 설정을 기반으로 현장의 도입부 서막을 문학적으로 서술하십시오. 
- 메타 발언, 챗봇 인사말, 객관식 번호 선택지를 일체 배제하십시오.
- 탐사자가 처한 공간의 공기, 냄새, 날씨와 함께 있는 인물들의 표정과 행동을 묘사하며 첫 위기나 대화 상황을 여십시오.]`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: openingPrompt }],
          scenarioText: scenarioInput,
          playerSheet: initialSheet,
          ruleMode: wizardMode,
        }),
      });

      const data = await response.json();
      let rawText = data.text || "서막을 불러오지 못했습니다.";
      let updatedSheet = { ...initialSheet };

      // 판정 요구 태그 파싱
      const checkMatch = rawText.match(/<!--CHECK:\s*({.*?})-->/s);
      if (checkMatch) {
        try {
          setPendingCheck(JSON.parse(checkMatch[1]));
        } catch (e) {
          console.error(e);
        }
        rawText = rawText.replace(/<!--CHECK:\s*({.*?})-->/s, "").trim();
      }

      // 상태 태그 파싱
      const statusMatch = rawText.match(/<!--STATUS:\s*({.*?})-->/s);
      if (statusMatch) {
        try {
          const parsed = JSON.parse(statusMatch[1]);
          if (parsed.hp !== undefined) updatedSheet.hp = parsed.hp;
          if (parsed.san !== undefined) updatedSheet.san = parsed.san;
          if (parsed.luck !== undefined) updatedSheet.luck = parsed.luck;
          if (parsed.npcs) updatedSheet.npcs = parsed.npcs;
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

  // 공통 대화 전송 코어 함수
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
        }),
      });

      const data = await response.json();
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

  // 수기 메시지 전송
  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    executeMessage(text);
  };

  // 조작 불가능한 시스템 공인 주사위 굴림 & 자동 전송
  const rollDiceDirectly = (overrideTarget = null, reasonText = "") => {
    if (isRolling || !activeSession) return;
    setIsRolling(true);
    setDiceResult(null);

    const isCoc = activeSession.ruleMode === "coc";
    const targetVal = Number(overrideTarget !== null ? overrideTarget : isCoc ? targetStat : targetDc);

    setTimeout(() => {
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
      // 입력창을 거치지 않고 위변조 불가능한 시스템 판정 메시지로 마스터에게 직행
      executeMessage(rollFormatted);
    }, 700);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      {/* 1. 좌측 시나리오 목록 (삭제 휴지통 버튼 탑재) */}
      <div
        style={{
          width: isSidebarOpen ? "250px" : "0px",
          minWidth: isSidebarOpen ? "250px" : "0px",
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
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ padding: "8px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}
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
                title="시나리오 세션 삭제"
                style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", padding: "4px", fontSize: "0.9rem" }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 중앙 메인 뷰 */}
      <div style={{ flex: 1, minWidth: "320px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {!activeSession ? (
          /* 세션 생성 마법사 (PDF 파서 포함) */
          <div style={{ flex: 1, overflowY: "auto", padding: "30px 25px 60px 25px", maxWidth: "680px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ padding: "6px 10px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}
              >
                {isSidebarOpen ? "◀ 목록 닫기" : "▶ 목록 열기"}
              </button>
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>새로운 세션 구성</h2>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>진행 룰 선택</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setWizardMode("d20")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: `2px solid ${wizardMode === "d20" ? theme.accent : theme.border}`,
                    backgroundColor: wizardMode === "d20" ? theme.panel : "transparent",
                    color: theme.text,
                    cursor: "pointer",
                  }}
                >
                  <strong>1D20 자유 서사</strong>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>자유 샌드박스 / 직관적 DC 판정</div>
                </button>

                <button
                  type="button"
                  onClick={() => setWizardMode("coc")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: `2px solid ${wizardMode === "coc" ? theme.danger : theme.border}`,
                    backgroundColor: wizardMode === "coc" ? theme.panel : "transparent",
                    color: theme.text,
                    cursor: "pointer",
                  }}
                >
                  <strong>CoC 1D100 정규 룰</strong>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>크툴루 7판 / SAN & 특성치 관리</div>
                </button>
              </div>
            </div>

            {/* 시나리오 문서 업로드 (PDF, TXT, MD 지원) */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>
                📁 시나리오 문서 등록 (.pdf, .txt, .md 지원)
              </span>
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
                  placeholder="파일을 선택하면 내용이 자동으로 채워집니다. 직접 배경 설정을 적으셔도 됩니다."
                  style={{ width: "100%", height: "85px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* 내 캐릭터 정보 */}
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
                  placeholder="성격, 비밀, 과거의 트라우마, 소지품, 추구하는 가치관 등을 상세히 적어주세요."
                  style={{ width: "100%", height: "70px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* CoC 7판 특성치 배분창 */}
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
          /* 실제 롤플레잉 플레이 화면 */
          <>
            {/* 상단 컨트롤 바 */}
            <div style={{ padding: "8px 15px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  {isSidebarOpen ? "◀ 목록" : "▶ 목록"}
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
                  🎲 {activeSession.ruleMode === "coc" ? "1D100 판정 굴리기" : "1D20 판정 굴리기"}
                </button>
                <button
                  onClick={() => setIsSheetOpen(!isSheetOpen)}
                  style={{ padding: "5px 8px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  {isSheetOpen ? "시트 닫기 ▶" : "◀ 시트 열기"}
                </button>
              </div>
            </div>

            {/* 키퍼의 판정 제안 알림 배너 (출현 시 즉시 원클릭 판정 가능) */}
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

            {/* 최근 주사위 결과 브리핑 */}
            {diceResult && (
              <div style={{ backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}`, padding: "6px 15px", fontSize: "0.82rem", display: "flex", justifyContent: "space-between" }}>
                <span>🎲 {diceResult.type} 결과: <strong>{diceResult.roll}</strong> (판정치: {diceResult.target})</span>
                <span style={{ color: diceResult.outcome.includes("성공") ? theme.success : theme.danger, fontWeight: "bold" }}>{diceResult.outcome}</span>
              </div>
            )}

            {/* 대화 히스토리 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
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

            {/* 입력창 (주사위와 완전히 분리되어 지문/대사만 타이핑) */}
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
                placeholder="지문이나 대사를 입력하세요 (주사위는 상단 전용 버튼을 이용하세요)..."
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
            width: isSheetOpen ? "240px" : "0px",
            minWidth: isSheetOpen ? "240px" : "0px",
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
          <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", width: "240px", boxSizing: "border-box" }}>
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

            {activeSession.sheet.background && (
              <div>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "3px" }}>배경/설정:</div>
                <div style={{ fontSize: "0.8rem", backgroundColor: theme.panel, padding: "6px", borderRadius: "4px", lineHeight: "1.4" }}>
                  {activeSession.sheet.background}
                </div>
              </div>
            )}

            <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

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

      {/* 4. CoC 룰 가이드 모달 */}
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
                <div>• 성인 기준 평균치는 50이며, 범위는 15~90 사이로 설정합니다.</div>
              </div>

              <div>
                <strong>2. 성공 등급 판정 (1D100)</strong>
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
