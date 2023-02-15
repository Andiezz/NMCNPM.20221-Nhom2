const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.verifyPhone = async () => {
  return client.validationRequests
    .create({friendlyName: 'phone', phoneNumber: '+84944162921'})
    .then(validation_request => console.log(validation_request.friendlyName));
}

exports.sendSMS = async ({ phone, message }) => {
  client.messages
    .create({
      to: "+84" + phone.slice(1),
      body: message,
      from: process.env.TWILIO_ACTIVE_PHONE_NUMBER,
    })
    .then((msg) => {
      // console.log(message.sid);
    })
    .catch((err) => {
      console.error(err);
    })
    .done();
};
