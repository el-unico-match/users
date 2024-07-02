const moment = require('moment');
const {
    LOG_LEVELS,
    getLogLevel} = require('./logLevel');
const LOG_LEVEL = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : LOG_LEVELS.DEBUG.level;
const BUFFER_MAX_LINES = 5000;
const LINES_TO_REMOVE = BUFFER_MAX_LINES/4;

let buffer = [];
let linesBuffer = 0;

/**
 * @description Iniciar el log en el nivel y el archivo establecidos en las variables de entorno.
 */
const initLog = () => {
    logInfo(`Init log with level ${getLogLevel(LOG_LEVEL).tag}`);
}

/**
 * 
 * Rerporte de una dato específico como por ejemplo los datos para conectarse con la base
 * de datos.
 */
const logDebug = (message) => {
    writeLog(LOG_LEVELS.DEBUG, message);
}

/**
 * 
 * Trazar la historia de entidades, por ejemplo una respuesta enviada.
 */
const logInfo = (message) => {
    writeLog(LOG_LEVELS.INFO, message);
}

/**
 * 
 * Errores que permiten continuar manteniendo las funcionalidades básicas del sistema.
 * Por ejemplo Mal uso de una API. 
 */
const logWarning = (message) => {
    writeLog(LOG_LEVELS.WARNING, message);
}

/**
 * 
 * Errores que no permiten continuar con el funcionamiento del sistema. Por ejemplo
 * fallo en la conexión con la base de datos.
 */
const logError = (message) => {
    writeLog(LOG_LEVELS.ERROR, message);
}

const writeLog = (logLevel, message) => {
    if (checkLevel(logLevel)) {
        const date = moment();
        const messageToLog = `${date} [USERS] ${logLevel.tag}: ${message}`;
        console.log(messageToLog);
        writeBuffer(messageToLog);
    }
}

/**
 * 
 * @returns el logo como un array
 */
const readLog = () => {
    return buffer;
}

/**
 * 
 * @param {*} logLevel Ejemplo LOG_LEVELS.WARNING
 * @returns True en caso que se deba loguear el nivel parámetro. False en
 * caso contrario
 */
const checkLevel = (logLevel) => {
    return logLevel.level >= LOG_LEVEL
}

const writeBuffer = (line) => {
    if (linesBuffer > BUFFER_MAX_LINES) {
        linesBuffer -= LINES_TO_REMOVE;
        buffer.splice(0, LINES_TO_REMOVE);
    }
    buffer.push(line);
    linesBuffer++;
}

initLog();

module.exports = {
    logDebug,
    logInfo,
    logError,
    logWarning,
    readLog
}