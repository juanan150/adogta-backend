const express = require("express");
const controllers = require("../controllers/controllers");
const paymentController = require("../payments/payments.controller");
const { auth, authAdmin } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.put("/:id/profile", auth, controllers.updateProfile);
app.delete("/pets/:petId", auth, controllers.destroyPet);
app.get("/foundations", auth, controllers.listFoundations);
app.get("/foundations/:foundationId/pets", auth, controllers.listPets);
app.get("/foundations/:id/requests", controllers.listFoundationRequests);
app.post("/foundations/:foundationId/pets", controllers.createPet);
app.get("/pets/:petId", auth, controllers.getPet);
app.get("/pets/:petId/requests", auth, controllers.listRequests);
app.put("/pets/:petId/requests/", auth, controllers.bulkReject);
app.put("/pets/:petId/requests/:requestId", auth, controllers.updateRequest);
app.get("/admin", authAdmin, controllers.listFoundations);
app.delete("/admin", authAdmin, controllers.deleteFoundation);
app.get("/admin/users", authAdmin, controllers.listUsers);
app.delete("/admin/users", authAdmin, controllers.deleteUsers);
app.post("/signup", controllers.createUser);
app.post("/pets/:petId/request", auth, controllers.createRequest);
app.get("/:userId/requests", auth, controllers.listUserRequests);
app.post("/adminSearch", authAdmin, controllers.adminSearch);
app.post("/donate/create-card", paymentController.createCard);
app.post("/donate/create-customer", paymentController.createCustomer);
app.get("/donate/list", auth, paymentController.listCustomers);
app.post("/donate/delete", auth, paymentController.deleteCustomer);
app.post("/donate/credit-payment", paymentController.creditPayment);
app.get("/donate/pse-list", paymentController.pseBanks);
app.post("/donate/pse-payment", paymentController.createPsePayment);
app.post("/donate/pse-ticket", paymentController.pseTicket);
app.get(
  "/donate/registered-total-payments",
  auth,
  paymentController.registeredGetTotalPayments
);
app.get(
  "/donate/unregistered-total-payments",
  auth,
  paymentController.unregisteredGetTotalPayments
);

module.exports = app;

//16328ed2b0cd97d096c9dc3 token
//163164001cb9d277f04a853 customerId
