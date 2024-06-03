const request = require("request");
const ultraMsgReferenceId = process.env.ULTRA_MSG_ID;
const ultraMsgToken = process.env.ULTRA_MSG_TOKEN;
const ultraMsgApiUrl = process.env.ULTRA_MSG_API_URL;
const TEXT_RESTORE = "Your restore PIN is: ";

const sendWhatsapp = async (to, body) => {
    const options = {
        method: 'POST',
        url: `${ultraMsgApiUrl}/messages/chat`,        
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        form: {
            token: ultraMsgToken,
            to,
            body,
            priority: '10',
            referenceId: ultraMsgReferenceId
        }
    };
    request(options);    
}

const sendRestoreWhatsapp = async (to, pin) => {
    await sendWhatsapp(to, `${TEXT_RESTORE}${pin}`);
}

module.exports = {
    sendRestoreWhatsapp
}