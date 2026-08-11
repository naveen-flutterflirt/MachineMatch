import { BaseService } from './base.service.js';
import userRepository from '../repositories/user.repository.js';
import { BcryptHelper } from '../utils/bcrypt.js';
import { JwtHelper } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export class UserService extends BaseService {
  constructor() {
    super(userRepository);
    this.userRepo = userRepository;
  }

  async registerUser(userData) {
    const { email, password, firstName, lastName, phone, userType } = userData;

    const emailTaken = await this.userRepo.isEmailTaken(email);
    if (emailTaken) {
      throw new AppError('An account with this email address already exists.', 400);
    }

    const hashedPassword = await BcryptHelper.hashPassword(password);

    const newUser = await this.userRepo.create({
      email: String(email).toLowerCase().trim(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      userType: userType || 'buyer',
      status: 'active',
      emailVerified: true,
    });

    const token = JwtHelper.generateToken({
      id: newUser.id,
      email: newUser.email,
      userType: newUser.userType,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        userType: newUser.userType,
        status: newUser.status,
      },
      token,
    };
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide both email and password.', 400);
    }

    const user = await this.userRepo.findByEmail(email, true);
    if (!user) {
      throw new AppError('Invalid email address or password.', 401);
    }

    const isMatch = await BcryptHelper.comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email address or password.', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Your account is currently inactive or suspended.', 403);
    }

    await user.update({ lastLoginAt: new Date() });

    const token = JwtHelper.generateToken({
      id: user.id,
      email: user.email,
      userType: user.userType,
    });

    const userPlain = user.toJSON();
    delete userPlain.password;

    return {
      user: userPlain,
      token,
    };
  }

  async getUserProfile(userId) {
    return await this.userRepo.findById(userId);
  }

  async updateProfile(userId, updateData) {
    const allowedFields = ['firstName', 'lastName', 'phone'];
    const filteredData = {};

    for (const key of Object.keys(updateData)) {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    }

    return await this.userRepo.update(userId, filteredData);
  }
}

export default new UserService();
