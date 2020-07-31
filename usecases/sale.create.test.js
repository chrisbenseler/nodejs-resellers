const Boom = require("@hapi/boom");
const mongoose = require("mongoose");
const dbHandler = require("../tests/db-handler");

const validators = require("../services/validators");

const SaleEntity = require("../entities/sale");

const saleRepository = require("../repositories/sale")({
  Entity: SaleEntity,
});

const resellerRepository = {
  getById: () => true,
};

const resellerUsecase = require("../usecases/reseller")({
  resellerRepository,
  saleRepository: saleRepository,
  validators,
  errorFactory: Boom,
});

describe("Create new sale use case", () => {
  beforeAll(async () => await dbHandler.connect());
  afterEach(async () => await dbHandler.clearDatabase());
  afterAll(async () => await dbHandler.closeDatabase());

  test("creates new sale", async () => {
    const payload = {
      resellerId: mongoose.Types.ObjectId(),
      code: "randomcode",
      value: 100,
    };
    const result = await resellerUsecase.itemSold(payload);
    expect(result).toHaveProperty("createdAt");
    expect(result.resellerId).toBe(payload.resellerId);
    expect(result.status).toBe("Em validação");
  });

  test("creates new approved sale", async () => {
    const payload = {
      resellerId: mongoose.Types.ObjectId(),
      code: "randomcode",
      value: 100,
    };

    jest.spyOn(resellerRepository, "getById").mockImplementation(() => {
      return {
        cpf: "153.509.460-56",
      };
    });

    const result = await resellerUsecase.itemSold(payload);

    expect(result).toHaveProperty("createdAt");
    expect(result.resellerId).toBe(payload.resellerId);
    expect(result.status).toBe("Aprovado");
  });

  test("validates value", async () => {
    const payload = {
      resellerId: mongoose.Types.ObjectId(),
      code: "randomcode",
      value: -10,
    };
    await expect(resellerUsecase.itemSold(payload)).rejects.toThrow("Valor inválido da transação");
  });

});
