const { register } = require("../src/controllers/authController");
const { userZodSchema } = require("../src/models/User");

// Mock Zod parse
jest.mock("../src/models/User", () => ({
  userZodSchema: { parse: jest.fn() },
  User: { findOne: jest.fn(), create: jest.fn() }, // still minimal
}));

describe("register controller with Zod", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { username: "John", email: "john@example.com", password: "pass123" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  test("should parse input with Zod and return 201", async () => {
    // ✅ Mock Zod parse to return input data
    userZodSchema.parse.mockReturnValue(req.body);

    await register(req, res);

    expect(userZodSchema.parse).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "User registered", user: req.body });
  });
});
