const express = require("express");

const { authToken } = require("../middlewares/is-auth");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", authController.login);

router.post("/genToken", authController.generateToken);

router.post("/genResetToken", authController.genResetToken)

router.patch("/resetPassword", authController.resetPassword)

router.post("/logout", authToken, authController.logout);

module.exports = router;
