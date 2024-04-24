const {Schema, model} = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              name: 
 *                  type: string
 *                  description: user name
 *              email:
 *                  type: string
 *                  description: unique user email
 *              password:
 *                  type: string
 *                  description: user password
 *              role:
 *                  type: string
 *                  description: cliente or administrador
 *          required: 
 *              - name
 *              - email
 *              - password
 *              - role
 *          example:
 *              name: rafael
 *              email: rafaelputaro@gmail.com
 *              password: rafa123el88*
 *              role: administrador
 */
const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
});

module.exports = model('User', UserSchema);