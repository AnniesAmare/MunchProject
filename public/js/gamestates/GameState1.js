//Carddealing gamestate
export default class GameState1 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    this.scene = scene;
    let self = this;
    let dealCardsText = scene.add.text(0, 50, 'DEAL CARDS', textStyle).setInteractive().setOrigin(0.5, 0.5);

    this.x = 1100/2;
    this.y = 200;

    this.add(dealCardsText);

    //Defines a function that is run when the mouse is pressed (pointerdown) on the dealCardsText-grapic.
    dealCardsText.on('pointerdown', function () {
      scene.dealCards();
      socket.emit('dealCards');
      dealCardsText.destroy();
    })

    //Hover effect
    dealCardsText.on('pointerover', function () {
      dealCardsText.setColor('brown');
    })

    dealCardsText.on('pointerout', function () {
      dealCardsText.setColor('black');
    })

    //Adds all the tings to the scene
    this.scene.add.existing(this);
  }
}

var textStyle = {
  fontFamily: 'Quasimodo',
  fontSize: '50px',
  color: 'black',
};

var textStyle2 = {
  fontFamily: 'LibreCaslon',
  fontSize: '17px',
  color: 'black',
};