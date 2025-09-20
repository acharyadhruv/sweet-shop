const { updateSweet } = require("../src/controllers/sweetController");
const { Sweet } = require("../src/models/Sweet");
const { sweetZodSchema } = require("../src/models/Sweet");

jest.mock("../src/models/Sweet", () => ({
  Sweet: {
    findByIdAndUpdate: jest.fn(),
  },
  sweetZodSchema: {
    partial: jest.fn().mockReturnValue({
      parse: jest.fn(),
    }),
  },
}));

describe("updateSweet Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "507f191e810c19729de860ea" }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ✅ 1. Invalid ID format
  test("should return 404 if id is invalid", async () => {
    req.params.id = "123"; // not valid ObjectId

    await updateSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 2. Successful update
  test("should update sweet and return updated doc", async () => {
    const updatedSweet = { _id: req.params.id, name: "Updated Laddu", price: 200 };

    // mock zod parse and mongoose update
    require("../src/models/Sweet").sweetZodSchema.partial().parse.mockReturnValue({ name: "Updated Laddu", price: 200 });
    Sweet.findByIdAndUpdate.mockResolvedValue(updatedSweet);

    await updateSweet(req, res);

    expect(Sweet.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      { name: "Updated Laddu", price: 200 },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith(updatedSweet);
  });

  // ✅ 3. Not found after update
  test("should return 404 if sweet not found", async () => {
    require("../src/models/Sweet").sweetZodSchema.partial().parse.mockReturnValue({});
    Sweet.findByIdAndUpdate.mockResolvedValue(null);

    await updateSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 4. Zod validation error
  test("should return 400 if zod validation fails", async () => {
    const zodError = { errors: [{ message: "Name is required" }] };
    require("../src/models/Sweet").sweetZodSchema.partial().parse.mockImplementation(() => {
      throw zodError;
    });

    await updateSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Name is required" });
  });

  // ✅ 5. Mongoose validation error
  test("should return 400 if mongoose validation fails", async () => {
    require("../src/models/Sweet").sweetZodSchema.partial().parse.mockReturnValue({});
    const mongooseError = {
      name: "ValidationError",
      errors: { price: { message: "Price must be positive" } },
    };
    Sweet.findByIdAndUpdate.mockRejectedValue(mongooseError);

    await updateSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Price must be positive" });
  });

  // ✅ 6. CastError handling
  test("should return 404 if CastError occurs", async () => {
    require("../src/models/Sweet").sweetZodSchema.partial().parse.mockReturnValue({});
    Sweet.findByIdAndUpdate.mockRejectedValue({ name: "CastError" });

    await updateSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
  });

  // ✅ 7. Unknown error with message
  test("should return 400 with error message on unknown error", async () => {
    require("../src/models/Sweet").sweetZodSchema.partial().parse.mockReturnValue({});
    Sweet.findByIdAndUpdate.mockRejectedValue(new Error("Something went wrong"));

    await updateSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
  });

  // ✅ 8. Unknown error without message
  test("should return 400 with default error if unknown error has no message", async () => {
    require("../src/models/Sweet").sweetZodSchema.partial().parse.mockReturnValue({});
    Sweet.findByIdAndUpdate.mockRejectedValue({});

    await updateSweet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid request" });
  });
});
