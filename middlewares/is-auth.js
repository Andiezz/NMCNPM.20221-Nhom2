const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authToken = (req, res, next) => {
    if (!req.session.access_token) {
        const err = new Error("You are not authenticated.");
        err.statusCode = 401;
        throw err;
    }

    jwt.verify(req.session.access_token, "Grace's secret", (err, user) => {
        if (err) {
            const err = new Error("Timeout please login again.");
            err.statusCode = 403;
            throw err;
        }
        req.user = user;
        next();
    });
};

exports.authRole = (roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role) || req.user.status != 1) {
            return res.status(401).json({
                response_status: 0,
                message: "Access Denied - Unauthorized",
                data: null,
            });
        }
        next();
    };
};
