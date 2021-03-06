module.exports = ({
  resellerRepository,
  saleRepository,
  validators,
  errorFactory,
  passwordEncrypter,
  passwordComparator,
  tokenGenerator,
  cashbackService,
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

    if (!validators.saleValue(value)) {
      throw errorFactory.badData("Valor inválido da transação");
    }

    const reseller = await resellerRepository.getById(resellerId);
    if (!reseller) {
      throw errorFactory.badData("Revendedor não encontrado");
    }

    const status = cashbackService.status(reseller.cpf);

    const result = await saleRepository.create({
      code,
      value,
      resellerId,
      status,
    });

    //calculateCashback is called asynchronously to avoid blocking the event loop; this could be a batch proccess or
    //use a message broker (PubSub/Redis/etc?) to other service start this process
    cashbackService.calculate({
      resellerId: reseller.id,
      month: result.createdAt.getMonth() + 1,
      year: result.createdAt.getFullYear(),
    });

    return result;
  };

  const listSalesWithCashback = async (id) => {
    return await saleRepository.findByResellerId(id);
  };

  const cashbackAccumulated = async cpf => {
    return await cashbackService.retrieveAccumulatedFromCPF(cpf);
  }

  return {
    create,
    authenticate,
    profile,
    itemSold,
    listSalesWithCashback,
    cashbackAccumulated
  };
};
