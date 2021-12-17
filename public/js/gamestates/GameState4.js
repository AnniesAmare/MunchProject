//End of demo gamescreen
export default class GameState4 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    let self = this;
    let text = this.scene.add.text(0, 0, 'This is the end of the demo!', textStyle).setOrigin(0.5, 0.5);
    let subTextContent = 'To reset please refresh all connected sockets'
    let subText =  this.scene.add.text(0, 50, subTextContent, textStyle2).setOrigin(0.5, 0.5);

    this.scene = scene;
    this.x = 1100/2;
    this.y = 200;

    this.add(text);
    this.add(subText);

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