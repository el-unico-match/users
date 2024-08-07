const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config');
const {logInfo} = require('./helpers/log/log');

// Importar y configurar variables de entorno
require('dotenv').config();
const {setApikeys, setSelfApikey, setActiveApiKeyEndpoint, enableApiKey} = require('./helpers/apikeys')
setApikeys(process.env.APIKEY_WHITELIST.split(' '));
setSelfApikey(process.env.APIKEY_VALUE);
setActiveApiKeyEndpoint(process.env.APIKEY_ACTIVATE_ENDPOINT);
enableApiKey();

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
                url: `https://br-users-uniquegroup-match-fiuba.azurewebsites.net`
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
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));
logInfo(`Swagger running: ${JSON.stringify(swaggerSpec)}`);
// Rutas Usuario
app.use('/api/user', require('./routes/user'));
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/login'));
app.use('/api/token', require('./routes/token'));
app.use('/status', require('./routes/status'));
app.use('/api/restorer', require('./routes/restorer'));
app.use('/api/pin', require('./routes/pin'));
app.use('/whitelist', require('./routes/whitelist'));
app.use('/api/log', require('./routes/log'));

// Escuchar peticiones
app.listen(process.env.PORT, process.env.HOST, () => {
    logInfo(`Api REST USERS running on ${process.env.HOST}:${process.env.PORT}`);
});

