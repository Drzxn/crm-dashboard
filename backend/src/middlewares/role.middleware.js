// backend/src/middleware/role.middleware.js

const User = require("../models/user.model");

const allowRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            // Get fresh user from DB
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // 🔍 Debug logs (keep for now)
            console.log("USER ROLE:", user.role);
            console.log("ALLOWED ROLES:", roles);

            // Check role
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
};

module.exports = allowRoles;