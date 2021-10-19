const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const Foundation = require("../models/Foundation");
const User = require("../models/User");

afterAll(() => {
  mongoose.disconnect();
});

let id_foundation, token_login, id_account;
beforeAll(async () => {
  await Foundation.deleteOne({ email: "test123@124.com" });
  await User.deleteOne({ email: "test124@124.com" });
  const foundation = await Foundation.create({
    email: "test123@124.com",
    password: "bruteForce123",
    name: "test",
    role: "admin",
  });
  id_foundation = foundation._id;
  const account = await User.create({
    email: "test124@124.com",
    password: "bruteForce123",
    name: "test",
    role: "admin",
  });
  id_account = account._id;
  user = await User.findById({ _id: "6149d328ed8fbdf2f1809d21" });
  token_login = jwt.sign({ userId: user._id }, config.jwtKey);
});

describe("delete foundation in route /admin", () => {
  test("responds 401 if user not authenticated", async () => {
    const response = await request(app)
      .delete("/admin")
      .send({ _id: id_foundation });
    expect(response.statusCode).toBe(401);
  });

  test("responds 204 and deletes task", async () => {
    const response = await request(app)
      .delete("/admin")
      .set("Authorization", token_login)
      .send({ _id: id_foundation });

    expect(response.statusCode).toBe(204);
    expect(await Foundation.findById(id_foundation)).toBeNull();
  });
});

describe("get foundation in route /admin", () => {
  test("responds 401 if user not authenticated", async () => {
    const response = await request(app).get("/admin");
    expect(response.statusCode).toBe(401);
  });

  test("responds 200 if user is authenticated", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", token_login);

    expect(response.statusCode).toBe(200);
  });

  test("responds with first 5 foundations", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", token_login);
    expect(response.body.length).toBe(5);
    const listId = [
      "613a2c7cfd818ebfd9e05029",
      "613a5c5e382eee3ccac5bad0",
      "613a749c7c6c0998970eab95",
      "613a86e210ed01add3e4f2ae",
      "613a9b7abd9f8c8d00f6a612",
    ];
    for (let i = 0; i < 5; i++) {
      expect(response.body[i]._id === listId[i]);
    }
  });
});

describe("get user in route /admin/users", () => {
  test("responds 401 if user not authenticated", async () => {
    const response = await request(app).get("/admin/users");
    expect(response.statusCode).toBe(401);
  });

  test("responds 200 if user is authenticated", async () => {
    const response = await request(app)
      .get("/admin/users")
      .set("Authorization", token_login);

    expect(response.statusCode).toBe(200);
  });

  test("responds with first 5 foundations", async () => {
    const response = await request(app)
      .get("/admin/users")
      .set("Authorization", token_login);
    expect(response.body.length).toBe(5);
    const listId = [
      "6138fc6caaafd83875c55886",
      "61390e58aaafd83875c5588b",
      "6139228e8feaac0a27f3408e",
      "613a2456f97b4b51861597d7",
      "613a36fc3f137f463dd892dc",
    ];
    for (let i = 0; i < 5; i++) {
      expect(response.body[i]._id === listId[i]);
    }
  });
});

describe("delete user in route /admin/users", () => {
  test("responds 401 if user not authenticated", async () => {
    const response = await request(app)
      .delete("/admin/users")
      .send({ _id: id_account });
    expect(response.statusCode).toBe(401);
  });

  test("responds 204 and deletes task", async () => {
    const response = await request(app)
      .delete("/admin/users")
      .set("Authorization", token_login)
      .send({ _id: id_account });

    expect(response.statusCode).toBe(204);
    expect(await User.findById(id_account)).toBeNull();
  });
});
