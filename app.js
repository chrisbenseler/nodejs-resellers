const Boom = require("@hapi/boom");

const validators = require("./services/validators");

const resellerRepository = require("./repositories/reseller")({});

const resellerUsecase = require("./usecases/reseller")({
  resellerRepository,
  validators,
  errorFactory: Boom,
});

resellerUsecase.create({});
