var Schema = require('mongoose').Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  body: String,
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    'default': Date.now
  }
});

module.exports = ArticleSchema;