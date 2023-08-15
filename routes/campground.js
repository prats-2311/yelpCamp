const express = require("express");
const router = express.Router({ mergeParams: true });
const { campgroundSchema } = require("../schemas");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware");
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!foundCampground) {
      req.flash("error", "Cannot find campground");
      return res.redirect("/campgrounds");
    }
    const { reviews } = foundCampground;
    res.render("campgrounds/show", { foundCampground, reviews });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //   throw new ExpressError("Invalid operation", 400);
    // }

    // const newCampground = req.body.campground;
    // await Campground.insertMany(newCampground);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const editCampground = await Campground.findById(id);
    if (!editCampground) {
      req.flash("error", "Cannot find campground");
      return redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { editCampground });
  })
);

router.patch(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const edit = req.body.campground;
    // console.log(edit);
    req.flash("success", "Successfully updated campground");

    await Campground.findByIdAndUpdate(id, edit);
    res.redirect("/campgrounds");
  })
);
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");

    res.redirect("/campgrounds");
  })
);
module.exports = router;
