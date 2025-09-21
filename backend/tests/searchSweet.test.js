const { searchSweets } = require("../src/controllers/sweetController");
const { Sweet } = require("../src/models/Sweet");

jest.mock("../src/models/Sweet", () => ({
  Sweet: { find: jest.fn() },
}));

describe("searchSweets Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  // ✅ 1. No query (return all)
  test("should return all sweets when no query params provided", async () => {
    const mockSweets = [{ name: "Gulab Jamun", price: 100 }];
    Sweet.find.mockResolvedValue(mockSweets);

    await searchSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith(mockSweets);
  });

  // ✅ 2. Search by name (regex)
  test("should search sweets by name", async () => {
    req.query = { name: "laddu" };
    const mockSweets = [{ name: "Besan Laddu", price: 150 }];
    Sweet.find.mockResolvedValue(mockSweets);

    await searchSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledWith({
      name: { $regex: "laddu", $options: "i" },
    });
    expect(res.json).toHaveBeenCalledWith(mockSweets);
  });

  // ✅ 3. Search by category
  test("should filter sweets by category", async () => {
    req.query = { category: "Barfi" };
    const mockSweets = [{ name: "Kaju Barfi", category: "Barfi", price: 200 }];
    Sweet.find.mockResolvedValue(mockSweets);

    await searchSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledWith({ category: "Barfi" });
    expect(res.json).toHaveBeenCalledWith(mockSweets);
  });

  // ✅ 4. Filter by minPrice
  test("should filter sweets by minPrice", async () => {
    req.query = { minPrice: "100" };
    Sweet.find.mockResolvedValue([]);

    await searchSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledWith({ price: { $gte: 100 } });
  });

  // ✅ 5. Filter by maxPrice
  test("should filter sweets by maxPrice", async () => {
    req.query = { maxPrice: "200" };
    Sweet.find.mockResolvedValue([]);

    await searchSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledWith({ price: { $lte: 200 } });
  });

  // ✅ 6. Filter by minPrice and maxPrice
  test("should filter sweets between minPrice and maxPrice", async () => {
    req.query = { minPrice: "100", maxPrice: "300" };
    Sweet.find.mockResolvedValue([]);

    await searchSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledWith({
      price: { $gte: 100, $lte: 300 },
    });
  });

  // ✅ 7. Invalid min/max price should be ignored
  test("should ignore invalid minPrice/maxPrice values", async () => {
    req.query = { minPrice: "abc", maxPrice: "xyz" };
    Sweet.find.mockResolvedValue([]);

    await searchSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledWith({});
  });

  // ✅ 8. Handle DB error
  test("should return 500 if database query fails", async () => {
    Sweet.find.mockRejectedValue(new Error("DB error"));

    await searchSweets(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});
