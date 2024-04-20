/*
    Rutas de Estado /status
    host + /api/status
*/

const {Router} = require('express');
const {getStatus} = require('../controllers/status');

const router = Router();

// Retornar estado del servicio
router.get('/', getStatus);

module.exports = router;