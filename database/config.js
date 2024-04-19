const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        let db_cnn = process.env.DB_CNN;
        await mongoose.connect(db_cnn, {
           // useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        console.log('Base de datos de usuarios Online: ', db_cnn);
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos de usuarios');
    }
}

module.exports = {
    dbConnection
}