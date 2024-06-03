const nodemailer = require('nodemailer');

const NO_REPLY_EMAIL = "info-noreply@math.com";
const SUBJECT_RESTORE = "Restore password MATCH";
const TEXT_RESTORE = "Your restore PIN is: ";

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

const createMailOptions = (to, subject, text) => {
    return {
        from: NO_REPLY_EMAIL,
        to,
        subject,
        text
    }
}

const sendMail = async (to, subject, text) => {
    const options = createMailOptions(to, subject, text);
    await transporter.sendMail(options);
}

const sendRestoreMail = async (email, pin) => {
    await sendMail(email, SUBJECT_RESTORE, `${TEXT_RESTORE}${pin}`);
}

module.exports = {
    sendRestoreMail
}