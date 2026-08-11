import { BaseRepository } from './base.repository.js';
import User from '../models/User.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, includePassword = false) {
    const scope = includePassword ? this.model.scope('withPassword') : this.model;
    return await scope.findOne({
      where: { email: String(email).toLowerCase().trim() },
    });
  }

  async isEmailTaken(email) {
    const cleanEmail = String(email).toLowerCase().trim();

    const existingUser = await this.model.findOne({
      where: { email: cleanEmail },
      paranoid: false,
    });

    if (existingUser && existingUser.deletedAt) {
      await existingUser.destroy({ force: true });
      return false;
    }

    return Boolean(existingUser);
  }
}

export default new UserRepository();
