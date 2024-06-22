const {Schema, model} = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
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
 *              verified:
 *                  type: boolean
 *                  description: unique. Indicates whether the user has verified their account.
 *          required:
 *              - email
 *              - password
 *              - role
 *              - blocked
 *              - verified
 *          example:
 *              email: carlos@mail.com
 *              password: cli123te1*
 *              role: cliente
 *              blocked: false
 *              verified: false
 */
const UserSchema = Schema({
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
    },
    verified: {
        type: Boolean,
        required: true
    },
    last_pin: {
        type: String,
        required: false
    } 
});

module.exports = model('User', UserSchema);