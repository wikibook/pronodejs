var nano = require('nano');
var couchdb = nano('https://myiriscouchserver.iriscouch.com');

var couchMapReduce = function (doc) {
  emit([doc.room, doc.when], doc);
};

couchdb.db.create('chat', function(err) {
  if (err && err.status_code !== 412) {
    throw err;
  }

  var designDoc = {
    language: "javascript",
    views: {
      by_room: {
        map: couchMapReduce.toString()
      }
    }
  };

  var chatDB = couchdb.use('chat');

  (function insertOrUpdateDesignDoc() {
    chatDB.insert(designDoc, '_design/designdoc', function(err) {
      if (err) {
        if (err.status_code === 409) {
          chatDB.get('_design/designdoc', function(err, ddoc) {
            if (err) { return console.error(err); }
            designDoc._rev = ddoc._rev;
            insertOrUpdateDesignDoc();
          });
        } else {
          return console.error(err);
        }
      }
      startServer();
    });
  }());
});

function startServer() {
  var chatDB = couchdb.use('chat');

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

  
  function sendBackLog(socket, room) {
    var getOptions = {
      start_key: JSON.stringify([room, 9999999999999]),
      end_key: JSON.stringify([room, 0]),
      limit: 10,
      descending: true
    };

    chatDB.get('_design/designdoc/_view/by_room', getOptions,
      function(err, results) {
        var messages = results.rows.reverse().map(function(res) {
          return res.value;
        });
        socket.emit('backlog', messages);
      });
  }

  var chat = io.of('/chat');

  chat.on('connection', function (socket) {
    socket.on('clientMessage', function(content) {

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

          var messageDoc = {
            when: Date.now(),
            from: username,
            room: room,
            message: content
          };

          socket.emit('serverMessage', messageDoc);

          chatDB.insert(messageDoc, function(err) {
            if (err) { console.error(err); }
          });

          broadcast.emit('serverMessage', messageDoc);
        });
      });
    });

    socket.on('login', function(username) {
      socket.set('username', username, function(err) {
        if (err) { throw err; }
        var message = {
          from: username,
          message: 'Logged in',
          when: Date.now()
        };
        socket.emit('serverMessage', message);
        socket.broadcast.emit('serverMessage', message);

        sendBackLog(socket, null);

      });
    });

    socket.on('disconnect', function() {
      socket.get('username', function(err, username) {
        if (! username) {
          username = socket.id;
        }
        var message = {
          from: username,
          message: 'disconnected',
          when: Date.now()
        };
        socket.broadcast.emit('serverMessage', message);
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
            var message = {
              from: username,
              message: 'joined room ' + room + '. Fetching backlog...',
              when: Date.now()
            };
            socket.emit('serverMessage', message);
            socket.broadcast.to(room).emit('serverMessage', message);
          });

          sendBackLog(socket, room);
        });
      });
    });

    socket.emit('login');

  });
}