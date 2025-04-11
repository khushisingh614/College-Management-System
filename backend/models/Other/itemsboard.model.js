const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  itemType: { type: String, enum: ["lost", "found", "marketplace"], required: true },
  location: { type: String },
  mobilenumber :{type: String, required: true},
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("ItemBoard", ItemSchema); 