import Order from '../models/Order.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' });

export const createOrder = async (req, res) => {
  try {
    const { userId, items, total, paymentMethod } = req.body;
    const order = await Order.create({ userId, items, total, paymentMethod, paymentStatus: 'pending' });

    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'inr',
        metadata: { orderId: order._id.toString() }
      });
      return res.json({ orderId: order._id, clientSecret: paymentIntent.client_secret });
    } else if (paymentMethod === 'razorpay') {
      const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET });
      const options = { amount: Math.round(total * 100), currency: 'INR', receipt: order._id.toString() };
      const payment = await rz.orders.create(options);
      return res.json({ orderId: order._id, razorpayOrder: payment });
    } else {
      return res.json({ orderId: order._id });
    }
  } catch (err) {
    res.status(500).json({ msg:'Server error', error: err.message });
  }
};

export const handleWebhook = async (req, res) => {
  // implement verification & order update for Stripe/Razorpay
  res.json({ ok: true });
};
