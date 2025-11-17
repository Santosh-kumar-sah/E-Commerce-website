import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ msg: 'Not authorized' });
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ msg: 'Not authorized' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid', error: err.message });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ msg: 'Admin access required' });
};
