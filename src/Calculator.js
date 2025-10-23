import React, { useState, useEffect } from "react";
import "./App.css";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    // Fetch history from backend on load
    fetch(`${API_URL}/history`)
      .then(res => res.json())
      .then(data => setHistory(data));
    
    // Keyboard input support
    const handleKeyDown = (e) => {
      const allowed = "0123456789+-*/().";
      if (allowed.includes(e.key)) setInput((prev) => prev + e.key);
      if (e.key === "Enter") handleCalculate();
      if (e.key === "Backspace") setInput((prev) => prev.slice(0, -1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClick = (value) => setInput((prev) => prev + value);

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleCalculate = async () => {
    try {
      const res = await fetch(`${API_URL}/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression: input }),
      });
      const data = await res.json();
      if (data.result !== undefined) {
        setResult(data.result);
        setHistory(data.history);
      } else setResult("Error");
    } catch {
      setResult("Error");
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const scientificButtons = ["sin(","cos(","tan(","log(","sqrt(","^"];

  return (
    <div className={`calculator-container ${darkMode ? "dark" : "light"}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <div className="calculator">
        <input type="text" value={input} readOnly placeholder="0" />
        <div className="buttons">
          {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === "=" ? handleCalculate() : handleClick(btn))}
            >
              {btn}
            </button>
          ))}
          {scientificButtons.map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
          ))}
          <button onClick={handleClear}>C</button>
        </div>
        <div className="result">Result: {result}</div>
        <div className="history">
          <h3>History (last 20)</h3>
          {history.map((h, idx) => (
            <div key={idx}>{h.expression} = {h.result}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
