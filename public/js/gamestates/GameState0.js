//Initial gamestate
export default class GameState0 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    let self = this;
    let text = this.scene.add.text(0, 0, 'Welcome to Digital Munchkin!', textStyle).setOrigin(0.5, 0.5);
    let startText = this.scene.add.text(0, 50, 'Click here to start', textStyle).setInteractive().setOrigin(0.5, 0.5);
    let subTextContent = 'Please make sure that all players are connected before starting'
    let subText =  this.scene.add.text(0, 100, subTextContent, textStyle2).setOrigin(0.5, 0.5);

    this.scene = scene;
    this.x = 1100/2;
    this.y = 200;

    this.add(text);
    this.add(startText);
    this.add(subText);

    startText.on('pointerdown', function () {
      socket.emit('changeState', 1);
      console.log('state change');
    });

    //Hover effect
    startText.on('pointerover', function () {
      startText.setColor('brown');
    })

    startText.on('pointerout', function () {
      startText.setColor('black');
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