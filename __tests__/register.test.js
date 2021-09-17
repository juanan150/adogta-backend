const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
describe("post /signup", () => {
  test("Create an user", async () => {
    const response = await request(app).post("/signup").send({
      name: "carlos",
      email: "testprueba@gmail.com",
      password: "Prueba123",
      role: "user",
    });
    expect(response.statusCode).toBe(201);
  });
});

afterAll(() => mongoose.disconnect());
