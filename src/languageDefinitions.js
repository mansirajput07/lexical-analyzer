// languageDefinitions.js
export const languageDefinitions = {
    c: {
      specifications: [
        ['KEYWORD', '\\b(if|else|while|for|return|int|float|void|main|char|struct|typedef|switch|case|break|continue|default|do|sizeof|static|extern|const)\\b'],
        ['IDENTIFIER', '[a-zA-Z_][a-zA-Z0-9_]*'],
        ['NUMBER', '\\b\\d+(\\.\\d+)?([eE][+-]?\\d+)?\\b'],
        ['STRING', '"[^"]*"'],
        ['COMMENT', '//.*|/\\*[\\s\\S]*?\\*/'],
        ['OPERATOR', '[+\\-*/=<>!&|^%~?:]+'],
        ['DELIMITER', '[{};,()\\[\\]]'],
        ['WHITESPACE', '\\s+'],
        ['UNKNOWN', '.']
      ]
    },
    python: {
      specifications: [
        ['KEYWORD', '\\b(def|class|import|from|as|if|elif|else|while|for|in|try|except|finally|return|break|continue|with|assert|lambda|yield|global|nonlocal|True|False|None)\\b'],
        ['IDENTIFIER', '[a-zA-Z_][a-zA-Z0-9_]*'],
        ['NUMBER', '\\b\\d+(\\.\\d+)?([eE][+-]?\\d+)?\\b'],
        ['STRING', '\'[^\']*\'|"[^"]*"'],
        ['COMMENT', '#.*'],
        ['OPERATOR', '[+\\-*/=<>!&|^%@~:]+'],
        ['DELIMITER', '[{};,()\\[\\]]'],
        ['WHITESPACE', '\\s+'],
        ['UNKNOWN', '.']
      ]
    },
    java: {
      specifications: [
        ['KEYWORD', '\\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null)\\b'],
        ['IDENTIFIER', '[a-zA-Z_][a-zA-Z0-9_]*'],
        ['NUMBER', '\\b\\d+(\\.\\d+)?([eE][+-]?\\d+)?[fFdDlL]?\\b'],
        ['STRING', '"[^"]*"'],
        ['COMMENT', '//.*|/\\*[\\s\\S]*?\\*/'],
        ['OPERATOR', '[+\\-*/=<>!&|^%~?:]+'],
        ['DELIMITER', '[{};,()\\[\\]]'],
        ['WHITESPACE', '\\s+'],
        ['UNKNOWN', '.']
      ]
    },
    javascript: {
      specifications: [
        ['KEYWORD', '\\b(var|let|const|function|class|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|new|delete|typeof|instanceof|in|of|this|super|async|await|import|export|default|extends|static|get|set|null|undefined|true|false)\\b'],
        ['IDENTIFIER', '[a-zA-Z_$][a-zA-Z0-9_$]*'],
        ['NUMBER', '\\b\\d+(\\.\\d+)?([eE][+-]?\\d+)?\\b'],
        ['STRING', '\'[^\']*\'|"[^"]*"|`[^`]*`'],
        ['COMMENT', '//.*|/\\*[\\s\\S]*?\\*/'],
        ['OPERATOR', '[+\\-*/=<>!&|^%~?:]+'],
        ['DELIMITER', '[{};,()\\[\\]]'],
        ['WHITESPACE', '\\s+'],
        ['UNKNOWN', '.']
      ]
    },
    html: {
      specifications: [
        ['TAG', '</?[a-zA-Z][a-zA-Z0-9-]*'],
        ['ATTRIBUTE', '\\s[a-zA-Z-]+="[^"]*"'],
        ['TEXT', '>[^<]+'],
        ['COMMENT', '<!--[\\s\\S]*?-->'],
        ['DELIMITER', '[<>]'],
        ['WHITESPACE', '\\s+'],
        ['UNKNOWN', '.']
      ]
    },
    css: {
      specifications: [
        ['SELECTOR', '[a-zA-Z0-9_.#:][a-zA-Z0-9_\\-.*#:\\[\\]=^$|>+~]+\\s*\\{'],
        ['PROPERTY', '\\s*[a-zA-Z\\-]+\\s*:'],
        ['VALUE', ':\\s*[^;]+;'],
        ['COMMENT', '/\\*[\\s\\S]*?\\*/'],
        ['DELIMITER', '[{};]'],
        ['WHITESPACE', '\\s+'],
        ['UNKNOWN', '.']
      ]
    }
  };