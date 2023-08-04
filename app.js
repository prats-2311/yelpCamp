const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const foundCampground = await Campground.findById(id);
  res.render("campgrounds/show", { foundCampground });
});

app.post("/campgrounds", async (req, res) => {
  const newCampground = req.body;
  await Campground.insertMany(newCampground);
  res.redirect("/campgrounds");
});
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const editCampground = await Campground.findById(id);
  res.render("campgrounds/edit", { editCampground });
});

app.patch("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const edit = req.body;
  console.log(edit);
  await Campground.findByIdAndUpdate(id, edit);
  res.redirect("/campgrounds");
});
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
