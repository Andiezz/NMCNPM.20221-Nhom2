const User = require('../models/user');
const Citizen = require('../models/citizen');
const CardIdentity = require('../models/cardIdentity');
const Household = require('../models/household');

const cardIdentityService = require('../services/cartIdentity');
const householdService = require('../services/household');

const { DatabaseConnectionError } = require('../utils/error');

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
  const citizen = new Citizen({
    card_id: card_id,
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

  const savedCitizen = await updatedCitizen.save();

  if (savedCitizen !== updatedCitizen) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  const savedCardId = await cardIdentityService.updateCardIdentity({
    card_id: card_id,
    location: location,
    date: date,
    expiration: expiration,
  });

  return { savedCardId: savedCardId, savedCitizen: savedCitizen };
};

exports.citizenList = async () => {
  return await Citizen.find();
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
