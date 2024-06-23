const {response} = require('express');
const User = require('../models/Users');
const {HTTP_SUCCESS_2XX, HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {responseWithApikey} = require('../helpers/response');
const {
    logWarning,
    logInfo} = require('../helpers/log/log');

/**
 * @description retorna los datos de todos los usuarios
 */
const getUsers = async (req, res = response) => {
    try {
        const users = await User.find({}, {_id:1, email: 1, role:1, blocked:1, verified:1});
        const dataToResponse = {
            ok: true,
            users: users
        };
        responseWithApikey(req, res, "On get users response:", HTTP_SUCCESS_2XX.OK, dataToResponse);
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        logWarning(`On get users: ${error}`);
        responseWithApikey(req, res, "On get users response", HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR, dataToResponse);
    }    
}

module.exports = {
    getUsers,
}