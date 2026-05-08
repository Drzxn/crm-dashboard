// backend/src/models/user.model.js

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'tl', 'sales'],
        default: 'sales',
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamps: true });


// 🔥 HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


// (Optional but good practice)
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);