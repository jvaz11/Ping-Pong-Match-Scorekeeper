angular.module('pingPong', ['firebase', 'ngTouch'])
    .controller('mainCtrl', ['$scope', '$firebase', '$window', '$timeout', '$http', '$firebaseArray', '$firebaseObject', function($scope, $firebase, $window, $timeout, $http, $firebaseArray, $firebaseObject) {
        // 3-way binding of a single "match" object from Firebase   
        var match = new Firebase("https://pingpongscore.firebaseio.com/match");
        var match = $firebaseObject(match);
        match.$bindTo($scope, "match");
        $scope.match = match;

        // Resets the state of the match to allow new players to play
        $scope.newGame = function() {
            $scope.match = {
                matchInSession: true,
                awaitingPlayers: false,
                combinedScore: 0,
                players: [{
                    name: "Player A",
                    isCurrentServer: true,
                    score: 0
                }, {
                    name: "Player B",
                    isCurrentServer: false,
                    score: 0
                }]
            };
        };
        // Adds a point to the corresponding player
        $scope.addNewPoint = function(player) {
            if (player.score >= 20 && $scope.match.matchInSession === true) {
                player.score = 21;
                player.isWinner = true;
                $scope.match.mostRecentVictor = player.name;
                $scope.gameOver();
            } else if ($scope.match.matchInSession === true) {
                player.score++;
                $scope.match.combinedScore++;
                // Switches the server every 5 rounds
                // Todo: when a player reaches 20 points, the other player will serve until they tie or the game ends 
                if ($scope.match.combinedScore % 5 === 0) {
                    if ($scope.match.players[0].isCurrentServer === true) {
                        $scope.match.players[0].isCurrentServer = false;
                        $scope.match.players[1].isCurrentServer = true;
                    } else {
                        $scope.match.players[0].isCurrentServer = true;
                        $scope.match.players[1].isCurrentServer = false;
                    }
                };
            }
        };

        // Show the victor for five seconds before inviting new players to start a match        
        $scope.gameOver = function() {
            $scope.match.matchInSession = false;
            if ($scope.match.awaitingPlayers === false) {
                $scope.match.showRecap = true;
            }
            $timeout(function() {
                $scope.match.matchInSession === false;

                $scope.match.showRecap = false;

                $scope.match.awaitingPlayers = true;
            }, 5000);
        };
    }]);

// Main goal for v2: refactor controller logic into services+factories d to allow instances of matches to be created, recorded and recalled. 

// Possible cool features for future versions: in-office leaderboard, winning streaks, memory of past
// matches between two players (ie: it could teasingly remind a player how often they've lost against 
// a certain player, and likewise congratulate frequent champions on their skills