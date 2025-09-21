const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { User, userZodSchema } = require("../src/models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("User Model", () => {
  it("should fail when username is less than 3 chars", async () => {
    const data = { username: "ab", email: "test@test.com", password: "123456" };
    const validation = userZodSchema.safeParse(data);
    expect(validation.success).toBe(false);
  });

  it("should fail for invalid email", async () => {
    const data = { username: "abc", email: "invalidemail", password: "123456" };
    const validation = userZodSchema.safeParse(data);
    expect(validation.success).toBe(false);
  });

  it("should save a valid user", async () => {
    const data = { username: "abc", email: "abc@test.com", password: "123456" };
    const validation = userZodSchema.safeParse(data);
    expect(validation.success).toBe(true);

    const user = await User.create(data);
    expect(user.username).toBe("abc");
    expect(user.role).toBe("customer");
  });
});
