var textStyle = {
  fontFamily: 'Quasimodo',
  fontSize: '50px',
  color: 'black',
};

export default class GameState1 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    this.scene = scene;
    let self = this;
    let text = scene.add.text(0, 0, 'This is GameState 1', textStyle).setInteractive().setOrigin(0.5, 0.5);
    let dealCardsText = scene.add.text(0, 50, 'DEAL CARDS', textStyle).setInteractive().setOrigin(0.5, 0.5);

    this.x = 1100/2;
    this.y = 200;

    this.add(text);
    this.add(dealCardsText);

    text.on('pointerdown', function () {
      socket.emit('changeState', 0);
      console.log('state change');
    });

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