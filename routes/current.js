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
 *  summary: get user data from token
 *    
*/
router.get('/', validateJWT, getDataUser);

module.exports = router;

/**
 *   parameters:
 *      - name: x-token
 *          in: header
 *          schema:
 *              type: string
 *          required: true
 *          description: user token
 */