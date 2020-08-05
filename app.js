const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Worker } = require("worker_threads");
const express = require("express");
const bodyParser = require("body-parser");

const cashbackWorker = new Worker("./workers/cashback.js");

require("dotenv").config();

const DBHOST = process.env.DBHOST || "mongodb://localhost/resellers_dev";
const PORT = process.env.PORT || 3000;
const PRIVATEKEY = process.env.PRIVATEKEY || "anything";

mongoose.connect(DBHOST, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log(`Reseller app connected to database`);
});
mongoose.connection.on("error", (error) => {
  console.error(`Reseller app could not connect to database`, error);
  process.exit(error);
});

const controllers = require("./controllers");

const validators = require("./services/validators");
const tokenService = require("./services/token")({
  tokenService: jwt,
  key: PRIVATEKEY,
});

const ResellerEntity = require("./entities/reseller");
const resellerRepository = require("./repositories/reseller")({
  Entity: ResellerEntity,
});
const SaleEntity = require("./entities/sale");
const saleRepository = require("./repositories/sale")({
  Entity: SaleEntity,
});

const cashbackService = require("./services/cashback")({
  saleRepository,
  httpClient: axios,
  worker: cashbackWorker,
});

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(Boom.unauthorized("Por favor faça login"));
  }

  const bearerToken = authHeader.split("Bearer ")[1];

  try {
    const result = await tokenService.validate(bearerToken);
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
  tokenGenerator: tokenService.generate,
  cashbackService,
});

const app = express();

app.use(bodyParser.json({ type: "application/json" }));

controllers({ app, resellerUsecase, isAuthenticated });

app.listen(PORT, () =>
  console.log(`Reseller app listening at http://localhost:${PORT}`)
);
