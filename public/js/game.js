class TreasureCard extends Phaser.GameObjects.Container {
  constructor(scene, socket, x, y) {
    super(scene);
    let self = this;

    let cardType = undefined;
    let cardBack = this.scene.add.rectangle(0, 0, 120, 150, 0x9966ff).setInteractive();
    let cardText = this.scene.add.text(0, 0, 'A card');

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.add(cardBack);
    this.add(cardText);

    this.levelUpCard = function (numberOfLevels) {
      cardType = "levelUpCard";
      cardBack.setFillStyle(0x3D85C6);
      cardText.setText("LevelUp");
      cardBack.on('pointerdown', function () {
        console.log("Adding " + numberOfLevels + " points to player");
        socket.emit('treasure', socket.id, cardType, numberOfLevels);
        self.destroy();
      });
    }

    this.equipmentCard = function (levelBonus, equipmentType) {
      cardType = "equipmentCard"
      cardBack.setFillStyle(0xD8BC4B);
      cardText.setText("" + equipmentType);
      cardBack.on('pointerdown', function () {
        console.log("Adding " + levelBonus + " to player");
        socket.emit('treasure', socket.id, cardType, levelBonus, equipmentType);
        self.destroy();
      });
    }
    //TODO: #7 Add functionality for an item-card.
    this.scene.add.existing(this);
  }
}
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
var textStyle = {
  font: "normal 18px Trebuchet MS",
  fill: '#ffffff',
  align: 'center',
};
var game = new Phaser.Game(config);
var playerState = 100;

function preload() {
}

function create() {
  // TODO: #8 Implement a GameState
  this.socket = io();
  let self = this;
  this.otherPlayersInfoText = this.add.group(); //creates a group that holds all PlayerInfoText-objects for the other players.

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
  });
  console.log(playerState);
  //Input: a single player-object (the new player)
  //Output: adds a text grapic for the new player and rearanges all other players
  this.socket.on('newPlayer', function (player) {
    addOtherPlayersText(self, player);
    let count = 1;
    self.otherPlayersInfoText.getChildren().forEach(function (otherPlayerText) {
      count = count + 1;
      otherPlayerText.x = 200 * count;
    });
  });

  //Input: an array of players indexed with socket.id
  //Output: removes existing text graphics for player info, and redraws them using the provided array
  this.socket.on('update', function (players) {
    console.log("Updating");
    self.playerInfoText.destroy();
    //Removes the text-graphics for other players info.
    const allOtherPlayersText = self.otherPlayersInfoText.getChildren();
    for (let index = allOtherPlayersText.length - 1; index >= 0; index--) {
      const otherPlayerText = allOtherPlayersText[index];
      otherPlayerText.destroy();
    }
    //Makes the new objects and spaces them out
    let count = 1;
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayerText(self, players[id]);
      } else {
        count = count + 1;
        players[id].x = 200 * count;
        addOtherPlayersText(self, players[id]);
      }
    });
  });

  //Input: the disconnected players socket.id.
  //Output: removes the disconnected player's info text-graphic and reorders all the others.
  this.socket.on('disconnectPlayer', function (playerId) {
    let count = 1;
    const allOtherPlayersText = self.otherPlayersInfoText.getChildren();
    for (let index = allOtherPlayersText.length - 1; index >= 0; index--) {
      const otherPlayerText = allOtherPlayersText[index];
      if (playerId === otherPlayerText.playerId) {
        otherPlayerText.destroy();
      } else {
        count = count + 1;
        otherPlayerText.x = 200 * count;
      }
    }
  });

  //Makes a "Deal Cards" text Graphic and sets it to be interactive.
  this.dealCardsText = this.add.text(config.width / 2, config.height / 2, 'DEAL CARDS', textStyle).setInteractive().setOrigin(0.5, 0.5);

  //Defines a function to create and render the cards objects using the Card-class
  this.dealCards = function () {
    for (let i = 0; i < 5; i++) {
      let playercard = new TreasureCard(this, self.socket, 100 + (i * 180), 440);
      if (i > 2) {
        playercard.levelUpCard(3);
      } else {
        playercard.equipmentCard(5, "Armor");
      }
      // let playerCard = new TreasureCard(this, self.socket);
      // playerCard.render(100 + (i * 200), 440);
    }
  }

  //Defines a function that is run when the mouse is pressed (pointerdown) on the dealCardsText-grapic.
  this.dealCardsText.on('pointerdown', function () {
    self.dealCards();
    self.socket.emit('dealCards');
    self.dealCardsText.destroy();
  })

  //Handles the deal cards event, by recieving the signal to deal cards and doing it.
  this.socket.on('dealCards', function () {
    console.log("Now dealing cards!");
    self.dealCards();
    self.dealCardsText.destroy();
  });

  //Hover effect
  this.dealCardsText.on('pointerover', function () {
    self.dealCardsText.setColor('#ff69b4');
  })

  this.dealCardsText.on('pointerout', function () {
    self.dealCardsText.setColor('#00ffff');
  })

  //Dictates logic for dragging a game-object
  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
  })

  //Dictates logic for when a dragged object is let go
  //This function emits an 'addPoint' notification to the server and destroys the used object.
  this.input.on('dragend', function (pointer, gameObject) {
    self.socket.emit('addPoint', self.socket.id);
    gameObject.destroy();
    console.log("Adding your point");
  })
}

function update() { }

//Adds a playerInfoText graphic using a player-object recieved from the server
function addPlayerText(self, playerInfo) {
  const playerText = self.add.text(0, 0, playerInfo.playerName + " Points:" + playerInfo.points).setOrigin(0.5, 0.5);
  const character = playerInfo.character.combatClass + " - " + playerInfo.character.race + "\nLevel(+ bonus): " + playerInfo.character.combatLevel;
  const characterText = self.add.text(0, 25, character).setOrigin(0.5, 0.5);
  self.playerInfoText = self.add.container(playerInfo.x, playerInfo.y, [playerText, characterText]);
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


//---------------------------------------------Unit testing------------------------------------------//
/*
NOTE: to not get any errors remember to install this in your terminal:
"npm install --save-dev jest"

NOTE: To test something, type this in your terminal:
"npm test"
 */

//function exports for UnitTests
//module.exports = addPlayerText;