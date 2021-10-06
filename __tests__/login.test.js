const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const faker = require("faker");
const User = require("../models/User");

afterAll(() => mongoose.disconnect());

describe("POST /login", () => {
  let user;
  beforeEach(async () => {
    user = await User.authenticate("foundationt@test.com", "Prueba123");
  });

  test("Response 200 Ok", async () => {
    const response = await request(app).post("/login").send({
      email: user.email,
      password: "Prueba123",
    });
    expect(response.statusCode).toBe(200);
  });

  test("Response with correct json", async () => {
    const response = await request(app).post("/login").send({
      email: user.email,
      password: "Prueba123",
    });
    expect(response.type).toBe("application/json");
  });

  test("Response with correct properties", async () => {
    const response = await request(app).post("/login").send({
      email: user.email,
      password: "Prueba123",
    });
    expect(response.body).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        token: expect.any(String),
        name: expect.any(String),
        _id: expect.any(String),
      })
    );
  });

  test("Not login when user enters invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    expect(response.statusCode).toBe(401);
  });

  test("Not login when user doesn't enter credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: "",
    });
    expect(response.statusCode).toBe(401);
  });
});
