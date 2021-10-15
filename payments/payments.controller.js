const config = require("../config/index");
const sendMail = require("../utils/sendMail");
const epayco = require("epayco-sdk-node")({
  apiKey: config.epaycoApiKey,
  privateKey: config.epaycoPrivateKey,
  lang: "EN",
  test: true,
});

const User = require("../models/User");
const Payment = require("../models/payments");

async function epaycoPayment(req, res) {
  const cardInfo = req.body;
  const user = res.locals.user;
  let card_token;
  let userId;

  // crea el token de la tarjeta
  try {
    const token = await epayco.token.create(cardInfo);
    const filter = { _id: user._id };
    const update = { token_card: token.id };

    await User.findOneAndUpdate(filter, update);
    card_token = token.id;
  } catch (error) {
    res.status(500).send(error.errors);
  }
  // Crea el usuario y hace udpate del user id en el modelo de usuario
  try {
    const customerInfo = { ...cardInfo, token_card: card_token };
    const customer = await epayco.customers.create(customerInfo);

    const {
      data: { customerId },
    } = customer;
    const filter = { _id: user._id };
    const update = { epaycoCustomerId: customerId };
    await User.findOneAndUpdate(filter, update);
    userId = customerId;
  } catch (error) {
    res.status(500).send(error.errors);
  }
  // Hacer el pago
  try {
    const paymentInfo2 = {
      customer_id: userId,
      token_card: card_token,
      ...cardInfo,
    };

    const { data: data } = await epayco.charge.create(paymentInfo2);
    const newPayment = new Payment({
      ...data,
      userId: user._id,
      epaycoCustomerId: userId,
      foundationId: req.body.foundationId,
    });
    await newPayment.save();

    await sendMail({
      to: user.email,
      template_id: config.senGridDonation,
      dynamic_template_data: {
        name: user.name,
      },
    });

    res.status(201).json({ data });
  } catch (error) {
    res.status(500).send(error.errors);
  }
}

module.exports = {
  epaycoPayment,
};
