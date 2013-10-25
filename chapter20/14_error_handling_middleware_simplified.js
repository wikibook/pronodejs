function errorHandler() {
  return function(err, req, res, next) {
    res.writeHead(500, {'Content-Type': 'text/html'});
    res.end('<h1>Oh no! We have an error!</h1>\n<pre>' + err.stack + '</pre>');
  }
}

module.exports = errorHandler;