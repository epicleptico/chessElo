(function(ng){

    var mainApp = ng.module('mainApp');

    mainApp.directive('matchesGraph', matchesGraph);

    function matchesGraph(){
        return {
            restrict: 'E',
            template: '<div google-chart chart="chart" style="{{chart.cssStyle}}"/>',
            controller: function($log, $scope, playersService, eloService){

                //Hold the chart
                $scope.chart = {
                    type: 'PieChart',
                    cssStyle: 'height: 400px',
                    data: {
                        cols: [
                            {id:'wins', label: 't', type: 'string'},
                            {id:'v', label: 'v', type: 'number'}
                        ],
                        rows: []
                    },
                    options: {
                        title: "",
                        is3D: true
                    },
                    formatters: {}
                };

                var setUp = function(){

                    var results = {
                        blacks: {
                            win: 0,
                            lost: 0,
                            withDraw: 0
                        },
                        whites: {
                            win: 0,
                            lost: 0,
                            withDraw: 0
                        }
                    };

                    if($scope.roundId) {

                        var round = eloService.getRound($scope.roundId)

                        $scope.chart.options.title = 'Results for round: ' + $scope.roundId;

                        for(var j = 0; j < round.matches.length; j++) {
                            var match = round.matches[j];

                            switch(match.result) {
                                case 1:
                                    results.whites.win++;
                                    results.blacks.lost++;
                                    break;
                                case 0:
                                    results.blacks.win++;
                                    results.whites.lost++;
                                    break;
                                case 0.5:
                                    results.blacks.withDraw++;
                                    results.whites.withDraw++;
                                    break;
                            }
                        }
                    }else {
                        $scope.chart.options.title = 'All results';

                        var allRounds = eloService.getAllRounds();
                        for(var i = 0; i < allRounds.length; i++) {
                            for(var j = 0; j < allRounds[i].matches.length; j++) {
                                var match = allRounds[i].matches[j];

                                switch(match.result) {
                                    case 1:
                                        results.whites.win++;
                                        results.blacks.lost++;
                                        break;
                                    case 0:
                                        results.blacks.win++;
                                        results.whites.lost++;
                                        break;
                                    case 0.5:
                                        results.blacks.withDraw++;
                                        results.whites.withDraw++;
                                        break;
                                }
                            }
                        }
                    }

                    //Set up rows
                    var rows = [
                        { c:[ {v: 'Blacks Win'}, {v: results.blacks.win}]},
                        { c:[ {v: 'Blacks WithDraw'}, {v: results.blacks.withDraw}]},
                        { c:[ {v: 'Blacks Lost'}, {v: results.blacks.lost}]},
                        { c:[ {v: 'Whites Lost'}, {v: results.whites.lost}]},
                        { c:[ {v: 'Whites WithDraw'}, {v: results.whites.withDraw}]},
                        { c:[ {v: 'Whites Win'}, {v: results.whites.win}]},
                    ];

                    $scope.chart.data.rows = rows;
                };

                setUp();

                $scope.$on('$eloServiceRoundFinished', setUp);
            },
            scope: {
                roundId : '=roundId'
            }
        }
    };

})(angular);