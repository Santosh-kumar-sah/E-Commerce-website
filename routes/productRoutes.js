import express from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js/index.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
