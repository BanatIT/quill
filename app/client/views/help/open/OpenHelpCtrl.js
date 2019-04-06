angular.module('reg')
    .controller('OpenHelpCtrl', [
        '$scope',
        'QuestionService',
        function ($scope, QuestionService) {

            $scope.questions = [];
            $scope.ready = false;

            loadQuestions();

            $scope.mark = function (question) {
                QuestionService.mark(question._id).then(function (res) {
                    console.log('marked question as approved', res);
                    loadQuestions();
                });
            };

            function loadQuestions() {
                QuestionService.open().then(function (res) {
                    $scope.questions = res.data;
                    $scope.ready = true;
                });
            }


        }]);
