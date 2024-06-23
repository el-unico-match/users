const {logInfo} = require('./log/log');

let apikeys = undefined;

/**
 * 
 * @description establece todas las apikeys
 */
const setApikeys = (apikeysParam) => {
    logInfo(`Set the apikeys: ${JSON.stringify(apikeysParam)}`);
    apikeys = apikeysParam;
}

/**
 * 
 * @returns retorna todas las apikeys
 */
const getApikeys = () => {
    return apikeys;
}

/**
 * 
 * @returns retorn la apikey de este microservicio
 */
const getSelfApikey = () => {
    if (apikeys) {
        return apikeys.users;
    } else {
        return undefined;
    }    
}

/**
 * 
 * @returns retorn la apikey del microservicio gateway
 */
const getGatewayApikey = () => {
    if (apikeys) {
        return apikeys.gateway;
    } else {
        return undefined
    }    
}

module.exports = {
    setApikeys,
    getGatewayApikey,
    getSelfApikey
}

