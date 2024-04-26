/*
    Rutas de Usuarios /users
    host + /api/users
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {getUsers} = require('../controllers/users');

const router = Router();

// Obtener usuarios
router.get('/', validateJWT, getUsers);

module.exports = router;