var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const { DateTime } = require("luxon");

var MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  datetime: {
    type: String,
    default: DateTime.now().toLocaleString(DateTime.DATE_MED),
  },
  time: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Message", MessageSchema);
