const householdService = require("../services/household");

exports.createHousehold = async (req, res, next) => {
  const {
    household_id,
    owner_id,
    areaCode,
    address,
    members,
    move_in,
    move_out,
  } = req.body;

  const newHousehold = await householdService.createHousehold({
    household_id: household_id,
    owner_id: owner_id,
    areaCode: areaCode,
    address: address,
    members: members,
    move_in: move_in,
    move_out: move_out,
    modifiedBy: req.user._id
  })

  res.status(200).json({
    responseStatus: 1,
    message: 'New citizen created!',
    data: {
      household: newHousehold,
    },
  });
};

exports.getHousehold = async (req, res, next) => {};

exports.updateHousehold = async (req, res, next) => {};

exports.householdList = async (req, res, next) => {};

exports.deleteHousehold = async (req, res, next) => {};
