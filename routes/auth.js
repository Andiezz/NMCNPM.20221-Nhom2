const express = require("express")

const authController = require("../controllers/auth")

const router = express.Router()

router.post("/login", authController.login)

// router.post("/logout")

module.exports = router