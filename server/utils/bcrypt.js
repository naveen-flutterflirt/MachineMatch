import bcrypt from 'bcrypt';
import { AppError } from './AppError.js';
import { SALT_ROUNDS } from '../config/constants.js';

export class BcryptHelper {
  static async hashPassword(password) {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
      throw new AppError('Error hashing password', 500);
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new AppError('Error verifying password', 500);
    }
  }
}
