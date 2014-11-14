(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.mainCtrl', mainController);

    //Main controller
    function mainController($log, $rootScope, $scope, playersService, eloService, schedulerService){

        var numPlayers = 100;
        var initialNumRounds = 9;

        //First of all, we wil generate application players
        playersService.generatePlayers(numPlayers);

        //For gather data fast, we will make some rounds
        for(var i = 0; i < initialNumRounds; i++) {
            eloService.doARound();
        }

        //Start the automatic rounds...
        eloService.start();


        //Default active menu
        $rootScope.activeMenu = 'home';

        //Helps to each controller set up the nav menu accordly
        $rootScope.setActiveMenu = function(menuItem) {
              $rootScope.activeMenu = menuItem;
        };

    };

})(angular);