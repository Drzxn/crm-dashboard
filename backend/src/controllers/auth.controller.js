const User = require("../models/user.model");
const emailService = require("../services/email.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "sales"
        });

        res.json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role   // ✅ ADD THIS
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // ✅ GENERATE TOKEN
        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        // ✅ HASH TOKEN
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // ✅ SAVE HASHED TOKEN
        user.resetPasswordToken = hashedToken;

        // ✅ EXPIRE IN 15 MIN
        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        // ✅ RESET URL
        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // ✅ EMAIL HTML
        const html = `
      <h2>Password Reset</h2>

      <p>Click below to reset password:</p>

      <a href="${resetUrl}">
        Reset Password
      </a>
    `;

        // ✅ SEND EMAIL
        await emailService.sendEmail(
            user.email,
            "Password Reset",
            html
        );

        res.json({
            message:
                "Password reset email sent",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }
};

const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;

        const { password } = req.body;

        // ✅ HASH INCOMING TOKEN
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // ✅ FIND USER
        const user = await User.findOne({
            resetPasswordToken: hashedToken,

            resetPasswordExpire: {
                $gt: Date.now(),
            },
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid or expired token",
            });
        }

        // ✅ HASH NEW PASSWORD
        const hashedPassword =
            await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        // ✅ CLEAR RESET FIELDS
        user.resetPasswordToken = undefined;

        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            message:
                "Password reset successful",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }
};

// ✅ EXPORT PROPERLY
module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};