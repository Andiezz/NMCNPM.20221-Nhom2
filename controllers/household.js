const Household = require('../models/household');

const householdService = require('../services/household');
const transactionService = require('../services/transaction');

exports.createHousehold = async (req, res, next) => {
  const {
    household_id,
    owner_id,
    areaCode,
    address,
    members,
    move_in,
    move_out,
  } = req.body;

  const newHousehold = await householdService.createHousehold({
    household_id: household_id,
    owner_id: owner_id,
    areaCode: areaCode,
    address: address,
    members: members,
    move_in: move_in,
    move_out: move_out,
    modifiedBy: req.user._id,
  });

  await transactionService.addTransactionForNewHousehold(newHousehold._id);

  res.status(200).json({
    responseStatus: 1,
    message: 'New household created!',
    data: {
      household: newHousehold,
    },
  });
};

exports.getHousehold = async (req, res, next) => {
  const household_id = req.params.household_id;
  const check_household = await Household.findById(household_id)
    .populate('owner_id')
    .populate('members.citizen_id');
  if (!check_household) {
    throw new DataNotFoundError('Household not found');
  }

  res.status(200).json({
    responseStatus: 1,
    message: 'Household fetched!',
    data: {
      household: check_household,
    },
  });
};

exports.updateHousehold = async (req, res, next) => {
  const {
    household_id,
    owner_id,
    areaCode,
    address,
    members,
    move_in,
    move_out,
  } = req.body;

  const _id = req.params.household_id;

  const updatedHousehold = await householdService.updateHousehold({
    _id: _id,
    household_id: household_id,
    owner_id: owner_id,
    areaCode: areaCode,
    address: address,
    members: members,
    move_in: move_in,
    move_out: move_out,
    modifiedBy: req.user._id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Household updated!',
    data: {
      updatedHousehold: updatedHousehold,
    },
  });
};

exports.addMember = async (req, res, next) => {
  const { citizen_id, relation } = req.body;
  const household_id = req.params.household_id;

  const updatedHousehold = await householdService.addMember({
    household_id: household_id,
    citizen_id: citizen_id,
    relation: relation,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Member added!',
    data: {
      updatedHousehold: updatedHousehold,
    },
  });
};

exports.removeMember = async (req, res, next) => {
  // const { citizen_id } = req.body;
  // const household_id = req.params.household_id;
  // const citizen_id = req.params.citizen_id;

  const household_id = req.query.household_id;
  const citizen_id = req.query.citizen_id;

  const updatedHousehold = await householdService.removeMember({
    household_id: household_id,
    citizen_id: citizen_id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Member removed!',
    data: {
      updatedHousehold: updatedHousehold,
    },
  });
};

exports.householdList = async (req, res, next) => {
  const list = await householdService.houseHoldList();

  res.status(200).json({
    response_status: 1,
    message: 'Fetched all households',
    data: { list: list },
  });
};

exports.findHousehold = async (req, res, next) => {
  const key = req.query.key;
  const result = await householdService.findHousehold(key);

  res.status(200).json({
    response_status: 1,
    message: `${result.length} household(s) found.`,
    data: { result: result },
  });
};

exports.householdHistory = async (req, res, next) => {
  const household_id = req.params.household_id;
  const history = await householdService.householdHistory(household_id);

  res.status(200).json({
    response_status: 1,
    message: 'History fetched.',
    data: { history: history },
  });
};

exports.householdStatistic = async (req, res, next) => {
  const total = await householdService.householdStatistic();
  res.status(200).json({
    response_status: 1,
    message: 'Statistic found',
    data: { total: total },
  });
};

exports.deleteHousehold = async (req, res, next) => {
  const household_id = req.params.household_id;
  const result = await householdService.deleteHouseholdById(household_id);

  if (!result) {
    return res.status(400).json({
      response_status: 0,
      message: 'Delete Household fail.',
    });
  }

  res.status(200).json({
    response_status: 1,
    message: 'Delete household successfully.',
  });
};
