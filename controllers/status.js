const {response} = require('express');
const User = require('../models/Users');
const {HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
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
        logInfo(`On get status response database working on port ${process.env.PORT}`);
        res.json({
            ok: true,
            status: {
                database: {
                    online: users.length > 0 
                },
                service: {
                    port: process.env.PORT
                } 
            }            
        })
    } catch(error) {
        logWarning(`On get status: ${error}`);
        logInfo(`On get status response: ${MSG_DATABASE_ERROR}`);
        res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
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
        })
    }
}

module.exports = {
    getStatus,
}