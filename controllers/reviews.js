const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.create = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash("success", "Successfully added a review");

  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review");

  res.redirect(`/campgrounds/${id}`);
};
