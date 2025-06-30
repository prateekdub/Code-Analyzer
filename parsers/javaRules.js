import { AdvancedParser } from './advancedParser.js';

class JavaParser extends AdvancedParser {
  constructor() {
    super('//', '/*', '*/', 'Java');
  }

  detectVariableDeclarations(line) {
    let count = 0;
    const trimmed = line.trim();

    // Skip if line is empty or just contains operators
    if (!trimmed || /^[{}();,\[\]]+$/.test(trimmed)) {
      return 0;
    }

    // Java variable declaration patterns
    const patterns = [
      // Primitive type declarations
      /\b(?:byte|short|int|long|float|double|char|boolean)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;]/g,
      // Object type declarations (including generics)
      /\b(?:String|Integer|Long|Float|Double|Character|Boolean|List|Set|Map|ArrayList|HashMap|LinkedList|HashSet|TreeMap|TreeSet|Optional|Stream|Consumer|Function|Predicate|Supplier|Runnable|Thread|Exception|Error|Object|Class|Enum|Interface|Annotation|Override|Deprecated|SuppressWarnings|SafeVarargs|FunctionalInterface|Native|Strictfp|Synchronized|Transient|Volatile|Abstract|Final|Private|Protected|Public|Static|Default|Native|Strictfp|Synchronized|Transient|Volatile)\s*<?[^>]*>\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;]/g,
      // Generic type declarations
      /\b([A-Z][a-zA-Z0-9_$]*)\s*<?[^>]*>\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;]/g,
      // Method parameters
      /\b(?:public|private|protected|static|final|abstract|native|synchronized|transient|volatile|strictfp)?\s*(?:byte|short|int|long|float|double|char|boolean|String|Integer|Long|Float|Double|Character|Boolean|List|Set|Map|ArrayList|HashMap|LinkedList|HashSet|TreeMap|TreeSet|Optional|Stream|Consumer|Function|Predicate|Supplier|Runnable|Thread|Exception|Error|Object|Class|Enum|Interface|Annotation|Override|Deprecated|SuppressWarnings|SafeVarargs|FunctionalInterface|Native|Strictfp|Synchronized|Transient|Volatile|Abstract|Final|Private|Protected|Public|Static|Default|Native|Strictfp|Synchronized|Transient|Volatile|[A-Z][a-zA-Z0-9_$]*)\s*<?[^>]*>\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;]/g,
      // Constructor parameters
      /\b(?:public|private|protected)?\s*([A-Z][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/g,
      // For loop variables
      /\bfor\s*\(\s*(?:byte|short|int|long|float|double|char|boolean|String|Integer|Long|Float|Double|Character|Boolean|List|Set|Map|ArrayList|HashMap|LinkedList|HashSet|TreeMap|TreeSet|Optional|Stream|Consumer|Function|Predicate|Supplier|Runnable|Thread|Exception|Error|Object|Class|Enum|Interface|Annotation|Override|Deprecated|SuppressWarnings|SafeVarargs|FunctionalInterface|Native|Strictfp|Synchronized|Transient|Volatile|Abstract|Final|Private|Protected|Public|Static|Default|Native|Strictfp|Synchronized|Transient|Volatile|[A-Z][a-zA-Z0-9_$]*)\s*<?[^>]*>\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
      // Try-with-resources
      /\btry\s*\(\s*(?:byte|short|int|long|float|double|char|boolean|String|Integer|Long|Float|Double|Character|Boolean|List|Set|Map|ArrayList|HashMap|LinkedList|HashSet|TreeMap|TreeSet|Optional|Stream|Consumer|Function|Predicate|Supplier|Runnable|Thread|Exception|Error|Object|Class|Enum|Interface|Annotation|Override|Deprecated|SuppressWarnings|SafeVarargs|FunctionalInterface|Native|Strictfp|Synchronized|Transient|Volatile|Abstract|Final|Private|Protected|Public|Static|Default|Native|Strictfp|Synchronized|Transient|Volatile|[A-Z][a-zA-Z0-9_$]*)\s*<?[^>]*>\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
      // Lambda parameters
      /\(([^)]*)\)\s*->/g,
      // Single parameter lambda
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*->/g
    ];

    patterns.forEach(pattern => {
      const matches = trimmed.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Extract variable names from function/constructor parameters
          if (match.includes('(') && match.includes(')')) {
            const params = match.replace(/.*\(|\).*/g, '').split(',').map(p => p.trim());
            params.forEach(param => {
              // Extract variable name from parameter declaration
              const varMatch = param.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=;]?$/);
              if (varMatch) {
                count++;
              }
            });
          } else if (match.includes('->')) {
            // Handle lambda parameters
            const params = match.replace(/.*\(|\)\s*->|->/g, '').split(',').map(p => p.trim());
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

export const javaRules = new JavaParser();
