// tests/getSweets.test.js
const { getSweets } = require("../src/controllers/sweetController");
const { Sweet } = require("../src/models/Sweet");

jest.mock("../src/models/Sweet", () => ({
  Sweet: { find: jest.fn() },
}));

describe("getSweets Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  test("should return all sweets successfully", async () => {
    const mockSweets = [{ name: "Gulab Jamun", price: 100, quantity: 10 }];
    Sweet.find.mockResolvedValue(mockSweets);

    await getSweets(req, res);

    expect(Sweet.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockSweets);
  });
});
