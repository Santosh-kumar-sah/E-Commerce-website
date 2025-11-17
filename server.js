import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from '../routes/userRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import cartRoutes from '../routes/cartRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import adminRoutes from '../routes/adminRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { })
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
