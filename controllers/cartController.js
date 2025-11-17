import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg:'Server error', error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, qty = 1 } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId, qty }] });
      return res.json(cart);
    }
    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx > -1) {
      cart.items[idx].qty += Number(qty);
    } else {
      cart.items.push({ productId, qty });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg:'Server error', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ msg: 'No cart' });
    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg:'Server error', error: err.message });
  }
};
