const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const pictureSchema = new Schema({
  name: String,
  author: String,
  description: String,
  pic_path: String,
  pic_name: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

var Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;
