const Stay = require('../models/stay');

exports.createStay = async ({
  citizen_id,
  code,
  place,
  date,
  reason,
  modifiedBy,
}) => {
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
  return await Stay.findById(stay_id);
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

  stay.code = code
  stay.place = place
  stay.date = date
  stay.reason = reason
  stay.modifiedBy = modifiedBy

  return await stay.save();
};

exports.getAllStay = async () => {
  const list = await Stay.find();
  console.log(list)
  return list;
}

exports.deleteStay = async ({
  stay_id
}) => {
  return await Stay.findByIdAndDelete(stay_id);
}
