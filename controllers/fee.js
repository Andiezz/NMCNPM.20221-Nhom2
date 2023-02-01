const feeService = require('../services/fee');

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
  const result = await feeService.createFee({ name, required, memberPayment });
  if (!result) {
    return res
      .status(400)
      .json({ response_status: 0, message: 'Create fee fail' });
  }
  res.status(200).json({
    response_status: 1,
    message: 'Create fee successfully',
    data: { fee: result },
  });
};

exports.updateFee = async (req, res) => {
  const { name, required, memberPayment } = req.body;
  const fee_id = req.params.fee_id;
  const result = await feeService.updateFee({
    name,
    required,
    memberPayment,
    fee_id,
  });
  if (!result) {
    return res
      .status(400)
      .json({ response_status: 0, message: 'Update fee fail' });
  }
  res.status(200).json({
    response_status: 1,
    message: 'Update fee successfully',
    data: { updated_fee: result },
  });
};

exports.deleteFee = async (req, res) => {
  const fee_id = req.params.fee_id;
  const result = await feeService.deleteFeeById(fee_id);

  if (!result) {
    return res.status(400).json({ 
      response_status: 0, 
      message: 'Delete fee fail' 
    });
  }

  res.status(200).json({ 
    response_status: 1, 
    message: 'Delete fee successfully' 
  });
};
