//const {addPlayerText} = require('../public/js/game.js');
// import * as phaser from '../node_modules/phaser/src'
const functions = {
    add: (num1, num2) => num1 + num2
}

test('Please effing work', () => {
    expect(functions.add(2,2)).toBe(4);

});

/*
test('Takes a player-object from server as input, and adds a playerInfoText graphic', () => {
    expect(addPlayerText).toBeCalledWith(expect.objectContaining({playerName: expect.anything()},));
});
*/





