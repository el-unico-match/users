const {check} = require('express-validator');
const {validateFields} = require('../validateFields');
const {
    MSG_EMAIL_NOT_ENTERED,
    MSG_PASSWORD_NOT_ENTERED,
} = require('../../messages/auth');

/**
* @returns {object} Un arreglo de middlewares que checkean la presencia de email y password.
*/
const checkLoginUser = [
    check('email', MSG_EMAIL_NOT_ENTERED).isEmail(),
    check('password', MSG_PASSWORD_NOT_ENTERED).not().isEmpty(),
    validateFields
];

module.exports = {
    checkLoginUser
}