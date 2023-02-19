const Absence = require('../models/absence');
const Citizen = require('../models/citizen');
const {
  BadRequestError,
  DatabaseConnectionError,
  DataNotFoundError,
} = require('../utils/error');

exports.createAbsence = async ({
  citizen_id,
  code,
  place,
  date,
  reason,
  modifiedBy,
}) => {
  const isExist = await Citizen.exists({ citizen_id });
  if (!isExist) {
    throw new DataNotFoundError('Citizen not found');
  }
  const checkAbsence = await Absence.findOne({
    code: code,
  });
  if (checkAbsence) {
    throw new BadRequestError('Absence has already existed.');
  }

  const dateNow = new Date();
  const dateTo = new Date(date.to);

  const checkCitizen = await Absence.findOne({ citizen_id: citizen_id });
  if (checkCitizen && dateTo.getTime() > dateNow.getTime()) {
    throw new BadRequestError('This citizen has still been away.');
  }

  const absence = new Absence({
    citizen_id: citizen_id,
    code: code,
    place: place,
    date: date,
    reason: reason,
    modifiedBy: modifiedBy,
  });

  const newAbsence = await absence.save();
  if (newAbsence !== absence) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return newAbsence;
};

exports.getAbsenceById = async (absence_id) => {
  return await Absence.findById(absence_id).populate('citizen_id');
};

exports.updateAbsence = async ({
  absence_id,
  code,
  place,
  date,
  reason,
  modifiedBy,
}) => {
  const absence = await Absence.findById(absence_id);
  const isExist = await Absence.findOne({ code: code });

  if (absence.code !== code && isExist) {
    throw new BadRequestError('This absence code has already been used.');
  }

  absence.code = code;
  absence.place = place;
  absence.date = date;
  absence.reason = reason;
  absence.modifiedBy = modifiedBy;

  return await absence.save();
};

exports.getAllAbsence = async () => {
  const list = await Absence.find().populate('citizen_id');
  return list;
};

exports.deleteAbsence = async (absence_id) => {
  return await Absence.findByIdAndDelete(absence_id);
};
