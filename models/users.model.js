let mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true, lowercase: true},
    phone_num: {type: Number, required: true, unique: true, trim: true},
    hash_password: {type: String, trim: true, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user", required: true},
    otp: {code: String, expiry: Date},
    is_verified: {type: Boolean, default: false},
    is_active: {type: Boolean, default: true},
    is_deleted: {type: Boolean, default: false}
}, { timestamps: true })


let User = mongoose.model("User", userSchema)
module.exports = User;
