require("dotenv").config();

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

mongoose.set("strictQuery", false);

const { DB_TEST_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_TEST_URI);
  });

  it("registered user login", async () => {
    const response = await supertest(app).post("/users/login").send({
      email: "example@example.com",
      password: "examplepassword",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe("example@example.com");
    expect(typeof response.body.user.subscription).toBe("string");
    expect(typeof response.body.token).toBe("string");
  });

  it("unregistered user login", async () => {
    const response = await supertest(app).post("/users/login").send({
      email: "testUser2@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Email or password is wrong");
  });
});
