(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.directive('timeToNextRound', timeToNextRound);

    function timeToNextRound(){
        return {
            restrict: 'E',
            templateUrl: 'app/templates/timeToNextRound.directive.html',
            controller: function($scope, eloService, $interval) {

                var setUp = function(){
                    $scope.nextRoundTime = eloService.getNextRoundTime();
                    $scope.now = eloService.getLastRoundTime();
                };

                setUp();

                $scope.$on('$eloServiceRoundFinished', setUp);

                $interval(function(){

                    if(!$scope.nextRoundTime || !$scope.now) {
                        return;
                    }

                    var initialValue = $scope.now.getTime();
                    var endValue = $scope.nextRoundTime.getTime();
                    var actualValue = (new Date()).getTime();

                    //We rest initialValue to endValue and actualValue
                    endValue -= initialValue;
                    actualValue -= initialValue;



                    $scope.barPercent = actualValue * 100 / endValue;
                }, 500);
            }
        }
    };

})(angular);