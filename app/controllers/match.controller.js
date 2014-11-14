(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.matchCtrl', matchController);

    function matchController($log, $rootScope, $scope, playersService, eloService, match) {

        $rootScope.setActiveMenu('match');

        $scope.match = ng.copy(match);

        var whitePlayer = playersService.get($scope.match.whites.$$id);
        var blackPlayer = playersService.get($scope.match.blacks.$$id);

        var whiteMatchPositionIdx = findHistoryMatchInPositionIdx(whitePlayer, $scope.match);
        var blackMatchPositionIdx = findHistoryMatchInPositionIdx(blackPlayer, $scope.match);

        $scope.match.whites.positionBefore = whiteMatchPositionIdx == 0
            ? 1500
            : whitePlayer.historyPosition[whiteMatchPositionIdx - 1].position;
        $scope.match.whites.positionAfter = whitePlayer.historyPosition[whiteMatchPositionIdx].position

        $scope.match.blacks.positionBefore = blackMatchPositionIdx == 0
            ? 1500
            : blackPlayer.historyPosition[blackMatchPositionIdx - 1].position;
        $scope.match.blacks.positionAfter = blackPlayer.historyPosition[blackMatchPositionIdx].position

    };

    function findHistoryMatchInPositionIdx(player, match) {
        for(var i = 0; i < player.historyPosition.length; i++) {
            if(match.$$id == player.historyPosition[i].match) {
                return i;
            }
        }
    }

})(angular);