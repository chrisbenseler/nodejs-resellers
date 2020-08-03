module.exports = ({ tokenService, key }) => {
  const generate = async (payload) => {
    return await tokenService.sign(payload, key, { expiresIn: "24h" });
  };
  const validate = async (token) => {
    return await tokenService.verify(token, key);
  };

  return {
    generate,
    validate,
  };
};
