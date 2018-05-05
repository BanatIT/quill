angular.module('reg')
  .factory('NotificationService', [
  '$http',
  function($http){

    var base = '/api/notification/';

    return {
      createNotification: function(title, description) {
        return $http.put(base + 'create', {
          title: title,
          description: description
        });
      },
      getAll: function(){
        return $http.get(base);
      }
    };

  }
  ]);
