
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ msg: 'Missing credentials' });

    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ msg: 'Invalid credentials' });

    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
