var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var GUEST_NAME = 'Guest';

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    io.sockets.emit('chat message', (socket.username || GUEST_NAME) + ': ' + msg);
  });

  socket.on('set name', function(name) {
    socket.username = name;
  });
});

http.listen(8080, function() {
  console.log('listening on *:8080');
});

