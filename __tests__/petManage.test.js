require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const app = require("../app");

afterAll(() => {
  mongoose.disconnect();
});

let userId, token, petId;
//foundationt
userId = "6138fc6caaafd83875c55886";
//pet coco3
petId = "6143e2a60d4bc9d25fb9e929";

token = jwt.sign({ userId: userId }, config.jwtKey);

describe("GET /pets/:petId", () => {
  test("responds 200 OK", async () => {
    const response = await request(app)
      .get(`/pets/${petId}`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });

  test("responds 401 if unauthenticated", async () => {
    const response = await request(app).get(`/pets/${petId}`);
    expect(response.statusCode).toBe(401);
  });

  test("responds 400 is an invalid Id is sent", async () => {
    const response = await request(app)
      .get(`/pets/1`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(400);
  });

  test("responds 404 is the Pet doesn't exist", async () => {
    const response = await request(app)
      .get(`/pets/111111111111111111111111`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(404);
  });

  test("returns the pet information", async () => {
    const response = await request(app)
      .get(`/pets/${petId}`)
      .set("Authorization", token);
    expect(response.body._id).toBe(petId);
    expect(response.body.name).toBe("coco3");
    expect(response.body.description).toBe("test pet");
    expect(response.body.age).toBe(10);
    expect(response.body.foundationId).toBe("613fecc4e485559caa864add");
  });
});

describe("GET /pets/:petId/requests", () => {
  test("responds 200 OK", async () => {
    const response = await request(app)
      .get(`/pets/${petId}/requests`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });

  test("responds 401 if unauthenticated", async () => {
    const response = await request(app).get(`/pets/${petId}/requests`);
    expect(response.statusCode).toBe(401);
  });

  test("responds with a list of 3 results", async () => {
    const response = await request(app)
      .get(`/pets/${petId}/requests`)
      .set("Authorization", token);
    expect(response.body.length).toBe(3);
  });
});

describe("PUT /pets/:petId/requests/:requestId", () => {
  const requestId = "614a107a8e075232b9776e95";

  afterAll(async () => {
    await request(app)
      .put(`/pets/${petId}/requests/${requestId}`)
      .send({ responseStatus: "pending" })
      .set("Authorization", token);
  });

  test("responds 200 OK", async () => {
    const response = await request(app)
      .put(`/pets/${petId}/requests/${requestId}`)
      .send({ responseStatus: "pending" })
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });

  test("responds 401 if unauthenticated", async () => {
    const response = await request(app)
      .put(`/pets/${petId}/requests/${requestId}`)
      .send({ responseStatus: "pending" });
    expect(response.statusCode).toBe(401);
  });

  test("returns the updated object", async () => {
    const response = await request(app)
      .put(`/pets/${petId}/requests/${requestId}`)
      .send({ responseStatus: "rejected" })
      .set("Authorization", token);
    expect(response.body.responseStatus).toBe("rejected");
  });
});
