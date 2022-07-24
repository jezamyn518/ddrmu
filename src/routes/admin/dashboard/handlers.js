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

  return reply.view("admin/dashboard/index.html", {
    credentials: req.auth.credentials,
    cntUser,
    remainingStocks,
  });
};
internals.checkout = async function (req, reply) {
  if (_.isNil(req.payload)) {
    return reply({ message: "Error invalid sales", type: "danger" });
  }
  req.payload.map(async (r) => {
    await Sales.update(
      { _id: r._id },
      {
        $set: {
          qty: r.qty,
          status: r.status == "cancel" ? "cancel" : "accepted",
          returnDate: r.returnDate ? r.returnDate : null,
        },
      }
    );
  });
  return reply({ message: "sucessfully accepted", type: "success" });
};

internals.acceptBorrowQRcode = async function (req, reply) {
  try {
    const sales = await Sales.findOneAndUpdate(
      {
        product_id: req.payload.product_id,
        user_id: req.payload.user_id,
        status: "pending",
        isAcceptReturn: false,
      },
      {
        $set: {
          returnDate: req.payload.returnDate,
        },
      },
      { new: true }
    ).lean();
    if (!sales) {
      return reply.redirect(
        "/admin/dashboard?message=User or product not found!!&alert=error"
      );
    }
    return reply.redirect(
      "/admin/dashboard?message=Sucessfully accepted!!&alert=success"
    );
  } catch (err) {
    return reply.redirect(
      "/admin/dashboard?message=Error invalid QR code!!&alert=error"
    );
  }
};

module.exports = internals;
