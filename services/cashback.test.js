const cashback = require("./cashback");

const cashbackService = cashback({
  saleRepository: {
    findApprovedByPeriod: ({ resellerId }) => {
      if (resellerId === 1) {
        return [{ value: 100 }, { value: 100 }, { value: 300 }];
      }
      if (resellerId === 2) {
        return [];
      }
      return [
        { value: 100 },
        { value: 100 },
        { value: 300 },
        { value: 700 },
        { value: 500 },
      ];
    },
    updateCashback: () => {}
  },
});

describe("Cashback service", () => {
  test("calculate ratio 0.1", async () => {
    const result = await cashbackService.calculate({ resellerId: 1 });
    expect(result.cashbackRatio).toBe(0.1);
    expect(result.count).toBe(3);
  });

  test("calculate ratio 0.2", async () => {
    const result = await cashbackService.calculate({ resellerId: 3 });
    expect(result.cashbackRatio).toBe(0.2);
    expect(result.count).toBe(5);
  });

  test("no ratio", async () => {
    const result = await cashbackService.calculate({ resellerId: 2 });
    expect(result.cashbackRatio).toBe(null);
    expect(result.count).toBe(0);
  });

});
