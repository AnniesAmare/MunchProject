export default class DoorCard extends Phaser.GameObjects.Container {
  constructor(scene, socket, x, y) {
    super(scene);
    let self = this;

    let cardType = undefined;
    let cardBack = this.scene.add.rectangle(0, 0, 120, 150, 0x9966ff).setInteractive();
    let cardText = this.scene.add.text(0, 0, 'A card',textStyle2).setOrigin(0.5,0.5);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.add(cardBack);
    this.add(cardText);

    this.monsterCard = function (numberOfLevels) {
      cardType = "monster";
      cardBack.setFillStyle(0xfff4e6);
      cardBack.setStrokeStyle(4, 0x764d4a)
      cardText.setText("A monster\nLevel: "+numberOfLevels);

      cardBack.on('pointerdown', function () {
        socket.emit('door', cardType, numberOfLevels);
        self.destroy();
      });
    }

    this.scene.add.existing(this);
  }
}

var textStyle2 = {
  fontFamily: 'LibreCaslon',
  fontSize: '17px',
  color: 'black',
};