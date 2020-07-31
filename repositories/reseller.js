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

  const findByEmailAndPassword = async ({ email, password }) => {
    const result = await Entity.findOne({ email, password });
    if (!result) return null;
    return buildPlainEntity(result);
  };

  const getByEmail = async  (email) => {
    const result = await Entity.findOne({ email });
    if (!result) return null;
    return buildPlainEntity(result);
  };

  return {
    create,
    findByEmailAndPassword,
    getByEmail
  };
};
