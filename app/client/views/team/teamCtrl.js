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
      //constants
      var participantType = ['Full Ticket', 'Student Ticket', 'Junior League Ticket'];

      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      $scope.teams = [];

      $scope.isOwner = false;
      $scope.isParticipant =true;


      function _getAll(){
        TeamService.getAll().success(function(teams){
          $scope.teams = teams;
          console.log(teams);
        }).error(function(res){
          $scope.error = res.message;
        });
      };
      _getAll();

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .success(function(users){
            $scope.error = null;
            $scope.teammates = users;
          });
      };

      function _getTeam() {
        TeamService.get($scope.user.teamCode)
          .success(function(team){
            $scope.team = team;
            $scope.isOwner = $scope.user._id === team.owner;
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
          .success(function(response){
            $scope.error = null;
            $scope.team = response.team;
            $scope.user.teamCode = response.team._id;
            $scope.isOwner = true;
            _populateTeammates();
            _getAll();
          })
          .error(function(err){
            $scope.error = err.message;
          })
      };

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .success(function(user){
            $scope.error = null;
            $scope.user = user;
            $scope.teammates = [];
            $scope.team = {};
          })
          .error(function(err){
            $scope.error = err.message;
          });
      };

      $scope.deleteTeam = function () {
        TeamService.deteleTeam($scope.user.teamCode)
          .success(function(){
            $scope.error = null;
            $scope.user.teamCode = null;
            $scope.teammates = [];
            $scope.team = {};
            _getAll();
          })
          .error(function(err){
            $scope.error = err.message;
          })
        ;
      };

      $scope.updateTeam = function (){
        TeamService.updateTeam($scope.team)
          .success(function(team){
            $scope.team = team;
          })
          .error(function(err){
            $scope.error =  err.message;
          })

      };

    }]);
