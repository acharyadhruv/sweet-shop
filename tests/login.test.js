const { login } = require("../src/controllers/authController");
const { User } = require("../src/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("bcryptjs", () => ({ compare: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));
jest.mock("../src/models/User", () => ({
  User: { findOne: jest.fn() },
}));

describe("login controller - missing fields", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { email: "", password: "" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  test("should return 500 if email or password is missing", async () => {
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email and password are required",
    });
  });
  test("should return 401 if user does not exist", async () => {
  // Provide valid email & password to bypass missing fields
  req.body = { email: "john@example.com", password: "pass123" };

  // Mock User.findOne to return null → user not found
  User.findOne.mockResolvedValue(null);

  await login(req, res);

  expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
});
test("should return 401 if password does not match", async () => {
  req.body = { email: "john@example.com", password: "wrongpass" };

  // Mock User.findOne to return a user
  const mockUser = { _id: "123", password: "hashed_password", role: "customer" };
  User.findOne.mockResolvedValue(mockUser);

  // Mock bcrypt.compare to return false → password mismatch
  const bcrypt = require("bcryptjs");
  bcrypt.compare.mockResolvedValue(false);

  await login(req, res);

  expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashed_password");
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
});
test("should return token and role on successful login", async () => {
  req.body = { email: "john@example.com", password: "pass123" };

  const mockUser = {
    _id: "123",
    email: "john@example.com",
    password: "hashed_password",
    role: "customer",
  };

  // Mock user exists
  User.findOne.mockResolvedValue(mockUser);

  // Mock password match
  const bcrypt = require("bcryptjs");
  bcrypt.compare.mockResolvedValue(true);

  // Mock JWT sign
  const jwt = require("jsonwebtoken");
  jwt.sign.mockReturnValue("mocked_token");

  await login(req, res);

  expect(jwt.sign).toHaveBeenCalledWith(
    { id: mockUser._id, role: mockUser.role },
    "testsecret",
    { expiresIn: "1d" }
  );

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Login successful",
    token: "mocked_token",
    role: "customer",
  });
});
test("should return 500 on unexpected error", async () => {
  req.body = { email: "john@example.com", password: "pass123" };

  // Mock User.findOne to throw error → simulate DB crash
  User.findOne.mockRejectedValue(new Error("DB crashed"));

  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "DB crashed" });
});


});
