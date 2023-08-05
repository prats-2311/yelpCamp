const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
  console.log("We are connected to mongoose");
}
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://random.responsiveimages.io/v1/docs",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus",
      price,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
