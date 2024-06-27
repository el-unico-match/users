# Microservicio de Usuarios 
[![Coverage Status](https://coveralls.io/repos/github/el-unico-match/users/badge.svg?branch=main)](https://coveralls.io/github/el-unico-match/users?branch=main)

<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO7xgbQ4sbzFsJ3kVavbsrOykzl4IF4w0arg&s" alt="User"></center>

La responsabilidad de este microservicio esta dada por la autenticación de usuarios y las operaciones asociados a esto, como la verificación de usuario por PIN y tanto la actualización como el restablecimiento de contraseñas. Así mismo respalda el rol del usuario (cliente o administrador) y habilita la posibilidad de bloqueo o desbloqueo del mismo para el logueo en la plataforma.

## Usuarios
<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDN5ie3jf7dQdm76qXoLbm3p3AqaFABa0kTw&s" alt="Client or Admin"></center>


* Usuario sin token de acceso puede:
    * Crear cliente.
    * Iniciar recuperación contraseña.
* Usuario con token de recuperación puede:
    * Validar pin de recuperación.
    * Recuperar contraseña.
* Usuario con token de acceso puede:
    * Rol cliente:
        * Eliminar su usuario.
        * Obtener usuarios.
        * Actualizar su usuario.
        * Consultar datos de un usuario en base a un email en particular.
    * Rol administrador:
        * Puede crear y eliminar cualquier tipo de usuario.
        * Obtener lista de usuarios.
        * Actualizar su usuario.
        * Consultar datos de un usuario en base a un email en particular.
        * Bloquear y desbloquear usuarios.
        * Leer el log.

**NOTA: Un usuario cliente no puede pasar a ser administrador y viceversa.**

## Base de datos:

<center><image src="https://1000marcas.net/wp-content/uploads/2021/06/MongoDB-Logo-500x313.png" alt="Mongo DB"></center>


Se utiliza una base de datos de usuarios en Mongo bajo el siguiente esquema:

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
    last_pin: {
        type: String,
        required: false
    } 
});

```

## Verificación de usuario:

<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL5VirLFw_JeBtL_BaKSjKQg96ZFMBkyk7rw&s" alt="Verificación usuario"></center>


Para la verificación de usuarios se dispone de un endpoint que inicializa este proceso mediante el password del mismo, de manera tal que siendo este un usuario válido en el sistema se responde con un token de recuperación a la app-móvil el cual es utilizado junto a un PIN de recuperación de único uso enviado por email al usuario correspondiente.

## Recuperación de contraseña:
<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcLdG8PD7Fyx6pSFbTzs06G8BQaAdqC6w6qg&s" alt="Recuperación de contraseña"></center>



En la recuperación de contraseñas se utilizan deep-links de Android para generar enlaces a una pantalla de actualización de contraseña de la app móvil bajo el siguiente formato:
```
https://el-unico-match.github.io/?token=<token>&pin=<pin>

```
Donde los query-params **"token"** y **"pin"** son utilizados en el endpoint de restauración como header y  path-param respectivamente, siendo estos de único uso gracias a que el último **PIN** utilizado se respalda en la base de datos como **"last_pin"** para su posterior chequeo.

## Apikeys
<center><image src="https://cdn.iconscout.com/icon/premium/png-256-thumb/api-key-5388573-4524213.png?f=webp" alt="Apikeys"></center>


Se utilizan apikeys en una whitelist encriptadas como JWT. En caso de encontrarse activado el chequeo por apikeys se podrán realizar únicamente las siguientes operaciones sin remitir las mismas al endpoint correspondiente, permitiendo el acceso de administradores:

* Login de usuario.
* Renovación de token.
* Actualización de apikeys.

## Liberías utilizadas:
<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSJscx615heuSsv1tw02aEq7gBPkLohEBuxw&s" alt="Nodejs"></center>

* Framework Express: https://www.npmjs.com/package/express
* Validación de request's Express-Validator: https://www.npmjs.com/package/express-validator 
* Encriptado de contraseñas Bcrypt: https://www.npmjs.com/package/bcrypt
* Encriptado/desencriptado de tokens y apikeys JWT: 
    * https://www.npmjs.com/package/jsonwebtoken
    * https://www.npmjs.com/package/jwt-decode
* Base de datos Mongoose: https://www.npmjs.com/package/mongoose
* Envío de emails Nodemailer con una cuenta de Gmail: https://www.npmjs.com/package/nodemailer
* Documentación de endpoints Swagger-Jsdoc: https://www.npmjs.com/package/swagger-jsdoc
* Manejo de formatos de tiempo Moment: https://www.npmjs.com/package/moment
* Test's automáticos JEST: https://jestjs.io/docs/getting-started 

## Características de Android utilizadas:

<center><image src="https://www.tuprogramacion.com/images/topics/00002/thumb.jpg" alt="Android"></center>

* Deep-links: https://developer.android.com/training/app-links/deep-linking?hl=es-419

## Documentación de los endpoints en Swagger:

<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_9WelGnPrPva68rnqGLSPDnb-wNIAgv7ziQ&s" alt="Swagger"></center>


Enlace: https://users-uniquegroup-match-fiuba.azurewebsites.net/api-docs/

# Instrucciones:


## Ejecución con base de datos remota en Mongo:

<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjl2QNIUw2URsMWFQ1PoiLOD-JhD7laaLRRA&s" alt="Mongo Atlas"></center>


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
LOG_LEVEL = 10
HOST=0.0.0.0

APIKEY_WHITELIST="<apikey0> <apykey1> <apikey2>"
APIKEY_VALUE="<apikey local>
APIKEY_ACTIVATE_ENDPOINT=<endpoint services>
IS_APIKEY_CHECKING_DISABLED=true
```
Opcionalmente se podrá utilizar el archivo .env (pasado por privado) en la 
raíz del proyecto para configurar dichas variables de entorno.

NOTA: IS_APIKEY_CHECKING_DISABLED permite no utilizar chequeo con apikey en pruebas locales.

2) Ejecutar el siguiente comando:

```
docker compose up --build
```

3) Acceder a documentación en el servidor de desarrollo: http://localhost:4000/api-docs/

**NOTA: Para correr el endpoint local debe asegurarse que el menú desplegable "Servers" se encuentre en local **

4) Endpoint GET para testear rápidamente desde un browser si la app funciona correctamente: http://localhost:4000/api/status


## Ejecución sobre base de datos de desarrollo (local):

<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTidRfs7wM4fzKregUCCPt7FxazCGGNnQwkqCb2pz-rGWwkBsZFS76mqWrpu2q8I9A_1H4&usqp=CAU" alt="Local DB"></center>

1) Se debe disponer del archivo ".dev.env" (pasado por privado) en la raíz del proyecto
el cual permite configurar las variables de entorno.

```
PORT = 4000
DB_CNN=mongodb://users_mongo:27017/match_dev
SECRET_JWT_SEED=************************

EMAIL_APP = matchunico@gmail.com
PASS_EMAIL_APP = '************************'
SERVICE_EMAIL_APP = Gmail
HOST_EMAIL_APP = smtp.gmail.com
PORT_EMAIL_APP = 465

LOG_FILENAME = "log.txt"
LOG_LEVEL = 10
HOST=0.0.0.0

APIKEY_WHITELIST="<apikey0> <apykey1> <apikey2>"
APIKEY_VALUE="<apikey local>
APIKEY_ACTIVATE_ENDPOINT=<endpoint services>
IS_APIKEY_CHECKING_DISABLED=true
```
NOTA: IS_APIKEY_CHECKING_DISABLED permite no utilizar chequeo con apikey en pruebas locales.

2) Ejecutar el siguiente comando:

```
docker compose -f dev.docker-compose.yml up --build
```
3) Acceder a documentación en local: http://localhost:\<PORT\>/api-docs/

Nota 1: PORT normalmente es 4000 o sea: http://localhost:4000/api-docs/

NOTA 2: Para correr el endpoint local debe asegurarse que el menú desplegable "Servers" se encuentre en local


4) Endpoint GET para testear rápidamente desde un browser si la app funciona correctamente: http://localhost:4000/api/status

## Testing
<center><image src="https://cdn-icons-png.flaticon.com/256/1581/1581882.png" alt="Local DB"></center>



Ejecutar las siguientes instrucciones en consola:

```
npm install

npm test

```