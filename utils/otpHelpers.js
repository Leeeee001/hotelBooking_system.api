function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP Generator
  }
  
  function otpExpiry(minutes = 10) {            // OTP Expiry Time Set
    return new Date(Date.now() + minutes * 60000);
  }
  
  module.exports = { generateOTP, otpExpiry };
  