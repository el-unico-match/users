const jwt = require('jsonwebtoken');
const EXPIRE_IN = '5m';
const MSG_TOKEN_COULD_NOT_BE_GENERATED = "Token could not be generated";

const generateJWT = (uid, name, email, role, blocked) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            name,
            email,
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

module.exports = {
    generateJWT
}