//imports the phaser library from node_modules in project folder
//import * as phaser from '../phaser/src';

//import * as game from '../../public/js/game.js';

const {Phaser} = require('phaser.js');

//mocks phaser module
//jest.mock('phaser');

//ensures that phaser module has been loaded
//expect(phaser.get).toHaveBeenCalled();

/*requireActual(moduleName) Returns the actual module instead of a mock,
bypassing all checks on whether the module should receive a mock implementation or not

May or may not be useful when mocking socket.io*/
//const {Response} = jest.requireActual(phaser);



//import game functions
//const {addPlayerText} = require('../public/js/game.js');
//const {dealCards} = require('../public/js/game.js');



// test function to see if test environment works
const functions = {
    add: (num1, num2) => num1 + num2
}

//test for test function
test('Please effing work', () => {
    expect(functions.add(2,2)).toBe(4);

});

/*
test('testing to se if the mock function for phaser works', ()=>{
    phaser.expect(dealCards.TreasureCard).toBeCalledTimes(1);

});

 */


//jest needs to be able to mock socket.io before this can run
/*
test('Takes a player-object from server as input, and adds a playerInfoText graphic', () => {
    phaser.expect(addPlayerText).toBeCalledWith(expect.objectContaining({playerName: expect.anything()},));
});

 */












