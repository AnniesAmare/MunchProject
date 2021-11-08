#MunchProject CHANGELOG
#November 7th 
Cloned the README.md file from the DigitalMunch project into the MunchProject project. 
Changes has been made to the file to acocunt for the change of technologies we use.
(We´ve moved to using an express server, socket.io and the Visual Studio Code alongside IntelliJ).

Cloned the CHANGELOG.md file from the DigitalMunch project into the MunchProject project.
Changed to tha project has been inserted into this file from November 2nd to November 7th.
#November 5th 
Restarted the project under the banner of MunchProject. 

This has been done to quicken up the workflow, 
and to better work to the strength of the personal.
The grander perspective, and scope, og the project remains unchanged. 

#November 2nd
Created server.js file which host the actions of the server within the program.
This includes the express server url and the location of the local host (8081).

Server set to handle connections via socket.io, and log and displays whenever a player connects.

Server gives players a unique player name, based on the 4th character in their socket.io ID.

Server logs and displays player disconnects.

Server can now deal card to all players, and display when it is done. 

Server can now add a point to a player whenever the player uses a card.

Created a game.js file which hosts the classes, functions and most functionalities of the game. 

Creaded a Card class. 
This host data about the cards functions and attributes. 
An example is the cards size, and that is can contain a card text.

Created a canvas on which the gamme is played.
This includes a desired size of the canvas.

A textstyle variable has been created to handle everything related to fonts and sizes. 

A Create function has been added which creates a group with can contain informarion about all other players.

A function which displays player information has been added and runs all the time in the background.
This function also displays the player info in different places on the screen, 
according to how many players are connected.
This functionality also removes player info from disconnected players. 

A button has been make with the deal card action. 

Displayed card has been made dragable, 
and when dragged upwards it rewards a point to the player.

#DigitalMunch CHANGELOG
#October 20th 2021
README.md file added to repository

CHANGELOG.md added to repository

#October 15th 2021
Deleted Player class and Player tests

Dungeon class renamed to Door class

Door class reworked to reflect class diagram from report_0.2

Tests added for Item, Monster and Equipment classes

IsCursed attribute added

Fixed spelling mistakes inside code

#October 10th 2021
((All classes seperated into separate files and change class names to easier reflect their purpose, 
and highten readablity))

Changed inside "((...))"" reverted due to program not running

Added Classes: Dungeon AND Curse(extends Dungeon)

Added tests for Monster, Treasure, Player and Curse

#October 9th 2021
Created game.js file 

Inside game.js created classes: Character, Treasure, Equipment(extends Treasure), Item (extends Treasure)

Edited index.php down to do not much more than calling the game.js file instead of running the before testing file.

Deleted main.java which we before used as a test for learning and using GitHub

#September 27th 2021
Set up and tested a local host server on the individual PC´s 

Later removed the template used to test local host due tue the template not being related to the project

#September 20th 2021
GitHub repository established and ´merging´ ´pulling´ and ´pushing´ commands learned and tested
