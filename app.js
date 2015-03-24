angular.module('pingPong', ['firebase'])
    .controller('mainCtrl', ['$scope', '$firebase', '$window', '$timeout', '$http', '$firebaseArray', '$firebaseObject', function($scope, $firebase, $window, $timeout, $http, $firebaseArray, $firebaseObject) {
        var players = new Firebase("https://pingpongscore.firebaseio.com/players");
        var players = $firebaseObject(players);

        // For three-way data bindings, bind it to the scope instead
        players.$bindTo($scope, "players");
        $scope.players = players;

        $scope.matchInSession = true;
        $scope.mostRecentVictory = {
            player: 'Player A'
        }
        $scope.addNewPoint = function(player) {
            if (player.score >= 20) {
                // player.score++;
                player.score = 21;
                player.isWinner = true;
                $scope.mostRecentVictory.player = player.name;
                $scope.gameOver();

            } else if ($scope.matchInSession === true) {
                player.score++;
                $scope.combinedScore++;
                if ($scope.combinedScore % 5 === 0) {
                    if ($scope.players[0].isCurrentServer === true) {
                        $scope.players[0].isCurrentServer = false;
                        $scope.players[1].isCurrentServer = true;
                    } else {
                        $scope.players[0].isCurrentServer = true;
                        $scope.players[1].isCurrentServer = false;
                    }
                };
            }
        };
        $scope.gameOver = function() {
            $scope.matchInSession = false;


        };
        $scope.newGame = function() {
            $scope.players = [{
                name: 'Player A',
                isCurrentServer: true,
                score: 0
            }, {
                name: 'Player B',
                isCurrentServer: false,
                score: 0
            }];
            $scope.matchInSession = true;
            $scope.combinedScore = 0;
        };
        $scope.combinedScore = 0;
        // $scope.combinedScore = function() {
        //     var count = 0;
        //     angular.forEach($scope.players, function(player) {
        //         count += player.score;
        //     });
        //     return count;
        // };
        $scope.archive = function() {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) $scope.todos.push(todo);
            });
        };
    }])
    .directive('stRatio', function() {
        return {
            link: function(scope, element, attr) {
                var ratio = +(attr.stRatio);

                element.css('width', ratio + '%');

            }
        };
    });