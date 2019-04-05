angular.module('reg')
    .controller('HelpCtrl', [
        '$scope',
        'UserService',
        'VoteService',
        'TeamService',
        'SettingsService',
        function ($scope, UserService, VoteService, TeamService, SettingsService) {


            $scope.ready = true;
        }]);
