/*
 * Battleship Game
 * http://experiments.bivainis.com/
 * Copyright 2014, Gediminas Bivainis
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/*
 // pseudo:
 // 1) for each ship inside ships array
 // 2) ranodmize orientation: 0 - horizontal, 1 - vertical
 // 3) random position in board array for ship start
 //  3a) make sure that positions are unique
 //      check if value already exists in array
 //      if yes, randomize a new value
 // 4) insert ship position id into _shipLocationsArr
 // 5) if ship orientation is 0:
 //    while ship.length,
 //      while ship position + ship length < board length
 //          insert another position after 1 element
 //          _shipLocationsArr.push(position);
 //          ship position++
 //      ship length--;
 //
 // if ship orientation 1:
 // while ship.length, insert another position after exactly board length
 */

/*
* Table of contents:

 ** [1] SET GAME VARS AND SETTINGS

 ** [2] CREATE GAME BOARD
 // [2a] create new letter array based on board size
 // [2b] create board element
 // [2c] create as many cells as needed based on the board size
 // [2d] add a separator to jump to a new row on a board
 // [2e] create container to hold body and sidebar
 // [2f] add the board to container
 // [2g] create sidebar and place the ships

 ** [3] CREATE BOARD SIDEBAR
 // [3a] for each ship, add ship representation to sidebar list, based on ship length, styled in style.css

 ** [4] PLACE SHIPS
 // [4a] randomize position and assign random cell value
 // [4b] determine current ship size (set in options)
 // [4c] ranodmize ship orientation: 0 - horizontal, 1 - vertical
 // [4d] get array of positions which aren't allowed, see [6]
 // [4e1] escape the loop if position is free OR continue to loop if position is taken, and generate a new random position, until it's unique
 // [4e2] if position is inside forbidden positions array, adjust it's position based on the ship size
 // [4e3] push ship cells to ship locations array for each individual ship cell

 ** [5] GET A RANDOM INDEX FROM PASSED ARRAY

 ** [6] CALCULATE FORBIDDEN POSITIONS
 // [6a] based on orientation and ship size calculate illegal ship start positions and return them as an array

 ** [7] CHECK IF THE POSITION IS NOT TAKEN BY ANOTHER CELL

 ** [8] ADD SHIP CELL TO SHIP LOCATIONS

 ** [9] FIRE
 // [9a] if a target set has data attribute of cell id, get the currently targeted cell by index
 // [9b] remove a target from array once hit
 // [9c] add hit class to sink the ship
 // [9d] if there are no more cells, run win function [10]

 ** [10] WIN NOTIFICATION

 ** [11] RETURN INIT FUNCTION
* */

var ShipGame = (function(){

    // [1] - set object vars and options
    var _gameContainerEl,
        _boardEl, // board container element
        _lettersArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','v','w','x','y','z'],
        _boardLettersArr,
        _shipLocationsArr = [],
        _boardArr = [],
        _options = {
            boardSize : 7,
            ships : [3,2,1]
        },
        _score = 0;


    var _setOptions = function(options){


        var largestShip; // to use below

        // [1a] set local options if options are passed after initializing the game
        _options.ships = options.ships ? options.ships : _options.ships;
        _options.boardSize = options.boardSize ? options.boardSize : _options.boardSize;

        // [1b] - check what is the largest ship,
        // warn a user that the board is too small,
        // adjust board size on confirm
        largestShip = Math.max.apply(Math, _options.ships);

        while (_options.boardSize <= largestShip) {

            var prmt = confirm('Board size must be 1 square larger than the largest ship. Adjust board size?');
            _options.boardSize = prmt ? _options.boardSize = largestShip + 1 : confirm('Board size must be 1 square larger than the largest ship. Adjust boardsize?');
        }


    };
    // [2] create the board
    var _createBoard = function(opts){

        // [2a] create new letter array based on board size
        _boardLettersArr = _lettersArr.splice(0, _options.boardSize);

        // [2b] create board element
        _boardEl = document.createElement('div');
        _boardEl.setAttribute('id', 'board');

        // [2c] create as many cells as needed based on the board size
        for (var i=0; i < _options.boardSize; i++){

            for (var j=0; j < _options.boardSize; j++){

                var cell, cellText, toPush;

                cell = document.createElement('span');
                cellText = document.createTextNode(_boardLettersArr[i]+(j+1));
                cell.dataset.cellid = _boardLettersArr[i]+j;
                cell.className = 'cell';
                cell.appendChild(cellText);

                _boardEl.appendChild(cell);

                toPush = _boardLettersArr[i]+j;
                _boardArr.push(toPush);

            }
            // [2d] add a separator to jump to a new row on a board
            _boardEl.appendChild(document.createElement('br'));
        }

        // [2e] create container to hold body and sidebar
        _gameContainerEl = document.createElement('div');
        _gameContainerEl.id = 'container';
        _gameContainerEl.className = 'container';
        _gameContainerEl.setAttribute("style", "margin-top:" + opts.boardSize * (-1) * 30 / 2 + "px");
        _gameContainerEl.style.width = opts.boardSize * 30 + 200 + 'px';
        _gameContainerEl.appendChild(_boardEl);

        // [2f] add the board to container
        document.body.appendChild(_gameContainerEl);

        // [2g] create sidebar and place the ships
        _createSidebar();
        _placeShips();
    };
    // [3] CREATE BOARD SIDEBAR
    var _createSidebar = function(){

        var sidebarEl = document.createElement('div');
        sidebarEl.id = 'sidebar';

        var title = document.createElement('h4');
        var titleText = document.createTextNode('Destroy these ships');
        var scoreResultEl = document.createElement('div');

        title.appendChild(titleText);
        sidebarEl.appendChild(title);

        // [3a] for each ship,
        //      add ship representation to sidebar list,
        //      based on ship length,
        //      styled in style.css
        for (var i = 0; i < _options.ships.length; i++){

            var shipTag = document.createElement('div');

            for (var j = 0; j < _options.ships[i]; j++){

                var spn = document.createElement('span');
                spn.className = 'sidebarCell';

                shipTag.appendChild(spn);
            }

            sidebarEl.appendChild(shipTag);
        }
        title = document.createElement('h4');
        titleText = document.createTextNode('Score');
        title.appendChild(titleText);
        sidebarEl.appendChild(title);

        scoreResultEl.id = 'scoreResult';
        sidebarEl.appendChild(scoreResultEl);

        _gameContainerEl.appendChild(sidebarEl);
    };
    // [4] PLACE SHIPS
    var _placeShips = function(){

        for (var i=0; i < _options.ships.length; i++){

            var randomPosition,
                randomCell,
                shipSize,
                badPosArr,
                shipOrientation,
                j;

            // [4a] randomize position and assign random cell value
            randomPosition = _getRandomArrayIndex(_boardArr);
            randomCell = _boardArr[randomPosition];

            // [4b] determine current ship size (set in options)
            shipSize = _options.ships[i];

            // [4c] ranodmize ship orientation: 0 - horizontal, 1 - vertical
            shipOrientation = Math.floor(Math.random() * [0,1].length);

            // [4d] get array of positions which aren't allowed (to prevent board overflow), see [6]
            badPosArr = _calcForbiddenPositions(shipSize, shipOrientation, _boardArr);

            // [4e] based on ships orientation
            //      check if the position is not taken, also see [7]
            if(shipOrientation == 0){

                while(1){

                    // [4e1] escape the loop if position is free
                    // OR continue to loop if position is taken,
                    // and generate a new random position, until it's unique
                    if(_isPositionFree(randomPosition, shipSize, shipOrientation)){

                        break;

                    } else {

                        randomPosition = _getRandomArrayIndex(_boardArr);
                    }
                }

                // [4e2] if position is inside forbidden positions array,
                //      adjust it's position based on the ship size
                if(badPosArr.indexOf(randomPosition) != -1){

                    randomPosition -= (shipSize - 1);
                }

                // [4e3] push ship cells to ship locations array for each individual ship cell
                for (j=0; j < _options.ships[i];j++){

                    _addShipCell(_boardArr[randomPosition]);
                    randomPosition++;
                }

            } else if (shipOrientation == 1){

                while(1){
                    if(_isPositionFree(randomPosition, shipSize, shipOrientation)){

                        break;
                    } else{

                        randomPosition = _getRandomArrayIndex(_boardArr);
                        continue;
                    }
                }

                if(badPosArr.indexOf(randomPosition) != -1){

                    randomPosition -= (shipSize -1) * _options.boardSize;
                }

                for (j=0; j < _options.ships[i];j++){

                    _addShipCell(_boardArr[randomPosition]);
                    randomPosition+= _options.boardSize;
                }
            }
        }
    };
    // [5] GET A RANDOM INDEX FROM PASSED ARRAY
    var _getRandomArrayIndex = function(arr){

        return Math.floor(Math.random() * arr.length);
    };
    // [6] CALCULATE FORBIDDEN POSSITIONS
    var _calcForbiddenPositions = function(shipSize, orientation, board){

        // [6a] based on orientation and ship size
        //      calculate illegal ship start positions
        //      and return them as an array
        if (orientation == 0){

            var badPosArr = [];
            var badPos = _options.boardSize - shipSize + 1;

            for(var k = 0; k < _options.boardSize; k++){

                for(var l=0; l < shipSize - 1; l++){

                    badPosArr.push(badPos+l);
                }

                badPos += _options.boardSize;
            }

            return badPosArr;

        } else if (orientation == 1) {

            var badPosArr = [];
            var slicedArr = board.slice(-(_options.boardSize * (shipSize-1)));

            for(var i = 0; i < slicedArr.length; i++){
                badPosArr.push(board.indexOf(slicedArr[i]));
            }

            return badPosArr;
        }
    };
    // [7] CHECK IF THE POSITION IS NOT TAKEN BY ANOTHER CELL
    var _isPositionFree = function(pos, shipSize, orientation){

        if(orientation == 0){

            for(var i = 0; i < shipSize; i++){

                if(_shipLocationsArr.indexOf(_boardArr[pos+i]) != -1){

                    return false;
                }
            }
        } else if (orientation == 1){

            for(var i = 0; i < shipSize; i++){

                if(_shipLocationsArr.indexOf(_boardArr[pos+_options.boardSize]) != -1){

                    return false;
                }
            }
        }

        return true;
    };
    // [8] ADD SHIP CELL TO SHIP LOCATIONS
    var _addShipCell = function(cell){

        _shipLocationsArr.push(cell);
    };
    // [9] FIRE
    var _fire = function(e){

        // [9a] if a target set has data attribute of cellid
        //      get the currently targeted cell by index
        if(e.target.dataset.cellid){

            var targetId = e.target.dataset.cellid;
            var arrayIndex = _shipLocationsArr.indexOf(targetId);

            if(arrayIndex != -1){

                // [9b] remove a target from array once hit
                _shipLocationsArr.splice(arrayIndex, 1);

                // [9c] add hit class to sink the ship
                e.target.className += ' hit';
                _score+=10;
                // [9d] if there are no more cells, run win function [10]
                if(_shipLocationsArr.length < 1){

                    _win(_score);
                }
            } else {
                if(_score>0) {
                    _score--;
                }

                e.target.className += ' miss';
            }

            // update score sidebar with current score
            _updateScores(_score);
        }
    };
    // [10] WIN NOTIFICATION
    var _win = function(score){

        alert('Congratulations, you have won the game, score is ' + score);
        _storeTheScore(score);
    };
    var _updateScores = function(score){

        var scoreEl = document.getElementById('scoreResult');
        var scoreText = document.createTextNode(score);
        //scoreEl.removeChild(scoreText);
        scoreEl.innerHTML = score;
    };
    var _storeTheScore = function(score){

        var currentScoreBoard = localStorage.shipGameScores ? JSON.parse(localStorage.shipGameScores) : [];
        currentScoreBoard.push(score);
        localStorage.shipGameScores = JSON.stringify(currentScoreBoard);
    };
    // [11] RETURN INIT FUNCTION
    var init = function(opts){

        _setOptions(opts);
        _createBoard(_options);

        document.onclick = _fire;
    };

    return {
        init : init
    };
})();