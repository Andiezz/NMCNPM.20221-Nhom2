const express = require('express');

const isAuth = require('../middlewares/is-auth');
const citizenController = require('../controllers/citizen');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/create',
  isAuth.authToken,
  isAuth.authRole(['ADMIN', 'LEADER']),
  validator.createCitizen,
  tryCatch(citizenController.createCitizen)
);

router.get('/profile/:citizen_id', tryCatch(citizenController.getCitizen));

router.patch(
  '/update_profile/:citizen_id',
  isAuth.authToken,
  isAuth.authRole(['ADMIN', 'LEADER']),
  validator.updateCitizenProfile,
  tryCatch(citizenController.updateCitizen)
);

router.get(
  '/list', 
  isAuth.authToken, 
  isAuth.authRole(['ADMIN', 'LEADER']),
  tryCatch(citizenController.citizenList)
)

router.delete(
  '/delete/:citizen_id',
  isAuth.authToken, 
  isAuth.authRole(['ADMIN', 'LEADER']),
  validator.fee_id,
  tryCatch(citizenController.deleteCitizen)
);

module.exports = router;
