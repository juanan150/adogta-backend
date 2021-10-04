const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const config = require("../config/index");

sgMail.setApiKey(config.sendGrid);

function sendMail({ to, subject, template_id }) {
  const msg = {
    to: "John Cortes <cortesjohnj@gmail.com>",
    from: "John Cortes <cortesjohnj@gmail.com>",
    subject: "Sending with SendGrid is Fun",
    template_id: "d-20060872dda64b6390f7a60e73e251bd",
    // dynamic_template_data: {

    // },
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
// sendMail();

module.exports = sendMail;
