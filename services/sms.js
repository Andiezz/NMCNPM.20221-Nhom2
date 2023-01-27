const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
