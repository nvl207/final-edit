const express = require("express");
const product_router = require("../routes/productRoute");
const order_router = require("../routes/orderRoute");
const inventory_router = require("../routes/inventoryRoute")
const account_router = require("../routes/accountRoute")
const promotion_router = require("../routes/promotionRoute")
const review_router = require("../routes/reviewRoute")


function route(app) {
  app.use("/product", product_router);
  app.use("/order", order_router);
  app.use("/inventory",inventory_router)
  app.use("/account",account_router)
  app.use("/promotion",promotion_router)
  app.use("/review",review_router)
  app.use("/account",account_router)

}

module.exports = route;
