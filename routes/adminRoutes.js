import express from 'express';
import { dashboard } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js/index.js';

const router = express.Router();

router.get('/dashboard', protect, admin, dashboard);

export default router;
