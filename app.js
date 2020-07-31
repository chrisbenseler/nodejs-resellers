const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');


const validators = require("./services/validators");

const resellerRepository = require("./repositories/reseller")({});

const resellerUsecase = require("./usecases/reseller")({
  resellerRepository,
  validators,
  errorFactory: Boom,
  passwordEncrypter: bcrypt.hash
});

resellerUsecase.create({ name: "aaaa",  cpf: "sadsadsa", email: "teste@teste.com.br", password: "sadsad"})
