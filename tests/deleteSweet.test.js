const { deleteSweet } = require("../src/controllers/sweetController");
const { Sweet } = require("../src/models/Sweet");

jest.mock("../src/models/Sweet", () => ({
  Sweet: {
    findByIdAndDelete: jest.fn(),
  },
}));

describe("deleteSweet Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "507f191e810c19729de860ea" } }; // valid ObjectId
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ✅ 1. Invalid ID format
  test("should return 404 if id is invalid", async () => {
    req.params.id = "123"; // not 24-char hex

    await deleteSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 2. Sweet deleted successfully
  test("should delete sweet and return success message", async () => {
    Sweet.findByIdAndDelete.mockResolvedValue({ _id: req.params.id, name: "Laddu" });

    await deleteSweet(req, res);

    expect(Sweet.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.json).toHaveBeenCalledWith({ message: "Deleted successfully" });
  });

  // ✅ 3. Sweet not found
  test("should return 404 if sweet does not exist", async () => {
    Sweet.findByIdAndDelete.mockResolvedValue(null);

    await deleteSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 4. CastError
  test("should return 404 if CastError occurs", async () => {
    Sweet.findByIdAndDelete.mockRejectedValue({ name: "CastError" });

    await deleteSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 5. Database/server error
  test("should return 500 on unexpected server error", async () => {
    Sweet.findByIdAndDelete.mockRejectedValue(new Error("DB down"));

    await deleteSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});
