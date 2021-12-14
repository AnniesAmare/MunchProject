const io = require('socket.io-client');
const http = require('http');
const ioBackend = require('socket.io');

let socket;
let httpServer;
let httpServerAddr;
let ioServer;
let players = {};

/**
 * Setup dummy-server
 */
beforeAll((done) => {
    httpServer = http.createServer().listen();
    httpServerAddr = httpServer.address();
    ioServer = ioBackend(httpServer);
    done();
});

/**
 *  Close dummy-server-connection
 */
afterAll((done) => {
    ioServer.close();
    done();
});

/**
 * Run before each test
 */
beforeEach((done) => {
    // Socket setup
    socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
    });
    socket.on('connect', () => {
        players[socket.id] = {
            playerId: socket.id,
            playerName: 'Player ' + socket.id[3],
            playerState: 0,
            points: 0,
            x: 200,
            y: 50,
            character: {
                race: "Human",
                combatClass: "Classless",
                combatLevel: 0,
                levelBonus: 0,
                armor: false,
                sword: false,
            },
        };
        done();
    });
});

/**
 * Run after each test
 */
afterEach((done) => {
    // Cleanup
    if (socket.connected) {
        socket.disconnect();
    }
    done();
});


describe('basic test to check if the jest-test environment works', () => {
    const functions = {
        add: (num1, num2) => num1 + num2
    }


//test for test function
    test('Please effing work', () => {
        expect(functions.add(2, 2)).toBe(4);

    });
});

describe('basic example of our socket.io implementation', () => {
    test('should communicate', (done) => {
        // server-side
        ioServer.emit('randomEventName', 'currentPlayers');
        //client-side
        socket.once('randomEventName', (message) => {
            // Check that the message matches
            expect(message).toBe('currentPlayers');
            done();
        });
        ioServer.on('connection', (mySocket) => {
            expect(mySocket).toBeDefined(); //toBeDefined checks that a values isn't undefined
        });
    });
});


import * as Phaser from 'phaser';
//jest.mock('Phaser');
//expect(Phaser.get).toHaveBeenCalled();


const {config} = require('../public/js/game.js');

const game = new Phaser.Game(config);

const scene = game.scene.getScene('create');

const {dealCards} = require('../public/js/game.js');
//const TreasureCard = require('../public/js/components/TreasureCard.js');
//import TreasureCard from '../public/js/components/TreasureCard.js';
//TreasureCard(scene);

//let dummyTreasureCard = new TreasureCard(scene, socket, 100 + 180, 440);






/*

test('Phaser test', () =>{
    let playercard = new TreasureCard(scene, socket, 100 + 180, 440);
    const spy = jest.spyOn(playercard, 'dealCards');
    //const newCard = dealCards.playercard;
    expect(spy).toHaveBeenCalled();
    expect(playercard).toBe(true);
});

 */


/*

test('Phaser test', () => {
    const instance = Phaser.instance();
    const spy = jest.spyOn(instance, 'dealCards');
    //instance.forceUpdate();

    const wrapper = Phaser.find('.TreasureCard').simulate('dealCards');
    expect(spy).toHaveBeenCalled();
})

 */




/*

test('testing to se if the mock function for phaser works', ()=>{
    Phaser.expect(dealCards).toBeCalledTimes(1);
});

 */






//jest needs to be able to mock socket.io before this can run
/*
test('Takes a player-object from server as input, and adds a playerInfoText graphic', () => {
    phaser.expect(addPlayerText).toBeCalledWith(expect.objectContaining({playerName: expect.anything()},));
});

 */












