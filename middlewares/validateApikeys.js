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
    const gatewayApikey = req.header('x-apikey');
    const whiteListApiKeys = getApikeys();
    logDebug(`On validate gateway apikey, gateway apikey: ${whiteListApiKeys}`);
    if (whiteListApiKeys) {
        if (!gatewayApikey) {
            const dataToResponse = {
                ok: false,
                msg: MSG_NO_APIKEY
            };
            logDebug(`On validate gateway apikey null`);
            logInfo(`On validate gateway apikey response: ${HTTP_CLIENT_ERROR_4XX.BAD_REQUEST}; ${JSON.stringify(dataToResponse)}`)
            return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);
        } 
        try {
            doValidateApikeys(req);
        } catch (error) {
            const dataToResponse = {
                ok: false,
                msg: MSG_INVALID_APIKEY
            };
            const statusToResponse = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;
            logDebug(`On validate gateway apikey error: ${error}`);
            logInfo(`On validate gateway apikey response: ${statusToResponse}; ${JSON.stringify(dataToResponse)}`)
            return res.status(statusToResponse).json(dataToResponse)
        }
    } else {
        logDebug('On validadte apikey gateway: there is no whitelist');
    }
    next();
}

/**
 * 
 * Válida el x-apikey del request y compara con las apikeys locales validando
 * la propia.
 */
const doValidateApikeys = (req) =>  {
    const gatewayApikey = req.header('x-apikey');
    logDebug(`On validate apikey gateway : ${gatewayApikey}`);
    const gatewayApikeyData = jwt.decode(gatewayApikey);
    logDebug(`On validate apikey gateway data: ${JSON.stringify(gatewayApikeyData)}`);
    const whiteListApiKeys = getApikeys();
    if (Array.isArray(whiteListApiKeys) && whiteListApiKeys.some( x => x == gatewayApikey)) {
        const selfApikey = getSelfApikey();
        if (selfApikey) {
            logDebug(`On validate apikey self: ${selfApikey}`);
            const selfApikeyData = jwt.decode(selfApikey);
            logDebug(`On validate apikey self data: ${JSON.stringify(selfApikeyData)}`);
        } else {
            logDebug('On validadte apikeys: there is no whitelist');
        }        
    } else {
        if (whiteListApiKeys) {
            throw new Error(MSG_APIKEY_NO_MATCH);
        } else {
            logDebug('On validadte apikey gateway: there is no whitelist');
        }
    }
}

const validateApikeysOnResponse = (req) => {
    const gatewayApikey = req.header('x-apikey');
    if (gatewayApikey) {
        doValidateApikeys(req);
    }
}

module.exports = {
    validateApikeys,
    validateApikeysOnResponse
}

