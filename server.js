const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var players = {}; //the object array used to 

//defines the locations of the relevant files
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//selects the port for the localhost-server.
server.listen(8081, function () {
  console.log('listening on *:8081');
});

//happens when theres a socket connection to the server.
io.on('connection', function (socket) {
  console.log('a user with id: ' + socket.id + ', connected'); //logs the connected user.

  //we create a new player and add it to our players object-array using the socket.id as an index key.
  players[socket.id] = {
    playerId: socket.id,
    playerName: 'Player ' + socket.id[3], //defines a uniqe playernamed based on the 4th char in the socket id. NOTE: This can be a space.
    points: 0,
    x: 200,
    y: 50,
  };
  socket.emit('currentPlayers', players);   // send all the player-objects to the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);  // send the new player-object to all other players

  //happens when the socket disconnects again
  socket.on('disconnect', function () {
    console.log('user with id: ' + socket.id + ', disconnected');
    delete players[socket.id]; //deletes the player-object for the disconnected player
    socket.broadcast.emit('disconnectPlayer', socket.id); //send the disconnected player's id to all other players
  });

  //happens when a player presses the 'dealCardsText on their screen
  socket.on('dealCards', function () {
    console.log("Now dealing cards to all connected players"); //logs on the server that cards are being dealt.
    socket.broadcast.emit('dealCards'); //sends a message to all connected players to execute the dealCards-function.
  });

  //happens when a user "uses" a card = when they drag/click a card-object.
  socket.on('addPoint', function (playerId, points) {
    console.log("Adding " + points + " points to player: " + playerId);
    players[playerId].points = players[playerId].points + points; //updates the playerdata to add the point.
    socket.emit('update', players); //sends this message back to the sender
    socket.broadcast.emit('update', players); //sends this message to all others.
  });

});

