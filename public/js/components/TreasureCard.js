export default class TreasureCard extends Phaser.GameObjects.Container {
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
