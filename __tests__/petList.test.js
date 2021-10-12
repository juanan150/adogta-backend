require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const app = require("../app");
const Pet = require("../models/Pet");

afterAll(() => {
  mongoose.disconnect();
});

let userId, token;
const file = "__tests__/img/mug.png";
//foundationt
userId = "6140fb165b1d5ee0c2a4621d";
token = jwt.sign({ userId: userId }, config.jwtKey);

describe("GET /foundations/:foundationId/pets", () => {
  test("responds 200 OK", async () => {
    const response = await request(app)
      .get(`/foundations/${userId}/pets`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });

  test("responds 401 if unauthenticated", async () => {
    const response = await request(app).get(`/foundations/${userId}/pets`);
    expect(response.statusCode).toBe(401);
  });

  test("responds with a list of 1 result", async () => {
    const response = await request(app)
      .get(`/foundations/${userId}/pets`)
      .set("Authorization", token);
    expect(response.body.pets.length).toBe(1);
  });
});

describe("POST /foundations/:foundationId/pets", () => {
  let _id = "";
  afterEach(async () => {
    await request(app).delete(`/pets/${_id}`).set("Authorization", token);
  });

  test("responds 201 after adding a pet", async () => {
    const response = await request(app)
      .post(`/foundations/${userId}/pets`)
      .attach("photoUrl", file)
      .field("name", "Test pet")
      .field("description", "test pet")
      .field("age", 10);

    _id = response.body._id;
    expect(response.statusCode).toBe(201);
  });

  test("returns pet with _id", async () => {
    const response = await request(app)
      .post(`/foundations/${userId}/pets`)
      .attach("photoUrl", file)
      .field("name", "Test pet")
      .field("description", "test pet")
      .field("age", 10);
    _id = response.body._id;
    expect(response.body._id).not.toBeFalsy();
  });
});

describe("DELETE /pets/:petId", () => {
  let _id = "";
  const userId2 = "6140fb165b1d5ee0c2a4621e";
  beforeEach(async () => {
    const response = await request(app)
      .post(`/foundations/${userId2}/pets`)
      .attach("photoUrl", file)
      .field("name", "Test pet")
      .field("description", "test pet")
      .field("age", 10);
    _id = response.body._id;
  });

  afterAll(async () => {
    await Pet.deleteMany({ foundationId: userId2 });
  });

  test("responds 401 if unauthenticated", async () => {
    const response = await request(app).delete(`/pets/${_id}`);
    expect(response.statusCode).toBe(401);
  });

  test("responds 204 if the user is authenticated", async () => {
    const response = await request(app)
      .delete(`/pets/${_id}`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(204);
  });
});

describe("GET /foundations/:id/requests", () => {
  const userId3 = "613fecc4e485559caa864add";
  test("responds 200 OK", async () => {
    const response = await request(app).get(`/foundations/${userId3}/requests`);
    expect(response.statusCode).toBe(200);
  });

  test("responds with a list of 1 result", async () => {
    const response = await request(app).get(`/foundations/${userId3}/requests`);
    expect(response.body.length).toBe(3);
  });
});
