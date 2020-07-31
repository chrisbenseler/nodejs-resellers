module.exports = ({
  resellerRepository,
  validators,
  errorFactory,
  passwordEncrypter,
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

    return await resellerRepository.create({ name, cpf, email, password: await passwordEncrypter(password, 10) });
  };

  return {
    create,
  };
};
