'use strict';

var Mongoose = require('mongoose'),
  Config = require('../config');

var connection_string = '';

if (Config.env.dev) {
  connection_string =
    'mongodb://' +
    Config.mongodb_local.ip +
    ':' +
    Config.mongodb_local.port +
    '/' +
    Config.mongodb_local.app +
    '?authSource=admin';
  console.log('DATABASE CONNECTED @ ' + connection_string);
} else {
  connection_string =
    'mongodb://' +
    Config.mongodb_production.username +
    ':' +
    Config.mongodb_production.password +
    '@' +
    Config.mongodb_production.ip +
    ':' +
    Config.mongodb_production.port +
    '/' +
    Config.mongodb_production.app +
    '?authSource=admin';

  console.log('WARNING !!! ================================ !!! WARNING');
  console.log('WARNING !!! CONNECTED TO PRODUCTION DATABASE !!! WARNING');
  console.log('WARNING !!! ================================ !!! WARNING');
  // console.log(
  //   'CONNECTION @ ' +
  //   connection_string
  // );
}

Mongoose.Promise = global.Promise;
Mongoose.connect(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
});
