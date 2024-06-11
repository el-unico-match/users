const mongoose = require('mongoose');
const {sleep} = require('../helpers/sleep');
const MSG_DB_ONLINE = 'User database is ONLINE';
const MSG_RETRY_CONN_DB = `Retry connecting user database`;
const DELAY_RETRY = 200;
const {
    logDebug,
    logInfo,
    logWarning} = require('../helpers/log/log');

const doDbConnection = async () => {
    let db_cnn = process.env.DB_CNN;
    logDebug(`On init database conection: ${db_cnn}`);
    await mongoose.connect(db_cnn, {});
    logInfo(`${MSG_DB_ONLINE}`);    
}

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

module.exports = {
    dbConnection
}