var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String
});

module.exports = UserSchema;