const {response} = require('express');
const {HTTP_SUCCESS_2XX} = require('../helpers/httpCodes')
const {responseWithApikey} = require('../helpers/response');
const {readLog} = require('../helpers/log/log');

/**
 * 
 * @return una función que retorna el log.
 */
const getLog = async (req, res = response) => {
    const dataToReponse = {
        ok: true,
        log: readLog()            
    };
    responseWithApikey(req, res, "On get log response", HTTP_SUCCESS_2XX.OK, dataToReponse);
}

module.exports = {
    getLog,
}