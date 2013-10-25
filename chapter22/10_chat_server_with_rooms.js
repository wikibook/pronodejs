var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');

httpd.listen(4000);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
       res.writeHead(500);
       return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    }
  );
}

io.sockets.on('connection', function (socket) {
  socket.on('clientMessage', function(content) {
    socket.emit('serverMessage', 'You said: ' + content);

    socket.get('username', function(err, username) {
      if (! username) {
        username = socket.id;
      }
      socket.get('room', function(err, room) {
        if (err) { throw err; }
        var broadcast = socket.broadcast;
        var message = content;
        if (room) {
          broadcast.to(room);
        }
        broadcast.emit('serverMessage', username + ' said: ' + message);
      });
    });
  });

  socket.on('login', function(username) {
    socket.set('username', username, function(err) {
      if (err) { throw err; }
      socket.emit('serverMessage', 'Currently logged in as ' + username);
      socket.broadcast.emit('serverMessage', 'User ' + username +
        ' logged in');
    });    
  });

  socket.on('disconnect', function() {
    socket.get('username', function(err, username) {
      if (! username) {
        username = socket.id;
      }
      socket.broadcast.emit('serverMessage', 'User ' + username +
        ' disconnected');
    });
  });

  socket.on('join', function(room) {
    socket.get('room', function(err, oldRoom) {
      if (err) { throw err; }

      socket.set('room', room, function(err) {
        if (err) { throw err; }
        socket.join(room);
        if (oldRoom) {
          socket.leave(oldRoom);
        }
        socket.get('username', function(err, username) {
          if (! username) {
            username = socket.id;
          }
        });
        socket.emit('serverMessage', 'You joined room ' + room);
        socket.get('username', function(err, username) {
          if (! username) {
            username = socket.id;
          }
          socket.broadcast.to(room).emit('serverMessage', 'User ' + 
            username + ' joined this room');
        });
      });
    });
  });

  socket.emit('login');

});