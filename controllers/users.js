const {response} = require('express');
const User = require('../models/Users');
const {HTTP_SUCCESS_2XX, HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {
    logWarning,
    logInfo} = require('../helpers/log/log');

const getUsers = async (req, res = response) => {
    try {
        const users = await User.find({}, {_id:1, email: 1, role:1, blocked:1, verified:1});
        const dataToResponse = {
            ok: true,
            users: users
        };
        logInfo(`On get users response: ${HTTP_SUCCESS_2XX.OK}; ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SUCCESS_2XX.OK).json(dataToResponse);
    } catch (error) {
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500
        };
        logWarning(`On get users: ${error}`);
        logInfo(`On get users response: ${HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR}; ${JSON.stringify(dataToResponse)}`);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json(dataToResponse);   
    }    
}

module.exports = {
    getUsers,
}