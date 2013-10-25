var connect = require('connect');

var app = connect();

// setup the static file server
app.use(connect.static(__dirname + '/public'));

// actually respond
app.use(function(req, res) {
  res.end('Hello World!');
});

app.listen(8080);