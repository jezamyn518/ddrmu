/**
 * # ErrorAlert.js
 *
 * This class uses a component which displays the appropriate alert
 * depending on the platform
 *
 * The main purpose here is to determine if there is an error and then
 * plucking off the message depending on the shape of the error object.
 */
'use strict';
/**
 * ## Imports
 *
 */
var internals = {};

internals.setAuthStrategy = function (server) {
  server.auth.strategy('standard', 'cookie', {
    password: 'inventoryinventoryinventoryinventoryinventoryinventoryinventory', // cookie secret
    cookie: 'inventory-cookie',
    redirectTo:
      '/?message=Session expired! Sign in to continue.&alert=warning',
    isSecure: false,
  });
};

module.exports = {
  setStrategy: internals.setAuthStrategy,
};
