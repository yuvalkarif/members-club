var express = require("express");
var router = express.Router();

var userController = require("../controllers/userController");
var messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/", messageController.messageListGet);
router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/sign-up", userController.signUpGet);
router.post("/sign-up", userController.signUpPost);

router.get("/log-in", userController.logInGet);
router.post("/log-in", userController.logInPost);

router.get("/message-add", messageController.messageAddGet);
router.post("/message-add", messageController.messageAddPost);
router.post("/message-delete", messageController.messageDeletePost);

module.exports = router;
