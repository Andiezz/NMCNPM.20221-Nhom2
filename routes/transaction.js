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

router.get(
  '/details/:transaction_id',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.transaction_id,
  tryCatch(transactionController.transactionDetail)
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
  '/statistic-donation',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.year,
  tryCatch(transactionController.statisticDonation)
);

router.get(
  '/statistic-fee',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.year,
  tryCatch(transactionController.statisticFee)
);

router.get(
  '/total',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.year,
  tryCatch(transactionController.total)
);

module.exports = router;
