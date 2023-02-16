const express = require('express');

const isAuth = require('../middlewares/is-auth');
const userController = require('../controllers/user');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/create_user',
  isAuth.authToken,
  isAuth.authRole(['ADMIN']),
  validator.phoneRole,
  validator.userInfo,
  tryCatch(userController.createUser)
);

router.get(
  '/details/:userId',
  isAuth.authToken,
  validator.user_id,
  tryCatch(userController.getUser)
);

router.patch(
  '/update_profile/:userId',
  isAuth.authToken,
  validator.user_id,
  validator.userUpdate,
  tryCatch(userController.updateUser)
);

router.patch(
  '/updatePassword/:userId',
  isAuth.authToken,
  validator.user_id,
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
  validator.user_id,
  tryCatch(userController.deleteAccount)
);

module.exports = router;
