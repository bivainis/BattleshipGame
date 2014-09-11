

// todo: pass options via init method
// todo: default options


var ShipGame = (function(){

    var _boardEl;
    // cell coordinates letters
    var _letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','v','w','x','y','z'];
    var _boardLetters;

    // default board options
    var _options = {
        boardSize : 7
    };

    var _setOptions = function(options){

        if(options){
            _options = options;
        }
    };
    var _createBoard = function(opts){

        // new letter array based on board size
        _boardLetters = _letters.splice(0, _options.boardSize);

        // create board div to hold all the cells
        _boardEl = document.createElement('div');
        _boardEl.setAttribute('id', 'board');

        for (var i=0; i < _options.boardSize; i++){

            for (var j=0; j < _options.boardSize; j++){

                var cell = document.createElement('span');
                var cellText = document.createTextNode(_boardLetters[i]+(j+1));
                cell.dataset.cellid = _boardLetters[i]+j;
                cell.className = 'cell';
                cell.appendChild(cellText);

                _boardEl.appendChild(cell);

                //boardArr.push(boardLetters[i]+j);

            }
            // start a new row on the board
            _boardEl.appendChild(document.createElement('br'));
        }

        // add the board to body
        document.body.appendChild(_boardEl);

        console.log(_boardLetters);
    };

    var init = function(opts){

        _setOptions(opts);
        _createBoard(_options);
    };

    return {
        init : init
    };

})();