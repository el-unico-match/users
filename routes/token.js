/*
    Rutas de Usuarios /token
    host + /api/token
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {
    revalidateToken,
    validateToken} = require('../controllers/auth');
const {checkRevalidateToken} = require('../middlewares/checkers/users');

const router = Router();

// Revalidar token
router.post('/', checkRevalidateToken, validateJWT, revalidateToken);

// Check token
router.get('/', validateJWT, validateToken);

module.exports = router;