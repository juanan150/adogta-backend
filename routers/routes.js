const express = require("express");
const controllers = require("../controllers/controllers");
const paymentController = require("../payments/payments.controller");
const { auth, authAdmin } = require("../middlewares/middlewares");
const app = express.Router();

const swagger = require("../swagger");
app.use("/docs", swagger.server, swagger.setup);

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.put("/:id/profile", auth, controllers.updateProfile);
/**
 * @swagger
 * /pets/{petId}:
 *  delete:
 *    description: Delete a pet
 *    summary: Delete a pet
 *    parameters:
 *      - in: path
 *        name: petId
 *        required: true
 *        description: pet id from MongoDB
 *        schema:
 *          type: string
 *    responses:
 *      204:
 *        description: Deleted
 *      500:
 *        description: Server error
 */
app.delete("/pets/:petId", auth, controllers.destroyPet);
app.get("/foundations", auth, controllers.listFoundations);
/**
 * @swagger
 * /foundations/{foundationId}/pets:
 *  get:
 *    description: List all pets from a specific fiundation
 *    summary: List all pets
 *    parameters:
 *      - in: path
 *        name: foundationId
 *        required: true
 *        description: foundation id from MongoDB
 *        schema:
 *          type: string
 *      - in: query
 *        name: page
 *        required: true
 *        description: results page
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
 *                  page:
 *                      type: number
 *                      description: pets results page
 *                      example: 1
 *                  count:
 *                      type: number
 *                      description: total results count
 *                      example: 21
 *                  pets:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                               _id:
 *                                   type: string
 *                                   description: Request id
 *                                   example: 61392cb386895b8cffc78fa9
 *                               userId:
 *                                   type: string
 *                                   description: User name that made the request
 *                                   example: 61392cb386895b8cffc78fa9
 *                               pettId:
 *                                   type: string
 *                                   description: Pet Id
 *                                   example: 61392cb386895b8cffc78fa9
 *                               description:
 *                                   type: string
 *                                   example: I really like this pet
 *                               responseStatus:
 *                                   type: string
 *                                   description: Adoption request status
 *                                   example: approved
 *
 *      500:
 *        description: Server error
 */
app.get("/foundations/:foundationId/pets", auth, controllers.listPets);
/**
 * @swagger
 * /foundations/{foundationId}/requests:
 *  get:
 *    description: Used for getting all requests from all pets for a specific foundation
 *    summary: Get all requests from a foundation
 *    parameters:
 *      - in: path
 *        name: foundationId
 *        required: true
 *        description: foundation id from MongoDB
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                          description: Request id
 *                          example: 61392cb386895b8cffc78fa9
 *                      userId:
 *                          type: string
 *                          description: User name that made the request
 *                          example: 61392cb386895b8cffc78fa9
 *                      pettId:
 *                          type: string
 *                          description: Pet Id
 *                          example: 61392cb386895b8cffc78fa9
 *                      description:
 *                          type: string
 *                          example: I really like this pet
 *                      responseStatus:
 *                          type: string
 *                          description: Adoption request status
 *                          example: approved
 *
 *      500:
 *        description: Server error
 */
app.get("/foundations/:id/requests", controllers.listFoundationRequests);
/**
 * @swagger
 * /foundations/{foundationId}/pets:
 *  post:
 *    description: Create a pet
 *    summary: Create a pet
 *    parameters:
 *      - in: path
 *        name: foundationId
 *        required: true
 *        description: foundation id from MongoDB
 *        schema:
 *          type: string
 *      - in: body
 *        name: name
 *        required: true
 *        description: Pet name
 *        schema:
 *          type: string
 *          example: coco
 *      - in: body
 *        name: description
 *        required: true
 *        description: Pet description
 *        schema:
 *          type: string
 *          example: Lovely pet
 *      - in: body
 *        name: phtoUrl
 *        required: true
 *        description: Array of photos
 *        schema:
 *          type: array
 *          items:
 *              typr: string
 *      - in: body
 *        name: age
 *        required: true
 *        description: Pet age
 *        schema:
 *          type: number
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
 *                  description: Foundation Id that registered the pet
 *                  example: 61392cb386895b8cffc78f97
 *                age:
 *                  type: number
 *                  description: Pet age
 *                  example: 8
 *      500:
 *        description: Server error
 */
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
/**
 * @swagger
 * /pets/{petId}/requests:
 *  get:
 *    description: Used for getting all requests from a specific pet
 *    summary: Get all requests from a pet
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
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                          description: Request id
 *                          example: 61392cb386895b8cffc78fa9
 *                      userId:
 *                          type: string
 *                          description: User name that made the request
 *                          example: 61392cb386895b8cffc78fa9
 *                      pettId:
 *                          type: string
 *                          description: Pet Id
 *                          example: 61392cb386895b8cffc78fa9
 *                      description:
 *                          type: string
 *                          example: I really like this pet
 *                      responseStatus:
 *                          type: string
 *                          description: Adoption request status
 *                          example: approved
 *
 *      500:
 *        description: Server error
 */
app.get("/pets/:petId/requests", auth, controllers.listRequests);
/**
 * @swagger
 * /pets/{petId}/requests:
 *  put:
 *    description: Reject all the requests for a pet but the one accepted
 *    summary: Bulk reject requests from a pet
 *    parameters:
 *      - in: path
 *        name: petId
 *        required: true
 *        description: pet id from MongoDB
 *        schema:
 *          type: string
 *      - in: body
 *        name: requestId
 *        required: true
 *        description: request Id that won't be rejected
 *        schema:
 *          type: string
 *          example: 61392cb386895b8cffc78fa9
 *    responses:
 *      204:
 *        description: Updated
 *      500:
 *        description: Server error
 */
app.put("/pets/:petId/requests", auth, controllers.bulkReject);
/**
 * @swagger
 * /pets/{petId}/requests/{requestId}:
 *  put:
 *    description: Update a request
 *    summary: Update a request
 *    parameters:
 *      - in: path
 *        name: petId
 *        required: true
 *        description: pet id from MongoDB
 *        schema:
 *          type: string
 *      - in: path
 *        name: requestId
 *        required: true
 *        description: request Id that will be updated
 *        schema:
 *          type: string
 *          example: 61392cb386895b8cffc78fa9
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: "object"
 *              properties:
 *                  _id:
 *                      type: string
 *                      description: Request id
 *                      example: 61392cb386895b8cffc78fa9
 *                  userId:
 *                      type: string
 *                      description: User name that made the request
 *                      example: 61392cb386895b8cffc78fa9
 *                  pettId:
 *                      type: string
 *                      description: Pet Id
 *                      example: 61392cb386895b8cffc78fa9
 *                  description:
 *                      type: string
 *                      example: I really like this pet
 *                  responseStatus:
 *                      type: string
 *                      description: Adoption request status
 *                      example: approved
 *      500:
 *        description: Server error
 */
app.put("/pets/:petId/requests/:requestId", auth, controllers.updateRequest);
app.get("/admin", authAdmin, controllers.listFoundationsAdmin);
app.delete("/admin", authAdmin, controllers.deleteFoundation);
app.get("/admin/users", authAdmin, controllers.listUsers);
app.delete("/admin/users", authAdmin, controllers.deleteUsers);
app.post("/signup", controllers.createUser);
app.post("/pets/:petId/request", auth, controllers.createRequest);
app.get("/:userId/requests", auth, controllers.listUserRequests);
app.post("/adminSearch", authAdmin, controllers.adminSearch);
app.get("/verified/:token", controllers.verifiedEmail);
app.post("/donate/payment", auth, paymentController.epaycoPayment);

module.exports = app;
