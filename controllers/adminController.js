import Product from '../models/Product.js';

export const dashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({ totalProducts });
  } catch (err) {
    res.status(500).json({ msg:'Server error', error: err.message });
  }
};
