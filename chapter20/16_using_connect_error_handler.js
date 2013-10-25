var connect = require('connect');

var app = connect();

app.use(function(req, res, next) {
  next(new Error('Hey!'));
});

// actually respond
app.use(function(req, res) {
  res.end('Hello World!');
});

app.use(connect.errorHandler());

app.listen(8080);