(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.service('eloService', eloService);

    function eloService($log, $rootScope, $interval, $config, playersService, schedulerService) {

        var $this = this;
        var _roundNum = 1;
        var _matchIds = 1;

        $rootScope.isStarted = false;
        $rootScope.startProgress = 0;
        $rootScope.initialNumMatches = $config.getInitialNumRounds();

        //Here we will register all rounds
        $rootScope.rounds = [];

        //Generates a match
        var generateAMatch = function(player1, player2, round){

            if(!player1 || !player2) return null;

            var match = {
                $$id : _matchIds++,
                round: round.$$id,
            };


            //We will generate 2 objects, one with player who plays with whites
            // and another to the player who playes with blacks

            match.whites = {
                $$id : player1.$$id,
                name: player1.name,
                elo: player1.elo
            };

            match.blacks = {
                $$id : player2.$$id,
                name: player2.name,
                elo: player2.elo
            };

            var qA = Math.pow(10, match.whites.elo / 400);
            var qB = Math.pow(10, match.blacks.elo / 400);
            match.whites.$$e = qA / (qA + qB);
            match.blacks.$$e = qB / (qA + qB);

            var playerAKFactor = 30;
            var playerBKFactor = 30;

            if(match.whites.elo > 2400) playerAKFactor = 15;
            if(match.blacks.elo > 2400) playerBKFactor = 15 ;

            match.whites.win = Math.round(playerAKFactor * (1 - match.whites.$$e));
            match.whites.lose = Math.round(playerAKFactor * (0 - match.whites.$$e));
            match.whites.withDraw = Math.round(playerAKFactor * (0.5 - match.whites.$$e));

            match.blacks.win = Math.round(playerBKFactor * (1 - match.blacks.$$e));
            match.blacks.lose = Math.round(playerBKFactor * (0 - match.blacks.$$e));
            match.blacks.withDraw = Math.round(playerBKFactor * (0.5 - match.blacks.$$e));

            return match;
        }

        //Resolves a match
        var resolveAMatch = function(match) {

            if(!match) return;

            var whiteResult = Math.random();
            var blackResult = Math.random();

            switch(true) {

                //Withdraws
                case (whiteResult <= match.whites.$$e && blackResult <= match.blacks.$$e) ||
                    (whiteResult > match.whites.$$e && blackResult > match.blacks.$$e):

                    match.result = 0.5;
                    match.whites.eloResult = match.whites.elo + match.whites.withDraw;
                    match.blacks.eloResult = match.blacks.elo + match.blacks.withDraw;

                    break;

                case whiteResult < match.whites.$$e:

                    match.result = 1;
                    match.whites.eloResult = match.whites.elo + match.whites.win;
                    match.blacks.eloResult = match.blacks.elo + match.blacks.lose;

                    break;

                case blackResult < match.blacks.$$e:

                    match.result = 0;
                    match.whites.eloResult = match.whites.elo + match.whites.lose;
                    match.blacks.eloResult = match.blacks.elo + match.blacks.win;

                    break;
            }

            var whitePlayer = playersService.get(match.whites.$$id);
            var blackPlayer = playersService.get(match.blacks.$$id);

            whitePlayer.elo = match.whites.eloResult;
            blackPlayer.elo = match.blacks.eloResult;

            if(!whitePlayer.matches) whitePlayer.matches = [];
            if(!blackPlayer.matches) blackPlayer.matches = [];

            whitePlayer.matches.push(match);
            blackPlayer.matches.push(match);

        };

        //Will make a round of matches
        this.doARound = function(){

            //Retrieve all players (A shallow copy)
            var allPlayers = playersService.getAll().slice();

            function randOrder(itm1, itm2) {
                return .5 - Math.random();
            }

            allPlayers.sort(randOrder);

            //Generate the round
            var round = {
                $$id: _roundNum++,
                matches: [],
                date: new Date()
            };

            for(var i = 0; i < allPlayers.length; i = i + 2)
            {
                var whitePlayer = allPlayers[i];
                var blackPlayer = allPlayers[i + 1];

                if(!whitePlayer ||!blackPlayer) continue;

                var match = generateAMatch(whitePlayer, blackPlayer, round);
                resolveAMatch(match);

                round.matches.push(match);
            }

            //Update players roster...
            playersService.updateRoster(round);
            $rootScope.rounds.push(round);
        };

        //Start the automatic rounds
        this.start = function() {

            //First of all we need to create the players..
            playersService.generatePlayers($config.getNumPlayers());

            $rootScope.lastRoundTime = new Date();

            var maxNumRounds = $config.getInitialNumRounds();

            //We want give the UI thread some time to paint, that is why we use an interval
            var i = 1;
            $interval(function(){

                //Do a round
                if (i < maxNumRounds) {
                    $this.doARound();

                    $rootScope.startProgress = i * 100 / maxNumRounds;
                } else {

                    //Init the aplication

                    $rootScope.lastRoundTime = new Date();
                    $rootScope.nextRound = schedulerService.schedule($this.doARound, $config.getTimeBetweenRounds(), 0, function(nextRoundTime){
                        $rootScope.lastRoundTime = new Date();
                        $rootScope.nextRound = nextRoundTime;
                        $rootScope.$broadcast('$eloServiceRoundFinished');
                    });

                    //Indicate that we have started
                    $rootScope.isStarted = true;
                }

                i++;

            }, 1, maxNumRounds + 1);
        };

        //Retrieve next round time
        this.getNextRoundTime = function(){
            return $rootScope.nextRound;
        };

        //Retrieve last round time
        this.getLastRoundTime = function(){
            return $rootScope.lastRoundTime;
        };

        //Retrieve all rounds
        this.getAllRounds = function() {
            return $rootScope.rounds;
        };

        //Retrieve last round
        this.getLastRound = function() {
            return $rootScope.rounds[$rootScope.rounds.length - 1];
        }

        //Get a round by id
        this.getRound = function(id) {
            for(var i = 0; i < $rootScope.rounds.length; i++) {
                if($rootScope.rounds[i].$$id == id) {
                    return $rootScope.rounds[i];
                }
            }
            return null;
        }

        //Retrieve  amatch
        this.getMatch = function(id) {

            for(var i = 0; i < $rootScope.rounds.length; i++) {
                var round = $rootScope.rounds[i];
                for(var j = 0; j < round.matches.length; j++) {
                    var match = round.matches[j];
                    if(match.$$id == id) {
                        return match;
                    }
                }
            }

            return null;
        }
    };

})(angular);