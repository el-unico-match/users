/*
    Rutas de Estado /status
    host + /api/status
*/

const {Router} = require('express');
const {getStatus} = require('../controllers/status');

const router = Router();

/**
 * @swagger
 * /api/status:
 *  get:
 *      summary: user service status 
 *      tags: [User]
 *      responses:
 *          202: 
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
router.get('/', getStatus);

module.exports = router;