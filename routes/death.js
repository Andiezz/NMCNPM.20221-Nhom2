const express = require('express')

const isAuth = require('../middlewares/is-auth');
const deathController = require('../controllers/death');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');
const death = require('../models/death');

const router = express.Router();

router.post(
  '/create',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(deathController.createDeath)
)

router.get(
  '/detail/:deathId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  validator.death_id,
  tryCatch(deathController.getDeath)
)

router.patch(
  '/update/:deathId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  validator.death_id,
  tryCatch(deathController.updateDeath)
)

router.get(
  '/list',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  tryCatch(deathController.deathList)
)

router.delete(
  '/delete/:deathId',
  isAuth.authToken,
  isAuth.authRole(['LEADER']),
  validator.death_id,
  tryCatch(deathController.deleteDeath)
)

module.exports = router;