const {response} = require('express');
const {validationResult} = require('express-validator');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');

const validateFields = (req, res = response, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            msg: errors.mapped()
        });
    }
    next();
}

module.exports = {
    validateFields
}