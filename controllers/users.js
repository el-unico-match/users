const {response} = require('express');
const User = require('../models/Users');
const {HTTP_SUCCESS_2XX} = require('../helpers/httpCodes');

const getUsers = async (req, res = response) => {
    const users = await User.find({}, {_id:1, email: 1, role:1, blocked:1});
    res.status(HTTP_SUCCESS_2XX.OK).json({
        ok: true,
        users: users
    })
}

module.exports = {
    getUsers,
}