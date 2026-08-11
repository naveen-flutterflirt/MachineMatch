import jwt from 'jsonwebtoken';
import { AppError } from './AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'machinematch_secret_key_change_in_production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export class JwtHelper {
  static generateToken(payload) {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });
    } catch (error) {
      throw new AppError('Error generating JWT token', 500);
    }
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      }
      throw new AppError('Invalid or malformed authentication token', 401);
    }
  }

  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new AppError('Error decoding token', 400);
    }
  }
}
