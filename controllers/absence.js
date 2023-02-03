const absenceService = require('../services/absence');

exports.createAbsence = async (req, res, next) => {
  const { citizen_id, code, place, date, reason } = req.body;

  const absence = await absenceService.createAbsence({
    citizen_id: citizen_id,
    code: code,
    place: place,
    date: date,
    reason: reason,
    modifiedBy: req.user._id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Absence created!',
    data: {
      absence: absence,
    },
  });
};

exports.getAbsence = async (req, res, next) => {
  const absenceId = req.params.absenceId;
  const check_absence = await absenceService.getAbsenceById(absenceId);
  if (!check_absence) {
    throw new DataNotFoundError('Absence not found');
  }
  res.status(200).json({
    responseStatus: 1,
    message: 'Absence fetched!',
    data: {
      absence: check_absence,
    },
  });
};

exports.updateAbsence = async (req, res, next) => {
  const { code, place, date, reason } = req.body;

  const absenceId = req.params.absenceId;

  const updatedAbsence = await absenceService.updateAbsence({
    absence_id: absenceId,
    code: code,
    place: place,
    date: date,
    reason: reason,
    modifiedBy: req.user._id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Absence updated!',
    data: {
      updatedAbsence: updatedAbsence,
    },
  });
};

exports.absenceList = async (req, res, next) => {
  const list = await absenceService.getAllAbsence();
  res.status(200).json({
    responseStatus: 1,
    message: 'All absences fetched!',
    data: {
      list: list,
    },
  });
};

exports.deleteAbsence = async (req, res, next) => {
  const absenceId = req.params.absenceId;
  await absenceService.deleteAbsence({ absenceId: absenceId });

  res.status(200).json({
    responseStatus: 1,
    message: 'Absence deleted!',
  });
};
