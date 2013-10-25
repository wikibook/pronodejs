var connect = require('connect');

// import middlewares
var saveRequest = require('./save_request');
var writeHeader = require('./write_header');
var replyText = require('./reply_text');

var app = connect.createServer(
  saveRequest(__dirname + '/requests'),
  writeHeader('X-Powered-By', 'Node'),
  replyText('Hello World!')
);

app.listen(8080);