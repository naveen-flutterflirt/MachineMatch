import { BaseController } from './base.controller.js';
import userService from '../services/user.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
  getTokenCookieName,
  getTokenCookieOptions,
  getTokenCookieClearOptions,
} from '../utils/cookie.js';

export class UserController extends BaseController {
  constructor() {
    super(userService, ['email', 'firstName', 'lastName', 'phone'], ['userType', 'status']);
  }

  register = catchAsync(async (req, res) => {
    const data = await userService.registerUser(req.body);

    res.cookie(getTokenCookieName(), data.token, getTokenCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: data.user,
      token: data.token,
    });
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const data = await userService.loginUser(email, password);

    res.cookie(getTokenCookieName(), data.token, getTokenCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: data.user,
      token: data.token,
    });
  });

  logout = catchAsync(async (req, res) => {
    const clearOpts = getTokenCookieClearOptions();
    res.cookie(getTokenCookieName(), '', clearOpts);
    res.clearCookie(getTokenCookieName(), clearOpts);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  getMe = catchAsync(async (req, res) => {
    const data = await userService.getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      data,
    });
  });

  updateProfile = catchAsync(async (req, res) => {
    const data = await userService.updateProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data,
    });
  });
}

export default new UserController();
