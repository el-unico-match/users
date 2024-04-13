const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
           // useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        console.log('Base de datos de usuarios Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos de usuarios');
    }
}

module.exports = {
    dbConnection
}