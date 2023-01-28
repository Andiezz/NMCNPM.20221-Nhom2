const Citizen = require('../models/citizen');

const citizenService = require('../services/citizen');
const cardIdentityService = require('../services/cartIdentity');

const { DataNotFoundError } = require('../utils/error');

exports.createCitizen = async (req, res, next) => {
  const {
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
  } = req.body;

  const newCitizen = await citizenService.createNewCitizen({
    passport_id: passport_id,
    firstName: firstName,
    lastName: lastName,
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
    modifiedBy: req.user._id,
  });

  const newCardIdentity = await cardIdentityService.createNewCardIdentity({
    card_id: card_id,
    citizen_id: newCitizen._id,
    location: location,
    date: date,
    expiration: expiration,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'New citizen created!',
    data: {
      citizen: newCitizen,
      CardIdentity: newCardIdentity,
    },
  });
};

exports.profile = async (req, res, next) => {
  const citizen_id = req.params.citizen_id;
  const check_citizen = await Citizen.findById(citizen_id);
  if (!check_citizen) {
    throw new DataNotFoundError('Citizen not found');
  }

  res.status(200).json({
    responseStatus: 1,
    message: 'Citizen fetched!',
    data: {
      citizen: check_citizen,
    },
  });
};

exports.updateProfile = async (req, res, next) => {
  const {
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
  } = req.body;
  const citizen_id = req.params.citizen_id;

  const { savedCardId, savedCitizen } =
    await citizenService.updateCitizenProfile({
      citizen_id: citizen_id,
      card_id: card_id,
      location: location,
      date: date,
      expiration: expiration,
      passport_id: passport_id,
      firstName: firstName,
      lastName: lastName,
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
      modifiedBy: req.user.userId,
    });

  res.status(200).json({
    responseStatus: 1,
    message: 'Citizen updated!',
    data: {
      updatedCardId: savedCardId,
      updatedCitizen: savedCitizen
    },
  });
};
