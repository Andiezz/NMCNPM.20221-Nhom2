const feeService = require('../services/fee');
const transactionService = require('../services/transaction');

exports.feeList = async (req, res) => {
  const list = await feeService.feeList();
  res.status(200).json({
    response_status: 1,
    message: 'Fetched all fees',
    data: { list: list },
  });
};

exports.createFee = async (req, res) => {
  const { name, required, memberPayment } = req.body;
  const newFee = await feeService.createFee({ name, required, memberPayment });
  if (!newFee) {
    return res
      .status(400)
      .json({ response_status: 0, message: 'Create fee fail' });
  }
  if (newFee.required != 0) {
    await transactionService.createTransaction(newFee._id);
  }
  res.status(200).json({
    response_status: 1,
    message: 'Create fee successfully',
    data: { fee: newFee },
  });
};

exports.updateFee = async (req, res) => {
  const { name, required, memberPayment } = req.body;
  const fee_id = req.params.fee_id;
  const updated_fee = await feeService.updateFee({
    name,
    required,
    memberPayment,
    fee_id,
  });
  if (!updated_fee) {
    return res
      .status(400)
      .json({ response_status: 0, message: 'Update fee fail' });
  }
  res.status(200).json({
    response_status: 1,
    message: 'Update fee successfully',
    data: { updated_fee: updated_fee },
  });
};

exports.deleteFee = async (req, res) => {
  const fee_id = req.params.fee_id;
  const result = await feeService.deleteFeeById(fee_id);

  if (!result) {
    return res
      .status(400)
      .json({ response_status: 0, message: 'Delete fee fail' });
  }

  res
    .status(200)
    .json({ response_status: 1, message: 'Delete fee successfully' });
};
