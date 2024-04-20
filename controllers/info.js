const {response} = require('express');
const User = require('../models/Users');

const getUsers = async (req, res = response) => {
    const users = await User.find();
    //TODO: Dejar de mostrar password
    res.json({
        ok: true,
        users
    })
}

module.exports = {
    getUsers,
}