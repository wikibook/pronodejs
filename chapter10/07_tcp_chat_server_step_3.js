var net = require('net');

var server = net.createServer();

server.on('connection', function(socket) {
  console.log('got a new connection');
  socket.on('data', function(data) {
    console.log('got data:', data);
  });
});

server.on('error', function(err) {
  console.log('Server error:', err.message);
});

server.on('close', function() {
  console.log('Server closed');
});

server.listen(4001);