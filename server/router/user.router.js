import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateUserSchema,
} from '../validators/user.validator.js';

const router = Router();

// --- Auth Routes ---
router.post('/register', validateRequest(registerSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);
router.post('/logout', userController.logout);

// --- Protected User Routes ---
router.get('/me', protect, userController.getMe);
router.patch('/profile', protect, validateRequest(updateProfileSchema), userController.updateProfile);

// --- Admin User Management Routes ---
router.get('/search', protect, restrictTo('admin'), userController.search);
router.get('/', protect, restrictTo('admin'), userController.getAll);
router.get('/:id', protect, restrictTo('admin'), userController.getById);
router.patch('/:id', protect, restrictTo('admin'), validateRequest(updateUserSchema), userController.update);
router.delete('/:id', protect, restrictTo('admin'), userController.delete);

export default router;
