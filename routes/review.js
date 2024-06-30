const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");


//POST Reviews
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(ReviewController.createReview)
  );
  
  //Delete Review Route
  router.delete(
    "/:reviewId",
    isReviewAuthor,
    isLoggedIn,
    wrapAsync(ReviewController.deleteReview));

  module.exports = router;