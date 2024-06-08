const {response} = require('express');
const User = require('../models/Users');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_USER_NOT_EXISTS} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {sendPinMail} = require('../helpers/email');
const {generatePin} = require('../helpers/pin');
const {
    generateJWT, 
    generatePinJWT} = require('../helpers/jwt');
const TEXT_VERIFY = "Your verification PIN is: ";

/**
 * 
 * @param {*} req: En body email.
 * @description un Pin de verificación de contraseña al mail. Retorna un token de verificación.
 */
const sendVerificationPin = async (req, res = response) => {
    await sendPin(req, res, TEXT_VERIFY);
}

const sendPin = async (req, res = response, text) => {
    try {
        const {email} = req.body;
        // Check en DB si existe el usuario
        let user = await User.findOne({email});
        if (user){    
            await dispatchPinMessage(res, email, text)      
        } else {
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        }        
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

/**
 * @description Envía efectivamente el mensaje
 */
const dispatchPinMessage = async (res = response, email, text) => {
    const pin = generatePin();
    const token = await generatePinJWT(email, pin);
    const message = `${text}${pin}`;
    try {        
        await sendPinMail(res, email, message, token);        
    } catch (error) {
        console.log(error);
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
        let user = await User.findOne({email});
        if (user){    
            await doVerifyPin(req, res, user);
        } else {
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        }        
    } catch (error) {
        console.log(error);
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
const doVerifyPin = async (res = response, user) => {
    // Generar el JWT (Java Web Token)
    const token = await generateJWT(user.id, user.role, user.blocked);
    res.status(HTTP_SUCCESS_2XX.CREATED).json({
        ok: true,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            blocked: user.blocked
        },
        token: token,
    });        
}

module.exports = {
    sendPin,
    sendVerificationPin,
    verifyPin
}