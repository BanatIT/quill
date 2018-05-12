angular.module('reg')
    .controller('VoteCtrl', [
        '$scope',
        'currentUser',
        'settings',
        'Utils',
        'UserService',
        'VoteService',
        'TEAM',
        function ($scope, currentUser, settings, Utils, UserService, VoteService, TEAM) {


            $scope.ready = false;
            $scope.canVote = false;
            $scope.teams = [];
            loadVotes();


            function loadVotes() {

                UserService.getCurrentUser().then(function (res) {
                    console.log(res);
                    if (res.votedForTeamId && res.votedForTeamId.length > 0) {
                        $scope.ready = true;
                        $scope.canVote = false;
                    }
                    VoteService.getAllTeamsEligibleForVote().then(function (teams) {
                        console.log(teams);
                        $scope.canVote = true;
                        $scope.ready = true;
                        $scope.teams = teams;
                    });

                });


            }
        }]);
