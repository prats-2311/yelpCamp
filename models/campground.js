const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
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
  image: {
    type: String,
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
