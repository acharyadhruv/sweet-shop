const { register } = require("../src/controllers/authController");
const { User, userZodSchema } = require("../src/models/User");
const bcrypt = require("bcryptjs");

// Mock dependencies
jest.mock("bcryptjs", () => ({ hash: jest.fn() }));
jest.mock("../src/models/User", () => ({
  User: { findOne: jest.fn(), create: jest.fn() },
  userZodSchema: { parse: jest.fn() },
}));

describe("register controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { username: "John", email: "john@example.com", password: "pass123" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  test("should return 400 if email already exists", async () => {
    userZodSchema.parse.mockReturnValue(req.body);

    // ✅ Simulate email already in DB
    User.findOne.mockResolvedValue({ email: "john@example.com" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email already registered" });
  });
});
