const { parentPort } = require("worker_threads");

parentPort.on("message", (data) => {
  const sales = [...data.sales];
  if (sales.length === 0) {
    parentPort.postMessage({ ratio: null });
  }

  const sumSales = sales.reduce((acc, curr) => acc + curr.value, 0);

  let ratio = 0.2;
  if (sumSales <= 1000) {
    ratio = 0.1;
  } else if (sumSales > 1000 && sumSales <= 1500) {
    ratio = 0.15;
  }

  parentPort.postMessage({ ratio });
});
