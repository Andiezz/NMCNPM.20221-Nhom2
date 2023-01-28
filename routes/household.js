const express = require('express');

const { authToken } = require('../middlewares/is-auth');
const householdController = require('../controllers/household');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

// router.post(
//   '/create_household',
//   isAuth.authToken,
//   isAuth.authRole(['ADMIN', 'LEADER']),
//   tryCatch(householdController)
// );

module.exports = router;
