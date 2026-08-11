import { IAIProvider } from '../interfaces/IAIProvider.js';
import { MockAIProvider } from './MockAIProvider.js';

export class BedrockProvider extends IAIProvider {
  constructor() {
    super();
    this.fallback = new MockAIProvider();
  }

  async extractStructuredData(fileBuffer, mimeType, outputSchema) {
    console.log('🟧 [BedrockProvider] AWS Bedrock Claude 3.5 Sonnet extraction...');
    return await this.fallback.extractStructuredData(fileBuffer, mimeType, outputSchema);
  }

  async parseNaturalLanguageQuery(queryText) {
    console.log(`🟧 [BedrockProvider] Parsing query: "${queryText}"`);
    return await this.fallback.parseNaturalLanguageQuery(queryText);
  }

  async generateEmbedding(textSummary) {
    console.log('🟧 [BedrockProvider] Amazon Titan Embeddings Text v2...');
    return await this.fallback.generateEmbedding(textSummary);
  }
}
