const {response} = require('express');
const User = require('../models/Users');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const MSG_ACCESS_DENIED = 'You do not have the necessary access level';
const MSG_USER_NOT_FOUND = 'User not found';

/**
 * 
 * @param {rolesWithAccess} object  Roles que pueden tener acceso.
 * @returns Una función que chequea si el usuario tiene un rol que permita el acceso.
 */
const createAccessRoleBased = (superRole) => {
    return async (req, res = response, next) => {        
        //let {role} = await User.findOne({_id: req.tokenExtractedData.uid});
        const role = req.tokenExtractedData.role;
        if (!role){
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
                ok: false,
                msg: MSG_USER_NOT_FOUND
            });
        }        
        if (role !== superRole) {
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
                ok: false,
                msg: MSG_ACCESS_DENIED
            });
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
}