const { BadRequestError } = require('../utils/error');

const Fee = require('../models/fee');

exports.feeList = async () => {
  return await Fee.find();
};

exports.createFee = async ({ name, required, memberPayment }) => {
  const check_fee = await Fee.findOne({ name });
  if (check_fee) {
    throw new BadRequestError("Fee's name already exist");
  }
  return await Fee.create({ name, required, memberPayment });
};

exports.updateFee = async ({ name, required, memberPayment, fee_id }) => {
  const check_fee = await Fee.findById(fee_id);
  const check_name = await Fee.findOne({ name });
  if (check_name && check_fee.name != name) {
    throw new BadRequestError("Fee's name already exist");
  }

  check_fee.name = name;
  check_fee.required = required;
  check_fee.memberPayment = memberPayment;
  return await check_fee.save();
};

exports.deleteFeeById = async (fee_id) => {
  return await Fee.findByIdAndDelete(fee_id);
};
