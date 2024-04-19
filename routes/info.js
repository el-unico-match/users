/*
    Rutas de Usuarios /info
    host + /api/info
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {getUsers} = require('../controllers/auth');

const router = Router();

// Obtener usuarios
router.get('/', validateJWT, getUsers);

module.exports = router;