"use server"
import axios from "axios"

// hostpinnacle sms
export const sendSms = () => {
    const url = 'https://smsportal.hostpinnacle.co.ke/SMSApi/send';

    const data = {
        userid: 'fury17',
        password: '6mVEphg6',
        senderid: 'HPKSMS',
        msgType: 'text',
        duplicatecheck: 'true',
        sendMethod: 'quick',
        sms: [
            { mobile: ['254745449123'], msg: 'hello amigos' }
        ],
    };

    axios.post(url, data, {
        headers: { 'Content-Type': 'application/json', },
    })
    .then((response) => {
        console.log('Response:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}