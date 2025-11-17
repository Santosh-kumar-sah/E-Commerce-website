import express from 'express';
import { createOrder, handleWebhook } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js/index.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/webhook', handleWebhook);

export default router;
