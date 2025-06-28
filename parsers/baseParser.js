export class BaseParser {
  constructor(singleLineComment, multiLineCommentStart, multiLineCommentEnd) {
    this.singleLineComment = singleLineComment;
    this.multiLineCommentStart = multiLineCommentStart;
    this.multiLineCommentEnd = multiLineCommentEnd;
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

    // Check for single-line comments
    if (trimmed.startsWith(this.singleLineComment)) {
      return 'comment';
    }

    // Check for multi-line comment start
    if (trimmed.startsWith(this.multiLineCommentStart)) {
      if (!trimmed.includes(this.multiLineCommentEnd)) {
        state.inBlockComment = true;
      }
      return 'comment';
    }

    return 'code';
  }
} 