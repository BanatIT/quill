angular.module('reg')
    .controller('VoteCtrl', [
        '$scope',
        'currentUser',
        'settings',
        'Utils',
        'UserService',
        'VoteService',
        'SettingsService',
        function ($scope, currentUser, settings, Utils, UserService, VoteService, SettingsService) {


            $scope.ready = false;
            $scope.canVote = false;
            $scope.teams = [];
            loadVotes();


            function loadVotes() {

                UserService.getCurrentUser().then(function (res) {

                    if (res.votedTeamId && res.votedTeamId.length > 0) {
                        $scope.ready = true;
                        $scope.canVote = false;
                    }

                    if($scope.canVote) {

                        SettingsService.getPublicSettings().then(function (settings) {
                            $scope.settings = settings;

                            if (settings.showVoteResults) {

                                VoteService.getVoteCount().then(function (teams) {
                                    $scope.canVote = true;
                                    $scope.ready = true;
                                    $scope.teams = teams;
                                });
                            } else if (settings.votingEnabled) {
                                VoteService.getAllTeamsEligibleForVote().then(function (teams) {
                                    $scope.canVote = true;
                                    $scope.ready = true;
                                    $scope.teams = teams;
                                });
                            }


                        });

                    }

                });


            }
        }]);
