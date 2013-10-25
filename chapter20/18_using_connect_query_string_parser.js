var connect = require('connect');

var app = connect();

// setup the query middleware
app.use(connect.query());

// actually respond
app.use(function(req, res) {
  res.end(JSON.stringify(req.query));
});

app.listen(8080);