import express from 'express';
import {
  requestProject,
  getProjectsByStudent,
  getProjectsByTeacher,
  getProjectDetails,
  approveProject,
  rejectProject,
  updateProjectProgress,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', protect, authorize(['student']), requestProject);
router.get('/student', protect, authorize(['student']), getProjectsByStudent);
router.get('/teacher', protect, authorize(['teacher']), getProjectsByTeacher);
router.get('/:id', protect, getProjectDetails);
router.post('/:id/approve', protect, authorize(['teacher']), approveProject);
router.post('/:id/reject', protect, authorize(['teacher']), rejectProject);
router.patch('/:id/progress', protect, authorize(['teacher']), updateProjectProgress);
router.delete('/:id', protect, authorize(['student']), deleteProject);

export default router;
