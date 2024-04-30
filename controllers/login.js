const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
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
            return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
                ok: false,
                msg: MSG_PASSWORD_INCORRECT
            });    
        }
        // Generar el JWT (Java Web Token)
        const token = await generateJWT(user.id, user.role, user.blocked);
        res.status(HTTP_SUCCESS_2XX.ACCEPTED).json({
            ok: true,
            user: {
                id: user.id,
                name: user.name,
                email,
                role: user.role,
                blocked: user.blocked
            },
            token
        });    
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

module.exports = {
    loginUser
}