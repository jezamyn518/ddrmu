"use strict";
require("dotenv").config();
require("module-alias/register");

const { Sales } = require("@models");
const _ = require("lodash");

var HapiServer = require("./src/config/hapi");

require("./src/database/mongodb");

HapiServer.start(function () {
  console.log("Server is running at : " + HapiServer.info.uri);
});

//TWIILION CREDENTIALS ACCOUNT
var accountSid = "AC8817c26997a0ba89093144aa5f4c1244"; // Your Account SID from www.twilio.com/console
var authToken = "25eeb8fcaa92f6784017ff1b1b7050c5"; // Your Auth Token from www.twilio.com/console
const twilio = require("twilio")(accountSid, authToken);

setInterval(async () => {
  console.log("find items need to be return");
  const sales = await findSalesToSendMessage();
  if (!_.isEmpty(sales)) {
    sales.map(async (r) => {
      if (!_.isNil(r.user_id.phoneNumber)) {
        await sendMessage(r.user_id);
        await updateSalesIntoSentMessage(r);
      }
    });
  }
  return
}, 5000); // SEND MESSAGE EVERY 24 HOURS

//FIND ITEM NEED TO BE RETURN
const findSalesToSendMessage = async () => {
  let end = new Date();
  end.setDate(end.getDate() + 1);

  const sales = await Sales.find({
    returnDate: { $lt: end },
    status: "accepted",
    isSent: false,
    isReturn: true,
  })
    .populate("user_id")
    .lean();
  return sales;
};

//UPDATE ITEM HAS BEEN SENT MESSAGE
const updateSalesIntoSentMessage = async (sales) => {
  await Sales.updateOne({ _id: sales._id }, { $set: { isSent: true } });
};

//SEND MESSAGE
const sendMessage = (user) => {
  twilio.messages
    .create({
      from: "+19705002546",
      to: user.phoneNumber,
      body: "PLEASE RETURN THE ITEM",
    })
    .then((res) => {
      console.log("sent to ", user.phoneNumber);
    })
    .catch((err) => {
      console.log(err);
    });
};
