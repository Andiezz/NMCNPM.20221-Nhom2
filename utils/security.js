const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.hashPassword = async (password) => {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

exports.signToken = async (user, secret, { exp }) => {
    return jwt.sign(user, secret, {
        exp
    })
}