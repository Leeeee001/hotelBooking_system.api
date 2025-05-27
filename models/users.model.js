let mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true, lowercase: true},
    phone_num: {type: String, required: true, unique: true, trim: true},
    hash_password: {type: String, required: true},
    role: {type: String, enum: ["user", "customer"], default: "user", required: true},
    isActive: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
}, { timestamps: true })

let Users = mongoose.model("Users", userSchema)
module.exports = Users
