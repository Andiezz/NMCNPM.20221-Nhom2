const Death = require('../models/death');

exports.createDeath = async ({
  citizen_id,
  code,
  date,
  reason,
  modifiedBy,
}) => {
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

  return newDeath;
};

exports.getDeathById = async (death_id) => {
  return await Death.findById(death_id);
};

exports.updateDeath = async ({
  death_id,
  code,
  date,
  reason,
  modifiedBy
}) => {
  const death = await Death.findById(death_id)

  death.code = code
  death.date = date
  death.reason = reason
  death.modifiedBy = modifiedBy

  return await death.save();
};

exports.getAllDeath = async () => {
  const list = await Death.find();
  return list;
}

exports.deleteDeath = async ({
  death_id
}) => {
  return await Death.findByIdAndDelete(death_id);
}
