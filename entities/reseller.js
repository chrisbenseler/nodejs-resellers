const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ResellerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true },
  password: { type: String, required: true },
});

const ResellerEntity = mongoose.model("Reseller", ResellerSchema);

module.exports = ResellerEntity;
