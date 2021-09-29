const express = require("express");
const controllers = require("../controllers/controllers");
const { auth, authAdmin } = require("../middlewares/middlewares");
const app = express.Router();

const swagger = require("../swagger");
app.use("/docs", swagger.server, swagger.setup);

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.put("/:id/profile", auth, controllers.updateProfile);
app.delete("/pets/:petId", auth, controllers.destroyPet);
app.get("/foundations", auth, controllers.listFoundations);
app.get("/foundations/:foundationId/pets", auth, controllers.listPets);
app.get("/foundations/:id/requests", controllers.listFoundationRequests);
app.post("/foundations/:foundationId/pets", controllers.createPet);
/**
 * @swagger
 * /pets/{petId}:
 *  get:
 *    description: Used for getting a specific pet
 *    summary: Get a specific pet
 *    parameters:
 *      - in: path
 *        name: petId
 *        required: true
 *        description: pet id from MongoDB
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: "object"
 *              properties:
 *                _id:
 *                  type: string
 *                  description: Pet id
 *                  example: 61392cb386895b8cffc78fa9
 *                name:
 *                  type: string
 *                  description: Pet name
 *                  example: Coco
 *                description:
 *                  type: string
 *                  description: Pet description
 *                  example: Really nice dog
 *                photoUrl:
 *                  type: array
 *                  items:
 *                    type: string
 *                foundationId:
 *                  type: string
 *                  description: FOundation Id that registered the pet
 *                  example: 61392cb386895b8cffc78f97
 *                age:
 *                  type: number
 *                  description: Pet age
 *                  example: 8
 *      400:
 *        description: Invalid pet Id
 *      404:
 *        description: Pet not found
 *      500:
 *        description: Server error
 */
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

module.exports = app;
