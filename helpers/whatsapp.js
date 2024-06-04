//const request = require("request");
const axios = require('axios');
const qs = require('qs');
const {MSG_ERROR_500} = require('../messages/uncategorized');
const {MSG_COULD_NOT_BE_SENT_RESTORE_PIN} = require('../messages/auth');
const {
    HTTP_SUCCESS_2XX,
    HTTP_SERVER_ERROR_5XX,
    HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');
const ultraMsgReferenceId = process.env.ULTRA_MSG_ID;
const ultraMsgToken = process.env.ULTRA_MSG_TOKEN;
const ultraMsgApiUrl = `https://api.ultramsg.com/${ultraMsgReferenceId}`;
const TEXT_RESTORE = "Your restore PIN is: ";

const sendWhatsapp = async (res, to, body, token) => {
    const data = qs.stringify({
        "token": ultraMsgToken,
        "to": to,
        "body": body,
        "priority": '10',
        "referenceId": ultraMsgReferenceId,
        "msgId": "",
        "mentions": ""
    });    
    const config = {
        method: 'POST',
        url: `${ultraMsgApiUrl}/messages/chat`,        
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data        
    };
    let response;
    try {
        response = await axios(config);
        // errores de configuración servicio
        if (response?.data?.error) {
            res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
                ok: false,
                msg: MSG_ERROR_500,
                detail: response.data.error.toString()
            });
        } else {
            // verifico si se intento enviar el mensaje
            if (response.data?.sent) {
                // verificar si efectivamente se envió el mensaje
                await checkMessageSended(res, to, token, response.data?.id);                    
            } else {
                res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
                    ok: false,    
                    msg: MSG_COULD_NOT_BE_SENT_RESTORE_PIN
                });    
            }            
        }
    } catch (error) {
        // errores internos al intentar usar el servicio
        res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
            ok: false,
            msg: MSG_ERROR_500,
            detail: error.toString()
        });
    }    
}

const checkMessageSended = async (res, to, token, id) => {
    let sended;
    const params= {
        "token": ultraMsgToken,
        "status": "sent",
        "id": id,
    };
    const config = {
        method: 'get',
        url: `${ultraMsgApiUrl}/messages`,
        headers: {  
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: params
    };
    try {
        const response = await axios(config);
        sended = response.data.total === 1;
    } catch (error) {
        sended = false;
    }
    if (sended) {
        res.status(HTTP_SUCCESS_2XX.CREATED).json({
            ok: true,
            user: {
                cellphone: to
            },            
            token: token            
        });   
    } else {
        res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,    
            msg: MSG_COULD_NOT_BE_SENT_RESTORE_PIN
        });    
    }
}

const sendRestoreWhatsapp = async (res, to, pin, token) => {
    await sendWhatsapp(res, to, `${TEXT_RESTORE}${pin}`, token);
}

module.exports = {
    sendRestoreWhatsapp
}
