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
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    profile_img: { type: String, default: "/assets/images/users/profile.jpg" },
    scope: { type: Array, required: true, default: "client" },
    isDeleted: { type: Boolean, required: true, default: false },
    isStatus: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    _id: true,
  }
);

var _schema = Mongoose.model("users", schema);

module.exports = _schema;
