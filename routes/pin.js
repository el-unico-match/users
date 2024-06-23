/*
    Rutas de Usuarios /user
    host + /api/pin
*/

const {Router} = require('express');
const {validatePinJWT} = require('../middlewares/validateJWT');
const {checkSendPin} = require('../middlewares/checkers/pin');
const {
    sendVerificationPin,
    verifyPin} = require('../controllers/pin');
const {validateApikeys} = require('../middlewares/validateApikeys');

const router = Router();

router.use(validateApikeys);

/**
 * @swagger
 * /api/pin/:
 *  post:
 *      summary: init user's verification
 *      tags: [User Verification]
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
 *              description: returns applicant credentials and token for verification. Also send the verification email!
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
*/
router.post('/', checkSendPin, sendVerificationPin);

/**
 * @swagger
 * /api/pin/{pin}:
 *  post:
 *      summary: check pin a verificate the user
 *      tags: [User Verification]
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
*/
router.post('/:pin', validatePinJWT, verifyPin);

module.exports = router;