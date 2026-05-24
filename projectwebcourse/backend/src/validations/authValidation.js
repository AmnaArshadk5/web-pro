const { body } = require('express-validator');

const registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

const loginValidation = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
];

const transferValidation = [
  body('receiverEmail', 'Receiver email is required').isEmail(),
  body('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
];

module.exports = {
  registerValidation,
  loginValidation,
  transferValidation,
};
