(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.homeCtrl', homeController);

    function homeController($log, $rootScope, $scope, playersService, eloService){

        $rootScope.setActiveMenu('home');

        var setUp = function(){
            var numMatches = 0;

            //Collect the data
            var allRounds = eloService.getAllRounds();

            for(var i = 0; i < allRounds.length; i++) {
                numMatches += allRounds[i].matches.length;
            }

            $scope.numPlayers = playersService.getAll().length;
            $scope.numRounds = allRounds.length;
            $scope.numMatches = numMatches;

        };

        setUp();
        $scope.$on('$eloServiceRoundFinished', setUp);

    };
})(angular);