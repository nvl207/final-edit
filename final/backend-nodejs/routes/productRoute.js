var express = require('express');

var router = express.Router();
var controller = require('../controller/product_controller');
var controllerAdmin = require('../controller/Admin/product_controller')


// product

router.get('/getProduct',controller.getProduct); // ok
router.get('/searchProduct', controller.searchProduct)  //ok



// category

router.get('/getCategory',controller.getCategory);  //ok

router.get('/getCategoryById/:id', controller.getCategoryById)  //ok
router.get('/getProductByCategory/:id', controller.getProductByCategory)  // ok

router.get('/getProductInventory/', controller.getProductInventory) //ok




// // admin
router.post('/addProduct',controllerAdmin.addProduct) //ok
router.patch('/editProduct',controllerAdmin.editProduct)   //ok
router.delete('/deleteProduct',controllerAdmin.deleteProduct)  //ok

router.post('/addCategory',controllerAdmin.addCategory)  // phân quyền
router.patch('/editCategory',controllerAdmin.editCategory)  // phân quyền
router.delete('/deleteCategory',controllerAdmin.deleteCategory) // phân quyền










module.exports = router;