const express = require('express');

const isAuth = require('../middlewares/is-auth');
const userController = require('../controllers/user');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/register',
  isAuth.authToken,
  isAuth.authRole(['ADMIN']),
  validator.register,
  tryCatch(userController.register)
);

router.get(
  '/profile/:userId',
  isAuth.authToken,
  tryCatch(userController.getUser)
);

router.patch(
  '/profile/:userId',
  isAuth.authToken,
  validator.updateUserProfile,
  tryCatch(userController.updateUser)
);

router.patch(
  '/updatePassword/:userId',
  isAuth.authToken,
  validator.updatePassword,
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
