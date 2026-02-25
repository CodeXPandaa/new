import express from 'express';
import { submitWPR, getWPR, getWPRDetails } from '../controllers/wprController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/:projectId/submit', protect, authorize(['student']), submitWPR);
router.get('/:projectId', protect, getWPR);
router.get('/:projectId/:id', protect, getWPRDetails);

export default router;
