/*
    Rutas de Usuarios /current
    host + /api/current-user
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {getDataUser} = require('../controllers/current');

const router = Router();

/**
 * @swagger
 * /api/current-user:
 *  get:
 *      summary: get data from the user associated with the token 
 *      tags: [User]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
 *      responses:
 *          200: 
 *              description: return user data!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: true
 *                              user:
 *                                  type: object
 *                                  $ref: '#/components/schemas/UserSharedData'
 *          400:
 *              description: return error no token!
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
 *                                  example: There is no token in the request
 *          401:
 *              description: return error invalid token!
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
 *                                  example: Invalid token
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
router.get('/', validateJWT, getDataUser);

module.exports = router;
