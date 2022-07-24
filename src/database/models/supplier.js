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
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
  },
  {
    timestamps: true,
    _id: true,
  }
);

var _schema = Mongoose.model("supplier", schema);

module.exports = _schema;
