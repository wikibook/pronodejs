var tls = require('tls');
var fs  = require('fs');
var port = 4001;

var clients = [];

var options = {
  key:  fs.readFileSync('server_key.pem'),
  cert: fs.readFileSync('server_cert.pem')
};

function distribute(from, data) {
  var socket = from.socket;
  clients.forEach(function(client) {
    if (client !== from) {
      client.write(socket.remoteAddress + ':' + socket.remotePort +
        ' said: ' + data);
    }
  });
}

var server = tls.createServer(options, function(client) {

  clients.push(client);

  client.on('data', function(data) {
    distribute(client, data);
  });

  client.on('close', function() {
    console.log('closed connection');
    clients.splice(clients.indexOf(client), 1);
  });

});

server.listen(port, function() {
  console.log('listening on port', server.address().port);
});