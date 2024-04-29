/*
    Rutas de Usuarios /token
    host + /api/token
*/

const {Router} = require('express');
const {validateJWT} = require('../middlewares/validateJWT');
const {checkAccessBlocked} = require('../middlewares/validateAccess')
const {
    revalidateToken,
    validateToken} = require('../controllers/token');
const {checkRevalidateToken} = require('../middlewares/checkers/token');

const router = Router();

/**
 * @swagger
 * /api/token:
 *  post:
 *      summary: revalite token
 *      tags: [User]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              required: true
 *              description: user token
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
 *                              user:
 *                                  type: object
 *                                  $ref: '#/components/schemas/UserSharedData'
 *                              token:
 *                                  type: string
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjJkMGMxMzRmMjA5MTk5ZDJmMjc0YTMiLCJuYW1lIjoicmFmYWVsIiwiaWF0IjoxNzE0MjUxMjUxLCJleHAiOjE3MTQyNTg0NTF9.ky8davH_RhQrscgs4k3dnLXJPB5mrdD6RVmWtv5dqUA
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
router.post('/', checkAccessBlocked, checkRevalidateToken, validateJWT, revalidateToken);

// Check token
router.get('/', checkAccessBlocked, validateJWT, validateToken);

module.exports = router;