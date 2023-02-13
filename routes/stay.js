const express = require('express')

const isAuth = require('../middlewares/is-auth');
const stayController = require('../controllers/stay');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');
const stay = require('../models/stay');

const router = express.Router();

router.post(
  '/create',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(stayController.createStay)
)

router.get(
  '/detail/:stayId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(stayController.getStay)
)

router.patch(
  '/update/:stayId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(stayController.updateStay)
)

router.get(
  '/list',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(stayController.stayList)
)

router.delete(
  '/delete/:stayId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(stayController.deleteStay)
)

module.exports = router;