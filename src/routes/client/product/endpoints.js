"use strict";
/**
 * ## Imports
 *
 */
//Handle the endpoints
var Handlers = require("./handlers"),
  internals = {};

const CONFIG = {
  auth: {
    strategy: "standard",
    scope: ["client"],
  },
  tags: ["api"],
};

let endpoints = [
  {
    method: ["GET"],
    path: "/client/products",
    handler: Handlers.index,
  },
  {
    method: ["POST"],
    path: "/client/product/remove/{_id}",
    handler: Handlers.remove,
  },
];

internals.endpoints = endpoints.map((r) => {
  if (!!r.config) r.config = { ...CONFIG, ...r.config };
  else r.config = { ...CONFIG };
  return r;
});

module.exports = internals;
