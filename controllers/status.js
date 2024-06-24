const {response} = require('express');
const {statusDb} = require('../database/config');
const {
    HTTP_SUCCESS_2XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
const {logWarning} = require('../helpers/log/log');
 const {responseWithApikey} = require('../helpers/response');
 const {statusMailService} = require('../helpers/email/email');
 
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
    let statusToResponse = HTTP_SUCCESS_2XX.OK;
    if (!okToResponse) {
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
    responseWithApikey(req, res, "On get status response", statusToResponse, dataToReponse);
}

module.exports = {
    getStatus,
}