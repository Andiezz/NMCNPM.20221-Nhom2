const express = require('express');

const { authToken } = require('../middlewares/is-auth');
const authController = require('../controllers/auth');
const validator = require("../middlewares/validator")

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post('/login', validator.login, tryCatch(authController.login));

router.post('/genToken',  tryCatch(authController.generateToken));

router.post('/genResetToken', validator.genResetToken, tryCatch(authController.genResetToken));

router.patch('/resetPassword', validator.resetPassword, tryCatch(authController.resetPassword));

router.post('/logout', authToken, tryCatch(authController.logout));

module.exports = router;
