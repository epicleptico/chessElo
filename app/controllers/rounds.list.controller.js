(function(ng){
    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.rounds.listCtrl', roundsListController);

    function roundsListController($log, $rootScope, $scope, playersService, eloService) {

        $rootScope.setActiveMenu('rounds');

        $scope.currentPage = 1;
        $scope.itemsPerPage = 100;

        var setUp = function() {

            var allRounds = eloService.getAllRounds();
            $scope.totalItems = allRounds.length;

            var startIdx = ($scope.currentPage - 1) * $scope.itemsPerPage;
            var rounds = allRounds.slice(startIdx, startIdx + $scope.itemsPerPage);

            for(var i = 0; i < rounds.length; i++) {

                var round = ng.copy(rounds[i]);

                round.whites = 0;
                round.blacks = 0;
                round.withDraw = 0;

                for(var j = 0; j < round.matches.length; j++) {
                    var matchResult = round.matches[j].result;

                    switch(matchResult) {
                        case 0: round.blacks++; break;
                        case 1:  round.whites++; break;
                        case 0.5: round.withDraw++; break;
                    }
                }

                rounds[i] = round;
            }

            //Set up rounds on scope
            $scope.rounds = rounds;
        };

        setUp();

        $scope.onChangePage= function() {
            setUp();
        };
        $scope.$on('$eloServiceRoundFinished', setUp);


    };

})(angular);