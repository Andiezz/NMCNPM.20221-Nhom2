const { body, query, param } = require('express-validator');

const User = require('../models/user');
const Fee = require('../models/fee');
const Citizen = require('../models/citizen');
const CardIdentity = require('../models/cardIdentity');
const Transaction = require('../models/transaction');

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

exports.register = [
  body('role').exists({ checkFalsy: true }).withMessage('Role is required'),
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number')
    .custom(async (value, { req }) => {
      const isExist = await User.exists({ phone: value });
      if (isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Phone has already existed.'),
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
  body('card_id')
    .exists()
    .withMessage('Card identity number is required')
    .trim()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Invalid card identity number')
    .custom(async (value, { req }) => {
      const isExist = await CardIdentity.exists({ card_id: value });
      if (isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Card Identity has already existed.'),
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
    .withMessage('Invalid passport number')
    .custom(async (value, { req }) => {
      const isExist = await Citizen.exists({ passport_id: value });
      if (isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Passport id has already existed.'),
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

exports.updateUserProfile = [
  body('phone')
    .exists()
    .withMessage('Phone is required.')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number')
    .custom(async (value, { req }) => {
      const userId = req.params.userId;
      const check_user = await User.findOne({ phone: value });

      if (check_user && check_user._id.toString() !== userId.toString()) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Phone has already existed.'),
  body('card_id')
    .exists()
    .withMessage('Card identity number is required')
    .trim()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Invalid card identity number'),
  // .custom((value, { req }) => {
  //   return CardIdentity.findOne({ card_id: value }).then(async (idDoc) => {
  //     const user = await User.findById(req.body.userId)
  //     if (idDoc && idDoc.citizen_id.toString() === user.citizen_id.toString()) {
  //       return false
  //       // Promise.reject(
  //       //   'Card identity exists already, please pick a different one!'
  //       // );
  //     }
  //   });
  // })
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

exports.createCitizen = [
  body('card_id')
    .exists()
    .withMessage('Card identity number is required')
    .trim()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Invalid card identity number')
    .custom(async (value, { req }) => {
      const isExist = await CardIdentity.exists({ card_id: value });
      if (isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Card Identity has already existed.'),
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
    .withMessage('Invalid passport number')
    .custom(async (value, { req }) => {
      const isExist = await Citizen.exists({ passport_id: value });
      if (isExist) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Passport id has already existed.'),
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

exports.updateCitizenProfile = [
  body('card_id')
    .exists()
    .withMessage('Card identity number is required')
    .trim()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Invalid card identity number')
    .custom(async (value, { req }) => {
      const citizen_id = req.params.citizen_id;
      const card_id = await CardIdentity.findOne({ card_id: value });

      if (card_id && card_id.citizen_id.toString() !== citizen_id) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Card identity exists already, please pick a different one!'),
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
  body('year')
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
