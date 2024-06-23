const {response} = require('express');
const jwt = require('jsonwebtoken');
const {HTTP_CLIENT_ERROR_4XX, HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
const {
    getGatewayApikey,
    getSelfApikey} = require('../helpers/apikeys');
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
    const gatewayApikeyLocal = getGatewayApikey();
    logDebug(`On validate gateway apikey, gateway apikey: ${gatewayApikey}`);
    if (gatewayApikeyLocal) {
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
    const gatewayApikeyData = jwt.verify(
        gatewayApikey,
        process.env.SECRET_JWT_SEED
    );
    logDebug(`On validate apikey gateway data: ${JSON.stringify(gatewayApikeyData)}`);
    const localGatewayApikey = getGatewayApikey();
    if (localGatewayApikey === gatewayApikey) {
        const selfApikey = getSelfApikey();
        if (selfApikey) {
            logDebug(`On validate apikey self: ${selfApikey}`);
            const selfApikeyData = jwt.verify(
                selfApikey,
                process.env.SECRET_JWT_SEED
            );
            logDebug(`On validate apikey self data: ${JSON.stringify(selfApikeyData)}`);
        } else {
            logDebug('On validadte apikey gateway: there is no whitelist');
        }        
    } else {
        if (localGatewayApikey) {
            throw new Error(MSG_APIKEY_NO_MATCH);
        } else {
            logDebug('On validadte apikey gateway: there is no whitelist');
        }
    }
}

module.exports = {
    validateApikeys,
    doValidateApikeys
}

