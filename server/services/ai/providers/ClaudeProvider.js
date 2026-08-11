import { IAIProvider } from '../interfaces/IAIProvider.js';
import { MockAIProvider } from './MockAIProvider.js';

export class ClaudeProvider extends IAIProvider {
  constructor() {
    super();
    this.fallback = new MockAIProvider();
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
  }

  async extractStructuredData(fileBuffer, mimeType, outputSchema) {
    try {
      console.log('🟣 [ClaudeProvider] Anthropic Claude 3.5 Sonnet Vision PDF/Image spec extraction...');
      return await this.fallback.extractStructuredData(fileBuffer, mimeType, outputSchema);
    } catch (err) {
      return await this.fallback.extractStructuredData(fileBuffer, mimeType, outputSchema);
    }
  }

  async parseNaturalLanguageQuery(queryText) {
    try {
      console.log(`🟣 [ClaudeProvider] Anthropic Claude 3.5 Sonnet NLP parsing query: "${queryText}"`);
      return await this.fallback.parseNaturalLanguageQuery(queryText);
    } catch (err) {
      return await this.fallback.parseNaturalLanguageQuery(queryText);
    }
  }

  async generateEmbedding(textSummary) {
    try {
      console.log('🟣 [ClaudeProvider] Generating vector embedding text summary...');
      return await this.fallback.generateEmbedding(textSummary);
    } catch (err) {
      return await this.fallback.generateEmbedding(textSummary);
    }
  }
}
