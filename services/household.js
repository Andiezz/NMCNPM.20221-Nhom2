const Household = require('../models/household');
const Citizen = require('../models/citizen');

const citizenService = require('../services/citizen');

const BadRequestError = require('../errors/bad-request-error');
const DatabaseConnectionError = require('../errors/database-connection-error');

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
    throw new BadRequestError("This citizen has not belonged to any household yet.");
  }

  if (household.owner_id.toString() === citizen_id.toString()) {
    throw new BadRequestError("Can not remove the owner.")
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
  return await Household.find();
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
