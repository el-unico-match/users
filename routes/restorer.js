/*
    Rutas de Usuarios /user
    host + /api/restorer
*/

const {Router} = require('express');
const {validateRestoreJWT} = require('../middlewares/validateJWT');
const {
    restorePassword, 
    verifyPin} = require('../controllers/restorer');
const {checkRestorePassword} = require('../middlewares/checkers/restorer');

const router = Router();

/**
 * @swagger
 * /api/restorer/password:
 *  post:
 *      summary: init password restore
 *      tags: [Restorer]
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
 *                          cellphone:
 *                              type: string
 *                              example: '+5491159822953'
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
 *                                      cellphone:
 *                                          type: string
 *                              token:
 *                                  type: string
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjJkMGMxMzRmMjA5MTk5ZDJmMjc0YTMiLCJuYW1lIjoicmFmYWVsIiwiaWF0IjoxNzE0MjUxMjUxLCJleHAiOjE3MTQyNTg0NTF9.ky8davH_RhQrscgs4k3dnLXJPB5mrdD6RVmWtv5dqUA
 *          400:
 *              description: return error "Email is required" or "Invalid cellphone"
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
*/
router.post('/password', checkRestorePassword, restorePassword);

/**
 * @swagger
 * /api/restorer/pin/{pin}:
 *  post:
 *      summary: check pin
 *      tags: [Restorer]
 *      parameters:
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
 *      responses:
 *          200: 
 *              description: xreturn user data and token for update password!
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
 *              description: return error "pin is required"
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
router.post('/pin/:pin', validateRestoreJWT, verifyPin);

module.exports = router;