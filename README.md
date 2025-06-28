# 🍰 Code Analyzer

A modern, optimized web application for analyzing code files and counting lines of code, comments, and blank lines.

## ✨ Features

### Performance Optimizations
- **Chunked Processing**: Large files are processed in chunks to prevent UI blocking
- **Async/Await**: Non-blocking file processing with progress indicators
- **Memory Efficient**: Optimized for handling files up to 50MB
- **Early Returns**: Fast path optimization for blank lines and comments

### Enhanced User Experience
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Progress Indicators**: Real-time progress bar for large files
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **Error Handling**: Comprehensive error messages and validation

### Code Quality Improvements
- **Modular Architecture**: Base parser class with language-specific extensions
- **Advanced Parsing**: Better comment detection including inline comments
- **Extensible Design**: Easy to add support for new programming languages
- **Type Safety**: Better error handling and validation

### Supported Languages
- **JavaScript/TypeScript** (.js, .jsx, .ts, .tsx, .mjs)
- **Python** (.py, .pyw)
- **Java** (.java)
- **C#** (.cs)
- **C/C++** (.c, .cpp, .cc, .cxx, .h, .hpp)

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 📊 Analysis Features

The analyzer provides detailed statistics including:
- **Blank Lines**: Empty lines and whitespace-only lines
- **Comments**: Single-line and multi-line comments
- **Code Lines**: Actual executable code
- **Percentages**: Code density and comment ratios
- **File Information**: File size and language detection

## 🏗️ Architecture

### Core Components
- `BaseParser`: Abstract base class for language parsers
- `AdvancedParser`: Enhanced parser with inline comment support
- `PerformanceOptimizer`: Handles large file processing
- `LanguageRegistry`: Manages supported file types

### File Structure
```
├── index.html          # Main HTML file
├── script.js           # Main application logic
├── style.css           # Modern responsive styling
├── parsers/            # Language-specific parsers
│   ├── baseParser.js
│   ├── advancedParser.js
│   ├── languageRegistry.js
│   ├── jsRules.js
│   ├── javaRules.js
│   └── pythonRules.js
└── utils/              # Utility functions
    └── performance.js
```

## 🔧 Technical Optimizations

### Performance
- **Chunked Processing**: Files processed in 1000-line chunks
- **Async Operations**: Non-blocking UI with setTimeout yielding
- **Memory Management**: Efficient string operations and garbage collection
- **Early Termination**: File size and line count limits

### Code Quality
- **DRY Principle**: Eliminated code duplication with base classes
- **Single Responsibility**: Each class has a specific purpose
- **Error Boundaries**: Comprehensive error handling
- **Type Safety**: Better validation and error messages

### User Experience
- **Responsive Design**: Works on all device sizes
- **Visual Feedback**: Progress bars and hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Modern UI**: Gradient backgrounds and smooth animations

## 🎯 Future Enhancements

- [ ] Support for more programming languages
- [ ] Export results to CSV/JSON
- [ ] Batch file processing
- [ ] Code complexity metrics
- [ ] Git integration for repository analysis
- [ ] Dark mode theme
- [ ] PWA capabilities

## 📝 License

MIT License - feel free to use and modify as needed!