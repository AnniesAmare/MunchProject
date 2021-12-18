//Cardhandling gamestate
export default class GameState2 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    this.scene = scene;
    let self = this;

    this.x = 1100/2;
    this.y = 200;

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