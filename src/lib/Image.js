"use strict";
// our configurations
var Config = require("../config"),
  Sharp = require("sharp"),
  fs = require("fs"),
  _ = require("lodash");

exports.upload = function (file, img_name) {
  var base64Image = file;
  var storagelink = `src/assets/images/products/${img_name}.jpg`;
  Sharp(base64Image)
    .resize({
      width: 500,
      height: 500,
      fit: Sharp.fit.cover,
    })
    .toFile(storagelink)
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      return false;
    });
};

exports.uploadUser = function (file, img_name) {
  var base64Image = file;
  var storagelink = `src/assets/images/users/${img_name}.jpg`;
  Sharp(base64Image)
    .resize({
      width: 500,
      height: 500,
      fit: Sharp.fit.cover,
    })
    .toFile(storagelink)
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      return false;
    });
};
exports.uploadLogo = function (file, img_name) {
  var base64Image = file;
  var storagelink = `src/assets/images/logo/${img_name}.jpg`;
  Sharp(base64Image)
    .resize({
      width: 500,
      height: 500,
      fit: Sharp.fit.cover,
    })
    .toFile(storagelink)
    .then((data) => {
      console.log(data);
      return true;
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      return false;
    });
};
exports.remove = function (file) {
  var folderDirectory = __dirname.replace("lib", "");
  try {
    if (!_.isEmpty(file)) {
      fs.unlinkSync(folderDirectory + file);
    }
  } catch (err) {
    console.error(err);
  }
  return;
};
