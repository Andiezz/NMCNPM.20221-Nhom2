const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const User = require("../models/user");

exports.login = async (req, res, next) => {
    const { phone, password, role } = req.body;

    const check_user = await User.findOne({
        phone: phone,
        role: role,
    });

    if (!check_user) {
        const err = new Error("Your phone or role is incorrect.");
        err.statusCode = 404;
        throw err;
    }

    const isEqual = bcrypt.compare(password, check_user.password);
    if (!isEqual) {
        const err = new Error("Wrong password.");
        err.statusCode = 401;
        throw err;
    }

    const user = {
        _id: check_user._id,
        role: check_user.role,
        status: check_user.status,
        citizen_id: check_user.citizen_id,
        phone: check_user.phone,
    };
    const access_token = jwt.sign(user, "Grace's secret", {
        expiresIn: "1h",
    });
    const refresh_token = jwt.sign(user, "Grace's secret", {
        expiresIn: 60 * 60 * 24 * 90,
    });
    check_user.refresh_token = refresh_token;
    await check_user.save();
    req.session = { access_token };
    req.user = user;

    res.status(200).json({
        response_status: 1,
        message: "Login successfully!",
        data: {
            refresh_token,
        },
    });
};

exports.generateToken = async (req, res, next) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        const err = new Error("Not authenticated.");
        err.statusCode = 401;
        throw err;
    }

    let check_user = await User.findOne({ refresh_token: refresh_token });
    if (!check_user) {
        req.session = null;
        req.user = null;
        const err = new Error("Refresh token not found.");
        err.statusCode = 404;
        throw err;
    }

    const user = {
        _id: check_user._id,
        role: check_user.role,
        status: check_user.status,
        citizen_id: check_user.citizen_id,
        phone: check_user.phone,
    };
    const access_token = jwt.sign(user, "Grace's secret", {
        expiresIn: "1h",
    });
    req.session = { access_token };

    return res.status(200).json({
        response_status: 1,
        message: "Refresh token successfully!",
        data: {
            access_token,
        },
    });
};

exports.logout = async (req, res, next) => {
    const check_user = await User.findById(req.user._id);
    check_user.refresh_token = undefined;
    check_user.save();
    req.user = null;
    req.session = null;

    res.status(200).json({
        response_status: 1,
        message: "Logout successfully!",
        data: null,
    });
};
