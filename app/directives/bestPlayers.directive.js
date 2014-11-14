(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.directive('bestPlayers', bestPlayers);

    function bestPlayers(){
        return {
            restrict: 'E',
            templateUrl: 'app/templates/bestPlayers.directive.html',
            controller: function($log, $scope, playersService, eloService){

                var setUp = function(){
                    $scope.players = playersService.getRoster().splice(0, $scope.num);
                    $scope.round = eloService.getLastRound();
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