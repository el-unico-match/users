const nodemailer = require('nodemailer');

const NO_REPLY_EMAIL = "info-noreply@math.com";
const SUBJECT_PIN_MESSAGE = "Match App - PIN";
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_COULD_NOT_BE_SENT_PIN} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_SERVER_ERROR_5XX,
    HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');

let mailServiceConfigError = null;

const transporter = nodemailer.createTransport(
    {
        service: process.env.SERVICE_EMAIL_APP,
        host: process.env.HOST_EMAIL_APP,
        port: process.env.PORT_EMAIL_APP,
        secure: true,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.PASS_EMAIL_APP
        }
    }
)

// Verificar conexión
transporter.verify( (error) => {
    if (error) {
      mailServiceConfigError = `Mail Service Configuration Fail: ${error}`;
    } else {
      console.log("Mail service is ready.");
    }
});

const createMailOptions = (to, subject, text) => {
    return {
        from: NO_REPLY_EMAIL,
        to,
        subject,
        text
    }
}

const doSendPinMail = async (res, to, subject, text, token) => {
    if (mailServiceConfigError) {
        return res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
            ok: false,
            msg: MSG_ERROR_500,
            detail: mailServiceConfigError
        });
    }
    const options = createMailOptions(to, subject, text);
    await transporter.sendMail(options, (error, info) => {
        if (error) {
            res.status(HTTP_CLIENT_ERROR_4XX.NOT_FOUND).json({
                ok: false,
                msg: MSG_COULD_NOT_BE_SENT_PIN
            });
        } else {            
            res.status(HTTP_SUCCESS_2XX.CREATED).json({
                ok: true,
                user: {
                    email: to
                },            
                token: token            
            });   
        }        
    });
}

const sendPinMail = async (res, email, text, token) => {
    await doSendPinMail(res, email, SUBJECT_PIN_MESSAGE, text, token);
}

module.exports = {
    sendPinMail
}