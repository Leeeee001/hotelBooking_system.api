const crypto = require("node:crypto");
const razorpay = require("./razorpayInstance");


// Create a new Razorpay order
const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // convert to paisa
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const generatedSignature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return generatedSignature === razorpay_signature;
};

module.exports = { createRazorpayOrder, verifyPaymentSignature };

