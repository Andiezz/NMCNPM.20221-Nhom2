const Death = require('../models/death');
const Citizen = require('../models/citizen');

const {
  BadRequestError,
  DatabaseConnectionError,
  DataNotFoundError,
} = require('../utils/error');

exports.createDeath = async ({
  citizen_id,
  code,
  date,
  reason,
  modifiedBy,
}) => {
  const check_citizen = await Citizen.findById(citizen_id);

  if (!check_citizen) {
    throw new DataNotFoundError('Citizen not found');
  }
  const checkDeath = await Death.findOne({
    code: code,
  });
  if (checkDeath) {
    throw new BadRequestError('Death has already existed.');
  }

  const death = new Death({
    citizen_id: citizen_id,
    code: code,
    date: date,
    reason: reason,
    modifiedBy: modifiedBy,
  });

  const newDeath = await death.save();
  if (newDeath !== death) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  check_citizen.status = false;
  await check_citizen.save();

  return newDeath;
};

exports.getDeathById = async (death_id) => {
  return await Death.findById(death_id).populate('citizen_id');
};

exports.updateDeath = async ({ death_id, code, date, reason, modifiedBy }) => {
  const death = await Death.findById(death_id);
  const isExist = await Death.findOne({ code: code });

  if (death.code !== code && isExist) {
    throw new BadRequestError('This death code has already been used.');
  }

  death.code = code;
  death.date = date;
  death.reason = reason;
  death.modifiedBy = modifiedBy;

  return await death.save();
};

exports.getAllDeath = async () => {
  const list = await Death.find().populate('citizen_id');
  return list;
};

exports.deleteDeath = async (death_id) => {
  const death = await Death.findById(death_id);
  const check_citizen = await Citizen.findById(death.citizen_id);
  check_citizen.status = true;
  await check_citizen.save();
  await Death.findByIdAndDelete(death_id)
  return death;
};
