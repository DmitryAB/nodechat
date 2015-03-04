var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var GUEST_NAME = 'Guest';
var MESS_TAG_OPEN = '<li>';
var MY_MESS_TAG_OPEN = '<li id="my">';
var MESS_TAG_CLOSE = '</li>';

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
    socket.broadcast.emit('chat message', MESS_TAG_OPEN + (socket.username || GUEST_NAME) + ': ' + msg + MESS_TAG_CLOSE);
    socket.emit('chat message', MY_MESS_TAG_OPEN + (socket.username || GUEST_NAME) + ': ' + msg + MESS_TAG_CLOSE);
  });

  socket.on('set name', function(name) {
    socket.username = name;
  });
});

http.listen(8080, function() {
  console.log('listening on *:8080');
});

