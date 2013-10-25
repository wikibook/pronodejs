var connect = require('connect');

// import middlewares
var replyText = require('./reply_text');

var app = connect.createServer(replyText('Hello World!'));
app.listen(8080);