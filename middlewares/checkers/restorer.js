const {check} = require('express-validator');
const {validateFields} = require('../validateFields');
const {
    MSG_EMAIL_IS_REQUIRED,
    MSG_INVALID_CELLPHONE, 
} = require('../../messages/auth');

/**
* @returns {object} Un arreglo de middlewares que checkean la presencia de
* un email y que el cellphone se encuentre en el formato válido.
*/
const checkRestorePassword = [
    check('email', MSG_EMAIL_IS_REQUIRED).isEmail(),
    check('cellphone', MSG_INVALID_CELLPHONE).optional().isMobilePhone('any', { strictMode: true }),
    validateFields,
];

module.exports = {
    checkRestorePassword
}