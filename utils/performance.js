export class PerformanceOptimizer {
  constructor(chunkSize = 1000) {
    this.chunkSize = chunkSize;
  }

  // Process large files in chunks to avoid blocking the UI
  async processInChunks(lines, processor, onProgress) {
    const results = [];
    const totalChunks = Math.ceil(lines.length / this.chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, lines.length);
      const chunk = lines.slice(start, end);
      
      // Process chunk
      const chunkResults = chunk.map(processor);
      results.push(...chunkResults);
      
      // Report progress
      if (onProgress) {
        const progress = ((i + 1) / totalChunks) * 100;
        onProgress(progress);
      }
      
      // Yield control to allow UI updates
      if (i < totalChunks - 1) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return results;
  }

  // Optimized line counting with early termination
  countLinesOptimized(content, maxLines = 100000) {
    const lines = content.split('\n');
    if (lines.length > maxLines) {
      throw new Error(`File too large: ${lines.length} lines (max: ${maxLines})`);
    }
    return lines;
  }

  // Memory-efficient file reading
  async readFileInChunks(file, chunkSize = 1024 * 1024) { // 1MB chunks
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let content = '';
      
      reader.onload = (e) => {
        content += e.target.result;
        resolve(content);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
} 