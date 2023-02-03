const mongoose = require('mongoose');

const Transaction = require('../models/transaction');
const Household = require('../models/household');
const Fee = require('../models/fee');

exports.getAllTransactionByHouseHold = async (household_id) => {
  let list = {};

  list.transactions = await Transaction.aggregate([
    {
      $match: {
        household_id: mongoose.Types.ObjectId(household_id),
        cost: { $ne: 0 },
      },
    },
    {
      $lookup: {
        from: 'fees',
        localField: 'fee_id',
        foreignField: '_id',
        as: 'fee',
      },
    },
    { $unwind: { path: '$fee' } },
    {
      $addFields: {
        remain: { $subtract: ['$cost', '$status'] },
      },
    },
    {
      $sort: { remain: -1 },
    },
  ]);

  list.donations = await Transaction.aggregate([
    {
      $match: {
        household_id: mongoose.Types.ObjectId(household_id),
        cost: { $eq: 0 },
      },
    },
    {
      $lookup: {
        from: 'fees',
        localField: 'fee_id',
        foreignField: '_id',
        as: 'fee',
      },
    },
    { $unwind: { path: '$fee' } },
  ]);

  return list;
};

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

exports.donate = async ({ fee_id, household_id, amount, stage }) => {
  return await Transaction.create({
    fee_id,
    household_id,
    cost: 0,
    status: amount,
    stage: stage,
  });
};

exports.pay = async ({ transaction_id }) => {
  const check_transaction = await Transaction.findById(transaction_id);

  check_transaction.status = check_transaction.cost;
  return await check_transaction.save();
};

exports.unpay = async ({ transaction_id }) => {
  const check_transaction = await Transaction.findById(transaction_id);

  check_transaction.status = 0;
  if (check_transaction.cost == 0) {
    return await Transaction.findByIdAndDelete(check_transaction._id);
  }
  return await check_transaction.save();
};

exports.newYearTransaction = async () => {
  const fee_list = await Fee.find({ required: { $ne: 0 } });
  const household_list = await Household.find();

  for (i = 0; i < fee_list.length; i++) {
    let total = fee_list[i].required * 12;
    for (j = 0; j < household_list.length; j++) {
      if (fee_list[i].memberPayment) {
        total = household_list[j].members.length * 12 * fee_list[i].required;
      }
      const new_year = new Date().getFullYear();
      const check_duplicate = await Transaction.exists({
        year: new_year,
        fee_id: fee_list[i]._id,
        household_id: household_list[j]._id,
      });
      if (!check_duplicate)
        await Transaction.create({
          fee_id: fee_list[i]._id,
          household_id: household_list[j]._id,
          cost: total,
          year: new_year,
        });
    }
  }
  return;
};

exports.totalDonation = async () => {
  const totalDonation = await Transaction.aggregate([
    {
      $match: {
        cost: { $eq: 0 },
      },
    },
    {
      $group: {
        _id: '$stage',
        total: { $sum: '$status' },
      },
    },
    {
      $project: {
        _id: 0,
        stage: '$_id',
        total: 1,
      },
    },
    {
      $sort: { stage: 1 },
    },
  ]);
  return totalDonation;
};
