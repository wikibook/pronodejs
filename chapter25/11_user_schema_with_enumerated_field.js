var mongoose = require('mongoose');

var emailRegexp = /.+\@.+\..+/;

var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  name: String,
  password: String,
  email: {
    type: String,
    required: true,
    match: emailRegexp
  },
  gender: {
    type: String,
    required: true,
    uppercase: true,
    'enum': ['M', 'F']
  }
});

module.exports = UserSchema;