"use strict";

var internals = {};
const { Users, Sales, Stocks } = require("@models");
const _ = require("lodash");

internals.index = async function (req, reply) {
  const cntUser = await Users.countDocuments({ scope: ["client"] });
  let remainingStocks = await Stocks.aggregate([
    { $match: {} },
    {
      $group: {
        _id: null,
        total: { $sum: "$qty" },
      },
    },
  ]);
  remainingStocks.total = remainingStocks[0] ? remainingStocks[0].total : 0;

  return reply.view("admin/returnItem/index.html", {
    credentials: req.auth.credentials,
    cntUser,
    remainingStocks,
  });
};

internals.acceptReturnItem = async function (req, reply) {
  var today = new Date();
  console.log(req.params._id);
  if (_.isNil(req.params._id)) {
    return reply({ message: "Error invalid sales", type: "danger" });
  }
  await Sales.update(
    { _id: req.params._id },
    {
      $set: {
        isAcceptReturn: true,
        dateReturn: today,
      },
    }
  );
  return reply({ message: "sucessfully accepted", type: "success" });
};

internals.acceptReturnItemQRcode = async function (req, reply) {
  try {
    var today = new Date();
    const sales = await Sales.findOneAndUpdate(
      {
        product_id: req.payload.product_id,
        user_id: req.payload.user_id,
        status: "accepted",
        isAcceptReturn: false,
      },
      {
        $set: {
          isAcceptReturn: true,
          dateReturn: today,
        },
      },
      { new: true }
    ).lean();
    if (!sales) {
      return reply.redirect(
        "/admin/return-item?message=User or product not found!!&alert=error"
      );
    }
    return reply.redirect(
      "/admin/return-item?message=Sucessfully accepted!!&alert=success"
    );
  } catch (err) {
    return reply.redirect(
      "/admin/return-item?message=Error invalid QR code!!&alert=error"
    );
  }
};
module.exports = internals;
