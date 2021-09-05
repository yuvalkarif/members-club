var async = require("async");
var User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.signUpGet = function (req, res, next) {
  res.render("sign-up", { title: "Sign Up", errors: [] });
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
      avatar: req.body.avatar,
    });
    User.findOne({ username: req.body.username }).exec(function (
      err,
      existingUser
    ) {
      console.log("existinguser", existingUser);
      if (err) {
        return next(err);
      }
      if (existingUser) {
        errors.push({ msg: "Username is already taken." });
      }
      console.log("errors", errors);
      if (errors.length >> 0) {
        res.render("sign-up", { title: "Sign Up", errors: errors });
      } else {
        bcrypt.hash(newUser.password, 10, (err, hashedPassword) => {
          if (err) return next(err);
          newUser.password = hashedPassword;
          newUser.save(function (err, savedUser) {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        });
      }
    });
  },
];

exports.logInGet = function (req, res, next) {
  var error = req.flash("error");
  res.render("log-in", { title: "Log In", message: error });
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureFlash: true,
});
