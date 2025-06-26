let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, trim: true, lowercase: true},
    phone_num: {type: String, unique: true, trim: true},
    hash_password: {type: String, trim: true},
    role: {type: String, enum: ["user", "admin"], required: true},
    otp: {code: String, expiry: Date},
    provider: { type: String, enum: ["local", "google"], default: "local" },
    google_id: { type: String },
    is_verified: {type: Boolean, default: false},
    is_active: {type: Boolean, default: true},
    is_deleted: {type: Boolean, default: false}
}, { timestamps: true });


let User = mongoose.model("User", userSchema);
module.exports = User;
