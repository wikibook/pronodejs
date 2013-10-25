var parse = require('url').parse;

require('http').createServer(function(req, res) {
  params = parse(req.url, true).query;
  var a = parseInt(params.a, 10);
  var b = parseInt(params.b, 10);
  var result = a + b;
  res.end(JSON.stringify(result));
}).listen(8080);