var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lastMessages = [];

var LAST_MESS_CNT = 5;
var GUEST_NAME = 'Guest';
var MESS_TAG_OPEN = '<li>';
var MY_MESS_TAG_OPEN = '<li id="my">';
var LEFT_MESS_TAG_OPEN = '<li id="left">';
var MESS_TAG_CLOSE = '</li>';

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  lastMessages.forEach(function(msg) {
    socket.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    io.sockets.emit('chat message', LEFT_MESS_TAG_OPEN + (socket.username || GUEST_NAME) + ' left' + MESS_TAG_CLOSE);
  });

  socket.on('chat message', function(msg) {

    lastMessages.push(MESS_TAG_OPEN + (socket.username || GUEST_NAME) + ': ' + msg + MESS_TAG_CLOSE);
    if (lastMessages.length > LAST_MESS_CNT) 
      lastMessages.shift();

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

