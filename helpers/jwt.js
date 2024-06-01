const jwt = require('jsonwebtoken');
const EXPIRE_IN = '5m';
const RESTORE_EXPIRE_IN = '20m';
const MSG_TOKEN_COULD_NOT_BE_GENERATED = "Token could not be generated";

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
                console.log(error);
                reject(MSG_TOKEN_COULD_NOT_BE_GENERATED)
            }
            resolve(token)
        });
    });
}

const generateRestoreJWT = (email, pin) => {
    return new Promise((resolve, reject) => {
        const payload = {
            pin,
            email
        }
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: RESTORE_EXPIRE_IN
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject(MSG_TOKEN_COULD_NOT_BE_GENERATED)
            }
            resolve(token)
        });
    });
}

module.exports = {
    generateJWT,
    generateRestoreJWT
}