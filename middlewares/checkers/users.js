const {check} = require('express-validator');
const {ROLES, isRole} = require('../../types/role');
const {validateFields} = require('../validateFields');
const User = require('../../models/Users');
const {createAccessRoleAndOwnerBased} = require('../validateAccess');
const {
    MSG_EMAIL_NOT_ENTERED,
    MSG_PASSWORD_NOT_ENTERED,
    MSG_NAME_IS_REQUIRED,
    MSG_NAME_ERROR_LENGTH,
    MSG_EMAIL_IS_REQUIRED,
    MSG_PASSWORD_ERROR_LENGTH,
    MSG_ROLE_ERROR_TYPE, 
    MSG_WITHOUT_AUTH_TO_CREATE_ADMIN,
    MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER
} = require('../../messages/auth');
const {
    LENGTH_MIN_NAME,
    LENGTH_MIN_PASSWORD,
    REGEXP_NUMBERS_SYMBOLS_PASSWORD
} = require('../../models/requirements/users');

/**
 * @returns Un middleware que checkea los siguiente invariante según el request:
 * 1) Un usuario cliente no puede crear otros usuarios.
 * 2) Un usuario sin token no puede crear una administrador.
 */
const checkPermissionOnCreateUser = () => {    
    return async (req, res = response, next) => {     
        if (req.token) {
            // rol del usuario que hace la operación
            let {role} = await User.findOne({_id: req.uid});
            // un cliente no puede crear otro usuario
            if (role === ROLES.CLIENT) {
                return res.status(401).json({
                    ok: false,
                    msg: MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER
                });
            }            
        } else {
            const roleNewUser = req.body.role;
            // un usuario sin token no puede crear un administrador
            if (roleNewUser === ROLES.ADMINISTRATOR) {
                return res.status(401).json({
                    ok: false,
                    msg: MSG_WITHOUT_AUTH_TO_CREATE_ADMIN
                })
            }
        }     
        next();
    }
} 

/**
* @returns {object} Un arreglo de middlewares que checkean la longitud del nombre, la existencia de
un email, la existencia de un rol y la longitud del password y que el mismo contenga al menos un número
y un símbolo.
*/
const checkCreateUser = [
    check('name', MSG_NAME_IS_REQUIRED).not().isEmpty(),
    check('name', MSG_NAME_ERROR_LENGTH).isLength({min: LENGTH_MIN_NAME}),
    check('email', MSG_EMAIL_IS_REQUIRED).isEmail(),
    check('password', MSG_PASSWORD_ERROR_LENGTH).isLength({ min: LENGTH_MIN_PASSWORD})
        .matches(REGEXP_NUMBERS_SYMBOLS_PASSWORD),
    check('role', MSG_ROLE_ERROR_TYPE).custom((role) => isRole(role)),
    checkPermissionOnCreateUser(),
    validateFields,
];

/**
* @returns {object} Un arreglo de middlewares que checkean la presencia de email y password.
*/
const checkLoginUser = [
    check('email', MSG_EMAIL_NOT_ENTERED).isEmail(),
    check('password', MSG_PASSWORD_NOT_ENTERED).not().isEmpty(),
    validateFields
];

/**
* @returns {object}  Un arreglo de middlewares que checkean la longitud del nombre, la existencia de
un email, la existencia de un rol y la longitud del password y que el mismo contenga al menos un número
y un símbolo. Además chequea el acceso según propietario y rol (si es propiertario autoriza automáticamente).
*/
const checkUpdateUser = [
    check('name', MSG_NAME_ERROR_LENGTH).optional().isLength({min: LENGTH_MIN_NAME}),
    check('email', MSG_EMAIL_IS_REQUIRED).optional().isEmail(),
    check('password', MSG_PASSWORD_ERROR_LENGTH).optional().isLength({ min: LENGTH_MIN_PASSWORD})
        .matches(REGEXP_NUMBERS_SYMBOLS_PASSWORD),
    check('role', MSG_ROLE_ERROR_TYPE).isEmpty(),
    createAccessRoleAndOwnerBased(ROLES.ADMINISTRATOR),
    validateFields
];

/**
* @returns {object} Un middleware que chequea el acceso.
*/
const checkDeleteUser = [
    createAccessRoleAndOwnerBased(ROLES.ADMINISTRATOR),
    validateFields
];

/**
* @returns {object} Un arreglo de middlewares que checkean la presencia de email y password.
*/
const checkRevalidateToken = [
    check('email', MSG_EMAIL_NOT_ENTERED).isEmail(),
    check('password', MSG_PASSWORD_NOT_ENTERED).not().isEmpty(),
    validateFields
];

module.exports = {
    checkCreateUser,
    checkLoginUser,
    checkUpdateUser,
    checkDeleteUser,    
    checkRevalidateToken
}