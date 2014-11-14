(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.rounds.showCtrl', roundShowController);

    function roundShowController($log, $rootScope, $scope, playersService, eloService, round) {

        $rootScope.setActiveMenu('round');

        //Copy the round...
        $scope.round = ng.copy(round);

        var orderMatchesFn = function(m1, m2){
            return (m2.whites.elo + m2.blacks.elo) - (m1.whites.elo + m1.blacks.elo);
        };


        if($scope.round) {
            //We setup previous ELO ON players before the match
            for(var i = 0; i < $scope.round.matches.length; i++) {
                var match = ng.copy($scope.round.matches[i]);

                var whitePlayer = playersService.get(match.whites.$$id);
                var blackPlayer = playersService.get(match.blacks.$$id);

                var whiteMatchPositionIdx = findHistoryMatchInPositionIdx(whitePlayer, match);
                var blackMatchPositionIdx = findHistoryMatchInPositionIdx(blackPlayer, match);

                match.whites.position = whiteMatchPositionIdx == 0
                    ? 1500
                    : whitePlayer.historyPosition[whiteMatchPositionIdx - 1].position;
                match.blacks.position = blackMatchPositionIdx == 0
                    ? 1500
                    : blackPlayer.historyPosition[blackMatchPositionIdx - 1].position;


                $scope.round.matches[i] = match;
            }

            $scope.round.matches.sort(orderMatchesFn);
        }

        var setUp = function() {
            $scope.roundsLength = eloService.getAllRounds().length;
        };

        setUp();

        $scope.$on('$eloServiceRoundFinished', setUp);

    };

    function findHistoryMatchInPositionIdx(player, match) {
        for(var i = 0; i < player.historyPosition.length; i++) {
            if(match.$$id == player.historyPosition[i].match) {
                return i;
            }
        }
    }

})(angular);