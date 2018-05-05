angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function($scope, currentUser, settings, Utils, UserService, TeamService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      $scope.teams = []

      TeamService.getAll().success(function(tems){
        $scope.teams = tems;
        console.log('tems',$scope.teams);
      }).error(function(res){
        $scope.error = res.message;
      });

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .success(function(users){
            $scope.error = null;
            $scope.teammates = users;
          });
      }

      function _getTeam() {
        TeamService.get($scope.user.teamCode)
          .success(function(team){
            $scope.user.teamCode
            $scope.team = team;
          }).error(function(err){
          $scope.error = err.message;
        });
      }

      if ($scope.user.teamCode){
        _getTeam();
        _populateTeammates();
      }

      $scope.joinTeam = function(teamId){
        UserService
          .joinOrCreateTeam(teamId)
          .success(function(user){
            $scope.error = null;
            $scope.user = user;
            _getTeam();
            _populateTeammates();
          })
          .error(function(res){
            $scope.error = res.message;
          });
      };

      $scope.createTeam = function(){
        TeamService.createTeam($scope.team)
          .success(function(team){
            $scope.error = null;
            $scope.team = team;
            $scope.user.teamCode = team._id;
          })
          .error(function(err){
            $scope.error = err.message;
          })
      };

      // $scope.get

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .success(function(user){
            $scope.error = null;
            $scope.user = user;
            $scope.teammates = [];
            $scope.team = {};
          })
          .error(function(res){
            $scope.error = res.data.message;
          });
      };

    }]);
