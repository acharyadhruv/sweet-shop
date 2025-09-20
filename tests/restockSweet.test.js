const { restockSweet } = require("../src/controllers/sweetController");
const { Sweet } = require("../src/models/Sweet");

jest.mock("../src/models/Sweet", () => ({
  Sweet: {
    findById: jest.fn(),
  },
}));

describe("restockSweet Controller", () => {
  let req, res, sweetDoc;

  beforeEach(() => {
    req = {
      params: { id: "507f191e810c19729de860ea" },
      body: { quantity: 5 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sweetDoc = {
      _id: req.params.id,
      name: "Rasgulla",
      quantity: 10,
      save: jest.fn().mockResolvedValue(true),
    };

    jest.clearAllMocks();
  });

  // ✅ 1. Invalid quantity
  test("should return 400 if quantity is missing or <= 0", async () => {
    req.body.quantity = 0;

    await restockSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid quantity" });
  });

  // ✅ 2. Invalid ObjectId
  test("should return 404 if id is invalid", async () => {
    req.params.id = "123";

    await restockSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 3. Sweet not found
  test("should return 404 if sweet not found", async () => {
    Sweet.findById.mockResolvedValue(null);

    await restockSweet(req, res);

    expect(Sweet.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 4. Successful restock
  test("should increase stock and return success message", async () => {
    Sweet.findById.mockResolvedValue(sweetDoc);

    await restockSweet(req, res);

    expect(sweetDoc.quantity).toBe(15); // 10 + 5
    expect(sweetDoc.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Restocked",
      sweet: sweetDoc,
    });
  });

  // ✅ 5. CastError
  test("should return 404 if CastError occurs", async () => {
    Sweet.findById.mockRejectedValue({ name: "CastError" });

    await restockSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 6. Unexpected server error
  test("should return 500 on server error", async () => {
    Sweet.findById.mockRejectedValue(new Error("DB crashed"));

    await restockSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});
