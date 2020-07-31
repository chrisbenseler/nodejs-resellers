const validators = {
  isValidEmail: (str) => true,
  isBlank: (str) => {
    if (!str) return true;
    return !/\S/.test(str);
  },
  isValidCPF: str => {
      return true;
  },
  passwordPattern: str => {
      //custom rules for password
      if (!str) return false;

      if(!/\S/.test(str)) return false;

      if(str.trim().length < 4) return false;

      return true;
  }
};

module.exports = validators;
