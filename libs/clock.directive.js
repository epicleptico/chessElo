(function(ng, jQuery, moment){

    var module = ng.module('ngSiwebClock', [
        'ui.bootstrap',
    ]);

    module.constant('jQuery', jQuery);
    module.constant('moment', moment);


    module.directive('ngSiwebClockCount',['$log', 'jQuery', '$interval', clockCount]);
    module.directive('ngSiwebClock',['$log', 'jQuery', '$interval', '$compile', '$modal', 'moment', clock]);

    /**
     * Writes a clock inside an element
     *
     * Usage: <div data-ng-siweb-clock-count="now"></div>
     *
     * Expects: scope variable with a dateTime
     *
     * Result:
     * <div data-ng-siweb-clock="now">
     *   <span class="clock-container">
     *     <span class="clock-countdown"></span>
     *     <span class="clock-days clock-2">2</span>
     *     <span class="clock-space-separator"> </span>
     *     <span class="clock-hours clock-13">13</span>
     *     <span class="clock-colon-separator">:</span>
     *     <span class="clock-minutes clock-45">45</span>
     *     <span class="clock-colon-separator">:</span>
     *     <span class="clock-seconds clock-02">02</span>
     *   </span>
     * </div>
     *
     *
     *  Notes:
     *  - clock-days and clock-space-separator are only visible when we have more than one day
     *  - each clock have a class like clock-11 or clock-22 the format is clock-{value}
     *  - span.countdown are only setted if clock is in countdown mode
     *
     * @param $log
     * @param jQuery
     * @param $interval
     * @returns {{restrict: string, link: Function, scope: {date: string}}}
     */
    function clockCount($log, jQuery, $interval) {

        var clockDiv = function(interval) {

            var clockDiv = jQuery('<span></span>').addClass('clock-container');

            var spaceSeparator = jQuery('<span></span>').text(' ').addClass('clock-space-separator');
            var colonSeparator = jQuery('<span></span>').text(':').addClass('clock-colon-separator');

            //If we are in countdown mode
            if (interval.countdown) {
                jQuery('<span></span>')
                    .addClass('clock-countdown')
                    .appendTo(clockDiv);
            }

            if(interval.days > 0 ){
                jQuery('<span></span>')
                    .text(interval.days)
                    .addClass('clock-days')
                    .addClass('clock-' + interval.days)
                    .appendTo(clockDiv);

                clockDiv.append(spaceSeparator.clone());
            }

            jQuery('<span></span>')
                .text(('0' + interval.hours).slice(-2))
                .addClass('clock-hours')
                .addClass('clock-' + ('0' + interval.hours).slice(-2))
                .appendTo(clockDiv);

            clockDiv.append(colonSeparator.clone());

            jQuery('<span></span>')
                .text(('0' + interval.minutes).slice(-2))
                .addClass('clock-minutes')
                .addClass('clock-' + ('0' + interval.minutes).slice(-2))
                .appendTo(clockDiv);

            clockDiv.append(colonSeparator.clone());

            jQuery('<span></span>')
                .text(('0' + interval.seconds).slice(-2))
                .addClass('clock-seconds')
                .addClass('clock-' + ('0' + interval.seconds).slice(-2))
                .appendTo(clockDiv);


            return clockDiv;

        };

        //Format function
        var dateInterval = function(seconds) {

            var countdown = false;
            //If we have negative time (Aka countdown)
            if (seconds < 0) {
                seconds = seconds * -1;
                countdown = true;
            }

            var interval = {};
            interval.seconds = seconds % 60;
            interval.minutes = Math.floor(seconds / 60);
            interval.hours = Math.floor(interval.minutes / 60);
            interval.days = Math.floor(interval.hours / 24);

            interval.minutes = interval.minutes % 60;
            interval.hours = interval.hours % 24;
            interval.countdown = countdown;

            return interval;
        };


        //Link function
        var linkFn = function($scope, elem, attrs) {

            var jElement = jQuery(elem);

            var setClockTime = function() {

                if (!$scope.date || !$scope.date.getTime) {
                    jElement.text('');
                    return;
                }

                //first of all, get actual date
                var now_timestamp = (new Date()).getTime();
                var from_timestamp = $scope.date.getTime();


                //We extract the seconds...
                var seconds = Math.floor((now_timestamp - from_timestamp) / 1000);

                jElement.empty().append(clockDiv(dateInterval(seconds)))
            };


            setClockTime();

            $interval(setClockTime, 1000);

            $scope.$watch('date', setClockTime);

        };


        return {
            restrict: 'A',
            link: linkFn,
            scope: {
                date : '=ngSiwebClockCount'
            }
        };
    };

    /**
     * Writes an application clock
     *
     * Usage: <ng-siweb-clock></ng-siweb-clock>
     *
     *
     * Result:
     * <ng-siweb-clock class="ng-isolate-scope">
     *     <span class="clock-container">
     *         <span class="clock-hours clock-08">08</span>
     *         <span class="clock-colon-separator">:</span>
     *         <span class="clock-minutes clock-43">43</span>
     *         <span class="clock-colon-separator">:</span>
     *         <span class="clock-seconds clock-03">03</span>
     *    </span>
     * </ng-siweb-clock>
     *
     *
     * Notes:
     *  - each clock have a class like clock-11 or clock-22 the format is clock-{value}
     *
     * @param $log
     *
     * Usage:
     * @param jQuery
     * @param $interval
     */
    function clock($log, jQuery, $interval, $compile, $modal, moment)  {

        /**
         * This function will print the div
         * @param date
         * @returns {*}
         */
        var clockDiv = function(moment) {

            var clockDiv = jQuery('<span></span>').addClass('clock-container');

            var spaceSeparator = jQuery('<span></span>').text(' ').addClass('clock-space-separator');
            var colonSeparator = jQuery('<span></span>').text(':').addClass('clock-colon-separator');


            jQuery('<span></span>')
                .text(('0' + moment.hours()).slice(-2))
                .addClass('clock-hours')
                .addClass('clock-' + ('0' + moment.hours()).slice(-2))
                .appendTo(clockDiv);

            clockDiv.append(colonSeparator.clone());

            jQuery('<span></span>')
                .text(('0' + moment.minutes()).slice(-2))
                .addClass('clock-minutes')
                .addClass('clock-' + ('0' + moment.minutes()).slice(-2))
                .appendTo(clockDiv);

            clockDiv.append(colonSeparator.clone());

            jQuery('<span></span>')
                .text(('0' + moment.seconds()).slice(-2))
                .addClass('clock-seconds')
                .addClass('clock-' + ('0' + moment.seconds()).slice(-2))
                .appendTo(clockDiv);


            return clockDiv;
        };

        /**
         * Shos modal for select timezone
         * @param $scope
         */
        var showModalSelectTimeZone = function($scope) {

            var modaltemplate = [
                "<div class='modal-header'>",
                "</div><!-- /.modal-header -->",

                "<div class='modal-body'>",
                    "<div class='row'>",
                        "<div class='col-md-12'>",
                            "<select ng-model='zoneSelected' ng-options='zone for zone in zones' chosen> ",
                            "<pre>{{ zoneSelected ]}</pre>",
                        "</div>",
                    "</div>",
                "</div><!-- /.modal-body -->",

                "<div class='modal-footer'>",
                    "<input type='submit' class='btn btn-primary pull-right' tabindex='2' value='Submit' ng-click='ok(zoneSelected)'/>",
                "</div><!-- /.modal-footer -->",
            ].join('');


            var modalResult = $modal.open({
                template: modaltemplate,
                controller: function($log, $scope, moment, $modalInstance, currentTimeZone) {
                    $scope.zones = moment.tz.names();
                    $scope.zoneSelected = currentTimeZone;


                    $scope.ok = function(zoneSelected){
                        $modalInstance.close(zoneSelected);
                    };


                    $scope.cancel = function(){
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: '',
                resolve: {
                    currentTimeZone: function() {
                        return $scope.timeZone;
                    }
                }
            }).result;


            modalResult.then(function(timeZone){
                $scope.timeZone = timeZone;
            });

            modalResult.catch(function(){

            });
        };

        /**
         * Link Function
         * @param $scope
         * @param elem
         * @param attr
         */
        var linkFn = function($scope, elem, attr) {

            var jElement = jQuery(elem);
            $scope.timeZone = '';

            jElement.click(function(){
                showModalSelectTimeZone($scope);
            });


            $scope.currentTimeZone =  Intl.DateTimeFormat().resolved.timeZone;
            $scope.timeZone = $scope.currentTimeZone;

            $interval(function(){

                var current = new Date();
                current = current.getTime();

                var actualMoment = moment.tz(current, $scope.currentTimeZone);

                if ($scope.timeZone != $scope.currentTimeZone) {
                    actualMoment = actualMoment.clone().tz($scope.timeZone);
                }

                jElement.empty().append(clockDiv(actualMoment));

            },1000);
        };

        return {
            restrict: 'E',
            link: linkFn,
            scope: {}
        };
    };

})(angular, jQuery, moment);