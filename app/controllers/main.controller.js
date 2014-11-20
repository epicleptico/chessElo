(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.controller('mainApp.mainCtrl', mainController);

    //Main controller
    function mainController($log, $rootScope, $config, $scope, playersService, eloService, schedulerService){

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