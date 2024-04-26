/*
    Rutas de Usuarios /token
    host + /api/token
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {checkAccessBlocked} = require('../middlewares/validateAccess')
const {
    revalidateToken,
    validateToken} = require('../controllers/token');
const {checkRevalidateToken} = require('../middlewares/checkers/token');

const router = Router();

// Revalidar token
router.post('/', checkAccessBlocked, checkRevalidateToken, validateJWT, revalidateToken);

// Check token
router.get('/', checkAccessBlocked, validateJWT, validateToken);

module.exports = router;