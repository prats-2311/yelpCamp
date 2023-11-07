if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env);
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const User = require("./models/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const dbURL = process.env.DB_URL;
// const dbURL = "mongodb://127.0.0.1:27017/yelpCamp";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
  console.log("We are connected to mongoose");
}
const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "thisisasecret",
  },
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(sanitize());

app.use(
  session({
    store,
    name: "session",
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      // secure:true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://cdn.jsdelivr.net/*",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [
  "https://use.fontawesome.com/",
  "https://kit-free.fontawesome.com/",
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dnxfw6jcd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use((req, res, next) => {
  // console.log(req.user);
  // console.log(req.query);
  res.locals.currentUser = req.user;
  // res.locals.returnTo = req.session.returnTo;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "dash@gmail.com", username: "Dash" });
  const newUser = await User.register(user, "dashdash");
  res.send(newUser);
});

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
app.listen(4000, () => {
  console.log("Serving on port 4000");
});
