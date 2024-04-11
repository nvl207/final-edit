var express = require('express');

var router = express.Router();
var controllerAdmin = require("../controller/Admin/promotion_controller")


router.get("/getPromotion",controllerAdmin.getPromotion)
router.patch("/updateTimeSale",controllerAdmin.updateTimeSale)
router.post("/addPromotion",controllerAdmin.addPromotion)
router.delete("/deleteSale",controllerAdmin.deleteSale)
// get promotion news


module.exports = router;
