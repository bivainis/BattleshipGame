/*
 * Battleship Game
 * http://experiments.bivainis.com/
 * Copyright 2014, Gediminas Bivainis
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/*
 // todo:
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
* [1]
* [2]
*
* */


var ShipGame = (function(){

    var _boardEl,

        // letters for board cells
        _lettersArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','v','w','x','y','z'],
        _boardLettersArr,
        _shipLocationsArr = [],
        _boardArr = [],
        _options = {
            boardSize : 7, // default size
            ships : [3,2,1]
        };

    var _setOptions = function(options){

        var largestShip;

        _options.ships = options.ships ? options.ships : _options.ships;
        _options.boardSize = options.boardSize ? options.boardSize : _options.boardSize;

        largestShip = Math.max.apply(Math, _options.ships);

        while (_options.boardSize <= largestShip) {

            var prmt = confirm('Board size must be 1 square larger than the largest ship. Adjust boardsize?');
            _options.boardSize = prmt ? _options.boardSize = largestShip + 1 : confirm('Board size must be 1 square larger than the largest ship. Adjust boardsize?');
        }

        console.log(_options.boardSize);
    };
    var _createBoard = function(opts){

        // new letter array based on board size
        _boardLettersArr = _lettersArr.splice(0, _options.boardSize);

        // create board div to hold all the cells
        _boardEl = document.createElement('div');
        _boardEl.setAttribute('id', 'board');

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
            // start a new row on the board
            _boardEl.appendChild(document.createElement('br'));
        }

        // add the board to body
        document.body.appendChild(_boardEl);

        // place the ships
        _placeShips();
    };
    var _getRandomArrayIndex = function(arr){

        return Math.floor(Math.random() * arr.length);
    };

    var _addShipCell = function(cell){

        _shipLocationsArr.push(cell);
    };

    var _calcForbiddenPositions = function(shipSize, orientation, board){

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
    var _placeShips = function(){

        for (var i=0; i < _options.ships.length; i++){

            var randomPosition,
                randomCell,
                shipSize,
                badPosArr,
                shipOrientation,
                j;

            // (2) - ranodmize orientation: 0 - horizontal, 1 - vertical
            randomPosition = _getRandomArrayIndex(_boardArr);
            randomCell = _boardArr[randomPosition];
            shipSize = _options.ships[i];
            shipOrientation = 0; //Math.floor(Math.random() * [0,1].length);
//            randomPosition = _checkUniquePosition(randomPosition, shipSize, shipOrientation);

            badPosArr = _calcForbiddenPositions(shipSize, shipOrientation, _boardArr);

            console.log('is new pos free? '+_isPositionFree(randomPosition, shipSize, shipOrientation));

            if(shipOrientation == 0){

                while(1){
                    if(_isPositionFree(randomPosition, shipSize, shipOrientation)){
                        console.log('free');
                        break;
                    } else{
                        randomPosition = _getRandomArrayIndex(_boardArr);
                        console.log('generate new position');
                        continue;
                    }
                }

                if(badPosArr.indexOf(randomPosition) != -1){

                    randomPosition -= (shipSize - 1);
                }

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


    var _fire = function(e){

        if(e.target.dataset.cellid){

            var targetid = e.target.dataset.cellid;
            var arrayIndex = _shipLocationsArr.indexOf(targetid);

            if(arrayIndex != -1){

                // remove a target from array once hit
                _shipLocationsArr.splice(arrayIndex, 1);

                //sink the ship
                e.target.className += ' hit';

                if(_shipLocationsArr.length < 1){

                    _win();
                }
            } else {

                e.target.className += ' miss';
            }
        }
    };
    var _win = function(){
        alert('Congratulations, you have won the game');
    };

    var init = function(opts){

        _setOptions(opts);
        _createBoard(_options);

        document.onclick = _fire;
    };

    return {
        init : init
    };

})();