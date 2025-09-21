const { purchaseSweet } = require("../src/controllers/sweetController");
const { Sweet } = require("../src/models/Sweet");

jest.mock("../src/models/Sweet", () => ({
  Sweet: {
    findById: jest.fn(),
  },
}));

describe("purchaseSweet Controller", () => {
  let req, res, sweetDoc;

  beforeEach(() => {
    req = {
      params: { id: "507f191e810c19729de860ea" },
      body: { quantity: 2 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // fake sweet doc with save method
    sweetDoc = {
      _id: req.params.id,
      name: "Kaju Katli",
      quantity: 10,
      save: jest.fn().mockResolvedValue(true),
    };

    jest.clearAllMocks();
  });

  // ✅ 1. Invalid quantity
  test("should return 400 if quantity is missing or <= 0", async () => {
    req.body.quantity = 0;

    await purchaseSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid quantity" });
  });

  // ✅ 2. Invalid ObjectId
  test("should return 404 if id is invalid", async () => {
    req.params.id = "123"; // not valid ObjectId

    await purchaseSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 3. Sweet not found
  test("should return 404 if sweet not found", async () => {
    Sweet.findById.mockResolvedValue(null);

    await purchaseSweet(req, res);

    expect(Sweet.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 4. Not enough stock
  test("should return 400 if not enough stock", async () => {
    sweetDoc.quantity = 1; // less than requested
    Sweet.findById.mockResolvedValue(sweetDoc);

    await purchaseSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Not enough stock" });
  });

  // ✅ 5. Successful purchase
  test("should reduce stock and return success message", async () => {
    Sweet.findById.mockResolvedValue(sweetDoc);

    await purchaseSweet(req, res);

    expect(sweetDoc.quantity).toBe(8); // reduced by 2
    expect(sweetDoc.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Purchased",
      sweet: sweetDoc,
    });
  });

  // ✅ 6. CastError
  test("should return 404 if CastError occurs", async () => {
    Sweet.findById.mockRejectedValue({ name: "CastError" });

    await purchaseSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 7. Unexpected server error
  test("should return 500 on server error", async () => {
    Sweet.findById.mockRejectedValue(new Error("DB crashed"));

    await purchaseSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});
