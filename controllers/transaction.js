const transactionService = require('../services/transaction');

exports.transactionList = async (req, res) => {
  const household_id = req.params.household_id;
  const transaction_list =
    await transactionService.getAllTransactionByHouseHold(household_id);

  res.status(200).json({
    response_status: 1,
    message: 'Fetched all transaction successfully',
    data: { transaction_list },
  });
};

exports.transactionDetail = async (req, res) => {
  const transaction_id = req.params.transaction_id;
  const transaction_info = await transactionService.transaction_info(
    transaction_id
  );

  res.status(200).json({
    response_status: 1,
    message: 'Fetched transaction detail successfully',
    data: { transaction_info },
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

exports.statisticDonation = async (req, res) => {
  const { year } = req.body;
  const total_donation = await transactionService.statisticDonation(year);
  res.status(200).json({
    response_status: 1,
    message: 'Fetched total donation successfully',
    data: { total_donation },
  });
};

exports.statisticFee = async (req, res) => {
  const { year } = req.body;
  const statistic = await transactionService.statisticFee(year);
  res.status(200).json({
    response_status: 1,
    message: 'Fetched statistic successfully',
    data: { statistic },
  });
};

exports.total = async (req, res) => {
  const { year } = req.body;
  const { total_fee, total_donation } = await transactionService.total(year);
  res.status(200).json({
    response_status: 1,
    message: 'Fetched total fee & donation  successfully',
    data: {
      total_fee: total_fee[0].total,
      total_donation: total_donation.length != 0 ? total_donation[0].total : 0,
      sum:
        total_fee[0].total +
        (total_donation.length != 0 ? total_donation[0].total : 0),
    },
  });
};
