const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { campgroundSchema, reviewSchema } = require("./schemas");
const Review = require("./models/review");
app.use(methodOverride("_method"));
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
  console.log("We are connected to mongoose");
}

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
app.get("/", (req, res) => {
  res.render("home");
});
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id).populate("reviews");
    const { reviews } = foundCampground;
    res.render("campgrounds/show", { foundCampground, reviews });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //   throw new ExpressError("Invalid operation", 400);
    // }

    const newCampground = req.body.campground;
    await Campground.insertMany(newCampground);
    res.redirect("/campgrounds");
  })
);
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const editCampground = await Campground.findById(id);
    res.render("campgrounds/edit", { editCampground });
  })
);
app.post(
  "/campgrounds/:id/review",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

app.patch(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const edit = req.body.campground;
    // console.log(edit);
    await Campground.findByIdAndUpdate(id, edit);
    res.redirect("/campgrounds");
  })
);
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});
app.use((error, req, res, next) => {
  const { status = 500 } = error;
  if (!error.message) error.message = "Oh No, Something went wrong";
  res.status(status).render("error", { error });
});
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
