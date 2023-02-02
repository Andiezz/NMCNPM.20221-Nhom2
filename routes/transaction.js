const express = require('express');

const { authToken, authRole } = require('../middlewares/is-auth');
const transactionController = require('../controllers/transaction');

const { tryCatch } = require('../middlewares/errorHandler');
const validator = require('../middlewares/validator');

const router = express.Router();

router.get(
  '/list/:household_id',
  authToken,
  authRole(['ACCOUNTANT']),
  tryCatch(transactionController.transactionList)
);

router.post(
  '/donate/:household_id',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.donate,
  tryCatch(transactionController.donate)
);

router.put(
  '/pay/:transaction_id',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.transaction_id,
  tryCatch(transactionController.pay)
);

router.put(
  '/unpay/:transaction_id',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.transaction_id,
  tryCatch(transactionController.unpay)
);

router.post(
  '/reset',
  authToken,
  authRole(['ACCOUNTANT']),
  tryCatch(transactionController.newYearTransaction)
);

router.get(
  '/total-donation',
  authToken,
  authRole(['ACCOUNTANT']),
  tryCatch(transactionController.totalDonation)
);

module.exports = router;
