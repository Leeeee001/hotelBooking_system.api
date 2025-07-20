// services/paymentService.js
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

module.exports = { createRazorpayOrder };
