let mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    phone_num: {type: String, required: true, unique: true, trim: true},
    hash_password: {type: String, required: true},
    role: { type: String, default: "user" },
    isActive: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
    // verificationToken: {type: String, default: null},
    // verificationTokenExpiry: {type: Date, default: null},
    // resetPasswordToken: {type: String, default: null},
    // resetPasswordTokenExpiry: {type: Date, default: null},
    // passwordChangedAt: {type: Date, default: null},
    // passwordResetAt: {type: Date, default: null},
    // passwordResetToken: {type: String, default: null},
    // passwordResetTokenExpiry: {type: Date, default: null},
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
})

let Users = mongoose.model("Users", userSchema)
module.exports = Users
