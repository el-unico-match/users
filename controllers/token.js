const {response} = require('express');
const {generateJWT} = require('../helpers/jwt')
const {
    HTTP_SUCCESS_2XX, 
    HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const {
    MSG_USER_BLOCKED,
    MSG_USER_NOT_EXISTS} = require('../messages/auth');
const User = require('../models/Users');

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
        res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
            ok: false,
            msg: MSG_USER_BLOCKED
        }); 
    } else {
        // Refrescar datos de usuario
        const user = await User.findOne({_id: uid});
        if (!user){
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        } else {
            // Generar el JWT (Java Web Token)
            const token = await generateJWT(uid, user.name, user.email, user.role, user.blocked);
            res.status(HTTP_SUCCESS_2XX.CREATED).json({
                ok: true,
                token
            });
        }        
    }
}

module.exports = {
    refreshToken,
}