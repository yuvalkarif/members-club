var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  avatar: {
    type: String,
    default:
      "https://static.wikia.nocookie.net/strangerthings8338/images/4/48/Mike_Wheeler_S1.png/revision/latest?cb=20171025205131",
  },
});

module.exports = mongoose.model("User", UserSchema);
