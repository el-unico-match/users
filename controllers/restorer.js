const {response} = require('express');
const User = require('../models/Users');
const {sendPin} = require('./pin');
const {updateUser} = require('./user');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_USER_NOT_EXISTS} = require('../messages/auth');
const {
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_PIN_USED} = require('../messages/pin');
const {responseWithApikey} = require('../helpers/response');
const {
    logDebug,
    logWarning} = require('../helpers/log/log');
    
const TEXT_RESTORE = "Your restore LINK is: ";
const URL_RESTORE = "https://el-unico-match.github.io/"


/**
 * 
 * @param {*} req: En body email.
 * @description un Pin de recuperación de contraseña al mail. Retorna un token de recuperación.
 */
const sendRestorePin = async (req, res = response) => {
    await sendPin(req, res, (pin, token) => {
        return `${TEXT_RESTORE}${URL_RESTORE}?token=${token}&pin=${pin}`;
    });
}

/**
 * 
 * @param {*} req: En el body el nuevo password y  por header el x-token de recuperación.
 * @description  Retorna los datos del usuario actualizado junto a un token regular.
 */
const verifyPinAndUpdatePassword = async (req, res = response) => {
    try {
        const {email} = req.tokenExtractedData;
        // Check en DB si existe el usuario
        const user = await User.findOne({email});
        if (user){    
            await doVerifyPinAndUpdatePassword(req, res, user);
        } else {
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            };
            responseWithApikey(req, res, "On verify Pin and update password response" , HTTP_CLIENT_ERROR_4XX.NOT_FOUND, dataToResponse);
        }        
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        logWarning(`On verify pin to restore password: ${error}`);
        responseWithApikey(req, res, "On verify pin to restore password response", HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR, dataToResponse);
    }    
}

/**
 * @description Hace la verificación efectiva de pin.
 */
const doVerifyPinAndUpdatePassword = async (req, res = response, user) => {
    const last_pin = user.last_pin;
    const req_pin = req.params.pin;
    logDebug(`On verify pin to restore password: ${last_pin} (last used) ?== ${req_pin} (to check)`);
    if (last_pin === req_pin) {
        const dataToResponse = {
            ok: false,
            msg: MSG_PIN_USED
        };
        responseWithApikey(req, res, "On verify pin to restore password response", HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED, dataToResponse);
    } else {
        req.params.id = req.tokenExtractedData.id;
        req.body.last_pin = req_pin;        
        await updateUser(req, res);
    }    
}


module.exports = {
    sendRestorePin,
    verifyPinAndUpdatePassword
}