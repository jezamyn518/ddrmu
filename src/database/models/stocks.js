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
    product_id: { type: ObjectId, required: true, ref: 'products'},
    qty: { type: Number, required: true},
    cost: { type: Number},
    supplier_id: { type: ObjectId, ref: 'supplier'},
  },
  {
    timestamps: true,
    _id: true,
  }
);

var _schema = Mongoose.model("stocks", schema);



module.exports = _schema
