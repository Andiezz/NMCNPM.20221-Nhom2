const deathService = require('../services/death');

exports.createDeath = async (req, res, next) => {
  const { citizen_id, code, date, reason } = req.body;

  const death = await deathService.createDeath({
    citizen_id: citizen_id,
    code: code,
    date: date,
    reason: reason,
    modifiedBy: req.user._id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Death created!',
    data: {
      death: death,
    },
  });
};

exports.getDeath = async (req, res, next) => {
  const deathId = req.params.deathId;
  const check_death = await deathService.getDeathById(deathId);
  if (!check_death) {
    throw new DataNotFoundError('Death not found');
  }
  res.status(200).json({
    responseStatus: 1,
    message: 'Death fetched!',
    data: {
      death: check_death,
    },
  });
};

exports.updateDeath = async (req, res, next) => {
  const { code, date, reason } = req.body;

  const deathId = req.params.deathId;

  const updatedDeath = await deathService.updateDeath({
    death_id: deathId,
    code: code,
    date: date,
    reason: reason,
    modifiedBy: req.user._id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Death updated!',
    data: {
      updatedDeath: updatedDeath,
    },
  });
};

exports.deathList = async (req, res, next) => {
  const list = await deathService.getAllDeath();
  res.status(200).json({
    responseStatus: 1,
    message: 'All deaths fetched!',
    data: {
      list: list,
    },
  });
};

exports.deleteDeath = async (req, res, next) => {
  const deathId = req.params.deathId;
  await deathService.deleteDeath({ deathId: deathId });

  res.status(200).json({
    responseStatus: 1,
    message: 'Death deleted!',
  });
};
