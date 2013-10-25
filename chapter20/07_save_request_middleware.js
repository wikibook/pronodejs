var fs = require('fs'),
  path = require('path'),
  util = require('util');

function saveRequest(dir) {

  return function(req, res, next) {

    var fileName = path.join(dir, Date.now().toString() + '_' +
      Math.floor(Math.random() * 100000) + '.txt');
    var file = fs.createWriteStream(fileName);
    file.write(req.method + ' ' + req.url + '\n');
    file.write(util.inspect(req.headers) + '\n');
    req.pipe(file);
    next();
  };
}

module.exports = saveRequest;