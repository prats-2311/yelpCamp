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
      author: "64db20d5482a9b738b58c8b5",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dnxfw6jcd/image/upload/v1692211609/yelpCamp/swzfigurqpuosgxp7eqt.jpg",
          filename: "yelpCamp/swzfigurqpuosgxp7eqt",
        },
        {
          url: "https://res.cloudinary.com/dnxfw6jcd/image/upload/v1692211479/yelpCamp/i6yk7kqkhy2yqbkf0vny.jpg",
          filename: "yelpCamp/i6yk7kqkhy2yqbkf0vny",
        },
      ],
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
