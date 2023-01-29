const express = require('express');

const { authToken, authRole } = require('../middlewares/is-auth');
const householdController = require('../controllers/household');

const { tryCatch } = require('../middlewares/errorHandler');

const router = express.Router();

router.post(
  '/create',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.createHousehold)
);

router.get(
  '/profile/:household_id',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.getHousehold)
)

router.patch(
  '/update/:household_id',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.updateHousehold)
)

router.patch(
  '/add_member/:household_id',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.addMember)
)

router.patch(
  '/remove_member/:household_id',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.removeMember)
)

router.get(
  '/list',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.householdList)
)

router.delete(
  '/delete/:household_id',
  authToken,
  authRole(['LEADER']),
  tryCatch(householdController.deleteHousehold)
)

module.exports = router;
