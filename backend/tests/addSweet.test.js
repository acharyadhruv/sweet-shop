// 1. Mock first!
jest.mock("../src/models/Sweet", () => ({
    Sweet: { create: jest.fn() },
    sweetZodSchema: { parse: jest.fn() },
  }));
  
  // 2. Now import after mocks
  const { Sweet, sweetZodSchema } = require("../src/models/Sweet");
  const { addSweet } = require("../src/controllers/sweetController");
  
  describe("addSweet Controller", () => {
    let req, res;
  
    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      Sweet.create.mockReset();
      sweetZodSchema.parse.mockReset();
    });
  
    test("should create sweet successfully with valid data", async () => {
      const validData = { name: "Gulab Jamun", category: "Other", price: 250, quantity: 50 };
      req.body = validData;
  
      sweetZodSchema.parse.mockReturnValue(validData);
      Sweet.create.mockResolvedValue({ _id: "1", ...validData });
  
      await addSweet(req, res);
  
      expect(sweetZodSchema.parse).toHaveBeenCalledWith(validData);
      expect(Sweet.create).toHaveBeenCalledWith(validData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: "1", ...validData });
    });
  
    test("should return 400 if validation fails", async () => {
      sweetZodSchema.parse.mockImplementation(() => {
        throw { errors: [{ message: "Name required" }] };
      });
  
      await addSweet(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Name required" });
    });
  
    test("should return 400 for duplicate sweet name", async () => {
      const validData = { name: "Gulab Jamun" };
      sweetZodSchema.parse.mockReturnValue(validData);
      Sweet.create.mockImplementation(() => {
        throw { code: 11000 };
      });
  
      await addSweet(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Duplicate sweet name already exists" });
    });
  
    test("should return 400 for general DB error", async () => {
      const validData = { name: "Barfi" };
      sweetZodSchema.parse.mockReturnValue(validData);
      Sweet.create.mockImplementation(() => {
        throw new Error("DB failed");
      });
  
      await addSweet(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB failed" });
    });
  });
  