angular.module('reg')
  .controller('FAQCtrl', [
      '$scope',
      '$rootScope',
      '$state',
      '$http',
      function($scope, $rootScope, $state, $http){

        populateFAQ();

        function populateFAQ(){
            $http
                .get('/assets/faq.json')
                .then(function(res){
                    $scope.faqList = res.data;
                });

        }
    }]);
