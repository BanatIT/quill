angular.module('reg')
  .controller('SidebarCtrl', [
    '$rootScope',
    '$scope',
    'Utils',
    'AuthService',
    'Session',
    'EVENT_INFO',
    'SettingsService',
    function($rootScope, $scope, Utils, AuthService, Session, EVENT_INFO,SettingsService){

      var user = $rootScope.currentUser;
      $scope.settings = {};

      $scope.EVENT_INFO = EVENT_INFO;

      $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      SettingsService.getPublicSettings().then(function (settings) {
          $scope.settings = settings.data;
      });
      $scope.logout = function(){
        AuthService.logout();
      };

      $scope.showSidebar = false;
      $scope.toggleSidebar = function(){
        $scope.showSidebar = !$scope.showSidebar;
      };

      // oh god jQuery hack
      $('.item').on('click', function(){
        $scope.showSidebar = false;
      });

    }]);
