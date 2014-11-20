(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.mainCtrl', mainController);

    //Main controller
    function mainController($log, $rootScope, $config, $scope, playersService, eloService, schedulerService){

        var numPlayers = $config.getNumPlayers();
        var initialNumRounds = $config.getInitialNumRounds();

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