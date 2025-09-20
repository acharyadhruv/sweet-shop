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

});
