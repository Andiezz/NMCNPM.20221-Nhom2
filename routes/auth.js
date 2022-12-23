const express = require("express");

const { authToken } = require("../middlewares/is-auth");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", authController.login);

router.post("/token", authController.generateToken);

router.post("/reset", authController.reset)

router.patch("/reset_password", authController.resetPassword)

router.post("/logout", authToken, authController.logout);

module.exports = router;
