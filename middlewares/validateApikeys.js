const {response} = require('express');
const jwt = require('jsonwebtoken');
const {HTTP_CLIENT_ERROR_4XX, HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
const {getApikeys,getSelfApikey} = require('../helpers/apikeys');
const {MSG_NO_APIKEY, 
    MSG_INVALID_APIKEY,
    MSG_APIKEY_NO_MATCH} = require('../messages/apikey');
const {
    logInfo,
    logDebug} = require('../helpers/log/log');
    
/**
 * Valida el x-apikey del request y compara con las apikeys locales validando
 * la propia.
 */
const validateApikeys = (req, res = response, next) => {
    const requestApikey = req.header('x-apikey');
    logDebug(`On validate apikey: ${requestApikey}`);
    if (!requestApikey) {
        const dataToResponse = {
            ok: false,
            msg: MSG_NO_APIKEY
        };
        logDebug(`On validate apikey null`);
        logInfo(`On validate apikey response: ${HTTP_CLIENT_ERROR_4XX.BAD_REQUEST}; ${JSON.stringify(dataToResponse)}`)
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);
    } 
    try {
        doValidateApikey(requestApikey);
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_INVALID_APIKEY
        };
        const statusToResponse = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;
        logDebug(`On validate request apikey error: ${error}`);
        logInfo(`On validate request apikey response: ${statusToResponse}; ${JSON.stringify(dataToResponse)}`)
        return res.status(statusToResponse).json(dataToResponse)
    };   
    next();
}

/**
 * 
 * Válida el x-apikey del request y compara con las apikeys locales validando
 * la propia.
 */
const doValidateApikey = (apikeyToValidate) =>  {
    logDebug(`On validate apikey: ${apikeyToValidate}`);
    // verificar integridad apikeyToValidate
    const apikeyToValidateData = jwt.decode(apikeyToValidate);
    logDebug(`On validate apikey gateway data: ${JSON.stringify(apikeyToValidateData)}`);
    const whiteListApiKeys = getApikeys();
    console.log("¿Array? ",Array.isArray(whiteListApiKeys));
    if (Array.isArray(whiteListApiKeys) && whiteListApiKeys.some( x => x == apikeyToValidate)) {
        logDebug(`On validate apikey: apikey validated`);     
    } else {
        logDebug(`On validate apikey: throw error`);     
        throw new Error(MSG_APIKEY_NO_MATCH)
    }
}

const validateApikeysOnResponse = () => {
    doValidateApikey(getSelfApikey());
}

module.exports = {
    validateApikeys,
    validateApikeysOnResponse
}

