#  Code Analyzer

A modern, optimized web application for analyzing code files and counting lines of code, comments, blank lines, and variable declarations.

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

### Variable Declaration Analysis
- **Multi-language Support**: Detects variables in JavaScript, Java, Python, and more
- **Advanced Patterns**: Supports complex declarations like destructuring, function parameters, and lambda expressions
- **Accurate Counting**: Distinguishes between variable declarations and other code constructs
- **Detailed Statistics**: Shows variables per line and total variable count

### Supported Languages
- **JavaScript/TypeScript** (.js, .jsx, .ts, .tsx, .mjs)
- **Python** (.py, .pyw)
- **Java** (.java)
- **C#** (.cs)
- **C/C++** (.c, .cpp, .cc, .cxx, .h, .hpp)

## 🚀 Getting Started

1. **Mac/Linux**
   ```bash
   sh deploy_mac.sh
   ```

2. **Windows**
   ```terminal
   deploy_win.ps1
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 📊 Analysis Features

The analyzer provides detailed statistics including:
- **Blank Lines**: Empty lines and whitespace-only lines
- **Comments**: Single-line and multi-line comments
- **Code Lines**: Actual executable code
- **Variables**: Declared variables and function parameters
- **Percentages**: Code density and comment ratios
- **Metrics**: Variables per line and file size
- **File Information**: Language detection and file details

## 🏗️ Architecture

### Core Components
- `BaseParser`: Abstract base class for language parsers
- `AdvancedParser`: Enhanced parser with inline comment support
- `JavaScriptParser`: JavaScript-specific variable detection
- `JavaParser`: Java-specific variable detection
- `PythonParser`: Python-specific variable detection
- `PerformanceOptimizer`: Handles large file processing
- `LanguageRegistry`: Manages supported file types

### File Structure
```
├── index.html          # Main HTML file
├── script.js           # Main application logic
├── style.css           # Modern responsive styling
├── test.js             # Test file for variable counting
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

### Variable Detection
- **Regex Patterns**: Language-specific patterns for variable declarations
- **Context Awareness**: Distinguishes between declarations and usage
- **Complex Patterns**: Handles destructuring, function parameters, and lambda expressions
- **Multi-language**: Different detection strategies for each programming language

### User Experience
- **Responsive Design**: Works on all device sizes
- **Visual Feedback**: Progress bars and hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Modern UI**: Gradient backgrounds and smooth animations

## 🎯 Variable Detection Examples

### JavaScript/TypeScript
```javascript
// Simple declarations
let name = "John";
const age = 25;
var city = "New York";

// Function parameters
function greetUser(userName, userAge) { }

// Arrow functions
const add = (a, b) => a + b;

// Destructuring
const { title, author } = book;
const [x, y, z] = array;
```

### Java
```java
// Primitive types
int count = 0;
String name = "John";

// Object types
List<String> names = new ArrayList<>();
Map<String, Integer> scores = new HashMap<>();

// Method parameters
public void processData(String input, int count) { }

// Lambda parameters
names.forEach(name -> System.out.println(name));
```

### Python
```python
# Simple assignments
name = "John"
age = 25

# Function parameters
def greet_user(name, age):
    pass

# For loop variables
for item in items:
    pass

# List comprehensions
squares = [x**2 for x in numbers]
```

## 🎯 Future Enhancements

- [ ] Support for more programming languages
- [ ] Export results to CSV/JSON
- [ ] Batch file processing
- [ ] Code complexity metrics
- [ ] Git integration for repository analysis

