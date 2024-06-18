const {check} = require('express-validator');
const {validateFields} = require('../validateFields');
const {MSG_PASSWORD_ERROR_LENGTH, MSG_PASSWORD_NOT_ENTERED} = require('../../messages/auth');
const {
    LENGTH_MIN_PASSWORD,
    REGEXP_NUMBERS_SYMBOLS_PASSWORD
} = require('../../models/requirements/users');

/**
* @returns {object}  Un arreglo de middlewares que checkean la existencia de
* un email, la longitud del password y que el mismo contenga al menos un número
* y un símbolo.
*/
const checkUpdatePassword = [
    check('password', MSG_PASSWORD_NOT_ENTERED).not().isEmpty(),
    check('password', MSG_PASSWORD_ERROR_LENGTH).isLength({ min: LENGTH_MIN_PASSWORD})
        .matches(REGEXP_NUMBERS_SYMBOLS_PASSWORD),
    validateFields
];

module.exports = {
    checkUpdatePassword,
}