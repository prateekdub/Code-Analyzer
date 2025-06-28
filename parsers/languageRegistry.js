import { javaRules } from './javaRules.js';
import { pythonRules } from './pythonRules.js';
import { jsRules } from './jsRules.js';

export const languages = {
  java: {
    extensions: ['.java'],
    rules: javaRules,
    name: 'Java'
  },
  python: {
    extensions: ['.py', '.pyw'],
    rules: pythonRules,
    name: 'Python'
  },
  javascript: {
    extensions: ['.js', '.jsx', '.mjs'],
    rules: jsRules,
    name: 'JavaScript'
  },
  typescript: {
    extensions: ['.ts', '.tsx'],
    rules: jsRules, // TypeScript uses same comment syntax as JS
    name: 'TypeScript'
  },
  csharp: {
    extensions: ['.cs'],
    rules: jsRules, // C# uses same comment syntax as JS
    name: 'C#'
  },
  cpp: {
    extensions: ['.cpp', '.cc', '.cxx', '.h', '.hpp'],
    rules: jsRules, // C++ uses same comment syntax as JS
    name: 'C++'
  },
  c: {
    extensions: ['.c'],
    rules: jsRules, // C uses same comment syntax as JS
    name: 'C'
  }
};

export function getRulesForFile(filename) {
  if (!filename) return null;
  
  const lower = filename.toLowerCase();
  const extension = lower.substring(lower.lastIndexOf('.'));
  
  for (const lang of Object.values(languages)) {
    if (lang.extensions.includes(extension)) {
      return lang;
    }
  }
  return null;
}
