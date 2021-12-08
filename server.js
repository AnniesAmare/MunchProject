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
server.listen(8082, function () {
  console.log('listening on *:8081');
});

//happens when theres a socket connection to the server.
io.on('connection', function (socket) {
  console.log('a user with id: ' + socket.id + ', connected'); //logs the connected user.

  //we create a new player and add it to our players object-array using the socket.id as an index key.
  players[socket.id] = {
    playerId: socket.id,
    playerName: 'Player ' + socket.id[3], //defines a uniqe playername based on the 4th char in the socket id. NOTE: This can be a space.
    playerState: 0,
    points: 0,
    x: 200,
    y: 50,
    character: {
      race: "Human",
      combatClass: "Classless",
      combatLevel: 0,
      levelBonus: 0,
      armor: false,
      sword: false,
    },
  };
  socket.emit('currentPlayers', players);   // send all the player-objects to the new player
  socket.broadcast.emit('update', players);  // updates all players.

  //happens when the socket disconnects again
  socket.on('disconnect', function () {
    console.log('user with id: ' + socket.id + ', disconnected');
    delete players[socket.id]; //deletes the player-object for the disconnected player
    socket.broadcast.emit('update', players); //send the disconnected player's id to all other players
  });

  //happens when a player presses the 'dealCardsText on their screen
  socket.on('dealCards', function () {
    console.log("Now dealing cards to all connected players"); //logs on the server that cards are being dealt.
    socket.broadcast.emit('dealCards'); //sends a message to all connected players to execute the dealCards-function.
  });

  //happens when a state-update is emitted from the client.
  socket.on('changeState', function(newState){
    players[socket.id].playerState = newState;

    // tells all connected sockets to update to the changed player-objects.
    socket.emit('update', players); //sends this message back to the sender
    socket.broadcast.emit('update', players); //sends this message to all others.
  })

  //happens when a user "uses" a card = when they drag/click a card-object.
  socket.on('globalUpdate', function () {
        // tells all connected sockets to update
        socket.emit('update', players); //sends this message back to the sender
        socket.broadcast.emit('update', players); //sends this message to all others.
  });

  //happens when a user "uses" a treasurecard = when they click a treasureCard-object.
  socket.on('treasure', function (cardType, points, treasureType) {
    console.log("Using a treasurecard of cardType: " + cardType);
    const player = players[socket.id];
    const playerCharacter = player.character;
// test
    if (cardType == "levelUpCard") {
      player.points = player.points + points; //updates the playerdata to add the point.
      playerCharacter.combatLevel = playerCharacter.combatLevel + player.points; //updates the characterdata to add the levels
    } 
    
    else if (cardType == "equipmentCard") {
      let equipmentType = treasureType;
      if (equipmentIsUsable(playerCharacter, equipmentType)) {
        playerCharacter.levelBonus = playerCharacter.levelBonus + points;
        playerCharacter.combatLevel = player.points + playerCharacter.levelBonus;
      } else {
        // TODO: #6 Add clientside handling for player failing to equip an item
        console.log("Player is already wearing a type: " + equipmentType);
      }
    } else {
      console.log("Unknown card");
    }

    // tells all connected sockets to update to the changed player-objects.
    socket.emit('update', players); //sends this message back to the sender
    socket.broadcast.emit('update', players); //sends this message to all others.
  });
});

function equipmentIsUsable(playerCharacter, equipmentType) {
  // TODO: #9 Expand to include lowercase-armor and unknown armor-types
  if (equipmentType == "Armor" && playerCharacter.armor == false) {
    playerCharacter.armor = true;
    return true;
  }
  else if (equipmentType == "Sword" && playerCharacter.sword == false) {
    playerCharacter.sword = true;
    return true;
  }
  else { return false }
};