import TreasureCard from './components/TreasureCard.js';
import DoorCard from './components/DoorCard.js';
import GameState1 from './gamestates/GameState1.js';
import GameState0 from './gamestates/GameState0.js';
import GameState2 from './gamestates/GameState2.js';
import GameState3 from './gamestates/GameState3.js';

var textStyle = {
  fontFamily: 'Quasimodo',
  fontSize: '18px',
  color: 'black',
};
var textStyle2 = {
  fontFamily: 'LibreCaslon',
  fontSize: '17px',
  color: 'black',
};
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
  //Loads image assets
  this.load.image('background','./assets/background.jpg')
  this.load.image('monster', './assets/professorMonster.png');
}

function create() {
  //Creates the background image
  this.add.image(0, 0, 'background').setOrigin(0,0);

  //Define scene-variables
  this.socket = io();
  let self = this;
  this.otherPlayersInfoText = this.add.group(); //creates a group that holds all PlayerInfoText-objects for the other players.
  this.gameStateGroup = this.add.group(); //creates a group to hold all gamestate stuff.
  this.playerHand = this.add.group(); //creates a group to hold the players deck.
  let playerState = null; //Sets an inital playerstate-value as null


  this.socket.on('currentPlayers', function (players) {
    /*
    Input: an array of players indexed with socket.id.
    Output: text graphics for all players.

    This function handles the initial connection by creating a player-text
    for the connected player, and updating all existing players
    */
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

  this.socket.on('update', function (players) {
    /*
    Input: an array of players indexed with socket.id
    Output: removes existing graphics and replaces them with new graphics based on updated information

    This function handles all updates of the interface. It starts by updating player-related text graphics
    and then it renderes the gamestates relevant changes.
    */
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
    destroyChildren(self.gameStateGroup); //Destroys all existing gamestate graphics
    if (playerState == null) {
      //Only happens if playerState isn't updated
      console.log("Error: Playerstate should not be null");
    } 
    if (playerState == 0) {
      let gameState = new GameState0(self, self.socket);
      self.gameStateGroup.add(gameState);
    }
    if (playerState == 1){
      let gameState = new GameState1(self, self.socket);
      self.gameStateGroup.add(gameState);
    }
    if (playerState == 2){
      let gameState = new GameState2(self, self.socket);
      self.gameStateGroup.add(gameState);
    }
    if (playerState == 3){
      let gameState = new GameState3(self, self.socket);
      self.gameStateGroup.add(gameState);
      destroyChildren(self.playerHand);
    }
  });

  //Defines a function to create and render the cards objects using the Card-class
  this.dealCards = function () {
    for (let i = 0; i < 5; i++) {
      let doorcard = new DoorCard(this, self.socket, 100 + (i * 180), 300);
      doorcard.monsterCard(5);
      let treasurecard = new TreasureCard(this, self.socket, 100 + (i * 180), 480);
      if (i > 2) {
        treasurecard.levelUpCard(1);
      } else {
        treasurecard.equipmentCard(5, "Armor");
      }
      self.playerHand.add(treasurecard);
      self.playerHand.add(doorcard);
    }
    self.socket.emit('changeState', 2);
  }

  //Handles the deal cards event, by recieving the signal to deal cards and doing it.
  this.socket.on('dealCards', function () {
    console.log("Now dealing cards!");
    self.dealCards();
  });

  //Handles any sort of alert emitted from the server to the player.
  this.socket.on('alert', function(content){
    alert(content);
  });
}

function update() { }

//Adds a playerInfoText graphic using a player-object recieved from the server
function addPlayerText(self, playerInfo) {
  //Creates the player text graphic
  const player = playerInfo.playerName + " Level: " + playerInfo.points;
  const playerText = self.add.text(0, 0, player, textStyle).setOrigin(0.5, 0.5);
  //Creates the character text graphic
  const character = playerInfo.character.combatClass + " - " + playerInfo.character.race + "\nLevel(+ bonus): " + playerInfo.character.combatLevel;
  const characterText = self.add.text(0, 25, character, textStyle2).setOrigin(0.5, 0.5);
  //Adds the text graphics to a container called playerInfoText
  self.playerInfoText = self.add.container(playerInfo.x, playerInfo.y, [playerText, characterText]);
}

//Adds another players infoText grahic and adds this grapic to the group.
function addOtherPlayersText(self, playerInfo) {
  //Creates the player text graphic
  const player = playerInfo.playerName + " Level:" + playerInfo.points;
  const playerText = self.add.text(0, 0, player, textStyle).setOrigin(0.5, 0.5);
  //Creates the character text graphic
  const character = playerInfo.character.combatClass + " - " + playerInfo.character.race + "\nLevel(+ bonus): " + playerInfo.character.combatLevel;
  const characterText = self.add.text(0, 25, character, textStyle2).setOrigin(0.5, 0.5);
  const otherPlayerText = self.add.container(playerInfo.x, playerInfo.y, [playerText, characterText]);
  //Defines a playerId for the text-object and adds it to the group of otherplayer text graphics
  otherPlayerText.playerId = playerInfo.playerId;
  self.otherPlayersInfoText.add(otherPlayerText);
}

//Destroys all children within a group or container.
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

//function exports for UnitTests
//module.exports = addPlayerText;