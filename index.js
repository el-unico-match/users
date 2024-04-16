const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config');

// Importar y configurar variables de entorno
require('dotenv').config();

// Crear servidor express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio público
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Api REST USUARIOS corriendo en el puerto ${process.env.PORT}`);
});

