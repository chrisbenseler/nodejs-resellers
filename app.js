const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");

const DBHOST = "mongodb://localhost/resellers_dev";
const PORT = 3000;

mongoose.connect(DBHOST, { useNewUrlParser: true });

const app = express();

app.use(bodyParser.json({ type: "application/json" }));

const validators = require("./services/validators");

const ResellerEntity = require("./entities/reseller");
const resellerRepository = require("./repositories/reseller")({
  Entity: ResellerEntity,
});

const resellerUsecase = require("./usecases/reseller")({
  resellerRepository,
  validators,
  errorFactory: Boom,
  passwordEncrypter: bcrypt.hash,
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

//error handler
app.use((err, req, res, next) => {
  if (!err) {
    next();
  }
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  res.status(500).json();
});

app.listen(PORT);

/*






resellerUsecase.create({ name: "aaaa",  cpf: "sadsadsa", email: "teste@teste.com.br", password: "sadsad"})
*/
