angular.module('reg')
    .controller('AllHelpCtrl', [
        'QuestionService',
        function ($scope, QuestionService) {

            $scope.questions = [];

            QuestionService.all().then(function (res) {
                $scope.questions = res;
            });


        }]);
