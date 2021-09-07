var async = require("async");
var User = require("../models/user");
var Message = require("../models/message");
const { body, validationResult } = require("express-validator");
exports.messageListGet = (req, res, next) => {
  Message.find({})
    .sort({ time: "descending" })
    .populate("user")
    .exec((err, messages) => {
      if (err) return next(err);

      res.render("index", {
        title: "MESSAGES",
        user: req.user,
        messages: messages,
      });
    });
};
exports.messageAddGet = function (req, res, next) {
  if (req.user) {
    if (req.user.member) {
      res.render("message-add", { title: "MESSAGE_ADD", errors: [] });
    }
    req.flash("error", "BECOME A MEMBER TO POST A MESSAGE");
    res.redirect("/access");
  } else {
    req.flash("error", "LOG IN TO POST A MESSAGE");
    res.redirect("/log-in");
  }
};
exports.messageDeletePost = (req, res, next) => {
  Message.findByIdAndDelete(req.body.idToDelete).exec((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
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
      res.render("message-add", { title: "MESSAGE_ADD", errors: errors });
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
