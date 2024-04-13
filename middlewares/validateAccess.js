const {response} = require('express');
const User = require('../models/Users');

const MSG_ACCESS_DENIED = 'No tienes el nivel de acceso necesario';
const MSG_USER_NOT_FOUND = 'No se encontró el usuario';

/**
 * 
 * @param {rolesWithAccess} object  Roles que pueden tener acceso.
 * @returns Una función que chequea si el usuario tiene un rol que permita el acceso.
 */
const createAccessRoleBased = (superRole) => {
    return async (req, res = response, next) => {        
        let {role} = await User.findOne({_id: req.uid});
        if (!role){
            return res.status(401).json({
                ok: false,
                msg: MSG_USER_NOT_FOUND
            });
        }        
        if (role !== superRole) {
            return res.status(401).json({
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
        const {uid} = req;
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