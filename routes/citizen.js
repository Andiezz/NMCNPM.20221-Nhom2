const express = require('express');

const { authToken, authRole } = require('../middlewares/is-auth');
const citizenController = require('../controllers/citizen');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/create',
  authToken,
  authRole(['LEADER']),
  validator.citizenInfo,
  tryCatch(citizenController.createCitizen)
);

router.get(
  '/profile/:citizen_id',
  authToken,
  authRole(['LEADER', 'ACCOUNTANT']),
  validator.citizen_id,
  tryCatch(citizenController.getCitizen)
);

router.patch(
  '/update_profile/:citizen_id',
  authToken,
  authRole(['LEADER']),
  validator.citizen_id,
  validator.citizenInfo,
  tryCatch(citizenController.updateCitizen)
);

router.get(
  '/list',
  authToken,
  authRole(['LEADER', 'ACCOUNTANT']),
  tryCatch(citizenController.citizenList)
);

router.get(
  '/find',
  authToken,
  authRole(['LEADER', 'ACCOUNTANT']),
  tryCatch(citizenController.findCitizen)
);

router.get(
  '/statistic',
  authToken,
  authRole(['LEADER', 'ACCOUNTANT']),
  tryCatch(citizenController.statistic)
);

router.delete(
  '/delete/:citizen_id',
  authToken,
  authRole(['LEADER']),
  validator.citizen_id,
  tryCatch(citizenController.deleteCitizen)
);

module.exports = router;
