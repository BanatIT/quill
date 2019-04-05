angular.module('reg')
    .controller('OpenHelpCtrl', [
        'QuestionService',
        function ($scope, QuestionService) {

            $scope.questions = [];

            QuestionService.open().then(function (res) {
                $scope.questions = res;
            });


        }]);
