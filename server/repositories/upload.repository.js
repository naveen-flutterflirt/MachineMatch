import { BaseRepository } from './base.repository.js';
import { Upload, User } from '../models/index.js';

export class UploadRepository extends BaseRepository {
  constructor() {
    super(Upload);
  }

  async findByUser(uploadedByUserId, options = {}) {
    return await this.findAllWithUploader({ where: { uploadedByUserId }, ...options });
  }

  async findByStatus(status, options = {}) {
    return await this.findAllWithUploader({ where: { status }, ...options });
  }

  async findWithUploader(id, options = {}) {
    return await this.model.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
      ...options,
    });
  }

  async findAllWithUploader(options = {}) {
    return await this.model.findAll({
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      ...options,
    });
  }
}

export default new UploadRepository();
