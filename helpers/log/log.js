const fs = require("fs");
const moment = require('moment');
const {
    LOG_LEVELS,
    getLogLevel} = require('./logLevel');
const {MSG_LOG_FILE_NOT_EXISTS} = require('../../messages/uncategorized');

const DEFAULT_FILE = "log.txt";
const LOG_FILENAME = process.env.LOG_FILENAME ? process.env.LOG_FILENAME : DEFAULT_FILE;
const LOG_LEVEL = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : LOG_LEVELS.DEBUG.level;
const BUFFER_MAX_LINES = 5000;

let fileStream = null;

let buffer = [];
let linesBuffer = 0;

const initLog = () => {
    try {
        fileStream = fs.createWriteStream(LOG_FILENAME);
        logInfo(`Log init in file ${LOG_FILENAME} with level ${getLogLevel(LOG_LEVEL).tag}`);
    } catch (error) {
        logWarning(`Error on init log in file ${LOG_FILENAME} with level ${LOG_LEVEL}: ${error}`);
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
        const date = moment();
        const messageToLog = `${date} [USERS] ${logLevel.tag}: ${message}`;
            console.log(messageToLog);
        try {
            writeBuffer(messageToLog);
            fileStream.write(`${messageToLog}\n`);
        } catch (error) {
            if (fileStream) {
                console.log(`${date} [USERS] WARNING: ${error}`);
            } else {
                console.log(`${date} [USERS] WARNING: ${MSG_LOG_FILE_NOT_EXISTS} - ${LOG_FILENAME}`);
            }            
        }        
    }
}

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
    if (line > BUFFER_MAX_LINES) {
        linesBuffer = 0;
        buffer = []
    }
    buffer.push(line);
    linesBuffer++;
}

module.exports = {
    logDebug,
    logInfo,
    logError,
    logWarning,
    initLog,
    readLog
}