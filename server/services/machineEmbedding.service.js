import { BaseService } from './base.service.js';
import machineEmbeddingRepository from '../repositories/machineEmbedding.repository.js';
import machineRepository from '../repositories/machine.repository.js';
import aiProvider from './ai/AIProviderFactory.js';
import { AppError } from '../utils/AppError.js';

export class MachineEmbeddingService extends BaseService {
  constructor() {
    super(machineEmbeddingRepository);
    this.embeddingRepo = machineEmbeddingRepository;
  }

  async generateMachineEmbedding(machineId) {
    const machine = await machineRepository.findWithDetails(machineId);
    if (!machine) {
      throw new AppError(`Machine with ID '${machineId}' not found`, 404);
    }

    const specsText = machine.specifications
      .map(
        (s) => `${s.attribute ? s.attribute.name : ''}: ${s.rawValue}`
      )
      .join(', ');

    const summaryText = `${machine.modelName} ${machine.variant || ''} - Category: ${
      machine.category ? machine.category.name : ''
    }, Vendor: ${machine.vendor ? machine.vendor.name : ''}. Specs: ${specsText}`;

    const floatVector = await aiProvider.generateEmbedding(summaryText);

    const existing = await this.embeddingRepo.findByMachineId(machineId);
    if (existing) {
      return await existing.update({
        embedding: floatVector,
        specSummaryText: summaryText,
        lastGeneratedAt: new Date(),
      });
    }

    return await this.embeddingRepo.create({
      machineId,
      embedding: floatVector,
      specSummaryText: summaryText,
      lastGeneratedAt: new Date(),
    });
  }

  async findSimilarMachines(machineId, limit = 5) {
    await machineRepository.findById(machineId);
    return await this.embeddingRepo.findSimilar(machineId, limit);
  }
}

export default new MachineEmbeddingService();
