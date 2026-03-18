import express from 'express';
import {
  register,
  login,
  getProfile,
  logout,
  getSessionStatus
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', getSessionStatus);
router.get('/profile', requireAuth, getProfile);
router.post('/logout', requireAuth, logout);

export default router;