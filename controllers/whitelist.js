const {response} = require('express');
const {setApikeys} = require('../helpers/apikeys');
const {logInfo} = require('../helpers/log/log');
  
/**
 * 
 * @return una función que retorna como true (y el estado del servicio) si
 * el servicio funciona correctamente, y en caso contrario false 
 * con mensaje de error.
 */
const updateWhitelist = async (req, res = response) => {
    const apikeys = req.body?.apiKeys
    const statusToResponse = 200;
    const dataToReponse = {
        ok: true,
        apikeys: apikeys    
    };
    setApikeys(apikeys);
    logInfo(`On get status response: ${statusToResponse}; ${JSON.stringify(dataToReponse)}`);
    res.status(statusToResponse).json(dataToReponse);     
}

module.exports = {
    updateWhitelist
}