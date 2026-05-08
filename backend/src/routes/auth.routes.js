const express = require("express");

const router = express.Router();

const authController = require(
    "../controllers/auth.controller"
);

console.log(authController);

// REGISTER
router.post(
    "/register",
    authController.register
);

// LOGIN
router.post(
    "/login",
    authController.login
);

// FORGOT PASSWORD
router.post(
    "/forgot-password",
    authController.forgotPassword
);

// RESET PASSWORD
router.put(
    "/reset-password/:token",
    authController.resetPassword
);

module.exports = router;