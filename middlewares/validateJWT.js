const {response} = require('express');
const jwt = require('jsonwebtoken');
const {jwtDecode} = require('jwt-decode');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes')
const {MSG_NO_TOKEN, MSG_INVALID_TOKEN} = require('../messages/auth');
const {MSG_WRONG_PIN} = require('../messages/auth');
const ERROR_PIN = "Pin error";
const {
    logInfo,
    logDebug} = require('../helpers/log/log');

/**
 * Valida un token que viene por el header como "x-token" 
 */
const validateJWT = (req, res = response, next) => {
    genericValidateJWT(req, res, doValidateJWT, MSG_INVALID_TOKEN, next);
}

/**
 * Valida un token que viene por el header como "x-token" dando como válido el caso
 * en el que NO exista un token en el request.
 */
const validateLazyJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (token) {
        try {
            logDebug(`On validate lazy JWT token: ${token}`);
            doValidateJWT(req, token);
            req.token = token;
        } catch (error) {
            const dataToResponse = {
                ok: false,
                msg: MSG_INVALID_TOKEN
            };
            logDebug(`On validad lazy JWT error: ${error}`);
            logInfo(`On validata lazy JWT response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`);
            return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse);
        }
    }    
    next();
}

/**
 * Valida un token con Pin que viene por el header como "x-token" 
 */
const validatePinJWT = (req, res = response, next) => {
    genericValidateJWT(req, res, doValidatePinJWT, MSG_WRONG_PIN, next);
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
    logDebug(`On validate token, token extracted data: ${JSON.stringify(req.tokenExtractedData)}`);
}

/**
 * 
 * Válida el token del request.
 */
const doValidatePinJWT = (req, token) =>  {
    const {id, email, pin} = jwt.verify(
        token,
        process.env.SECRET_JWT_SEED
    );
    req.tokenExtractedData = {
        id,
        email
    };
    const pinParam = req.params.pin;
    logDebug(`On validate pin : ${pin} ?== ${pinParam}`);
    logDebug(`On validate pin JWT, token extracted data: ${JSON.stringify(req.tokenExtractedData)}`);
    if (pin !== pinParam) {
        logDebug(`On validate pin JWT: ${pin} !== ${pinParam}`);
        throw new Error(ERROR_PIN);
    }    
}

/**
 * Decodifica un token que viene por el header como "x-token" 
 */
const decodeJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        const dataToResponse = {
            ok: false,
            msg: MSG_NO_TOKEN
        };
        logDebug(`On decode JWT token null`);
        logInfo(`On decode JWT response: ${HTTP_CLIENT_ERROR_4XX.BAD_REQUEST}; ${JSON.stringify(dataToResponse)}`)
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);
    }
    try {
        doDecodeJWT(req, token);
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_INVALID_TOKEN
        };
        logDebug(`On decode JWT error: ${error}`);
        logInfo(`On decode JWT response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`)
        return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse)
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
const genericValidateJWT = (req, res = response, doValidate, msg_invalid, next) => {
    const token = req.header('x-token');
    if (!token) {
        const dataToResponse = {
            ok: false,
            msg: MSG_NO_TOKEN
        };
        logDebug(`On validate JWT token null`);
        logInfo(`On validate JWT response: ${HTTP_CLIENT_ERROR_4XX.BAD_REQUEST}; ${JSON.stringify(dataToResponse)}`)
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);
    } 
    try {
        doValidate(req, token);
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: msg_invalid
        };
        logDebug(`On validate JWT error: ${error}`);
        logInfo(`On validate JWT response: ${HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED}; ${JSON.stringify(dataToResponse)}`)
        return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json(dataToResponse)
    }
    next();
}

module.exports = {
    validateJWT,
    validateLazyJWT,
    decodeJWT,
    validatePinJWT
}