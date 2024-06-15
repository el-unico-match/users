# Usuarios
* Usuario sin token de acceso:
    Crear cliente.
    Iniciar recuperación contraseña.
* Usuario con token de recuperación:
    Validar pin de recuperación.
* Usuario con token de acceso:
    * Rol cliente:
        * Eliminar su usuario.
        * Obtener usuarios.
        * Actualizar su usuario.
        * Consultar datos de un usuario en base a un email en particular
    * Rol administrador:
        * Puede crear y eliminar cualquier tipo de usuario.
        * Obtener lista de usuarios.
        * Actualizar su usuario.
        * Consultar datos de un usuario en base a un email en particular

NOTA: Un usuario cliente no puede pasar a ser administrador y viceversa.

# Base de datos:
```
const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    blocked: {
        type: Boolean,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    } 
});

```

# Instrucciones:

# Ejecución con base de datos remota en Mongo:

1) Se debe disponer de las siguientes variables de entorno para su ejecución:

```
PORT = 4000
DB_CNN=********
SECRET_JWT_SEED=************************

EMAIL_APP = matchunico@gmail.com
PASS_EMAIL_APP = '************************'
SERVICE_EMAIL_APP = Gmail
HOST_EMAIL_APP = smtp.gmail.com
PORT_EMAIL_APP = 465

LOG_FILENAME = "log.txt"
LOGGING_LEVEL = 10
HOST=0.0.0.0

```
Opcionalmente se podrá utilizar el archivo .env (pasado por privado) en la 
raíz del proyecto para configurar dichas variables de entorno.

2) Ejecutar el siguiente comando:

```
docker compose up --build
```

3) Acceder a documentación en el servidor de desarrollo: https://users-uniquegroup-match-fiuba.azurewebsites.net/api-doc/

4) Endpoint GET para testear rápidamente desde un browser si la app funciona correctamente: https://users-uniquegroup-match-fiuba.azurewebsites.net/api/status


# Ejecución sobre base de datos de desarrollo (local):

1) Se debe disponer del archivo ".dev.env" (pasado por privado) en la raíz del proyecto
el cual permite configurar las variables de entorno.

```
PORT = 4000
DB_CNN=mongodb://users_mongo:27017/match_dev
SECRET_JWT_SEED=************************

EMAIL_CHECK_APP = rputaro@fi.uba.ar
USER_APP_EMAIL = **************************
PASS_EMAIL_APP = **************************
SERVICE_EMAIL_APP = Mailgun
HOST_EMAIL_APP = smtp.mailgun.org
PORT_EMAIL_APP = 587

LOG_FILENAME = "log.txt"
LOGGING_LEVEL = 10
HOST=0.0.0.0

```


2) Ejecutar el siguiente comando:

```
docker compose -f dev.docker-compose.yml up --build
```
3) Acceder a documentación en local: http://localhost:<PORT>/api-doc/

Nota: PORT normalmente es 4000 o sea: http://localhost:4000/api-doc/

4) Endpoint GET para testear rápidamente desde un browser si la app funciona correctamente: http://localhost:4000/api/status

5) Covertura de codigo [![Coverage Status](https://coveralls.io/repos/github/el-unico-match/users/badge.svg?branch=main)](https://coveralls.io/github/el-unico-match/users?branch=main)
