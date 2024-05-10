const mongoose = require('mongoose');
const {sleep} = require('../helpers/sleep');
const MSG_DB_ONLINE = 'USERS: User database is ONLINE: ';
const MSG_RETRY_CONN_DB = `USERS: Retry connecting user database`;
const DELAY_RETRY = 200;

const doDbConnection = async () => {
    let db_cnn = process.env.DB_CNN;
    await mongoose.connect(db_cnn, {});
    console.log(MSG_DB_ONLINE , db_cnn);    
}

const dbConnection = async () => {
    while (true) {
        try {
            await doDbConnection();
            break;        
        } catch (error) {
            console.log(`${MSG_RETRY_CONN_DB}: ${process.env.DB_CNN}`);
        };
        await sleep(DELAY_RETRY);
    }
}

module.exports = {
    dbConnection
}