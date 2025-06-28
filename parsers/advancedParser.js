import { BaseParser } from "./baseParser.js";


export class AdvancedParser extends BaseParser {
  constructor(singleLineComment, multiLineCommentStart, multiLineCommentEnd, language = 'generic') {
    super(singleLineComment, multiLineCommentStart, multiLineCommentEnd);
    this.language = language;
  }

  parseLine(line, state) {
    const trimmed = line.trim();

    // Early return for blank lines
    if (trimmed === '') {
      return 'blank';
    }

    // Handle multi-line comments
    if (state.inBlockComment) {
      if (trimmed.includes(this.multiLineCommentEnd)) {
        state.inBlockComment = false;
      }
      return 'comment';
    }

    // Check for single-line comments (handle inline comments)
    const singleLineIndex = trimmed.indexOf(this.singleLineComment);
    if (singleLineIndex === 0) {
      return 'comment';
    }

    // Check for multi-line comment start
    const multiLineStartIndex = trimmed.indexOf(this.multiLineCommentStart);
    if (multiLineStartIndex === 0) {
      const multiLineEndIndex = trimmed.indexOf(this.multiLineCommentEnd, multiLineStartIndex + this.multiLineCommentStart.length);
      if (multiLineEndIndex === -1) {
        state.inBlockComment = true;
      }
      return 'comment';
    }

    // Handle inline comments (code followed by comment)
    if (singleLineIndex > 0) {
      const beforeComment = trimmed.substring(0, singleLineIndex).trim();
      if (beforeComment !== '') {
        return 'code';
      }
    }

    // Handle inline multi-line comments
    if (multiLineStartIndex > 0) {
      const beforeComment = trimmed.substring(0, multiLineStartIndex).trim();
      if (beforeComment !== '') {
        return 'code';
      }
    }

    return 'code';
  }

  // Additional method for more detailed analysis
  analyzeLine(line, state) {
    const type = this.parseLine(line, state);
    const trimmed = line.trim();
    
    return {
      type,
      original: line,
      trimmed,
      length: line.length,
      hasContent: trimmed.length > 0
    };
  }
} 