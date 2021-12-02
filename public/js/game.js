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
        socket.emit('treasure', cardType, numberOfLevels);
        self.destroy();
      });
    }

    this.equipmentCard = function (levelBonus, equipmentType) {
      cardType = "equipmentCard"
      cardBack.setFillStyle(0xD8BC4B);
      cardText.setText("" + equipmentType);
      cardBack.on('pointerdown', function () {
        console.log("Adding " + levelBonus + " to player");
        socket.emit('treasure', cardType, levelBonus, equipmentType);
        self.destroy();
      });
    }
    //TODO: #7 Add functionality for an item-card.
    this.scene.add.existing(this);
  }
}

class GameState1 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    let self = this;
    let text = this.scene.add.text(0, 0, 'This is GameState 1').setInteractive();

    this.scene = scene;
    this.x = 500;
    this.y = 200;

    this.add(text);

    text.on('pointerdown', function () {
      socket.emit('changeState', 0);
      console.log('state change');
    });

    //Adds all the tings to the scene
    this.scene.add.existing(this);
  }
}

class GameState0 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    let self = this;
    let text = this.scene.add.text(0, 0, 'This is GameState 0').setInteractive();

    this.scene = scene;
    this.x = 500;
    this.y = 200;

    this.add(text);

    text.on('pointerdown', function () {
      socket.emit('changeState', 1);
      console.log('state change');
    });

    //Adds all the tings to the scene
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
      console.log("gameState-0");
      destroyChildren(self.gameStateGroup);
      let gameState = new GameState0(self, self.socket);
      self.gameStateGroup.add(gameState);
    }
    if (playerState == 1){
      console.log("gameState-1");
      destroyChildren(self.gameStateGroup);
      let gameState = new GameState1(self, self.socket);
      self.gameStateGroup.add(gameState);
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