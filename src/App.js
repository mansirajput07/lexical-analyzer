import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { languageDefinitions } from './languageDefinitions';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { saveAs } from 'file-saver';

function App() {
  const [code, setCode] = useState('');
  const [tokens, setTokens] = useState([]);
  const [language, setLanguage] = useState('c');
  const [tokenStats, setTokenStats] = useState({});
  const [showStats, setShowStats] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (code) {
      try {
        analyzeCode();
      } catch (error) {
        console.error("Error analyzing code:", error);
        // Optionally show an error message to the user
      }
    }
  }, [language, code]);

  const analyzeCode = () => {
    const tokens = tokenize(code, language);
    setTokens(tokens);
    calculateStats(tokens);
    
    // Save to history
    if (code.trim() && (history.length === 0 || history[history.length - 1].code !== code)) {
      const newHistory = [...history, { code, language, timestamp: new Date().toISOString() }];
      if (newHistory.length > 20) newHistory.shift(); // Keep last 20 items
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const calculateStats = (tokens) => {
    const stats = {
      total: tokens.length,
      byType: {},
      mostCommon: { type: '', count: 0 },
      lines: code.split('\n').length
    };

    tokens.forEach(token => {
      if (!stats.byType[token.type]) {
        stats.byType[token.type] = 0;
      }
      stats.byType[token.type]++;
    });

    // Find most common token type
    Object.entries(stats.byType).forEach(([type, count]) => {
      if (count > stats.mostCommon.count) {
        stats.mostCommon = { type, count };
      }
    });

    setTokenStats(stats);
  };

  const tokenize = (code, language) => {
    const langDef = languageDefinitions[language];
    if (!langDef || !code) return [];
  
    const tokens = [];
    let remainingCode = code;
    let lineNum = 1;
    let position = 0;
    let lastPos = 0;
  
    while (remainingCode.length > 0) {
      let matched = false;
      
      // Try each token specification in order
      for (const [kind, pattern] of langDef.specifications) {
        const regex = new RegExp(`^(${pattern})`, 'g');
        const match = regex.exec(remainingCode);
        
        if (match) {
          const value = match[0];
          position = code.length - remainingCode.length;
          
          // Count newlines
          if (kind === 'WHITESPACE') {
            const newlines = (value.match(/\n/g) || []).length;
            lineNum += newlines;
          } else if (kind === 'COMMENT') {
            const newlines = (value.match(/\n/g) || []).length;
            lineNum += newlines;
          } else {
            // Add token for non-whitespace and non-comments
            tokens.push({
              type: kind,
              value: value,
              line: lineNum,
              position: position
            });
          }
          
          // Move forward in the remaining code
          remainingCode = remainingCode.substring(value.length);
          matched = true;
          break;
        }
      }
      
      // If nothing matched, skip this character
      if (!matched) {
        remainingCode = remainingCode.substring(1);
      }
    }
  
    return tokens;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
    };
    reader.readAsText(file);
  };

  const downloadResults = () => {
    let content = `Lexical Analysis Results\n`;
    content += `Language: ${language.toUpperCase()}\n`;
    content += `Timestamp: ${new Date().toISOString()}\n\n`;
    content += `CODE:\n${code}\n\n`;
    content += `TOKENS:\n`;
    tokens.forEach(token => {
      content += `Type: ${token.type}, Value: "${token.value}", Line: ${token.line}, Position: ${token.position}\n`;
    });
    content += `\nSTATISTICS:\n`;
    content += `Total tokens: ${tokenStats.total}\n`;
    content += `Lines of code: ${tokenStats.lines}\n`;
    content += `Token types: ${JSON.stringify(tokenStats.byType)}\n`;
    content += `Most common token: ${tokenStats.mostCommon.type} (${tokenStats.mostCommon.count} occurrences)\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `lexical-analysis-${new Date().getTime()}.txt`);
  };

  const handleHistoryNavigation = (index) => {
    if (index >= 0 && index < history.length) {
      setCode(history[index].code);
      setLanguage(history[index].language);
      setHistoryIndex(index);
    }
  };

  const handleClearAll = () => {
    setCode('');
    setTokens([]);
    setTokenStats({});
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`app ${theme}`}>
      <nav className="navbar">
        <div className="logo">Lexical Analyzer Pro</div>
        <div className="controls">
          <button onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="c">C</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
      </nav>

      <div className="main-content">
        <div className="code-container">
          <div className="code-header">
            <h3>Code Editor</h3>
            <div className="editor-controls">
              <button onClick={() => setShowLineNumbers(!showLineNumbers)}>
                {showLineNumbers ? 'Hide Line Numbers' : 'Show Line Numbers'}
              </button>
              <div className="font-size-control">
                <button onClick={() => setFontSize(Math.max(8, fontSize - 2))}>-</button>
                <span>{fontSize}px</span>
                <button onClick={() => setFontSize(fontSize + 2)}>+</button>
              </div>
            </div>
          </div>
          <div className="code-editor">
            <SyntaxHighlighter 
              language={language} 
              style={dracula}
              showLineNumbers={showLineNumbers}
              customStyle={{ fontSize: `${fontSize}px` }}
            >
              {code}
            </SyntaxHighlighter>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code here..."
              className="code-textarea"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>
          <div className="action-buttons">
            <button onClick={analyzeCode}>Analyze</button>
            <button onClick={handleClearAll}>Clear</button>
            <button onClick={() => fileInputRef.current.click()}>
              Upload File
            </button>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".txt,.js,.py,.java,.c,.cpp,.html,.css"
            />
            <button onClick={downloadResults}>Download Results</button>
            <button onClick={() => setShowStats(!showStats)}>
              {showStats ? 'Hide Statistics' : 'Show Statistics'}
            </button>
          </div>
        </div>

        <div className="results-container">
          {showStats && (
            <div className="stats-panel">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">Total Tokens</div>
                  <div className="stat-value">{tokenStats.total || 0}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Lines of Code</div>
                  <div className="stat-value">{tokenStats.lines || 0}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Most Common Token</div>
                  <div className="stat-value">
                    {tokenStats.mostCommon?.type || 'N/A'} 
                    ({tokenStats.mostCommon?.count || 0})
                  </div>
                </div>
              </div>
              <div className="token-distribution">
                <h4>Token Distribution</h4>
                <div className="distribution-graph">
                  {tokenStats.byType && Object.entries(tokenStats.byType).map(([type, count]) => (
                    <div className="graph-bar" key={type}>
                      <div className="bar-label">{type}</div>
                      <div 
                        className="bar-value" 
                        style={{ 
                          width: `${Math.min(100, (count / tokenStats.total) * 100)}%`,
                          backgroundColor: getColorForTokenType(type)
                        }}
                      />
                      <div className="bar-count">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="tokens-panel">
            <h3>Tokens</h3>
            <table className="tokens-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Line</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr key={index}>
                    <td className={`token-${token.type.toLowerCase()}`}>{token.type}</td>
                    <td>{token.value}</td>
                    <td>{token.line}</td>
                    <td>{token.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="history-panel">
        <h3>History</h3>
        <div className="history-list">
          {history.map((item, index) => (
            <div 
              key={index} 
              className={`history-item ${index === historyIndex ? 'active' : ''}`}
              onClick={() => handleHistoryNavigation(index)}
            >
              <div className="history-language">{item.language.toUpperCase()}</div>
              <div className="history-preview">
                {item.code.slice(0, 30)}...
              </div>
              <div className="history-time">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>Lexical Analyzer Pro © 2025</p>
      </footer>
    </div>
  );
}

function getColorForTokenType(type) {
  const colors = {
    'KEYWORD': '#ff79c6',
    'IDENTIFIER': '#8be9fd',
    'NUMBER': '#f1fa8c',
    'STRING': '#50fa7b',
    'COMMENT': '#6272a4',
    'OPERATOR': '#ff5555',
    'UNKNOWN': '#bd93f9'
  };
  return colors[type] || '#ffffff';
}

export default App;