'use strict';
/**
 * ## Imports
 *
 */
//Handle the endpoints
var Handlers = require('./handlers'),
  internals = {};

internals.endpoints = [
  {
    method: ['GET'],
    path: '/',
    handler: Handlers.index,
  },
  {
    method: ['GET'],
    path: '/login',
    handler: Handlers.login,
  },
  {
    method: ['GET'],
    path: '/logout',
    handler: Handlers.logout,
  },
  {
    method: ['POST'],
    path: '/web/authentication',
    handler: Handlers.web_authentication,
  },
];

module.exports = internals;
