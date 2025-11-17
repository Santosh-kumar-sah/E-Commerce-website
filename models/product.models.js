import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  stock: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
