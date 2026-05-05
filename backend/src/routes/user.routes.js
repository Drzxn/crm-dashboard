const express = require("express");
const router = express.Router();

// ✅ IMPORT MIDDLEWARES (THIS IS WHAT YOU MISSED)
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const User = require("../models/user.model");

// 🔐 ADMIN ONLY ROUTE
router.get("/admin-only", auth, role("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// 🔥 /me endpoint
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("managerId", "name email role"); // optional

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("ME ERROR:", error); // helpful log
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;