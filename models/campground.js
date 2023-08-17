const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const campgroundSchema = new Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
campgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews.length) {
    const res = await Review.deleteMany({
      _id: { $in: campground.reviews },
    });
    console.log(res);
  }
  console.log(campground);
});
module.exports = mongoose.model("Campground", campgroundSchema);
