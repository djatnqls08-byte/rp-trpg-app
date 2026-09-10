"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [wizardMode, setWizardMode] = useState("d20");
  const [charName, setCharName] = useState("");
  const [scenarioInput, setScenarioInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const [cocStats, setCocStats] = useState({
    hp: 10,
    san: 50,
    luck: 50,
    str: 50,
    con: 50,
    dex: 50,
    pow: 50,
    app: 50,
  });

  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [targetDc, setTargetDc] = useState(12);
  const [targetStat, setTargetStat] = useState(50);

  const theme = isDarkMode
    ? {
        bg: "#0f111a",
        sidebar: "#161822",
        panel: "#1e2130",
        border: "#2b2f44",
        text: "#e1e4ee",
        textMuted: "#8a90a6",
        accent: "#7aa2f7",
        danger: "#f7768e",
        success: "#9ece6a",
        bubbleUser: "#3d59a1",
        bubbleAi: "#1e2130",
        inputBg: "#161822",
      }
    : {
        bg: "#f8f9fc",
        sidebar: "#ebedf5",
        panel: "#ffffff",
        border: "#d5d9e6",
        text: "#2c3142",
        textMuted: "#798299",
        accent: "#4c77cc",
        danger: "#c53b53",
        success: "#4e8c3e",
        bubbleUser: "#5a7fb9",
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
      ? `${charName}의 이야기`
      : uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : isCoc
      ? "새 CoC 탐사"
      : "새 자유 서사";

    const newSession = {
      id: Date.now(),
      title: sessionTitle,
      ruleMode: wizardMode,
      scenarioText: scenarioInput,
      sheet: isCoc
        ? {
            name: charName || "탐사자",
            hp: Number(cocStats.hp),
            maxHp: Number(cocStats.hp),
            san: Number(cocStats.san),
            maxSan: 99,
            luck: Number(cocStats.luck),
            str: Number(cocStats.str),
            con: Number(cocStats.con),
            dex: Number(cocStats.dex),
            pow: Number(cocStats.pow),
            app: Number(cocStats.app),
            npcs: [],
          }
        : {
            name: charName || "주인공",
            hp: 20,
            maxHp: 20,
            npcs: [],
          },
      messages: [
        {
          role: "model",
          text: isCoc
            ? `수호자가 배경을 정돈했습니다. 탐사자 [${charName || "플레이어"}]의 조사가 시작됩니다. 현재 눈앞에 펼쳐진 상황에 어떻게 대응하시겠습니까?`
            : `이야기가 준비되었습니다. [${charName || "주인공"}]의 여정이 시작됩니다. 어떤 행동으로 첫 장을 열겠습니까?`,
        },
      ],
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setScenarioInput("");
    setCharName("");
    setUploadedFileName("");
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
        setInput((prev) => `${prev} [1D100 판정 결과: ${roll} / 목표치: ${target} -> ${outcome}] `);
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
    }, 1000);
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
        alert(`API 응답 오류: ${data.error || "서버 응답이 비어 있습니다."}`);
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
          console.error("태그 파싱 오류:", e);
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
      <div style={{ width: "260px", backgroundColor: theme.sidebar, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "15px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveSessionId(null)}
            style={{ flex: 1, padding: "8px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            + 새 시나리오
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ padding: "8px 12px", backgroundColor: theme.panel, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: "6px", cursor: "pointer" }}
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
              <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                모드: {s.ruleMode === "coc" ? "CoC 1D100" : "1D20 자유 서사"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {!activeSession ? (
          <div style={{ flex: 1, overflowY: "auto", padding: "40px", maxWidth: "650px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ margin: 0 }}>새로운 롤플레잉 설정</h2>
            
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
                  <strong>CoC 1D100 룰</strong>
                  <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "4px" }}>크툴루 정규 탐사 / SAN 수치 관리</div>
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: theme.textMuted }}>내 캐릭터 이름</label>
              <input
                type="text"
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
                placeholder="예: 사반"
                style={{ width: "100%", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, boxSizing: "border-box" }}
              />
            </div>

            {wizardMode === "coc" && (
              <div style={{ backgroundColor: theme.panel, padding: "15px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                <div style={{ fontWeight: "bold", fontSize: "0.9rem", marginBottom: "12px", color: theme.danger }}>CoC 탐사자 특성치 입력</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {Object.keys(cocStats).map((statKey) => (
                    <div key={statKey}>
                      <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: theme.textMuted }}>{statKey}</label>
                      <input
                        type="number"
                        value={cocStats[statKey]}
                        onChange={(e) => setCocStats({ ...cocStats, [statKey]: e.target.value })}
                        style={{ width: "100%", padding: "6px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "4px", color: theme.text, boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ backgroundColor: theme.panel, padding: "15px", borderRadius: "8px", border: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "0.85rem", color: theme.accent }}>
                  📁 시나리오 파일 불러오기 (.txt, .md)
                </label>
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  style={{ display: "block", width: "100%", padding: "8px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.85rem", cursor: "pointer", boxSizing: "border-box" }}
                />
                {uploadedFileName && (
                  <div style={{ fontSize: "0.75rem", color: theme.success, marginTop: "4px" }}>
                    ✓ 로드 완료: {uploadedFileName}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: theme.textMuted }}>시나리오 내용</label>
                <textarea
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  placeholder="시나리오 문서를 불러오거나 직접 설정을 적어주세요."
                  style={{ width: "100%", height: "120px", padding: "10px", backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <button
              onClick={startNewSession}
              style={{ padding: "14px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
            >
              이야기 시작하기
            </button>
          </div>
        ) : (
          <>
            <div style={{ padding: "10px 20px", backgroundColor: theme.sidebar, borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold" }}>{activeSession.title}</span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", color: theme.textMuted }}>
                  {activeSession.ruleMode === "coc" ? "목표치:" : "DC:"}
                </span>
                <input
                  type="number"
                  value={activeSession.ruleMode === "coc" ? targetStat : targetDc}
                  onChange={(e) =>
                    activeSession.ruleMode === "coc"
                      ? setTargetStat(e.target.value)
                      : setTargetDc(e.target.value)
                  }
                  style={{ width: "50px", padding: "4px", backgroundColor: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "4px" }}
                />
                <button
                  onClick={rollDice}
                  disabled={isRolling}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: activeSession.ruleMode === "coc" ? theme.danger : theme.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🎲 {activeSession.ruleMode === "coc" ? "1D100 판정" : "1D20 판정"}
                </button>
              </div>
            </div>

            {diceResult && (
              <div style={{ backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}`, padding: "8px 20px", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                <span>
                  🎲 {diceResult.type} 결과: <strong>{diceResult.roll}</strong> (기준: {diceResult.target})
                </span>
                <span style={{ color: diceResult.outcome.includes("성공") ? theme.success : theme.danger, fontWeight: "bold" }}>
                  {diceResult.outcome}
                </span>
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
              {isLoading && <div style={{ color: theme.textMuted, fontSize: "0.9rem" }}>생각하는 중...</div>}
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
              <button
                onClick={sendMessage}
                style={{ padding: "0 20px", backgroundColor: theme.accent, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
              >
                전송
              </button>
            </div>
          </>
        )}
      </div>

      {activeSession && (
        <div style={{ width: "230px", backgroundColor: theme.sidebar, borderLeft: `1px solid ${theme.border}`, padding: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: theme.accent }}>캐릭터 정보</h4>
            <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div>이름: <strong>{activeSession.sheet.name}</strong></div>
              <div>HP: <strong>{activeSession.sheet.hp} / {activeSession.sheet.maxHp}</strong></div>
              {activeSession.ruleMode === "coc" && (
                <>
                  <div>SAN: <strong>{activeSession.sheet.san} / 99</strong></div>
                  <div>LUCK: <strong>{activeSession.sheet.luck}</strong></div>
                </>
              )}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${theme.border}`, margin: 0 }} />

          <div style={{ flex: 1, overflowY: "auto" }}>
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
    </div>
  );
}
