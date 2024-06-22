const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const {
    newUser, 
    saveUser} = require('../helpers/user');
const {generateJWT} = require('../helpers/jwt');
const {
    logWarning,
    logDebug, 
    logInfo} = require('../helpers/log/log');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {
    MSG_USER_EXISTS,
    MSG_USER_NOT_EXISTS} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const { ROLES } = require('../types/role');

/**
 * 
 * @param {*} req Si el request tiene blocked vacío lo setea en falso.
 */
const prepareBlocked = (req) => {
    if (!req.body.blocked) {
        req.body.blocked = false;
    }
}   

/**
 * @description retorna verdadero si el rol debe ser verificado
 */
const checkMustBeSetVerified = (role) => {
    switch (role) {
        case ROLES.ADMINISTRATOR:
            return true;
        default:
            return false;
    }
}

/**
 * 
 * @description crea un nuevo usuario según el request
 */
const createUser = async (req, res = response) => {
    try {
        // Normalizar el parámetro del body
        prepareBlocked(req);
        // Check en DB si ya existe el usuario
        const {email, password, role, blocked} = req.body;
        let user = await User.findOne({email: email});
        if (user){
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_EXISTS
            };
            logDebug(`On create user, user exists: ${JSON.stringify(user)}`);
            logInfo(`On create user response: ${HTTP_CLIENT_ERROR_4XX.BAD_REQUEST}; ${JSON.stringify(dataToResponse)}`);
            return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);
        };        
        const verified = checkMustBeSetVerified(role);
        // Crear un nuevo usuario en base al body
        user = newUser({
            ...req.body,
            verified
        });
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        logDebug(`On create user password encripted: ${user.password}`);
        // Guardar en DB
        await saveUser(user);    
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(user.id, user. role, user.blocked);
        logDebug(`On create user token generated: ${token}`);
        const dataToResponse = {
            ok: true,
            user: {
                id: user.id,
                email,
                role,
                blocked,
                verified        
            },            
            token            
        };
        logInfo(`On create user response: ${HTTP_SUCCESS_2XX.CREATED}; ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SUCCESS_2XX.CREATED).json(dataToResponse);    
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        logWarning(`On create user error: ${error}`);
        logInfo(`On create user response: ${HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR}; ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json(dataToResponse);
    }
}

/**
 * @description actualiza un usuario según el request
 */
const updateUser = async (req, res = response) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({_id: userId});
        if (!user) {
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            };
            logDebug(`On update user, user not found: ${userId}`);
            logInfo(`On update user response: ${HTTP_CLIENT_ERROR_4XX.NOT_FOUND}; ${JSON.stringify(dataToResponse)}`);
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json(dataToResponse);        
        }
        const newUser = {
            ...req.body,
        }
        newUser.email ||= user.email;
        if (newUser.blocked === undefined) {
            newUser.blocked = user.blocked;
        };       
        newUser.role = user.role;
        // Encriptar contraseña
        if (newUser.password) {
            const salt = bcrypt.genSaltSync();
            newUser.password = bcrypt.hashSync(newUser.password, salt);
        } else {
            newUser.password = user.password;    
        }       
        // Actualizar en DB
        const userUpdated = await User.findByIdAndUpdate(userId, newUser, {new: true});
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(userUpdated.id, userUpdated.role, userUpdated.blocked);
        const dataToResponse = {
            ok: true,
            user: {
                id: userUpdated._id,
                email: userUpdated.email,
                role: userUpdated.role,
                blocked: userUpdated.blocked,
                verified: userUpdated.verified
            },
            token: token,
        };
        logInfo(`On update user response: ${HTTP_SUCCESS_2XX.OK}; ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SUCCESS_2XX.OK).json(dataToResponse);
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        }
        logWarning(`On update user: ${error}`);
        logInfo(`On update user response: ${HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR}; ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json(dataToResponse);
    }   
}

/**
 * 
 * @description retorna los datos del usuario del request
 */
const getUser = async (req, res = response) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({_id: userId}, {_id:1, email: 1, role:1, blocked:1, verified:1});
        if (!user) {
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            };
            logDebug(`On get user user not found: ${userId}`);
            logInfo(`On get user response: ${HTTP_CLIENT_ERROR_4XX.NOT_FOUND}; ${JSON.stringify(dataToResponse)}`);    
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json(dataToResponse);
        } else {
            const dataToResponse = {
                ok: true,
                user: user
            };
            logInfo(`On get user response: ${HTTP_SUCCESS_2XX.OK}; ${JSON.stringify(dataToResponse)}`);    
            res.status(HTTP_SUCCESS_2XX.OK).json(dataToResponse);
        }      
    } catch (error) {
        logWarning(`On get user: ${error}`);
        logInfo(`On get user response: ${MSG_ERROR_500}`);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        }); 
    }    
}

/**
 * 
 * @description borrar el usuario del request
 */
const deleteUser = async (req, res = response) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({_id: userId});
        logDebug(`On delete user: ${userId}`);
        if (!user) {
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            };
            logDebug(`On delete user not found: ${userId}`);
            logInfo(`On delete user response: ${HTTP_CLIENT_ERROR_4XX.NOT_FOUND}; ${JSON.stringify(dataToResponse)}`)
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json(dataToResponse)
        }
        await User.findByIdAndDelete(userId);
        const dataToResponse = {
            ok: true
        };
        logInfo(`On delete user response: ${HTTP_SUCCESS_2XX.OK}; ${JSON.stringify(dataToResponse)}`)
        res.status(HTTP_SUCCESS_2XX.OK).json(dataToResponse);
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        logWarning(`On delete user: ${error}`);
        logInfo(`On delete user response: ${HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR}; ${JSON.stringify(dataToResponse)}`)
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json(dataToResponse);
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUser
}