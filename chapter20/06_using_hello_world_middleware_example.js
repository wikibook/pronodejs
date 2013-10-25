var connect = require('connect');

// import middlewares
var writeHeader = require('./write_header');
var replyText = require('./reply_text');

var app = connect.createServer(
  writeHeader('X-Powered-By', 'Node'),
  replyText('Hello World!')
);

app.listen(8080);