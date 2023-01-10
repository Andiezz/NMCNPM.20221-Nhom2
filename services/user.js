const User = require('../models/user');

const security = require('../utils/security');

exports.getUserByPhone = async ({ phone }) => {
  const user = await User.findOne({ phone: phone });
  return user;
};

exports.getUserByPhoneRole = async ({ phone, role }) => {
  const user = await User.findOne({ phone, role });
  return user;
};

exports.getUserById = async ({ userId }) => {
  const user = await User.findOne({ userId });
  return user;
};

exports.getAllUsers = async () => {
  const list = await User.find();
  return list;
}

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
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }

  return newUser;
};

exports.updateUserProfile = async ({
  userId,
  phone,
  card_id,
  passport_id,
  firstName,
  lastName,
  gender,
  dob,
  birthPlace,
  hometown,
  residence,
  religion,
  ethic,
  profession,
  workplace,
  education,
}) => {
  const check_user = await User.findOne({ userId });

  if (!check_user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  //? can replace with validator
  const check_citizen = await Citizen.findById(check_user.citizen_id);
  const check_cardId = await Citizen.findOne({
    card_id: card_id,
  });
  const check_passportId = await Citizen.findOne({
    passport_id: passport_id,
  });

  if (check_cardId && check_cardId.citizen_id != check_citizen.citizen_id) {
    const err = new Error('This card identity has already been used.');
    err.statusCode = 400;
    throw err;
  }

  if (
    check_passportId &&
    check_passportId.citizen_id != check_citizen.citizen_id
  ) {
    const err = new Error('This passport identity has already been used.');
    err.statusCode = 400;
    throw err;
  }

  const check_phone = await User.findOne({
    phone: phone,
    role: check_user.role,
  });

  if (check_phone && phone != check_phone.phone) {
    const err = new Error('This phone has already been used.');
    err.statusCode = 400;
    throw err;
  }

  check_user.phone = phone;
  check_user.card_id = card_id;
  check_user.passport_id = passport_id;
  check_user.firstName = firstName;
  check_user.lastName = lastName;
  check_user.gender = gender;
  check_user.dob = dob;
  check_user.birthPlace = birthPlace;
  check_user.hometown = hometown;
  check_user.residence = residence;
  check_user.religion = religion;
  check_user.ethic = ethic;
  check_user.profession = profession;
  check_user.workplace = workplace;
  check_user.education = education;

  const updatedUser = await check_user.save();
  
  if (check_user !== updatedUser) {
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }

  return updatedUser;
};

exports.updateUserPassword = async ({ userId, oldPassword, newPassword }) => {
  const check_user = await User.findById(userId);
  if (!check_user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
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
    const err = new Error('Failed to connect with database.');
    err.statusCode = 500;
    throw err;
  }

  return updatedUser;
}

exports.deleteUserAccount = async (userId) => {
  const user = User.findOne({ _id: userId });
  const citizen_id = user.citizen_id;
  await User.deleteOne({ _id: userId });
  await Citizen.deleteOne({ _id: citizen_id });

}
