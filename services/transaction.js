const Transaction = require('../models/transaction');
const Household = require('../models/household');
const Fee = require('../models/fee');

exports.createTransaction = async (fee_id) => {
  const household_list = await Household.find();
  const check_fee = await Fee.findById(fee_id);
  let total = check_fee.required * 12;

  for (i = 0; i < household_list.length; i++) {
    if (check_fee.memberPayment) {
      total = household_list[i].members.length * 12 * check_fee.required;
    }
    const transaction_info = {
      fee_id,
      household_id: household_list[i]._id,
      cost: total,
    };
    await Transaction.create(transaction_info);
  }
};
