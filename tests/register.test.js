const { register } = require("../src/controllers/authController");

// Minimal test to start TDD
describe("register controller", () => {
  test("should register user successfully", async () => {
    const req = { body: { username: "John", email: "john@example.com", password: "pass123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req, res);

    // ✅ Expect 201 status, even though controller is minimal
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "User registered" });
  });
});
