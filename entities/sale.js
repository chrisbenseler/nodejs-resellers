const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
  code: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  status: { type: String, enum: ['Aprovado', 'Em validação']},
  cashback: { type: Number },
  cashbackRatio: { type: Number },
  resellerId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const SaleEntity = mongoose.model("Sale", SaleSchema);

module.exports = SaleEntity;
