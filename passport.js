var User = require("./models/user");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
exports.logInAuth = new LocalStrategy(function (username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: "Incorrect username.",
      });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // passwords match! log user in
        return done(null, user);
      } else {
        // passwords do not match!
        console.log(password, user.password);
        return done(null, false, { message: "Incorrect password" });
      }
    });
  });
});
