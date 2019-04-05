angular.module('reg')
    .controller('OpenHelpCtrl', [
        '$scope',
        'QuestionService',
        function ($scope, QuestionService) {

            $scope.questions = [];
            console.log('get open help questions');
            QuestionService.open().then(function (res) {
                $scope.questions = res;
            });


        }]);
