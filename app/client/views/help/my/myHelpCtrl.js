angular.module('reg')
    .controller('MyHelpCtrl', [
        '$scope',
        'QuestionService',
        function ($scope, QuestionService) {


            $scope.help = '';
            $scope.questions = [];

            console.log('get my help questions');


            $scope.submitQuestion = function () {
                if ($scope.help && $scope.help.length > 0) {
                    QuestionService.create($scope.help).then(function (res) {
                        console.log('created new question', res);
                        loadQuestions();
                    });
                }
            };

            loadQuestions();

            function loadQuestions(){
                QuestionService.mine().then(function (res) {
                    $scope.questions = res.data;
                    console.log('got questions', res);
                });
            }

        }]);
