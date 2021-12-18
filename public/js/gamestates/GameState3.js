//combat gamestate
export default class GameState3 extends Phaser.GameObjects.Container {
  constructor(scene, socket) {
    super(scene);
    this.scene = scene;
    let self = this;
    let text = this.scene.add.text(0, 0, 'Combat!', textStyle).setOrigin(0.5, 0.5);
    
    let monster = this.scene.add.sprite(0, 150, 'monster').setOrigin(0.5,0.5);
    monster.setScale(0.5);
    let subTextContent = 'combat text';
    let subText =  this.scene.add.text(0, 300, subTextContent, textStyle2).setOrigin(0.5, 0.5);

    let fightText = this.scene.add.text(250, 150, 'Fight!', textStyle).setOrigin(0.5, 0.5).setInteractive();
    let runText = this.scene.add.text(-250, 150, 'Run!', textStyle).setOrigin(0.5, 0.5).setInteractive();

    this.x = 1100/2;
    this.y = 150;

    this.add(text);
    this.add(subText);
    this.add(monster);
    this.add(fightText);
    this.add(runText);

    scene.socket.on('addMonster', function (levels) {
      subText.setText("You are now fighting the evil professor! He is level "+levels);
      console.log("fight level" + levels + "monster!");

      //onclick events
      fightText.on('pointerdown', function () {
      socket.emit('combat', 'fight', levels);
      })

      runText.on('pointerdown', function () {
      socket.emit('combat', 'run');
      })
    });

    //Hover effect
    runText.on('pointerover', function () {
      runText.setColor('brown');
    })

    runText.on('pointerout', function () {
      runText.setColor('black');
    })

    fightText.on('pointerover', function () {
      fightText.setColor('brown');
    })

    fightText.on('pointerout', function () {
      fightText.setColor('black');
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