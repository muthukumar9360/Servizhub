const mongoose = require("mongoose");

const serviceTopCategorySchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  name: { type: String, required: true },
  icon: { type: String, required: true } 
});

module.exports = mongoose.model("ServiceTopCategory", serviceTopCategorySchema, "topservice");
