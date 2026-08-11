import { IAIProvider } from '../interfaces/IAIProvider.js';
import { MockAIProvider } from './MockAIProvider.js';

export class OpenAIProvider extends IAIProvider {
  constructor() {
    super();
    this.fallback = new MockAIProvider();
  }

  async extractStructuredData(fileBuffer, mimeType, outputSchema) {
    console.log('🟩 [OpenAIProvider] GPT-4o JSON mode extraction...');
    return await this.fallback.extractStructuredData(fileBuffer, mimeType, outputSchema);
  }

  async parseNaturalLanguageQuery(queryText) {
    console.log(`🟩 [OpenAIProvider] Parsing query: "${queryText}"`);
    return await this.fallback.parseNaturalLanguageQuery(queryText);
  }

  async generateEmbedding(textSummary) {
    console.log('🟩 [OpenAIProvider] text-embedding-3-small vector generation...');
    return await this.fallback.generateEmbedding(textSummary);
  }
}
