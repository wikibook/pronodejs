var connect = require('connect');

var app = connect();

// setup logger middleware
app.use(connect.logger());

// actually respond
app.use(function(req, res) {
  res.end('Hello World!');
});

app.listen(8080);