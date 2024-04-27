/**
 *  @returns {object} Los tipos de códigos de respuesta HTTP exitosa
*/
const HTTP_SUCCESS_2XX = Object.freeze({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORIZED_INFORMATION: 203,
    // No existe contenido
    NO_CONTENT_TO_RETURN: 204, 
});

/**
 *  @returns {object} Los tipos de códigos de respuesta HTTP de error del cliente
*/
const HTTP_CLIENT_ERROR_4XX = Object.freeze({
    // Petición mal formada
    BAD_REQUEST: 400, 
    // Carece de autorización p/acceder al contenido
    UNAUTHORIZED: 401, 
    // Pago requerido
    PAYMENT_REQUIRED: 402, 
    // Se ha entendido la petición pero se rechaza enviar respuesta
    FORBIDDEN: 403,
    // No se encontró y no se sabe si alguna vez existió 
    NOT_FOUND: 404, 
    // Por ejemplo el contenido del body no es el requerido
    UNPROCESSABLE_CONTENT: 422
});

/**
 *  @returns {object} Los tipos de códigos de respuesta HTTP de errores del servidor
*/
const HTTP_SERVER_ERROR_5XX = Object.freeze({
    // Condición inesperada
    INTERNAL_SERVER_ERROR: 500,
    // Funcionalidad no implementada
    NOT_IMPLEMENTED: 501,
    // Un servicio que no esta disponible
    SERVICE_NOT_AVAILABLE: 503
});

module.exports = {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX,
}