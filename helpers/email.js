const nodemailer = require('nodemailer');

const NO_REPLY_EMAIL = "info-noreply@math.com";
const SUBJECT_PIN_MESSAGE = "Match App - PIN";
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_COULD_NOT_BE_SENT_PIN} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_SERVER_ERROR_5XX,
    HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const {
    logDebug,
    logInfo,
    logWarning} = require('../helpers/log/log');

let mailServInitError = null;

const mailServCfg = {
    service: process.env.SERVICE_EMAIL_APP,
    host: process.env.HOST_EMAIL_APP,
    port: process.env.PORT_EMAIL_APP,
    secure: false,
    auth: {
        user: process.env.USER_APP_EMAIL,
        pass: process.env.PASS_EMAIL_APP
    }
};

const transporter = nodemailer.createTransport(mailServCfg);

// Verificar conexión
transporter.verify( (error) => {
    logDebug(`Mail service config: ${JSON.stringify(mailServCfg)}`);
    if (error) {
        mailServInitError = `Mail Service Configuration Fail: ${error}`;
        logWarning(`${mailServInitError}`);
    } else {
        logInfo(`Mail service is ready: ${mailServCfg.auth.user}`);
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
    if (mailServInitError) {
        const dataToResponse = {
            ok: false,
            msg: MSG_ERROR_500,
            detail: mailServInitError
        };
        logDebug(`On send pin mail wrong configuration: ${mailServInitError}`);
        logInfo(`On send pin mail response: ${HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE}; ${JSON.stringify(dataToResponse)}`);
        return res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json(dataToResponse);
    }
    const options = createMailOptions(to, subject, text);
    await transporter.sendMail(options, (error, info) => {
        if (error) {
            const dataToResponse = {
                ok: false,
                msg: MSG_COULD_NOT_BE_SENT_PIN
            }
            logDebug(`On send pin mail: ${error}`);
            logInfo(`On send pin mail response: ${HTTP_CLIENT_ERROR_4XX.BAD_REQUEST}; ${JSON.stringify(dataToResponse)}`);
            res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json(dataToResponse);
        } else {            
            const dataToResponse = {
                ok: true,
                user: {
                    email: to
                },            
                token: token            
            };
            logInfo(`On send pin mail response: ${HTTP_SUCCESS_2XX.CREATED}; ${JSON.stringify(dataToResponse)}`);
            res.status(HTTP_SUCCESS_2XX.CREATED).json(dataToResponse);   
        }        
    });
}

const sendPinMail = async (res, email, text, token) => {
    await doSendPinMail(res, email, SUBJECT_PIN_MESSAGE, text, token);
}

const checkMail = async () => {
    const options = createMailOptions(process.env.EMAIL_CHECK_APP, "test", "test");
    let result = true;
    await transporter.sendMail(options, (error, info) => {
        if (error) {
            result = false;   
        }        
    });
    return result;
}

const statusMailService = async () => {
    let result;
    if (mailServInitError) {
        result = {
            online: false,
            detail: mailServInitError
        };
        logWarning(`On check mail service error: ${mailServInitError}`);    
    } else {
        result = {
            online: await checkMail()
        };
    };   
    logInfo(`On check mail service status: ${JSON.stringify(result)}`);
    return result;
}

module.exports = {
    sendPinMail,
    statusMailService
}