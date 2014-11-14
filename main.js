(function(ng){

	

	var mainApp = ng.module('mainApp',[]);
	mainApp.controller('mainApp.mainCtrl', ['$log', '$scope', '$timeout', mainCtrlFn]);
	
	
	

	function mainCtrlFn($log, $scope, $timeout) {
	
		$scope.players = generatePlayers(50);
		$scope.currentMatch = undefined;
		$scope.matchNum = 0;
		$scope.matches = [];
		
		/* CORE
		 *************************************************************************************/
		 
		var coreTimeout = undefined;
	
		//Do a random match
		function doARandomMatch() {
			
			$scope.matchNum++;
			var match = {};
			
			match.playerA = retrieveARandomPlayer($scope.players);
			match.playerB = undefined;
			
			
			
			do {
				match.playerB = retrieveARandomPlayer($scope.players);
			} while(match.playerB.$$id == match.playerA.$$id);
			
			var qA = Math.pow(10, match.playerA.elo / 400);
			var qB = Math.pow(10, match.playerB.elo / 400);
			var eA = qA / (qA + qB);
			var eB = qB / (qA + qB);
			
			match.ePlayerA = {
				base : eA, 
				win : Math.round(32 * (1 - eA)),
				lose: Math.round(32 * (0 - eA)),
				withDraw: Math.round(32 * (0.5 - eA))
			};
			
			match.ePlayerB = {
				base : eB, 
				win : Math.round(32 * (1 - eB)),
				lose: Math.round(32 * (0 - eB)),
				withDraw: Math.round(32 * (0.5 - eB))
			};
			
			if(match.ePlayerA.win == 0) match.ePlayerA.win = 1;
			if(match.ePlayerB.win == 0) match.ePlayerB.win = 1;
			
			$scope.currentMatch = match;
			
			var randA = Math.random();
			var randB = Math.random();
			
			switch(true)
			{
				//Withdraws
				case (randA <= eA && randB <= eB) || (randA > eA && randB > eB): 
					match.result = 0.5;
					match.playerA.elo += match.ePlayerA.withDraw;
					match.playerB.elo += match.ePlayerB.withDraw;
					match.playerA.whites.withDraw++;
					match.playerB.blacks.withDraw++;
					break;
					
				//PlayerA wins	
				case randA <= eA:
					match.result = 1;
					match.playerA.elo += match.ePlayerA.win;
					match.playerB.elo += match.ePlayerB.lose;
					match.playerA.whites.won++;
					match.playerB.blacks.lost++;
					break;
					
				//PlayerB wins	
				case randB <= eB:
					match.result = 0;
					match.playerA.elo += match.ePlayerA.lose;
					match.playerB.elo += match.ePlayerB.win;
					match.playerA.whites.lost++;
					match.playerB.blacks.won++;
					break;
			}
			match.playerA.numMatches++;
			match.playerB.numMatches++;
			
			coreTimeout = $timeout(doARandomMatch, 50);
			
			sortPlayers();
		};
		
		function sortPlayers() {
			var players = $scope.players;
			
			var sortByFn = function(a, b) {
				return b.elo - a.elo;
			};
			
			$scope.sortedPlayers =  players.sort(sortByFn);
		};
		
		
		doARandomMatch();
		/* PRIVATE
		 *************************************************************************************/
		 
		//Generate a random value
		function rand(minValue, maxValue) {
			return Math.floor((Math.random() * maxValue) + minValue);
		};
		
		//Will generate n players with 1500 ELO
		function generatePlayers(num){
			
			var players = [];
			
			for(var i = 0; i < num; i++) {
				var player = {
					name :  chance.name({ middle: true}),
					elo: 1500,
					$$id: i + 1 ,
					numMatches: 0,
					whites: {
						won: 0,
						lost: 0,
						withDraw: 0
					},
					blacks: {
						won: 0,
						lost: 0,
						withDraw: 0
					}
					
				};
				
				players.push(player);
			};
		
			return players;
		}

		//Retrieves a random player
		function retrieveARandomPlayer(players) {
			return players[rand(0, players.length)]; 
		}
			
	};
})(angular);