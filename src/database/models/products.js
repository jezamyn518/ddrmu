"use strict";
/**
 * ## Imports
 *
 */
//Mongoose - the ORM
var Mongoose = require("mongoose"),
  ObjectId = Mongoose.Schema.Types.ObjectId,
  Schema = Mongoose.Schema;

const schema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: false },
    category_id: { type: ObjectId, required: true, ref: "category" },
    brand_id: { type: ObjectId, required: true, ref: "brand" },
    unit_id: { type: ObjectId, required: true, ref: "unit" },
    code: { type: String },
    img: {
      type: String,
      default: "/assets/images/products/product-default.jpg",
    },
    isDeleted: { type: Boolean, required: true, default: false },
    isReturn: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    _id: true,
  }
);

var _schema = Mongoose.model("products", schema);

module.exports = _schema;
