const {response} = require('express');
const User = require('../models/Users');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {
    MSG_USER_NOT_EXISTS, 
    MSG_COULD_NOT_BE_SENT_RESTORE_PIN} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_CLIENT_ERROR_4XX,
    HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {sendRestoreMail} = require('../helpers/email');
const {generatePin} = require('../helpers/pin');
const {generateRestoreJWT} = require('../helpers/jwt');

const restorePassword = async (req, res = response) => {
    try {
        const {email, cellphone} = req.body;
        // Check en DB si existe el usuario
        let user = await User.findOne({email});
        if (user){    
            const pin = generatePin();
            const token = await generateRestoreJWT(email, pin);
            try {
                await sendRestoreMail(email, pin);
                res.status(HTTP_SUCCESS_2XX.CREATED).json({
                    ok: true,
                    user: {
                        email,
                        cellphone
                    },            
                    token: token            
                });    
            } catch (error) {
                res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
                    ok: false,
                    msg: MSG_COULD_NOT_BE_SENT_RESTORE_PIN         
                });    
            }            
        } else {
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_USER_NOT_EXISTS
            });
        }        
    } catch (error) {
        console.log(error);
        res.status(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: MSG_ERROR_500
        })
    }
}

module.exports = {
    restorePassword
}