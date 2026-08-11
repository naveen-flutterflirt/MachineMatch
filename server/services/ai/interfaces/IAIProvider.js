export class IAIProvider {
  /**
   * Extract structured spec attributes from brochure PDF or image text
   */
  async extractStructuredData(fileBuffer, mimeType, outputSchema) {
    throw new Error('Method extractStructuredData() must be implemented.');
  }

  /**
   * Parse plain natural language search text into structured SQL filter parameters
   */
  async parseNaturalLanguageQuery(queryText) {
    throw new Error('Method parseNaturalLanguageQuery() must be implemented.');
  }

  /**
   * Generate float embedding vector (768 or 1536 dimensions) for pgvector search
   */
  async generateEmbedding(textSummary) {
    throw new Error('Method generateEmbedding() must be implemented.');
  }
}
