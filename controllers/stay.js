const stayService = require('../services/stay');

exports.createStay = async (req, res, next) => {
  const { citizen_id, code, place, date, reason } = req.body;

  const stay = await stayService.createStay({
    citizen_id: citizen_id,
    code: code,
    place: place,
    date: date,
    reason: reason,
    modifiedBy: req.user._id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Stay created!',
    data: {
      stay: stay,
    },
  });
};

exports.getStay = async (req, res, next) => {
  const stayId = req.params.stayId;
  const check_stay = await stayService.getStayById(stayId);
  if (!check_stay) {
    throw new DataNotFoundError('Stay not found');
  }
  res.status(200).json({
    responseStatus: 1,
    message: 'Stay fetched!',
    data: {
      stay: check_stay,
    },
  });
};

exports.updateStay = async (req, res, next) => {
  const { code, place, date, reason } = req.body;

  const stayId = req.params.stayId;

  const updatedStay = await stayService.updateStay({
    stay_id: stayId,
    code: code,
    place: place,
    date: date,
    reason: reason,
    modifiedBy: req.user._id,
  });

  res.status(200).json({
    responseStatus: 1,
    message: 'Stay updated!',
    data: {
      updatedStay: updatedStay,
    },
  });
};

exports.stayList = async (req, res, next) => {
  const list = await stayService.getAllStay();
  res.status(200).json({
    responseStatus: 1,
    message: 'All stays fetched!',
    data: {
      list: list,
    },
  });
};

exports.deleteStay = async (req, res, next) => {
  const stayId = req.params.stayId;
  await stayService.deleteStay(stayId);

  res.status(200).json({
    responseStatus: 1,
    message: 'Stay deleted!',
  });
};
