import { JwtHelper } from '../utils/jwt.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { getCookieValue } from '../utils/cookie.js';
import { TOKEN_COOKIE_NAME } from '../config/constants.js';

export const protect = async (req, res, next) => {
  try {
    let token = getCookieValue(req.headers.cookie, TOKEN_COOKIE_NAME);

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to gain access.', 401));
    }

    const decoded = JwtHelper.verifyToken(token);

    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    if (currentUser.status !== 'active') {
      return next(new AppError('Your user account is suspended or inactive.', 403));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = getCookieValue(req.headers.cookie, TOKEN_COOKIE_NAME);

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = JwtHelper.verifyToken(token);
      const currentUser = await User.findByPk(decoded.id);
      if (currentUser && currentUser.status === 'active') {
        req.user = currentUser;
      }
    }
  } catch (error) {
    // Ignore invalid tokens for optional auth
  }
  next();
};

export const restrictTo = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.userType)) {
      return next(
        new AppError('Permission denied. You do not have authorization to perform this action.', 403)
      );
    }
    next();
  };
};
