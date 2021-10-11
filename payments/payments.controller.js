const config = require("../config/index");
const jwt = require("jsonwebtoken");

const epayco = require("epayco-sdk-node")({
  apiKey: config.epaycoApiKey,
  privateKey: config.epaycoPrivateKey,
  lang: "EN",
  test: true,
});

const User = require("../models/User");
const Payment = require("../models/payments");

async function createCard(req, res) {
  const cardInfo = req.body;
  const token = req.get("Authorization");
  let user;
  if (token) {
    user = jwt.verify(token, config.jwtKey);
  }

  try {
    const token = await epayco.token.create(cardInfo);
    if (user) {
      const filter = { _id: user.userId };
      const update = { token_card: token.id };
      await User.findOneAndUpdate(filter, update);
    }
    res.status(201).json({ token });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

async function createCustomer(req, res) {
  const token = req.get("Authorization");
  let user;
  let currentUser;
  if (token) {
    user = jwt.verify(token, config.jwtKey);
    currentUser = await User.findById(user.userId);
  }

  const customerInfo = {
    ...req.body,
    token_card: token ? currentUser.token_card : req.body.token_card,
  };
  try {
    const customer = await epayco.customers.create(customerInfo);
    const {
      data: { customerId },
    } = customer;

    if (user) {
      const filter = { _id: user.userId };
      const update = { epaycoCustomerId: customerId };
      await User.findOneAndUpdate(filter, update);
    }

    res.status(201).json({ customer });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

//se deja opcional para futuro
async function listCustomers(req, res) {
  try {
    const list = await epayco.customers.list();
    res.status(201).json({ list });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

//se deja opcional para futuro
async function deleteCustomer(req, res) {
  const customerInfo = req.body;
  try {
    const destroy = await epayco.customers.delete(customerInfo);
    res.status(201).json({ destroy });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

async function creditPayment(req, res) {
  const token = req.get("Authorization");
  let user;
  let currentUser;
  if (token) {
    user = jwt.verify(token, config.jwtKey);
    currentUser = await User.findById(user.userId);
  }

  const paymentInfo = {
    ...req.body,
    customer_id: token ? currentUser.epaycoCustomerId : req.body.customer_id,
    token_card: token ? currentUser.token_card : req.body.token_card,
  };

  try {
    const { data: data } = await epayco.charge.create(paymentInfo);

    if (user) {
      const newPayment = new Payment({
        ...data,
        userId: user.userId,
        epaycoCustomerId: user
          ? currentUser.epaycoCustomerId
          : req.body.customer_id,
      });
      const payment = await newPayment.save();

      res.status(201).json({ payment });
    } else {
      const newPayment = new Payment({
        ...data,
        epaycoCustomerId: user
          ? currentUser.epaycoCustomerId
          : req.body.customer_id,
      });
      const payment = await newPayment.save();

      res.status(201).json({ payment });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

async function pseBanks(_, res) {
  try {
    const listBanks = await epayco.bank.getBanks();
    res.status(201).json({ listBanks });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

async function createPsePayment(req, res) {
  const pseInfo = req.body;
  try {
    const payment = await epayco.bank.create(pseInfo);
    res.status(201).json({ payment });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

async function pseTicket(req, res) {
  const ticketId = req.body;
  try {
    const ticketInfo = await epayco.bank.get(ticketId);
    res.status(201).json({ ticketInfo });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.errors);
  }
}

//se deja opcional para futuro
async function registeredGetTotalPayments(req, res) {
  const token = req.get("Authorization");
  let user;
  if (token) {
    user = jwt.verify(token, config.jwtKey);
  }
  try {
    const payments = await Payment.aggregate([
      {
        $match: {
          userId: user.userId,
        },
      },
      {
        $group: {
          _id: "$userId",
          total: { $sum: "$valor" },
        },
      },
    ]);
    res.status(201).json({ payments });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
}

//se deja opcional para futuro
async function unregisteredGetTotalPayments(_, res) {
  try {
    const payments = await Payment.aggregate([
      {
        $match: {
          userId: !userId,
        },
      },
      {
        $group: {
          _id: "$userId",
          total: { $sum: "$valor" },
        },
      },
    ]);
    res.status(201).json({ payments });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
}

module.exports = {
  createCard,
  createCustomer,
  deleteCustomer,
  listCustomers,
  creditPayment,
  pseBanks,
  createPsePayment,
  pseTicket,
  registeredGetTotalPayments,
  unregisteredGetTotalPayments,
};

//Pendiente preguntar por que no me sirve pse
