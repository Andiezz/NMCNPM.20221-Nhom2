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

  const newCitizen = await citizenService.createCitizen({
    card_id: card_id,
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

  const newCardIdentity = await cardIdentityService.createCardIdentity({
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
      cardIdentity: newCardIdentity,
    },
  });
};

exports.getCitizen = async (req, res, next) => {
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

exports.updateCitizen = async (req, res, next) => {
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

  const { savedCardId, savedCitizen } = await citizenService.updateCitizen({
    card_id: card_id,
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
      updatedCitizen: savedCitizen,
    },
  });
};

exports.citizenList = async (req, res, next) => {
  const list = await citizenService.citizenList();
  res.status(200).json({
    response_status: 1,
    message: 'Fetched all citizens',
    data: { list: list },
  });
};

exports.findCitizen = async (req, res, next) => {
  const { key } = req.body;
  const result = await citizenService.findCitizen(key);

  res.status(200).json({
    response_status: 1,
    message: `${result.length} citizen(s) found.`,
    data: { result: result },
  });
};

exports.statistic = async (req, res, next) => {
  const { total, maleTotal, femaleTotal, otherTotal } = await citizenService.statistic();

  res.status(200).json({
    response_status: 1,
    message: 'Statistic found',
    data: { total: total, maleTotal: maleTotal, femaleTotal: femaleTotal, otherTotal: otherTotal },
  });
};

exports.deleteCitizen = async (req, res) => {
  const citizen_id = req.params.citizen_id;
  const result = await citizenService.deleteCitizenById(citizen_id);

  if (!result) {
    return res.status(400).json({
      response_status: 0,
      message: 'Delete Citizen fail.',
    });
  }

  res.status(200).json({
    response_status: 1,
    message: 'Delete citizen successfully.',
  });
};
