const mongoose = require("mongoose");

const serviceTagSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model("ServiceTag", serviceTagSchema, "servicetags");
