var express = require("express");
var router = express.Router();

var userController = require("../controllers/userController");
var messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", user: req.user });
});

router.get("/sign-up", userController.signUpGet);
router.post("/sign-up", userController.signUpPost);

router.get("/log-in", userController.logInGet);
router.post("/log-in", userController.logInPost);

router.get("/message-add", messageController.messageAddGet);
router.post("/message-add", messageController.messageAddPost);

module.exports = router;
