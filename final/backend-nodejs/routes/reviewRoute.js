var express = require('express');

var router = express.Router();
var controller = require("../controller/review_controller")



// chưa có get full review
router.get("/getReviewById/:id",controller.getReviewById);
router.post("/addReview",controller.addReview);
router.patch("/editReview",controller.editReview);

module.exports = router;