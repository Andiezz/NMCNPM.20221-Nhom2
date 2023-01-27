const { body, query } = require('express-validator');

const User = require("../models/user")

exports.login = [
  body('phone')
    .trim()
    .isLength({ min: 10, max: 10 })
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
    .trim()
    .isLength({ min: 10, max: 10 })
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
    .isLength({ min: 10, max: 10 })
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
  body('moveInDate')
    .exists()
    .withMessage('Move in date is required')
    .isDate()
    .withMessage('Invalid move in date'),
  body('moveOutDate')
    .exists()
    .withMessage('Move out date is required')
    .isDate()
    .withMessage('Invalid move out date'),
];

exports.updateProfile = [
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage('Invalid phone number'),
  body('card_id')
    .exists()
    .withMessage('Card identity number is required')
    .trim()
    .isLength({ min: 12, max: 12 })
    .isNumeric()
    .withMessage('Invalid card identity number')
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
    ,
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
  body('moveInDate')
    .exists()
    .withMessage('Move in date is required')
    .isDate()
    .withMessage('Invalid move in date'),
  body('moveOutDate')
    .exists()
    .withMessage('Move out date is required')
    .isDate()
    .withMessage('Invalid move out date'),
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
