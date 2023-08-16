const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.create));

router.get("/new", isLoggedIn, campgrounds.new);

router
  .route("/:id")
  .get(catchAsync(campgrounds.show))
  .patch(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.update)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.edit));

module.exports = router;
