const {response} = require('express');
const {HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_INVALID_APIKEY} = require('../messages/apikey');
const {validateApikeysOnResponse} = require('../middlewares/validateApikeys');
const {
    logInfo,
    logDebug} = require('../helpers/log/log');

/**
 * @description Efectúa la respuesta pero antes checkea las apikeys. Además realiza el log de la 
 * respuesta
 */
const responseWithApikey = async (req, res = response, letterheadToLog, status, dataToSend, dataToLog) => {
    try {
        const toLog = dataToLog ? dataToLog : dataToSend;
        validateApikeysOnResponse();
        logInfo(`${letterheadToLog}: ${status}; ${JSON.stringify(toLog)}`);
        res.status(status).json(dataToSend);   
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

/**
 * @description Efectúa la respuesta sin checkear las apikeys y realiza el respaldo de la respuesta
 * en el log.
 */
const responseAndLog = async (req, res = response, letterheadToLog, status, dataToSend, dataToLog) => {
    try {
        const toLog = dataToLog ? dataToLog : dataToSend;
        logInfo(`${letterheadToLog}: ${status}; ${JSON.stringify(toLog)}`);
        res.status(status).json(dataToSend);   
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
    responseAndLog
}