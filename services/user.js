const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Citizen = require('../models/citizen');
const CardIdentity = require('../models/cardIdentity');

const security = require('../utils/security');
const {
  DatabaseConnectionError,
  DataNotFoundError,
  RequestValidationError,
  BadRequestError,
} = require('../utils/error');

exports.getUserByPhone = async ({ phone }) => {
  const user = await User.findOne({ phone: phone });
  return user;
};

exports.getUserByPhoneRole = async ({ phone, role }) => {
  const user = await User.findOne({ phone, role });
  return user;
};

exports.getUserById = async ({ userId }) => {
  const user = await User.findById(userId, {
    password: 0,
    refresh_token: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return user;
};

exports.getAllUsers = async () => {
  const list = await User.find(
    {},
    {
      password: 0,
      refresh_token: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    }
  );
  return list;
};

exports.createNewUser = async ({ role, phone, password, citizen_id }) => {
  const hashedPassword = await security.hashPassword(password);

  const user = new User({
    citizen_id: citizen_id,
    role: role,
    phone: phone,
    password: hashedPassword,
  });

  const newUser = await user.save();
  if (newUser !== user) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return newUser;
};

exports.updateUserProfile = async ({
  userId,
  phone,
  card_id,
  location,
  date,
  expiration,
  passport_id,
  firstName,
  lastName,
  gender,
  dob,
  birthPlace,
  hometown,
  residence,
  accommodation,
  religion,
  ethic,
  profession,
  workplace,
  education,
  moveInDate,
  moveInReason,
  moveOutDate,
  moveOutReason,
  modifiedBy,
}) => {
  const check_user = await User.findById(userId);

  if (check_user.role === 'ADMIN') {
    throw new BadRequestError('User is an admin.');
  }

  if (!check_user) {
    throw new DataNotFoundError('User not found.');
  }

  //? can replace with validator
  const check_citizen = await Citizen.findById(check_user.citizen_id);
  const check_cardId = await CardIdentity.findOne({
    card_id: card_id,
  });
	const cardId = await CardIdentity.findOne({
		citizen_id: check_citizen._id,
	});
  const check_passportId = await Citizen.findOne({
    passport_id: passport_id,
  });

	let updatedCardId;
  if (
    check_cardId &&
    check_cardId.citizen_id.toString() !== check_citizen._id.toString()
  ) {
    throw new RequestValidationError(
      'This card identity has already been used.'
    );
  } else if (check_cardId == null) {
    cardId.card_id = card_id;
    cardId.location = location;
    cardId.date = date;
    cardId.expiration = expiration;

    updatedCardId = await cardId.save();
  } else {
    check_cardId.card_id = card_id;
    check_cardId.location = location;
    check_cardId.date = date;
    check_cardId.expiration = expiration;

    updatedCardId = await check_cardId.save();
  }

  if (
    check_passportId &&
    check_passportId._id.toString() !== check_citizen._id.toString()
  ) {
    throw new RequestValidationError(
      'This passport identity has already been used.'
    );
  }

  const check_phone = await User.findOne({
    phone: phone,
    role: check_user.role,
  });

  if (check_phone && phone != check_phone.phone) {
    throw new RequestValidationError('This phone has already been used.');
  }

  check_user.phone = phone;
  check_citizen.passport_id = passport_id;
  check_citizen.name.firstName = firstName;
  check_citizen.name.lastName = lastName;
  check_citizen.gender = gender;
  check_citizen.dob = dob;
  check_citizen.birthPlace = birthPlace;
  check_citizen.hometown = hometown;
  check_citizen.residence = residence;
  check_citizen.accommodation = accommodation;
  check_citizen.religion = religion;
  check_citizen.ethic = ethic;
  check_citizen.profession = profession;
  check_citizen.workplace = workplace;
  check_citizen.education = education;
  check_citizen.moveIn.date = moveInDate;
  check_citizen.moveIn.reason = moveInReason;
  check_citizen.moveOut.date = moveOutDate;
  check_citizen.moveOut.reason = moveOutReason;
  check_citizen.modifiedBy = modifiedBy;

  const updatedUser = await check_user.save();
  const updatedCitizen = await check_citizen.save();

  if (check_citizen !== updatedCitizen || check_cardId !== updatedCardId && cardId !== updatedCardId) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return updatedUser;
};

exports.updateUserPassword = async ({ userId, oldPassword, newPassword }) => {
  const check_user = await User.findById(userId);
  if (!check_user) {
    throw new DataNotFoundError('User not found.');
  }
  const isEqual = await bcrypt.compare(oldPassword, check_user.password);
  if (!isEqual) {
    const err = new Error('Old password is incorrect.');
    err.statusCode = 401;
    throw err;
  }
  const hashedPassword = await security.hashPassword(newPassword);
  check_user.password = hashedPassword;
  const updatedUser = await check_user.save();

  if (check_user !== updatedUser) {
    throw new DatabaseConnectionError('Failed to connect with database.');
  }

  return updatedUser;
};

exports.deleteUserAccount = async ({ userId }) => {
  await User.deleteOne({ _id: userId });
};
