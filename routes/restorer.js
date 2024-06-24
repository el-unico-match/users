/*
    Rutas de Usuarios /user
    host + /api/restorer
*/

const {Router} = require('express');
const {validatePinJWT} = require('../middlewares/validateJWT');
const {
    sendRestorePin,
    verifyPinAndUpdatePassword} = require('../controllers/restorer');
const {checkSendPin} = require('../middlewares/checkers/pin');
const {checkUpdatePassword} = require('../middlewares/checkers/restorer')
const {validateApikeys} = require('../middlewares/validateApikeys');

const router = Router();

router.use(validateApikeys);

/**
 * @swagger
 * /api/restorer/:
 *  post:
 *      summary: init password restore
 *      tags: [Restorer]
 *      parameters:
 *          - in: header
 *            name: x-apikey
 *            schema:
 *              type: string
 *              required: false
 *              description: gateway apikey
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: rputaro@fi.uba.ar
 *      responses:
 *          201: 
 *              description: return applicant credentials and token for restoration!
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
 *                                  properties:
 *                                      email:
 *                                          type: string
 *                              token:
 *                                  type: string
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjJkMGMxMzRmMjA5MTk5ZDJmMjc0YTMiLCJuYW1lIjoicmFmYWVsIiwiaWF0IjoxNzE0MjUxMjUxLCJleHAiOjE3MTQyNTg0NTF9.ky8davH_RhQrscgs4k3dnLXJPB5mrdD6RVmWtv5dqUA
 *          400:
 *              description: return error "Email is required"
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
router.post('/', checkSendPin, sendRestorePin);

/**
 * @swagger
 * /api/restorer/{pin}:
 *  post:
 *      summary: checks pin and restore password
 *      tags: [Restorer]
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
 *            name: pin
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          password:
 *                              type: string
 *                              example: cli123te1**
 *      responses:
 *          200: 
 *              description: return user data and regular token!
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
 *              description: return error "pin is required" or "password is required"
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
 *                                  example: Pin is required
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
router.post('/:pin', validatePinJWT, checkUpdatePassword, verifyPinAndUpdatePassword);

module.exports = router;