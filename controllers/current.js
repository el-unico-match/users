const {response} = require('express');
const User = require('../models/Users');
const {
    logWarning, 
    logInfo} = require('../helpers/log/log');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_USER_NOT_EXISTS} = require('../messages/auth');
const {HTTP_SUCCESS_2XX, HTTP_SERVER_ERROR_5XX, HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');

/**
 * 
 * @param {*} req Se espera que tenga el x-token como header.
 * @description Se retornan los datos del usuario correspondiente al header.
 */
const getDataUser = async (req, res = response) => {
    try {
        const userId = req.tokenExtractedData.uid;
        const user = await User.findOne({_id: userId}, {_id: 1, email: 1, role:1, blocked:1, verified:1});
        if (!user) {
            logWarning(`On current user the user was not found: ${JSON.stringify(req.tokenExtractedData)}`);
            const dataToResponse = {
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            }
            logInfo(`On current response: ${JSON.stringify(dataToResponse)}`);
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json(dataToResponse);
        }
        const dataToResponse = {
            ok: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                blocked: user.blocked,
                verified: user.verified
            }
        }
        logInfo(`On current response: ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SUCCESS_2XX.OK).json(dataToResponse);
    } catch (error) {
        logWarning(`On get data user: ${error}`);
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        }
        logInfo(`On get data user response: ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json(dataToResponse);
    }
}

module.exports = {
    getDataUser
}