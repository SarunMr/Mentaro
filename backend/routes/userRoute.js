
import express  from 'express';

import { authController } from '../controllers/userController';

const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', authController.register);

// Route: POST /api/auth/login
router.post('/login', authController.login);

// Protected route example: GET /api/auth/profile
// Requires valid JWT token, validated by authenticateToken middleware
router.get('/profile', authController.authenticateToken, authController.getProfile);

export default router;
