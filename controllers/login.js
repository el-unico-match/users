const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const {
    logWarning, 
    logInfo,
    logDebug} = require('../helpers/log/log');
const {generateJWT} = require('../helpers/jwt')
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {
    MSG_USER_NOT_EXISTS,
    MSG_PASSWORD_INCORRECT,
    MSG_USER_BLOCKED
} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');

/**
 * 
 * @param {*} req 
 * @param {*} res
 * @return una función que en base al request's responde con token y el usuario
 * que ha sido logueado.
 */
const loginUser = async (req, res = response) => {
    try {
        // Check en DB si ya existe el usuario
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if (!user){
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        } else {
            if (user.blocked) {
                return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
                    ok: false,
                    msg: MSG_USER_BLOCKED
                }); 
            }
        }
        // Confirmar contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            const dataToResponse = {
                ok: false,
                msg: MSG_PASSWORD_INCORRECT
            };
            logInfo(`On login user response: ${JSON.stringify(dataToResponse)}`)
            return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);    
        }
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(user.id, user.role, user.blocked);
        logDebug(`On login user generate JWT: ${token}`);
        const dataToResponse = {
            ok: true,
            user: {
                id: user.id,
                email,
                role: user.role,
                blocked: user.blocked,
                verified: user.verified
            },
            token
        };
        logInfo(`On login user response: ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SUCCESS_2XX.ACCEPTED).json(dataToResponse);    
    } catch (error) {
        logWarning(`On login user: ${error}`);
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        logInfo(`On login user response: ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json(dataToResponse)
    }
}

module.exports = {
    loginUser
}