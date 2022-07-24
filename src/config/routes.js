'use strict';
var internals = {};

//Concatentate the routes into one array
internals.routes = [
  // Add here to add specific routes
].concat(
  ...require("./../routes")
);

const {
  resetCredentials
} = require("./../middlewares")

let MIDDLEWARES = [
  resetCredentials
]

//set the routes for the server
internals.init = function (server) {

  internals.routes.map(r=>{
    if(!r.config){
      r.config = {pre: []}
    }
    else if(!r.config.pre) r.config.pre = [];

    let temp = r.handler
    
    r.handler = async function(req, res){
      try {
        let i = 0;
        let next = async function() {
          i++;

          
          if(typeof MIDDLEWARES[i-1]==='function'){
            await MIDDLEWARES[i-1](req, res)
            await next()
          }
        }

        if(req.auth.isAuthenticated) await next()

        return temp(req, res)
      }catch(err){
        console.log(err);
        if(err.status!="redirect")
          return res({
            status: "error",
            message: "Something went wrong",
            error: err
          })
      }
    }


    r.config.handler = r.handler;
    delete r.handler
    return r;
  })

  server.route(internals.routes);
};



module.exports = internals;
