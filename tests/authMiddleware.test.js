// tests/authMiddleware.test.js
const { protect, isAdmin } = require("../src/middlewares/authMiddleware");
const { User } = require("../src/models/User");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");
jest.mock("../src/models/User");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  describe("protect middleware", () => {
    test("should return 401 if no token", async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    });

    test("should return 401 if token invalid", async () => {
      req.headers.authorization = "Bearer faketoken";
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid");
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    });

    test("should return 401 if user not found", async () => {
      req.headers.authorization = "Bearer validtoken";
      jwt.verify.mockReturnValue({ id: "123" });

      // Mock chain: User.findById().select()
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid token user" });
    });

    test("should attach user to req and call next", async () => {
      req.headers.authorization = "Bearer validtoken";
      jwt.verify.mockReturnValue({ id: "123" });

      const mockUser = { _id: "123", username: "John", role: "customer" };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("isAdmin middleware", () => {
    test("should return 403 if user is not admin", () => {
      req.user = { role: "customer" };

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Admins only" });
    });

    test("should call next if user is admin", () => {
      req.user = { role: "admin" };

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
