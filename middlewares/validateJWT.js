const {response} = require('express');
const jwt = require('jsonwebtoken');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes')

const MSG_NO_TOKEN = 'There is no token in the request';
const MSG_INVALID_TOKEN = 'Invalid token';

/**
 * Valida un token que viene por el header como "x-token" 
 */
const validateJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            msg: MSG_NO_TOKEN
        });
    }
    try {
        doValidateJWT(req, token, res);
    } catch (error) {
        return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
            ok: false,
            msg: MSG_INVALID_TOKEN
        })
    }
    next();
}

/**
 * 
 * Válida el token del request.
 */
const doValidateJWT = (req, token, res = response, next) =>  {
    const {uid, name} = jwt.verify(
        token,
        process.env.SECRET_JWT_SEED
    )
    req.uid = uid;
    req.name = name;
}

/**
 * Valida un token que viene por el header como "x-token" dando como válido el caso
 * en el que NO exista un token en el request.
 */
const validateLazyJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (token) {
        try {
            doValidateJWT(req, token, res);
            req.token = token;
        } catch (error) {
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
                ok: false,
                msg: MSG_INVALID_TOKEN
            })
        }
    }    
    next();
}

module.exports = {
    validateJWT,
    validateLazyJWT
}