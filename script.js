

// todo: pass options via init method
// todo: default options


var ShipGame = (function(){

    // default board options
    var _options = {
        boardSize : 7
    };

    var _setOptions = function(options){

        if(options){
            _options = options;
        }
        console.log(_options);
    };



    var init = function(opts){
        _setOptions(opts);
        //console.log(opts);
    };

    return {
        init : init
    };

})();