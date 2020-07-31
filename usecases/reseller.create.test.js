const Boom = require("@hapi/boom");
const validators = require("../services/validators");
const resellerRepository = require("../repositories/reseller")({});

const resellerUsecase = require("../usecases/reseller")({
  resellerRepository,
  validators,
  errorFactory: Boom,
  passwordEncrypter: str => str
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

 
  test("creates user", async () => {
    const payload = {
      name: "random name",
      cpf: "123456789-00",
      email: "teste@teste.com",
      password: "testeteste"
    };
    const result = await resellerUsecase.create(payload);

    expect(result.name).toBe(payload.name);
    expect(result).toHaveProperty("id");
  });

  test("invalid password", async () => {
    const payload = {
      name: "random name",
      cpf: "123456789-00",
      email: "teste@teste.com",
      password: " "
    };
    await expect(
      resellerUsecase.create({
        name: "random name",
        cpf: "123456789-00",
        email: "teste@teste.com",
      })
    ).rejects.toThrow(Boom.badData("Senha informada não atende os requisitos de segurança"));
  });

});
