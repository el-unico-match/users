const {response} = require('express');
const {statusDb} = require('../database/config');
const {
    HTTP_SUCCESS_2XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
const { 
    logWarning,
    logInfo
 } = require('../helpers/log/log');
 const {statusMailService} = require('../helpers/email');
 
/**
 * 
 * @return una función que retorna como true (y el estado del servicio) si
 * el servicio funciona correctamente, y en caso contrario false 
 * con mensaje de error.
 */
const getStatus = async (req, res = response) => {
    const stDb = await statusDb();
    const stMs = await statusMailService();
    const okToResponse = stDb.online || stMs.online;
    let statusToResponse;
    if (okToResponse) {   
        statusToResponse = HTTP_SUCCESS_2XX.OK;
    } else {
        statusToResponse = HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE;
        logWarning(`On get status, incomplete functionality`);
    }
    const dataToReponse = {
        ok: okToResponse,
        status: {
            service: {
                port: process.env.PORT
            },
            database: stDb,                
            mailService: stMs
        }            
    };
    logInfo(`On get status response: ${statusToResponse}; ${JSON.stringify(dataToReponse)}`);
    res.status(statusToResponse).json(dataToReponse);
}

module.exports = {
    getStatus,
}