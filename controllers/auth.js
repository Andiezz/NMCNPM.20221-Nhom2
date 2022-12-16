const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
require('dotenv').config()

const User = require("../models/user")

exports.login = async (req, res, next) => {
    const { phone, password, role } = req.body

    const check_user = await User.findOne({
        phone: phone,
        role: role
    })

    if (!check_user) {
        const err = new Error("Your phone or role is incorrect!")
        err.statusCode = 404
        throw err
    }

    const isEqual = bcrypt.compare(password, check_user.password)
    if (!isEqual) {
        const err = new Error("Wrong password")
        err.statusCode = 401
        throw err
    }

    const user = check_user
    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h"
    })
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24 * 90
    })
    user.refresh_token = refresh_token
    await user.save()
    req.session = { access_token }
    req.user = user

    res.status(200).json({
        response_status: 1,
        message: "Login successfully",
        data: {
            refresh_token
        }
    })
}