const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register } = require("../src/controllers/authController"); // adjust path
const { User } = require("../src/models/User");

// Mock dependencies
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
jest.mock("../src/models/User", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  userZodSchema: {
    parse: jest.fn(),
  },
}));

describe("register Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { username: "John", email: "john@example.com", password: "pass123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ✅ 1. Successful registration
  test("should register user successfully", async () => {
    const parsedData = { ...req.body };
    require("../src/models/User").userZodSchema.parse.mockReturnValue(parsedData);
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed_password");
    User.create.mockResolvedValue({
      _id: "123",
      username: "John",
      email: "john@example.com",
      role: "customer",
    });

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
    expect(User.create).toHaveBeenCalledWith({
      ...parsedData,
      password: "hashed_password",
      role: "customer",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered",
      user: {
        id: "123",
        username: "John",
        email: "john@example.com",
        role: "customer",
      },
    });
  });

  // ✅ 2. Duplicate email
  test("should return 400 if email already exists", async () => {
    require("../src/models/User").userZodSchema.parse.mockReturnValue(req.body);
    User.findOne.mockResolvedValue({ email: "john@example.com" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email already registered" });
  });

  // ✅ 3. Zod validation error
  test("should return 400 if validation fails", async () => {
    const zodError = { message: "Invalid input" };
    require("../src/models/User").userZodSchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid input" });
  });

  // ✅ 4. Zod validation error with errors array
  test("should return 400 with multiple validation errors", async () => {
    const zodError = {
      errors: [{ message: "Email required" }, { message: "Password too short" }],
    };
    require("../src/models/User").userZodSchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ["Email required", "Password too short"],
    });
  });

  // ✅ 5. bcrypt failure
  test("should handle bcrypt hashing error", async () => {
    require("../src/models/User").userZodSchema.parse.mockReturnValue(req.body);
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockRejectedValue(new Error("Hashing failed"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Hashing failed" });
  });

  // ✅ 6. Database create failure
  test("should handle user creation error", async () => {
    require("../src/models/User").userZodSchema.parse.mockReturnValue(req.body);
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed_password");
    User.create.mockRejectedValue(new Error("DB insert failed"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "DB insert failed" });
  });
});
