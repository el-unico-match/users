const {response} = require('express');
const {HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_INVALID_APIKEY} = require('../messages/apikey');
const {validateApikeysOnResponse} = require('../middlewares/validateApikeys');
const {
    logInfo,
    logDebug} = require('../helpers/log/log');

/**
 * @description Efectúa la respuesta pero antes checkea las apikeys.
 */
const responseWithApikey = async (req, res = response, letterheadToLog, status, data) => {
    try {
        validateApikeysOnResponse(req);
        logInfo(`${letterheadToLog}: ${status}; ${JSON.stringify(data)}`);
        res.status(status).json(data);   
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_INVALID_APIKEY
        };
        const statusToResponse = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;
        logDebug(`On response with apykey error: ${error}`);
        logInfo(`On response with apykey, response: ${statusToResponse}; ${JSON.stringify(dataToResponse)}`)
        return res.status(statusToResponse).json(dataToResponse)
    }    
}

module.exports = {
    responseWithApikey,
}