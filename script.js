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

        if(options){
            _options = options;
        }
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
//    var _checkUniquePosition = function(pos,shipSize, orientation){
//        //console.log(pos);
//
//        if (orientation == 0)
//
//        return pos;
//    };
    var _isPositionFree = function(pos, shipSize, orientation){

        if(orientation == 0){

            for(var i = 0; i < shipSize; i++){

                if(_shipLocationsArr.indexOf(_boardArr[pos+i]) != -1){

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
//                console.log('--------------');
//                console.log('pos ' + randomPosition);
//                console.log('size ' + shipSize);
//                console.log('orientation ' + shipOrientation);

                if(badPosArr.indexOf(randomPosition) != -1){

//                    console.log('in bad positions');
                    randomPosition -= (shipSize - 1);
//                    console.log('is new pos free? '+_isPositionFree(randomPosition, shipSize, shipOrientation));
//                    while(_isPositionTaken){
//                        randomPosition--;
//                    }

                }

                for (j=0; j < _options.ships[i];j++){

                    _addShipCell(_boardArr[randomPosition]);
                    randomPosition++;
                }
            }
            else if (shipOrientation == 1){

                if(badPosArr.indexOf(randomPosition) != -1){

                    randomPosition -= (shipSize -1) * _options.boardSize;
                }

                for (j=0; j < _options.ships[i];j++){

                    _addShipCell(_boardArr[randomPosition]);
                    randomPosition+= _options.boardSize;
                }
            }

        }
        console.log(_shipLocationsArr);
    };

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

        // (1)
        /*
        for(var i=0; i < _options.ships.length; i++){

            var shipSize = _options.ships[i];




            // (3) - set random ship start position from board array
            var shipStartsAt = Math.floor(Math.random() * _boardArr.length);

            var badPosArr = [];
            var badPos = _options.boardSize - shipSize + 1;

            for(var k = 0; k < _options.boardSize; k++){

                for(var j=0; j < shipSize - 1; j++){

                    badPosArr.push(badPos+j);
                }

                badPos += _options.boardSize;
            }

            console.log('bpa: ' + badPosArr);

            // (3a) - make sure that ship starting positions are unique
            while(1){

                if(_shipLocationsArr.indexOf(_boardArr[shipStartsAt]) == -1){

                    console.log(_shipLocationsArr.indexOf(_boardArr[shipStartsAt]));

                    if(badPosArr.indexOf(_boardArr[shipStartsAt] == -1)){
                        console.log('not in bad pos');
                    } else {
                        console.log('bad pos');
                    }
                    // make sure starting position for a ship size is correct distance from board edge


                    // (4) - insert starting ship position ids into _shipLocationsArr
                    _shipLocationsArr.push(_boardArr[shipStartsAt]);

                    break;
                } else {
                    // generate new starting index
                    shipStartsAt = Math.floor(Math.random() * _boardArr.length);
                    continue;
                }
            }

//            console.log('board length: ' + _boardArr.length);
//            console.log('board size: ' + _options.boardSize);
//            console.log('ship size: ' + shipSize);
//            console.log('ship starts at: ' + shipStartsAt);
*/
            // (5) - run through each ship length
           /* for(var p = 1; p < shipSize; p++){

                // if position is horizontal
                if(shipOrientation == 0){

                    //console.log(shipStartsAt);
                    shipStartsAt++;
                    _shipLocationsArr.push(_boardArr[shipStartsAt]);


                } else if(shipOrientation == 1) {

                    // code for vertical position
                    shipStartsAt += _options.boardSize;

                    _shipLocationsArr.push(_boardArr[shipStartsAt]);
                }
            }*/
       /* }*/
        //console.log(_shipLocationsArr);
    //};

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