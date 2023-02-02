const Absence = require('../models/absence');

exports.createAbsence = async ({
  citizen_id,
  code,
  place,
  date,
  reason,
  modifiedBy,
}) => {
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
  return await Absence.findById(absence_id);
};
