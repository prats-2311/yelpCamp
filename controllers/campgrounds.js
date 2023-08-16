const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
module.exports.new = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.show = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find campground");
    return res.redirect("/campgrounds");
  }
  const { reviews } = campground;
  res.render("campgrounds/show", { campground, reviews });
};
module.exports.create = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find campground");
    return redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const edit = req.body.campground;
  const camp = await Campground.findByIdAndUpdate(id, edit);
  req.flash("success", "Successfully updated campground");

  res.redirect("/campgrounds");
};
module.exports.delete = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");

  res.redirect("/campgrounds");
};
