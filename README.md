# Usuarios
* Usuario sin token:
    Crear cliente.
* Usuario con token:
    * Rol cliente:
        * Eliminar su usuario.
        * Obtener usuarios.
        * Actualizar su usuario.
    * Rol administrador:
        * Puede crear y eliminar cualquier tipo de usuario.
        * Obtener lista de usuarios.
        * Actualizar su usuario.

NOTA: Un usuario cliente no puede pasar a ser administrador y viceversa.

# Base de datos:
```
const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
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
});

module.exports = model('User', UserSchema);
```


# Instrucciones:

Tener el archivo .env (pasado por privado) en la raíz del proyecto.

```
PORT = 4000
DB_CNN=********
SECRET_JWT_SEED=************************
```

# Ejecutar servidor:

docker-compose up --build

# Test en local 2.0 (en contrucción)

docker-compose -f dev.docker-compose.yml up --build