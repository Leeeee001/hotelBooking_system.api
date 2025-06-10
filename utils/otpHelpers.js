function generateOTP() {
    let OTP = Math.floor(100000 + Math.random() * 900000).toString();   // 6-digit OTP Generator
    return OTP
  }
  
  function otpExpiry(minutes = process.env.OTP_EXPIRY_MINUTES) {       // OTP Expiry Time Set to "x" minutes
    let expiryDate = new Date(Date.now() + minutes * 60000);        
    return expiryDate
  }

  function verifyOTP(inputOtp, storedOtp, expiryTime) {              // check if OTP is correct and not expired
    if (!inputOtp || !storedOtp || !expiryTime){return false}      
    else { if (inputOtp === storedOtp && Date.now() <= expiryTime) {return true} }
  }
  
  module.exports = { generateOTP, otpExpiry, verifyOTP };

