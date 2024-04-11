var express = require('express');

var router = express.Router();

var controller = require('../controller/Admin/inventory_controller')



router.get("/getInventory",controller.getInventory)  // ok
router.post("/addInventory",controller.addInventory)   // ok
router.delete("/deleteInventory",controller.deleteInventory)   // ok  
router.patch("/updateInventory",controller.updateInventory)   // ok  


module.exports = router;