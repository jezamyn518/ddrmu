'use strict';

/**
 * ## Imports
 *
 */
var Config = require('../config'),
  Hapi = require('hapi'),
  // // the authentication strategy
  Auth = require('../auth/strategy'),
  // // kind of like underscore, but specific to Hapi
  Hoek = require('hoek'),
  // some additional services
  Plugins = require('./plugins'),
  // the routes we'll support
  Routes = require('./routes'),
  // the view, mainly for reset password
  Views = require('./views');

var internals = {};

//The real Hapi server!
internals.server = new Hapi.Server({ debug: { request: ['error'] } });
//Setup the connection for the environment
//
internals.server.connection({
  host: Config.env.dev ? '0.0.0.0' : '0.0.0.0',
  port: Config.hapi.port,
  routes: { log: true, cors: true },
});

// register plugins
internals.server.register(Plugins.get(), (err) => {
  Hoek.assert(!err, err);
});

// // configure jwt strategy
Auth.setStrategy(internals.server);

// set views
Views.init(internals.server);

// set routes
Routes.init(internals.server);


module.exports = internals.server;
