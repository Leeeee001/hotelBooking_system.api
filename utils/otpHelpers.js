function generateOTP() {
  const validPattern = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{6}$/;
    let OTP = Math.floor(100000 + Math.random() * 900000).toString();   // 6-digit OTP Generator
    return OTP
  }
  
  function otpExpiry(minutes = process.env.OTP_EXPIRY_MINUTES) {       // OTP Expiry Time Set to 10 minutes
    let expiryDate = new Date(Date.now() + minutes * 60000);        
    return expiryDate
  }

  function verifyOTP(inputOtp, storedOtp, expiryTime) {
    
  }
  
  module.exports = { generateOTP, otpExpiry, verifyOTP };
