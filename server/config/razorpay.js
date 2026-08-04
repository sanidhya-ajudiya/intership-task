const Razorpay = require('razorpay');

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mockrazorpaysecret67890',
  });
} catch (err) {
  console.warn('Razorpay initialization warning:', err.message);
}

module.exports = razorpayInstance;
