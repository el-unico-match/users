/*
    Rutas de Usuarios /current
    host + /api/current
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {getDataUser} = require('../controllers/current');

const router = Router();

/**
 * @swagger
 * /api/current:
 *  get:
        summary: get user data
*/
router.get('/', validateJWT, getDataUser);

module.exports = router;