var textStyle = {
  fontFamily: 'Quasimodo',
  fontSize: '50px',
  color: 'black',
};

export default class GameState0 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    let self = this;
    let text = this.scene.add.text(0, 0, 'This is GameState 0', textStyle).setInteractive().setOrigin(0.5, 0.5);

    this.scene = scene;
    this.x = 1100/2;
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