/*
    Rutas de Estado /status
    host + /api/status
*/

const {Router} = require('express');
const {getStatus} = require('../controllers/status');
const {validateApikeys} = require('../middlewares/validateApikeys');
 
const router = Router();

router.use(validateApikeys);

/**
 * @swagger
 * /status:
 *  get:
 *      summary: user service status 
 *      parameters:
 *          - in: header
 *            name: x-apikey
 *            schema:
 *              type: string
 *              required: false
 *              description: gateway apikey
 *      tags: [User]
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
router.get('/', getStatus);

module.exports = router;