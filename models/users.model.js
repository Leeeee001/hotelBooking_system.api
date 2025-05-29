let mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, trim: true, lowercase: true},
    phone_num: {type: String, required: true, unique: true, trim: true},
    hash_password: {type: String, required: true},
    role: {type: String, enum: ["user", "customer"], default: "user", required: true},
    is_active: {type: Boolean, default: true},
    is_deleted: {type: Boolean, default: false},
    is_verified: {type: Boolean, default: false},
}, { timestamps: true })

let Users = mongoose.model("Users", userSchema)
module.exports = Users;
