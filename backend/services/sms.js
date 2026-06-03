//Envio de sms
async function sendSMS(phone, sms) {
    console.log(`Enviando SMS para ${phone}: ${sms}`);
    return true;
}

//futuramente pode ser implementado com Twilio ou outro serviço de SMS

module.exports = {
    sendSMS
}