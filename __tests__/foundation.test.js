const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

afterAll(() => {
  mongoose.disconnect();
});

describe("GET /foundations", () => {
  // assumes login works, test for login is somewhere else
  let user, token;
  beforeEach(async () => {
    user = await User.findById({ _id: "6140e9523c67cea2af68ecf5" });
    token = jwt.sign({ userId: user._id }, config.jwtKey);
  });

  test("responds 401 if user not authenticated", async () => {
    const response = await request(app).get("/foundations");
    expect(response.statusCode).toBe(401);
  });

  test("responds 200 if user is authenticated", async () => {
    const response = await request(app)
      .get("/foundations")
      .set("Authorization", token);

    expect(response.statusCode).toBe(200);
  });

  test("responds with first 10 foundations", async () => {
    const response = await request(app)
      .get("/foundations")
      .set("Authorization", token);
    expect(response.body.length).toBe(10);
    const listId = [
      "613a2c7cfd818ebfd9e05029",
      "613a5c5e382eee3ccac5bad0",
      "613a749c7c6c0998970eab95",
      "613a86e210ed01add3e4f2ae",
      "613a9b7abd9f8c8d00f6a612",
      "613fecc4e485559caa864add",
      "6148bc75b544bc9daace08c7",
      "614a4c2e05445cc353d5eb59",
      "614e589713138182536c94ab",
      "6167063ebbc25048924f81c1",
    ];
    for (let i = 0; i < 5; i++) {
      expect(response.body[i]._id === listId[i]);
    }
  });
});
