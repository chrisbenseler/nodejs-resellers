module.exports = ({}) => {
  const create = async ({ name, cpf, email, password }) => {
    return {
      id: 1,
      name,
      cpf,
      email
    };
  };

  return {
    create,
  };
};
