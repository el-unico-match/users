const {response} = require('express');
const User = require('../models/Users');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_USER_NOT_EXISTS} = require('../messages/auth');
const {HTTP_SUCCESS_2XX, HTTP_SERVER_ERROR_5XX, HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');

const getDataUser = async (req, res = response) => {
    const userId = req.uid;
    try {
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            })
        }
        res.status(HTTP_SUCCESS_2XX.OK).json({
            ok: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                blocked: user.blocked
            }
        });
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        });
    }
}

module.exports = {
    getDataUser
}