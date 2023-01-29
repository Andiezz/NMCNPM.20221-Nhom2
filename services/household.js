const Household = require('../models/household');

const BadRequestError = require('../errors/bad-request-error');

exports.createHousehold = async ({
  household_id,
  owner_id,
  areaCode,
  address,
  members,
  move_in,
  move_out,
  modifiedBy
}) => {
  const checkHousehold = await Household.findOne({
    household_id: household_id,
  });
  if (checkHousehold) {
    throw new BadRequestError('Household has already existed.');
  }
  return await Household.create({
    household_id,
    owner_id,
    areaCode,
    address,
    members,
    move_in,
    move_out,
    modifiedBy
  });
};
