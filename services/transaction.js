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

exports.transaction_info = async (transaction_id) => {
  return await Transaction.findById(transaction_id);
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

exports.addTransactionForNewHousehold = async (household_id) => {
  const fee_list = await Fee.find({ required: { $ne: 0 } });
  const check_household = await Household.findById(household_id);

  for (i = 0; i < fee_list.length; i++) {
    let total = fee_list[i].required * 12;
    if (fee_list[i].memberPayment) {
      total = check_household.members.length * 12 * fee_list[i].required;
    }
    const new_year = new Date().getFullYear();
    await Transaction.create({
      fee_id: fee_list[i]._id,
      household_id: household_id,
      cost: total,
      year: new_year,
    });
  }
  return;
};

exports.statisticDonation = async (year) => {
  return await Transaction.aggregate([
    {
      $match: {
        cost: { $eq: 0 },
        year: year,
      },
    },
    {
      $group: {
        _id: { stage: '$stage', fee_id: '$fee_id' },
        total: { $sum: '$status' },
      },
    },
    {
      $project: {
        _id: 0,
        donation_info: '$_id',
        total: 1,
      },
    },
    {
      $lookup: {
        from: 'fees',
        localField: 'donation_info.fee_id',
        foreignField: '_id',
        as: 'fee',
      },
    },
    { $unwind: { path: '$fee' } },
    {
      $project: {
        _id: 0,
        stage: '$donation_info.stage',
        fee: 1,
        total: 1,
      },
    },
    {
      $sort: { stage: 1 },
    },
  ]);
};

exports.statisticFee = async (year) => {
  return await Transaction.aggregate([
    {
      $match: {
        cost: { $ne: 0 },
        year: year,
      },
    },
    {
      $group: {
        _id: '$fee_id',
        total: { $sum: '$status' },
        unpaid_household: {
          $push: {
            $cond: [{ $eq: ['$status', 0] }, '$household_id', null],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        fee: '$_id',
        total: 1,
        unpaid_household: 1,
      },
    },
    {
      $lookup: {
        from: 'fees',
        localField: 'fee',
        foreignField: '_id',
        as: 'fee',
      },
    },
    { $unwind: { path: '$fee' } },
    // {
    //   $lookup: {
    //     from: 'households',
    //     localField: 'unpaid_household',
    //     foreignField: '_id',
    //     as: 'unpaid_household',
    //   },
    // },
    {
      $sort: { total: -1 },
    },
  ]);
};

exports.total = async (year) => {
  const total_fee = await Transaction.aggregate([
    {
      $match: {
        year: year,
        cost: { $ne: 0 },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$status' },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
      },
    },
  ]);

  const total_donation = await Transaction.aggregate([
    {
      $match: {
        year: year,
        cost: { $eq: 0 },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$status' },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
      },
    },
  ]);
  return { total_fee, total_donation };
};
