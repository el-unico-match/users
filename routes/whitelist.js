/*
    Rutas de Estado /apikeys
    host + /api/whitelist
*/

const {Router} = require('express');
const {updateWhitelist} = require('../controllers/whitelist');

const router = Router();

/**
 * @swagger
 * /whitelist:
 *  put:
 *      summary: set o renew apikeys 
 *      tags: [Apikeys]
 *      parameters:
 *          - in: header
 *            name: x-apikey
 *            schema:
 *              type: string
 *              description: admin user token
 *              required: true
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *      responses:
 *          201: 
 *              description: apikeys has been seted or reneweb!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          400:
 *              description: bad request!
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
 *                                  example: "Empty apikey"
 *          503:
 *              description: unavailable service!
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
 *                                  example: unavailable service
*/
router.put('*', updateWhitelist);

module.exports = router;