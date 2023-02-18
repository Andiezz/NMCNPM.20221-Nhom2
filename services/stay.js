const Stay = require('../models/stay');

const { BadRequestError, DatabaseConnectionError } = require('../utils/error')

exports.createStay = async ({
  citizen_id,
  code,
  place,
  date,
  reason,
  modifiedBy,
}) => {
  const checkStay = await Stay.findOne({
    code: code,
  });
  if (checkStay) {
    throw new BadRequestError('Stay code has already existed.');
  }

  const dateNow = new Date()
  const dateTo = new Date(date.to)

  const checkCitizen = await Stay.findOne({ citizen_id: citizen_id });
  if (checkCitizen && dateTo.getTime() > dateNow.getTime()) {
    throw new BadRequestError('This citizen has still been stayed.')
  }

  const stay = new Stay({
    citizen_id: citizen_id,
    code: code,
    place: place,
    date: date,
    reason: reason,
    modifiedBy: modifiedBy,
  });

  const newStay = await stay.save();
  if (newStay !== stay) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return newStay;
};

exports.getStayById = async (stay_id) => {
  return await Stay.findById(stay_id).populate('citizen_id');
};

exports.updateStay = async ({
  stay_id,
  code,
  place,
  date,
  reason,
  modifiedBy
}) => {
  const stay = await Stay.findById(stay_id)
  const isExist = await Stay.findOne({ code: code })

  if (stay.code !== code && isExist) {
    throw new BadRequestError('This stay code has already been used.')
  }

  stay.code = code
  stay.place = place
  stay.date = date
  stay.reason = reason
  stay.modifiedBy = modifiedBy

  return await stay.save();
};

exports.getAllStay = async () => {
  const list = await Stay.find().populate('citizen_id');
  return list;
}

exports.deleteStay = async ({
  stay_id
}) => {
  return await Stay.findByIdAndDelete(stay_id);
}
