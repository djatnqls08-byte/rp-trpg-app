"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 접힘 상태
  const [showGuideModal, setShowGuideModal] = useState(false); // CoC 가이드북 모달

  // 세션 생성 마법사 상태
  const [wizardMode, setWizardMode] = useState("d20"); // "d20" | "coc"
  const [charName, setCharName] = useState("");
  const [charJob, setCharJob] = useState("");
  const [charAge, setCharAge] = useState("25");
  const [charGender, setCharGender] = useState("");
  const [charBackground, setCharBackground] = useState(""); // 캐릭터 상세 설정
  const [scenarioInput, setScenarioInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // CoC 7판 8대 특성치 (기본값 합계 460)
  const [cocStats, setCocStats] = useState({
    str: 50, // 근력
    con: 50, // 건강
    siz: 65, // 크기
    dex: 60, // 민첩
    app: 60, // 외모
    int: 70, // 지능
    pow: 65, // 정신력
    edu: 40, // 교육
    luck: 50, // 행운 (포인트 풀 제외)
  });

  // 주사위 상태
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(12);
  const [targetStat, setTargetStat] = useState(50);

  // CoC 특성치 포인트 계산 (표준 포인트 풀: 460)
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

  // 파생 수치 실시간 계산 (룰북 공식)
  const derivedHp = Math.floor((Number(cocStats.con) + Number(cocStats.siz)) / 10);
  const derivedMp = Math.floor(Number(cocStats.pow) / 5);
  const derivedSan = Number(cocStats.pow);
  
  // 피해 보너스(DB) 및 체구(Build)
  const strPlusSiz = Number(cocStats.str) + Number(cocStats.siz);
  let derivedDb = "0";
  let derivedBuild = 0;
  if (strPlusSiz <= 64) { derivedDb = "-2"; derivedBuild = -2; }
  else if (strPlusSiz <= 84) { derivedDb = "-1"; derivedBuild = -1; }
  else if (strPlusSiz <= 124) { derivedDb = "0"; derivedBuild = 0; }
  else if (strPlusSiz <= 164) { derivedDb = "+1D4"; derivedBuild = 1; }
  else { derivedDb = "+1D6"; derivedBuild = 2; }

  // 이동력 (MOV)
  let derivedMov = 8;
  if (Number(cocStats.dex) < Number(cocStats.siz) && Number(cocStats.str) < Number(cocStats.siz)) derivedMov = 7;
  else if (Number(cocStats.str) >= Number(cocStats.siz) && Number(cocStats.dex) >= Number(cocStats.siz)) derivedMov = 9;

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => setScenarioInput(event.target.result);
    reader.readAsText(file, "UTF-8");
  };

  const startNewSession = () => {
    const isCoc = wizardMode === "coc";
    const sessionTitle = charName
      ? `${charName}의 여정`
      : uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : isCoc
      ? "새 CoC 조사"
      : "새 샌드박스 RP";

    const newSession = {
      id: Date.now(),
      title: sessionTitle,
      ruleMode: wizardMode,
      scenarioText: scenarioInput,
      sheet: isCoc
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
            mov: derivedMov,
            stats: { ...cocStats },
            npcs: [],
          }
        : {
            name: charName || "주인공",
            job: charJob,
            background: charBackground,
            hp: 20,
            maxHp: 20,
            npcs: [],
          },
      messages: [
        {
          role: "model",
          text: isCoc
            ? `수호자가 막을 올립니다. 탐사자 [${charName || "플레이어"}](${charJob || "조사원"})의 조사가 시작됩니다. 어떤 행동을 취하시겠습니까?`
            : `이야기가 준비되었습니다. [${charName || "주인공"}]의 서사가 펼쳐집니다. 어떤 행동으로 시작하시겠습니까?`,
        },
      ],
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setScenarioInput("");
    setCharName("");
    setCharBackground("");
  };

  const rollDice = () => {
    if (isRolling || !activeSession) return;
    setIsRolling(true);
    setDiceResult(null);

    const isCoc = activeSession.ruleMode === "coc";

    setTimeout(() => {
      if (isCoc) {
        const roll = Math.floor(Math.random() * 100) + 1;
        const target = Number(targetStat);
        let outcome = "";

        if (roll === 1) outcome = "대성공 (Critical)";
        else if (roll <= Math.floor(target / 5)) outcome = "극단적 성공 (Extreme)";
        else if (roll <= Math.floor(target / 2)) outcome = "어려운 성공 (Hard)";
        else if (roll <= target) outcome = "보통 성공 (Regular)";
        else if (roll >= 96 && target < 50) outcome = "대실패 (Fumble)";
        else if (roll === 100) outcome = "대실패 (Fumble)";
        else outcome = "실패 (Failure)";

        setDiceResult({ roll, outcome, target, type: "1D100" });
        setInput((prev) => `${prev} [1D100 결과: ${roll} / 판정치: ${target} -> ${outcome}] `);
      } else {
        const roll = Math.floor(Math.random() * 20) + 1;
        const dc = Number(targetDc);
        let outcome = "";

        if (roll === 20) outcome = "대성공 (Natural 20)";
        else if (roll === 1) outcome = "대실패 (Natural 1)";
        else if (roll >= dc) outcome = "성공";
        else outcome = "실패";

        setDiceResult({ roll, outcome, target: dc, type: "1D20" });
        setInput((prev) => `${prev} [1D20 결과: ${roll} (DC ${dc}) -> ${outcome}] `);
      }
      setIsRolling(false);
    }, 900);
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession) return;

    const userText = input;
    setInput("");
    const updatedMessages = [...activeSession.messages, { role: "user", text: userText }];

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
        alert(`API 오류: ${data.error || "서버 응답이 없습니다."}`);
        setIsLoading(false);
        return;
      }

      let rawText = data.text;
      let newSheet = { ...activeSession.sheet };

      const statusMatch = rawText.match(/<!--STATUS:\s*({.*?})-->/s);
      if (statusMatch) {
        try {
          const parsed = JSON.parse(statusMatch[1]);
          if (parsed.hp !== undefined) newSheet.hp = parsed.hp;
          if (parsed.san !== undefined) newSheet.san = parsed.san;
          if (parsed.luck !== undefined) newSheet.luck = parsed.luck;
          if (parsed.npcs) newSheet.npcs = parsed.npcs;
        } catch (e) {
          console.error("태그 파싱 에러:", e);
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
      alert(`네트워크 통신 오류: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "system-ui, sans-serif" }}>
      {/* 1. 사이드바 (접기/펼치기 지원) */}
      <div
        style={{
          width: isSidebarOpen ? "260px" : "0px",
          transition: "width 0.25s ease",
          overflow: "hidden",
          backgroundColor: theme.sidebar,
          borderRight: isSidebarOpen ? `1px solid ${theme.border}` : "none",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ padding: "15px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
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
                padding: "12px 15px",
                cursor: "pointer",
                borderBottom: `1px solid ${theme.border}`,
                backgroundColor: activeSessionId === s.id ? theme.panel : "transparent",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{s.title}</div>
              <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "2px" }}>
                {s.ruleMode === "coc" ? "CoC 7판 정규" : "1D20 자유 서사"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 중앙 메인 영역 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* 상단 윙(사이드바) 접기/열기 플로팅 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "사이드바 접기" : "사이드바 펼치기"}
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 10,
            padding: "6px 9px",
            backgroundColor: theme.panel,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          {isSidebarOpen ? "◀" : "▶"}
        </button>

        {!activeSession ? (
          /* 시나리오 생성 마법사 */
          <div style={{ flex: 1, overflowY: "auto", padding: "30px 40px 60px 55px", maxWidth: "720px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ margin: "0 0 5px 0" }}>새로운 세션 구성</h2>

            {/* 진행 룰 선택 */}
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
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>크랙 스타일 / 발더스 게이트식 자유 전개</div>
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
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>크툴루의 부름 7판 / SAN & 특성치 관리</div>
                </button>
              </div>
            </div>

            {/* 시나리오 문서 등록 영역 */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>📁 시나리오 문서 불러오기 (.txt, .md)</span>
              </div>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                style={{ display: "block", width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem", cursor: "pointer", boxSizing: "border-box" }}
              />
              {uploadedFileName && <div style={{ fontSize: "0.75rem", color: theme.success }}>✓ 파일 내용이 자동 로드되었습니다: {uploadedFileName}</div>}
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "0.8rem", color: theme.textMuted }}>시나리오 본문</label>
                <textarea
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  placeholder="파일을 선택하면 내용이 채워집니다. 직접 배경을 적어도 좋습니다."
                  style={{ width: "100%", height: "90px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* 내 캐릭터 기본 정보 & 백스토리 (세분화) */}
            <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>내 캐릭터 정보</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.8fr 0.8fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>캐릭터 이름</label>
                  <input
                    type="text"
                    value={charName}
                    onChange={(e) => setCharName(e.target.value)}
                    placeholder="예: 사반"
                    style={{ width: "100%", padding: "7px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: theme.textMuted }}>직업</label>
                  <input
                    type="text"
                    value={charJob}
                    onChange={(e) => setCharJob(e.target.value)}
                    placeholder="예: 고서적 감정사"
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
                <label style={{ display: "block", marginBottom: "4px", fontSize: "0.75rem", color: theme.textMuted }}>내 캐릭터 설정 및 백스토리</label>
                <textarea
                  value={charBackground}
                  onChange={(e) => setCharBackground(e.target.value)}
                  placeholder="인물의 성격, 비밀, 버릇, 소지품, 추구하는 목적 등을 상세히 적어주세요."
                  style={{ width: "100%", height: "80px", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* CoC 전용 7판 특성치 배분창 + 가이드북 버튼 */}
            {wizardMode === "coc" && (
              <div style={{ backgroundColor: theme.panel, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: theme.danger }}>CoC 7판 특성치 배분</span>
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(true)}
                    style={{ padding: "4px 10px", backgroundColor: theme.panelAlt, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.accent, fontSize: "0.8rem", cursor: "pointer" }}
                  >
                    📖 CoC 7판 룰 가이드
                  </button>
                </div>

                <div style={{ fontSize: "0.8rem", display: "flex", justifyContent: "space-between", padding: "6px 10px", backgroundColor: theme.panelAlt, borderRadius: "6px" }}>
                  <span>표준 포인트 한계: <strong>460 pt</strong></span>
                  <span style={{ color: remainingPoints < 0 ? theme.danger : theme.success, fontWeight: "bold" }}>
                    남은 포인트: {remainingPoints} pt {remainingPoints < 0 ? "(초과됨)" : ""}
                  </span>
                </div>

                {/* 8대 특성치 그리드 */}
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
                        style={{ width: "100%", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>

                {/* 행운 및 자동 계산된 파생 수치 요약 */}
                <div style={{ padding: "8px 12px", backgroundColor: theme.inputBg, borderRadius: "6px", fontSize: "0.78rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                  <div>행운(LUCK): <input type="number" value={cocStats.luck} onChange={(e) => setCocStats({ ...cocStats, luck: e.target.value })} style={{ width: "42px", padding: "2px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "3px" }} /></div>
                  <div>체력(HP): <strong>{derivedHp}</strong></div>
                  <div>마력(MP): <strong>{derivedMp}</strong></div>
                  <div>초기 이성(SAN): <strong>{derivedSan}</strong></div>
                  <div>DB / 체구: <strong>{derivedDb} / {derivedBuild}</strong></div>
                  <div>이동력: <strong>{derivedMov}</strong></div>
                </div>
              </div>
            )}

            <button
              onClick={startNewSession}
              style={{ padding: "14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
            >
              이야기 시작하기
            </button>
          </div>
        ) : (
          /* 활성 대화방 인터페이스 */
          <>
            <div style={{ padding: "10px 20px 10px 50px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold" }}>{activeSession.title}</span>

              {/* 판정 다이얼로그 */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>{activeSession.ruleMode === "coc" ? "목표치:" : "목표 DC:"}</span>
                <input
                  type="number"
                  value={activeSession.ruleMode === "coc" ? targetStat : targetDc}
                  onChange={(e) => activeSession.ruleMode === "coc" ? setTargetStat(e.target.value) : setTargetDc(e.target.value)}
                  style={{ width: "48px", padding: "4px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "4px" }}
                />
                <button
                  onClick={rollDice}
                  disabled={isRolling}
                  style={{ padding: "6px 14px", backgroundColor: activeSession.ruleMode === "coc" ? theme.danger : theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  🎲 {activeSession.ruleMode === "coc" ? "1D100 판정" : "1D20 판정"}
                </button>
              </div>
            </div>

            {diceResult && (
              <div style={{ backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}`, padding: "8px 20px", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                <span>🎲 {diceResult.type} 결과: <strong>{diceResult.roll}</strong> (판정치: {diceResult.target})</span>
                <span style={{ color: diceResult.outcome.includes("성공") ? theme.success : theme.danger, fontWeight: "bold" }}>{diceResult.outcome}</span>
              </div>
            )}

            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
              {activeSession.messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: m.role === "user" ? theme.bubbleUser : theme.bubbleAi,
                    color: m.role === "user" ? "#ffffff" : theme.text,
                    border: m.role === "model" ? `1px solid ${theme.border}` : "none",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    maxWidth: "80%",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
              ))}
              {isLoading && <div style={{ color: theme.textMuted, fontSize: "0.9rem" }}>마스터가 서사를 구성하는 중...</div>}
            </div>

            <div style={{ padding: "15px", backgroundColor: theme.sidebar, borderTop: `1px solid ${theme.border}`, display: "flex", gap: "10px" }}>
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
                style={{ flex: 1, height: "50px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px", resize: "none", outline: "none", boxSizing: "border-box" }}
              />
              <button onClick={sendMessage} style={{ padding: "0 20px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                전송
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3. 우측 상태창 (세션 활성화 시) */}
      {activeSession && (
        <div style={{ width: "240px", backgroundColor: theme.sidebar, borderLeft: `1px solid ${theme.border}`, padding: "15px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto" }}>
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: theme.accent }}>캐릭터 정보</h4>
            <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "5px" }}>
              <div>이름: <strong>{activeSession.sheet.name}</strong> ({activeSession.sheet.job || "무직"})</div>
              <div>HP: <strong>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>
              {activeSession.ruleMode === "coc" && (
                <>
                  <div>SAN: <strong>{activeSession.sheet.san} / 99</strong></div>
                  <div>MP: <strong>{activeSession.sheet.mp} / {activeSession.sheet.maxMp}</strong></div>
                  <div>LUCK: <strong>{activeSession.sheet.luck}</strong></div>
                  <div>DB / 체구: <strong>{activeSession.sheet.db} / {activeSession.sheet.build}</strong></div>
                </>
              )}
            </div>
          </div>

          {activeSession.sheet.background && (
            <div>
              <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "4px" }}>배경/특징:</div>
              <div style={{ fontSize: "0.8rem", backgroundColor: theme.panel, padding: "6px", borderRadius: "4px", lineHeight: "1.4" }}>
                {activeSession.sheet.background}
              </div>
            </div>
          )}

          <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: theme.accent }}>주변 인물 호감도</h4>
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
      )}

      {/* CoC 7판 가이드북 팝업 모달 */}
      {showGuideModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "10px", width: "100%", maxWidth: "560px", maxHeight: "80vh", overflowY: "auto", padding: "24px", color: theme.text }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, color: theme.danger }}>📖 CoC 7판 룰 & 캐릭터 가이드</h3>
              <button onClick={() => setShowGuideModal(false)} style={{ background: "none", border: "none", color: theme.text, fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ fontSize: "0.85rem", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <strong>1. 특성치 포인트 배분 원칙</strong>
                <div>• 총 8대 특성치 합계는 <strong>460 포인트</strong>를 기본으로 합니다.</div>
                <div>• 일반 인간의 수치 범위는 <strong>15 ~ 90</strong> 사이로 설정합니다 (평균 성인 50).</div>
              </div>

              <div>
                <strong>2. 성공 등급 판정 (1D100)</strong>
                <div>• <strong>보통 성공:</strong> 목표치 이하 (기본 성공)</div>
                <div>• <strong>어려운 성공:</strong> 목표치의 1/2 이하</div>
                <div>• <strong>극단적 성공:</strong> 목표치의 1/5 이하</div>
                <div>• <strong>대성공(Critical):</strong> 주사위 눈 01</div>
                <div>• <strong>대실패(Fumble):</strong> 목표치 50 미만 시 96~100, 목표치 50 이상 시 100</div>
              </div>

              <div>
                <strong>3. 파생 수치 계산 공식</strong>
                <div>• <strong>체력(HP):</strong> (건강 CON + 크기 SIZ) ÷ 10 (버림)</div>
                <div>• <strong>마력(MP):</strong> 정신력 POW ÷ 5 (버림)</div>
                <div>• <strong>초기 이성(SAN):</strong> 정신력 POW 수치와 동일</div>
              </div>

              <div>
                <strong>4. 이성(SAN) 체크 & 광기</strong>
                <div>• 공포스러운 대상을 목격하면 키퍼가 SAN 체크를 요구합니다.</div>
                <div>• 한 번에 5 이상의 SAN이 깎이면 <strong>일시적 광기</strong>가 발현됩니다.</div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
