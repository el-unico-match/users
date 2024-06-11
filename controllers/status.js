const {response} = require('express');
const User = require('../models/Users');
const {
    HTTP_SUCCESS_2XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
const {MSG_DATABASE_ERROR} = require('../messages/uncategorized');
const { 
    logWarning,
    logInfo
 } = require('../helpers/log/log');

/**
 * 
 * @return una función que retorna como true (y el estado del servicio) si
 * el servicio funciona correctamente, y en caso contrario false 
 * con mensaje de error.
 */
const getStatus = async (req, res = response) => {
    try {
        let users = await User.find();
        const dataToReponse = {
            ok: true,
            status: {
                database: {
                    online: users.length > 0 
                },
                service: {
                    port: process.env.PORT
                } 
            }            
        };
        logInfo(`On get status response: ${HTTP_SUCCESS_2XX.OK}; ${JSON.stringify(dataToReponse)}`);
        res.status(HTTP_SUCCESS_2XX.OK).json(dataToReponse)
    } catch(error) {
        logWarning(`On get status: ${error}`);
        const dataToReponse = {
            ok: false,
            status: {
                database: {
                    online: false 
                },
                service: {
                    port: process.env.PORT
                } 
            },
            msg: MSG_DATABASE_ERROR
        };
        logInfo(`On get status response: ${HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE}; ${JSON.stringify(dataToReponse)}`);
        res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json(dataToReponse)
    }
}

module.exports = {
    getStatus,
}