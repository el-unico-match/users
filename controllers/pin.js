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

const {
    logWarning,
    logInfo,
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
            await dispatchPinMessage(res, user._id, email, generateMessage)      
        } else {
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        }        
    } catch (error) {
        logWarning(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @description Envía efectivamente el mensaje
 */
const dispatchPinMessage = async (res = response, id, email, generateMessage) => {
    const pin = generatePin();
    const token = await generatePinJWT(id, email, pin);
    const message = generateMessage(pin, token);
    try {        
        await sendPinMail(res, email, message, token);        
    } catch (error) {
        logWarning(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500,
            detail: error.toString()
        });    
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
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        }        
    } catch (error) {
        logWarning(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
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
        logInfo(`On verify pin response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED} ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse);
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