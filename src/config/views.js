'use strict';

var internals = {},
  Handlebars = require('handlebars'),
  Inert = require('inert'),
  Path = require('path'),
  Vision = require('vision');

internals.init = function (server) {
  server.register(Vision, (err) => {
    server.views({
      engines: {
        html: Handlebars,
      },
      isCached: false,
      relativeTo: __dirname,
      path: [Path.join(__dirname, '../views')],
      layout: true,
      layoutPath: Path.join(__dirname, '../views/layout'),
      partialsPath: '../views/partials',
      helpersPath: '../views/helpers',
    });
  });

  server.register(Inert, (err) => {
    server.route({
      method: 'GET',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../assets'),
        },
      },
    });

    server.route({
      method: 'GET',
      path: '/upload/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../upload'),
        },
      },
    });

    server.route({
      method: 'GET',
      path: '/reports/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '../reports'),
        },
      },
    });
  });
};

module.exports = internals;
