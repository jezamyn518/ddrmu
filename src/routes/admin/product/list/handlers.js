"use strict";

var internals = {};
const { Products, Brand, Category, Unit, Stocks, Sales } = require("@models");
const Image = require("@lib/Image");
const _ = require("lodash");
const { remove } = require("lodash");
const messageError =
  "/admin/products?message=Error Please try again!&alert=error";
const messageSuccess =
  "/admin/products?message=Successfully Created&alert=success";
const util = require("util");

internals.index = async function (req, reply) {
  const brand = await Brand.find({}).lean();
  const category = await Category.find({}).lean();
  const unit = await Unit.find({}).lean();
  let products = await Products.find({})
    .populate("category_id brand_id unit_id")
    .lean();

  // const all = await Products.aggregate([
  //     {
  //         $lookup:
  //         {
  //             from: "stocks",
  //             localField: "_id",
  //             foreignField: "product_id",
  //             as: "stocks",
  //         }
  //     },
  //     {
  //         $lookup:
  //         {
  //             from: "categories",
  //             localField: "category_id",
  //             foreignField: "_id",
  //             as: "category_id",
  //         }
  //     },

  //     { "$project": {
  //             "total": { "$sum": "$stocks.qty" },
  //         },
  //     }
  // ]);
  // all.map(r =>{
  //     var total=0;
  //     r.stocks.map(s =>{
  //         total+=s.qty
  //     })
  //     r.category_id = r.category_id[0]
  //     return r.total = total;
  // });
  // console.log(util.inspect(all, {showHidden: false, depth: null, colors: true}))

  const stocks = await Stocks.aggregate([
    { $match: {} },
    {
      $group: {
        _id: "$product_id",
        total: { $sum: "$qty" },
      },
    },
    { $sort: { total: 1 } },
  ]);
  products.map((r) => {
    let total;
    stocks.map((s) => {
      if (String(r._id) == String(s._id)) {
        return (total = s.total);
      }
    });
    r.total = total;
    return r.total ? r.total : (r.total = 0);
  });

  let condition = {
    $or: [
      {
        status: "accepted",
        isAcceptReturn: false,
        isReturn: true,
      },
      {
        status: "accepted",
        isReturn: false,
      },
    ],
  };
  let rawProducts = await Sales.aggregate([
    {
      $match: condition,
    },
    {
      $group: {
        _id: "$product_id",
        total: { $sum: "$qty" },
      },
    },
  ]).sort({ total: -1 });
  products = products.map((p) => {
    let total = 0,
      con = false;
    rawProducts.map((r) => {
      if (String(p._id) == String(r._id)) {
        total = p.total - r.total;
        con = true;
      }
    });
    if (con) {
      p.total = total;
    }
    return p;
  });

  return reply.view("admin/products/list.html", {
    credentials: req.auth.credentials,
    products,
    brand,
    category,
    unit,
  });
};
internals.add = async function (req, reply) {
  try {
    let payload = {
      name: req.payload.name,
      price: req.payload.price,
      category_id: req.payload.category_id,
      brand_id: req.payload.brand_id,
      unit_id: req.payload.unit_id,
      code: req.payload.code,
      isReturn: req.payload.isReturn == "true" ? true : false,
    };
    const product = await Products.create(payload);
    if (!product) return reply.redirect(messageError);
    //add product image
    if (!_.isEmpty(req.payload.img)) {
      Image.upload(req.payload.img, product._id);
      await Products.update(
        { _id: product._id },
        { $set: { img: `/assets/images/products/${product._id}.jpg` } }
      );
    }
    return reply.redirect(messageSuccess);
  } catch (err) {
    return reply.redirect(messageError);
  }
};
internals.update = async function (req, reply) {
  let payload = {
    name: req.payload.name,
    price: req.payload.price,
    category_id: req.payload.category_id,
    brand_id: req.payload.brand_id,
    unit_id: req.payload.unit_id,
    code: req.payload.code,
    isReturn: req.payload.isReturn == "true" ? true : false,
  };
  const product = await Products.findOneAndUpdate(
    {
      _id: req.payload._id,
    },
    { $set: payload }
  ).lean();
  if (!product) return reply.redirect(messageError);
  //add product image
  if (!_.isEmpty(req.payload.img)) {
    Image.upload(req.payload.img, product._id);
    await Products.update(
      { _id: product._id },
      { $set: { img: `/assets/images/products/${product._id}.jpg` } }
    );
  }
  return reply.redirect(messageSuccess);
};
internals.delete = async function (req, reply) {
  //CANT DELETE PRODUCT IF PRODUCT HAS STOCKS
  const countStocks = await Stocks.countDocuments({
    product_id: req.params._id,
  }).lean();
  if (countStocks > 0) {
    return reply({ status: false, message: "Error to delete", icon: "error" });
  }
  Image.remove(`/assets/images/products/${req.params._id}.jpg`);
  const brand = await Products.deleteOne({ _id: req.params._id }).lean();
  if (!brand) {
    return reply({ status: false, message: "Error to delete", icon: "error" });
  }
  return reply({
    status: true,
    message: "Successfully deleted",
    icon: "success",
  });
};

module.exports = internals;
