import { getRulesForFile } from './parsers/languageRegistry.js';
import { PerformanceOptimizer } from './utils/performance.js';

class CodeAnalyzer {
  constructor() {
    this.fileInput = document.getElementById('fileInput');
    this.resultsDiv = document.getElementById('results');
    this.dropZone = document.getElementById('dropZone');
    this.progressBar = document.getElementById('progressBar');
    this.progressContainer = document.getElementById('progressContainer');
    
    this.performanceOptimizer = new PerformanceOptimizer(1000); // Process 1000 lines at a time
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // File input change
    this.fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this.analyzeFile(file);
      }
    });

    // Drag and drop functionality
    if (this.dropZone) {
      this.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
      });

      this.dropZone.addEventListener('dragleave', () => {
        this.dropZone.classList.remove('drag-over');
      });

      this.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.analyzeFile(files[0]);
        }
      });
    }
  }

  async analyzeFile(file) {
    try {
      // Validate file
      if (!this.validateFile(file)) {
        return;
      }

      // Get language rules
      const languageInfo = getRulesForFile(file.name);
      if (!languageInfo) {
        this.showError(`Unsupported file type: ${file.name}`);
        return;
      }

      // Show progress
      this.showProgress();

      // Read and analyze file
      const content = await this.readFileAsync(file);
      const stats = await this.analyzeContentOptimized(content, languageInfo.rules);

      // Hide progress and show results
      this.hideProgress();
      this.showResults(stats, file.name, languageInfo.name);

    } catch (error) {
      this.hideProgress();
      this.showError(`Error analyzing file: ${error.message}`);
    }
  }

  validateFile(file) {
    if (!file) {
      this.showError('No file selected');
      return false;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      this.showError('File too large. Please select a file smaller than 50MB');
      return false;
    }

    return true;
  }

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      reader.readAsText(file);
    });
  }

  async analyzeContentOptimized(content, rules) {
    try {
      const lines = this.performanceOptimizer.countLinesOptimized(content);
      const state = { inBlockComment: false };
      
      const stats = {
        blank: 0,
        comment: 0,
        code: 0,
        variables: 0,
        total: lines.length
      };

      // Process lines in chunks for better performance
      await this.performanceOptimizer.processInChunks(
        lines,
        (line) => {
          const type = rules.parseLine(line, state);
          const varCount = rules.countVariables ? rules.countVariables(line) : 0;
          return { type, varCount };
        },
        (progress) => this.updateProgress(progress)
      ).then(results => {
        // Count results
        for (const result of results) {
          stats[result.type]++;
          stats.variables += result.varCount;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  updateProgress(progress) {
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
  }

  showProgress() {
    if (this.progressContainer) {
      this.progressContainer.style.display = 'block';
    }
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  hideProgress() {
    if (this.progressContainer) {
      this.progressContainer.style.display = 'none';
    }
  }

  showResults(stats, fileName, languageName) {
    const percentage = {
      blank: ((stats.blank / stats.total) * 100).toFixed(1),
      comment: ((stats.comment / stats.total) * 100).toFixed(1),
      code: ((stats.code / stats.total) * 100).toFixed(1)
    };

    this.resultsDiv.innerHTML = `
      <div class="file-info">
        <h3>📄 ${fileName}</h3>
        <p class="language">${languageName}</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card blank">
          <div class="stat-number">${stats.blank}</div>
          <div class="stat-label">Blank Lines</div>
          <div class="stat-percentage">${percentage.blank}%</div>
        </div>
        <div class="stat-card comment">
          <div class="stat-number">${stats.comment}</div>
          <div class="stat-label">Comments</div>
          <div class="stat-percentage">${percentage.comment}%</div>
        </div>
        <div class="stat-card code">
          <div class="stat-number">${stats.code}</div>
          <div class="stat-label">Code Lines</div>
          <div class="stat-percentage">${percentage.code}%</div>
        </div>
        <div class="stat-card variables">
          <div class="stat-number">${stats.variables}</div>
          <div class="stat-label">Variables</div>
        </div>
        <div class="stat-card total">
          <div class="stat-number">${stats.total}</div>
          <div class="stat-label">Total Lines</div>
        </div>
      </div>
      <div class="summary">
        <p>Code density: <strong>${percentage.code}%</strong></p>
        <p>Comment ratio: <strong>${percentage.comment}%</strong></p>
        <p>Variables per line: <strong>${(stats.variables / stats.total).toFixed(2)}</strong></p>
        <p>File size: <strong>${this.formatFileSize(fileName)}</strong></p>
      </div>
    `;
  }

  formatFileSize(fileName) {
    const file = this.fileInput.files[0];
    if (!file) return 'Unknown';
    
    const bytes = file.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  showError(message) {
    this.resultsDiv.innerHTML = `
      <div class="error">
        <span>❌ ${message}</span>
      </div>
    `;
  }
}

// Initialize the analyzer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CodeAnalyzer();
});
