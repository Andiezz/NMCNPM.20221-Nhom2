const express = require('express');

const { authToken, authRole } = require('../middlewares/is-auth');
const feeController = require('../controllers/fee');

const { tryCatch } = require('../middlewares/errorHandler');
const validator = require('../middlewares/validator');

const router = express.Router();

router.get(
  '/list',
  authToken,
  authRole(['ACCOUNTANT']),
  tryCatch(feeController.feeList)
);

router.get(
  '/donation',
  authToken,
  authRole(['ACCOUNTANT']),
  tryCatch(feeController.donationList)
);

router.post(
  '/create',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.fee,
  tryCatch(feeController.createFee)
);

router.put(
  '/update/:fee_id',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.fee_id,
  validator.fee,
  tryCatch(feeController.updateFee)
);

router.delete(
  '/delete/:fee_id',
  authToken,
  authRole(['ACCOUNTANT']),
  validator.fee_id,
  tryCatch(feeController.deleteFee)
);

module.exports = router;
