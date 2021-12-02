var textStyle = {
    font: "normal 18px Trebuchet MS",
    fill: '#ffffff',
    align: 'center',
};

export default class GameState1 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    this.scene = scene;
    let self = this;
    let text = scene.add.text(0, 0, 'This is GameState 1').setInteractive().setOrigin(0.5, 0.5);
    let dealCardsText = scene.add.text(0, 50, 'DEAL CARDS', textStyle).setInteractive().setOrigin(0.5, 0.5);

    this.x = 500;
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
      dealCardsText.setColor('#ff69b4');
    })

    dealCardsText.on('pointerout', function () {
      dealCardsText.setColor('#00ffff');
    })

    //Adds all the tings to the scene
    this.scene.add.existing(this);
  }
}