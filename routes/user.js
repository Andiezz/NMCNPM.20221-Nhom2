const express = require('express');

const isAuth = require('../middlewares/is-auth');
const userController = require('../controllers/user');
const user = require('../models/user');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/register',
  isAuth.authToken,
  isAuth.authRole(['ADMIN']),
  tryCatch(userController.register)
);

router.get(
  '/profile/:userId',
  isAuth.authToken,
  tryCatch(userController.profile)
);

router.patch(
  '/profile/:userId',
  isAuth.authToken,
  tryCatch(userController.updateProfile)
);

router.patch(
  '/updatePassword/:userId',
  isAuth.authToken,
  tryCatch(userController.updatePassword)
);

router.get(
  '/userList',
  isAuth.authToken,
  isAuth.authRole(['ADMIN']),
  tryCatch(userController.userList)
);

router.delete(
  '/delete/:userId',
  isAuth.authToken,
  isAuth.authRole(['ADMIN']),
  tryCatch(userController.deleteAccount)
);

module.exports = router;
