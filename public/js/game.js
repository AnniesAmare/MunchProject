
class Card {
  constructor(scene, cardType, description) {
    this.cardType = cardType;
    this.description = description;

    this.render = (x, y, text) => {
      //replaces all * with line-breaks
      const search = '*';
      const replaceWith = '\n\n';
      const textWithLineBreaks = text.split(search).join(replaceWith);

      //sets the width and height for a card
      let widthR = 120;
      let heightR = 150;
      //defines the max boundary for text in the card
      let textWrap = {fontSize: 9, wordWrap: {width: widthR - (widthR/16)}};
      //adds the cardShape
      let cardBack = scene.add.rectangle(0, 0, widthR, heightR, 0x9966ff);
      //sets start x and y starting-point for text
      let textX = cardBack.x - (widthR/2.3);
      let textY = cardBack.y - (heightR/2);
      //adds text-pieces
      let cardText = scene.add.text(textX, textY, textWithLineBreaks, textWrap);
      //gathers all card-elements in a collected container
      let card = scene.add.container(x, y, [cardBack, cardText]);

      card.setSize(cardBack.width, cardBack.height);
      card.setInteractive();
      scene.input.setDraggable(card);

      return card;
    }
  }
}


class Door extends Card {
  constructor(scene, cardType, description) {
    super(scene, cardType, description)
  }

  use(){
    //initiates door-card
    //Checks if card is a monster card, this method should return a value that signifies that combat is entered
  }

}

class Monster extends Door{
  constructor(scene, cardType, description, type, level, treasureNumber) {
    super(scene,cardType, description);
    this.type = type;
    this.level = level;
    this.treasureNumber = treasureNumber;
  }

  getLevel(){
    return this.level;
  }

  getTreasureNumber(){
    return this.treasureNumber;
  }

}

class Curse extends Door {
  constructor(scene, cardType, description, effect) {
    super(scene, cardType, description);
    this.effect = effect;
  }


  addCurse(){
    //Applies curse effect to character, monster, treasure or item
  }

  removeCurse(){
    //removes curse effect from character, monster, treasure or item
  }
}

class Treasure extends Card{
  constructor(scene, cardType, description, value,levelBonus) {
    super(scene, cardType, description);
    this.value = value;
    this.levelBonus = levelBonus;

  }

  sell(){
    //Adds a method that sells the item, and adds a level if the combined value
    // of sold items is bigger than 1000
  };

  use(){
    //Applies the item-bonus to the character
    //Checks if it is a usable-once item and if so, it removes the item effect at the end of the turn
  }
}

class Equipment extends Treasure {
  constructor(scene, cardType, type, description, value,levelBonus, size) {
    super(scene, cardType, description, value,levelBonus,description);
    this.type = type;
    this.size = size;
  }
}

class Item extends Treasure {
  constructor(scene, cardType, description, value,levelBonus, effect,usableOnce) {
    super(scene, cardType, description, value,levelBonus,description);
    this.effect = effect;
    this.useableOnce = usableOnce;
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
  let self = this;
  this.socket = io();
  this.otherPlayersInfoText = this.add.group(); //creates a group that holds all PlayerInfoText-objects for the other players.

  // Input: an array of players indexed with socket.id.
  // Output: text graphics for all players.
  this.socket.on('currentPlayers', function (players) {
    let count =1;
    //keys = socket.id's = an id for every player
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayerText(self, players[id]);
      } else {
        count=count+1;
        players[id].x = 180*count;
        addOtherPlayersText(self,players[id]);
      }
    });
  });

  //Input: a single player-object (the new player)
  //Output: adds a text grapic for the new player and rearanges all other players
  this.socket.on('newPlayer', function (player) {
    addOtherPlayersText(self, player);
    let count =1;
    self.otherPlayersInfoText.getChildren().forEach(function (otherPlayerText) {
      count=count+1;
      otherPlayerText.x = 180*count;
    });
  });

  //Input: an array of players indexed with socket.id
  //Output: removes existing text graphics for player info, and redraws them using the provided array
  this.socket.on('update', function (players) {
    console.log("Updating");
    self.playerInfoText.destroy();
    //Removes the text-graphics for other players info.
    const allOtherPlayersText = self.otherPlayersInfoText.getChildren();
    for (let index = allOtherPlayersText.length-1; index >= 0 ; index--) {
      const otherPlayerText = allOtherPlayersText[index];
      otherPlayerText.destroy();
    }
    //Makes the new objects and spaces them out
    let count =1;
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayerText(self, players[id]);
      } else {
        count=count+1;
        players[id].x = 180*count;
        addOtherPlayersText(self,players[id]);
      }
    });
  });

  //Input: the disconnected players socket.id.
  //Output: removes the disconnected player's info text-graphic and reorders all the others.
  this.socket.on('disconnectPlayer', function (playerId) {
    let count =1;
    const allOtherPlayersText = self.otherPlayersInfoText.getChildren();
    for (let index = allOtherPlayersText.length-1; index >= 0 ; index--) {
      const otherPlayerText = allOtherPlayersText[index];
      if (playerId === otherPlayerText.playerId) {
        otherPlayerText.destroy();
      } else {
        count=count+1;
        otherPlayerText.x = 180*count;
      }
    }
  });

  //Makes a "Deal Cards" text Graphic and sets it to be interactive.
  this.dealCardsText = this.add.text(75, 70, 'DEAL CARDS', textStyle).setInteractive();


  //Defines a function to create and render the cards objects using the Card-class
  this.dealCards = () => {
    let Monster1 = new Monster(self, "DoorCard: Monster", "Description: This is Lucifer. Boo-hoo you're screwed",
        "Demon",21, 4);
    let Curse1 = new Curse(self, "DoorCard: Curse", "Description: If someone played this then they want to make your" +
        "life miserable game-wise", "Effect: The dreaded situation of AT interfering during your round. Monster lvl +14")
    let Equipment1 = new Equipment(self, "TreasureCard: Equipment",
        "Short Sword", "Description: This is a short sword made by Merlin himself. You may only wield it if you are a Super Munchkin",
        200, 4, "small - meaning that it isn't a big item")
    let Item1 = new Item(self,"TreasureCard: Item" ,
        "Description: For a small sacrifice you gain strength from this magic lamp!", 300, 1,
        "If you sacrifice a 100 gold you add a lvlBonus to your short sword (If you have one)", false)
    const cardDeck = {Monster1, Curse1, Equipment1, Item1};

    //card-rendering tests
    Monster1.render(100, 440, Monster1.cardType + "*Type:" + Monster1.type + "*" + Monster1.description);
    Curse1.render(100 + 200, 440, Curse1.cardType + "*" + Curse1.description + "*" + Curse1.effect);
    Equipment1.render(100 + 400 , 440, Equipment1.cardType + "*" + Equipment1.description);
    Item1.render(100 + 600, 440, Item1.cardType + "*" + Item1.description + "*Value: " + Item1.value +
    ", Level Bonus: " + Item1.levelBonus);

    /*
    for (let i = 0; i < 4; i++) {
      Equipment1.render(100 + (i * 200), 440, Equipment1.type + "*" + Equipment1.description);
    }
     */

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

function update() {}

//Adds a playerInfoText graphic using a player-object recieved from the server
function addPlayerText(self, playerInfo) {
  self.playerInfoText = self.add.text(playerInfo.x, playerInfo.y, playerInfo.playerName+" Points:"+playerInfo.points).setOrigin(0.5, 0.5);
}

//Adds another players infoText grahic and adds this grapic to the group.
function addOtherPlayersText(self, playerInfo) {
  const otherPlayerText = self.add.text(playerInfo.x, playerInfo.y, playerInfo.playerName+" Points:"+playerInfo.points).setOrigin(0.5, 0.5);
  otherPlayerText.playerId = playerInfo.playerId;
  self.otherPlayersInfoText.add(otherPlayerText);
}