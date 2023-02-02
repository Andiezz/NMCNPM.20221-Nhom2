const transactionService = require('../services/transaction');

exports.transactionList = async (req, res) => {
  const household_id = req.params.household_id;
  const transaction_list =
    await transactionService.getAllTransactionByHouseHold(household_id);

  res.status(200).json({
    response_status: 1,
    message: 'Fetched all transaction',
    data: { transaction_list },
  });
};

exports.donate = async (req, res) => {
  const household_id = req.params.household_id;
  const { fee_id, amount, stage } = req.body;
  const donation = await transactionService.donate({
    fee_id,
    household_id,
    amount,
    stage,
  });
  res.status(200).json({
    response_status: 1,
    message: 'Donate successfully',
    data: { donation },
  });
};

exports.pay = async (req, res) => {
  const transaction_id = req.params.transaction_id;

  const new_transaction = await transactionService.pay({
    transaction_id,
  });

  res.status(200).json({
    response_status: 1,
    message: 'Pay fee successfully',
    data: { new_transaction },
  });
};

exports.unpay = async (req, res) => {
  const transaction_id = req.params.transaction_id;

  const new_transaction = await transactionService.unpay({
    transaction_id,
  });

  res.status(200).json({
    response_status: 1,
    message: 'Unpay fee successfully',
    data: { new_transaction },
  });
};

exports.newYearTransaction = async (req, res) => {
  await transactionService.newYearTransaction();
  res.status(200).json({
    response_status: 1,
    message: 'Reset new year transactions successfully',
  });
};

exports.totalDonation = async (req, res) => {
  const total_donation = await transactionService.totalDonation();
  res.status(200).json({
    response_status: 1,
    message: 'Fetched total donation successfully',
    data: { total_donation },
  });
};
