angular.module('reg')
    .controller('AdminStatsCtrl', [
        '$scope',
        'UserService',
        'VoteService',
        function ($scope, UserService, VoteService) {

            $scope.teams = [];

            UserService
                .getStats()
                .success(function (stats) {
                    $scope.stats = stats;
                    $scope.loading = false;
                });

            $scope.fromNow = function (date) {
                return moment(date).fromNow();
            };

            function buildFuckingStupidSemanticUiProgressBar() {
                var loops = 0;
                var interval = setInterval(function () {
                    var elements = $('.vote-score');
                    if (elements.length === $scope.teams.length) {
                        $('.vote-score').progress();
                        loops += 1;
                        if (loops > 3) {
                            clearInterval(interval);
                        }
                    }
                }, 250);
            }

            VoteService.getVoteCountAdmin().then(function (teams) {
                $scope.teams = teams.data;
                console.log($scope.teams);
                buildFuckingStupidSemanticUiProgressBar();
            });


        }]);