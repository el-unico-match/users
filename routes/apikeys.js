/*
    Rutas de Estado /apikeys
    host + /api/apikeys
*/

const {Router} = require('express');
const {setApikeys} = require('../controllers/apikeys');
const {validateJWT} = require('../middlewares/validateJWT');
const {checkSetApikeys} = require('../middlewares/checkers/apikeys');

const router = Router();

/**
 * @swagger
 * /api/apikeys:
 *  post:
 *      summary: set o renew apikeys 
 *      tags: [Apikeys]
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *              type: string
 *              description: admin user token
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Apikeys'
 *      responses:
 *          200: 
 *              description: apikeys has been seted or reneweb!
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
 *                                  $ref: '#/components/schemas/Apikeys'
 *          401:
 *              description: return error "Invalid token" or "You do not have the necessary access level"!
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
 *                                  example: "You do not have the necessary access level"
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
router.post('/', validateJWT, checkSetApikeys, setApikeys);

module.exports = router;