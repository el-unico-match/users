const {response} = require('express');
const {HTTP_SUCCESS_2XX} = require('../helpers/httpCodes')
const {setApikeys: setAK} = require('../helpers/apikeys');
const {logInfo} = require('../helpers/log/log');
  
/**
 * 
 * @return una función que retorna como true (y el estado del servicio) si
 * el servicio funciona correctamente, y en caso contrario false 
 * con mensaje de error.
 */
const setApikeys = async (req, res = response) => {
    const apikeys = req.body;
    const statusToResponse = HTTP_SUCCESS_2XX.OK;
    const dataToReponse = {
        ok: true,
        apikeys: apikeys    
    };
    setAK(apikeys);
    logInfo(`On get status response: ${statusToResponse}; ${JSON.stringify(dataToReponse)}`);
    res.status(statusToResponse).json(dataToReponse);    
}

module.exports = {
    setApikeys
}