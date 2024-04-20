const {response} = require('express');
const {generateJWT} = require('../helpers/jwt')

const revalidateToken = async (req, res = response) => {
    const {uid, name, email} = req;
    // Generar el JWT (Java Web Token)
    const token = await generateJWT(uid, name);
    res.status(200).json({
        ok: true,
        token
    });
}

const validateToken = async (req, res = response) => {
    res.status(200).json({
        ok: true
    });
}

module.exports = {
    revalidateToken,
    validateToken
}