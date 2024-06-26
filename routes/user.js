/*
    Rutas de Usuarios /user
    host + /api/user
*/

const {Router} = require('express');
const {getDataUser} = require('../controllers/current');
const {
    validateJWT,
    validateLazyJWT} = require('../middlewares/validateJWT');
const {
    createUser,
    getUser,  
    updateUser, 
    deleteUser} = require('../controllers/user');
const {
    checkCreateUser,
    checkUpdateUser,
    checkDeleteUser,    
    } = require('../middlewares/checkers/user');
const {validateApikeys} = require('../middlewares/validateApikeys');

const router = Router();

router.use(validateApikeys);

/**
 * @swagger
 * /api/user:
 *  post:
 *      summary: creates user
 *      tags: [User]
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
 *              description: user token
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/UserCreateData'
 *      responses:
 *          201: 
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
 *              description: return error "Email is required" or "The password must be at least 6 characters of which at least one must be a number and at least one must be a symbol" or "User lock status is required" or "There is already a user with that email"
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
 *                                  example: Email is required
 *          401:
 *              description: return error "Invalid token" or "You do not have permission to create another user" or "The user does not have permission to create a new administrator"!
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
 *                                  example: "The user does not have permission to create a new administrator"
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
router.post('/',validateLazyJWT, checkCreateUser, createUser);

/**
 * @swagger
 * /api/user/current:
 *  get:
 *      summary: get data from the user associated with the token 
 *      tags: [User]
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
router.get('/current', validateJWT, getDataUser);

/**
 * @swagger
 * /api/user/{id}:
 *  get:
 *      summary: get user data
 *      tags: [User]
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
 *              description: user token
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
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
router.get('/:id', validateJWT, getUser);

/**
 * @swagger
 * /api/user/{id}:
 *  put:
 *      summary: updates user
 *      tags: [User]
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
 *              description: user token
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/UserUpdateData'
 *      responses:
 *          200: 
 *              description: xreturn user data and token!
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
 *              description: return error "There is no token in the request" or "The password must be at least 6 characters of which at least one must be a number and at least one must be a symbol" or "There is already a user with that email" or "The user cannot change their role" or "Invalidad lock state"
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
 *                                  example: There is no token in the request
 *          401:
 *              description: return error "Invalid token" or "User without role" or "You do not have the necessary access level"
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
 *          404:
 *              description: return error "The user does not exist"
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
router.put('/:id', validateJWT, checkUpdateUser, updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *  delete:
 *      summary: delete user
 *      tags: [User]
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
 *              description: user token
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200: 
 *              description: xreturn user data and token!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                  type: boolean
 *                                  example: true                              
 *          400:
 *              description: return error "There is no token in the request" 
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
 *                                  example: There is no token in the request
 *          401:
 *              description: return error "Invalid token" or "User without role" or "You do not have the necessary access level"
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
 *          404:
 *              description: return error "The user does not exist"
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
router.delete('/:id', validateJWT, checkDeleteUser, deleteUser);

module.exports = router;