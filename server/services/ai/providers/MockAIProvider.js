import { IAIProvider } from '../interfaces/IAIProvider.js';

export class MockAIProvider extends IAIProvider {
  async extractStructuredData(fileBuffer, mimeType, outputSchema) {
    console.log('🤖 [MockAIProvider] Extracting structured data from file...');
    return {
      operating_weight: { rawValue: '21000 kg', normalizedValue: 21000, unit: 'kg' },
      engine_power: { rawValue: '110 kW', normalizedValue: 110, unit: 'kW' },
      bucket_capacity: { rawValue: '1.0 m3', normalizedValue: 1.0, unit: 'm3' },
    };
  }

  async parseNaturalLanguageQuery(queryText) {
    console.log(`🤖 [MockAIProvider] Parsing query: "${queryText}"`);
    const lower = String(queryText).toLowerCase();

    const result = {
      categorySlug: lower.includes('excavator') ? 'excavator' : null,
      maxPrice: null,
      operatingWeightMin: null,
      operatingWeightMax: null,
      rawQuery: queryText,
    };

    if (lower.includes('20-ton') || lower.includes('20 ton')) {
      result.operatingWeightMin = 19000;
      result.operatingWeightMax = 22000;
    }
    if (lower.includes('40 lakh') || lower.includes('40l')) {
      result.maxPrice = 4000000;
    }

    return result;
  }

  async generateEmbedding(textSummary) {
    console.log('🤖 [MockAIProvider] Generating 768-dim float vector embedding...');
    // Return a deterministic float array of size 768
    const vector = new Array(768).fill(0).map((_, i) => Math.sin(i + textSummary.length) * 0.1);
    return vector;
  }
}
