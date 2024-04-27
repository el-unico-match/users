const {response} = require('express');
const User = require('../models/Users');
const {HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
const {MSG_DATABASE_ERROR} = require('../messages/uncategorized');

const getStatus = async (req, res = response) => {
    try {
        let users = await User.find();
        res.json({
            ok: true,
            count: users.length
        })
    } catch(error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
            ok: false,
            msg: MSG_DATABASE_ERROR
        })
    }
}

module.exports = {
    getStatus,
}