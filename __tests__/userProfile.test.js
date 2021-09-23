const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { generateJWT } = require("../utils");
const User = require("../models/User");
const faker = require("faker");

afterAll(() => mongoose.disconnect());

describe("put/:id/profile", () => {
  let user, token;
  const _id = "6140e9523c67cea2af68ecf5";
  beforeEach(async () => {
    user = await User.findById(_id);
    token = generateJWT(user);
  });

  test("Update profile with a response 200 Ok", async () => {
    const response = await request(app)
      .put(`/${_id}/profile`)
      .send({
        _id: _id,
        email: "foundationt@test.com",
        name: faker.name.findName(),
        role: "user",
        address: faker.address.city(),
      })
      .set("Authorization", token);

    expect(response.statusCode).toBe(200);
  });

  test("Reponse 401 if user not authenticated", async () => {
    const response = await request(app).put(`/${_id}/profile`).send({
      _id: _id,
      email: "foundationt@test.com",
      name: faker.name.findName(),
      role: "user",
      address: faker.address.city(),
    });

    expect(response.statusCode).toBe(401);
  });
});
