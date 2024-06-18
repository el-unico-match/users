const jwt = require('jsonwebtoken');
const {logWarning} = require('./log/log');
const EXPIRE_IN = '5m';
const PIN_EXPIRE_IN = '20m';
const MSG_TOKEN_COULD_NOT_BE_GENERATED = "Token could not be generated";

/**
 * 
 * @description Genera el JWT según los parámetros
 */
const generateJWT = (uid, role, blocked) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            role,
            blocked
        }
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: EXPIRE_IN
        }, (error, token) => {
            if (error) {
                logWarning(`On generate JWT: ${error}`);
                reject(MSG_TOKEN_COULD_NOT_BE_GENERATED)
            }
            resolve(token)
        });
    });
}

/**
 * 
 * @description Genera el JWT según los parámetros
 */
const generatePinJWT = (id, email, pin) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id,
            email,
            pin
        }
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: PIN_EXPIRE_IN
        }, (error, token) => {
            if (error) {
                logWarning(`On generate Pin JWT: ${error}`);
                reject(MSG_TOKEN_COULD_NOT_BE_GENERATED)
            }
            resolve(token)
        });
    });
}

module.exports = {
    generateJWT,
    generatePinJWT
}