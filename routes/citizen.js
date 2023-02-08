const express = require('express');

const { authToken, authRole } = require('../middlewares/is-auth');
const citizenController = require('../controllers/citizen');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/create',
  authToken,
  authRole(['ADMIN', 'LEADER']),
  validator.createCitizen,
  tryCatch(citizenController.createCitizen)
);

router.get(
  '/profile/:citizen_id',
  authToken,
  authRole(['ADMIN', 'LEADER']),
  tryCatch(citizenController.getCitizen)
);

router.patch(
  '/update_profile/:citizen_id',
  authToken,
  authRole(['ADMIN', 'LEADER']),
  validator.updateCitizenProfile,
  tryCatch(citizenController.updateCitizen)
);

router.get(
  '/list',
  authToken,
  authRole(['ADMIN', 'LEADER']),
  tryCatch(citizenController.citizenList)
);

router.delete(
  '/delete/:citizen_id',
  authToken,
  authRole(['ADMIN', 'LEADER']),
  tryCatch(citizenController.deleteCitizen)
);

module.exports = router;
