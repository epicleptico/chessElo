(function(ng){
    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.players.listCtrl', playersListController);

    function playersListController($log, $rootScope, $scope) {
        $rootScope.setActiveMenu('players');

    };

})(angular);