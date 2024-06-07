const {response} = require('express');
const jwt = require('jsonwebtoken');
const {jwtDecode} = require('jwt-decode');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes')
const {MSG_NO_TOKEN, MSG_INVALID_TOKEN} = require('../messages/auth');

/**
 * Valida un token que viene por el header como "x-token" 
 */
const validateJWT = (req, res = response, next) => {
    genericValidateJWT(req, res, doValidateJWT, next);
}

/**
 * Valida un token que viene por el header como "x-token" dando como válido el caso
 * en el que NO exista un token en el request.
 */
const validateLazyJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (token) {
        try {
            doValidateJWT(req, token);
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

/**
 * Valida un token con Pin que viene por el header como "x-token" 
 */
const validatePinJWT = (req, res = response, next) => {
    genericValidateJWT(req, res, doValidatePinJWT, next);
}

/**
 * 
 * Válida el token del request.
 */
const doValidateJWT = (req, token) =>  {
    const {uid, role, blocked} = jwt.verify(
        token,
        process.env.SECRET_JWT_SEED
    );
    req.tokenExtractedData = {
        uid,
        role,
        blocked
    };
}

/**
 * 
 * Válida el token del request.
 */
const doValidatePinJWT = (req, token) =>  {
    const {pin, email} = jwt.verify(
        token,
        process.env.SECRET_JWT_SEED
    );
    req.tokenExtractedData = {
        pin,
        email
    };
}

/**
 * Decodifica un token que viene por el header como "x-token" 
 */
const decodeJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            msg: MSG_NO_TOKEN
        });
    }
    try {
        doDecodeJWT(req, token);
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
 * Decodifica el token del request.
 */
const doDecodeJWT = (req, token) =>  {
    const {uid, role, blocked} = jwtDecode(token);
    req.tokenExtractedData = {
        uid,
        role,
        blocked
    };
}

/**
 * Valida un token que viene por el header como "x-token" mediante la función parámetro 
 */
const genericValidateJWT = (req, res = response, doValidate, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            msg: MSG_NO_TOKEN
        });
    } 
    try {
        doValidate(req, token);
    } catch (error) {
        return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
            ok: false,
            msg: MSG_INVALID_TOKEN
        })
    }
    next();
}

module.exports = {
    validateJWT,
    validateLazyJWT,
    decodeJWT,
    validatePinJWT
}