angular.module('reg')
    .controller('VoteCtrl', [
        '$scope',
        'UserService',
        'VoteService',
        'TeamService',
        'SettingsService',
        function ($scope, UserService, VoteService, TeamService, SettingsService) {


            $scope.ready = false;
            $scope.canVote = false;
            $scope.teams = [];
            $scope.votedForTeamName = '';
            $scope.settings = {};
            $scope.selectedTeam = {};
            loadVotes();

            $scope.castVote = castVote;


            function setTeamName() {

            }

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

            function castVote() {
                VoteService.castVote($scope.selectedTeam.id).then(function () {
                    $scope.canVote = false;
                    swal("Thank you for voting!", '', "success");
                    loadVotes();
                });
            }

            function loadVotes() {

                UserService.getCurrentUser().then(function (res) {


                    if (res.data.votedTeamId && res.data.votedTeamId.length > 0) {
                        $scope.ready = true;
                        $scope.canVote = false;
                        TeamService.get(res.data.votedTeamId).then(function(team){
                            $scope.votedForTeamName = team.data.name;
                        });
                    } else {
                        $scope.canVote = true;
                    }


                    SettingsService.getPublicSettings().then(function (settings) {
                        $scope.settings = settings.data;

                        if ($scope.settings.showVoteResults) {

                            VoteService.getVoteCount().then(function (teams) {
                                $scope.canVote = false;
                                $scope.ready = true;
                                $scope.teams = teams.data;
                                buildFuckingStupidSemanticUiProgressBar();
                            });


                        } else if ($scope.settings.votingEnabled) {
                            VoteService.getAllTeamsEligibleForVote().then(function (teams) {
                                $scope.ready = true;
                                $scope.teams = teams.data;
                            });
                        }


                    });


                });


            }
        }]);
