/*
    Rutas de Estado /log
    host + /api/log
*/

const {Router} = require('express');
const {getLog} = require('../controllers/log');
const {validateJWT} = require('../middlewares/validateJWT');
const {validateApikeys} = require('../middlewares/validateApikeys');
const {checkGetLog} = require('../middlewares/checkers/log');

const router = Router();

router.use(validateApikeys);

/**
 * @swagger
 * /api/log:
 *  get:
 *      summary: return microservice log 
 *      tags: [Log]
 *      parameters:
 *          - in: header
 *            name: x-apikey
 *            schema:
 *              type: string
 *              required: false
 *              description: gateway apikey
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: admin token
 *      responses:
 *          200: 
 *              description: aplication status!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: true
 *                              status:
 *                                  type: object
 *          401:
 *              description: return error "Invalid token" 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: string
 *                                  example: "Invalid token"
 *          503:
 *              description: service not available! "Invalidad Apikey" or "The apikeys does not match"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: string
 *                                  example: "Invalidad Apikey"
*/
router.get('/', validateJWT, checkGetLog, getLog);

module.exports = router;