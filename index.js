const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config');

// Importar y configurar variables de entorno
require('dotenv').config();

// Paths
const path = require("path");

// Configuración Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Users API",
            version: "1.0.0"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`
            }
        ]
    },
    apis: [
        `${path.join(__dirname, "./routes/*.js")}`,
        `${path.join(__dirname, "./models/*.js")}`
    ]
}

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

// Ruta Swagger
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))
// Rutas Usuario
app.use('/api/current', require('./routes/current'));
app.use('/api/edit', require('./routes/edit'));
app.use('/api/info', require('./routes/info'));
app.use('/api/login', require('./routes/login'));
app.use('/api/token', require('./routes/token'));
app.use('/api/status', require('./routes/status'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Api REST USUARIOS corriendo en ${process.env.HOST}:${process.env.PORT}`);
});

