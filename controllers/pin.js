const {response} = require('express');
const User = require('../models/Users');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_USER_NOT_EXISTS} = require('../messages/auth');
const {
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_PIN_USED} = require('../messages/pin');
const {sendPinMail} = require('../helpers/email/email');
const {generatePin} = require('../helpers/pin');
const {generatePinJWT} = require('../helpers/jwt');
const {updateUser} = require('./user');
const TEXT_VERIFY = "Your verification PIN is: ";
const {responseWithApikey} = require('../helpers/response');
const {
    logWarning,
    logDebug
} = require('../helpers/log/log');

const generateMessageVerificationPin = (pin, _token) => {
    return `${TEXT_VERIFY}${pin}`;
}

/**
 * 
 * @param {*} req: En body email.
 * @description un Pin de verificación de contraseña al mail. Retorna un token de verificación.
 */
const sendVerificationPin = async (req, res = response) => {
    await sendPin(req, res, generateMessageVerificationPin);
}

/**
 * 
 * @param {*} generateMessage (pin, token) => string
 */
const sendPin = async (req, res = response, generateMessage) => {
    try {
        const {email} = req.body;
        // Check en DB si existe el usuario
        let user = await User.findOne({email});
        if (user){    
            await dispatchPinMessage(req, res, user._id, email, generateMessage);   
        } else {
            dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            };
            responseWithApikey(req, res, "On send Pin response", HTTP_CLIENT_ERROR_4XX.NOT_FOUND, dataToResponse);
        }        
    } catch (error) {
        logWarning(`On send pin: ${error}`);
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        responseWithApikey(req, res, "On send Pin response", HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR, dataToResponse);
    }
}

/**
 * @description Envía efectivamente el mensaje
 */
const dispatchPinMessage = async (req, res = response, id, email, generateMessage) => {
    const pin = generatePin();
    const token = await generatePinJWT(id, email, pin);
    const message = generateMessage(pin, token);
    try {
        await sendPinMail(req, res, email, message, token);        
    } catch (error) {
        logWarning(`On dispatch pin message: ${error}`);
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500,
            detail: error.toString()
        };
        responseWithApikey(req, res, "On dispatch Pin message response", HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR, dataToResponse);
    }            
}

/**
 * 
 * @param {*} req: Por header el x-token de recuperación.
 * @description Retorna los datos del usuario junto a un token (regular).
 * 
 */
const verifyPin = async (req, res = response) => {
    try {
        const {email} = req.tokenExtractedData;
        // Check en DB si existe el usuario
        const user = await User.findOne({email});
        if (user){    
            await doVerifyPin(req, res, user);
        } else {
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            };
            responseWithApikey(req, res, "On verify Pin response", HTTP_CLIENT_ERROR_4XX.NOT_FOUND, dataToResponse);
        }        
    } catch (error) {
        logWarning(error);
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        responseWithApikey(req, res, "On verify Pin response", HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR, dataToResponse);
    }
}

/**
 * 
 * @description Hace la verificación efectiva de pin.
 */
const doVerifyPin = async (req, res = response, user) => {
    const last_pin = user.last_pin;
    const req_pin = req.params.pin;
    logDebug(`On verify pin: ${last_pin} (last used) ?== ${req_pin} (to check)`);
    if (last_pin === req_pin) {
        const dataToResponse = {
            ok: false,
            msg: MSG_PIN_USED
        }
        responseWithApikey(req, res, "On verify pin response", HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED, dataToResponse);
    } else {
        req.params.id = req.tokenExtractedData.id;
        req.body.verified = true;
        req.body.last_pin = req_pin
        await updateUser(req, res);
    }    
}

module.exports = {
    sendPin,
    sendVerificationPin,
    verifyPin
}