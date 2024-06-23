const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config');
const {initLog,
    logInfo
} = require('./helpers/log/log');

// Importar y configurar variables de entorno
require('dotenv').config();

// Inicializar log
initLog();

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
                url: `https://users-uniquegroup-match-fiuba.azurewebsites.net`
            },
            {
                url: `http://${process.env.HOST}:${process.env.PORT}`
            }
        ]
    },
    apis: [
        `${path.join(__dirname, "./routes/*.*")}`,
        `${path.join(__dirname, "./models/*.*")}`
    ]
};

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
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));
logInfo(`Swagger running: ${JSON.stringify(swaggerSpec)}`);
// Rutas Usuario
app.use('/api/user', require('./routes/user'));
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/login'));
app.use('/api/token', require('./routes/token'));
app.use('/api/status', require('./routes/status'));
app.use('/api/restorer', require('./routes/restorer'));
app.use('/api/pin', require('./routes/pin'));
app.use('/api/apikeys', require('./routes/apikeys'));
//app.use('/api/log', require('./routes/log'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    logInfo(`Api REST USERS running on ${process.env.HOST}:${process.env.PORT}`);
});

