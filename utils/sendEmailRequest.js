const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const config = require("../config/index");

sgMail.setApiKey(config.sendGrid);

function sendEmailRequest({ to, template_id, dynamic_template_data = {} }) {
  let urlDefault =
    "http://cdn.mcauto-images-production.sendgrid.net/ba88d9d99fb7fc5c/544f9777-b1b3-4380-9be7-ece6a50b2f83/600x600.png";
  const photoUrl = dynamic_template_data["photoUrl"];
  if (photoUrl !== "") {
    urlDefault = photoUrl;
  }
  dynamic_template_data["photoUrl"] = urlDefault;
  const msg = {
    to, // Change to your recipient
    from: "adogtatop@gmail.com", // Change to your verified sender
    template_id,
    dynamic_template_data,
  };
  sgMail.send(msg);
}

module.exports = sendEmailRequest;
