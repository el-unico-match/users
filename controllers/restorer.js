const {response} = require('express');
const {sendPin} = require('./pin');
const {updateUser} = require('./user');
const TEXT_RESTORE = "Your restore PIN is: ";

/**
 * 
 * @param {*} req: En body email.
 * @description un Pin de recuperación de contraseña al mail. Retorna un token de recuperación.
 */
const sendRestorePin = async (req, res = response) => {
    await sendPin(req, res, TEXT_RESTORE);
}

/**
 * 
 * @param {*} req: En el body el nuevo password y  por header el x-token de recuperación.
 * @description  Retorna los datos del usuario actualizado junto a un token regular.
 */
const verifyPinAndUpdatePassword = async (req, res = response) => {
    updateUser(req, res);
}

module.exports = {
    sendRestorePin,
    verifyPinAndUpdatePassword
}