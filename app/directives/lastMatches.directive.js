(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.directive('lastMatches', lastMatches);

    function lastMatches(){
        return {
            restrict: 'E',
            templateUrl: 'app/templates/lastMatches.directive.html',
            controller: function($log, $scope, playersService, eloService){

                var setUp = function(){

                    //Retrieve lastRound
                    var lastRound = eloService.getLastRound();

                    if(!lastRound) return;

                    var matches = lastRound.matches;

                    for(var i = 0; i < matches.length; i++) {
                        var match = ng.copy(matches[i]);

                        var whitePlayer = playersService.get(match.whites.$$id);
                        var blackPlayer = playersService.get(match.blacks.$$id);

                        match.whites.position = whitePlayer.historyPosition[whitePlayer.historyPosition.length - 2].position;
                        match.blacks.position = blackPlayer.historyPosition[blackPlayer.historyPosition.length - 2].position;

                        matches[i] = match;
                    }

                    var orderMatchesFn = function(m1, m2){
                        return (m2.whites.elo + m2.blacks.elo) - (m1.whites.elo + m1.blacks.elo);
                    };

                    //Retrieve matches copy sort, splice and set into scope
                    $scope.matches = matches
                        .slice()
                        .sort(orderMatchesFn)
                        .splice(0, $scope.num);

                    //Set round in scope
                    $scope.round = lastRound;
                };

                setUp();

                $scope.$on('$eloServiceRoundFinished', setUp);
            },
            scope: {
                num: '=num'
            }
        }
    };

})(angular);