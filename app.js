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

const validators = require("./services/validators");

const ResellerEntity = require("./entities/reseller");
const resellerRepository = require("./repositories/reseller")({
  Entity: ResellerEntity,
});

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
  validators,
  errorFactory: Boom,
  passwordEncrypter: bcrypt.hash,
  passwordComparator: bcrypt.compare,
  tokenGenerator: tokenGenerator,
});

app.get("/healthcheck", (req, res) => {
  res.json({ status: "OK " });
});

app.post("/auth/signup", async (req, res, next) => {
  console.log("[Controller] auth sign up", req.body);
  const { name, email, cpf, password } = req.body;
  try {
    const result = await resellerUsecase.create({ name, email, cpf, password });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

app.post("/auth/signin", async (req, res, next) => {
  console.log("[Controller] auth sign in");
  const { password, email } = req.body;
  try {
    const result = await resellerUsecase.authenticate({ email, password });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.get("/auth/profile", isAuthenticated, async (req, res, next) => {
  console.log("[Controller] auth profile");

  try {
    const result = await resellerUsecase.profile(req.user.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

//error handler
app.use((err, req, res, next) => {
  if (!err) {
    next();
  }
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  console.error("Unhandled error", err);
  res.status(500).json(err);
});

app.listen(PORT);
