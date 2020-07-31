module.exports = ({
  resellerRepository,
  saleRepository,
  validators,
  errorFactory,
  passwordEncrypter,
  passwordComparator,
  tokenGenerator,
}) => {
  const create = async ({ name, cpf, email, password }) => {
    if (!validators.isValidEmail(email)) {
      throw errorFactory.badData("E-mail inválido");
    }
    if (validators.isBlank(name)) {
      throw errorFactory.badData("Nome em branco");
    }
    if (!validators.isValidCPF(cpf)) {
      throw errorFactory.badData("CPF inválido");
    }
    if (!validators.passwordPattern(password)) {
      throw errorFactory.badData(
        "Senha informada não atende os requisitos de segurança"
      );
    }

    const storedReseller = await resellerRepository.getByEmail(email);

    if (storedReseller) {
      throw errorFactory.badData("E-mail já em uso");
    }

    return await resellerRepository.create({
      name,
      cpf,
      email,
      password: await passwordEncrypter(password, 10),
    });
  };

  const authenticate = async ({ email, password }) => {
    if (validators.isBlank(email) || validators.isBlank(password)) {
      throw errorFactory.badData("Por favor informe as credenciais");
    }

    const result = await resellerRepository.getByEmail(email);

    if (!result) {
      throw errorFactory.unauthorized("Credenciais inválidas");
    }

    const storedPassword = await resellerRepository.getPassword(result.id);

    const isValidPWD = await passwordComparator(password, storedPassword);
    if (!isValidPWD) {
      throw errorFactory.unauthorized("Credenciais inválidas");
    }
    return {
      token: await tokenGenerator({ id: result.id }),
    };
  };

  const profile = async (id) => {
    return await resellerRepository.getById(id);
  };

  const itemSold = async ({ resellerId, code, value }) => {
    if (validators.isBlank(code) || validators.isBlank(value)) {
      throw errorFactory.badData("Dados da compra inválidos");
    }

    if(!validators.saleValue(value)) {
        throw errorFactory.badData("Valor inválido da transação");
    }

    const reseller = await resellerRepository.getById(resellerId);
    if (!reseller) {
      throw errorFactory.badData("Revendedor não encontrado");
    }

    const status =
      reseller.cpf === "153.509.460-56" ? "Aprovado" : "Em validação";
    const result = await saleRepository.create({
      code,
      value,
      resellerId,
      status,
    });

    return result;
  };

  return {
    create,
    authenticate,
    profile,
    itemSold,
  };
};
