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

  const getByEmail = async (email) => {
    const result = await Entity.findOne({ email });
    if (!result) return null;
    return buildPlainEntity(result);
  };

  const getById = async (id) => {
    const result = await Entity.findById(id);
    if (!result) return null;
    return buildPlainEntity(result);
  };

  const getPassword = async (id) => {
    const result = await Entity.findById(id);
    if (!result) return null;
    return result.password;
  };

  return {
    create,
    getByEmail,
    getPassword,
    getById,
  };
};
