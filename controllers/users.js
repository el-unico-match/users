const {response} = require('express');
const User = require('../models/Users');
const {HTTP_SUCCESS_2XX} = require('../helpers/httpCodes');

const getUsers = async (req, res = response) => {
    const users = await User.find();
    res.status(HTTP_SUCCESS_2XX.OK).json({
        ok: true,
        users: users
    })
}

module.exports = {
    getUsers,
}