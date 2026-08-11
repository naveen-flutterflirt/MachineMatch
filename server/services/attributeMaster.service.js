import { BaseService } from './base.service.js';
import attributeMasterRepository from '../repositories/attributeMaster.repository.js';
import { AppError } from '../utils/AppError.js';

const generateCode = (text) => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/[\s-]+/g, '_');
};

export class AttributeMasterService extends BaseService {
  constructor() {
    super(attributeMasterRepository);
    this.attributeRepo = attributeMasterRepository;
  }

  async createAttribute(data) {
    const { name, code: customCode, dataType, standardUnit, higherIsBetter, defaultWeight, description } = data;

    const code = customCode ? generateCode(customCode) : generateCode(name);

    const codeTaken = await this.attributeRepo.isCodeTaken(code);
    if (codeTaken) {
      throw new AppError(`Attribute with code '${code}' already exists.`, 400);
    }

    return await this.attributeRepo.create({
      name,
      code,
      dataType: dataType || 'number',
      standardUnit,
      higherIsBetter: higherIsBetter !== undefined ? higherIsBetter : true,
      defaultWeight: defaultWeight !== undefined ? defaultWeight : 1.0,
      description,
    });
  }

  async updateAttribute(id, data) {
    const attribute = await this.attributeRepo.findById(id);

    if (data.code || data.name) {
      const newCode = data.code ? generateCode(data.code) : generateCode(data.name || attribute.name);
      const codeTaken = await this.attributeRepo.isCodeTaken(newCode, id);
      if (codeTaken) {
        throw new AppError(`Attribute with code '${newCode}' already exists.`, 400);
      }
      data.code = newCode;
    }

    return await this.attributeRepo.update(id, data);
  }

  async getAttributeByCode(code) {
    const attribute = await this.attributeRepo.findByCode(code);
    if (!attribute) {
      throw new AppError(`Attribute with code '${code}' not found`, 404);
    }
    return attribute;
  }
}

export default new AttributeMasterService();
