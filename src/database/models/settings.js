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
    name: { type: String},
    type: { type: String}
  },
  {
    timestamps: true,
    _id: true,
  }
);

var _schema = Mongoose.model("settings", schema);



module.exports = _schema
