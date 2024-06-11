const {response} = require('express');
const {generateJWT} = require('../helpers/jwt')
const {
    HTTP_SUCCESS_2XX, 
    HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const {
    MSG_USER_BLOCKED,
    MSG_USER_NOT_EXISTS} = require('../messages/auth');
const User = require('../models/Users');
const {
    logDebug,
    logInfo
} = require('../helpers/log/log');

/**
 * 
 * @param {*} req Debe tener cargados los datos del usuario (uid, name, email, role, blocke) 
 * y el token a revalidar.
 * @param {*} res Se carga allí un token nuevo.
 */
const refreshToken = async (req, res = response) => {
    const uid = req.tokenExtractedData.uid;
    const blocked = req.tokenExtractedData.blocked
    // Tarda a lo sumo dos tiempos de validez del token en ser efectivo un bloqueo
    if (blocked) {
        const dataToResponse = {
            ok: false,
            msg: MSG_USER_BLOCKED
        };
        logDebug(`On refresh token user blocked: ${JSON.stringify(req.tokenExtractedData)}`);
        logInfo(`On refresh token response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse); 
    } else {
        // Refrescar datos de usuario
        const user = await User.findOne({_id: uid});
        if (user){
            logDebug(`On refresh token user: ${JSON.stringify(user)}`);
            // Generar el JWT (Java Web Token)
            const token = await generateJWT(uid, user.role, user.blocked);
            const dataToResponse = {
                ok: true,
                token
            };
            logInfo(`On refresh token response: ${HTTP_SUCCESS_2XX.CREATED}; ${JSON.stringify(dataToResponse)}`);
            res.status(HTTP_SUCCESS_2XX.CREATED).json(dataToResponse);
        } else {
            logDebug(`On refresh token user not found: ${JSON.stringify(req.tokenExtractedData)}`);
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            };
            logInfo(`On refresh token response: ${HTTP_CLIENT_ERROR_4XX.NOT_FOUND}; ${JSON.stringify(dataToResponse)}`);
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json(dataToResponse);            
        }        
    }
}

module.exports = {
    refreshToken,
}