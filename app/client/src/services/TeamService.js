angular.module('reg')
  .factory('TeamService', [
    '$http',
    'Session',
    function($http, Session) {

      var users = '/api/teams';
      var base = users + '/';

      return {

        get: function(id){
          return $http.get(base + id);
        },

        getAll: function(){
          return $http.get(base);
        },

        createTeam: function(team){
          return $http.post(base, {
            team: team,
            userId: Session.getUserId()
          })
        }
      }
    }
  ]);