var connect = require('connect');

var app = connect();

// setup middleware
app.use(connect.cookieParser());

// actually respond
app.use(function(req, res) {
  res.end(JSON.stringify(req.cookies));
});

app.listen(8080);