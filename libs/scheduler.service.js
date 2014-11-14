(function(ng){

    var module = ng.module('ngScheduler', []);

    module.service('schedulerService', schedulerService);

    function schedulerService($log, $interval) {

        // Service DATA
        // -------------------------------------------------------------------------------------------------------------

        var innerQueue = [];
        var intervalTime = 1000;

        // PUBLIC Interface
        // -------------------------------------------------------------------------------------------------------------

        //Schedule a function that will be executed one time
        this.scheduleOnce = function(fn, seconds) {

            var dateWhenWillBeExecuted = new Date(now() + (seconds * 1000));

            var queueItm = {
                dateTimestamp : dateWhenWillBeExecuted.getTime(),
                fn : fn,
                loop: false
            };

            innerQueue.push(queueItm);

            return dateWhenWillBeExecuted;
        };

        //Schedule a function that will be executed each loopTime seconds
        this.schedule = function(fn, loopTime, start, nextCallTimeFn) {

            if(start == undefined) start = 0;

            var dateWhenWillBeExecuted = new Date(now() + (start * 1000));

            var queueItm = {
                dateTimestamp : dateWhenWillBeExecuted.getTime(),
                fn : fn,
                loop: true,
                loopTime: loopTime * 1000,
                nextTimeCallback: nextCallTimeFn
            };

            innerQueue.push(queueItm);

            return dateWhenWillBeExecuted;
        }


        // Private Fn
        // -------------------------------------------------------------------------------------------------------------


        //Tick function, will be executed in the interval
        function tick() {

            //No items on queue? dont do nothing
            if(innerQueue.length == 0) return;

            //First we need to sort the queue by date
            var sortFn = function(itm1, itm2) {
                return itm1.dateTimestamp - itm2.dateTimestamp;
            }

            innerQueue.sort(sortFn);

            var nowTs = now();
            //Variance we add the quarter of the intervalTime
            nowTs += intervalTime / 4;

            do
            {
                //Queue empty? break the loop
                if(innerQueue.length == 0) break;

                //Extract the first item
                var firstItem = innerQueue[0];

                //Must be executed later? we can exit
                if( firstItem.dateTimestamp > nowTs ) break;

                //Call the function
                firstItem.fn.call();

                //if we must loop the item
                if(firstItem.loop) {
                    var newItm = {
                        dateTimestamp : (new Date(now() + firstItem.loopTime)).getTime(),
                        fn : firstItem.fn,
                        loop: true,
                        loopTime: firstItem.loopTime,
                        nextTimeCallback : firstItem.nextTimeCallback
                    };

                    if(firstItem.nextTimeCallback) {
                        firstItem.nextTimeCallback(new Date(newItm.dateTimestamp));
                    }

                    innerQueue.push(newItm);
                }

                //Remove first element
                innerQueue.shift();
            }while(true);

        };

        //Returns now timestamp
        function now() {
            return (new Date()).getTime();
        }

        //Starts the service
        $interval(tick, intervalTime);
    };

})(angular);