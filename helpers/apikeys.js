const {logInfo, logError} = require('./log/log');
const axios = require('axios');
const jwt = require('jsonwebtoken');

let is_apikeys_checking_enabled = !process.env.IS_APIKEY_CHECKING_DISABLED;
let whitelist_apikeys = undefined;
let self_apikey = undefined;
let active_apikey_endpoint = undefined;
let apiKeyState = undefined;

/**
 * 
 * @returns booleano que indica si debe o no realizarse el chequeo de la presencia del header 'x-apikey'
 */
const isApiKeyCheckingEnabled = () => {
    return is_apikeys_checking_enabled;
}

/**
 * 
 *  @description define si se debe realizar la validación sobre el header 'x-apikey'
 */
const setIsApiKeyCheckingEnabled = (isEnabled) => {
    is_apikeys_checking_enabled = isEnabled;
}

/**
 * 
 * @description establece todas las apikeys
 */
const setApikeys = (apikeys) => {
    logInfo(`Set the apikeys: ${apikeys}`);
    whitelist_apikeys = apikeys;
}

/**
 * 
 * @returns retorna todas las apikeys
 */
const getApikeys = () => {
    return whitelist_apikeys;
}

/**
 * 
 * @returns retorn la apikey de este microservicio
 */
const getSelfApikey = () => {
    return self_apikey;
}

/**
 * 
 * @description establece todas la self apikey
 */
const setSelfApikey = (apikey) => {
    logInfo(`Set the self apikey: ${JSON.stringify(apikey)}`);
    self_apikey = apikey;
}

/**
 * 
 * @description establece el endpoint para activar la apikey propia
 */
const setActiveApiKeyEndpoint = (apikey_endpoint) => {
    logInfo(`Set the self apikey: ${JSON.stringify(apikey_endpoint)}`);
    active_apikey_endpoint = apikey_endpoint;
}

/**
 * 
 * @returns retorn la apikey del microservicio gateway
 */
const getGatewayApikey = () => {
    return undefined
}

/**
 * 
 * @description Invoca al endpoint de service para activar la apikey
 */
const enableApiKey = async () => {
    if ( self_apikey != null && self_apikey != '' && active_apikey_endpoint != null && active_apikey_endpoint != '') {

        try {
            const {id} = jwt.decode(self_apikey);

            const axiosConfig = {
                headers: {'x-apikey': self_apikey},
                method: 'patch',
                url: `${active_apikey_endpoint}${id}`,
                data: {'availability': 'enabled'},
                timeout: 10000,
            }

            const {data} = await axios(axiosConfig);
            apiKeyState = data.availability;    
        }

        catch(exception) {
            logError(`Falló la habilitación de la apikey: ${JSON.stringify(exception)}`)
        }
        

    }
}

module.exports = {
    setApikeys,
    getApikeys,
    getGatewayApikey,
    getSelfApikey,
    setSelfApikey,
    setActiveApiKeyEndpoint,
    enableApiKey,
    isApiKeyCheckingEnabled,
    setIsApiKeyCheckingEnabled,
}

