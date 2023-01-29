const express = require('express');

const { authToken, authRole } = require('../middlewares/is-auth');
const householdController = require('../controllers/household');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/create',
  authToken,
  authRole(['ADMIN', 'LEADER']),
  tryCatch(householdController.createHousehold)
);

module.exports = router;
