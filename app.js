const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campground = require("./routes/campground");
const review = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
app.use(methodOverride("_method"));
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
  console.log("We are connected to mongoose");
}

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

app.use(
  session({
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});
app.use("/campgrounds", campground);
app.use("/campgrounds/:id/reviews", review);

app.get("/", (req, res) => {
  res.render("home");
});

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
