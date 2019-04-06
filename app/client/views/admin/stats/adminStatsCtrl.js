angular.module('reg')
    .controller('AdminStatsCtrl', [
        '$scope',
        'UserService',
        'VoteService',
        'TeamService',
        function ($scope, UserService, VoteService, TeamService) {

            $scope.teams = [];

            $scope.teamStats = {};
            $scope.usersWithNoTeam = [];

            TeamService.getAll().then(function (teams) {
                console.log(teams);
                $scope.teams = teams;
                UserService.getAll().then(function (users) {
                    console.log(users);
                    users.forEach(function (user) {
                        var matched = false;
                        for (var i = 0; i < $scope.teams.length; i++) {
                            var team = $scope.teams[i];
                            if (team._id === user.teamCode) {
                                matched = true;
                                if (!team.members) {
                                    team.members = [];
                                }
                                team.members.push(user.email + " (" + user.profile.name + ")");
                            }
                        }
                        if (!matched) {
                            $scope.usersWithNoTeam.push(user.email + " (" + user.profile.name + ")");
                        }
                    });
                });
            });

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
                console.log(JSON.stringify($scope.teams));
                buildFuckingStupidSemanticUiProgressBar();
            });


        }]);