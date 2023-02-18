const User = require('../models/user');
const Citizen = require('../models/citizen');
const CardIdentity = require('../models/cardIdentity');
const Household = require('../models/household');
const Citizen_History = require('../models/citizenHistory');
const Card_Identity_History = require('../models/cartIdentityHistory');

const cardIdentityService = require('../services/cartIdentity');
const householdService = require('../services/household');

const {
  DatabaseConnectionError,
  DataNotFoundError,
  BadRequestError,
} = require('../utils/error');

exports.getCitizenById = async ({ card_id, passport_id }) => {
  const citizen = await Citizen.findOne({
    card_id: card_id,
    passport_id: passport_id,
  });
  return citizen;
};

exports.createCitizen = async ({
  card_id,
  passport_id,
  firstName,
  lastName,
  gender,
  dob,
  birthPlace,
  hometown,
  residence,
  accommodation,
  religion,
  ethic,
  profession,
  workplace,
  education,
  moveInDate,
  moveInReason,
  moveOutDate,
  moveOutReason,
  modifiedBy,
}) => {
  const isExist = await Citizen.exists({ passport_id: passport_id });
  if (isExist) {
    throw new BadRequestError('Passport id has already existed.');
  }

  const citizen = new Citizen({
    card_id: card_id._id,
    passport_id: passport_id,
    name: {
      firstName: firstName,
      lastName: lastName,
    },
    gender: gender,
    dob: dob,
    birthPlace: birthPlace,
    hometown: hometown,
    residence: residence,
    accommodation: accommodation,
    religion: religion,
    ethic: ethic,
    profession: profession,
    workplace: workplace,
    education: education,
    moveInDate: moveInDate,
    moveInReason: moveInReason,
    moveOutDate: moveOutDate,
    moveOutReason: moveOutReason,
    modifiedBy: modifiedBy,
    index: card_id.card_id + ' ' + firstName + ' ' + lastName,
  });

  const newCitizen = await citizen.save();
  if (newCitizen !== citizen) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }
  return newCitizen;
};

exports.updateCitizen = async ({
  citizen_id,
  card_id,
  location,
  date,
  expiration,
  passport_id,
  firstName,
  lastName,
  gender,
  dob,
  birthPlace,
  hometown,
  residence,
  accommodation,
  religion,
  ethic,
  profession,
  workplace,
  education,
  moveInDate,
  moveInReason,
  moveOutDate,
  moveOutReason,
  modifiedBy,
}) => {
  const updatedCitizen = await Citizen.findById(citizen_id);

  const updatedCardId = await CardIdentity.findById(updatedCitizen.card_id);
  const isExist = await CardIdentity.exists({ card_id: card_id });

  if (updatedCardId.card_id !== card_id && isExist) {
    throw new BadRequestError(
      'Card identity exists already, please pick a different one!'
    );
  }

  const check_citizen = await Citizen.findOne({ passport_id: passport_id });

  if (updatedCitizen.passport_id !== passport_id && check_citizen !== null) {
    throw new BadRequestError(
      'Passport exists already, please pick a different one!'
    );
  }

  updatedCitizen.passport_id = passport_id;
  updatedCitizen.name.firstName = firstName;
  updatedCitizen.name.lastName = lastName;
  updatedCitizen.gender = gender;
  updatedCitizen.dob = dob;
  updatedCitizen.birthPlace = birthPlace;
  updatedCitizen.hometown = hometown;
  updatedCitizen.residence = residence;
  updatedCitizen.accommodation = accommodation;
  updatedCitizen.religion = religion;
  updatedCitizen.ethic = ethic;
  updatedCitizen.profession = profession;
  updatedCitizen.workplace = workplace;
  updatedCitizen.education = education;
  updatedCitizen.moveIn.date = moveInDate;
  updatedCitizen.moveIn.reason = moveInReason;
  updatedCitizen.moveOut.date = moveOutDate;
  updatedCitizen.moveOut.reason = moveOutReason;
  updatedCitizen.modifiedBy = modifiedBy;
  updatedCitizen.index = card_id.card_id + ' ' + firstName + ' ' + lastName;

  const savedCitizen = await updatedCitizen.save();

  if (savedCitizen !== updatedCitizen) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  const savedCardId = await cardIdentityService.updateCardIdentity({
    _id: updatedCitizen.card_id,
    card_id: card_id,
    location: location,
    date: date,
    expiration: expiration,
  });

  return { savedCardId: savedCardId, savedCitizen: savedCitizen };
};

exports.citizenList = async () => {
  return await Citizen.find({ status: true })
    .populate('card_id')
    .sort({ 'name.firstName': 1 });
};

exports.findCitizen = async (key) => {
  const list = await Citizen.find({ status: true }).populate('card_id');
  const result = [];
  list.forEach((citizen) => {
    if (citizen.index?.includes(key)) {
      result.push(citizen);
    }
  });

  if (result.length === 0) {
    throw new DataNotFoundError('Citizen not found.');
  }
  return result;
};

exports.statistic = async () => {
  const total = await Citizen.countDocuments();
  const maleTotal = await Citizen.countDocuments({
    $or: [{ gender: 'Nam' }, { gender: 'MALE' }],
  });
  const femaleTotal = await Citizen.countDocuments({
    $or: [{ gender: 'Nữ' }, { gender: 'FEMALE' }],
  });
  const otherTotal = await Citizen.countDocuments({
    $or: [{ gender: 'Khác' }, { gender: 'OTHER' }],
  });

  return { total, maleTotal, femaleTotal, otherTotal };
};

exports.citizenHistory = async (citizen_id) => {
  const citizen = await Citizen.findById(citizen_id);
  const infoHistory = await Citizen_History.find({ citizen_id: citizen_id });
  const cardIdHistory = await Card_Identity_History.findOne({
    originalCard: citizen.card_id,
  });

  if (infoHistory.length === null && cardIdHistory === null) {
    throw new DataNotFoundError('This citizen has never updated.');
  }

  return { infoHistory, cardIdHistory };
};

exports.deleteCitizenById = async (citizen_id) => {
  const citizen = await Citizen.findById(citizen_id);
  await CardIdentity.findOneAndDelete({ citizen_id: citizen_id });
  await User.findOneAndDelete({ citizen_id: citizen_id });

  if (citizen.household_id != null) {
    await householdService.removeMember({
      household_id: citizen.household_id,
      citizen_id: citizen_id,
    });
  }

  const household = await Household.findOne({ owner_id: citizen_id });

  if (household) {
    household.owner_id = null;
    await household.save();
  }

  return await Citizen.findByIdAndDelete(citizen_id);
};
