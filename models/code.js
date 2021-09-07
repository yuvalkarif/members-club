var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CodeSchema = new Schema({
  type: { type: String, required: true, enum: ["admin", "member"] },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Code", CodeSchema);
