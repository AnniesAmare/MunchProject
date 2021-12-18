//Phaser import
import * as Phaser from 'phaser';

//client-side imports
const {config} = require('../public/js/game.js');

//server-side imports
import equipmentIsUsable from '../server.js';
//socket imports
const io = require('socket.io-client');
const http = require('http');
const ioBackend = require('socket.io');

//socket variables
let socket;
let httpServer;
let httpServerAddr;
let ioServer;
let players = {};
let id = 4;

/**
 * Run before all tests
 */
beforeAll((done) => {
    //Sets up a dummy-socket.io server to use for tests
    httpServer = http.createServer().listen(9999);
    httpServerAddr = httpServer.address();
    ioServer = ioBackend(httpServer);

    done();
});

/**
 * Run after all tests
 */
afterAll((done) => {
    //Close dummy-server-connection
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
        players[id] = {
            playerId: id,
            playerName: 'Player ' + id,
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
    // Socket cleanup
    if (socket.connected) {
        socket.disconnect();
    }
    done();
});

//defines fetch-method for the test-environment
function setupFetch(data) {
    return function fetch(_url) {
        return new Promise((resolve) => {
            resolve({
                json: () =>
                    Promise.resolve({
                        data,
                    }),
            })
        })
    }
}


//used in debugging
describe('A test to check if the jest-test environment works', () => {
    const aFunction = {
        add: (num1, num2) => num1 + num2
    }

    test('I work!', () => {
        expect(aFunction.add(2, 2)).toBe(4);

    });
});



//Phaser functionality-preparation for future jest-tests, when implementation-code has been refactored
describe('Phaser in our jest implementation', ()=>{
    test('Checks that we can import and create a Phaser objects in jest', async ()=>{
        //see in console.log that this is a canvas-object
        const game = new Phaser.Game(config);


    })
});




describe('Basic example of the functionality in our socket.io implementation', () => {
    test('Should communicate an emit', (done) => {
        // server-side
        ioServer.emit('randomEventName', 'anyMessageWeWantToSend');
        //client-side
        socket.once('randomEventName', (message) => {
            // Check that the message matches
            expect(message).toBe('anyMessageWeWantToSend');
            done();
        });
        ioServer.on('connect', (mySocket) => {
            expect(mySocket).toBeDefined(); //toBeDefined checks that a values isn't undefined
        });
    });

})


describe('Tests the only pure method in our implementation', ()=>{
    test('Tests if equipmentIsUsable() will return true given a correct parameter ex. Armor', async () =>{

        let equipmentType = 'Armor';
        let playerCharacter = players[id].character;

        const myData = {
            methodResult: equipmentIsUsable(playerCharacter, equipmentType),
        }

        //mock function fetch
        global.fetch = jest.fn().mockImplementation(setupFetch(myData))

        const res = await fetch('anyUrl')
        const json = await res.json()
        expect(json).toEqual({
            data: myData
        })

        expect(myData.methodResult).toBe(true);

        global.fetch.mockClear()
        delete global.fetch


    });
})





