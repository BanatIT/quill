angular.module('reg')
    .controller('AllHelpCtrl', [
        '$scope',
        'QuestionService',
        function ($scope, QuestionService) {

            $scope.questions = [];

            console.log('get all help questions');
            QuestionService.all().then(function (res) {
                $scope.questions = res.data;
            });


        }]);
