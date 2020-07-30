const validators = {
  isValidEmail: (str) => true,
  isBlank: (str) => {
    if (!str) return true;
    return !/\S/.test(str);
  },
};

module.exports = validators;
