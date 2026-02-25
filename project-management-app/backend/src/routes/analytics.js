import express from 'express';
import { getTeacherAnalytics, getStudentAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/teacher', protect, authorize(['teacher']), getTeacherAnalytics);
router.get('/student/:studentId', protect, getStudentAnalytics);

export default router;
