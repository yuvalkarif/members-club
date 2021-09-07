var async = require("async");
var tryEach = require("async/tryEach");
var User = require("../models/user");
var Code = require("../models/code");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.signUpGet = function (req, res, next) {
  res.render("sign-up", { title: "SIGN_UP", errors: [] });
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
      if (err) {
        return next(err);
      }
      if (existingUser) {
        errors.push({ msg: "Username is already taken." });
      }
      console.log("errors", errors);
      if (errors.length >> 0) {
        res.render("sign-up", { title: "SIGN_UP", errors: errors });
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
  res.render("log-in", { title: "LOG_IN", message: error });
};

exports.logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureFlash: true,
});

exports.accessGet = function (req, res, next) {
  if (req.user) {
    res.render("access", {
      title: "ACCESS",
      errors: [],
    });
  } else {
    req.flash("error", "LOG IN TO GAIN ACCESS");
    res.redirect("/log-in");
  }
};
exports.accessPost = [
  body("code", "ENTER A CODE").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    console.log("entering post");
    var errors = validationResult(req);
    errors = errors.array();
    Code.findOne({ password: req.body.code }).exec((err, foundCode) => {
      if (err) {
        return next(err);
      }
      if (foundCode) {
        if (foundCode.type == "admin") {
          User.findOneAndUpdate(
            { id: req.user.id },
            { admin: true, member: true }
          ).exec((err) => {
            if (err) return next(err);
            res.redirect("/");
          });
        } else {
          User.findOneAndUpdate({ id: req.user.id }, { member: true }).exec(
            (err) => {
              if (err) return next(err);
              res.redirect("/");
            }
          );
        }
      }
      if (!errors.length >> 0) {
        errors.push({ msg: "TRY ANOTHER CODE" });
      }

      res.render("access", { title: "ACCESS", errors: errors });
    });
  },
];

// if (foundCode) {
//   User.findOneAndUpdate(
//     { id: req.user.id },
//     {
//       $cond: [
//         foundCode.type == "admin",
//         { admin: true, member: true },
//         { member: true },
//       ],
//     }
//   ).exec((err, updatedUser) => {
//     console.log("UPDATING USER", updatedUser);
//     if (err) {
//       next(err);
//     }
//     res.redirect("/");
//   });
