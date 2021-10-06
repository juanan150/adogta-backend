require("dotenv").config();
const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");
const AdoptionRequest = require("../models/AdoptionRequest");
const User = require("../models/User");
const config = require("../config/index");
const app = require("../app");
var faker = require("faker");

afterAll(() => mongoose.disconnect());

describe("post /pets/:petId/request", () => {
  test("Create an Adoption Request", async () => {
    const adoptionUsers = await AdoptionRequest.find();
    const adoptionUsersIds = adoptionUsers
      .map((ele) => ele.userId)
      .toString()
      .split(",");

    const users = await User.find();
    const usersIds = users
      .map((ele) => ele._id)
      .toString()
      .split(",");

    const difference = usersIds.filter(
      (ele) => !adoptionUsersIds.includes(ele)
    );

    const petId = "61392cb386895b8cffc78fa6";

    const token = jwt.sign({ userId: difference[0] }, config.jwtKey);

    const response = await request(app)
      .post(`/pets/${petId}/request`)
      .send({
        userId: difference[0],
        petId: petId,
        description: faker.lorem.sentence(),
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });

  test("Create an Adoption Request without authorization or userId", async () => {
    const adoptionUsers = await AdoptionRequest.find();
    const adoptionUsersIds = adoptionUsers
      .map((ele) => ele.userId)
      .toString()
      .split(",");

    const users = await User.find();
    const usersIds = users
      .map((ele) => ele._id)
      .toString()
      .split(",");

    const difference = usersIds.filter(
      (ele) => !adoptionUsersIds.includes(ele)
    );

    const petId = "61392cb386895b8cffc78fa6";

    const response = await request(app).post(`/pets/${petId}/request`).send({
      userId: difference[0],
      petId: petId,
      description: faker.lorem.sentence(),
    });
    expect(response.statusCode).toBe(401);
  });

  test("A user create another adoption request to the same pet", async () => {
    const petId = "61392cb386895b8cffc78fa6";
    const userId = "6139228e8feaac0a27f3408e";

    const token = jwt.sign({ userId: userId }, config.jwtKey);

    const response = await request(app)
      .post(`/pets/${petId}/request`)
      .send({
        userId: userId,
        petId: petId,
        description: faker.lorem.sentence(),
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(422);
  });

  test("Create an Adoption Request without a petId", async () => {
    const adoptionUsers = await AdoptionRequest.find();
    const adoptionUsersIds = adoptionUsers
      .map((ele) => ele.userId)
      .toString()
      .split(",");

    const users = await User.find();
    const usersIds = users
      .map((ele) => ele._id)
      .toString()
      .split(",");

    const difference = usersIds.filter(
      (ele) => !adoptionUsersIds.includes(ele)
    );

    const petId = null;

    const token = jwt.sign({ userId: difference[0] }, config.jwtKey);

    const response = await request(app)
      .post(`/pets/${petId}/request`)
      .send({
        userId: difference[0],
        petId: petId,
        description: faker.lorem.sentence(),
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(422);
  });

  test("Create an Adoption Request without a description", async () => {
    const adoptionUsers = await AdoptionRequest.find();
    const adoptionUsersIds = adoptionUsers
      .map((ele) => ele.userId)
      .toString()
      .split(",");

    const users = await User.find();
    const usersIds = users
      .map((ele) => ele._id)
      .toString()
      .split(",");

    const difference = usersIds.filter(
      (ele) => !adoptionUsersIds.includes(ele)
    );

    const petId = "61392cb386895b8cffc78fa6";

    const token = jwt.sign({ userId: difference[0] }, config.jwtKey);

    const response = await request(app)
      .post(`/pets/${petId}/request`)
      .send({
        userId: difference[0],
        petId: petId,
        description: null,
      })
      .set("Authorization", token);
    expect(response.statusCode).toBe(422);
  });
});
