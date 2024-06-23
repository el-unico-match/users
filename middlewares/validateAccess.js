const {response} = require('express');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const MSG_ACCESS_DENIED = 'You do not have the necessary access level';
const MSG_ROLE_NOT_FOUND = 'User without role';
const {
    logDebug,
    logInfo} = require('../helpers/log/log');

/**
 * 
 * @param {rolesWithAccess} object  Roles que pueden tener acceso.
 * @returns Una función que chequea si el usuario tiene un rol que permita el acceso.
 */
const createAccessRoleBased = (superRole) => {
    return async (req, res = response, next) => {        
        const role = req.tokenExtractedData.role;
        if (!role){
            const dataToResponse = {
                ok: false,
                msg: MSG_ROLE_NOT_FOUND
            };
            logDebug(`On check role, role null`);
            logInfo(`On check role response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`)
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse);
        }        
        if (role !== superRole) {
            const dataToResponse = {
                ok: false,
                msg: MSG_ACCESS_DENIED
            };
            logDebug(`On check role: ${role}; ${superRole}`);
            logInfo(`On check role response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`)
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse);
        }
        next();
    }
}

/**
 * 
 * @param {rolesWithAccess} object  Roles que pueden tener acceso.
 * @returns Una función que chequea si el usuario tiene un rol que permita el acceso en caso
 * que el id parámetros de la request sea distinto al del recuperado del usuario por medio del
 * token.
 */
const createAccessRoleAndOwnerBased = (superRole) => {
    const checkAccessRoleBased = createAccessRoleBased(superRole);
    return async (req, res = response, next) => {        
        const uid = req.tokenExtractedData.uid;
        const {id} = req.params;
        if (uid !== id) {
            checkAccessRoleBased(req, res, next);
        } else {
            next();
        }        
    }
}

module.exports = {
    createAccessRoleBased,
    createAccessRoleAndOwnerBased,
    MSG_ACCESS_DENIED
}