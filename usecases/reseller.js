module.exports = ({ resellerRepository, validators, errorFactory }) => {
  const create = async ({ name, cpf, email }) => {
    if (!validators.isValidEmail(email)) {
      throw errorFactory.badData("E-mail inválido");
    }
    if (validators.isBlank(name)) {
      throw errorFactory.badData("Nome em branco");
    }
    return true;
  };

  return {
    create,
  };
};
