const {response} = require('express');
const User = require('../models/Users');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_USER_NOT_EXISTS} = require('../messages/auth');

const getDataUser = async (req, res = response) => {
    const userId = req.uid;
    try {
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            })
        }
        res.json({
            ok: true,
            msg: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: MSG_ERROR_500
        });
    }
}

module.exports = {
    getDataUser
}