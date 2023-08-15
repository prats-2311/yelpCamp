const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
UserSchema.plugin(passwordLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
