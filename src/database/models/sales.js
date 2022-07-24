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
    product_id: { type: ObjectId, required: true, ref: "products" },
    user_id: { type: ObjectId, required: true, ref: "users" },
    qty: { type: Number, required: true },
    total: { type: Number, required: false },
    status: { type: String, required: true, default: "pending" },
    approve_date: { type: Date },
    approve_user_id: { type: ObjectId, ref: "users" },
    isReturn: { type: Boolean, default: false },
    returnDate: { type: Date },
    dateReturn: { type: Date },
    isAcceptReturn: { type: Boolean, default: false },
    note: { type: String },
    isSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    _id: true,
  }
);

var _schema = Mongoose.model("sales", schema);

module.exports = _schema;
