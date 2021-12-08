import TreasureCard from './components/TreasureCard.js';
import GameState1 from './gamestates/GameState1.js';
import GameState0 from './gamestates/GameState0.js';

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1100,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
var game = new Phaser.Game(config);


function preload() {
}

function create() {
  // TODO: #8 Implement a GameState
  let playerState = null;

  this.socket = io();
  let self = this;
  this.otherPlayersInfoText = this.add.group(); //creates a group that holds all PlayerInfoText-objects for the other players.
  this.gameStateGroup = this.add.group(); //creates a group to hold all gamestate stuff.


  // Input: an array of players indexed with socket.id.
  // Output: text graphics for all players.
  this.socket.on('currentPlayers', function (players) {
    let count = 1;
    //keys = socket.id's = an id for every player
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        playerState = players[id].playerState;
        addPlayerText(self, players[id]);
      } else {
        count = count + 1;
        players[id].x = 200 * count;
        addOtherPlayersText(self, players[id]);
      }
    });
    self.socket.emit('globalUpdate');
  });

  //Input: an array of players indexed with socket.id
  //Output: removes existing text graphics for player info, and redraws them using the provided array
  this.socket.on('update', function (players) {
    console.log("Updating");
    self.playerInfoText.destroy();
    //Removes the text-graphics for other players info.
    destroyChildren(self.otherPlayersInfoText);
    //Makes the new objects and spaces them out
    let count = 1;
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayerText(self, players[id]);
        playerState = players[id].playerState;
      } else {
        count = count + 1;
        players[id].x = 200 * count;
        addOtherPlayersText(self, players[id]);
      }
    });

    //Handles gamestates every time there is an update
    if (playerState == null) {
      console.log("This is an error");
    } 
    if (playerState == 0) {
      destroyChildren(self.gameStateGroup);
      let gameState = new GameState0(self, self.socket);
      self.gameStateGroup.add(gameState);
    }
    if (playerState == 1){
      destroyChildren(self.gameStateGroup);
      let gameState = new GameState1(self, self.socket);
      self.gameStateGroup.add(gameState);
    }
  });

  //Defines a function to create and render the cards objects using the Card-class
  this.dealCards = function () {
    for (let i = 0; i < 5; i++) {
      let playercard = new TreasureCard(this, self.socket, 100 + (i * 180), 440);
      if (i > 2) {
        playercard.levelUpCard(3);
      } else {
        playercard.equipmentCard(5, "Armor");
      }
    }
  }

  //Handles the deal cards event, by recieving the signal to deal cards and doing it.
  this.socket.on('dealCards', function () {
    console.log("Now dealing cards!");
    self.dealCards();
    self.dealCardsText.destroy();
  });

}

function update() { }

//Adds a playerInfoText graphic using a player-object received from the server
function addPlayerText(self, playerInfo) {
  const playerText = self.add.text(0, 0, playerInfo.playerName + " Points:" + playerInfo.points).setOrigin(0.5, 0.5);
  const character = playerInfo.character.combatClass + " - " + playerInfo.character.race + "\nLevel(+ bonus): " + playerInfo.character.combatLevel;
  const characterText = self.add.text(0, 25, character).setOrigin(0.5, 0.5);
  self.playerInfoText = self.add.container(playerInfo.x, playerInfo.y, [playerText, characterText]);

  // Pseudo kode
  //get the scene to post something new
  //Get the scene to display what gameState we are in at a given moment
  //Create a button to press when ready for the game to begin
  //Get the button to move gamestates
  //get the button to move gamestates when all players have clicked it6
  const gameStateText = self.add.text(0,50,"gameState is:" + playerState).setOrigin(0.5, 0-5);
}

//Adds another players infoText grahic and adds this grapic to the group.
function addOtherPlayersText(self, playerInfo) {
  const playerText = self.add.text(0, 0, playerInfo.playerName + " Points:" + playerInfo.points).setOrigin(0.5, 0.5);
  const character = playerInfo.character.combatClass + " - " + playerInfo.character.race + "\nLevel(+ bonus): " + playerInfo.character.combatLevel;
  const characterText = self.add.text(0, 25, character).setOrigin(0.5, 0.5);
  const otherPlayerText = self.add.container(playerInfo.x, playerInfo.y, [playerText, characterText]);
  otherPlayerText.playerId = playerInfo.playerId;
  self.otherPlayersInfoText.add(otherPlayerText);
}

function destroyChildren(groupName){
  const allChildren = groupName.getChildren();
  for (let index = allChildren.length - 1; index >= 0; index--) {
  const child = allChildren[index];
  child.destroy();
  }
}


//---------------------------------------------Unit testing------------------------------------------//
/*
NOTE: to not get any errors remember to install this in your terminal:
"npm install --save-dev jest"

NOTE: To test something, type this in your terminal:
"npm test"
 */

//test function to see if phaser is mocked correctly


//function exports for UnitTests
//module.exports = addPlayerText;
//module.exports = this.dealCards();
