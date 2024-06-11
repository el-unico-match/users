const {response} = require('express');
const {validationResult} = require('express-validator');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const {
    logInfo,
    logDebug} = require('../helpers/log/log');

const validateFields = (req, res = response, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const dataToResponse = {
            ok: false,
            msg: errors.mapped()
        };
        logDebug(`On validate field error: ${errors}`);
        logInfo(`On validate fields reponse: ${HTTP_CLIENT_ERROR_4XX.BAD_REQUEST}; ${JSON.stringify(dataToResponse)}`);
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);
    }
    next();
}

module.exports = {
    validateFields
}