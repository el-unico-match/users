const {ROLES} = require('../../types/role');
const {validateFields} = require('../validateFields');
const {createAccessRoleBased} = require('../validateAccess');

/**
* @returns {object} Un arreglo de middlewares que checkea que un administrador
* acceda al log.
*/
const checkGetLog = [
    createAccessRoleBased(ROLES.ADMINISTRATOR),
    validateFields
];

module.exports = {
    checkGetLog   
}