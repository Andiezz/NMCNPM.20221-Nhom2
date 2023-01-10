const express = require("express");

const isAuth = require("../middlewares/is-auth");
const userController = require("../controllers/user");
const user = require("../models/user");

const router = express.Router();

router.post("/register", isAuth.authToken, isAuth.authRole(["ADMIN"]), userController.register);

router.get("/profile/:userId", isAuth.authToken, userController.profile)

router.patch("/profile/:userId", isAuth.authToken, userController.updateProfile)

router.patch("/updatePassword/:userId", isAuth.authToken, userController.updatePassword)

router.get("/userList", isAuth.authToken, isAuth.authRole(["ADMIN"]), userController.userList)

router.delete("/delete/:userId", isAuth.authToken, isAuth.authRole(["ADMIN"]), userController.deleteAccount)

module.exports = router;
