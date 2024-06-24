/*
    Rutas de Estado /log
    host + /api/log
*/

const {Router} = require('express');
const {getLog} = require('../controllers/log');
const {validateApikeys} = require('../middlewares/validateApikeys');

const router = Router();

//router.use(validateApikeys);

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
 *          503:
 *              description: return bad status!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              status:
 *                                  type: object
 *                              msg:
 *                                  type: string
 *                                  example: "The database is not available"
*/
router.get('/', getLog);

module.exports = router;