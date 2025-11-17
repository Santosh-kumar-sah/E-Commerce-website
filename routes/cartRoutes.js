import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js/index.js';

const router = express.Router();

router.get('/:userId', protect, getCart);
router.post('/add', protect, addToCart);
router.post('/remove', protect, removeFromCart);

export default router;
