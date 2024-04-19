/*
    Rutas de Usuarios /current
    host + /api/current
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {getDataUser} = require('../controllers/auth');
const {checkGetDataUser} = require('../middlewares/checkers/users');

const router = Router();

// Obtener datos del usuario en base al email
router.get('/', validateJWT, checkGetDataUser, getDataUser);

module.exports = router;