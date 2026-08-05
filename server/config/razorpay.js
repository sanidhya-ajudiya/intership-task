const Razorpay = require('razorpay');

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_id && key_secret) {
    try {
      return new Razorpay({ key_id, key_secret });
    } catch (err) {
      console.warn('Razorpay initialization error:', err.message);
    }
  }
  return null;
};

module.exports = getRazorpayInstance;
