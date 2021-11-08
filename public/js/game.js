/*
class Card {
  constructor(scene) {
    this.render = (x, y, textD) => {
      //sets the width and height for a card
      let widthR = 120;
      let heightR = 150;
      //defines the max boundary for text in the card
      let textWrap = {fontSize: 10, wordWrap: {width: widthR - (widthR/16)}};
      //adds the cardShape
      let cardBack = scene.add.rectangle(0, 0, widthR, heightR, 0x9966ff);
      //sets start x and y starting-point for text
      let textX = cardBack.x - (widthR/2.3);
      let textY = cardBack.y - (heightR/2);
      //adds text-pieces
      //let text1 = scene.add.text(textX, textY, 'Type: '+ textT, textWrap);
      let text2 = scene.add.text(textX, textY + 10, 'Description: ' + textD, textWrap)
      //gathers all card-elements in a collected container
      let card = scene.add.container(x, y, [cardBack, text2]);

      card.setSize(cardBack.width, cardBack.height);
      card.setInteractive();
      scene.input.setDraggable(card);

      return card;
    }
  }
}
 */

class Door {
  constructor(scene, type, description) {
    this.type = type;
    this.description = description;

  }

  use(){
    //initiates door-card
    //Checks if card is a monster card, this method should return a value that signifies that combat is entered
  }

}
class Monster extends Door{
  constructor(scene, type, description, level, treasureNumber) {
    super(scene, type, description);
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
  constructor(scene, type, description, effect) {
    super(scene, type, description);
    this.effect = effect;
  }


  addCurse(){
    //Applies curse effect to character, monster, treasure or item
  }

  removeCurse(){
    //removes curse effect from character, monster, treasure or item
  }
}

class Treasure{
  constructor(scene, type, description, value,levelBonus) {
    this.type = type;
    this.description = description;
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
  constructor(scene, type, description, value,levelBonus, size) {
    super(scene, type, description, value,levelBonus,description);
    this.size = size;
  }
}

class Item extends Treasure {
  constructor(scene, type, description, value,levelBonus, effect,usableOnce) {
    super(scene, type, description, value,levelBonus,description);
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

  //render cards
  this.render = (x, y, textD) => {
    //sets the width and height for a card
    let widthR = 120;
    let heightR = 150;
    //defines the max boundary for text in the card
    let textWrap = {fontSize: 10, wordWrap: {width: widthR - (widthR/16)}};
    //adds the cardShape
    let cardBack = self.add.rectangle(0, 0, widthR, heightR, 0x9966ff);
    //sets start x and y starting-point for text
    let textX = cardBack.x - (widthR/2.3);
    let textY = cardBack.y - (heightR/2);
    //adds text-pieces
    //let text1 = scene.add.text(textX, textY, 'Type: '+ textT, textWrap);
    let text2 = self.add.text(textX, textY + 10, 'Description: ' + textD, textWrap)
    //gathers all card-elements in a collected container
    let card = self.add.container(x, y, [cardBack, text2]);

    card.setSize(cardBack.width, cardBack.height);
    card.setInteractive();
    self.input.setDraggable(card);

    return card;
  }

  //Defines a function to create and render the cards objects using the Card-class
  this.dealCards = () => {
    let Monster1 = new Monster(self, "Demon", "This is Lucifer. Boo-hoo you're screwed", 21, 4);
    let Curse1 = new Curse(self, "Permanent till removed", "If someone played this then they want to make your" +
        "life miserable game-wise", "The dreaded situation of AT interfering during your round. Monster lvl +14")
    let Equipment1 = new Equipment(self, 200, 4, "This is a short sword made by Merlin himself. " +
        "You may only wield it if you are a Super Munchkin",
        "Short Sword", "small - meaning that it isn't a big item")
    let Item1 = new Item(self, 300, 1, "For a small sacrifice you gain strength from this magic lamp!",
        "If you sacrifice a 100 gold you add a lvlBonus to your short sword (If you have one)", false)
    const cardDeck = {Monster1, Curse1, Equipment1, Item1};

    //converts class-objects to objects
    const {...MonsterObj1} = Monster1;
    const {...CurseObj1} = Curse1;
    const {...EquipmentObj1} = Equipment1;
    const {...ItemObj1} = Item1;

    const cardDeckObj = {MonsterObj1, CurseObj1, EquipmentObj1, ItemObj1};

    const {...cardDeckO} = cardDeck;

    console.log(cardDeck);
    console.log(cardDeckObj);
    console.log(cardDeckO);


    //console.log(cardDeck);
    for (let i = 0; i < 4; i++) {
        self.render(100 + (i * 200), 440, cardDeckObj["description"]);
    }



    /*
    Object.keys(cardDeck).forEach(function(des, i , cardDeck){
      console.log(cardDeck["description"])
      self.render(100 + (i * 200), 440, cardDeck[i]["description"]);
    });

     */



    /*
    this.render(100, 440, Monster1.description);
    this.render(100 + 200, 440, Curse1.description);
    this.render(100 + 400 , 440, Equipment1.description);
    this.render(100 + 600, 440, Item1.description);

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