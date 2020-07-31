const buildPlainEntity = (dbEntity) => {
  return {
    id: dbEntity.id,
    name: dbEntity.name,
    cpf: dbEntity.cpf,
    email: dbEntity.email,
  };
};

module.exports = ({ Entity }) => {
  const create = async ({ name, cpf, email, password }) => {
    try {
      const result = await Entity.create({ name, cpf, email, password });
      return buildPlainEntity(result);
    } catch (e) {
      throw e;
    }
  };

  return {
    create,
  };
};
