(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.service('playersService', playersService);

    function playersService($log, $rootScope, chance) {

        var _ids = 1;

        //Generate players on root scope
        $rootScope.players = [];

        //Will generate a random player
        this.generatePlayers = function(num) {
            for(var i = 0; i < num; i++) {
                var player = generateAPlayer();
                player.position = i + 1;
                $rootScope.players.push(player);
            }
        };

        //Will update the roster
        this.updateRoster = function(round) {

            var players = $rootScope.players.slice().sort(sortByEloFn);

            for(var i = 0; i < players.length; i++) {


                var player = players[i];

                player.diff = player.position - (i + 1);
                player.position = i + 1;

                var match = undefined;
                for(var j = 0; j < round.matches.length; j++) {
                    if(round.matches[j].whites.$$id == player.$$id ||
                        round.matches[j].blacks.$$id == player.$$id) {
                        match = round.matches[j];
                        break;
                    }
                }

                player.historyPosition.push({
                    match: match.$$id,
                    position: player.position
                });
            }
        };

        //Retrieve a player by his id
        this.get = function(id) {
            for(var i = 0; i < $rootScope.players.length; i++) {
                if($rootScope.players[i].$$id == id) {
                    return $rootScope.players[i];
                }
            }

            return null;
        };

        //Retrieve all
        this.getAll = function() {
            return $rootScope.players;
        }

        //Retrieve the roster
        this.getRoster = function(){
            return $rootScope.players.slice().sort(sortByPositionFn);
        };

        //Will generate players
        var generateAPlayer = function() {
            return {
                name : chance.name({ middle: true}),
                elo: 1500,
                $$id: _ids++,
                diff: 0,
                position: -1,
                historyPosition: []
            }
        };

        //Sort players by position
        function sortByPositionFn(p1, p2 ){
            return p1.position - p2.position;
        };

        //Sort players by elo fn
        function sortByEloFn(p1, p2){
            return p2.elo - p1.elo;
        };
    };

})(angular);