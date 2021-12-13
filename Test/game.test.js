//imports the phaser library from node_modules in project folder
//import * as phaser from '../phaser/src';

//import * as game from '../../public/js/game.js';

//const {Phaser} = require('phaser.js');

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


//const io = require('../server.js');
//const io = require('../public/index.html');

//const io = require('socket.io-client');
//const http = require('http');
//const ioBack = require('socket.io');


//import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
//const io = require('socket.io-client');
//const io = require('/socket.io/socket.io.js');
//const io = require('../node_modules/socket.io/client-dist/socket.io.esm.min.js')
//const io = require('https://cdn.socket.io/socket.io-3.0.1.min.js');


//const {Phaser} = require("../public/js/game.js");

//import { Socket } from "/socket.io/socket";

//const {io} = require('../public/js/game.js');

//const {io} = require('../server.js');

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












