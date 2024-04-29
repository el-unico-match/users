const {response} = require('express');
const User = require('../models/Users');
const {HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes')
const {MSG_DATABASE_ERROR} = require('../messages/uncategorized');

/**
 * 
 * @return un función que retorna como true la cantidad de usuarios en la base 
 * de datos, y en caso que la base de datos no se encuentre disponible false 
 * con mensaje de error.
 */
const getStatus = async (req, res = response) => {
    try {
        let users = await User.find();
        res.json({
            ok: true,
            count_users: users.length
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