const express = require("express")
const controllers = require("../controllers/controllers")
const { auth } = require("../middlewares/middlewares")
const app = express.Router()

app.get("/me", auth, controllers.loadUser)
app.post("/login", controllers.login)
app.delete("/pets/:id", auth, controllers.destroyPet)
app.get("/foundations/:id/pets", auth, controllers.listPets)
app.post("/foundations/:foundationId/pets", auth, controllers.createPet)
app.get("/foundations", controllers.listFoundations)

module.exports = app
