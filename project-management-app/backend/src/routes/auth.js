import express from 'express';
import { register, login, getCurrentUser, getTeachers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.get('/teachers', protect, getTeachers);

export default router;
