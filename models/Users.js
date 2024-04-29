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
 *                  description: unique user name
 *                  minLength: 5
 *              email:
 *                  type: string
 *                  description: unique user email
 *              password:
 *                  type: string
 *                  description: user password. Numbers, letters and at least one symbol
 *                  minLength: 6
 *              role:
 *                  type: string
 *                  description: role in the system
 *                  enum: [administrador, cliente]
 *              blocked:
 *                  type: boolean
 *                  description: unique. Disables the service for the user.
 *          required: 
 *              - name
 *              - email
 *              - password
 *              - role
 *              - blocked
 *          example:
 *              name: carlos
 *              email: carlos@mail.com
 *              password: cli123te1*
 *              role: cliente
 *              blocked: false
 *      UserSharedData:
 *          type: object
 *          properties:
 *              uid:
 *                  type: string
 *                  description: unique user id 
 *              name: 
 *                  type: string
 *                  description: unique user name
 *                  minLength: 5
 *              email:
 *                  type: string
 *                  description: unique user email              
 *              role:
 *                  type: string
 *                  description: cliente or administrador
 *                  enum: [administrador, cliente]
 *              blocked:
 *                  type: boolean
 *                  description: unique. Disables the service for the user.
 *          required: 
 *              - name
 *              - email
 *              - password
 *              - role
 *              - blocked
 *          example:
 *              id: 645547541243dfdsfe2132142134234203
 *              name: rafael
 *              email: rafaelputaro@gmail.com
 *              role: administrador
 *              blocked: false
 *      UserUpdateData:
 *          type: object
 *          properties:
 *              name: 
 *                  type: string
 *                  description: unique user name
 *                  minLength: 5
 *              email:
 *                  type: string
 *                  description: unique user email              
 *              password:
 *                  type: string
 *                  description: user password. Numbers, letters and at least one symbol
 *                  minLength: 6
 *              blocked:
 *                  type: boolean
 *                  description: unique. Disables the service for the user.
 *          example:
 *              name: carlos
 *              email: carlos@mail.com
 *              password: cli123te1*
 *              blocked: false
 */
const UserSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    blocked: {
        type: Boolean,
        required: true
    }

});

module.exports = model('User', UserSchema);