const {
    LENGTH_MIN_NAME,
    LENGTH_MIN_PASSWORD,
} = require('../models/requirements/users');

const {ROLES} = require('../types/role');

const MSG_USER_EXISTS = 'Ya existe un usuario con ese correo';
const MSG_USER_NOT_EXISTS = 'No existe el usuario ingresado';
const MSG_PASSWORD_INCORRECT = 'Usuario o contraseña incorrectos';

const MSG_EMAIL_NOT_ENTERED = 'No se ha ingresado el email';
const MSG_PASSWORD_NOT_ENTERED = 'No se ha ingresado la contraseña';

const MSG_NAME_IS_REQUIRED = 'El nombre es obligatorio';
const MSG_NAME_ERROR_LENGTH = `El nombre debe tener al menos ${LENGTH_MIN_NAME} caracteres`;
const MSG_EMAIL_IS_REQUIRED = 'El email es obligatorio';
const MSG_PASSWORD_ERROR_LENGTH = `La contraseña debe tener al menos ${LENGTH_MIN_PASSWORD} carácteres de los cuales al menos uno debe ser un número y al menos uno debe ser un símbolo`;
const MSG_ROLE_ERROR_TYPE = `El usuario debe tener alguno de los siguiente roles: ${Object.values(ROLES)}`;

const MSG_WITHOUT_AUTH_TO_CREATE_ADMIN = 'El usuario no tiene permiso para crear un nuevo administrador';
const MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER = 'No tiene permiso para crear otro usuario';

module.exports = {
    MSG_USER_EXISTS,
    MSG_USER_NOT_EXISTS,
    MSG_PASSWORD_INCORRECT,
    MSG_EMAIL_NOT_ENTERED,
    MSG_PASSWORD_NOT_ENTERED,
    MSG_NAME_IS_REQUIRED,
    MSG_NAME_ERROR_LENGTH,
    MSG_EMAIL_IS_REQUIRED,
    MSG_PASSWORD_ERROR_LENGTH,
    MSG_ROLE_ERROR_TYPE,
    MSG_WITHOUT_AUTH_TO_CREATE_ADMIN,
    MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER
}