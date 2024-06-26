const {check} = require('express-validator');
const {ROLES, isRole} = require('../../types/role');
const {validateFields} = require('../validateFields');
const User = require('../../models/Users');
const {createAccessRoleAndOwnerBased} = require('../validateAccess');
const {
    MSG_EMAIL_IS_REQUIRED,
    MSG_PASSWORD_ERROR_LENGTH,
    MSG_ROLE_ERROR_TYPE, 
    MSG_WITHOUT_AUTH_TO_CREATE_ADMIN,
    MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER,
    MSG_USER_CANNOT_CHANGE_ROLE,
    MSG_INVALID_LOCK_STATE,
    MSG_CANNOT_SET_VERIFICATION_STATE
} = require('../../messages/auth');
const {
    LENGTH_MIN_PASSWORD,
    REGEXP_NUMBERS_SYMBOLS_PASSWORD
} = require('../../models/requirements/users');
const {HTTP_CLIENT_ERROR_4XX} = require('../../helpers/httpCodes')
const {
    logDebug,
    logInfo} = require('../../helpers/log/log');

/**
 * @returns Un middleware que checkea los siguiente invariante según el request:
 * 1) Un usuario cliente no puede crear otros usuarios.
 * 2) Un usuario sin token no puede crear una administrador.
 */
const checkPermissionOnCreateUser = () => {    
    return async (req, res = response, next) => {     
        if (req.token) {
            // rol del usuario que hace la operación
            let {role} = await User.findOne({_id: req.tokenExtractedData.uid});
            // un cliente no puede crear otro usuario
            if (role === ROLES.CLIENT) {
                const dataToResponse = {
                    ok: false,
                    msg: MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER
                };
                logDebug(`On check permission to create user. User ${ROLES.CLIENT} tries to create other user`);
                logInfo(`On check permission to create user response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`);
                return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse);
            }            
        } else {
            const roleNewUser = req.body.role;
            // un usuario sin token no puede crear un administrador
            if (roleNewUser === ROLES.ADMINISTRATOR) {
                const dataToResponse = {
                    ok: false,
                    msg: MSG_WITHOUT_AUTH_TO_CREATE_ADMIN
                };
                logDebug(`On check permission to create user. User ${ROLES.CLIENT} token tries to create ${ROLES.ADMINISTRATOR}`);    
                logInfo(`On check permission to create user response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`);
                return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse);
            }
        }     
        next();
    }
} 

/**
* @returns {object} Un arreglo de middlewares que checkean la existencia de
* un email, la longitud del password y que el mismo contenga al menos un número
* y un símbolo, la existencia de un rol y estado de bloqueo.
*/
const checkCreateUser = [
    check('email', MSG_EMAIL_IS_REQUIRED).isEmail(),
    check('password', MSG_PASSWORD_ERROR_LENGTH).isLength({ min: LENGTH_MIN_PASSWORD})
        .matches(REGEXP_NUMBERS_SYMBOLS_PASSWORD),
    check('role', MSG_ROLE_ERROR_TYPE).not().isEmpty(),
    check('role', MSG_ROLE_ERROR_TYPE).custom((role) => isRole(role)),
    check('blocked', MSG_INVALID_LOCK_STATE).optional().isBoolean(),
    check('verified', MSG_CANNOT_SET_VERIFICATION_STATE).isEmpty(),
    checkPermissionOnCreateUser(),
    validateFields,
];

/**
* @returns {object}  Un arreglo de middlewares que checkean la existencia de
* un email, la existencia de un rol y la longitud del password y que el mismo contenga al menos un número
* y un símbolo. Además chequea el acceso según propietario y rol (si es propiertario autoriza automáticamente).
*/
const checkUpdateUser = [
    check('email', MSG_EMAIL_IS_REQUIRED).optional().isEmail(),
    check('password', MSG_PASSWORD_ERROR_LENGTH).optional().isLength({ min: LENGTH_MIN_PASSWORD})
        .matches(REGEXP_NUMBERS_SYMBOLS_PASSWORD),
    check('role', MSG_USER_CANNOT_CHANGE_ROLE).isEmpty(),
    check('blocked', MSG_INVALID_LOCK_STATE).optional().isBoolean(),
    createAccessRoleAndOwnerBased(ROLES.ADMINISTRATOR),
    check('verified', MSG_CANNOT_SET_VERIFICATION_STATE).isEmpty(),
    validateFields
];

/**
* @returns {object} Un middleware que chequea el acceso.
*/
const checkDeleteUser = [
    createAccessRoleAndOwnerBased(ROLES.ADMINISTRATOR),
    validateFields
];

module.exports = {
    checkCreateUser,
    checkUpdateUser,
    checkDeleteUser    
}