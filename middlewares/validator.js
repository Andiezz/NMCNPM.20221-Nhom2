const { body, query, param } = require('express-validator');

const User = require('../models/user');
const Fee = require('../models/fee');
const Citizen = require('../models/citizen');
const CardIdentity = require('../models/cardIdentity');
const Transaction = require('../models/transaction');
const Household = require('../models/household');
const Stay = require('../models/stay');
const Absence = require('../models/absence');
const Death = require('../models/death');

exports.login = [
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
  body(
    'password',
    'Please enter a password at least 8 characters long without special characters'
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage('Password must not contain special character'),
  body('role').exists({ checkFalsy: true }).withMessage('Role is required'),
];

exports.genResetToken = [
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
];

exports.resetPassword = [
  body(
    'newPassword',
    'Please enter a password at least 8 characters long without special characters'
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage('Password must not contain special character'),
];

exports.userInfo = [
  body('role').exists({ checkFalsy: true }).withMessage('Role is required'),
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
  body(
    'password',
    'Please enter a password at least 8 characters long without special characters'
  )
    .exists()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage('Password must not contain special character'),
];

exports.updatePhone = [
  body('phone')
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.userId);
      const isExist = await User.exists({ phone: value });
      if (user.phone !== value && isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('This user has already been existed.'),
];

exports.userUpdate = [
  body('role').exists({ checkFalsy: true }).withMessage('Role is required'),
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
];

exports.user_id = [
  param('userId')
    .custom(async (value, { req }) => {
      const isExist = await User.findById(value);
      if (isExist === null) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('User not found'),
];

exports.updatePassword = [
  body(
    'newPassword',
    'Please enter a password at least 8 characters long without special characters'
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric()
    .withMessage('Password must not contain special character'),
];

exports.citizenInfo = [
  body('card_id')
    .exists()
    .withMessage('Card identity number is required')
    .trim()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Invalid card identity number'),
  body('location')
    .exists()
    .withMessage('Card identity location is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('date')
    .exists()
    .withMessage('Card identity date of issue is required')
    .isDate()
    .withMessage('Invalid card identity date'),
  body('expiration')
    .exists()
    .withMessage('Card identity expiration date is required')
    .isDate()
    .withMessage('Invalid card identity expiration date'),
  body('passport_id')
    .trim()
    .isLength({ min: 8, max: 8 })
    .isNumeric()
    .withMessage('Invalid passport number'),
  body('firstName')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Firstname is required')
    .bail()
    .isAlpha('vi-VN', { ignore: ' ' })
    .withMessage('First name must not contain special character'),
  body('lastName')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Lastname is required')
    .bail()
    .isAlpha('vi-VN', { ignore: ' ' })
    .withMessage('Last name must not contain special character'),
  body('gender').exists().withMessage('Gender is required'),
  body('dob').exists().withMessage('Date of birth is required'),
  body('birthPlace')
    .exists()
    .withMessage('Birth place is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('hometown')
    .exists()
    .withMessage('Hometown is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('residence')
    .exists()
    .withMessage('Residence is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('accommodation')
    .exists()
    .withMessage('Accommodation is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('religion')
    .exists()
    .withMessage('Religion is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('ethic')
    .exists()
    .withMessage('Ethic is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('profession')
    .exists()
    .withMessage('Profession is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('workplace')
    .exists()
    .withMessage('Workplace is required')
    .trim()
    .isAlphanumeric('vi-VN', { ignore: ' -,.' }),
  body('education')
    .exists()
    .withMessage('Education is required')
    .trim()
    .isNumeric(),
];

exports.citizen_id = [
  param('citizen_id')
    .custom(async (value, { req }) => {
      const isExist = await Citizen.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Citizen not found'),
];

exports.householdInfo = [
  body('household_id')
    .trim()
    .isLength({ min: 9, max: 9 })
    .isNumeric()
    .withMessage('Invalid household code'),
  body('owner_id')
    .trim()
    .custom(async (value) => {
      const isExist = await Citizen.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Citizen not found'),
  body('areaCode')
    .trim()
    .isLength({ min: 5, max: 5 })
    .withMessage('Invalid area code'),
];

exports.household_id = [
  param('household_id')
    .custom(async (value, { req }) => {
      const isExist = await Household.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Household not found'),
];

exports.member = [
  body('citizen_id')
    .trim()
    .custom(async (value) => {
      const isExist = await Citizen.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Citizen not found'),
];

exports.stay_id = [
  param('stayId')
    .custom(async (value, { req }) => {
      const isExist = await Stay.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Stay not found'),
];

exports.absence_id = [
  param('absenceId')
    .custom(async (value, { req }) => {
      const isExist = await Absence.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Absence not found'),
];

exports.death_id = [
  param('deathId')
    .custom(async (value, { req }) => {
      const isExist = await Death.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Death not found'),
];

exports.fee = [
  body('name')
    .exists()
    .withMessage("Fee's name is required")
    .isAlphanumeric('vi-VN', { ignore: ' -,./' })
    .withMessage("Fee's name must not contain special character")
    .trim(),
  body('required')
    .exists()
    .withMessage('Required cant be null')
    .isInt()
    .custom((value, { req }) => {
      if (value < 0) {
        return false;
      }
      return true;
    })
    .withMessage('Required number must be positive'),
  body('memberPayment')
    .exists()
    .withMessage('Member Payment check is required')
    .isBoolean()
    .withMessage('Member Payment check must be boolean type'),
];

exports.fee_id = [
  param('fee_id')
    .custom(async (value, { req }) => {
      const isExist = await Fee.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Fee not found'),
];

exports.donate = [
  body('fee_id')
    .custom(async (value, { req }) => {
      const isExist = await Fee.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Fee not found'),
  body('amount')
    .exists()
    .withMessage('Amount cant be null')
    .isInt()
    .custom((value, { req }) => {
      if (value < 0) {
        return false;
      }
      return true;
    })
    .withMessage('Amount must be positive'),
  body('stage')
    .exists()
    .withMessage('Stage cant be null')
    .isInt()
    .custom((value, { req }) => {
      if (value < 0) {
        return false;
      }
      return true;
    })
    .withMessage('Stage must be positive'),
];

exports.transaction_id = [
  param('transaction_id')
    .custom(async (value, { req }) => {
      const isExist = await Transaction.findById(value);
      if (!isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Transaction not found'),
];

exports.year = [
  query('year')
    .exists()
    .withMessage('Year cant be null')
    .isInt()
    .custom((value, { req }) => {
      if (value < 0) {
        return false;
      }
      return true;
    })
    .withMessage('Year must be positive'),
];
