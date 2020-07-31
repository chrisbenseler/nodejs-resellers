const { response } = require("express");

module.exports = ({ saleRepository, httpClient }) => {
  const preApprovewdCPFsList = ["153.509.460-56", "111.222.333-44"];

  const cashbackAPI = {
    url: "https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1/cashback",
    token: "ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm",
  };
  const calculate = async ({ resellerId, month, year }) => {
    const sales = await saleRepository.findApprovedByPeriod({
      resellerId,
      month,
      year,
    });

    if (sales.length === 0) {
      console.log("[Service] calculate cashback", { count: 0, cashbackRatio: null });
      return { count: 0, cashbackRatio: null };
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

    const result = { count: sales.length, cashbackRatio: ratio };
    console.log("[Service] calculate cashback", result);
    return result;
  };

  const status = (cpf) =>
    preApprovewdCPFsList.includes(cpf) ? "Aprovado" : "Em validação";

  const retrieveAccumulatedFromCPF = async (cpf) => {
    console.log("[Service] get accumulated cashback from external API");
    try {
      const parsedCPF = cpf.replace(/[^\w\s]/gi, "");
      const response = await httpClient(cashbackAPI.url + "?cpf=" + parsedCPF, {
        headers: {
          token: cashbackAPI.token,
        },
      });
      return response.data.body;
    } catch (e) {
      throw e;
    }
  };

  return {
    calculate,
    status,
    retrieveAccumulatedFromCPF,
  };
};
