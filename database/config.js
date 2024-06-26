const mongoose = require('mongoose');
const {sleep} = require('../helpers/sleep');
const MSG_DB_ONLINE = 'User database is ONLINE';
const MSG_RETRY_CONN_DB = `Retry connecting user database`;
const DELAY_RETRY = 200;
const {
    logDebug,
    logInfo,
    logWarning} = require('../helpers/log/log');
const {MSG_DATABASE_ERROR} = require('../messages/uncategorized');
const User = require('../models/Users');

/**
 * @description inicia efectivamente la conexión a la base de datos
 */
const doDbConnection = async () => {
    let db_cnn = process.env.DB_CNN;
    const toLog = db_cnn.slice(0, 5);
    logDebug(`On init database conection: ${toLog}...`);
    await mongoose.connect(db_cnn, {});
    logInfo(`${MSG_DB_ONLINE}`);    
}

/**
 * @description inicia la conexión a la base de datos
 */
const dbConnection = async () => {
    while (true) {
        try {
            await doDbConnection();
            break;        
        } catch (error) {
            logWarning(`${MSG_RETRY_CONN_DB}: ${process.env.DB_CNN}`)
        };
        await sleep(DELAY_RETRY);
    }
}

/**
 * 
 * @description retorna el estado de la conexión con la base de datos 
 */
const statusDb = async () => {
    let users = null;
    try {
        users = await User.find();
        return {
            online: users.length > 0
        }
    } catch (error) {
        return {
            online: false,
            detail: MSG_DATABASE_ERROR
        }
    }        
}

module.exports = {
    dbConnection,
    statusDb
}