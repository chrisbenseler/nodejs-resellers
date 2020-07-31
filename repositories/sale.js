const buildPlainEntity = (dbEntity) => {
  return {
    id: dbEntity.id,
    code: dbEntity.code,
    value: dbEntity.value,
    createdAt: dbEntity.createdAt,
    resellerId: dbEntity.resellerId,
    status: dbEntity. status
  };
};

module.exports = ({ Entity }) => {
  const create = async ({ code, value, resellerId, status }) => {
    try {
      const result = await Entity.create({
        code,
        value,
        resellerId,
        status,
        createdAt: new Date(),
      });
      return buildPlainEntity(result);
    } catch (e) {
      throw e;
    }
  };

  /*
  const findByEmailAndPassword = async ({ email, password }) => {
    const result = await Entity.findOne({ email, password });
    if (!result) return null;
    return buildPlainEntity(result);
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
  */

  return {
    create,
  };
};
