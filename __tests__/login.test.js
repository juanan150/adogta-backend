const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("post/login", () => {
  test("Login an user", async () => {
    const response = await request(app).post("/login").send({
      email: "found@gmail.com",
      password: "Prueba123",
    });
    expect(response.statusCode).toBe(200);
  });
});

afterAll(() => mongoose.disconnect());
