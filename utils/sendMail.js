const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const config = require("../config/index");

sgMail.setApiKey(config.sendGrid);

function sendMail({ to, from, subject, template_id }) {
  const msg = {
    to,
    from,
    subject,
    template_id,
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

module.exports = sendMail;
