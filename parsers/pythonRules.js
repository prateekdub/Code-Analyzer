import { AdvancedParser } from './advancedParser.js';

class PythonParser extends AdvancedParser {
  constructor() {
    super('#', '"""', '"""', 'Python');
  }

  detectVariableDeclarations(line) {
    let count = 0;
    const trimmed = line.trim();

    // Skip if line is empty or just contains operators
    if (!trimmed || /^[{}();,\[\]]+$/.test(trimmed)) {
      return 0;
    }

    // Python variable declaration patterns
    const patterns = [
      // Simple assignments
      /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g,
      // Multiple assignments
      /([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g,
      // Function parameters
      /def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(([^)]*)\)/g,
      // Lambda parameters
      /lambda\s*([^:]*):/g,
      // For loop variables
      /for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in/g,
      // List comprehensions
      /for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+[^]]*\]/g,
      // With statement
      /with\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+as/g,
      // Class attributes
      /self\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g,
      // Type hints
      /([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(?:str|int|float|bool|list|dict|tuple|set|Optional|Union|Any|List|Dict|Tuple|Set)/g
    ];

    patterns.forEach(pattern => {
      const matches = trimmed.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match.includes('def') || match.includes('lambda')) {
            // Handle function parameters
            const params = match.replace(/def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(|\)|lambda\s*|:/g, '').split(',').map(p => p.trim());
            params.forEach(param => {
              if (param && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(param)) {
                count++;
              }
            });
          } else if (match.includes('for')) {
            // Handle loop variables
            const varMatch = match.match(/([a-zA-Z_][a-zA-Z0-9_]*)/);
            if (varMatch) {
              count++;
            }
          } else if (match.includes(',')) {
            // Handle multiple assignments
            const vars = match.split(',').map(v => v.trim());
            vars.forEach(v => {
              if (v && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(v)) {
                count++;
              }
            });
          } else {
            // Simple variable declarations
            const varName = match.match(/[a-zA-Z_][a-zA-Z0-9_]*/);
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

export const pythonRules = new PythonParser();
