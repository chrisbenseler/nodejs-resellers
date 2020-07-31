const Boom = require("@hapi/boom");
const dbHandler = require("../tests/db-handler");

const validators = require("../services/validators");

const ResellerEntity = require("../entities/reseller");

const resellerRepository = require("../repositories/reseller")({ Entity: ResellerEntity });

const resellerUsecase = require("../usecases/reseller")({
  resellerRepository,
  validators,
  errorFactory: Boom,
  passwordEncrypter: (str) => str,
});

describe("Create reseller use case", () => {
  
  beforeAll(async () => await dbHandler.connect());
  afterEach(async () => await dbHandler.clearDatabase());
  afterAll(async () => await dbHandler.closeDatabase());

  test("validates blank name", async () => {
    await expect(
      resellerUsecase.create({
        name: "",
        cpf: "123456789-00",
        email: "teste@teste.com",
      })
    ).rejects.toThrow(Boom.badData("Nome em branco"));
    await expect(
      resellerUsecase.create({
        name: "  ",
        cpf: "123456789-00",
        email: "teste@teste.com",
      })
    ).rejects.toThrow(Boom.badData("Nome em branco"));
  });

  test("creates user", async () => {
    const payload = {
      name: "random name",
      cpf: "123456789-00",
      email: "teste@teste.com",
      password: "testeteste",
    };

    const result = await resellerUsecase.create(payload);
    expect(result.name).toBe(payload.name);
    expect(result).toHaveProperty("id");
    expect(result).not.toHaveProperty("_id"); //no reference to db internals
  });

  test("invalid password", async () => {
    const payload = {
      name: "random name",
      cpf: "123456789-00",
      email: "teste@teste.com",
      password: " ",
    };
    await expect(
      resellerUsecase.create({
        name: "random name",
        cpf: "123456789-00",
        email: "teste@teste.com",
      })
    ).rejects.toThrow(
      Boom.badData("Senha informada não atende os requisitos de segurança")
    );
  });
});
