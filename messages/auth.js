const {LENGTH_MIN_PASSWORD} = require('../models/requirements/users');
const {ROLES} = require('../types/role');

const MSG_USER_EXISTS = 'There is already a user with that email';
const MSG_USER_NOT_EXISTS = 'The user does not exist';
const MSG_PASSWORD_INCORRECT = 'Incorrect username or password';
const MSG_EMAIL_NOT_ENTERED = 'Email has not been entered';
const MSG_PASSWORD_NOT_ENTERED = 'Password not entered';
const MSG_EMAIL_IS_REQUIRED = 'Email is required';
const MSG_PASSWORD_ERROR_LENGTH = `The password must be at least ${LENGTH_MIN_PASSWORD} characters of which at least one must be a number and at least one must be a symbol`;
const MSG_ROLE_ERROR_TYPE = `The user must have one of the following roles: ${Object.values(ROLES)}`;
const MSG_USER_CANNOT_CHANGE_ROLE = `The user cannot change their role`;
const MSG_WITHOUT_AUTH_TO_CREATE_ADMIN = 'The user does not have permission to create a new administrator';
const MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER = 'You do not have permission to create another user';
const MSG_USER_BLOCKED = 'The user has been blocked';
const MSG_INVALID_LOCK_STATE = 'Invalid lock state'
const MSG_NO_TOKEN = 'There is no token in the request';
const MSG_INVALID_TOKEN = 'Invalid token';
const MSG_INVALID_CELLPHONE = 'Invalid cellphone';
const MSG_COULD_NOT_BE_SENT_RESTORE_PIN = 'Restore pin could not be sent';

module.exports = {
    MSG_USER_EXISTS,
    MSG_USER_NOT_EXISTS,
    MSG_PASSWORD_INCORRECT,
    MSG_EMAIL_NOT_ENTERED,
    MSG_PASSWORD_NOT_ENTERED,
    MSG_EMAIL_IS_REQUIRED,
    MSG_PASSWORD_ERROR_LENGTH,
    MSG_ROLE_ERROR_TYPE,
    MSG_USER_CANNOT_CHANGE_ROLE,
    MSG_WITHOUT_AUTH_TO_CREATE_ADMIN,
    MSG_WITHOUT_AUTH_TO_CREATE_EXTRA_USER,
    MSG_USER_BLOCKED, 
    MSG_INVALID_LOCK_STATE,
    MSG_NO_TOKEN,
    MSG_INVALID_TOKEN,
    MSG_INVALID_CELLPHONE,
    MSG_COULD_NOT_BE_SENT_RESTORE_PIN
}