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
    httpServer = http.createServer().listen();
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


describe('A test to check if the jest-test environment works', () => {
    const aFunction = {
        add: (num1, num2) => num1 + num2
    }

    test('Please effing work', () => {
        expect(aFunction.add(2, 2)).toBe(4);

    });
});

/*

describe('Tests the phaser-setup in our implementation', ()=>{
    test('Checks that we can create a Phaser-game with a scene', async ()=>{
        const game = new Phaser.Game(config);
        //const scene = game.scene.getScene('create');

        let myData = {
            methodResult: game
        }

        myData = jest.fn();



        global.fetch = jest.fn().mockImplementation(setupFetch(myData))

        const res = await fetch('anyUrl')
        const json = await res.json()


        expect(json).toEqual({
            data: myData
        })

        //checks that the mock has been called
        //expect(global.fetch).toHaveBeenCalledTimes(1);

        //checks that the return-value isn't null or undefined
        expect(json.data).toBeCalledWith(expect.anything())


        global.fetch.mockClear()
        delete global.fetch


    })
});

 */

describe('Basic examples of the functionality in our socket.io implementation', () => {
    /*
    test('Should communicate an emit', (done) => {
        // server-side
        ioServer.emit('randomEventName', 'anyMessageWeWantToSend');
        //client-side
        socket.once('randomEventName', (message) => {
            // Check that the message matches
            expect(message).toBe('anyMessageWeWantToSend');
            done();
        });
        ioServer.on('connection', (mySocket) => {
            expect(mySocket).toBeDefined(); //toBeDefined checks that a values isn't undefined
        });
    });

     */

    test('Tests a mock of how we change the state of a players object', (done)=> {
        // jest.setup.js

        /*
        let myData = {
            methodResult: changePlayerState()
        }

         */


        //client-side should emit the parameters to be changed
        socket.emit('treasure', 'levelUpCard');

        //server-side
            ioServer.once('treasure', (some) => {
                expect(some).toEqual(9)


                /*
                if (value1 == "levelUpCard") {
                    players[id].points = players[id].points + value2;
                }

                 */
            })



        //let val = changePlayerState()

       // let spy = jest.fn().mockImplementation(changePlayerState);

       // expect(val).toEqual(val)

        done()

        //let mock = jest.fn().mockImplementation(myData)

        //expect(spy).toBe(3);

        //expect(myData.methodResult).toBeCalledWith(expect.objectContaining({points: expect.any(Number)},))


    })
});


describe('Tests the only pure method in our implementation', ()=>{
    test('Tests if equipmentIsUsable() will return true given a correct parameter ex. Armor', async () =>{

        let equipmentType = 'Armor';
        let playerCharacter = players[id].character;

        const myData = {
            methodResult: equipmentIsUsable(playerCharacter, equipmentType),
        }

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



/*
import TreasureCard from '../public/js/components/TreasureCard.js';
jest.mock('../public/js/components/TreasureCard.js');

describe('Testing whether the class setup allows for different card types', ()=> {
    test('tests if using the levelUpCard() adds new parameters to a TreasureCard', async() => {
        let playercard = new TreasureCard(scene, socket, 100 + 180, 440);
        playercard.levelUpCard = jest.fn();

        let newCard = playercard.levelUpCard(3);

        //const spy = jest.spyOn(newCard.methods, 'TreasureCard.levelUpCard');

        //expect(spy).toHaveBeenCalledTimes(1);


        const myData = {
            methodResult: newCard
        }

        global.fetch = jest.fn().mockImplementation(setupFetch(myData))
        const res = await fetch('anyUrl')
        const json = await res.json()


        expect(json).toEqual({
            data: myData
        })



        socket.emit('treasure', 'levelUpCard', 3)





        //expect(myData.methodResult).toBe(playercard.levelUpCard());

        global.fetch.mockClear()
        delete global.fetch

    });
});

*/







//jest.genMockFromModule('Phaser');


//expect(Phaser.get).toHaveBeenCalled();




//const mock = jest.mock('../public/js/game.js');

//const TreasureCard = require('../public/js/components/TreasureCard.js');



//const {levelUpCard} = require('../public/js/components/TreasureCard.js');

/*
jest.mock('../public/js/components/TreasureCard.js', ()=>{



    levelUpCard(){

    };


    });

 */

/*

describe('Testing whether the class setup allows for different card types', ()=>{
    test('tests if using the levelUpCard() adds new parameters to a TreasureCard', ()=>{
        let playercard = new TreasureCard(scene, socket, 100 + 180, 440);
        TreasureCard.levelUpCard = jest.fn();

        let newCard = TreasureCard.levelUpCard(3);

        const spy =  jest.spyOn( newCard.methods, 'TreasureCard.levelUpCard');

        expect(spy).toHaveBeenCalledTimes(1);

 */

        /*
        Treasure.levelUpCard = {

        }

         */



        //const newCardMock = jest.fn().mockImplementation(() => playercard.levelUpCard(3));

       // expect(newCard).toHaveBeenCalledTimes(1);




/*

        let levelUpCardMock = {
           levelUpCard: socket.emit('treasure', numberOfLevels)
        }

        const spy =  jest.spyOn(playercard, 'levelUpCard');
        //const newCardMock = playercard.levelUpCard(3).jest.fn();

        expect(spy).toHaveBeenCalled();
        //expect(newCardMock).toHaveProperty('numberOfLevels');

        //expect(spy).toHaveProperty('numberOfLevels');

        //expect(playercard).toBeInstanceOf(TreasureCard);

        //expect.playercard

 */

   // });

  //  });





//const {dealCards} = require('../public/js/game.js');

/*
jest.mock("../public/js/game.js", () => {
    return {
        dealCards: () => {
            return mockfunc(dealCards);
        }
    }
});
let mockfunc = jest.fn();

 */



//test('Phaser test', () =>{

    /*
    dealCards = jest.fn();
    mock.expect.mockfunc.toHaveBeenCalled();

     */
//});




/*
test('Phaser test', () =>{
    let playercard = new TreasureCard(scene, socket, 100 + 180, 440);

    const spy = jest.spyOn(playercard, dealCards);
    //const newCard = dealCards.playercard;

    //spy = jest.fn();
    expect(spy).toHaveBeenCalled();
    expect(playercard).toBe(true);
});


 */

//const {dealCards} = require('../public/js/game.js');


//import TreasureCard from '../public/js/components/TreasureCard.js';
//TreasureCard(scene);

//let dummyTreasureCard = new TreasureCard(scene, socket, 100 + 180, 440);

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












