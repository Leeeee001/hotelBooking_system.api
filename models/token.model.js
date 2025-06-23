const mongoose = require("mongoose");

const blacklistedTokenSchema = mongoose.Schema({
  token: { type: String, required: true },         // the JWT itself
  expiresAt: { type: Date, required: true }        // when the token expires
});

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
