export default class Card {
    constructor(scene) {
        this.render = (x, y) => {
            let cardBack = scene.add.rectangle(0, 0, 120, 150, 0x9966ff);
            let cardText = scene.add.text(0,0, 'HI Im a card');
            let card = scene.add.container(x,y,[ cardBack, cardText ]);
            card.setSize(cardBack.width, cardBack.height);
            card.setInteractive();
            scene.input.setDraggable(card);
            
            return card;
        }
    }
}