module.exports = ({
  resellerRepository,
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

  return {
    create,
    authenticate,
    profile
  };
};
