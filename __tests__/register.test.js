require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const config = require("../config/index");
const app = require("../app");
var faker = require("faker");

afterAll(() => mongoose.disconnect());

describe("post /signup", () => {
  test("Create a user", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Create a admin", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "admin",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Create a foundation", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "foundation",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Prevent creation of user that already exists", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: "Kennedy.Bode26@gmail.com",
      password: faker.internet.password(),
      role: "user",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of admin that already exists", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: "Jan.Bradtke21@gmail.com",
      password: faker.internet.password(),
      role: "admin",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of a foundation that already exists", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: "Ben64@hotmail.com",
      password: faker.internet.password(),
      role: "foundation",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of user with empty name", async () => {
    const response = await request(app).post("/signup").send({
      name: "",
      email: "Kennedy.Bode26@gmail.com",
      password: faker.internet.password(),
      role: "user",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of admin with empty name", async () => {
    const response = await request(app).post("/signup").send({
      name: "",
      email: "Jan.Bradtke21@gmail.com",
      password: faker.internet.password(),
      role: "admin",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of a foundation with empty name", async () => {
    const response = await request(app).post("/signup").send({
      name: "",
      email: "Ben64@hotmail.com",
      password: faker.internet.password(),
      role: "foundation",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of user with empty email", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: "",
      password: faker.internet.password(),
      role: "user",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of admin with empty email", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: "",
      password: faker.internet.password(),
      role: "admin",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of a foundation with empty email", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: "",
      password: faker.internet.password(),
      role: "foundation",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of user with empty password", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "",
      role: "user",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of admin with empty password", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "",
      role: "admin",
    });
    expect(response.statusCode).toBe(422);
  });

  test("Prevent creation of a foundation with empty password", async () => {
    const response = await request(app).post("/signup").send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "",
      role: "foundation",
    });
    expect(response.statusCode).toBe(422);
  });
});
