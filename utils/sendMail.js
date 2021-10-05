const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const config = require("../config/index");

sgMail.setApiKey(config.sendGrid);

function sendMail({ to, subject, template_id }) {
  const msg = {
    to: "John Cortes <cortesjohnj@gmail.com>",
    from: "Adogta <adogtatop@gmail.com>",
    subject: "Sending with SendGrid is Fun",
    template_id: "d-58752bd226294b3b90ea467f43775223",
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
