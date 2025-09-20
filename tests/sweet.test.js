const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { sweetZodSchema } = require("../models/Sweet"); // Will fail now

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

describe("Sweet Schema Validation (Red)", () => {
  it("should fail if price is negative", () => {
    const data = { name: "Laddu", category: "Laddu", price: -10, quantity: 5 };
    const validation = sweetZodSchema.safeParse(data);
    expect(validation.success).toBe(false);
  });

  it("should fail if quantity is negative", () => {
    const data = { name: "Jalebi", category: "Jalebi", price: 50, quantity: -5 };
    const validation = sweetZodSchema.safeParse(data);
    expect(validation.success).toBe(false);
  });

  it("should pass for valid sweet", () => {
    const data = { name: "Barfi", category: "Barfi", price: 50, quantity: 10 };
    const validation = sweetZodSchema.safeParse(data);
    expect(validation.success).toBe(true);
  });
});
