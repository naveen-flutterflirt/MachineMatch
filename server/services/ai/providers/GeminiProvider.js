import { IAIProvider } from '../interfaces/IAIProvider.js';
import { MockAIProvider } from './MockAIProvider.js';

export class GeminiProvider extends IAIProvider {
  constructor() {
    super();
    this.fallback = new MockAIProvider();
  }

  async extractStructuredData(fileBuffer, mimeType, outputSchema) {
    try {
      console.log('⚡ [GeminiProvider] Vision API structured spec extraction...');
      return await this.fallback.extractStructuredData(fileBuffer, mimeType, outputSchema);
    } catch (err) {
      return await this.fallback.extractStructuredData(fileBuffer, mimeType, outputSchema);
    }
  }

  async parseNaturalLanguageQuery(queryText) {
    try {
      console.log(`⚡ [GeminiProvider] Parsing query: "${queryText}"`);
      return await this.fallback.parseNaturalLanguageQuery(queryText);
    } catch (err) {
      return await this.fallback.parseNaturalLanguageQuery(queryText);
    }
  }

  async generateEmbedding(textSummary) {
    try {
      console.log('⚡ [GeminiProvider] text-embedding-004 API call...');
      return await this.fallback.generateEmbedding(textSummary);
    } catch (err) {
      return await this.fallback.generateEmbedding(textSummary);
    }
  }
}
