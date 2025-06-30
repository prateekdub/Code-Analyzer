import { getRulesForFile } from './parsers/languageRegistry.js';
import { PerformanceOptimizer } from './utils/performance.js';

class CodeAnalyzer {
  constructor() {
    this.fileInput = document.getElementById('fileInput');
    this.folderInput = document.getElementById('folderInput');
    this.resultsDiv = document.getElementById('results');
    this.dropZone = document.getElementById('dropZone');
    this.progressBar = document.getElementById('progressBar');
    this.progressContainer = document.getElementById('progressContainer');
    this.progressText = document.getElementById('progressText');
    this.dropZoneTitle = document.getElementById('dropZoneTitle');
    this.fileInputLabel = document.getElementById('fileInputLabel');
    this.fileModeBtn = document.getElementById('fileMode');
    this.folderModeBtn = document.getElementById('folderMode');
    
    this.performanceOptimizer = new PerformanceOptimizer(1000);
    this.isFolderMode = false;
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Mode toggle
    this.fileModeBtn.addEventListener('click', () => this.switchMode('file'));
    this.folderModeBtn.addEventListener('click', () => this.switchMode('folder'));

    // File input change
    this.fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this.analyzeFile(file);
      }
    });

    // Folder input change
    this.folderInput.addEventListener('change', (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        this.analyzeFolder(files);
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
        const items = Array.from(e.dataTransfer.items);
        
        if (this.isFolderMode) {
          this.handleFolderDrop(items);
        } else {
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            this.analyzeFile(files[0]);
          }
        }
      });
    }
  }

  switchMode(mode) {
    this.isFolderMode = mode === 'folder';
    
    // Update UI
    this.fileModeBtn.classList.toggle('active', !this.isFolderMode);
    this.folderModeBtn.classList.toggle('active', this.isFolderMode);
    
    // Update labels
    this.dropZoneTitle.textContent = this.isFolderMode ? 'Drop your folder here' : 'Drop your file here';
    this.fileInputLabel.textContent = this.isFolderMode ? 'Choose Folder' : 'Choose File';
    
    // Update input connections and visibility
    if (this.isFolderMode) {
      this.fileInputLabel.setAttribute('for', 'folderInput');
      this.fileInput.classList.remove('visible');
      this.folderInput.classList.add('visible');
    } else {
      this.fileInputLabel.setAttribute('for', 'fileInput');
      this.fileInput.classList.add('visible');
      this.folderInput.classList.remove('visible');
    }
    
    // Clear previous results
    this.resultsDiv.innerHTML = '';
  }

  async handleFolderDrop(items) {
    const files = [];
    
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry && entry.isDirectory) {
          await this.readDirectory(entry, files);
        }
      }
    }
    
    if (files.length > 0) {
      this.analyzeFolder(files);
    }
  }

  async readDirectory(dirEntry, files) {
    const reader = dirEntry.createReader();
    
    return new Promise((resolve) => {
      reader.readEntries(async (entries) => {
        for (const entry of entries) {
          if (entry.isFile) {
            const file = await this.getFileFromEntry(entry);
            if (file) files.push(file);
          } else if (entry.isDirectory) {
            await this.readDirectory(entry, files);
          }
        }
        resolve();
      });
    });
  }

  getFileFromEntry(fileEntry) {
    return new Promise((resolve) => {
      fileEntry.file(resolve);
    });
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
      this.showProgress('Analyzing file...');

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

  async analyzeFolder(files) {
    try {
      // Filter supported files
      const supportedFiles = files.filter(file => {
        const languageInfo = getRulesForFile(file.name);
        return languageInfo !== null;
      });

      if (supportedFiles.length === 0) {
        this.showError('No supported files found in the folder');
        return;
      }

      // Show progress
      this.showProgress(`Analyzing ${supportedFiles.length} files...`);

      const folderStats = {
        totalFiles: supportedFiles.length,
        totalLines: 0,
        blank: 0,
        comment: 0,
        code: 0,
        variables: 0,
        languages: {},
        files: []
      };

      // Analyze each file
      for (let i = 0; i < supportedFiles.length; i++) {
        const file = supportedFiles[i];
        const progress = ((i + 1) / supportedFiles.length) * 100;
        this.updateProgress(progress);
        this.progressText.textContent = `Analyzing ${file.name} (${i + 1}/${supportedFiles.length})`;

        try {
          const languageInfo = getRulesForFile(file.name);
          const content = await this.readFileAsync(file);
          const stats = await this.analyzeContentOptimized(content, languageInfo.rules);

          // Add to folder stats
          folderStats.totalLines += stats.total;
          folderStats.blank += stats.blank;
          folderStats.comment += stats.comment;
          folderStats.code += stats.code;
          folderStats.variables += stats.variables;

          // Track language stats
          if (!folderStats.languages[languageInfo.name]) {
            folderStats.languages[languageInfo.name] = {
              files: 0,
              lines: 0,
              blank: 0,
              comment: 0,
              code: 0,
              variables: 0
            };
          }
          folderStats.languages[languageInfo.name].files++;
          folderStats.languages[languageInfo.name].lines += stats.total;
          folderStats.languages[languageInfo.name].blank += stats.blank;
          folderStats.languages[languageInfo.name].comment += stats.comment;
          folderStats.languages[languageInfo.name].code += stats.code;
          folderStats.languages[languageInfo.name].variables += stats.variables;

          // Add file details
          folderStats.files.push({
            name: file.name,
            language: languageInfo.name,
            ...stats
          });

        } catch (error) {
          console.warn(`Error analyzing ${file.name}:`, error);
        }
      }

      // Hide progress and show results
      this.hideProgress();
      this.showFolderResults(folderStats);

    } catch (error) {
      this.hideProgress();
      this.showError(`Error analyzing folder: ${error.message}`);
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

  showProgress(message) {
    if (this.progressContainer) {
      this.progressContainer.style.display = 'block';
    }
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
    if (this.progressText) {
      this.progressText.textContent = message;
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

  showFolderResults(folderStats) {
    const percentage = {
      blank: ((folderStats.blank / folderStats.totalLines) * 100).toFixed(1),
      comment: ((folderStats.comment / folderStats.totalLines) * 100).toFixed(1),
      code: ((folderStats.code / folderStats.totalLines) * 100).toFixed(1)
    };

    const languageList = Object.entries(folderStats.languages)
      .map(([lang, stats]) => `${lang} (${stats.files} files)`)
      .join(', ');

    this.resultsDiv.innerHTML = `
      <div class="file-info">
        <h3>📁 Folder Analysis</h3>
        <p class="language">${folderStats.totalFiles} files analyzed</p>
      </div>
      
      <div class="folder-summary">
        <h4>📊 Overall Statistics</h4>
        <p><strong>Languages:</strong> ${languageList}</p>
        <p><strong>Total Files:</strong> ${folderStats.totalFiles}</p>
        <p><strong>Total Lines:</strong> ${folderStats.totalLines.toLocaleString()}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card blank">
          <div class="stat-number">${folderStats.blank.toLocaleString()}</div>
          <div class="stat-label">Blank Lines</div>
          <div class="stat-percentage">${percentage.blank}%</div>
        </div>
        <div class="stat-card comment">
          <div class="stat-number">${folderStats.comment.toLocaleString()}</div>
          <div class="stat-label">Comments</div>
          <div class="stat-percentage">${percentage.comment}%</div>
        </div>
        <div class="stat-card code">
          <div class="stat-number">${folderStats.code.toLocaleString()}</div>
          <div class="stat-label">Code Lines</div>
          <div class="stat-percentage">${percentage.code}%</div>
        </div>
        <div class="stat-card variables">
          <div class="stat-number">${folderStats.variables.toLocaleString()}</div>
          <div class="stat-label">Variables</div>
        </div>
        <div class="stat-card total">
          <div class="stat-number">${folderStats.totalLines.toLocaleString()}</div>
          <div class="stat-label">Total Lines</div>
        </div>
      </div>

      <div class="summary">
        <p>Code density: <strong>${percentage.code}%</strong></p>
        <p>Comment ratio: <strong>${percentage.comment}%</strong></p>
        <p>Variables per line: <strong>${(folderStats.variables / folderStats.totalLines).toFixed(2)}</strong></p>
        <p>Average lines per file: <strong>${(folderStats.totalLines / folderStats.totalFiles).toFixed(1)}</strong></p>
      </div>

      <div class="folder-summary">
        <h4>📋 File Details</h4>
        <div class="file-list">
          ${folderStats.files.map(file => `
            <div class="file-item">
              <div class="file-name">${file.name}</div>
              <div class="file-stats">
                <span>${file.language}</span>
                <span>${file.total} lines</span>
                <span>${file.code} code</span>
                <span>${file.variables} vars</span>
              </div>
            </div>
          `).join('')}
        </div>
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
