var socket = require(‘socket.io’);
var express = require(‘express’);

var app = express();
var io = socket.listen(app.listen(8080));
