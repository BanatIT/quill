angular.module('reg')
    .controller('MyHelpCtrl', [
        '$scope',
        'QuestionService',
        function ($scope, QuestionService) {


            $scope.help = '';
            $scope.questions = [];
            $scope.ready = false;

            console.log('get my help questions');


            $scope.submitQuestion = function () {
                if ($scope.help && $scope.help.length > 0) {
                    QuestionService.create($scope.help).then(function (res) {
                        console.log('created new question', res);
                        loadQuestions();
                    }, function errorCallback(response) {
                        if (response.status === 400) {
                            swal("Error!", "You can't have more than 3 open questions", "error");
                        } else {
                            swal("Error!", "Failed to post question", "error");
                        }
                    });
                } else {
                    swal("Error!", "Please enter some text first", "error");
                }
            };


            $scope.mark = function (question) {
                QuestionService.mark(question._id).then(function (res) {
                    console.log('marked question as approved', res);
                    loadQuestions();
                });
            };

            loadQuestions();

            function loadQuestions() {
                QuestionService.mine().then(function (res) {
                    $scope.questions = res.data;
                    $scope.ready = true;
                    console.log('got questions', res);
                });
            }

        }]);
