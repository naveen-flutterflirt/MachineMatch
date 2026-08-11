import { GeminiProvider } from './providers/GeminiProvider.js';
import { OpenAIProvider } from './providers/OpenAIProvider.js';
import { BedrockProvider } from './providers/BedrockProvider.js';
import { ClaudeProvider } from './providers/ClaudeProvider.js';
import { MockAIProvider } from './providers/MockAIProvider.js';

export class AIProviderFactory {
  static getProvider() {
    const providerName = (process.env.AI_PROVIDER || 'mock').toLowerCase();

    switch (providerName) {
      case 'claude':
      case 'anthropic':
        return new ClaudeProvider();
      case 'gemini':
      case 'vertex':
        return new GeminiProvider();
      case 'openai':
      case 'azure_openai':
        return new OpenAIProvider();
      case 'bedrock':
      case 'aws_bedrock':
        return new BedrockProvider();
      case 'mock':
      default:
        return new MockAIProvider();
    }
  }
}

export default AIProviderFactory.getProvider();
