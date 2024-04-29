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
 *                              count_users:
 *                                  type: integer
 *                                  example: 1
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
 *                              msg:
 *                                  type: string
 *                                  example: "The database is not available"
*/
router.get('/', getStatus);

module.exports = router;