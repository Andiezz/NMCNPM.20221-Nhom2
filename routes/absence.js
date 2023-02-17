const express = require('express')

const isAuth = require('../middlewares/is-auth');
const absenceController = require('../controllers/absence');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');
const absence = require('../models/absence');

const router = express.Router();

router.post(
  '/create',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(absenceController.createAbsence)
)

router.get(
  '/get/:absenceId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  validator.death_id,
  tryCatch(absenceController.getAbsence)
)

router.patch(
  '/update/:absenceId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  validator.death_id,
  tryCatch(absenceController.updateAbsence)
)

router.get(
  '/list',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(absenceController.absenceList)
)

router.delete(
  '/delete/:absenceId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  validator.death_id,
  tryCatch(absenceController.deleteAbsence)
)

module.exports = router;