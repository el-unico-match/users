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
app.use('/api/current', require('./routes/current'));
app.use('/api/edit', require('./routes/edit'));
app.use('/api/info', require('./routes/info'));
app.use('/api/login', require('./routes/login'));
app.use('/api/token', require('./routes/token'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Api REST USUARIOS corriendo en ${process.env.HOST}:${process.env.PORT}`);
});

