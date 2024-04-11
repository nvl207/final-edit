var express = require('express');

var router = express.Router();
var controller = require('../controller/order_controller');
var controllerAdmin = require('../controller/Admin/order_controller')



router.post('/getProductByCart',controller.getProductByCart)  //
// router.post('/getProductFavorite',controller.getProductFavorite)

// router.post('/getBillByIdAccount',controller.getBillByIdAccount)  



router.get('/getFullBill',controllerAdmin.getFullBill)  

router.delete('/deleteBill/:code_orders',controllerAdmin.deleteBill)  







module.exports = router;