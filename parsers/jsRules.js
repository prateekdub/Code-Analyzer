import { AdvancedParser } from './advancedParser.js';

class JavaScriptParser extends AdvancedParser {
  constructor() {
    super('//', '/*', '*/', 'JavaScript');
  }

  detectVariableDeclarations(line) {
    let count = 0;
    const trimmed = line.trim();

    // Skip if line is empty or just contains operators
    if (!trimmed || /^[{}();,\[\]]+$/.test(trimmed)) {
      return 0;
    }

    // JavaScript variable declaration patterns
    const patterns = [
      // let/const/var declarations
      /\b(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;]/g,
      // Function parameters
      /\bfunction\s*\(([^)]*)\)/g,
      // Arrow function parameters
      /\(([^)]*)\)\s*=>/g,
      // Single parameter arrow function
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g,
      // Class properties
      /\b(?:public|private|protected|static)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:=]/g,
      // Destructuring assignments
      /\b(?:let|const|var)\s*\{([^}]+)\}/g,
      /\b(?:let|const|var)\s*\[([^\]]+)\]/g,
      // Object destructuring in function parameters
      /\{([^}]+)\}\s*[=;]/g,
      // Array destructuring in function parameters
      /\[([^\]]+)\]\s*[=;]/g
    ];

    patterns.forEach(pattern => {
      const matches = trimmed.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Extract variable names from destructuring patterns
          if (match.includes('{') || match.includes('[')) {
            // Handle destructuring
            const vars = match.replace(/[{}[\]]/g, '').split(',').map(v => v.trim());
            vars.forEach(v => {
              if (v && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(v)) {
                count++;
              }
            });
          } else if (match.includes('function') || match.includes('=>')) {
            // Handle function parameters
            const params = match.replace(/function\s*\(|\)\s*=>|\(|\)/g, '').split(',').map(p => p.trim());
            params.forEach(param => {
              if (param && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(param)) {
                count++;
              }
            });
          } else {
            // Simple variable declarations
            const varName = match.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/);
            if (varName) {
              count++;
            }
          }
        });
      }
    });

    return count;
  }
}

export const jsRules = new JavaScriptParser();
