const { BadRequestError } = require('../utils/error');

const Fee = require('../models/fee');
const Transaction = require('../models/transaction');
const Household = require('../models/household');

exports.feeList = async () => {
  let list = {};
  list.fee = await Fee.find({ required: { $ne: 0 } });
  list.donation = await Fee.find({ required: { $eq: 0 } });
  return list;
};

exports.donationList = async () => {
  return await Fee.find({ required: { $eq: 0 } });
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
  const transaction_list = await Transaction.find({ fee_id });

  for (i = 0; i < transaction_list.length; i++) {
    let total = 12 * required;
    if (memberPayment) {
      const check_household = await Household.findById(
        transaction_list[i].household_id
      );
      total *= check_household.members.length;
    }

    transaction_list[i].cost = total;
    await transaction_list[i].save();
  }

  check_fee.name = name;
  check_fee.required = required;
  check_fee.memberPayment = memberPayment;
  return await check_fee.save();
};

exports.deleteFeeById = async (fee_id) => {
  await Transaction.deleteMany({ fee_id });
  return await Fee.findByIdAndDelete(fee_id);
};
