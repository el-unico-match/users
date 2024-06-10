const fs = require("fs");
const {LOG_LEVELS} = require('./logLevel');
const {MSG_COULD_NOT_CREATE_LOG_FILE} = require('../../messages/uncategorized');

const DEFAULT_FILE = "log.txt";
const LOG_FILENAME = process.env.LOG_FILENAME ? process.env.LOG_FILENAME : DEFAULT_FILE;
const LOGGING_LEVEL = process.env.LOGGING_LEVEL ? process.env.LOGGING_LEVEL : LOG_LEVELS.DEBUG.level;

let fileStream = null;

const initLog = () => {
    try {
        fileStream = fs.createWriteStream(LOG_FILENAME);
        logInfo(`Log init in file ${LOG_FILENAME} with level ${LOGGING_LEVEL}`);
    } catch (error) {
        logWarning(`Error on init log in file ${LOG_FILENAME} with level ${LOGGING_LEVEL}: ${error}`);
    }
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
        const messageToLog = `[USERS] ${logLevel.tag}: ${message}`;
            console.log(messageToLog);
        try {
            fileStream.write(messageToLog);
        } catch (error) {
            if (fileStream) {
                console.log(`[USERS] WARNING: ${error}`);
            } else {
                console.log(`[USERS] WARNING: ${MSG_COULD_NOT_CREATE_LOG_FILE}`);
            }            
        }        
    }
}

/**
 * 
 * @param {*} logLevel Ejemplo LOG_LEVELS.WARNING
 * @returns True en caso que se deba loguear el nivel parámetro. False en
 * caso contrario
 */
const checkLevel = (logLevel) => {
    return logLevel.level >= LOGGING_LEVEL
}

module.exports = {
    logDebug,
    logInfo,
    logError,
    logWarning,
    initLog
}