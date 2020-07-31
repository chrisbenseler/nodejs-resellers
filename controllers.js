module.exports = ({ app, resellerUsecase, isAuthenticated }) => {
  app.get("/healthcheck", (req, res) => {
    res.json({ status: "OK " });
  });

  app.post("/auth/signup", async (req, res, next) => {
    console.log("[Controller] auth sign up", req.body);
    const { name, email, cpf, password } = req.body;
    try {
      const result = await resellerUsecase.create({
        name,
        email,
        cpf,
        password,
      });
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

  app.post("/resellers/sales", isAuthenticated, async (req, res, next) => {
    console.log("[Controller] reseller new sale");
    const { code, value } = req.body;
    try {
      const result = await resellerUsecase.itemSold({
        resellerId: req.user.id,
        code,
        value,
      });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  app.get("/resellers/sales", isAuthenticated, async (req, res, next) => {
    console.log("[Controller] reseller new sale");

    try {
      const result = await resellerUsecase.listSalesWithCashback(req.user.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  app.get("/resellers/:cpf/cashback", async (req, res, next) => {
    console.log("[Controller] reseller cashback");

    const cpf = req.params.cpf;

    try {
      const result = await resellerUsecase.cashbackAccumulated(cpf);
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
      console.error(err.output);
      return res.status(err.output.statusCode).json(err.output.payload);
    }
    console.error("Unhandled error", err);
    res.status(500).json(err);
  });
};
