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
 *              description: return user data and token!
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
 *          400:
 *              description: return error "Incorrect username or password" or "Email has not been entered" or "Email has not been entered"!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: false
 *                              msg:
 *                                  type: object
 *                                  example: The user has been blocked
 *          401:
 *              description: return error "The user has been blocked"!
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
 *                                  example: The user has been blocked
 *          404:
 *              description: return error not found!
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
 *                                  example: The user does not exist
 *          500:
 *              description: return internal error!
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
 *                                  example: Please talk to the administrator
*/
router.get('/', getStatus);

module.exports = router;