const express = require("express");

const isAuth = require("../middlewares/is-auth");
const userController = require("../controllers/user");
const user = require("../models/user");

const router = express.Router();

router.post("/register", isAuth.authToken, userController.register);

router.get("/profile/:userId", isAuth.authToken, userController.profile)

router.patch("/profile/:userId", isAuth.authToken, userController.updateProfile)

router.patch("/update_password/:userId", isAuth.authToken, userController.updatePassword)

router.get("/user_list", isAuth.authToken, isAuth.authRole(["admin"]), userController.userList)

router.delete("/delete/:userId", isAuth.authToken, isAuth.authRole(["admin"]), userController.deleteAccount)

module.exports = router;
