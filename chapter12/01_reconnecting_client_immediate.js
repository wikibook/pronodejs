var net  = require('net');
var port = 4000;
var conn; 

process.stdin.resume();

(function connect() {
  conn = net.createConnection(port);
  
  conn.on('connect', function() {
    console.log('connected to server');
  });
  
  conn.on('error', function(err) {
    console.log('Error in connection:', err);
  });

  conn.on('close', function() {
    console.log('connection got closed, will try to reconnect');
    connect();
  });
  
  conn.pipe(process.stdout, {end: false});
  process.stdin.pipe(conn);
}());