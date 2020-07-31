const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const express = require("express");
const bodyParser = require("body-parser");

const DBHOST = "mongodb://localhost/resellers_dev";
const PORT = 3000;
const PRIVATEKEY = "randomkeyforjsonwebtoklen";

mongoose.connect(DBHOST, { useNewUrlParser: true });

const app = express();

app.use(bodyParser.json({ type: "application/json" }));

const controllers = require("./controllers");

const validators = require("./services/validators");


const ResellerEntity = require("./entities/reseller");
const resellerRepository = require("./repositories/reseller")({
  Entity: ResellerEntity,
});
const SaleEntity = require("./entities/sale");
const saleRepository = require("./repositories/sale")({
  Entity: SaleEntity,
});



const cashbackService = require("./services/cashback")({ saleRepository })

const tokenGenerator = async (payload) => {
  return await jwt.sign(payload, PRIVATEKEY);
};
const tokenValidator = async (token) => {
  return await jwt.verify(token, PRIVATEKEY);
};

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(Boom.unauthorized("Por favor faça login"));
  }

  const bearerToken = authHeader.split("Bearer ")[1];

  try {
    const result = await tokenValidator(bearerToken);
    req.user = { ...result };
    next();
  } catch (e) {
    return next(Boom.unauthorized("Por favor refaça seu login"));
  }
};

const resellerUsecase = require("./usecases/reseller")({
  resellerRepository,
  saleRepository,
  validators,
  errorFactory: Boom,
  passwordEncrypter: bcrypt.hash,
  passwordComparator: bcrypt.compare,
  tokenGenerator: tokenGenerator,
  cashbackService
});


controllers({ app, resellerUsecase, isAuthenticated })


app.listen(PORT);
