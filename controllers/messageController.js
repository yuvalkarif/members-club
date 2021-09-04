var async = require("async");
var User = require("../models/user");
var Message = require("../models/message");
const { body, validationResult } = require("express-validator");

exports.messageAddGet = function (req, res, next) {
  if (req.user) {
    res.render("message-add", { errors: [] });
  }
  res.redirect("/log-in");
};

exports.messageAddPost = [
  body("title", "Please fill in your Title")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Please fill in your Message Text")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    errors = errors.array();
    if (errors.length >> 0) {
      res.render("message-add", { errors: errors });
    } else {
      var newMessage = new Message({
        title: req.body.title,
        text: req.body.text,
        user: req.user,
      });
      newMessage.save(function (err, savedMessage) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];
