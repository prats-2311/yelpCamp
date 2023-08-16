const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const user = require("../controllers/users");

router
  .route("/register")
  .get((req, res) => {
    res.render("users/register");
  })
  .post(catchAsync(user.register));

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login
  );
router.get("/logout", user.logout);
module.exports = router;
