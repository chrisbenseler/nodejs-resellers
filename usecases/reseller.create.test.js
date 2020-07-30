const Boom = require("@hapi/boom");
const validators = require("../services/validators");

const resellerUsecase = require("../usecases/reseller")({
  resellerRepository: {},
  validators,
  errorFactory: Boom,
});

describe("Create reseller use case", () => {
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
});
