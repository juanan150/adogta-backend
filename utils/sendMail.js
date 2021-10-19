const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const config = require("../config/index");

sgMail.setApiKey(config.sendGrid);

function sendMail({
  to,
  from = "Adogta <adogtatop@gmail.com>",
  subject,
  template_id,
  dynamic_template_data = {},
}) {
  const msg = {
    to,
    from,
    subject,
    template_id,
    dynamic_template_data,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = sendMail;
