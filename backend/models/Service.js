const mongoose = require("mongoose");

const topcategoriesSchema=new mongoose.Schema({ 
  name:{type:String,required:true},
  icon:{type:String,required:true},
});

const SubcategorySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  topservices:[topcategoriesSchema]
});

const faqSchema = new mongoose.Schema({ 
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const topserviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
});

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  homeImage: { type: String }, // image for main listing
  subcategories: [SubcategorySchema], // array of subcategories
  faqarr:[faqSchema], // array of FAQs
  tagarr: [{ type: String }], // array of tags
  topservices: [topserviceSchema], // array of top services
}, { timestamps: true });

module.exports = mongoose.model("Service", ServiceSchema, "services");
