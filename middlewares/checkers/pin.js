const {check} = require('express-validator');
const {validateFields} = require('../validateFields');
const {
    MSG_EMAIL_IS_REQUIRED,
    MSG_PASSWORD_ERROR_LENGTH
} = require('../../messages/auth');
const {
    LENGTH_MIN_PASSWORD,
    REGEXP_NUMBERS_SYMBOLS_PASSWORD} = require('../../models/requirements');

/**
* @returns {object} Un arreglo de middlewares que checkean la presencia de
* un email.
*/
const checkSendPin = [
    check('email', MSG_EMAIL_IS_REQUIRED).isEmail(),
    validateFields,
];

/**
* @returns {object} Un arreglo de middlewares que checkean la presencia de
* un email y que el password se encuentre en el formato válido.
*/
const checkVerifyPinAndUpdatePassword = [
    check('email', MSG_EMAIL_IS_REQUIRED).isEmail(),
    check('password', MSG_PASSWORD_ERROR_LENGTH).optional().isLength({ min: LENGTH_MIN_PASSWORD})
        .matches(REGEXP_NUMBERS_SYMBOLS_PASSWORD),
    validateFields,
];

/**
* @returns {object} Un arreglo de middlewares que checkean la presencia de
* un email.
*/
const checkVerifyPin = [
    check('email', MSG_EMAIL_IS_REQUIRED).isEmail(),
    validateFields,
];

module.exports = {
    checkSendPin,
    checkVerifyPinAndUpdatePassword,
    checkVerifyPin,
}