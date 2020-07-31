const moment = require("moment");

const buildPlainEntity = (dbEntity) => {
  return {
    id: dbEntity.id,
    code: dbEntity.code,
    value: dbEntity.value,
    createdAt: dbEntity.createdAt,
    resellerId: dbEntity.resellerId,
    cashback: dbEntity.cashback,
    cashbackRatio: dbEntity.cashbackRatio,
    status: dbEntity.status,
  };
};

module.exports = ({ Entity }) => {
  const create = async ({ code, value, resellerId, status }) => {
    try {
      const result = await Entity.create({
        code,
        value,
        resellerId,
        status,
        createdAt: new Date(),
      });
      return buildPlainEntity(result);
    } catch (e) {
      throw e;
    }
  };

  const findByResellerId = async (resellerId) => {
    const items = await Entity.find({ resellerId });
    return items.map((item) => buildPlainEntity(item));
  };

  const updateCashback = async ({ id, cashback, cashbackRatio }) => {
    await Entity.updateOne({ _id: id }, { cashback, cashbackRatio });
  };

  const findApprovedByPeriod = async ({ resellerId, month, year }) => {
    const startOfMonth = moment().set({ month: month - 1, year }).startOf("month");
    const endOfMonth = moment().set({ month: month - 1, year }).endOf("month");


    const items = await Entity.find({
      resellerId,
      status: "Aprovado",
      createdAt: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    return items.map((item) => buildPlainEntity(item));
  };

  return {
    create,
    findByResellerId,
    updateCashback,
    findApprovedByPeriod,
  };
};
