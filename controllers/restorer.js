const {response} = require('express');
const User = require('../models/Users');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {
    MSG_USER_NOT_EXISTS, 
    MSG_COULD_NOT_BE_SENT_RESTORE_PIN,
    MSG_WRONG_PIN} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {sendRestoreMail} = require('../helpers/email');
const {sendRestoreWhatsapp} = require('../helpers/whatsapp');
const {generatePin} = require('../helpers/pin');
const {
    generateJWT, 
    generateRestoreJWT} = require('../helpers/jwt');

/**
 * 
 * @param {*} req: En body email y cellphone(opcional).
 * @description un Pin de recuperación de contraseña al mail y si en el body hay un cellphone
 * envía el Pin sólo a este. Retorna un token de recuperación.
 */
const restorePassword = async (req, res = response) => {
    try {
        const {email, cellphone} = req.body;
        // Check en DB si existe el usuario
        let user = await User.findOne({email});
        if (user){    
            await sendRestoreMessage(req, res, email, cellphone)      
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
const sendRestoreMessage = async (req, res = response, email, cellphone) => {
    const pin = generatePin();
    const token = await generateRestoreJWT(email, pin);
    try {
        if (cellphone) {
            await sendRestoreWhatsapp(cellphone, pin);
        } else {
            await sendRestoreMail(email, pin);    
        }
        res.status(HTTP_SUCCESS_2XX.CREATED).json({
            ok: true,
            user: {
                email,
                cellphone
            },            
            token: token            
        });    
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_COULD_NOT_BE_SENT_RESTORE_PIN         
        });    
    }            
}

/**
 * 
 * @param {*} req: Como parámetro en path el pin de recuperación y por header el x-token de recuperación.
 * @description Chequea el pin de recuperación comparando con el token de recuperación.
 * Retorna los datos del usuario junto a un token (regular) que puede ser utiliza para actualizar
 * el password.
 */
const verifyPin = async (req, res = response) => {
    try {
        const {pin, email} = req.tokenExtractedData;
        // Check en DB si existe el usuario
        let user = await User.findOne({email});
        if (user){    
            await doVerifyPin(req, res, pin, user);
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
const doVerifyPin = async (req, res = response, pinToken, user) => {
    const pinParam = req.params.pin;
    if (pinToken === pinParam) {
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
    } else {
        res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            pin: pinParam,
            msg: MSG_WRONG_PIN
        });
    }
}

module.exports = {
    restorePassword,
    verifyPin
}