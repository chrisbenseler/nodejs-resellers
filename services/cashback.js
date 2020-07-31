module.exports = ({ saleRepository }) => {
  const calculate = async ({ resellerId, month, year }) => {
    const sales = await saleRepository.findApprovedByPeriod({
      resellerId,
      month,
      year,
    });

    if(sales.length === 0) {
        return { count: 0, cashbackRatio: null }
    }

    const sumSales = sales.reduce((acc, curr) => acc + curr.value, 0);

    let ratio = 0.2;
    if (sumSales <= 1000) {
      ratio = 0.1;
    } else if (sumSales > 1000 && sumSales <= 1500) {
      ratio = 0.15;
    }

    for (const sale of sales) {
      const cashback = parseFloat(sale.value * ratio).toFixed(2);
      await saleRepository.updateCashback({
        id: sale.id,
        cashback,
        cashbackRatio: ratio,
      });
    }

    return { count: sales.length, cashbackRatio: ratio }
  };

  return {
    calculate,
  };
};
