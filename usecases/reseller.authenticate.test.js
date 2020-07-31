const Boom = require("@hapi/boom");
const dbHandler = require("../tests/db-handler");

const validators = require("../services/validators");

const ResellerEntity = require("../entities/reseller");

const resellerRepository = require("../repositories/reseller")({
  Entity: ResellerEntity,
});

const payload = {
  name: "random name",
  cpf: "random cpf",
  email: "teste@test.com",
  password: "randmon",
};

const resellerUsecase = require("../usecases/reseller")({
  resellerRepository,
  validators,
  errorFactory: Boom,
  passwordEncrypter: (str) => str,
  tokenGenerator: () => 'token',
  passwordComparator: (p1, p2) => p1 === p2
});

describe("Authenticate reseller use case", () => {
  beforeAll(async () => await dbHandler.connect());
  afterEach(async () => await dbHandler.clearDatabase());
  afterAll(async () => await dbHandler.closeDatabase());

  test("validates empty credentials", async () => {
    await expect(
      resellerUsecase.authenticate({
        email: "",
        password: "randopmpwd",
      })
    ).rejects.toThrow(Boom.badData("Por favor informe as credenciais"));
  });

  test("generates token", async () => {
    await ResellerEntity.create(payload);

    const result = await resellerUsecase.authenticate({
      email: payload.email,
      password: payload.password,
    });

    expect(result).toHaveProperty("token");
  });

  test("validates bad password", async () => {

    await ResellerEntity.create(payload);

    await expect(
      resellerUsecase.authenticate({
        email: payload.email,
        password: "any pwd",
      })
    ).rejects.toThrow(Boom.unauthorized("Credenciais inválidas"));

    await expect(
        resellerUsecase.authenticate({
          email: "anyemail@test.com",
          password: payload.password,
        })
      ).rejects.toThrow(Boom.unauthorized("Credenciais inválidas"));
  });
});
