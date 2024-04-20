/*
    Rutas de Usuarios /token
    host + /api/token
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {
    revalidateToken,
    validateToken} = require('../controllers/token');
const {checkRevalidateToken} = require('../middlewares/checkers/token');

const router = Router();

// Revalidar token
router.post('/', checkRevalidateToken, validateJWT, revalidateToken);

// Check token
router.get('/', validateJWT, validateToken);

module.exports = router;