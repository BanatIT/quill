angular.module('reg')
    .controller('MyHelpCtrl', [
        '$scope',
        'QuestionService',
        function ($scope, QuestionService) {


            $scope.help = '';
            $scope.questions = [];

            QuestionService.mine().then(function (res) {
                $scope.questions = res;
            });

            $scope.submitQuestion = function () {

            }

        }]);
