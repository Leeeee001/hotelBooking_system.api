function generateOTP() {
    let OTP = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP Generator
    return OTP
  }
  
  function otpExpiry(minutes = 10) {                                // OTP Expiry Time Set to 10 minutes
    let expiryDate = new Date(Date.now() + minutes * 60000);        
    return expiryDate
  }
  
  module.exports = { generateOTP, otpExpiry };
