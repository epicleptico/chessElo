(function(ng, chance, jQuery, google){

    var mainApp = ng.module('mainApp', [
        'ngRoute',
        'ngSiwebClock',
        'ngScheduler',
        'googlechart',
        'mainApp.config'
    ]);

    mainApp.constant('chance', chance);
    mainApp.constant('jQuery', jQuery);
    mainApp.constant('google', google);

    //Initial config
    mainApp.config(function($configProvider){
        $configProvider.setTimeBetweenRounds(60);
        $configProvider.setNumPlayers(1000);
        $configProvider.setInitialNumRounds(9);
    });

    //ROUTES
    mainApp.config(function($routeProvider){

        //Index route data
        var indexRouteData = {
            templateUrl: 'app/templates/index.html',
            controller: 'mainApp.homeCtrl'
        };

        //All rounds view data
        var roundsViewAllRouteData = {
            templateUrl: 'app/templates/rounds.list.html',
            controller: 'mainApp.rounds.listCtrl'
        };

        //Show round route data
        var roundShowRouteData = {
            templateUrl: 'app/templates/round.show.html',
            controller: 'mainApp.rounds.showCtrl',
            resolve: {
                round: function($route, eloService) {
                    return eloService.getRound($route.current.params.roundId);
                }
            }
        };

        //Show match route data
        var matchShowRouteData = {
            templateUrl: 'app/templates/match.show.html',
            controller: 'mainApp.matchCtrl',
            resolve: {
                match: function($route, eloService) {
                    return eloService.getMatch($route.current.params.matchId);
                }
            }
        };

        //Show all players route data
        var playersViewAllRouteData = {
            templateUrl: 'app/templates/players.list.html',
            controller: 'mainApp.players.listCtrl',
            resolve: {}
        };

        var playerShowRouteData = {
            template: '<h2>Show player</h2>'
        }

        var notFoundRouteData = {
            template: '<h2>Not found</h2>'
        };


        $routeProvider
            .when('/', indexRouteData)
            .when('/players', playersViewAllRouteData)
            .when('/player/:playerId', playerShowRouteData)
            .when('/rounds', roundsViewAllRouteData)
            .when('/round/:roundId', roundShowRouteData)
            .when('/match/:matchId', matchShowRouteData)
            .otherwise(notFoundRouteData);

    });
})(angular, chance, jQuery, google);