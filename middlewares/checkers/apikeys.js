const {ROLES} = require('../../types/role');
const {validateFields} = require('../validateFields');
const {createAccessRoleBased} = require('../validateAccess');

/**
* @returns {object} Un arreglo de middlewares que checkea que un administrador
* efectúe el seteo o renovación de apikeys.
*/
const checkSetApikeys = [
    createAccessRoleBased(ROLES.ADMINISTRATOR),
    validateFields
];

module.exports = {
    checkSetApikeys   
}