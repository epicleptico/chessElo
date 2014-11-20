(function(ng){

    var mainApp = ng.module('mainApp.config',[]);

    mainApp.provider('$config', $configProvider);

    //Config provider
    function $configProvider(){

        var timeBetweenRounds = 10;
        var numPlayers = 100;
        var initialNumRounds = 9;

        this.setTimeBetweenRounds = function(value) {
            timeBetweenRounds = value;
        };

        this.setNumPlayers = function(value) {
            numPlayers = value;
        };

        this.setInitialNumRounds = function(value) {
            initialNumRounds = value;
        };

        //When we get an instance of the provider
        this.$get = function(){

            //Return obj
            return new function() {
                this.getTimeBetweenRounds = function(){ return timeBetweenRounds; };
                this.getNumPlayers = function(){ return numPlayers; };
                this.getInitialNumRounds = function(){ return initialNumRounds; };
            };
        };
    };

})(angular);