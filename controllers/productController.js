import Product from '../models/Product.js';

export const listProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, page = 1, limit = 12, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    let query = Product.find(filter);
    if (q) query = Product.find({ $text: { $search: q } });

    if (sort === 'price_asc') query = query.sort({ price: 1 });
    if (sort === 'price_desc') query = query.sort({ price: -1 });

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await query.skip(skip).limit(Number(limit));
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ msg: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.json(p);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
