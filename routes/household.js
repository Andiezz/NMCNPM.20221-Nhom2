const express = require('express');

const { authToken, authRole } = require('../middlewares/is-auth');
const householdController = require('../controllers/household');
const validator = require('../middlewares/validator');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/create',
  authToken,
  authRole(['LEADER']),
  validator.householdInfo,
  tryCatch(householdController.createHousehold)
);

router.get(
  '/profile/:household_id',
  authToken,
  authRole(['LEADER', 'ACCOUNTANT']),
  validator.household_id,
  tryCatch(householdController.getHousehold)
);

router.patch(
  '/update/:household_id',
  authToken,
  authRole(['LEADER']),
  validator.household_id,
  tryCatch(householdController.updateHousehold)
);

router.patch(
  '/add_member/:household_id',
  authToken,
  authRole(['LEADER']),
  validator.household_id,
  tryCatch(householdController.addMember)
);

router.put(
  '/remove_member',
  authToken,
  authRole(['LEADER']),
  // validator.household_id,
  tryCatch(householdController.removeMember)
);

router.get(
  '/list',
  authToken,
  authRole(['LEADER', 'ACCOUNTANT']),
  tryCatch(householdController.householdList)
);

router.get(
  '/statistic',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.householdStatistic)
);

router.get(
  '/history/:household_id',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.householdHistory)
);

router.delete(
  '/delete/:household_id',
  authToken,
  authRole(['LEADER']),
  validator.household_id,
  tryCatch(householdController.deleteHousehold)
);

module.exports = router;
