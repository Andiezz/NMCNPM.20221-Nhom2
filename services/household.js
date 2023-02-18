const Household = require('../models/household');
const Citizen = require('../models/citizen');
const Household_History = require('../models/household');

const {
  BadRequestError,
  DatabaseConnectionError,
  DataNotFoundError,
} = require('../utils/error');

exports.createHousehold = async ({
  household_id,
  owner_id,
  areaCode,
  address,
  members,
  move_in,
  move_out,
  modifiedBy,
}) => {
  const checkHousehold = await Household.findOne({
    household_id: household_id,
  });
  if (checkHousehold) {
    throw new BadRequestError('Household has already existed.');
  }

  const memberIds = members.map((member) => {
    return member.citizen_id;
  });

  if (!memberIds.includes(owner_id.toString())) {
    throw new BadRequestError('Owner has to be a member.');
  }

  const household = new Household({
    household_id: household_id,
    owner_id: owner_id,
    areaCode: areaCode,
    address: address,
    members: members,
    move_in: move_in,
    move_out: move_out,
    modifiedBy: modifiedBy,
  });

  const newHousehold = await household.save();
  if (newHousehold !== household) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }
  return newHousehold;
};

exports.updateHousehold = async ({
  _id,
  household_id,
  owner_id,
  areaCode,
  address,
  members,
  move_in,
  move_out,
  modifiedBy,
}) => {
  const updatedHousehold = await Household.findById(_id);
  const isExist = await Household.findOne({ household_id: household_id });

  if (updatedHousehold.household_id !== household_id && isExist) {
    throw new BadRequestError('This household_id has already been used.');
  }

  const check_owner = await Citizen.findById(owner_id);
  if (!check_owner) {
    throw new BadRequestError('This citizen is not existed.');
  }

  const memberIds = members.map((member) => {
    return member.citizen_id;
  });

  const memberIds2 = members.map((member) => {
    return member.citizen_id._id;
  });

  if (!memberIds.includes(owner_id.toString()) || 
              !memberIds2.includes(owner_id.toString()) && memberIds2[0] !== undefined) {
    throw new BadRequestError('Owner has to be a member.');
  }

  updatedHousehold.household_id = household_id;
  updatedHousehold.owner_id = owner_id;
  updatedHousehold.areaCode = areaCode;
  updatedHousehold.address = address;
  updatedHousehold.members = members;
  updatedHousehold.move_in = move_in;
  updatedHousehold.move_out = move_out;
  updatedHousehold.modifiedBy = modifiedBy;

  const savedHousehold = await updatedHousehold.save();
  return savedHousehold;
};

exports.addMember = async ({ household_id, citizen_id, relation }) => {
  const citizen = await Citizen.findById(citizen_id);
  const household = await Household.findById(household_id);

  if (citizen.household_id != null) {
    throw new BadRequestError(
      'This citizen has already belonged to a household.'
    );
  }

  citizen.household_id = household_id;

  const updatedCitizen = await citizen.save();

  if (updatedCitizen != citizen) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  household.members.push({
    citizen_id: citizen_id,
    relation: relation,
  });

  const updatedHousehold = await household.save();

  if (updatedHousehold !== household) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return updatedHousehold;
};

exports.removeMember = async ({ household_id, citizen_id }) => {
  const citizen = await Citizen.findById(citizen_id);
  const household = await Household.findById(household_id);

  if (citizen.household_id == null) {
    throw new BadRequestError(
      'This citizen has not belonged to any household yet.'
    );
  }

  if (household.owner_id.toString() === citizen_id.toString()) {
    throw new BadRequestError('Can not remove the owner.');
  }

  for (let i = 0; i < household.members.length; i++) {
    if (household.members[i].citizen_id.toString() === citizen_id) {
      household.members.splice(i, 1);
      citizen.household_id = null;
    }
  }

  const updatedCitizen = await citizen.save();
  const updatedHousehold = await household.save();

  if (updatedHousehold !== household || updatedCitizen !== citizen) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return updatedHousehold;
};

exports.houseHoldList = async () => {
  return await Household.find().populate('owner_id').populate('members.citizen_id');
};

exports.householdHistory = async (household_id) => {
  const history = await Household_History.find({
    original_id: household_id,
  })
    .populate('owner_id')
    .populate('members.citizen_id');

  if (history.length === 0) {
    throw new DataNotFoundError('This household has never updated.');
  }

  return history;
};

exports.householdStatistic = async () => {
  const total = await Household.countDocuments();
  return total;
};

exports.deleteHouseholdById = async (household_id) => {
  const household = await Household.findById(household_id);
  const citizens = household.members;

  for (let i = 0; i < citizens.length; i++) {
    const citizen_id = citizens[i].citizen_id;
    const citizen = await Citizen.findById(citizen_id);
    citizen.household_id = null;
    await citizen.save();
  }

  return await Household.findByIdAndDelete(household_id);
};
