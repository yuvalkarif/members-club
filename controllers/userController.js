var async = require("async");
var User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.signUpGet = function (req, res, next) {
  res.render("sign-up", { title: "Sign Up" });
};
exports.signUpPost = [
  body("username", "Please fill in your Username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Please fill in your Password")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    errors = errors.array();
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    User.find({ username: req.body.username }).exec(function (
      err,
      existingUser
    ) {
      if (err) {
        return next(err);
      }
      if (existingUser != null) {
        errors.push({ msg: "Username is already taken." });
      }
    });
    if (errors.isLength >> 0) {
      res.render("sign-up", { title: "Sign Up", errors: errors });
    } else {
      newUser.save(function (err, savedUser) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.logInGet = function (req, res, next) {
  console.log(req.flash());
  var error = req.flash("error");
  res.render("log-in", { title: "Log In", message: error });
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureFlash: true,
});
