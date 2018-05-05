angular.module('reg')
    .controller('AdminNotificationsCtrl',[
        '$scope',
        'NotificationService',
        function($scope, NotificationService){

            $scope.notifications = [];

            populate();

            function populate() {
                NotificationService
                    .getAll()
                    .success(function (notifications) {
                        $scope.notifications = notifications;
                    });
            }
            $scope.createNotification = function(){


                    if(!$scope.notification.title) {
                        swal("You forgot something!", successText, "error");
                    }else {
                        var title = $scope.notification.title;
                        var description = $scope.notification.description;
                        NotificationService
                            .createNotification(title, description)
                            .success(function (notification) {
                                populate();
                                swal("Looks good!", "Notification added", "success");
                            });
                    }
            };
            
            $scope.fromNow = function(date){
                return moment(date).fromNow();
            };
        }]);