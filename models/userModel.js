let mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    phone_num: {type: String, required: true, unique: true, trim: true},
    hash_password: {type: String, required: true},
    role: { type: String, default: "user" },
    created_at: { type: Date, default: Date.now() }
})

let User = mongoose.model("User", userSchema)
module.exports = User