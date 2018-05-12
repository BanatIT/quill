angular.module('reg')
    .controller('VoteCtrl', [
        '$scope',
        'UserService',
        'VoteService',
        'SettingsService',
        function ($scope, UserService, VoteService, SettingsService) {


            $scope.ready = false;
            $scope.canVote = false;
            $scope.teams = [];
            $scope.settings = {};
            $scope.selectedTeam = {};
            loadVotes();

            $scope.castVote = castVote;

            function castVote() {
                VoteService.castVote($scope.selectedTeam.id).then(function () {
                    $scope.canVote = false;
                    swal("Thank you for voting!", '', "success");
                });
            }

            function loadVotes() {

                UserService.getCurrentUser().then(function (res) {


                    if (res.data.votedTeamId && res.data.votedTeamId.length > 0) {
                        $scope.ready = true;
                        $scope.canVote = false;
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
                            });

                            var interval = setInterval(function () {
                                var elements = $('.vote-score');
                                if (elements.length === $scope.teams.length) {
                                    $('.vote-score').progress();
                                    setTimeout(function(){
                                        $('.vote-score').progress();
                                    },100);
                                    clearInterval(interval);
                                }
                            }, 250);


                        } else if ($scope.settings.votingEnabled) {
                            VoteService.getAllTeamsEligibleForVote().then(function (teams) {
                                $scope.canVote = true;
                                $scope.ready = true;
                                $scope.teams = teams.data;
                            });
                        }


                    });


                });


            }
        }]);
